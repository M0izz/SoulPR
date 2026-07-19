import request from "supertest";
import express from "express";
import cookieSession from "cookie-session";
import webhookRouter from "../routes/webhook";
import walletRouter from "../routes/wallet";
import reposRouter from "../routes/repos";
import dbService from "../services/DbService";

// Mock ChainService to prevent actual network RPC calls during integration tests
jest.mock("../services/ChainService", () => {
  return {
    __esModule: true,
    chainService: {
      isMinted: jest.fn().mockResolvedValue(false),
      attest: jest.fn().mockResolvedValue("0xmocktxhash"),
    },
    // Mock the default export
    default: {
      isMinted: jest.fn().mockResolvedValue(false),
      attest: jest.fn().mockResolvedValue("0xmocktxhash"),
    }
  };
});

const app = express();

// Set up middleware in the EXACT same order as index.ts
// 1. Raw body parsing for /webhook route ONLY
app.use("/webhook", express.raw({ type: "application/json" }));

// 2. Global JSON parsing for other routes
app.use(express.json());

// 3. Cookie session helper
app.use(
  cookieSession({
    name: "session",
    keys: ["test_secret"],
  })
);

// Session injection helper for test requests
app.use((req: any, res, next) => {
  if (req.headers["x-test-session-user"]) {
    req.session.githubUsername = req.headers["x-test-session-user"];
  }
  next();
});

app.use("/webhook", webhookRouter);
app.use("/wallet", walletRouter);
app.use("/repos", reposRouter);

describe("OSS Contribution Receipt integration flow", () => {
  const GITHUB_USER = "moizz";

  beforeEach(async () => {
    // Reset DB state before each test
    await dbService.deletePendingMints(GITHUB_USER);
  });

  it("should queue a PR if contributor has no linked wallet yet", async () => {
    const prPayload = {
      action: "closed",
      pull_request: {
        merged: true,
        number: 45,
        title: "add new backend integration tests",
        merged_by: { login: GITHUB_USER },
        merged_at: new Date().toISOString(),
        merge_commit_sha: "0xcommithash",
      },
      repository: {
        full_name: "moizz/CNTRL",
      },
    };

    process.env.GITHUB_WEBHOOK_SECRET = "testsecret";
    const bodyStr = JSON.stringify(prPayload);
    const hmac = require("crypto")
      .createHmac("sha256", "testsecret")
      .update(bodyStr)
      .digest("hex");

    const res = await request(app)
      .post("/webhook/github")
      .set("x-hub-signature-256", `sha256=${hmac}`)
      .set("x-github-event", "pull_request")
      .set("Content-Type", "application/json")
      .send(bodyStr);

    expect(res.status).toBe(200);
    expect(res.body.received).toBe(true);

    // Verify it was placed in the database pendingMints collection
    const pending = await dbService.getPendingMints(GITHUB_USER);
    expect(pending.length).toBe(1);
    expect(pending[0].prNumber).toBe(45);
    expect(pending[0].repo).toBe("moizz/CNTRL");
  });
});
