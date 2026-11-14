import { connect, KeyPair, transactions, utils, keyStores } from "near-api-js";
import { PublicKey } from "near-api-js/lib/utils";

/**
 * NearChainService — NEAR Protocol chain integration for SoulPR.
 *
 * Replaces the Monad/ethers ChainService. It signs and submits `mint`
 * (attest) transactions to a NEAR soulbound contract using the backend's
 * NEAR account (full-access key), and reads attestation state via view calls.
 *
 * Required env vars:
 *   NEAR_NODE_URL           e.g. https://rpc.testnet.near.org
 *   NEAR_NETWORK_ID         e.g. testnet
 *   NEAR_CONTRACT_ID        e.g. soulpr.testnet
 *   NEAR_BACKEND_ACCOUNT_ID e.g. soulpr-backend.testnet
 *   NEAR_BACKEND_PRIVATE_KEY ed25519 private key for the backend account
 */

export interface NearAttestInput {
  contributor: string;      // NEAR account id (e.g. alice.testnet)
  repo: string;             // "owner/name"
  prNumber: number;
  prTitle: string;
  githubUsername: string;
  mergeCommitSha: string;
  mergeTimestamp: number;   // Unix seconds
}

class NearChainService {
  private nearPromise: Promise<any> | null = null;
  private account: any = null;
  private contractId = "";
  private initialized = false;

  constructor() {
    this.init();
  }

  private init() {
    const nodeUrl =
      process.env.NEAR_NODE_URL ?? "https://rpc.testnet.near.org";
    const networkId = process.env.NEAR_NETWORK_ID ?? "testnet";
    const contractId = process.env.NEAR_CONTRACT_ID ?? "";
    const backendAccountId = process.env.NEAR_BACKEND_ACCOUNT_ID ?? "";
    const backendPrivateKey = process.env.NEAR_BACKEND_PRIVATE_KEY ?? "";

    this.contractId = contractId;

    if (!contractId || !backendAccountId || !backendPrivateKey) {
      console.warn(
        "[NearChainService] Missing NEAR configuration " +
          "(NEAR_CONTRACT_ID / NEAR_BACKEND_ACCOUNT_ID / NEAR_BACKEND_PRIVATE_KEY). " +
          "Attest transactions will fail until env vars are set.",
      );
      return;
    }

    try {
      const keyStore = new keyStores.InMemoryKeyStore();
      const keyPair = KeyPair.fromString(backendPrivateKey);
      keyStore.setKey(networkId, backendAccountId, keyPair);

      this.nearPromise = (async () => {
        const near = await connect({ nodeUrl, networkId, keyStore, headers: {} });
        this.account = await near.account(backendAccountId);
        this.initialized = true;
        console.log(
          `[NearChainService] Initialized NEAR minter ${backendAccountId} -> contract ${contractId} on ${networkId}`,
        );
      })();
    } catch (e: any) {
      console.error("[NearChainService] Initialization error:", e.message);
    }
  }

  private async ensureInitialized(): Promise<void> {
    if (this.nearPromise && !this.initialized) {
      await this.nearPromise;
    }
    if (!this.initialized || !this.account) {
      throw new Error(
        "NearChainService not properly initialized. Set NEAR_CONTRACT_ID, " +
          "NEAR_BACKEND_ACCOUNT_ID and NEAR_BACKEND_PRIVATE_KEY.",
      );
    }
  }

  /** Mint (attest) a soulbound contribution receipt on NEAR. Returns the transaction hash. */
  async attest(
    contributor: string,
    repo: string,
    prNumber: number,
    prTitle: string,
    githubUsername: string,
    mergeCommitSha: string,
    mergeTimestamp: number,
  ): Promise<string> {
    await this.ensureInitialized();

    const args = {
      contributor,
      repo,
      pr_number: prNumber,
      pr_title: prTitle,
      github_username: githubUsername,
      merge_commit_sha: mergeCommitSha,
      merge_timestamp: mergeTimestamp,
    };

    console.log(
      `[NearChainService] Submitting mint for ${contributor} - ${repo} #${prNumber}`,
    );

    const outcome = await this.account.signAndSendTransactions({
      receiverId: this.contractId,
      actions: [
        transactions.functionCall(
          "mint",
          args,
          "300000000000000", // 300 Tgas
          process.env.NEAR_MINT_STORAGE_DEPOSIT ?? "1250000000000000000000",
        ),
      ],
    });

    const txHash = this.extractTxHash(outcome);
    console.log(`[NearChainService] Mint submitted: ${txHash}`);
    return txHash;
  }

  /** Idempotency check: whether a contribution was already attested on-chain. */
  async isMinted(
    repo: string,
    prNumber: number,
    contributor: string,
    mergeCommitSha: string,
  ): Promise<boolean> {
    await this.ensureInitialized();

    const result: any = await this.account.viewFunction(this.contractId, "is_minted", {
      repo,
      pr_number: prNumber,
      contributor,
      merge_commit_sha: mergeCommitSha,
    });

    return result === true || result === "true" || result === 1;
  }

  /** Read the attestation record for a token id. */
  async nftToken(tokenId: string | number): Promise<any> {
    await this.ensureInitialized();
    return this.account.viewFunction(this.contractId, "nft_token", {
      token_id: Number(tokenId),
    });
  }

  /** List token ids owned by a NEAR account. */
  async nftTokensByOwner(owner: string): Promise<string[]> {
    await this.ensureInitialized();
    const result: any = await this.account.viewFunction(
      this.contractId,
      "nft_tokens_by_owner",
      { owner },
    );
    return Array.isArray(result) ? result.map(String) : [];
  }

  /** Bounded enumeration of all credentials (max 100 per call). */
  async nftTokensByOwnerStandard(
    owner: string,
    fromIndex: number = 0,
    limit: number = 50,
  ): Promise<any[]> {
    await this.ensureInitialized();
    const result: any = await this.account.viewFunction(
      this.contractId,
      "nft_tokens_by_owner_standard",
      {
        args: { account_id: owner, from_index: fromIndex, limit },
      },
    );
    return Array.isArray(result) ? result : [];
  }

  /** Total number of attestation tokens minted. */
  async nftTotalSupply(): Promise<number> {
    await this.ensureInitialized();
    const result: any = await this.account.viewFunction(
      this.contractId,
      "nft_total_supply",
      {},
    );
    return Number(result ?? 0);
  }

  private extractTxHash(outcome: any): string {
    try {
      const hash =
        outcome?.transaction?.transaction?.hash ??
        outcome?.transaction_hash ??
        outcome?.hash;
      if (hash == null) throw new Error("No transaction hash found in outcome");
      if (typeof hash === "string") return hash;
      if (Buffer.isBuffer(hash) || hash instanceof Uint8Array) {
        return Buffer.from(hash).toString("base64");
      }
      return String(hash);
    } catch {
      throw new Error("No transaction hash found in outcome");
    }
  }
  private extractTokenId(outcome: any): string | undefined {
    const value = outcome?.status?.SuccessValue;
    if (!value) return undefined;
    try {
      return String(Buffer.from(value, "base64").toString("utf8"));
    } catch {
      return undefined;
    }
  }

  private extractBlockHeight(outcome: any): number | undefined {
    const heights = [
      outcome?.transaction_outcome?.block_height,
      ...(outcome?.receipts_outcome ?? []).map((r: any) => r.block_height),
    ].filter(Number.isFinite);
    return heights.length ? Math.max(...heights) : undefined;
  }
}

export const nearChainService = new NearChainService();
export default nearChainService;
