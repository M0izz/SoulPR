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
 * Gets the deployed NEAR contract config.
 */
export async function getContractConfig() {
  return {
    address: import.meta.env.VITE_NEAR_CONTRACT_ID ?? 'soulpr.testnet',
    network: 'NEAR testnet',
  };
}

/**
 * Queries the contract state on-chain to fetch all attestations owned by a NEAR account.
 */
export async function getAttestations(accountId: string): Promise<BadgeData[]> {
  if (!accountId) return [];
  const nodeUrl = import.meta.env.VITE_NEAR_NODE_URL ?? 'https://rpc.testnet.near.org';
  const contractId = import.meta.env.VITE_NEAR_CONTRACT_ID ?? 'soulpr.testnet';
  if (!contractId) return [];

  const call = async (methodName: string, args: object) => {
    const response = await fetch(nodeUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'soulpr',
        method: 'query',
        params: {
          request_type: 'call_function',
          finality: 'final',
          account_id: contractId,
          method_name: methodName,
          args_base64: btoa(JSON.stringify(args)),
        },
      }),
    });
    const json = await response.json();
    if (json.error) throw new Error(json.error.message ?? 'NEAR RPC error');
    return JSON.parse(new TextDecoder().decode(new Uint8Array(json.result.result)));
  };

  try {
    const ids: number[] = await call('nft_tokens_by_owner', { owner: accountId });
    if (!ids || ids.length === 0) return [];

    const badges: BadgeData[] = [];
    for (const id of ids) {
      const att = await call('nft_token', { token_id: id });
      if (!att) continue;
      badges.push({
        tokenId: Number(id),
        repo: att.repo,
        prNumber: Number(att.pr_number),
        prTitle: att.pr_title || 'OSS Contribution',
        githubUsername: att.github_username,
        mergeCommitSha: att.merge_commit_sha,
        contributor: att.contributor,
        mergeTimestamp: Number(att.merge_timestamp),
        txHash: '',
        network: 'NEAR testnet',
      });
    }
    return badges;
  } catch (e: unknown) {
    console.error('[Contract] Failed to fetch attestations on NEAR:', e instanceof Error ? e.message : e);
    return [];
  }
}
