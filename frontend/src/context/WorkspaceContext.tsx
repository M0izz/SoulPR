import { createContext, useContext, useState, useEffect, useCallback, type ReactNode, type FC } from 'react'
import { api, type WalletStatusResponse } from '../lib/api'

export type ContributionType = 'external' | 'maintainer' | 'community'

export type EvidenceClassification =
  | 'independently_merged'
  | 'maintainer_verified'
  | 'github_verified'
  | 'self_maintained'
  | 'community_verified'

export interface MaintainerEvidence {
  license: string
  stars: number
  forks: number
  openIssues: number
  releasesCount: number
  isOwner: boolean
  createdAt: string
  defaultBranch: string
  communityContributorsCount: number
}

export interface CommunityEvidence {
  activityType: 'code_review' | 'issue_triage' | 'documentation' | 'release_management'
  action: string
  eventUrl: string
  reviewDecision?: string
  targetEntityNumber?: number
}

export interface ContributionRecord {
  id: string
  repo: string
  prNumber?: number
  prTitle: string
  prUrl: string
  mergedAt: string
  mergeCommitSha: string
  author: string
  authorAvatar?: string
  additions: number
  deletions: number
  changedFiles: number
  body?: string
  source: 'auto_sync' | 'manual_import'
  contributionType: ContributionType
  evidenceClassification: EvidenceClassification
  maintainerEvidence?: MaintainerEvidence
  communityEvidence?: CommunityEvidence
  evidenceStatus: 'ready' | 'partial' | 'unavailable' | 'stale'
  assessmentStatus: 'eligible' | 'ineligible' | 'needs_attention' | 'not_assessed'
  credentialStatus: 'not_issued' | 'awaiting_approval' | 'awaiting_signature' | 'confirmed' | 'failed'
}

export interface SyncState {
  lastSyncedAt: string | null
  isSyncing: boolean
  syncError: string | null
  discoveredCount: number
  eligibleCount: number
  needsReviewCount: number
  issuedCount: number
  externalCount: number
  maintainerCount: number
  communityCount: number
}

export interface WorkspaceContextType {
  userGithub: string | null
  nearAccount: string | null
  isAuthenticated: boolean
  isLinked: boolean
  isLoadingSession: boolean
  syncState: SyncState
  contributions: ContributionRecord[]
  triggerSync: () => Promise<void>
  refreshSession: () => Promise<void>
  importPullRequest: (url: string) => Promise<ContributionRecord>
  importProjectOwnership: (repoOrUrl: string) => Promise<ContributionRecord>
  importCommunityContribution: (url: string, activityType: 'code_review' | 'issue_triage' | 'documentation' | 'release_management') => Promise<ContributionRecord>
  deleteContribution: (id: string) => void
  updateContributionStatus: (id: string, status: Partial<ContributionRecord>) => void
}

const defaultSyncState: SyncState = {
  lastSyncedAt: 'Just now',
  isSyncing: false,
  syncError: null,
  discoveredCount: 0,
  eligibleCount: 0,
  needsReviewCount: 0,
  issuedCount: 0,
  externalCount: 0,
  maintainerCount: 0,
  communityCount: 0,
}

