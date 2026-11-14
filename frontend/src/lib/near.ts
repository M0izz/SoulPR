/**
 * NearConnector — frontend NEAR integration for SIGNET.
 *
 * Connects the browser to a NEAR account so the user can link their
 * GitHub username to a NEAR account id and sign the link message.
 *
 * Three connection styles are supported:
 *   1. Injected `window.near` (NEAR wallet extension / Sender / Meteor).
 *   2. `near-api-js` BrowserLocalStorageKeyStore — web wallet login (MyNearWallet).
 *   3. Dev / Testnet Direct Key — local developer testing key store.
 */
import { KeyPair } from "near-api-js";

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

  /** Build the NEAR wallet login URL (MyNearWallet web wallet login flow). */
  loginUrl(successUrl: string): string {
    const { walletUrl } = this.config;
    const base = walletUrl || `https://testnet.mynearwallet.com`;
    const tmpKeyPair = KeyPair.fromRandom("ed25519");
    const publicKey = tmpKeyPair.getPublicKey().toString();
    
    // Save pending keypair in localStorage so we can retrieve it when the user is redirected back
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(`near-pending-key-${publicKey}`, tmpKeyPair.toString());
    }

    const params = new URLSearchParams({
      contract_id: this.config.contractId,
      success_url: successUrl,
      public_key: publicKey,
      meta: JSON.stringify({ app: "signet" }),
    });
    return `${base}/login/?${params.toString()}`;
  }

  /**
   * Complete web wallet login after redirect back from MyNearWallet
   */
  completeLogin(accountId: string, publicKey?: string): NearAccount {
    let resolvedPubKey = publicKey ?? "";
    if (typeof localStorage !== "undefined") {
      if (publicKey && localStorage.getItem(`near-pending-key-${publicKey}`)) {
        const key = localStorage.getItem(`near-pending-key-${publicKey}`)!;
        localStorage.setItem(`near-signet-${accountId}`, key);
        localStorage.removeItem(`near-pending-key-${publicKey}`);
      }
      
      const storedKey = localStorage.getItem(`near-signet-${accountId}`) || 
                        localStorage.getItem(`near-soulpr-${accountId}`);
      if (storedKey && !resolvedPubKey) {
        resolvedPubKey = KeyPair.fromString(storedKey).getPublicKey().toString();
      }
    }

    this.accountId = accountId;
    this.publicKey = resolvedPubKey;
    this.connected = true;
    return { accountId: this.accountId, publicKey: this.publicKey };
  }

  /**
   * Direct developer/testnet account creation/link for local or testnet validation
   */
  connectDevAccount(accountId: string): NearAccount {
    const cleanId = accountId.trim().toLowerCase();
    const storageKey = `near-signet-${cleanId}`;
    let keyPair: KeyPair;

    const existingKey = typeof localStorage !== "undefined" ? localStorage.getItem(storageKey) : null;
    if (existingKey) {
      keyPair = KeyPair.fromString(existingKey);
    } else {
      keyPair = KeyPair.fromRandom("ed25519");
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(storageKey, keyPair.toString());
      }
    }

    this.accountId = cleanId;
    this.publicKey = keyPair.getPublicKey().toString();
    this.connected = true;
    return { accountId: this.accountId, publicKey: this.publicKey };
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
   * Connect using stored keys in localStorage
   */
  async connectLocalStorage(): Promise<NearAccount> {
    if (typeof localStorage === "undefined") {
      throw new Error("localStorage is not available.");
    }

    const accounts = Object.keys(localStorage)
      .filter((key) => key.startsWith("near-signet-") || key.startsWith("near-soulpr-"))
      .map((key) => key.replace(/^near-(signet|soulpr)-/, ""));

    if (!accounts || accounts.length === 0) {
      throw new Error(
        "No NEAR account found in browser storage. Connect using MyNearWallet or enter your testnet account ID.",
      );
    }

    this.accountId = accounts[0];
    const key =
      localStorage.getItem(`near-signet-${this.accountId}`) ||
      localStorage.getItem(`near-soulpr-${this.accountId}`) ||
      "";
    const keyPair = KeyPair.fromString(key);
    this.publicKey = keyPair.getPublicKey().toString();
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
    const key =
      localStorage.getItem(`near-signet-${this.accountId}`) ||
      localStorage.getItem(`near-soulpr-${this.accountId}`);
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
  contractId: import.meta.env.VITE_NEAR_CONTRACT_ID ?? "signet.testnet",
  walletUrl: import.meta.env.VITE_NEAR_WALLET_URL ?? "https://testnet.mynearwallet.com",
});

export default nearConnector;
