import { Router, Request, Response } from "express";
import crypto from "crypto";
import mintService from "../services/MintService";

const router = Router();

// ---------------------------------------------------------------------------
// HMAC signature verification
// ---------------------------------------------------------------------------

/**
 * Verifies the X-Hub-Signature-256 header GitHub attaches to every webhook.
 * Uses timingSafeEqual to prevent timing attacks.
 *
 * @param payload  The raw request body Buffer (must be raw, not parsed JSON).
 * @param header   The full "sha256=<hex>" header value from GitHub.
 */
function verifyGitHubSignature(payload: Buffer, header: string | undefined): boolean {
  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[webhook] GITHUB_WEBHOOK_SECRET is not set — rejecting all events");
    return false;
  }
  if (!header) return false;

  const expected = `sha256=${crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex")}`;

  try {
    // Buffers must be the same length for timingSafeEqual
    return (
      expected.length === header.length &&
      crypto.timingSafeEqual(Buffer.from(expected, "utf8"), Buffer.from(header, "utf8"))
    );
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// POST /webhook/github
// ---------------------------------------------------------------------------

router.post("/github", async (req: Request, res: Response) => {
  const signatureHeader = req.headers["x-hub-signature-256"] as string | undefined;
  const payload = req.body as Buffer; // raw bytes, set by express.raw() in index.ts

  if (!Buffer.isBuffer(payload)) {
    return res.status(400).json({ error: "Expected a raw webhook request body" });
  }

  // 1. Verify signature — reject spoofed events immediately
  if (!verifyGitHubSignature(payload, signatureHeader)) {
    console.warn("[webhook] Signature verification failed — rejecting request");
    return res.status(401).json({ error: "Invalid signature" });
  }

  // 2. Parse payload
  let body: Record<string, any>;
  try {
    body = JSON.parse(payload.toString("utf8"));
  } catch {
    return res.status(400).json({ error: "Malformed JSON payload" });
  }

  const event = req.headers["x-github-event"] as string;

  // 3. Filter: only care about closed + merged pull_request events
  if (
    event !== "pull_request" ||
    body["action"] !== "closed" ||
    body["pull_request"]?.["merged"] !== true
  ) {
    return res.status(200).json({ ignored: true, reason: "Not a merged PR event" });
  }

  // 4. Extract fields we need
  const pr = body["pull_request"] as Record<string, any> | undefined;
  const repository = body["repository"] as Record<string, any> | undefined;
  if (!pr) {
    return res.status(400).json({ error: "Pull request payload is missing" });
  }
  const prData = {
    repo:           repository?.["full_name"] as string | undefined,
    prNumber:       pr["number"] as number,
    prTitle:        pr["title"] as string,
    githubUsername: (pr["user"] as Record<string, any> | null)?.["login"] as string | undefined,
    mergeTimestamp: Math.floor(new Date(pr["merged_at"] as string).getTime() / 1000),
    commitSha:      pr["merge_commit_sha"] as string,
  };

  if (
    typeof prData.repo !== "string" ||
    typeof prData.prNumber !== "number" ||
    !Number.isInteger(prData.prNumber) ||
    prData.prNumber <= 0 ||
    typeof prData.prTitle !== "string" ||
    typeof prData.githubUsername !== "string" ||
    !Number.isFinite(prData.mergeTimestamp) ||
    typeof prData.commitSha !== "string"
  ) {
    return res.status(400).json({ error: "Pull request payload is missing required fields" });
  }

  const installationId = process.env.GITHUB_APP_INSTALLATION_ID;
  if (!installationId) {
    console.error("[webhook] GITHUB_APP_INSTALLATION_ID is not configured");
    return res.status(503).json({ error: "GitHub App installation is not configured" });
  }
  const eventInstallationId = body["installation"]?.["id"];
  if (String(eventInstallationId ?? "") !== installationId) {
    return res.status(200).json({ ignored: true, reason: "Unconfigured GitHub App installation" });
  }

  const configuredRepos = (process.env.GITHUB_APP_REPOSITORIES ?? "")
    .split(",")
    .map((repo) => repo.trim())
    .filter(Boolean);
  if (!configuredRepos.includes(prData.repo)) {
    return res.status(200).json({ ignored: true, reason: "Repository is not in the configured catalog" });
  }

  console.log("[webhook] PR merged event received:", JSON.stringify(prData, null, 2));

  try {
    const trackedRepos = await mintService.getTrackedRepos(installationId);
    if (!trackedRepos.includes(prData.repo)) {
      return res.status(200).json({ ignored: true, reason: "Repository is not tracked" });
    }

    // Process merge event (handles wallet check, queuing, or minting)
    await mintService.handleMerge({
      repo: prData.repo,
      prNumber: prData.prNumber,
      prTitle: prData.prTitle,
      githubUsername: prData.githubUsername,
      mergeTimestamp: prData.mergeTimestamp,
      commitSha: prData.commitSha,
    });
  } catch (e: any) {
    console.error("[webhook] Error processing merge event:", e.message);
    return res.status(500).json({ error: "Failed to process merged pull request" });
  }

  return res.status(200).json({ received: true, repo: prData.repo, pr: prData.prNumber });
});

export default router;
