/**
 * NearConnector — frontend NEAR integration for SoulPR.
 *
 * Connects the browser to a NEAR account so the user can link their
 * GitHub username to a NEAR account id and sign the link message.
 *
 * Two connection styles are supported:
 *   1. Injected `window.near` (NEAR wallet extension / Sender) — preferred.
 *   2. `near-api-js` BrowserLocalStorageKeyStore — works after the user has
 *      completed a `near login` flow (access key stored in localStorage).
 *
 * For production, the NEAR Wallet Selector (@near-wallet-selector) is
 * recommended over this minimal connector.
 */
import { connect, keyStores, KeyPair } from "near-api-js";

export interface NearAccount {
  accountId: string;
  publicKey: string; // base58 NEAR public key (e.g. ed25519:...)
}

export interface NearConfig {
  nodeUrl: string;
  networkId: string;
  contractId: string;
  walletUrl?: string;
}

export class NearConnector {
  private config: NearConfig;
  private near: any = null;
  private accountId = "";
  private publicKey = "";
  private connected = false;

  constructor(config: NearConfig) {
    this.config = config;
  }

  get isConnected(): boolean {
    return this.connected;
  }
  get account(): string {
    return this.accountId;
  }
  get pubKey(): string {
    return this.publicKey;
  }

  /** Build the NEAR wallet login URL (standard near.login flow). */
  loginUrl(successUrl: string): string {
    const { networkId, walletUrl } = this.config;
    const base = walletUrl || `https://wallet.${networkId}.near.org`;
    const tmpKeyPair = KeyPair.fromRandom("ed25519");
    const publicKey = tmpKeyPair.getPublicKey().toString();
    const params = new URLSearchParams({
      contract_id: this.config.contractId,
      success_url: successUrl,
      public_key: publicKey,
      meta: JSON.stringify({ app: "soulpr" }),
    });
    return `${base}/login/?${params.toString()}`;
  }

  /** Connect using an injected window.near provider, if available. */
  async connectInjected(): Promise<NearAccount> {
    const near = (window as any).near;
    if (!near) {
      throw new Error("No injected NEAR provider (window.near) found.");
    }

    await near.connect?.({
      networkId: this.config.networkId,
      nodeUrl: this.config.nodeUrl,
      walletUrl: this.config.walletUrl,
    });

    const authData = near.authData?.[this.config.networkId];
    if (!authData) {
      throw new Error("Not signed in to NEAR. Complete the wallet login flow first.");
    }

    this.accountId = authData.account_id;
    this.publicKey = authData.public_key;
    this.near = near;
    this.connected = true;

    return { accountId: this.accountId, publicKey: this.publicKey };
  }

  /**
   * Connect using near-api-js with a BrowserLocalStorageKeyStore.
   * Requires the user to have already stored an access key (e.g. after
   * a `near login` redirect back to this origin).
   */
  async connectLocalStorage(): Promise<NearAccount> {
    const keyStore = new keyStores.BrowserLocalStorageKeyStore({
      keyPrefix: "near-soulpr-",
    });

    const near = await connect({
      nodeUrl: this.config.nodeUrl,
      networkId: this.config.networkId,
      keyStore,
      headers: {},
    });

    // Enumerate stored accounts and pick the first one.
    const accounts = Object.keys(localStorage)
      .filter((key) => key.startsWith("near-soulpr-"))
      .map((key) => key.slice("near-soulpr-".length));
    if (!accounts || accounts.length === 0) {
      throw new Error(
        "No NEAR access key in localStorage. Sign in via the NEAR wallet login URL first.",
      );
    }

    this.accountId = accounts[0];
    const keyPair = KeyPair.fromString(localStorage.getItem(`near-soulpr-${this.accountId}`) ?? "");
    this.publicKey = keyPair.getPublicKey().toString();
    this.near = near;
    this.connected = true;

    return { accountId: this.accountId, publicKey: this.publicKey };
  }

  /** Connect using whichever method is available (injected first). */
  async connect(): Promise<NearAccount> {
    if ((window as any).near) {
      return this.connectInjected();
    }
    return this.connectLocalStorage();
  }

  /** Sign an arbitrary message with the connected NEAR account's key. */
  async signMessage(message: string): Promise<string> {
    if (!this.connected) {
      throw new Error("NEAR connector not connected. Call connect() first.");
    }

    // Prefer the injected provider's signMessage if available.
    const near = this.near ?? (window as any).near;
    if (near?.connection?.signMessage) {
      const signed = await near.connection.signMessage(
        this.accountId,
        Buffer.from(message, "utf8"),
      );
      return signed.signature; // base64
    }

    // Fallback: sign via the localStorage key store.
    const key = localStorage.getItem(`near-soulpr-${this.accountId}`);
    if (!key) throw new Error("No local NEAR key available for signing.");
    const signed = KeyPair.fromString(key).sign(Buffer.from(message, "utf8"));
    return Buffer.from(signed.signature).toString("base64");
  }

  /** Disconnect / clear session state. */
  disconnect(): void {
    this.near = null;
    this.accountId = "";
    this.publicKey = "";
    this.connected = false;
  }
}

export const nearConnector = new NearConnector({
  nodeUrl: import.meta.env.VITE_NEAR_NODE_URL ?? "https://rpc.testnet.near.org",
  networkId: import.meta.env.VITE_NEAR_NETWORK_ID ?? "testnet",
  contractId: import.meta.env.VITE_NEAR_CONTRACT_ID ?? "soulpr.testnet",
  walletUrl: import.meta.env.VITE_NEAR_WALLET_URL,
});

export default nearConnector;
