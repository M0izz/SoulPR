import { Router, Request, Response } from "express";
import crypto from "crypto";

const router = Router();

// Helper to get frontend URL
const getFrontendUrl = () => {
  if (process.env.FRONTEND_URL) return process.env.FRONTEND_URL;
  if (process.env.NODE_ENV === "development") return "http://localhost:5173";
  throw new Error("FRONTEND_URL must be configured outside development");
};

/**
 * GET /auth/github
 * Redirects to GitHub OAuth authorize page
 */
router.get("/github", (req: Request, res: Response) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const redirectUri = process.env.GITHUB_REDIRECT_URI ??
    (process.env.NODE_ENV === "development" ? "http://localhost:3001/auth/github/callback" : undefined);

  if (!clientId) {
    if (process.env.NODE_ENV !== "development") {
      return res.status(503).json({ error: "GitHub OAuth is not configured" });
    }
    console.warn("[OAuth] GITHUB_CLIENT_ID not set. Using development-only mock login.");
    const mockUsername = "moizz";
    const state = crypto.randomBytes(32).toString("hex");
    if (req.session) req.session.githubOAuthState = state;
    return res.redirect(`${redirectUri}?code=mock_code_for_${mockUsername}&state=${state}`);
  }
  if (!redirectUri) {
    return res.status(503).json({ error: "GITHUB_REDIRECT_URI must be configured in production" });
  }

  const state = crypto.randomBytes(32).toString("hex");
  if (req.session) req.session.githubOAuthState = state;
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=read:user&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&state=${state}`;
  res.redirect(githubAuthUrl);
});

/**
 * GET /auth/github/callback
 * Exchanges code for access token and retrieves GitHub username
 */
router.get("/github/callback", async (req: Request, res: Response) => {
  const code = req.query.code as string;
  let frontendUrl: string;
  try {
    frontendUrl = getFrontendUrl();
  } catch (error) {
    console.error("[OAuth] Callback configuration error:", error);
    return res.status(503).json({ error: "GitHub OAuth callback is not configured" });
  }

  const expectedState = req.session?.githubOAuthState;
  const receivedState = req.query.state;
  const expectedStateBuffer = typeof expectedState === "string" ? Buffer.from(expectedState) : Buffer.alloc(0);
  const receivedStateBuffer = typeof receivedState === "string" ? Buffer.from(receivedState) : Buffer.alloc(0);
  if (
    expectedStateBuffer.length === 0 ||
    receivedStateBuffer.length === 0 ||
    expectedStateBuffer.length !== receivedStateBuffer.length ||
    !crypto.timingSafeEqual(expectedStateBuffer, receivedStateBuffer)
  ) {
    if (req.session) delete req.session.githubOAuthState;
    return res.redirect(`${frontendUrl}/link-wallet?error=Invalid+OAuth+state`);
  }
  if (req.session) delete req.session.githubOAuthState;

  if (!code) {
    return res.redirect(`${frontendUrl}/link-wallet?error=No+code+provided`);
  }

  // Check if it's a mock login
  if (code.startsWith("mock_code_for_")) {
    if (process.env.NODE_ENV !== "development") {
      return res.status(400).json({ error: "Mock login is only enabled in development" });
    }
    const username = code.replace("mock_code_for_", "");
    console.log(`[OAuth] Mock login successful for user: ${username}`);
    if (req.session) {
      req.session.githubUsername = username;
    }
    return res.redirect(`${frontendUrl}/link-wallet?githubUsername=${username}`);
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return res.status(503).json({ error: "GitHub OAuth is not configured" });
  }

  try {
    // 1. Exchange code for access token
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    const tokenData: { access_token?: string; error_description?: string } = await tokenResponse.json();
    if (!tokenData.access_token) {
      throw new Error(tokenData.error_description ?? "Failed to retrieve access token");
    }

    // 2. Fetch user profile
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `token ${tokenData.access_token}`,
        Accept: "application/json",
        "User-Agent": "OSS-Receipt-Backend",
      },
    });

    const userData: { login?: string } = await userResponse.json();
    if (!userData.login) {
      throw new Error("Failed to get user profile login");
    }

    const username = userData.login;
    console.log(`[OAuth] GitHub authentication successful: ${username}`);

    if (req.session) {
      req.session.githubUsername = username;
    }

    return res.redirect(`${frontendUrl}/link-wallet?githubUsername=${username}`);
  } catch (e: any) {
    console.error("[OAuth] Callback error:", e.message);
    return res.redirect(`${frontendUrl}/link-wallet?error=${encodeURIComponent(e.message)}`);
  }
});

export default router;
