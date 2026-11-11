import { Router, Request, Response } from "express";
import crypto from "crypto";
import { ethers } from "ethers";
import { PublicKey } from "near-api-js/lib/utils";
import dbService from "../services/DbService";
import mintService from "../services/MintService";

const router = Router();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** NEAR account ids contain a dot and are not hex (e.g. alice.testnet). */
function isNearAccountId(value: string): boolean {
  return /^[a-z0-9._-]{2,64}$/.test(value) && value.includes(".");
}

/**
 * Verify a NEAR message signature.
 * The frontend signs `message` with the connected NEAR account's key and
 * sends { signature, publicKey }. We verify the signature is valid under
 * that public key, proving possession of the linked account's key.
 */
function verifyNearSignature(
  message: string,
  signature: string,
  publicKey: string,
): boolean {
  try {
    const pk = PublicKey.fromString(publicKey);
    // NEAR signatures arrive base64-encoded; decode to bytes for verification
    const sigBytes = Buffer.from(signature, "base64");
    return pk.verify(sigBytes, Buffer.from(message, "utf8"));
  } catch {
    return false;
  }
}

/**
 * Verify a link signature for either an Ethereum address or a NEAR account id.
 */
function verifyLinkSignature(
  message: string,
  signature: string,
  walletAddress: string,
  publicKey?: string,
): boolean {
  if (isNearAccountId(walletAddress)) {
    if (!publicKey) return false;
    return verifyNearSignature(message, signature, publicKey);
  }
  const recovered = ethers.verifyMessage(message, signature);
  return recovered.toLowerCase() === walletAddress.toLowerCase();
}

async function nearKeyBelongsToAccount(accountId: string, publicKey: string): Promise<boolean> {
  try {
    const response = await fetch(process.env.NEAR_NODE_URL ?? "https://rpc.testnet.near.org", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: "soulpr", method: "query", params: {
        request_type: "view_access_key", finality: "final", account_id: accountId, public_key: publicKey,
      }}),
    });
    return response.ok && !(await response.json()).error;
  } catch {
    return false;
  }
}

router.get("/challenge", (req: Request, res: Response) => {
  const githubUsername = req.session?.githubUsername;
  if (!githubUsername) return res.status(401).json({ error: "GitHub authentication required." });
  const nonce = crypto.randomBytes(24).toString("hex");
  const expiresAt = Date.now() + 5 * 60 * 1000;
  req.session!.walletChallenge = { nonce, expiresAt, githubUsername };
  return res.json({ nonce, expiresAt });
});

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

    const { walletAddress, signature, publicKey } = req.body;
  if (!walletAddress || !signature) {
    return res.status(400).json({ error: "Missing walletAddress or signature" });
  }

  try {
    // 1. Verify signature (Ethereum personal_sign or NEAR message signature)
    const challenge = req.session?.walletChallenge;
    if (!challenge || challenge.githubUsername !== githubUsername || challenge.expiresAt < Date.now()) {
      return res.status(400).json({ error: "Wallet-link challenge is missing or expired. Request a new challenge." });
    }
    const message = `SoulPR wallet link\nGitHub: ${githubUsername}\nWallet: ${walletAddress}\nNonce: ${challenge.nonce}`;
    if (!verifyLinkSignature(message, signature, walletAddress, publicKey) ||
        (isNearAccountId(walletAddress) && (!publicKey || !(await nearKeyBelongsToAccount(walletAddress, publicKey))))) {
      return res.status(400).json({ error: "Signature verification failed. Invalid signer." });
    }
    req.session!.walletChallenge = undefined;

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

/**
 * GET /wallet/resolve
 * Resolves a search query (wallet address OR GitHub username) to a wallet address.
 */
router.get("/resolve", async (req: Request, res: Response) => {
  const { query } = req.query;
  if (!query || typeof query !== "string") {
    return res.status(400).json({ error: "Missing query parameter" });
  }

  const cleanQuery = query.trim().toLowerCase();

  // 1. Check if it's already a valid wallet address (Ethereum or NEAR account id)
  if (ethers.isAddress(cleanQuery) || isNearAccountId(cleanQuery)) {
    return res.json({ walletAddress: cleanQuery });
  }

  try {
    // 2. Try looking it up as a GitHub username
    const link = await dbService.getWalletLink(cleanQuery);
    if (link) {
      return res.json({ walletAddress: link.walletAddress });
    }

    return res.status(404).json({ error: `No wallet linked for GitHub user '${query}'` });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || "Resolution error" });
  }
});

export default router;
