import "dotenv/config";
import express from "express";
import cookieSession from "cookie-session";
import webhookRouter from "./routes/webhook";
import healthRouter from "./routes/health";
import authRouter from "./routes/auth";
import walletRouter from "./routes/wallet";
import reposRouter from "./routes/repos";
import mintService from "./services/MintService";
import { isAllowedOrigin } from "./utils/cors";

const app = express();
const PORT = process.env.PORT ?? 3001;
const isProduction = process.env.NODE_ENV === "production";
const isDevelopment = !isProduction;

if (isProduction && !process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET must be configured in production");
}

if (isProduction && !process.env.FRONTEND_URL) {
  throw new Error("FRONTEND_URL must be configured in production");
}

if (isProduction) {
  app.set("trust proxy", 1);
}

// CORS middleware to support credentials-based requests from frontend
app.use((req, res, next) => {
  const origin = req.headers.origin;
  res.setHeader("Vary", "Origin");
  if (origin && isAllowedOrigin(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization,x-github-username");
  }

  if (req.method === "OPTIONS") {
    return origin && isAllowedOrigin(origin) ? res.sendStatus(204) : res.sendStatus(403);
  }
  next();
});

// IMPORTANT: /webhook needs the raw body buffer for HMAC verification.
app.use("/webhook", express.raw({ type: "application/json" }));

// All other routes get parsed JSON bodies
app.use(express.json());

// Session middleware for authentication storage
app.use(
  cookieSession({
    name: "session",
    keys: [process.env.SESSION_SECRET ?? "receipt_secret_dev_key"],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
  })
);

// Routes
app.use("/webhook", webhookRouter);
app.use("/health", healthRouter);
app.use("/auth", authRouter);
app.use("/wallet", walletRouter);
app.use("/repos", reposRouter);

app.listen(PORT, () => {
  console.log(`[receipt-backend] listening on port ${PORT}`);
});

let retryingPendingMints = false;
const pendingMintRetry = setInterval(async () => {
  if (retryingPendingMints) return;
  retryingPendingMints = true;
  try {
    await mintService.retryPendingMints();
  } catch (error) {
    console.error("[receipt-backend] Pending mint retry failed:", error);
  } finally {
    retryingPendingMints = false;
  }
}, 60_000);
pendingMintRetry.unref();

export default app;
