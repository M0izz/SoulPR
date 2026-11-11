process.env.CHAIN_PROVIDER = "monad";

import request from "supertest";
import express from "express";
import cookieSession from "cookie-session";
import webhookRouter from "../routes/webhook";
import walletRouter from "../routes/wallet";
import reposRouter from "../routes/repos";
import dbService from "../services/DbService";
import mintService from "../services/MintService";
import chainService from "../services/ChainService";

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

// Keep the integration suite chain-independent; NEAR is the production default,
// while these tests exercise queue behavior without contacting a live network.
jest.mock("../services/NearChainService", () => ({
  __esModule: true,
  nearChainService: {
    isMinted: jest.fn().mockResolvedValue(false),
    attest: jest.fn().mockResolvedValue("near-test-hash"),
  },
  default: {
    isMinted: jest.fn().mockResolvedValue(false),
    attest: jest.fn().mockResolvedValue("near-test-hash"),
  },
}));

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
    process.env.GITHUB_APP_INSTALLATION_ID = "12345";
    process.env.GITHUB_APP_REPOSITORIES = "moizz/CNTRL";
    process.env.GITHUB_APP_ADMIN_USERNAME = GITHUB_USER;
    process.env.GITHUB_WEBHOOK_SECRET = "testsecret";
    await dbService.saveTrackedRepos("12345", ["moizz/CNTRL"]);
    jest.mocked(chainService.isMinted).mockResolvedValue(false);
    jest.mocked(chainService.attest).mockResolvedValue("0xmocktxhash");
  });

  it("should queue a PR if contributor has no linked wallet yet", async () => {
    const prPayload = {
      action: "closed",
      pull_request: {
        merged: true,
        number: 45,
        title: "add new backend integration tests",
        user: { login: GITHUB_USER },
        merged_by: { login: "merger" },
        merged_at: new Date().toISOString(),
        merge_commit_sha: "0xcommithash",
      },
      repository: {
        full_name: "moizz/CNTRL",
      },
      installation: { id: 12345 },
    };

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

  it("ignores a merged PR from a repository that is not tracked", async () => {
    const prPayload = {
      action: "closed",
      pull_request: {
        merged: true,
        number: 46,
        title: "untracked change",
        user: { login: GITHUB_USER },
        merged_at: new Date().toISOString(),
        merge_commit_sha: "commit",
      },
      repository: { full_name: "moizz/other" },
      installation: { id: 12345 },
    };
    const bodyStr = JSON.stringify(prPayload);
    const hmac = require("crypto").createHmac("sha256", "testsecret").update(bodyStr).digest("hex");

    const response = await request(app)
      .post("/webhook/github")
      .set("x-hub-signature-256", `sha256=${hmac}`)
      .set("x-github-event", "pull_request")
      .set("Content-Type", "application/json")
      .send(bodyStr);

    expect(response.status).toBe(200);
    expect(response.body.ignored).toBe(true);
    expect(await dbService.getPendingMints(GITHUB_USER)).toHaveLength(0);
  });

  it("returns an error when processing fails so GitHub can retry", async () => {
    const trackedReposMock = jest.spyOn(dbService, "getTrackedRepos").mockRejectedValueOnce(new Error("db unavailable"));
    const prPayload = {
      action: "closed",
      pull_request: {
        merged: true,
        number: 47,
        title: "retry me",
        user: { login: GITHUB_USER },
        merged_at: new Date().toISOString(),
        merge_commit_sha: "commit",
      },
      repository: { full_name: "moizz/CNTRL" },
      installation: { id: 12345 },
    };
    const bodyStr = JSON.stringify(prPayload);
    const hmac = require("crypto").createHmac("sha256", "testsecret").update(bodyStr).digest("hex");

    const response = await request(app)
      .post("/webhook/github")
      .set("x-hub-signature-256", `sha256=${hmac}`)
      .set("x-github-event", "pull_request")
      .set("Content-Type", "application/json")
      .send(bodyStr);

    trackedReposMock.mockRestore();
    expect(response.status).toBe(500);
  });

  it("retries linked-user mint failures and clears the queue after success", async () => {
    const githubUsername = "retry-user";
    const pendingMint = {
      repo: "moizz/CNTRL",
      prNumber: 48,
      prTitle: "retry a failed mint",
      githubUsername,
      mergeTimestamp: 1000,
      commitSha: "retry-commit",
    };
    await dbService.addPendingMint(pendingMint);
    await dbService.saveWalletLink(githubUsername, "0x0000000000000000000000000000000000000001");
    jest.mocked(chainService.attest).mockRejectedValueOnce(new Error("RPC unavailable"));

    await mintService.retryPendingMints();
    expect(await dbService.getPendingMints(githubUsername)).toHaveLength(1);

    await mintService.retryPendingMints();
    expect(await dbService.getPendingMints(githubUsername)).toHaveLength(0);
  });

  it("requires the configured GitHub administrator to save repository tracking", async () => {
    const forbidden = await request(app)
      .post("/repos")
      .set("x-test-session-user", "another-user")
      .send({ trackedRepos: ["moizz/CNTRL"] });
    expect(forbidden.status).toBe(403);

    const saved = await request(app)
      .post("/repos")
      .set("x-test-session-user", GITHUB_USER)
      .send({ trackedRepos: ["moizz/CNTRL"] });
    expect(saved.status).toBe(200);
    expect(saved.body.trackedRepos).toEqual(["moizz/CNTRL"]);
  });
});