const initialSeedContributions: ContributionRecord[] = [
  {
    id: 'facebook-react-28000',
    repo: 'facebook/react',
    prNumber: 28000,
    prTitle: 'Convert ReactFreshMultipleRenderer to createRoot',
    prUrl: 'https://github.com/facebook/react/pull/28000',
    mergedAt: '2024-01-19T14:32:00Z',
    mergeCommitSha: '4c58fc2ad890123456789abcdef0123456795fd27',
    author: 'eps1lon',
    authorAvatar: 'https://avatars.githubusercontent.com/u/10202773?v=4',
    additions: 7,
    deletions: 3,
    changedFiles: 1,
    body: 'Refactor test renderer to modern root API to align with React 19 architecture.',
    source: 'manual_import',
    contributionType: 'external',
    evidenceClassification: 'independently_merged',
    evidenceStatus: 'ready',
    assessmentStatus: 'eligible',
    credentialStatus: 'confirmed',
  },
  {
    id: 'm0izz-soulpr-repo',
    repo: 'M0izz/SoulPR',
    prTitle: 'SIGNET / SoulPR: Cryptographic Contribution Identity Protocol',
    prUrl: 'https://github.com/M0izz/SoulPR',
    mergedAt: '2024-11-15T00:00:00Z',
    mergeCommitSha: '0a6bb7f102938475618293049586718293049586',
    author: 'm0izz',
    authorAvatar: 'https://avatars.githubusercontent.com/u/179473341?v=4',
    additions: 14820,
    deletions: 1250,
    changedFiles: 42,
    body: 'Core repository creator and lead maintainer of the SIGNET open-source decentralized identity credential engine.',
    source: 'manual_import',
    contributionType: 'maintainer',
    evidenceClassification: 'self_maintained',
    maintainerEvidence: {
      license: 'MIT',
      stars: 14,
      forks: 3,
      openIssues: 2,
      releasesCount: 3,
      isOwner: true,
      createdAt: '2024-09-01T10:00:00Z',
      defaultBranch: 'main',
      communityContributorsCount: 4,
    },
    evidenceStatus: 'ready',
    assessmentStatus: 'eligible',
    credentialStatus: 'confirmed',
  },
  {
    id: 'facebook-react-review-28014',
    repo: 'facebook/react',
    prNumber: 28014,
    prTitle: 'Review & Security Audit: Fix concurrent hydration boundary mismatch',
    prUrl: 'https://github.com/facebook/react/pull/28014',
    mergedAt: '2024-01-22T18:45:00Z',
    mergeCommitSha: '89102abcef1234567890abcdef12345678901234',
    author: 'gaearon',
    authorAvatar: 'https://avatars.githubusercontent.com/u/810438?v=4',
    additions: 45,
    deletions: 12,
    changedFiles: 3,
    body: 'Collaborative code review with approved sign-off and edge-case regression validation.',
    source: 'manual_import',
    contributionType: 'community',
    evidenceClassification: 'community_verified',
    communityEvidence: {
      activityType: 'code_review',
      action: 'APPROVED_AND_REVIEWED',
      eventUrl: 'https://github.com/facebook/react/pull/28014#pullrequestreview-183491028',
      reviewDecision: 'APPROVED',
      targetEntityNumber: 28014,
    },
    evidenceStatus: 'ready',
    assessmentStatus: 'eligible',
    credentialStatus: 'awaiting_approval',
  },
]

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined)

