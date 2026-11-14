import { nearChainService } from "../services/NearChainService";

// Helper to create a minimal mock outcome
function makeOutcome(
  overrides: Partial<{ transaction: { transaction: { hash: string } }; transaction_hash: string; hash: string }> = {}
) {
  return {
    transaction: {
      transaction: {
        hash: overrides.transaction?.transaction?.hash,
      },
    },
    transaction_hash: overrides.transaction_hash,
    hash: overrides.hash,
  } as any;
}

describe("NearChainService extractTxHash / attest transaction hash handling", () => {
  let service: typeof nearChainService;

  beforeEach(() => {
    // Use the exported singleton; set minimal env vars so constructor
    // does not throw or contact a real NEAR node.
    process.env.NEAR_NODE_URL = "https://rpc.testnet.near.org";
    process.env.NEAR_NETWORK_ID = "testnet";
    process.env.NEAR_CONTRACT_ID = "testContract";
    process.env.NEAR_BACKEND_ACCOUNT_ID = "testAccount";
    process.env.NEAR_BACKEND_PRIVATE_KEY = "testPrivateKey";

    service = nearChainService as any;
    // After the singleton's async init, mark it initialized and inject a mock account.
    ;(service as any).initialized = true;
    ;(service as any).account = { viewFunction: async () => ({}) };
  });

  afterEach(() => {
    // Clean up process.env so other test suites are not affected.
    delete process.env.NEAR_NODE_URL;
    delete process.env.NEAR_NETWORK_ID;
    delete process.env.NEAR_CONTRACT_ID;
    delete process.env.NEAR_BACKEND_ACCOUNT_ID;
    delete process.env.NEAR_BACKEND_PRIVATE_KEY;
  });

  it("extracts tx hash from outcome with transaction.hash", () => {
    const outcome = makeOutcome({
      transaction: {
        transaction: { hash: "valid-tx-hash-12345" },
      },
    });
    const result = (service as any).extractTxHash(outcome);
    expect(result).toBe("valid-tx-hash-12345");
  });

  it("extracts tx hash from outcome with transaction_hash", () => {
    const outcome = makeOutcome({ transaction_hash: "alt-hash-abcdef" });
    const result = (service as any).extractTxHash(outcome);
    expect(result).toBe("alt-hash-abcdef");
  });

  it("extracts tx hash from outcome with top-level hash", () => {
    const outcome = makeOutcome({ hash: "top-level-hash" });
    const result = (service as any).extractTxHash(outcome);
    expect(result).toBe("top-level-hash");
  });

  it("throws when outcome has no usable transaction hash", () => {
    const outcome = makeOutcome({});
    expect(() => (service as any).extractTxHash(outcome)).toThrow(
      "No transaction hash found in outcome"
    );
  });

  it("attest throws when no transaction hash is present", async () => {
    // Mock extractTxHash to throw on missing hash
    ;(service as any).extractTxHash = jest.fn().mockImplementation(() => {
      throw new Error("No transaction hash found in outcome");
    });

    // Mock ensureInitialized to not throw (it runs after our beforeEach sets initialized=true)
    ;(service as any).ensureInitialized = async () => {};

    await expect(
      service.attest("contributor", "owner/repo", 1, "PR Title", "user", "sha", Date.now())
    ).rejects.toThrow("No transaction hash found in outcome");
  });

  it("attest returns tx hash when outcome has valid hash", async () => {
    // Mock extractTxHash to return a valid hash
    ;(service as any).extractTxHash = jest.fn().mockReturnValue("0x123456789abcdef");

    // ensureInitialized is already a no-op due to beforeEach setting initialized=true
    const result = await service.attest(
      "contributor",
      "owner/repo",
      1,
      "PR Title",
      "user",
      "sha",
      Date.now()
    );
    expect(result).toBe("0x123456789abcdef");
  });
});