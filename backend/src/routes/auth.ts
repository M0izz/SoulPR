import { Router, Request, Response } from "express";
import crypto from "crypto";
import { getFrontendUrl, isAllowedOrigin } from "../utils/cors";

const router = Router();

/**
 * Signs an OAuth state payload so it is tamper-proof and does not
 * rely solely on cross-origin cookie persistence during browser OAuth redirects.
 */
function createSignedState(payload: object, secret: string): string {
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", secret).update(encoded).digest("base64url");
  return `${encoded}.${signature}`;
}

/**
 * Verifies and decodes a signed OAuth state.
 */
function verifySignedState(stateStr: string, secret: string): any | null {
  if (!stateStr || !stateStr.includes(".")) return null;
  const [encoded, signature] = stateStr.split(".");
  const expectedSig = crypto.createHmac("sha256", secret).update(encoded).digest("base64url");
  if (signature !== expectedSig) return null;
  try {
    const data = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
    if (typeof data.createdAt === "number" && Date.now() - data.createdAt > 15 * 60 * 1000) {
      return null; // Expired state (> 15 min)
    }
    return data;
  } catch {
    return null;
  }
}

/**
 * GET /auth/github
 * Redirects to GitHub OAuth authorize page or development mock login.
 */
router.get("/github", (req: Request, res: Response) => {
  const originQuery = typeof req.query.origin === "string" ? req.query.origin : undefined;
  const returnToQuery = typeof req.query.return_to === "string" ? req.query.return_to : "/dashboard";
  const frontendUrl = getFrontendUrl(req, originQuery);

  const clientId = process.env.GITHUB_CLIENT_ID;
  const host = req.get("host") ?? "localhost:3001";
  const protocol = req.protocol ?? "http";
  const redirectUri =
    process.env.GITHUB_REDIRECT_URI ?? `${protocol}://${host}/auth/github/callback`;

  const sessionSecret = process.env.SESSION_SECRET ?? "receipt_secret_dev_key";
  const statePayload = {
    nonce: crypto.randomBytes(16).toString("hex"),
    origin: frontendUrl,
    returnTo: returnToQuery.startsWith("/") ? returnToQuery : `/${returnToQuery}`,
    createdAt: Date.now(),
  };

  const signedState = createSignedState(statePayload, sessionSecret);
  if (req.session) {
    req.session.githubOAuthState = signedState;
  }

  // Development / Mock fallback when client ID is not configured
  if (!clientId) {
    if (process.env.NODE_ENV === "production") {
      return res.status(503).json({ error: "GitHub OAuth is not configured" });
    }
    console.warn("[OAuth] GITHUB_CLIENT_ID not set. Using development mock login.");
    const mockUsername = (req.query.username as string) || "moizz";
    if (req.session) {
      req.session.githubUsername = mockUsername;
    }
    return res.redirect(
      `${redirectUri}?code=mock_code_for_${mockUsername}&state=${encodeURIComponent(signedState)}`
    );
  }

  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=read:user&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&state=${encodeURIComponent(signedState)}`;
  return res.redirect(githubAuthUrl);
});

/**
 * GET /auth/github/callback
 * Exchanges code for access token and retrieves GitHub username
 */
router.get("/github/callback", async (req: Request, res: Response) => {
  const code = req.query.code as string;
  const rawState = req.query.state as string;
  const sessionSecret = process.env.SESSION_SECRET ?? "receipt_secret_dev_key";

  let frontendUrl = getFrontendUrl(req);
  let returnToPath = "/dashboard";

  const verifiedState = verifySignedState(rawState, sessionSecret);
  if (verifiedState) {
    if (verifiedState.origin && isAllowedOrigin(verifiedState.origin)) {
      frontendUrl = verifiedState.origin;
    }
    if (verifiedState.returnTo && typeof verifiedState.returnTo === "string") {
      returnToPath = verifiedState.returnTo;
    }
  } else {
    // Check if session has the unparsed state as secondary check
    const expectedSessionState = req.session?.githubOAuthState;
    if (!expectedSessionState || expectedSessionState !== rawState) {
      if (req.session) delete req.session.githubOAuthState;
      return res.redirect(`${frontendUrl}${returnToPath}?error=Invalid+OAuth+state`);
    }
  }

  if (req.session) {
    delete req.session.githubOAuthState;
  }

  if (!code) {
    return res.redirect(`${frontendUrl}${returnToPath}?error=No+code+provided`);
  }

  // Check if it's a mock login
  if (code.startsWith("mock_code_for_")) {
    if (process.env.NODE_ENV === "production") {
      return res.status(400).json({ error: "Mock login is only enabled in development" });
    }
    const username = code.replace("mock_code_for_", "");
    console.log(`[OAuth] Mock login successful for user: ${username}`);
    if (req.session) {
      req.session.githubUsername = username;
    }
    return res.redirect(`${frontendUrl}${returnToPath}?githubUsername=${encodeURIComponent(username)}`);
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

    return res.redirect(`${frontendUrl}${returnToPath}?githubUsername=${encodeURIComponent(username)}`);
  } catch (e: any) {
    console.error("[OAuth] Callback error:", e.message);
    return res.redirect(`${frontendUrl}${returnToPath}?error=${encodeURIComponent(e.message)}`);
  }
});

export default router;
