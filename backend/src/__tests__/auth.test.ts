import express from "express";
import cookieSession from "cookie-session";
import request from "supertest";
import authRouter from "../routes/auth";

const app = express();
app.use(cookieSession({ name: "test-session", keys: ["test-secret"] }));
app.use((req: any, res, next) => {
  const state = req.headers["x-test-oauth-state"];
  if (state) req.session.githubOAuthState = state;
  next();
});
app.use("/auth", authRouter);

describe("GitHub OAuth flow", () => {
  const previousEnvironment = {
    nodeEnv: process.env.NODE_ENV,
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    frontendUrl: process.env.FRONTEND_URL,
    redirectUri: process.env.GITHUB_REDIRECT_URI,
  };

  beforeEach(() => {
    process.env.NODE_ENV = "development";
    delete process.env.GITHUB_CLIENT_ID;
    delete process.env.GITHUB_CLIENT_SECRET;
    process.env.FRONTEND_URL = "http://localhost:5173";
    delete process.env.GITHUB_REDIRECT_URI;
  });

  afterAll(() => {
    if (previousEnvironment.nodeEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = previousEnvironment.nodeEnv;
    if (previousEnvironment.clientId === undefined) delete process.env.GITHUB_CLIENT_ID;
    else process.env.GITHUB_CLIENT_ID = previousEnvironment.clientId;
    if (previousEnvironment.clientSecret === undefined) delete process.env.GITHUB_CLIENT_SECRET;
    else process.env.GITHUB_CLIENT_SECRET = previousEnvironment.clientSecret;
    if (previousEnvironment.frontendUrl === undefined) delete process.env.FRONTEND_URL;
    else process.env.FRONTEND_URL = previousEnvironment.frontendUrl;
    if (previousEnvironment.redirectUri === undefined) delete process.env.GITHUB_REDIRECT_URI;
    else process.env.GITHUB_REDIRECT_URI = previousEnvironment.redirectUri;
  });

  it("uses a signed session state for development mock login", async () => {
    const agent = request.agent(app);
    const auth = await agent.get("/auth/github");
    const authorization = new URL(auth.headers.location);
    const state = authorization.searchParams.get("state");

    expect(auth.status).toBe(302);
    expect(state).toMatch(/^[a-f0-9]{64}$/);

    const callback = await agent
      .get("/auth/github/callback")
      .query({ code: "mock_code_for_moizz", state });
    expect(callback.status).toBe(302);
    expect(callback.headers.location).toContain("githubUsername=moizz");
  });

  it("rejects a callback with a mismatched OAuth state", async () => {
    const callback = await request(app)
      .get("/auth/github/callback")
      .set("x-test-oauth-state", "expected-state")
      .query({ code: "mock_code_for_moizz", state: "attacker-state" });
    expect(callback.status).toBe(302);
    expect(callback.headers.location).toContain("Invalid+OAuth+state");
  });

  it("does not allow mock login in production", async () => {
    process.env.NODE_ENV = "production";
    const callback = await request(app)
      .get("/auth/github/callback")
      .set("x-test-oauth-state", "expected-state")
      .query({ code: "mock_code_for_moizz", state: "expected-state" });
    expect(callback.status).toBe(400);
    expect(callback.body.error).toContain("only enabled in development");
  });

  it("does not enable mock login when the environment is not explicitly development", async () => {
    delete process.env.NODE_ENV;
    const response = await request(app).get("/auth/github");
    expect(response.status).toBe(503);
  });
});
