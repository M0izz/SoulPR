import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api, { type RepoItem } from '../lib/api'
import { fetchGitHubUserStats, type GitHubStats } from '../lib/github'
import ThemeToggle from '../components/ThemeToggle'
import SignetBrandLockup from '../components/brand/SignetBrandLockup'
import CredentialSeal from '../components/credential/CredentialSeal'
import {
  IconHome, IconAward, IconCode,
  IconSettings, IconUserPlus, IconFolder,
} from '../components/Icons'

type NavId = 'overview' | 'credentials' | 'contributions' | 'repos' | 'settings'

export interface CredentialSummary {
  id: string
  repo: string
  prNumber: number
  prTitle: string
  contributor: string
  issuanceDate: string
  status: string
}

function formatDate(isoString?: string) {
  if (!isoString) return 'N/A'
  try {
    const d = new Date(isoString)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return 'N/A'
  }
}

// ─── PANEL 1: Credentials Shelf Panel ─────────────────────────
function CredentialsPanel({
  credentials,
  onSelect,
}: {
  credentials: CredentialSummary[]
  onSelect: (c: CredentialSummary) => void
}) {
  const navigate = useNavigate()

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--ink)', margin: 0, fontFamily: 'var(--font-serif)' }}>
          Issued Contribution Credentials
        </h2>
        <button
          onClick={() => navigate('/verify/sample')}
          style={{
            fontSize: '12px',
            fontWeight: 700,
            color: '#B9572B',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          View Illustrative Sample Credential →
        </button>
      </div>

      {credentials.length === 0 ? (
        <div
          style={{
            padding: '3.5rem 2rem',
            textAlign: 'center',
            background: 'var(--paper-raised)',
            border: '1px dashed var(--rule)',
            borderRadius: '16px',
            color: 'var(--ink-muted)',
          }}
        >
          <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
            <CredentialSeal size={52} />
          </div>
          <div style={{ fontSize: '16px', fontWeight: 800, marginBottom: '6px', color: 'var(--ink)', fontFamily: 'var(--font-serif)' }}>
            No Credentials Issued Yet
          </div>
          <div style={{ fontSize: '13px', maxWidth: '420px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
            Merge pull requests on tracked open-source repositories to automatically synthesize verifiable SIGNET credentials.
          </div>
          <button
            onClick={() => navigate('/verify/sample')}
            style={{
              backgroundColor: 'var(--signet-orange)',
              color: '#EDE2D0',
              fontWeight: 700,
              fontSize: '12.5px',
              padding: '8px 18px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Inspect Sample Credential →
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.2rem' }}>
          {credentials.map((c) => (
            <div
              key={c.id}
              onClick={() => onSelect(c)}
              style={{
                backgroundColor: 'var(--paper-raised)',
                border: '1px solid var(--rule)',
                borderRadius: '14px',
                padding: '1.4rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
                ;(e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(185,87,43,0.1)'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
                ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <span style={{ fontSize: '9px', fontWeight: 800, color: '#B9572B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  CREDENTIAL
                </span>
                <CredentialSeal size={28} />
              </div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ink)', marginBottom: '4px', fontFamily: 'var(--font-serif)' }}>
                {c.prTitle}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--ink-muted)', fontFamily: 'var(--font-mono)' }}>
                {c.repo} · PR #{c.prNumber}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── PANEL 2: Contributions Activity Panel ────────────────────
function ContributionsPanel({
  credentials,
  ghStats,
  loadingStats,
}: {
  credentials: CredentialSummary[]
  ghStats: GitHubStats | null
  loadingStats: boolean
}) {
  const mergedPRsCount = ghStats?.mergedPrCount ?? credentials.length
  const reposCount = ghStats?.publicRepos ?? new Set(credentials.map((b) => b.repo)).size

  return (
    <div>
      <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--ink)', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)' }}>
        Open-Source Contribution Evidence
      </h2>
      <div style={{ background: 'var(--paper-raised)', border: '1px solid var(--rule)', borderRadius: '16px', padding: '1.8rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.8rem' }}>
          {[
            { label: 'GitHub Merged PRs', val: loadingStats ? '...' : mergedPRsCount.toLocaleString(), color: '#B9572B' },
            { label: 'Public Repositories', val: loadingStats ? '...' : reposCount.toLocaleString(), color: '#2A7D4F' },
            { label: 'Issued Credentials', val: `${credentials.length}`, color: '#B9572B' },
          ].map(({ label, val, color }) => (
            <div key={label} style={{ background: 'var(--paper)', borderRadius: '10px', padding: '1.2rem', textAlign: 'center', border: '1px solid var(--rule)' }}>
              <div style={{ fontSize: '28px', fontWeight: 900, color, marginBottom: '4px', fontFamily: 'var(--font-serif)' }}>{val}</div>
              <div style={{ fontSize: '11px', color: 'var(--ink-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--ink)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Attested Work History
        </div>

        {credentials.length === 0 ? (
          <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--ink-muted)', fontSize: '13px', background: 'var(--paper)', borderRadius: '8px' }}>
            No on-chain credentials registered yet. Live GitHub contributions will be automatically audited as PRs merge.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {credentials.map((c) => (
              <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', borderRadius: '8px', background: 'var(--paper)', border: '1px solid var(--rule)' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--ink)' }}>{c.prTitle}</div>
                  <div style={{ fontSize: '11px', color: 'var(--ink-muted)', fontFamily: 'var(--font-mono)' }}>{c.repo} · PR #{c.prNumber}</div>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--signet-muted)', fontFamily: 'var(--font-mono)' }}>{c.issuanceDate}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── PANEL 3: Tracked Repositories Panel ──────────────────────
function TrackedReposPanel({
  repos,
  onToggleTrack,
  onSave,
  saving,
}: {
  repos: RepoItem[]
  onToggleTrack: (name: string) => void
  onSave: () => void
  saving: boolean
}) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--ink)', margin: '0 0 4px', fontFamily: 'var(--font-serif)' }}>
            Tracked Repositories
          </h2>
          <div style={{ fontSize: '12.5px', color: 'var(--ink-muted)' }}>
            SIGNET listens for merged pull requests on selected repositories to synthesize credentials.
          </div>
        </div>

        <button
          onClick={onSave}
          disabled={saving}
          style={{
            backgroundColor: 'var(--signet-orange)',
            color: '#EDE2D0',
            fontWeight: 700,
            fontSize: '12.5px',
            padding: '8px 18px',
            borderRadius: '6px',
            border: 'none',
            cursor: saving ? 'wait' : 'pointer',
          }}
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      <div style={{ background: 'var(--paper-raised)', border: '1px solid var(--rule)', borderRadius: '16px', padding: '1.4rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {repos.map((r) => (
            <div
              key={r.fullName}
              onClick={() => onToggleTrack(r.fullName)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderRadius: '8px',
                background: 'var(--paper)',
                border: '1px solid var(--rule)',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '4px',
                    border: '1.5px solid var(--rule)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: r.tracked ? 'var(--signet-orange)' : 'transparent',
                    borderColor: r.tracked ? 'var(--signet-orange)' : 'var(--rule)',
                    color: '#FFF',
                    fontSize: '11px',
                    fontWeight: 800,
                  }}
                >
                  {r.tracked && '✓'}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>
                  {r.fullName}
                </span>
              </div>

              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  padding: '3px 8px',
                  borderRadius: '99px',
                  backgroundColor: r.tracked ? 'rgba(42, 125, 79, 0.1)' : 'rgba(118, 103, 91, 0.1)',
                  color: r.tracked ? '#2A7D4F' : 'var(--signet-muted)',
                }}
              >
                {r.tracked ? 'Active Tracking' : 'Paused'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── PANEL 4: Settings Panel ──────────────────────────────────
function SettingsPanel({
  githubUser,
  walletAddress,
  onLogout,
}: {
  githubUser: string
  walletAddress: string | null
  onLogout: () => void
}) {
  return (
    <div>
      <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--ink)', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)' }}>
        Protocol Settings
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', maxWidth: '580px' }}>
        <div style={{ background: 'var(--paper-raised)', border: '1px solid var(--rule)', borderRadius: '14px', padding: '1.4rem' }}>
          <div style={{ fontWeight: 800, fontSize: '13px', color: 'var(--ink)', marginBottom: '4px' }}>Connected GitHub Contributor</div>
          <div style={{ fontSize: '12px', color: 'var(--ink-muted)', marginBottom: '12px' }}>Authoritative identity handle used for commit and pull request attribution</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, color: '#B9572B', backgroundColor: 'var(--paper)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--rule)' }}>
            @{githubUser}
          </div>
        </div>

        <div style={{ background: 'var(--paper-raised)', border: '1px solid var(--rule)', borderRadius: '14px', padding: '1.4rem' }}>
          <div style={{ fontWeight: 800, fontSize: '13px', color: 'var(--ink)', marginBottom: '4px' }}>Target Blockchain Protocol</div>
          <div style={{ fontSize: '12px', color: 'var(--ink-muted)', marginBottom: '12px' }}>Decentralized attestation layer for non-transferable credential records</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', border: '1px solid var(--rule)', borderRadius: '8px', fontSize: '12.5px', fontWeight: 700, color: 'var(--ink)', backgroundColor: 'var(--paper)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#B9572B', display: 'inline-block' }} />
            NEAR Protocol (Testnet) · Account Mapping: {walletAddress ? `${walletAddress.slice(0, 10)}...` : `${githubUser}.near (Staged)`}
          </div>
        </div>

        <div style={{ background: 'var(--paper-raised)', border: '1px solid var(--rule)', borderRadius: '14px', padding: '1.4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: '13px', color: 'var(--ink)', marginBottom: '2px' }}>Session Management</div>
            <div style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>Terminate active browser session cookies</div>
          </div>
          <button
            onClick={onLogout}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#EF4444',
              borderRadius: '6px',
              padding: '8px 16px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── MAIN DASHBOARD COMPONENT ─────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate()
  const [activeNav, setActiveNav] = useState<NavId>('overview')
  const [credentials] = useState<CredentialSummary[]>([])
  const [ghStats, setGhStats] = useState<GitHubStats | null>(null)
  const [loadingStats, setLoadingStats] = useState(true)
  const [userGithub, setUserGithub] = useState<string>('moizz')
  const [userWallet, setUserWallet] = useState<string | null>(null)
  const [repos, setRepos] = useState<RepoItem[]>([])
  const [savingRepos, setSavingRepos] = useState(false)
  const [showSearchModal, setShowSearchModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCredential, setSelectedCredential] = useState<CredentialSummary | null>(null)

  // 1. Initial Load: Session check, GitHub metrics & Tracked Repos
  useEffect(() => {
    async function initDashboard() {
      setLoadingStats(true)
      let currentGhUser = 'moizz'

      try {
        const status = await api.getWalletStatus()
        if (status.authenticated && status.githubUsername) {
          currentGhUser = status.githubUsername
          setUserGithub(status.githubUsername)
        }
        if (status.linked && status.walletAddress) {
          setUserWallet(status.walletAddress)
        }
      } catch (err) {
        console.warn('[Dashboard] Session status check fallback:', err)
      }

      // Fetch GitHub real user stats
      const stats = await fetchGitHubUserStats(currentGhUser)
      setGhStats(stats)

      // Fetch Tracked Repositories
      try {
        const repoData = await api.getTrackedRepos()
        if (repoData && repoData.repos) {
          setRepos(repoData.repos)
        }
      } catch (err) {
        console.warn('[Dashboard] Tracked repos fetch fallback:', err)
      }

      setLoadingStats(false)
    }

    initDashboard()
  }, [])

  // 2. Handle Logout
  const handleLogout = async () => {
    try {
      await api.logout()
    } catch (e) {
      console.warn('Logout error:', e)
    }
    navigate('/auth')
  }

  // 3. Handle Repository Tracking Toggle & Save
  const handleToggleTrack = (name: string) => {
    setRepos((prev) =>
      prev.map((r) => (r.fullName === name ? { ...r, tracked: !r.tracked } : r))
    )
  }

  const handleSaveRepos = async () => {
    setSavingRepos(true)
    try {
      const trackedNames = repos.filter((r) => r.tracked).map((r) => r.fullName)
      await api.saveTrackedRepos(trackedNames)
    } catch (e) {
      console.error('Failed saving repos:', e)
    } finally {
      setSavingRepos(false)
    }
  }

  // 4. Handle Contributor Lookup
  const handleLookup = async (query: string) => {
    if (!query.trim()) return
    const target = query.trim().replace(/^@/, '')
    setUserGithub(target)
    setLoadingStats(true)
    const ghData = await fetchGitHubUserStats(target)
    if (ghData) {
      setGhStats(ghData)
    }
    setLoadingStats(false)
    setShowSearchModal(false)
  }

  // Sidebar Links
  const sidebarLinks: { id: NavId; icon: React.ReactNode; label: string }[] = [
    { id: 'overview', icon: <IconHome size={16} />, label: 'Overview' },
    { id: 'credentials', icon: <IconAward size={16} />, label: 'Credentials' },
    { id: 'contributions', icon: <IconCode size={16} />, label: 'Contributions' },
    { id: 'repos', icon: <IconFolder size={16} />, label: 'Tracked Repos' },
    { id: 'settings', icon: <IconSettings size={16} />, label: 'Settings' },
  ]

  // Calculated Metrics
  const mergedPRsCount = ghStats?.mergedPrCount ?? credentials.length
  const publicReposCount = ghStats?.publicRepos ?? repos.length
  const builderXP = mergedPRsCount * 120 + credentials.length * 300 + publicReposCount * 40
  const builderLevel = Math.max(1, Math.floor(builderXP / 500) + 1)

  return (
    <div
      className="dashboard-container"
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: 'var(--paper)',
        color: 'var(--ink)',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* ── SIDEBAR ── */}
      <aside
        className="dashboard-sidebar"
        style={{
          width: '260px',
          backgroundColor: 'var(--paper-raised)',
          flexShrink: 0,
          borderRight: '1px solid var(--rule)',
          padding: '2rem 1.4rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          height: '100vh',
          boxSizing: 'border-box',
        }}
      >
        <div>
          <div style={{ marginBottom: '2.5rem' }}>
            <SignetBrandLockup
              color="var(--ink)"
              markColor="#B9572B"
              markSize={28}
              wordmarkSize={18}
            />
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }} aria-label="Dashboard navigation">
            {sidebarLinks.map(({ id, icon, label }) => {
              const isActive = activeNav === id
              return (
                <button
                  key={id}
                  onClick={() => setActiveNav(id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '11px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: isActive ? 'rgba(185, 87, 43, 0.12)' : 'transparent',
                    color: isActive ? '#B9572B' : 'var(--ink-muted)',
                    fontWeight: isActive ? 800 : 600,
                    fontSize: '14px',
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span style={{ color: isActive ? '#B9572B' : 'var(--ink-faint)' }}>{icon}</span>
                  {label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Sidebar Bottom Box */}
        <div style={{ backgroundColor: 'rgba(185, 87, 43, 0.06)', border: '1px solid rgba(185, 87, 43, 0.2)', borderRadius: '12px', padding: '1.2rem 1rem', textAlign: 'center' }}>
          <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>
            <CredentialSeal size={32} />
          </div>
          <div style={{ fontWeight: 800, fontSize: '12px', color: 'var(--ink)', marginBottom: '4px' }}>
            Your work is your mark.
          </div>
          <div style={{ fontSize: '11px', color: 'var(--ink-muted)', marginBottom: '12px' }}>
            Inspect protocol verification.
          </div>
          <button
            onClick={() => navigate('/verify/sample')}
            style={{
              width: '100%',
              backgroundColor: 'var(--signet-orange)',
              color: '#EDE2D0',
              border: 'none',
              borderRadius: '6px',
              padding: '7px 0',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Sample Credential →
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT AREA ── */}
      <main style={{ flex: 1, padding: '2.5rem 3rem', overflowY: 'auto' }}>
        {/* Header Bar */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div style={{ textAlign: 'left' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 600, color: 'var(--ink)', margin: 0, fontFamily: 'var(--font-serif)' }}>
              {activeNav === 'overview' && 'Contributor Workspace'}
              {activeNav === 'credentials' && 'Credentials'}
              {activeNav === 'contributions' && 'Contributions'}
              {activeNav === 'repos' && 'Tracked Repositories'}
              {activeNav === 'settings' && 'Protocol Settings'}
            </h1>
            {activeNav === 'overview' && (
              <div style={{ fontSize: '13px', color: 'var(--ink-muted)', marginTop: '2px' }}>
                Welcome back, <strong>@{userGithub}</strong>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {/* Protocol Badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'var(--paper-raised)',
                border: '1px solid var(--rule)',
                borderRadius: '8px',
                padding: '6px 14px',
                fontSize: '11px',
                fontWeight: 700,
                color: '#B9572B',
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#B9572B', display: 'inline-block' }} />
              NEAR PROTOCOL (TESTNET)
            </div>

            <button
              onClick={() => setShowSearchModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'var(--paper-raised)',
                border: '1px solid var(--rule)',
                borderRadius: '8px',
                padding: '6px 14px',
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--ink)',
                cursor: 'pointer',
              }}
            >
              <IconUserPlus size={13} color="var(--ink-muted)" />
              Look Up Contributor
            </button>

            <ThemeToggle />
          </div>
        </header>

        {/* ── Active Panel Rendering ── */}
        {activeNav === 'overview' && (
          <div>
            {/* Contributor Score Hero Banner */}
            <section
              style={{
                backgroundColor: '#191715',
                color: '#EDE2D0',
                borderRadius: '16px',
                padding: '2rem 2.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem',
                position: 'relative',
                overflow: 'hidden',
                textAlign: 'left',
              }}
            >
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: '10.5px', fontWeight: 800, color: '#B9572B', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '8px' }}>
                  @{userGithub}'s Verified Contributor XP
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '42px', fontWeight: 600, color: '#EDE2D0', fontFamily: 'var(--font-serif)', lineHeight: 1 }}>
                    {loadingStats ? '...' : builderXP.toLocaleString()}
                  </span>
                  <span style={{ backgroundColor: 'rgba(185, 87, 43, 0.2)', border: '1px solid rgba(185, 87, 43, 0.4)', borderRadius: '99px', padding: '4px 12px', fontSize: '11px', color: '#B9572B', fontWeight: 800 }}>
                    Contributor Lv. {builderLevel}
                  </span>
                </div>
                <p style={{ fontSize: '12.5px', color: 'var(--signet-muted)', maxWidth: '480px', margin: 0 }}>
                  Earned from {mergedPRsCount} merged pull requests across {publicReposCount} repositories.
                </p>
              </div>

              <div style={{ position: 'relative', zIndex: 1 }}>
                <CredentialSeal size={96} glow={true} />
              </div>
            </section>

            {/* 4 Stat Tiles */}
            <section className="dashboard-stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.2rem', marginBottom: '2rem' }}>
              {[
                { label: 'Verified Credentials', val: `${credentials.length}`, sub: 'SIGNET records', action: () => setActiveNav('credentials') },
                { label: 'GitHub Merged PRs', val: loadingStats ? '...' : `${mergedPRsCount}`, sub: 'Authoritative git merges', action: () => setActiveNav('contributions') },
                { label: 'Contributor Level', val: `Lv. ${builderLevel}`, sub: `${builderXP} Verified XP`, action: undefined },
                { label: 'Tracked Repos', val: `${repos.filter((r) => r.tracked).length}`, sub: 'Automated merge monitoring', action: () => setActiveNav('repos') },
              ].map(({ label, val, sub, action }) => (
                <div
                  key={label}
                  onClick={action}
                  style={{
                    backgroundColor: 'var(--paper-raised)',
                    border: '1px solid var(--rule)',
                    borderRadius: '12px',
                    padding: '1.4rem',
                    textAlign: 'left',
                    cursor: action ? 'pointer' : 'default',
                    transition: 'box-shadow 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    if (action) (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 14px rgba(185,87,43,0.1)'
                  }}
                  onMouseLeave={(e) => {
                    if (action) (e.currentTarget as HTMLElement).style.boxShadow = 'none'
                  }}
                >
                  <div style={{ fontSize: '11px', color: 'var(--ink-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
                    {label}
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--ink)', fontFamily: 'var(--font-serif)', lineHeight: 1, marginBottom: '6px' }}>
                    {val}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--signet-muted)' }}>{sub}</div>
                </div>
              ))}
            </section>

            {/* 2-Column Overview Bottom */}
            <div className="dashboard-overview-grid" style={{ display: 'grid', gridTemplateColumns: '1.3fr 0.7fr', gap: '2rem', alignItems: 'start' }}>
              {/* Recent Credentials Card */}
              <section style={{ backgroundColor: 'var(--paper-raised)', border: '1px solid var(--rule)', borderRadius: '16px', padding: '1.6rem', textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--ink)', margin: 0, fontFamily: 'var(--font-serif)' }}>
                    Recent Verifiable Credentials
                  </h2>
                  <button
                    onClick={() => setActiveNav('credentials')}
                    style={{ color: '#B9572B', fontSize: '12px', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    View all
                  </button>
                </div>

                {credentials.length === 0 ? (
                  <div style={{ padding: '2.5rem 1.5rem', textAlign: 'center', background: 'var(--paper)', borderRadius: '10px', border: '1px dashed var(--rule)' }}>
                    <div style={{ fontSize: '13px', color: 'var(--ink-muted)', marginBottom: '8px' }}>
                      No credentials issued on NEAR Testnet yet.
                    </div>
                    <Link to="/verify/sample" style={{ fontSize: '12px', color: '#B9572B', fontWeight: 700, textDecoration: 'none' }}>
                      Inspect demonstration credential on /verify/sample →
                    </Link>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {credentials.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => setSelectedCredential(c)}
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--rule)', background: 'var(--paper)', cursor: 'pointer' }}
                      >
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '13px' }}>{c.prTitle}</div>
                          <div style={{ fontSize: '10.5px', color: 'var(--ink-muted)', fontFamily: 'var(--font-mono)' }}>{c.repo} · PR #{c.prNumber}</div>
                        </div>
                        <span style={{ fontSize: '11px', color: '#2A7D4F', fontWeight: 700 }}>Inspect Evidence →</span>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Contributor Profile Audit Card */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ backgroundColor: 'var(--paper-raised)', border: '1px solid var(--rule)', borderRadius: '16px', padding: '1.5rem', textAlign: 'left' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--ink)', borderBottom: '1px solid var(--rule)', paddingBottom: '10px', marginBottom: '12px' }}>
                    Authoritative Profile Audit
                  </h3>
                  {[
                    { label: 'GitHub Handle', val: `@${userGithub}` },
                    { label: 'Merged Pull Requests', val: loadingStats ? '...' : `${mergedPRsCount}` },
                    { label: 'Public Repositories', val: loadingStats ? '...' : `${publicReposCount}` },
                    { label: 'Attestation Settlement', val: 'NEAR Protocol' },
                    { label: 'Account Created', val: formatDate(ghStats?.createdAt) },
                  ].map(({ label, val }) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', padding: '6px 0', borderBottom: '1px solid var(--rule)' }}>
                      <span style={{ color: 'var(--ink-muted)' }}>{label}</span>
                      <strong style={{ color: 'var(--ink)', fontFamily: 'var(--font-mono)' }}>{val}</strong>
                    </div>
                  ))}
                </div>

                {/* Quick Action Navigation Buttons */}
                <div style={{ backgroundColor: 'var(--paper-raised)', border: '1px solid var(--rule)', borderRadius: '16px', padding: '1.2rem', textAlign: 'left' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--signet-muted)', marginBottom: '10px' }}>
                    Quick Actions
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                    <button
                      onClick={() => navigate('/verify/sample')}
                      style={{ padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--rule)', background: 'var(--paper)', fontSize: '11.5px', fontWeight: 600, color: 'var(--ink)', cursor: 'pointer', textAlign: 'left' }}
                    >
                      Sample Credential →
                    </button>
                    <button
                      onClick={() => setActiveNav('repos')}
                      style={{ padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--rule)', background: 'var(--paper)', fontSize: '11.5px', fontWeight: 600, color: 'var(--ink)', cursor: 'pointer', textAlign: 'left' }}
                    >
                      Track Repositories →
                    </button>
                    <button
                      onClick={() => setShowSearchModal(true)}
                      style={{ padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--rule)', background: 'var(--paper)', fontSize: '11.5px', fontWeight: 600, color: 'var(--ink)', cursor: 'pointer', textAlign: 'left' }}
                    >
                      Look Up Contributor →
                    </button>
                    <button
                      onClick={() => navigate('/install')}
                      style={{ padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--rule)', background: 'var(--paper)', fontSize: '11.5px', fontWeight: 600, color: 'var(--ink)', cursor: 'pointer', textAlign: 'left' }}
                    >
                      GitHub App Setup →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeNav === 'credentials' && (
          <CredentialsPanel
            credentials={credentials}
            onSelect={(c) => setSelectedCredential(c)}
          />
        )}

        {activeNav === 'contributions' && (
          <ContributionsPanel
            credentials={credentials}
            ghStats={ghStats}
            loadingStats={loadingStats}
          />
        )}

        {activeNav === 'repos' && (
          <TrackedReposPanel
            repos={repos}
            onToggleTrack={handleToggleTrack}
            onSave={handleSaveRepos}
            saving={savingRepos}
          />
        )}

        {activeNav === 'settings' && (
          <SettingsPanel
            githubUser={userGithub}
            walletAddress={userWallet}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* Contributor Search Modal */}
      {showSearchModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1.5rem',
          }}
          onClick={() => setShowSearchModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--paper-raised)',
              border: '1px solid var(--rule)',
              borderRadius: '14px',
              padding: '2rem',
              maxWidth: '440px',
              width: '100%',
              textAlign: 'left',
            }}
          >
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontWeight: 600, color: 'var(--ink)', margin: '0 0 8px' }}>
              Look Up Open-Source Contributor
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--ink-muted)', marginBottom: '1.4rem' }}>
              Query any GitHub handle to inspect public merged pull requests and contribution records.
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLookup(searchQuery)}
                placeholder="GitHub username (e.g. torvalds)"
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: '6px',
                  border: '1px solid var(--rule)',
                  backgroundColor: 'var(--paper)',
                  color: 'var(--ink)',
                  fontSize: '13px',
                  outline: 'none',
                }}
              />
              <button
                onClick={() => handleLookup(searchQuery)}
                style={{
                  backgroundColor: 'var(--signet-orange)',
                  color: '#EDE2D0',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0 16px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Inspect
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Selected Credential Inspection Modal */}
      {selectedCredential && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1.5rem',
          }}
          onClick={() => setSelectedCredential(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#F3E8D5',
              color: '#191715',
              borderRadius: '16px',
              padding: '2.5rem',
              maxWidth: '480px',
              width: '100%',
              textAlign: 'left',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', color: '#B9572B', letterSpacing: '0.08em' }}>
                  Credential Inspection
                </span>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', fontWeight: 600, color: '#191715', margin: '4px 0 0' }}>
                  {selectedCredential.prTitle}
                </h3>
              </div>
              <CredentialSeal size={42} />
            </div>

            <div style={{ backgroundColor: 'rgba(25, 23, 21, 0.05)', padding: '12px 14px', borderRadius: '8px', marginBottom: '1.5rem', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
              <div>Repo: {selectedCredential.repo}</div>
              <div>Pull Request: #{selectedCredential.prNumber}</div>
              <div>Contributor: @{selectedCredential.contributor}</div>
              <div>Issuance: {selectedCredential.issuanceDate}</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setSelectedCredential(null)}
                style={{ padding: '8px 14px', borderRadius: '6px', border: '1px solid rgba(118, 103, 91, 0.3)', background: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}
              >
                Close
              </button>
              <button
                onClick={() => navigate('/verify/sample')}
                style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', backgroundColor: 'var(--signet-orange)', color: '#EDE2D0', cursor: 'pointer', fontSize: '12px', fontWeight: 700 }}
              >
                View Full Evidence →
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 960px) {
          .dashboard-container {
            flex-direction: column !important;
          }
          .dashboard-sidebar {
            width: 100% !important;
            height: auto !important;
            position: static !important;
            border-right: none !important;
            border-bottom: 1px solid var(--rule) !important;
            padding: 1.2rem 1.4rem !important;
          }
          .dashboard-sidebar nav {
            flex-direction: row !important;
            flex-wrap: wrap !important;
            gap: 8px !important;
          }
          .dashboard-sidebar nav button {
            width: auto !important;
          }
          .dashboard-stat-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .dashboard-overview-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 600px) {
          .dashboard-stat-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
