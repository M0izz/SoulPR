import { Router, Request, Response } from "express";
import dbService from "../services/DbService";

const router = Router();

function getInstallationId() {
  return process.env.GITHUB_APP_INSTALLATION_ID;
}

function getRepositoryCatalog() {
  return (process.env.GITHUB_APP_REPOSITORIES ?? "")
    .split(",")
    .map((repo) => repo.trim())
    .filter(Boolean);
}

/**
 * GET /repos
 * Returns the catalog of repositories and whether they are active (tracked)
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const installationId = getInstallationId();
    const repositoryCatalog = getRepositoryCatalog();
    const installationConfigured = Boolean(
      installationId && repositoryCatalog.length > 0 && process.env.GITHUB_APP_ADMIN_USERNAME
    );
    if (!installationConfigured || !installationId) {
      return res.json({ installationConfigured: false, repos: [] });
    }
    const trackedList = await dbService.getTrackedRepos(installationId);
    const repos = repositoryCatalog.map((repo) => ({
      fullName: repo,
      tracked: trackedList.includes(repo),
    }));

    return res.json({ installationConfigured: true, repos });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

/**
 * POST /repos
 * Saves the list of selected repositories to track
 */
router.post("/", async (req: Request, res: Response) => {
  const { trackedRepos } = req.body;
  if (!Array.isArray(trackedRepos) || !trackedRepos.every((repo) => typeof repo === "string")) {
    return res.status(400).json({ error: "trackedRepos must be an array of strings" });
  }

  const installationId = getInstallationId();
  const adminUsername = process.env.GITHUB_APP_ADMIN_USERNAME;
  if (!installationId || !adminUsername) {
    return res.status(503).json({ error: "Repository tracking is not configured" });
  }
  if (req.session?.githubUsername?.toLowerCase() !== adminUsername.toLowerCase()) {
    return res.status(403).json({ error: "GitHub App administrator sign-in required" });
  }

  try {
    const catalog = getRepositoryCatalog();
    if (trackedRepos.some((repo: string) => !catalog.includes(repo))) {
      return res.status(400).json({ error: "One or more repositories are not in GITHUB_APP_REPOSITORIES" });
    }
    await dbService.saveTrackedRepos(installationId, trackedRepos);
    console.log(`[Repos] Tracked repos updated for installation ${installationId}:`, trackedRepos);
    return res.json({ success: true, trackedRepos });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

export default router;
