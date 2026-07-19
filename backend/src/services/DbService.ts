import * as admin from "firebase-admin";

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

  constructor() {
    this.init();
  }

  private init() {
    const serviceAccountVar = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    if (serviceAccountVar) {
      try {
        const serviceAccount = JSON.parse(serviceAccountVar);
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
        this.db = admin.firestore();
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
      list.push(mint);
      this.memoryPendingMints.set(usernameLower, list);
      return;
    }
    const docId = `${mint.repo.replace("/", "-")}-${mint.prNumber}`;
    await this.db.collection("pendingMints").doc(docId).set(mint);
  }

  async deletePendingMints(githubUsername: string): Promise<void> {
    const usernameLower = githubUsername.toLowerCase();
    if (this.isFallback) {
      this.memoryPendingMints.delete(usernameLower);
      return;
    }
    const snapshot = await this.db
      .collection("pendingMints")
      .where("githubUsername", "==", usernameLower)
      .get();

    const batch = this.db.batch();
    snapshot.forEach((doc: any) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
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
