import dbService, { PendingMint } from "./DbService";
import activeChainService from "./ActiveChainService";

/**
 * Chain-service interface shared by Monad (ethers) and NEAR (near-api-js)
 * implementations. MintService depends on this abstraction so it can work
 * with either chain without modification.
 */
export interface IChainService {
  attest(
    contributor: string,
    repo: string,
    prNumber: number,
    prTitle: string,
    githubUsername: string,
    mergeCommitSha: string,
    mergeTimestamp: number,
  ): Promise<string>;

  isMinted(
    repo: string,
    prNumber: number,
    contributor: string,
    mergeCommitSha: string,
  ): Promise<boolean>;
}

class MintService {
  private chain: IChainService;

  async getTrackedRepos(installationId: string): Promise<string[]> {
    return dbService.getTrackedRepos(installationId);
  }

  async retryPendingMints(): Promise<void> {
    for (const githubUsername of await dbService.listPendingUsernames()) {
      const walletLink = await dbService.getWalletLink(githubUsername);
      if (walletLink) await this.drainPendingQueue(githubUsername, walletLink.walletAddress);
    }
  }

  constructor(chain: IChainService = activeChainService) {
    this.chain = chain;
  }

  /** Processes a new merged PR webhook event */
  async handleMerge(pr: {
    repo: string;
    prNumber: number;
    prTitle: string;
    githubUsername: string;
    mergeTimestamp: number;
    commitSha: string;
  }) {
    const { repo, prNumber, githubUsername } = pr;

    console.log(`[MintService] Processing merge for ${githubUsername} on ${repo} #${prNumber}`);

    // 1. Wallet link check
    const walletLink = await dbService.getWalletLink(githubUsername);
    if (walletLink) {
      // Idempotency check: check if already minted on-chain
      const alreadyMinted = await this.chain.isMinted(
        repo,
        prNumber,
        walletLink.walletAddress,
        pr.commitSha,
      );
      if (alreadyMinted) {
        console.log(`[MintService] Idempotency guard: PR ${repo} #${prNumber} already minted on-chain`);
        return;
      }

      console.log(`[MintService] Linked wallet found: ${walletLink.walletAddress}. Minting receipt...`);
      try {
        const txHash = await this.chain.attest(
          walletLink.walletAddress,
          repo,
          prNumber,
          pr.prTitle,
          githubUsername,
          pr.commitSha,
          pr.mergeTimestamp,
        );
        await dbService.saveIssuance(pr, {
          status: "confirmed",
          txHash,
          issuerAccount: process.env.NEAR_BACKEND_ACCOUNT_ID,
          contractId: process.env.NEAR_CONTRACT_ID,
          retryCount: 0,
          updatedAt: new Date().toISOString(),
        });
        console.log(`[MintService] Successfully minted! Tx: ${txHash}`);
      } catch (e: any) {
        console.error(`[MintService] Failed to mint for ${githubUsername}:`, e.message);
        // Fall back to queueing if on-chain write fails (e.g. out of gas or network error)
        await dbService.addPendingMint({ ...pr, issuance: {
          status: "failed", retryCount: 1, error: e.message, updatedAt: new Date().toISOString(),
        }});
      }
    } else {
      // No linked wallet. Add to pending queue.
      console.log(`[MintService] No linked wallet for ${githubUsername}. Queueing for retroactive minting...`);
      await dbService.addPendingMint(pr);
    }
  }

  /** Drains the pending mints queue for a user when they link their wallet */
  async drainPendingQueue(githubUsername: string, walletAddress: string) {
    console.log(`[MintService] Draining pending queue for ${githubUsername} to wallet ${walletAddress}`);

    const pending = await dbService.getPendingMints(githubUsername);
    if (pending.length === 0) {
      console.log(`[MintService] No pending mints for ${githubUsername}`);
      return;
    }

    console.log(`[MintService] Found ${pending.length} pending mints for ${githubUsername}`);

    for (const mint of pending) {
      // Double check idempotency before minting
      const alreadyMinted = await this.chain.isMinted(
        mint.repo,
        mint.prNumber,
        walletAddress,
        mint.commitSha,
      );
      if (alreadyMinted) {
        console.log(`[MintService] Pending item ${mint.repo} #${mint.prNumber} was already minted. Skipping.`);
        continue;
      }

      try {
        const txHash = await this.chain.attest(
          walletAddress,
          mint.repo,
          mint.prNumber,
          mint.prTitle,
          githubUsername,
          mint.commitSha,
          mint.mergeTimestamp,
        );
        await dbService.saveIssuance(mint, {
          status: "confirmed",
          txHash,
          issuerAccount: process.env.NEAR_BACKEND_ACCOUNT_ID,
          contractId: process.env.NEAR_CONTRACT_ID,
          retryCount: mint.issuance?.retryCount ?? 0,
          updatedAt: new Date().toISOString(),
        });
        console.log(`[MintService] Retroactively minted pending PR ${mint.repo} #${mint.prNumber}`);
      } catch (e: any) {
        console.error(`[MintService] Failed to mint pending item ${mint.repo} #${mint.prNumber}:`, e.message);
        // Stop draining on error to preserve order / avoid double calls
        return;
      }
    }

    // Clear the pending queue on success
    await dbService.deletePendingMints(githubUsername);
    console.log(`[MintService] Cleared pending queue for ${githubUsername}`);
  }
}

export const mintService = new MintService();
export default mintService;
