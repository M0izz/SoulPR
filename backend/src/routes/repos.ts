import { Router, Request, Response } from "express";
import dbService from "../services/DbService";

const router = Router();

const DEFAULT_INSTALLATION_ID = "demo_installation";

// Full repository catalog for the demo app
const ALL_REPOS = [
  "moizz/CNTRL",
  "moizz/JugaadLang",
  "moizz/filedrop",
  "moizz/semantic-plagiarism-detector",
];

/**
 * GET /repos
 * Returns the catalog of repositories and whether they are active (tracked)
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const trackedList = await dbService.getTrackedRepos(DEFAULT_INSTALLATION_ID);
    
    // If no repos are explicitly tracked yet, track moizz/CNTRL and moizz/JugaadLang by default
    // matching the UI mockup state
    let activeTracked = trackedList;
    if (trackedList.length === 0) {
      activeTracked = ["moizz/CNTRL", "moizz/JugaadLang"];
      await dbService.saveTrackedRepos(DEFAULT_INSTALLATION_ID, activeTracked);
    }

    const repos = ALL_REPOS.map((repo) => ({
      fullName: repo,
      tracked: activeTracked.includes(repo),
    }));

    return res.json({
      githubAppInstalled: true,
      installationId: DEFAULT_INSTALLATION_ID,
      repos,
    });
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
  if (!Array.isArray(trackedRepos)) {
    return res.status(400).json({ error: "trackedRepos must be an array of strings" });
  }

  try {
    // Validate that tracked repos are part of our catalog
    const validRepos = trackedRepos.filter((repo) => ALL_REPOS.includes(repo));
    await dbService.saveTrackedRepos(DEFAULT_INSTALLATION_ID, validRepos);
    console.log(`[Repos] Tracked repos updated for ${DEFAULT_INSTALLATION_ID}:`, validRepos);
    return res.json({ success: true, trackedRepos: validRepos });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

export default router;
