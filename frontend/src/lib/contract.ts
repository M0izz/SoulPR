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
