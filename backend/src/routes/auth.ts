import { Router, Request, Response } from "express";

const router = Router();

// Helper to get frontend URL
const getFrontendUrl = () => {
  return process.env.FRONTEND_URL ?? "http://localhost:5173";
};

/**
 * GET /auth/github
 * Redirects to GitHub OAuth authorize page
 */
router.get("/github", (req: Request, res: Response) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const redirectUri = process.env.GITHUB_REDIRECT_URI ?? "http://localhost:3001/auth/github/callback";

  if (!clientId) {
    console.warn("[OAuth] GITHUB_CLIENT_ID not set. Redirecting to mock login callback in development.");
    // In development fallback, automatically log in as a mock user
    const mockUsername = "moizz";
    return res.redirect(`${redirectUri}?code=mock_code_for_${mockUsername}`);
  }

  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=read:user&redirect_uri=${encodeURIComponent(
    redirectUri
  )}`;
  res.redirect(githubAuthUrl);
});

/**
 * GET /auth/github/callback
 * Exchanges code for access token and retrieves GitHub username
 */
router.get("/github/callback", async (req: Request, res: Response) => {
  const code = req.query.code as string;
  const frontendUrl = getFrontendUrl();

  if (!code) {
    return res.redirect(`${frontendUrl}/link-wallet?error=No+code+provided`);
  }

  let username = "moizz"; // default fallback

  // Check if it's a mock login
  if (code.startsWith("mock_code_for_")) {
    username = code.replace("mock_code_for_", "");
    console.log(`[OAuth] Mock login successful for user: ${username}`);
    
    // Save to session (Note: session middleware will be wired in index.ts)
    if (req.session) {
      req.session.githubUsername = username;
    }
    
    return res.redirect(`${frontendUrl}/link-wallet?githubUsername=${username}`);
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

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

    const tokenData: any = await tokenResponse.json();
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

    const userData: any = await userResponse.json();
    if (!userData.login) {
      throw new Error("Failed to get user profile login");
    }

    username = userData.login;
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
