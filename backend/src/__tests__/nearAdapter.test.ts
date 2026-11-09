import {
  NearAccountClient,
  NearAdapter,
  createNearAdapter,
  readNearTestnetConfig,
} from "../services/NearAdapter";

const config = {
  network: "testnet" as const,
  contractId: "soulpr.testnet",
};

function createAccount(): jest.Mocked<NearAccountClient> {
  return {
    viewFunction: jest.fn().mockResolvedValue({ ok: true }),
    functionCall: jest.fn().mockResolvedValue({ transaction: { hash: "testnet-hash" } }),
  };
}

describe("NEAR testnet adapter", () => {
  it("leaves NEAR disabled when no NEAR environment variables are set", () => {
    expect(readNearTestnetConfig({} as NodeJS.ProcessEnv)).toBeNull();
  });

  it("requires explicit testnet configuration and complete credentials", () => {
    expect(() => readNearTestnetConfig({ NEAR_NETWORK: "mainnet" } as NodeJS.ProcessEnv))
      .toThrow("NEAR_NETWORK must be explicitly set to testnet");
    expect(() => readNearTestnetConfig({ NEAR_NETWORK: "testnet" } as NodeJS.ProcessEnv))
      .toThrow("NEAR_ACCOUNT_ID, NEAR_CONTRACT_ID, and NEAR_PRIVATE_KEY are required");
  });

  it("rejects non-testnet RPC endpoints and invalid account identifiers", () => {
    const baseEnv = {
      NEAR_NETWORK: "testnet",
      NEAR_ACCOUNT_ID: "soulpr.testnet",
      NEAR_CONTRACT_ID: "soulpr.testnet",
      NEAR_PRIVATE_KEY: "ed25519:placeholder",
    };
    expect(() => readNearTestnetConfig({ ...baseEnv, NEAR_RPC_URL: "https://rpc.mainnet.near.org" } as NodeJS.ProcessEnv))
      .toThrow("NEAR_RPC_URL must be an HTTPS testnet endpoint");
    expect(() => readNearTestnetConfig({ ...baseEnv, NEAR_ACCOUNT_ID: "Invalid.testnet" } as NodeJS.ProcessEnv))
      .toThrow("NEAR account IDs must be valid lowercase account names");
    expect(() => readNearTestnetConfig({ ...baseEnv, NEAR_ACCOUNT_ID: "soulpr..testnet" } as NodeJS.ProcessEnv))
      .toThrow("NEAR account IDs must be valid lowercase account names");
  });

  it("loads the default testnet endpoint only after explicit configuration", () => {
    expect(readNearTestnetConfig({
      NEAR_NETWORK: "testnet",
      NEAR_ACCOUNT_ID: "soulpr.testnet",
      NEAR_CONTRACT_ID: "soulpr.testnet",
      NEAR_PRIVATE_KEY: "ed25519:placeholder",
    } as NodeJS.ProcessEnv)).toEqual({
      network: "testnet",
      rpcUrl: "https://rpc.testnet.near.org",
      accountId: "soulpr.testnet",
      contractId: "soulpr.testnet",
      privateKey: "ed25519:placeholder",
    });
  });

  it("validates view calls and delegates to the configured testnet contract", async () => {
    const account = createAccount();
    const adapter = new NearAdapter(config, account);

    await expect(adapter.view({ methodName: "get_receipt", args: { id: "pr-1" } }))
      .resolves.toEqual({ ok: true });
    expect(account.viewFunction).toHaveBeenCalledWith({
      contractId: "soulpr.testnet",
      methodName: "get_receipt",
      args: { id: "pr-1" },
    });
    await expect(adapter.view({ methodName: "bad method", args: {} }))
      .rejects.toThrow("NEAR methodName must be a valid contract method name");
  });

  it("submits a contract call through the injected account without creating a signer in tests", async () => {
    const account = createAccount();
    const adapter = new NearAdapter(config, account);

    await expect(adapter.call({ methodName: "record_receipt", args: { id: "pr-1" } }))
      .resolves.toBe("testnet-hash");
    expect(account.functionCall).toHaveBeenCalledWith({
      contractId: "soulpr.testnet",
      methodName: "record_receipt",
      args: { id: "pr-1" },
      gas: "30000000000000",
      attachedDeposit: "0",
    });
    await expect(adapter.call({ methodName: "record_receipt", args: {}, gas: "300000000000001" }))
      .rejects.toThrow("NEAR gas must be a positive integer no greater than 300 Tgas");
  });

  it("rejects a mainnet endpoint even when the SDK factory is called directly", async () => {
    await expect(createNearAdapter({
      network: "testnet",
      rpcUrl: "https://rpc.mainnet.near.org",
      accountId: "soulpr.testnet",
      contractId: "soulpr.testnet",
      privateKey: "ed25519:placeholder",
    })).rejects.toThrow("NEAR_RPC_URL must be an HTTPS testnet endpoint");
  });
});
