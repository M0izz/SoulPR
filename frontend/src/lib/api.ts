const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:3001').replace(/\/+$/, '');

async function request(path: string, options: RequestInit = {}) {
  // Always include credentials (cookies) for session tracking
  options.credentials = 'include';
  options.headers = {
    ...options.headers,
    'Content-Type': 'application/json',
  };

  const response = await fetch(`${BACKEND_URL}${path}`, options);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error ?? `Request failed with status ${response.status}`);
  }
  return response.json();
}

export interface WalletStatusResponse {
  authenticated: boolean;
  githubUsername?: string;
  linked?: boolean;
  walletAddress?: string | null;
}

export interface RepoItem {
  fullName: string;
  tracked: boolean;
}

export interface ReposResponse {
  installationConfigured: boolean;
  repos: RepoItem[];
}

export const api = {
  /**
   * Checks session status: whether authenticated with GitHub and linked
   */
  async getWalletStatus(): Promise<WalletStatusResponse> {
    return request('/wallet/status');
  },

  /**
   * Resolves a wallet address or GitHub username to a linked wallet.
   */
  async resolveWallet(query: string): Promise<unknown | null> {
    const response = await fetch(`${BACKEND_URL}/wallet/resolve?query=${encodeURIComponent(query)}`, {
      credentials: 'include',
    });
    if (response.status === 404) return null;
    if (!response.ok) {
      throw new Error(`Wallet lookup failed with status ${response.status}`);
    }
    return response.json();
  },

  /**
   * Links a GitHub username to a wallet address using personal signature
   */
  async linkWallet(walletAddress: string, signature: string) {
    return request('/wallet/link', {
      method: 'POST',
      body: JSON.stringify({ walletAddress, signature }),
    });
  },

  /**
   * Clears user session
   */
  async logout() {
    return request('/wallet/logout', { method: 'POST' });
  },

  /**
   * Lists repositories for track settings
   */
  async getTrackedRepos(): Promise<ReposResponse> {
    return request('/repos');
  },

  /**
   * Saves updated repository settings
   */
  async saveTrackedRepos(trackedRepos: string[]) {
    return request('/repos', {
      method: 'POST',
      body: JSON.stringify({ trackedRepos }),
    });
  },
};

export default api;
