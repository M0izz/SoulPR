import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

export interface WalletLink {
  githubUsername: string;
  walletAddress: string;
  linkedAt: string;
}

export interface PendingMint {
  repo: string;
  prNumber: number;
  prTitle: string;
  githubUsername: string;
  mergeTimestamp: number;
  commitSha: string;
  issuance?: IssuanceRecord;
}

export interface IssuanceRecord {
  status: "submitted" | "confirmed" | "failed";
  txHash?: string;
  issuerAccount?: string;
  contractId?: string;
  tokenId?: string;
  blockHeight?: number;
  retryCount: number;
  error?: string;
  updatedAt: string;
}

export interface TrackedRepos {
  installationId: string;
  repos: string[];
}

class DbService {
  private db: any = null;
  private isFallback = false;

  // In-memory fallback database for easy development and quick setup
  private memoryWalletLinks: Map<string, WalletLink> = new Map();
  private memoryPendingMints: Map<string, PendingMint[]> = new Map();
  private memoryTrackedRepos: Map<string, string[]> = new Map();
  private memoryIssuances: Map<string, IssuanceRecord> = new Map();

  constructor() {
    this.init();
  }

  private init() {
    const serviceAccountVar = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    if (serviceAccountVar) {
      try {
        const serviceAccount = JSON.parse(serviceAccountVar);
        initializeApp({
          credential: cert(serviceAccount),
        });
        this.db = getFirestore();
        console.log("[DbService] Firebase Firestore initialized successfully");
      } catch (e: any) {
        console.error("[DbService] Error parsing FIREBASE_SERVICE_ACCOUNT_JSON, falling back to memory db:", e.message);
        this.isFallback = true;
      }
    } else {
      console.log("[DbService] FIREBASE_SERVICE_ACCOUNT_JSON not set — using in-memory database fallback");
      this.isFallback = true;
    }
  }

  // --- Wallet Links ---

  async getWalletLink(githubUsername: string): Promise<WalletLink | null> {
    const usernameLower = githubUsername.toLowerCase();
    if (this.isFallback) {
      return this.memoryWalletLinks.get(usernameLower) ?? null;
    }
    const doc = await this.db.collection("walletLinks").doc(usernameLower).get();
    return doc.exists ? (doc.data() as WalletLink) : null;
  }

  async saveWalletLink(githubUsername: string, walletAddress: string): Promise<WalletLink> {
    const usernameLower = githubUsername.toLowerCase();
    const link: WalletLink = {
      githubUsername: usernameLower,
      walletAddress: walletAddress.toLowerCase(),
      linkedAt: new Date().toISOString(),
    };

    if (this.isFallback) {
      this.memoryWalletLinks.set(usernameLower, link);
      return link;
    }

    await this.db.collection("walletLinks").doc(usernameLower).set(link);
    return link;
  }

  // --- Pending Mints ---

  async getPendingMints(githubUsername: string): Promise<PendingMint[]> {
    const usernameLower = githubUsername.toLowerCase();
    if (this.isFallback) {
      return this.memoryPendingMints.get(usernameLower) ?? [];
    }
    const snapshot = await this.db
      .collection("pendingMints")
      .where("githubUsername", "==", usernameLower)
      .get();
    
    const mints: PendingMint[] = [];
    snapshot.forEach((doc: any) => {
      mints.push(doc.data() as PendingMint);
    });
    return mints;
  }

  async addPendingMint(mint: PendingMint): Promise<void> {
    const usernameLower = mint.githubUsername.toLowerCase();
    if (this.isFallback) {
      const list = this.memoryPendingMints.get(usernameLower) ?? [];
      if (list.some((item) => item.repo === mint.repo && item.prNumber === mint.prNumber)) return;
      list.push(mint);
      this.memoryPendingMints.set(usernameLower, list);
      return;
    }
    await this.db.collection("pendingMints").doc(this.pendingMintDocId(mint)).set(mint);
  }

  private pendingMintDocId(mint: PendingMint) {
    return `${encodeURIComponent(mint.repo)}-${mint.prNumber}`;
  }

  private issuanceDocId(mint: Pick<PendingMint, "repo" | "prNumber" | "commitSha">) {
    return `${encodeURIComponent(mint.repo)}-${mint.prNumber}-${encodeURIComponent(mint.commitSha)}`;
  }

  async saveIssuance(mint: PendingMint, issuance: IssuanceRecord): Promise<void> {
    const id = this.issuanceDocId(mint);
    if (this.isFallback) {
      this.memoryIssuances.set(id, issuance);
      return;
    }
    await this.db.collection("issuances").doc(id).set({ ...issuance, ...mint }, { merge: true });
  }

  async getIssuance(mint: PendingMint): Promise<IssuanceRecord | null> {
    const id = this.issuanceDocId(mint);
    if (this.isFallback) return this.memoryIssuances.get(id) ?? null;
    const doc = await this.db.collection("issuances").doc(id).get();
    return doc.exists ? (doc.data() as IssuanceRecord) : null;
  }

  async deletePendingMints(githubUsername: string, processedMints?: PendingMint[]): Promise<void> {
    const usernameLower = githubUsername.toLowerCase();
    if (this.isFallback) {
      if (processedMints) {
        const processedIds = new Set(processedMints.map((mint) => `${mint.repo}-${mint.prNumber}`));
        const remaining = (this.memoryPendingMints.get(usernameLower) ?? []).filter(
          (mint) => !processedIds.has(`${mint.repo}-${mint.prNumber}`)
        );
        if (remaining.length > 0) this.memoryPendingMints.set(usernameLower, remaining);
        else this.memoryPendingMints.delete(usernameLower);
        return;
      }
      this.memoryPendingMints.delete(usernameLower);
      return;
    }
    if (processedMints) {
      const collection = this.db.collection("pendingMints");
      for (let offset = 0; offset < processedMints.length; offset += 500) {
        const batch = this.db.batch();
        for (const mint of processedMints.slice(offset, offset + 500)) {
          batch.delete(collection.doc(this.pendingMintDocId(mint)));
        }
        await batch.commit();
      }
      return;
    }

    const snapshot = await this.db
      .collection("pendingMints")
      .where("githubUsername", "==", usernameLower)
      .get();

    const docs = snapshot.docs as any[];
    for (let offset = 0; offset < docs.length; offset += 500) {
      const batch = this.db.batch();
      for (const doc of docs.slice(offset, offset + 500)) {
        batch.delete(doc.ref);
      }
      await batch.commit();
    }
  }

  async listPendingUsernames(): Promise<string[]> {
    if (this.isFallback) return Array.from(this.memoryPendingMints.keys());
    const snapshot = await this.db.collection("pendingMints").select("githubUsername").get();
    return Array.from(new Set(snapshot.docs.map((doc: any) => doc.get("githubUsername") as string)));
  }

  // --- Tracked Repositories ---

  async getTrackedRepos(installationId: string): Promise<string[]> {
    if (this.isFallback) {
      return this.memoryTrackedRepos.get(installationId) ?? [];
    }
    const doc = await this.db.collection("trackedRepos").doc(installationId).get();
    return doc.exists ? (doc.data() as { repos: string[] }).repos : [];
  }

  async saveTrackedRepos(installationId: string, repos: string[]): Promise<void> {
    if (this.isFallback) {
      this.memoryTrackedRepos.set(installationId, repos);
      return;
    }
    await this.db.collection("trackedRepos").doc(installationId).set({ repos });
  }
}

export const dbService = new DbService();
export default dbService;
