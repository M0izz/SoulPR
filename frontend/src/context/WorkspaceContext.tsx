import { createContext, useContext, useState, useEffect, useCallback, type ReactNode, type FC } from 'react'
import { api, type WalletStatusResponse } from '../lib/api'

export interface ContributionRecord {
  id: string
  repo: string
  prNumber: number
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
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined)

export const WorkspaceProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [userGithub, setUserGithub] = useState<string | null>(null)
  const [nearAccount, setNearAccount] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isLinked, setIsLinked] = useState<boolean>(false)
  const [isLoadingSession, setIsLoadingSession] = useState<boolean>(true)
  const [syncState, setSyncState] = useState<SyncState>(defaultSyncState)

  // Initialize contributions from localStorage
  const [contributions, setContributions] = useState<ContributionRecord[]>(() => {
    if (typeof localStorage !== 'undefined') {
      try {
        const stored = localStorage.getItem('signet_contributions')
        return stored ? JSON.parse(stored) : []
      } catch {
        return []
      }
    }
    return []
  })

  // Recalculate sync counts when contributions list changes
  useEffect(() => {
    const discovered = contributions.length
    const eligible = contributions.filter((c) => c.assessmentStatus === 'eligible').length
    const needsReview = contributions.filter((c) => c.credentialStatus === 'awaiting_approval' || c.assessmentStatus === 'needs_attention').length
    const issued = contributions.filter((c) => c.credentialStatus === 'confirmed').length

    setSyncState((prev) => ({
      ...prev,
      discoveredCount: discovered,
      eligibleCount: eligible,
      needsReviewCount: needsReview,
      issuedCount: issued,
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
   * Imports a real merged GitHub pull request URL.
   * Queries GitHub public API, validates that the PR is merged,
   * extracts authentic facts, and adds it to the contributions registry.
   */
  const importPullRequest = async (url: string): Promise<ContributionRecord> => {
    const cleanUrl = url.trim()
    const match = cleanUrl.match(/^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/i)
    if (!match) {
      throw new Error('Invalid GitHub PR URL. Expected: https://github.com/owner/repository/pull/123')
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
      throw new Error(`Pull request #${prNumber} was not found on GitHub under '${owner}/${repo}'. Ensure the repository is public and the PR number is correct.`)
    }

    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      throw new Error(err.message || `GitHub API error (HTTP ${response.status})`)
    }

    const pr = await response.json()
    if (!pr.merged) {
      throw new Error(`Pull Request #${prNumber} ("${pr.title}") is ${pr.state}, not merged. Only merged contributions can be minted as verifiable SIGNET credentials.`)
    }

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