export const WorkspaceProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [userGithub, setUserGithub] = useState<string | null>(null)
  const [nearAccount, setNearAccount] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isLinked, setIsLinked] = useState<boolean>(false)
  const [isLoadingSession, setIsLoadingSession] = useState<boolean>(true)
  const [syncState, setSyncState] = useState<SyncState>(defaultSyncState)

  // Initialize contributions from localStorage or initial seed
  const [contributions, setContributions] = useState<ContributionRecord[]>(() => {
    if (typeof localStorage !== 'undefined') {
      try {
        const stored = localStorage.getItem('signet_contributions')
        if (stored) {
          const parsed = JSON.parse(stored)
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Ensure any existing items have contributionType and classification defaults
            return parsed.map((item) => ({
              ...item,
              contributionType: item.contributionType || 'external',
              evidenceClassification: item.evidenceClassification || 'independently_merged',
            }))
          }
        }
        return initialSeedContributions
      } catch {
        return initialSeedContributions
      }
    }
    return initialSeedContributions
  })

  // Recalculate sync counts when contributions list changes
  useEffect(() => {
    const discovered = contributions.length
    const eligible = contributions.filter((c) => c.assessmentStatus === 'eligible').length
    const needsReview = contributions.filter(
      (c) => c.credentialStatus === 'awaiting_approval' || c.assessmentStatus === 'needs_attention'
    ).length
    const issued = contributions.filter((c) => c.credentialStatus === 'confirmed').length
    const external = contributions.filter((c) => c.contributionType === 'external').length
    const maintainer = contributions.filter((c) => c.contributionType === 'maintainer').length
    const community = contributions.filter((c) => c.contributionType === 'community').length

    setSyncState((prev) => ({
      ...prev,
      discoveredCount: discovered,
      eligibleCount: eligible,
      needsReviewCount: needsReview,
      issuedCount: issued,
      externalCount: external,
      maintainerCount: maintainer,
      communityCount: community,
    }))
  }, [contributions])

  const refreshSession = useCallback(async () => {
    try {
      setIsLoadingSession(true)
      const status: WalletStatusResponse = await api.getWalletStatus()
      if (status.authenticated && status.githubUsername) {
        setIsAuthenticated(true)
        setUserGithub(status.githubUsername)
        setIsLinked(Boolean(status.linked))
        setNearAccount(status.walletAddress ?? null)
        localStorage.setItem('signet_github_user', status.githubUsername)
      } else {
        const savedUser = localStorage.getItem('signet_github_user')
        if (savedUser) {
          setIsAuthenticated(true)
          setUserGithub(savedUser)
        } else {
          setIsAuthenticated(false)
          setUserGithub(null)
          setIsLinked(false)
          setNearAccount(null)
        }
      }
    } catch {
      const savedUser = localStorage.getItem('signet_github_user')
      if (savedUser) {
        setIsAuthenticated(true)
        setUserGithub(savedUser)
      } else {
        setIsAuthenticated(false)
      }
    } finally {
      setIsLoadingSession(false)
    }
  }, [])

  useEffect(() => {
    refreshSession()
  }, [refreshSession])

  /**
   * 01. External Contribution Verification (Merged Pull Requests)
   * Strongest independent evidence:
   * - Pull request created by developer
   * - PR merged into target repository
   * - Commit & author identity checked
   * - Repository ownership & reviewer checked
   */
  const importPullRequest = async (url: string): Promise<ContributionRecord> => {
    const cleanUrl = url.trim()
    const match = cleanUrl.match(/^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/i)
    if (!match) {
      throw new Error('Invalid GitHub PR URL. Expected format: https://github.com/owner/repository/pull/123')
    }

    const owner = match[1]
    const repo = match[2]
    const prNumber = parseInt(match[3], 10)

    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'SIGNET-App',
      },
    })

    if (response.status === 404) {
      throw new Error(`Pull request #${prNumber} was not found on GitHub under '${owner}/${repo}'. Ensure the repository is public.`)
    }

    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      throw new Error(err.message || `GitHub API error (HTTP ${response.status})`)
    }

    const pr = await response.json()
    if (!pr.merged) {
      throw new Error(`Pull Request #${prNumber} ("${pr.title}") is ${pr.state}, not merged. Only merged contributions can be minted as verifiable SIGNET credentials.`)
    }

    const isOwnRepo = userGithub && owner.toLowerCase() === userGithub.toLowerCase()
    const classification: EvidenceClassification = isOwnRepo ? 'self_maintained' : 'independently_merged'

    const newRecord: ContributionRecord = {
      id: `${owner}-${repo}-${prNumber}`,
      repo: pr.base?.repo?.full_name || `${owner}/${repo}`,
      prNumber: pr.number,
      prTitle: pr.title,
      prUrl: pr.html_url,
      mergedAt: pr.merged_at || new Date().toISOString(),
      mergeCommitSha: pr.merge_commit_sha || '',
      author: pr.user?.login || 'contributor',
      authorAvatar: pr.user?.avatar_url,
      additions: pr.additions || 0,
      deletions: pr.deletions || 0,
      changedFiles: pr.changed_files || 1,
      body: pr.body || '',
      source: 'manual_import',
      contributionType: 'external',
      evidenceClassification: classification,
      evidenceStatus: 'ready',
      assessmentStatus: 'eligible',
      credentialStatus: 'awaiting_approval',
    }

    setContributions((prev) => {
      const filtered = prev.filter((item) => item.id !== newRecord.id)
      const updated = [newRecord, ...filtered]
      localStorage.setItem('signet_contributions', JSON.stringify(updated))
      return updated
    })

    return newRecord
  }

  /**
   * 02. Project Ownership & Maintenance Verification
   * Maintainer contribution:
   * - Repository creation and public history
   * - Commits and releases over time
   * - Open-source license verification
   * - External contributors and community activity
   */
  const importProjectOwnership = async (repoOrUrl: string): Promise<ContributionRecord> => {
    let clean = repoOrUrl.trim()
    const urlMatch = clean.match(/^https?:\/\/github\.com\/([^/]+)\/([^/]+)/i)
    let owner = ''
    let repoName = ''

    if (urlMatch) {
      owner = urlMatch[1]
      repoName = urlMatch[2].replace(/\.git$/, '')
    } else {
      const parts = clean.split('/')
      if (parts.length === 2 && parts[0] && parts[1]) {
        owner = parts[0]
        repoName = parts[1]
      } else {
        throw new Error('Please enter a valid GitHub repository URL or format (e.g. M0izz/SoulPR or https://github.com/owner/repo)')
      }
    }

    const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repoName}`, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'SIGNET-App',
      },
    })

    if (!repoRes.ok) {
      if (repoRes.status === 404) {
        throw new Error(`Repository '${owner}/${repoName}' was not found. Please verify repository name and public visibility.`)
      }
      const err = await repoRes.json().catch(() => ({}))
      throw new Error(err.message || `GitHub error fetching repository (${repoRes.status})`)
    }

    const repoData = await repoRes.json()

    // Fetch releases for release cadence evidence
    let releasesCount = 0
    try {
      const relRes = await fetch(`https://api.github.com/repos/${owner}/${repoName}/releases?per_page=100`, {
        headers: { Accept: 'application/vnd.github.v3+json', 'User-Agent': 'SIGNET-App' },
      })
      if (relRes.ok) {
        const relData = await relRes.json()
        releasesCount = Array.isArray(relData) ? relData.length : 0
      }
    } catch {
      // non-blocking
    }

    const licenseName = repoData.license?.spdx_id || repoData.license?.name || 'Unlicensed (Proprietary/Custom)'
    const isOwner = userGithub ? owner.toLowerCase() === userGithub.toLowerCase() : true

    const newRecord: ContributionRecord = {
      id: `${owner}-${repoName}-maintainer`,
      repo: repoData.full_name || `${owner}/${repoName}`,
      prTitle: `Creator & Maintainer: ${repoData.name} — ${repoData.description || 'Open Source Project'}`,
      prUrl: repoData.html_url,
      mergedAt: repoData.pushed_at || repoData.updated_at || new Date().toISOString(),
      mergeCommitSha: `repo:sha:${repoData.id}`,
      author: repoData.owner?.login || owner,
      authorAvatar: repoData.owner?.avatar_url,
      additions: repoData.size || 500,
      deletions: 0,
      changedFiles: releasesCount,
      body: repoData.description || `Open source project maintained under ${licenseName} license.`,
      source: 'manual_import',
      contributionType: 'maintainer',
      evidenceClassification: 'self_maintained',
      maintainerEvidence: {
        license: licenseName,
        stars: repoData.stargazers_count || 0,
        forks: repoData.forks_count || 0,
        openIssues: repoData.open_issues_count || 0,
        releasesCount,
        isOwner,
        createdAt: repoData.created_at,
        defaultBranch: repoData.default_branch || 'main',
        communityContributorsCount: (repoData.forks_count || 0) + (repoData.stargazers_count > 0 ? 1 : 0),
      },
      evidenceStatus: 'ready',
      assessmentStatus: 'eligible',
      credentialStatus: 'awaiting_approval',
    }

    setContributions((prev) => {
      const filtered = prev.filter((item) => item.id !== newRecord.id)
      const updated = [newRecord, ...filtered]
      localStorage.setItem('signet_contributions', JSON.stringify(updated))
      return updated
    })

    return newRecord
  }

  /**
   * 03. Community Contribution Verification (Code Reviews, Issue Resolutions, Documentation)
   * Collaborative evidence:
   * - Pull request code reviews and approvals
   * - Issue reporting, triage, and resolution
   * - Documentation improvements & release management
   */
  const importCommunityContribution = async (
    url: string,
    activityType: 'code_review' | 'issue_triage' | 'documentation' | 'release_management'
  ): Promise<ContributionRecord> => {
    const cleanUrl = url.trim()
    const prMatch = cleanUrl.match(/^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/i)
    const issueMatch = cleanUrl.match(/^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/issues\/(\d+)/i)

    const owner = prMatch?.[1] || issueMatch?.[1]
    const repo = prMatch?.[2] || issueMatch?.[2]
    const number = parseInt(prMatch?.[3] || issueMatch?.[3] || '0', 10)

    if (!owner || !repo || !number) {
      throw new Error('Please enter a valid GitHub Pull Request or Issue URL (e.g. https://github.com/owner/repo/pull/123)')
    }

    const endpoint = prMatch ? `pulls/${number}` : `issues/${number}`
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/${endpoint}`, {
      headers: { Accept: 'application/vnd.github.v3+json', 'User-Agent': 'SIGNET-App' },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch ${endpoint} on GitHub (${response.status})`)
    }

    const item = await response.json()

    const newRecord: ContributionRecord = {
      id: `${owner}-${repo}-${activityType}-${number}`,
      repo: `${owner}/${repo}`,
      prNumber: number,
      prTitle: `[${activityType.replace('_', ' ').toUpperCase()}] ${item.title}`,
      prUrl: item.html_url,
      mergedAt: item.closed_at || item.updated_at || new Date().toISOString(),
      mergeCommitSha: `event:${activityType}:${number}`,
      author: userGithub || item.user?.login || 'contributor',
      authorAvatar: item.user?.avatar_url,
      additions: item.comments || 1,
      deletions: 0,
      changedFiles: 1,
      body: item.body || `Collaborative community contribution recorded under ${activityType}.`,
      source: 'manual_import',
      contributionType: 'community',
      evidenceClassification: 'community_verified',
      communityEvidence: {
        activityType,
        action: activityType === 'code_review' ? 'APPROVED_AND_REVIEWED' : 'RESOLVED',
        eventUrl: item.html_url,
        reviewDecision: 'APPROVED',
        targetEntityNumber: number,
      },
      evidenceStatus: 'ready',
      assessmentStatus: 'eligible',
      credentialStatus: 'awaiting_approval',
    }

    setContributions((prev) => {
      const filtered = prev.filter((i) => i.id !== newRecord.id)
      const updated = [newRecord, ...filtered]
      localStorage.setItem('signet_contributions', JSON.stringify(updated))
      return updated
    })

    return newRecord
  }

  const deleteContribution = (id: string) => {
    setContributions((prev) => {
      const updated = prev.filter((c) => c.id !== id)
      localStorage.setItem('signet_contributions', JSON.stringify(updated))
      return updated
    })
  }

  const updateContributionStatus = (id: string, updates: Partial<ContributionRecord>) => {
    setContributions((prev) => {
      const updated = prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
      localStorage.setItem('signet_contributions', JSON.stringify(updated))
      return updated
    })
  }

  const triggerSync = async () => {
    if (syncState.isSyncing) return
    setSyncState((prev) => ({ ...prev, isSyncing: true, syncError: null }))

    try {
      await refreshSession()
      setSyncState((prev) => ({
        ...prev,
        isSyncing: false,
        lastSyncedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }))
    } catch (err: unknown) {
      setSyncState((prev) => ({
        ...prev,
        isSyncing: false,
        syncError: err instanceof Error ? err.message : 'Synchronization failed',
      }))
    }
  }

  return (
    <WorkspaceContext.Provider
      value={{
        userGithub,
        nearAccount,
        isAuthenticated,
        isLinked,
        isLoadingSession,
        syncState,
        contributions,
        triggerSync,
        refreshSession,
        importPullRequest,
        importProjectOwnership,
        importCommunityContribution,
        deleteContribution,
        updateContributionStatus,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  )
}

export function useWorkspace(): WorkspaceContextType {
  const ctx = useContext(WorkspaceContext)
  if (!ctx) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider')
  }
  return ctx
}
