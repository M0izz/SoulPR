import { Router, Request, Response } from "express";
import { ethers } from "ethers";
import dbService from "../services/DbService";
import mintService from "../services/MintService";

const router = Router();

/**
 * POST /wallet/link
 * Links the contributor's GitHub username to their wallet address using a cryptographic signature.
 */
router.post("/link", async (req: Request, res: Response) => {
  // Retrieve githubUsername from OAuth session
  const githubUsername = req.session?.githubUsername;
  if (!githubUsername) {
    return res.status(401).json({ error: "GitHub authentication required. Please sign in first." });
  }

  const { walletAddress, signature } = req.body;
  if (!walletAddress || !signature) {
    return res.status(400).json({ error: "Missing walletAddress or signature" });
  }

  try {
    // 1. Verify signature
    const message = `Linking GitHub ${githubUsername} to ${walletAddress} for SoulPR`;
    const recovered = ethers.verifyMessage(message, signature);

    if (recovered.toLowerCase() !== walletAddress.toLowerCase()) {
      return res.status(400).json({ error: "Signature verification failed. Invalid signer." });
    }

    // 2. Save mapping to database
    const link = await dbService.saveWalletLink(githubUsername, walletAddress);

    // 3. Drain pending queue (mint retroactively if there are queued merged PRs)
    // Run this asynchronously to avoid blocking the user link request response
    mintService.drainPendingQueue(githubUsername, walletAddress).catch((err) => {
      console.error(`[WalletLink] Error draining queue for ${githubUsername}:`, err.message);
    });

    console.log(`[WalletLink] Successfully linked ${githubUsername} -> ${walletAddress}`);
    return res.json({
      success: true,
      githubUsername: link.githubUsername,
      walletAddress: link.walletAddress,
      linkedAt: link.linkedAt,
    });
  } catch (e: any) {
    console.error("[WalletLink] Error linking wallet:", e.message);
    return res.status(500).json({ error: e.message || "Failed to link wallet" });
  }
});

/**
 * GET /wallet/status
 * Returns current login & link status of the user session
 */
router.get("/status", async (req: Request, res: Response) => {
  const githubUsername = req.session?.githubUsername;
  if (!githubUsername) {
    return res.json({ authenticated: false });
  }

  try {
    const link = await dbService.getWalletLink(githubUsername);
    return res.json({
      authenticated: true,
      githubUsername,
      linked: !!link,
      walletAddress: link?.walletAddress ?? null,
    });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

/**
 * POST /wallet/logout
 * Clears the session
 */
router.post("/logout", (req: Request, res: Response) => {
  if (req.session) {
    req.session = null;
  }
  return res.json({ success: true });
});

export default router;
