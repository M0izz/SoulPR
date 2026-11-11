import { ethers } from 'ethers';

// Minimal ABI array to query the contract state
const MINIMAL_ABI = [
  'function minted(bytes32 key) external view returns (bool)',
  'function attestations(uint256 tokenId) external view returns (address contributor, string repo, uint256 prNumber, string prTitle, string githubUsername, string mergeCommitSha, uint256 mergeTimestamp)',
  'function tokensByOwner(address owner) external view returns (uint256[] memory)',
  'function tokenURI(uint256 tokenId) external view returns (string memory)',
  'event Attested(address indexed contributor, string repo, uint256 prNumber, string prTitle, string githubUsername, string mergeCommitSha, uint256 mergeTimestamp, uint256 tokenId)'
];

export interface BadgeData {
  tokenId: number;
  repo: string;
  prNumber: number;
  prTitle: string;
  githubUsername?: string;
  mergeCommitSha?: string;
  contributor: string;
  mergeTimestamp: number;
  txHash: string;
  network: string;
}

/**
 * Gets the deployed contract config.
 * Checks for monadTestnet first, then falls back to hardhat, then returns null.
 */
export async function getContractConfig() {
  if ((import.meta.env.VITE_NEAR_ENABLED ?? 'false') === 'true') {
    return {
      address: import.meta.env.VITE_NEAR_CONTRACT_ID ?? '',
      network: 'NEAR testnet',
    };
  }
  try {
    // Vite supports import.meta.glob or dynamic import
    // Let's try importing monadTestnet first, then hardhat
    try {
      const config = await import('../deployments/monadTestnet.json');
      return { address: config.address, network: 'Monad testnet' };
    } catch {
      const config = await import('../deployments/hardhat.json');
      return { address: config.address, network: 'Hardhat Local' };
    }
  } catch {
    return null;
  }
}

/**
 * Queries the contract state on-chain to fetch all attestations owned by an address.
 */
export async function getAttestations(walletAddress: string): Promise<BadgeData[]> {
  if ((import.meta.env.VITE_NEAR_ENABLED ?? 'false') === 'true') {
    return getNearAttestations(walletAddress);
  }
  if (!ethers.isAddress(walletAddress)) {
    return [];
  }

  const config = await getContractConfig();
  if (!config) {
    console.warn('[Contract] No contract deployment file found. Returning empty list.');
    return [];
  }

  // Use Monad RPC or local hardhat node
  const rpcUrl = config.network === 'Monad testnet' 
    ? 'https://testnet-rpc.monad.xyz' 
    : 'http://localhost:8545';

  try {
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const contract = new ethers.Contract(config.address, MINIMAL_ABI, provider);

    // 1. Get owned token IDs
    const tokenIds: bigint[] = await contract.tokensByOwner(walletAddress);
    if (tokenIds.length === 0) return [];

    const badges: BadgeData[] = [];

    // 2. Fetch details for each token
    for (const id of tokenIds) {
      const tokenId = Number(id);
      const att = await contract.attestations(tokenId);

      badges.push({
        tokenId,
        repo: att.repo,
        prNumber: Number(att.prNumber),
        prTitle: att.prTitle || 'OSS Contribution',
        githubUsername: att.githubUsername,
        mergeCommitSha: att.mergeCommitSha,
        contributor: att.contributor,
        mergeTimestamp: Number(att.mergeTimestamp),
        // Since we are reading state, we use dummy tx hash or query logs for it if needed
        txHash: '0x' + '0'.repeat(64), 
        network: config.network,
      });
    }

    return badges;
  } catch (e: any) {
    console.error('[Contract] Failed to fetch attestations on-chain:', e.message);
    throw e;
  }
}

async function getNearAttestations(accountId: string): Promise<BadgeData[]> {
  if (!accountId || !accountId.includes('.')) return [];
  const nodeUrl = import.meta.env.VITE_NEAR_NODE_URL ?? 'https://rpc.testnet.near.org';
  const contractId = import.meta.env.VITE_NEAR_CONTRACT_ID ?? '';
  if (!contractId) return [];
  const call = async (methodName: string, args: object) => {
    const response = await fetch(nodeUrl, {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 'soulpr', method: 'query', params: {
        request_type: 'call_function', finality: 'final', account_id: contractId,
        method_name: methodName, args_base64: btoa(JSON.stringify(args)),
      }}),
    });
    const json = await response.json();
    if (json.error) throw new Error(json.error.message ?? 'NEAR RPC error');
    return JSON.parse(new TextDecoder().decode(new Uint8Array(json.result.result)));
  };
  const ids: number[] = await call('nft_tokens_by_owner', { owner: accountId });
  const badges: BadgeData[] = [];
  for (const id of ids) {
    const att = await call('nft_token', { token_id: id });
    if (!att) continue;
    badges.push({ tokenId: Number(id), repo: att.repo, prNumber: Number(att.pr_number),
      prTitle: att.pr_title || 'OSS Contribution', githubUsername: att.github_username,
      mergeCommitSha: att.merge_commit_sha, contributor: att.contributor,
      mergeTimestamp: Number(att.merge_timestamp), txHash: '', network: 'NEAR testnet' });
  }
  return badges;
}
