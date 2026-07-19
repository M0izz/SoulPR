import { Router, Request, Response } from "express";

const router = Router();

/**
 * GET /health
 *
 * Keep-alive endpoint pinged every 10 minutes by an external cron
 * (e.g. cron-job.org / UptimeRobot) to prevent Render free-tier cold starts.
 * On demo day, either keep this running or upgrade to Render Starter.
 */
router.get("/", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    service: "receipt-backend",
    timestamp: new Date().toISOString(),
  });
});

export default router;
