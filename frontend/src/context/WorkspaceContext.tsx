import { createContext, useContext, useState, useEffect, useCallback, type ReactNode, type FC } from 'react'
import { api, type WalletStatusResponse } from '../lib/api'

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
  triggerSync: () => Promise<void>
  refreshSession: () => Promise<void>
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

  const refreshSession = useCallback(async () => {
    try {
      setIsLoadingSession(true)
      const status: WalletStatusResponse = await api.getWalletStatus()
      if (status.authenticated && status.githubUsername) {
        setIsAuthenticated(true)
        setUserGithub(status.githubUsername)
        setIsLinked(Boolean(status.linked))
        setNearAccount(status.walletAddress ?? null)
      } else {
        setIsAuthenticated(false)
        setUserGithub(null)
        setIsLinked(false)
        setNearAccount(null)
      }
    } catch {
      // In dev or offline mode, preserve graceful fallback
      setIsAuthenticated(false)
    } finally {
      setIsLoadingSession(false)
    }
  }, [])

  useEffect(() => {
    refreshSession()
  }, [refreshSession])

  const triggerSync = async () => {
    if (syncState.isSyncing) return
    setSyncState((prev) => ({ ...prev, isSyncing: true, syncError: null }))

    try {
      // Emulate background sync job request or API call
      await new Promise((res) => setTimeout(res, 1200))
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
        triggerSync,
        refreshSession,
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
