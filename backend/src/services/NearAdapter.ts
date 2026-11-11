import type { Account, Connection } from "near-api-js";

const TESTNET_RPC_URL = "https://rpc.testnet.near.org";
const DEFAULT_GAS = "30000000000000";
const DEFAULT_DEPOSIT = "0";
const MAX_GAS = 300_000_000_000_000n;

export type NearTestnetConfig = {
  network: "testnet";
  rpcUrl: string;
  accountId: string;
  contractId: string;
  privateKey: string;
};

export type NearCall = {
  methodName: string;
  args: Record<string, unknown>;
  gas?: string;
  attachedDeposit?: string;
};

export type NearAccountClient = {
  viewFunction(input: { contractId: string; methodName: string; args: Record<string, unknown> }): Promise<unknown>;
  functionCall(input: {
    contractId: string;
    methodName: string;
    args: Record<string, unknown>;
    gas: string;
    attachedDeposit: string;
  }): Promise<{ transaction: { hash: string } }>;
};

function validateTestnetRpcUrl(value: string): void {
  let parsedRpcUrl: URL;
  try {
    parsedRpcUrl = new URL(value);
  } catch {
    throw new Error("NEAR_RPC_URL must be a valid HTTPS testnet endpoint");
  }
  const hostname = parsedRpcUrl.hostname.toLowerCase();
  if (
    parsedRpcUrl.protocol !== "https:" ||
    parsedRpcUrl.username ||
    parsedRpcUrl.password ||
    (hostname !== "testnet.near.org" && !hostname.endsWith(".testnet.near.org"))
  ) {
    throw new Error("NEAR_RPC_URL must be an HTTPS testnet endpoint");
  }
}

export function readNearTestnetConfig(env: NodeJS.ProcessEnv = process.env): NearTestnetConfig | null {
  if (!env.NEAR_NETWORK && !env.NEAR_RPC_URL && !env.NEAR_ACCOUNT_ID && !env.NEAR_CONTRACT_ID && !env.NEAR_PRIVATE_KEY) {
    return null;
  }
  if (env.NEAR_NETWORK !== "testnet") {
    throw new Error("NEAR_NETWORK must be explicitly set to testnet");
  }

  const rpcUrl = env.NEAR_RPC_URL ?? TESTNET_RPC_URL;
  validateTestnetRpcUrl(rpcUrl);

  const accountId = env.NEAR_ACCOUNT_ID;
  const contractId = env.NEAR_CONTRACT_ID;
  const privateKey = env.NEAR_PRIVATE_KEY;
  if (!accountId || !contractId || !privateKey) {
    throw new Error("NEAR_ACCOUNT_ID, NEAR_CONTRACT_ID, and NEAR_PRIVATE_KEY are required when NEAR is enabled");
  }
  if (!isValidAccountId(accountId) || !isValidAccountId(contractId)) {
    throw new Error("NEAR account IDs must be valid lowercase account names");
  }
  if (!privateKey.startsWith("ed25519:") || privateKey.length <= "ed25519:".length) {
    throw new Error("NEAR_PRIVATE_KEY must be an ed25519 key");
  }

  return { network: "testnet", rpcUrl, accountId, contractId, privateKey };
}

export function isValidAccountId(value: string): boolean {
  return value.length >= 2 && value.length <= 64 && /^[a-z0-9]+(?:[._-][a-z0-9]+)*$/.test(value);
}

function validateCall(call: NearCall): { methodName: string; args: Record<string, unknown>; gas: string; attachedDeposit: string } {
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(call.methodName)) {
    throw new Error("NEAR methodName must be a valid contract method name");
  }
  if (!call.args || Array.isArray(call.args) || typeof call.args !== "object") {
    throw new Error("NEAR args must be a JSON object");
  }
  const gas = call.gas ?? DEFAULT_GAS;
  const attachedDeposit = call.attachedDeposit ?? DEFAULT_DEPOSIT;
  if (!/^[1-9]\d*$/.test(gas) || BigInt(gas) > MAX_GAS) {
    throw new Error("NEAR gas must be a positive integer no greater than 300 Tgas");
  }
  if (!/^(0|[1-9]\d*)$/.test(attachedDeposit)) {
    throw new Error("NEAR attachedDeposit must be a non-negative integer in yoctoNEAR");
  }
  return { methodName: call.methodName, args: call.args, gas, attachedDeposit };
}

export class NearAdapter {
  constructor(
    private readonly config: Pick<NearTestnetConfig, "network" | "contractId">,
    private readonly account: NearAccountClient
  ) {
    if (config.network !== "testnet" || !isValidAccountId(config.contractId)) {
      throw new Error("NearAdapter only supports a valid NEAR testnet contract");
    }
  }

  async view(call: NearCall): Promise<unknown> {
    const validated = validateCall(call);
    return this.account.viewFunction({
      contractId: this.config.contractId,
      methodName: validated.methodName,
      args: validated.args,
    });
  }

  async call(call: NearCall): Promise<string> {
    const validated = validateCall(call);
    const result = await this.account.functionCall({
      contractId: this.config.contractId,
      methodName: validated.methodName,
      args: validated.args,
      gas: validated.gas,
      attachedDeposit: validated.attachedDeposit,
    });
    if (!result?.transaction?.hash) {
      throw new Error("NEAR testnet call did not return a transaction hash");
    }
    return result.transaction.hash;
  }
}

export async function createNearAdapter(config: NearTestnetConfig): Promise<NearAdapter> {
  if (
    config.network !== "testnet" ||
    !isValidAccountId(config.accountId) ||
    !isValidAccountId(config.contractId)
  ) {
    throw new Error("Invalid NEAR testnet configuration");
  }
  validateTestnetRpcUrl(config.rpcUrl);
  const { Account, KeyPair, connect, keyStores } = await import("near-api-js");
  const keyStore = new keyStores.InMemoryKeyStore();
  keyStore.setKey(config.network, config.accountId, KeyPair.fromString(config.privateKey));
  const near = await connect({ networkId: config.network, nodeUrl: config.rpcUrl, keyStore, headers: {} });
  const account = await near.account(config.accountId);
  return new NearAdapter(
    { network: config.network, contractId: config.contractId },
    {
      viewFunction: ({ contractId, methodName, args }) =>
        account.viewFunction(contractId, methodName, args),
      functionCall: async ({ contractId, methodName, args, gas, attachedDeposit }) => {
        const result = await account.functionCall({
          contractId,
          args,
          methodName,
          gas: new (require("bn.js"))(gas),
          attachedDeposit: new (require("bn.js"))(attachedDeposit),
        });
        return { transaction: { hash: result.transaction.hash } };
      },
    }
  );
}
