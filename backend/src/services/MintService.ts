import dbService, { PendingMint } from "./DbService";
import chainService from "./ChainService";

class MintService {
  /**
   * Processes a new merged PR webhook event
   */
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

    // 1. Idempotency check: check if already minted on-chain
    const alreadyMinted = await chainService.isMinted(repo, prNumber);
    if (alreadyMinted) {
      console.log(`[MintService] Idempotency guard: PR ${repo} #${prNumber} already minted on-chain`);
      return;
    }

    // 2. Wallet link check
    const walletLink = await dbService.getWalletLink(githubUsername);
    if (walletLink) {
      // User has a linked wallet! Mint immediately
      console.log(`[MintService] Linked wallet found: ${walletLink.walletAddress}. Minting receipt...`);
      try {
        const txHash = await chainService.attest(
          walletLink.walletAddress,
          repo,
          prNumber,
          pr.mergeTimestamp
        );
        console.log(`[MintService] Successfully minted! Tx: ${txHash}`);
      } catch (e: any) {
        console.error(`[MintService] Failed to mint for ${githubUsername}:`, e.message);
        // Fall back to queueing if on-chain write fails (e.g. out of gas or network error)
        await dbService.addPendingMint(pr);
      }
    } else {
      // No linked wallet. Add to pending queue.
      console.log(`[MintService] No linked wallet for ${githubUsername}. Queueing for retroactive minting...`);
      await dbService.addPendingMint(pr);
    }
  }

  /**
   * Drains the pending mints queue for a user when they link their wallet
   */
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
      const alreadyMinted = await chainService.isMinted(mint.repo, mint.prNumber);
      if (alreadyMinted) {
        console.log(`[MintService] Pending item ${mint.repo} #${mint.prNumber} was already minted. Skipping.`);
        continue;
      }

      try {
        await chainService.attest(
          walletAddress,
          mint.repo,
          mint.prNumber,
          mint.mergeTimestamp
        );
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
