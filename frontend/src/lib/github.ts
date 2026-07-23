export interface GitHubStats {
  username: string;
  name: string;
  avatarUrl: string;
  publicRepos: number;
  followers: number;
  createdAt: string;
  mergedPrCount: number;
  totalPrCount: number;
}

const statsCache: Record<string, { data: GitHubStats; timestamp: number }> = {};
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache

export async function fetchGitHubUserStats(username: string): Promise<GitHubStats | null> {
  const cleanUser = username.trim().replace(/^@/, '').toLowerCase();
  if (!cleanUser) return null;

  const now = Date.now();
  if (statsCache[cleanUser] && now - statsCache[cleanUser].timestamp < CACHE_TTL_MS) {
    return statsCache[cleanUser].data;
  }

  try {
    const userRes = await fetch(`https://api.github.com/users/${encodeURIComponent(cleanUser)}`, {
      headers: { Accept: 'application/vnd.github.v3+json' },
    });

    if (!userRes.ok) {
      console.warn(`[GitHub API] User fetch failed for '${cleanUser}': status ${userRes.status}`);
      return null;
    }

    const userData = await userRes.json();

    let mergedPrCount = 0;
    let totalPrCount = 0;

    try {
      const prRes = await fetch(
        `https://api.github.com/search/issues?q=author:${encodeURIComponent(cleanUser)}+type:pr+is:merged`,
        { headers: { Accept: 'application/vnd.github.v3+json' } }
      );
      if (prRes.ok) {
        const prData = await prRes.json();
        mergedPrCount = prData.total_count ?? 0;
      }

      const totalPrRes = await fetch(
        `https://api.github.com/search/issues?q=author:${encodeURIComponent(cleanUser)}+type:pr`,
        { headers: { Accept: 'application/vnd.github.v3+json' } }
      );
      if (totalPrRes.ok) {
        const totalPrData = await totalPrRes.json();
        totalPrCount = totalPrData.total_count ?? 0;
      }
    } catch (err) {
      console.warn('[GitHub API] Failed fetching PR search stats:', err);
    }

    const stats: GitHubStats = {
      username: userData.login || cleanUser,
      name: userData.name || userData.login || cleanUser,
      avatarUrl: userData.avatar_url || '',
      publicRepos: userData.public_repos ?? 0,
      followers: userData.followers ?? 0,
      createdAt: userData.created_at || new Date().toISOString(),
      mergedPrCount,
      totalPrCount,
    };

    statsCache[cleanUser] = { data: stats, timestamp: now };
    return stats;
  } catch (err) {
    console.error('[GitHub API] Error fetching user stats:', err);
    return null;
  }
}
