import express from "express";
import cookieSession from "cookie-session";
import * as dotenv from "dotenv";

import webhookRouter from "./routes/webhook";
import healthRouter from "./routes/health";
import authRouter from "./routes/auth";
import walletRouter from "./routes/wallet";
import reposRouter from "./routes/repos";

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3001;

// CORS middleware to support credentials-based requests from frontend
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
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
    sameSite: "lax",
    secure: false, // Set to true if running production HTTPS
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

export default app;
