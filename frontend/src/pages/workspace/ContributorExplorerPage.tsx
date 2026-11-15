import { useState, useEffect, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api } from '../../lib/api'
import CredentialSeal from '../../components/credential/CredentialSeal'
import {
  IconSearch,
  IconGitHub,
  IconWallet,
  IconExternalLink,
  IconCode,
  IconAward,
  IconShieldCheck,
  IconCopy,
  IconCheck,
} from '../../components/Icons'

interface GitHubProfile {
  login: string
  name: string | null
  avatar_url: string
  bio: string | null
  company: string | null
  location: string | null
  blog: string | null
  public_repos: number
  followers: number
  following: number
  created_at: string
  html_url: string
}

interface GitHubEvent {
  id: string
  type: string
  repo: { name: string; url: string }
  created_at: string
  payload?: any
}

export default function ContributorExplorerPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') || 'm0izz'
  const [query, setQuery] = useState(initialQuery)
  const [profile, setProfile] = useState<GitHubProfile | null>(null)
  const [events, setEvents] = useState<GitHubEvent[]>([])
  const [linkedWallet, setLinkedWallet] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const performLookup = async (lookupTerm: string) => {
    const cleanTerm = lookupTerm.trim().replace(/^@/, '')
    if (!cleanTerm) return

    setLoading(true)
    setError(null)
    setProfile(null)
    setEvents([])
    setLinkedWallet(null)

    try {
      let githubUsername = cleanTerm

      // 1. Check if the query is a NEAR wallet address / account ID (e.g. contains .testnet or .near)
      if (cleanTerm.includes('.') || cleanTerm.startsWith('0x')) {
        try {
          const resolved = (await api.resolveWallet(cleanTerm)) as { walletAddress?: string; githubUsername?: string } | null
          if (resolved?.githubUsername) {
            githubUsername = resolved.githubUsername
            setLinkedWallet(cleanTerm)
          } else {
            setLinkedWallet(cleanTerm)
          }
        } catch {
          setLinkedWallet(cleanTerm)
        }
      }

      // 2. Fetch authentic GitHub Profile (Public API)
      const userRes = await fetch(`https://api.github.com/users/${githubUsername}`, {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'SIGNET-App',
        },
      })

      if (userRes.status === 404) {
        throw new Error(`GitHub user '@${githubUsername}' was not found. Please verify the exact username or wallet ID.`)
      }

      if (!userRes.ok) {
        const errData = await userRes.json().catch(() => ({}))
        throw new Error(errData.message || `GitHub API request failed (HTTP ${userRes.status})`)
      }

      const userData: GitHubProfile = await userRes.json()
      setProfile(userData)

      // 3. Check if user has a linked wallet in SIGNET if not already resolved
      if (!cleanTerm.includes('.')) {
        try {
          const resolved = (await api.resolveWallet(userData.login)) as { walletAddress?: string } | null
          if (resolved?.walletAddress) {
            setLinkedWallet(resolved.walletAddress)
          }
        } catch {
          // not linked yet
        }
      }

      // 4. Fetch authentic Public Open-Source Events
      try {
        const eventsRes = await fetch(`https://api.github.com/users/${userData.login}/events/public?per_page=12`, {
          headers: {
            Accept: 'application/vnd.github.v3+json',
            'User-Agent': 'SIGNET-App',
          },
        })
        if (eventsRes.ok) {
          const eventsData: GitHubEvent[] = await eventsRes.json()
          setEvents(eventsData)
        }
      } catch {
        // non-blocking
      }
    } catch (err: any) {
      setError(err.message || 'Lookup failed')
    } finally {
      setLoading(false)
    }
  }

  // Load initial query on mount or query param change
  useEffect(() => {
    if (initialQuery) {
      performLookup(initialQuery)
    }
  }, [initialQuery])

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    setSearchParams({ q: query.trim() })
    performLookup(query.trim())
  }

  const handleCopyHandle = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }} className="signet-enter-fade">
      {/* ── TOP HERO BANNER & SEARCH ── */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(25, 23, 21, 0.95) 0%, rgba(16, 16, 15, 0.98) 100%)',
          borderRadius: '16px',
          border: '1px solid rgba(185, 87, 43, 0.28)',
          boxShadow: '0 12px 36px -10px rgba(0, 0, 0, 0.6), 0 0 20px rgba(185, 87, 43, 0.1)',
          padding: '2.4rem 2.6rem',
          color: '#EDE2D0',
          marginBottom: '2rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="pulse-live-indicator" />
              <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#B9572B' }}>
                CONTRIBUTOR INTELLIGENCE & VERIFICATION EXPLORER
              </span>
            </div>

            <h1 style={{ fontSize: '32px', fontWeight: 600, margin: '0 0 8px 0', fontFamily: 'var(--font-serif)', color: '#EDE2D0' }}>
              Inspect Any Open-Source Contributor
            </h1>

            <p style={{ fontSize: '14px', color: '#B3A69A', maxWidth: '640px', margin: '0 0 1.6rem 0', lineHeight: 1.5 }}>
              Query any developer using their <strong>exact GitHub username</strong> or <strong>NEAR Wallet ID</strong>.
              Live attribution, public contributions, and verifiable on-chain protocol links with zero synthetic data.
            </p>
          </div>

          <div style={{ display: 'none' }}>
            <CredentialSeal size={72} glow={true} />
          </div>
        </div>

        {/* Search Input Bar */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', maxWidth: '720px' }}>
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(185, 87, 43, 0.35)',
              borderRadius: '10px',
              padding: '10px 16px',
              backdropFilter: 'blur(8px)',
            }}
          >
            <IconSearch size={16} color="#B9572B" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter exact GitHub handle (e.g. m0izz, torvalds) or NEAR Account ID"
              style={{
                flex: 1,
                border: 'none',
                background: 'transparent',
                color: '#EDE2D0',
                fontSize: '13.5px',
                fontFamily: 'var(--font-mono)',
                outline: 'none',
              }}
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                style={{ background: 'none', border: 'none', color: '#9E9287', cursor: 'pointer', fontSize: '14px' }}
              >
                ✕
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !query.trim()}
            style={{
              backgroundColor: '#B9572B',
              color: '#EDE2D0',
              border: 'none',
              borderRadius: '10px',
              padding: '10px 22px',
              fontSize: '13.5px',
              fontWeight: 700,
              cursor: loading || !query.trim() ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 16px rgba(185, 87, 43, 0.35)',
            }}
          >
            {loading ? 'Searching...' : 'Search →'}
          </button>
        </form>

        {/* Quick Suggestion Chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '1rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '11px', color: '#76675B', fontWeight: 600 }}>Try trending:</span>
          {['M0izz', 'torvalds', 'gaearon', 'vbuterin', 'near', 'builder.testnet'].map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => {
                setQuery(chip)
                setSearchParams({ q: chip })
                performLookup(chip)
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '99px',
                padding: '3px 10px',
                color: '#B3A69A',
                fontSize: '11.5px',
                fontFamily: 'var(--font-mono)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#EDE2D0'
                e.currentTarget.style.borderColor = '#B9572B'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#B3A69A'
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
              }}
            >
              {chip.includes('.') ? chip : `@${chip}`}
            </button>
          ))}
        </div>
      </div>

      {/* ── ERROR DISPLAY ── */}
      {error && (
        <div
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            padding: '1.2rem 1.6rem',
            color: '#EF4444',
            fontSize: '13.5px',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <span style={{ fontSize: '18px' }}>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* ── LOADING SKELETON ── */}
      {loading && (
        <div
          style={{
            padding: '3.5rem',
            textAlign: 'center',
            backgroundColor: 'var(--paper-raised)',
            borderRadius: '14px',
            border: '1px solid var(--rule)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <span className="spinner" style={{ width: '28px', height: '28px' }} />
          </div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--ink)', marginBottom: '4px' }}>
            Querying Live GitHub & NEAR Protocol Records...
          </div>
          <div style={{ fontSize: '12.5px', color: 'var(--ink-muted)' }}>
            Retrieving real-time public repositories, contributor events, and cryptographic credentials.
          </div>
        </div>
      )}

      {/* ── PROFILE & EVIDENCE RESULTS ── */}
      {!loading && profile && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }} className="signet-enter-fade">
          {/* Main Contributor Header Card */}
          <div
            className="app-glass-card"
            style={{
              padding: '2rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', gap: '1.4rem', alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <img
                  src={profile.avatar_url}
                  alt={profile.login}
                  style={{
                    width: '84px',
                    height: '84px',
                    borderRadius: '50%',
                    border: '3px solid var(--signet-orange)',
                    boxShadow: '0 6px 20px rgba(185, 87, 43, 0.25)',
                    objectFit: 'cover',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: '2px',
                    right: '2px',
                    backgroundColor: '#10100F',
                    borderRadius: '50%',
                    padding: '3px',
                    border: '1px solid var(--rule)',
                  }}
                >
                  <IconGitHub size={14} color="#EDE2D0" />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <h2 style={{ fontSize: '26px', fontWeight: 800, margin: 0, color: 'var(--ink)', fontFamily: 'var(--font-serif)' }}>
                    {profile.name || profile.login}
                  </h2>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '13.5px',
                      color: 'var(--signet-orange)',
                      fontWeight: 700,
                    }}
                  >
                    @{profile.login}
                  </span>
                  <button
                    onClick={() => handleCopyHandle(`@${profile.login}`)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--ink-muted)',
                      cursor: 'pointer',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '2px 6px',
                    }}
                  >
                    {copied ? <IconCheck size={12} color="#2A7D4F" /> : <IconCopy size={12} color="currentColor" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>

                {profile.bio && (
                  <p style={{ fontSize: '13.5px', color: 'var(--ink-muted)', margin: '8px 0 12px', maxWidth: '620px', lineHeight: 1.5 }}>
                    {profile.bio}
                  </p>
                )}

                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '12.5px', color: 'var(--ink-faint)' }}>
                  {profile.location && <span>📍 {profile.location}</span>}
                  {profile.company && <span>🏢 {profile.company}</span>}
                  <span>📅 Joined {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <a
                href={profile.html_url}
                target="_blank"
                rel="noreferrer"
                className="btn-signet-secondary"
                style={{
                  fontSize: '12.5px',
                  padding: '8px 14px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  textDecoration: 'none',
                }}
              >
                <IconGitHub size={14} color="currentColor" />
                View on GitHub <IconExternalLink size={12} color="currentColor" />
              </a>
            </div>
          </div>

          {/* Protocol Link Status Banner */}
          <div
            className="app-glass-card"
            style={{
              padding: '1.2rem 1.6rem',
              backgroundColor: linkedWallet ? 'rgba(42, 125, 79, 0.08)' : 'rgba(185, 87, 43, 0.08)',
              border: `1px solid ${linkedWallet ? 'rgba(42, 125, 79, 0.28)' : 'rgba(185, 87, 43, 0.28)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <IconShieldCheck size={20} color={linkedWallet ? '#2A7D4F' : '#B9572B'} />
              <div>
                <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--ink)' }}>
                  {linkedWallet ? 'NEAR Protocol Cryptographic Link Active' : 'Unlinked Contributor Identity'}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>
                  {linkedWallet ? (
                    <>
                      Attestations and credentials mint directly to{' '}
                      <strong className="signet-mono" style={{ color: '#2A7D4F' }}>
                        {linkedWallet}
                      </strong>
                    </>
                  ) : (
                    'This contributor has not yet settled a NEAR Protocol link via SIGNET.'
                  )}
                </div>
              </div>
            </div>

            <span
              style={{
                fontSize: '11px',
                fontWeight: 800,
                padding: '4px 10px',
                borderRadius: '99px',
                backgroundColor: linkedWallet ? 'rgba(42, 125, 79, 0.15)' : 'rgba(185, 87, 43, 0.15)',
                color: linkedWallet ? '#2A7D4F' : '#B9572B',
                border: `1px solid ${linkedWallet ? 'rgba(42, 125, 79, 0.35)' : 'rgba(185, 87, 43, 0.35)'}`,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              {linkedWallet ? 'VERIFIED SIGNER ✓' : 'UNLINKED'}
            </span>
          </div>

          {/* 4 Precision Metric Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.2rem' }}>
            <div className="app-glass-card" style={{ padding: '1.4rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: 'var(--ink-muted)', fontWeight: 600 }}>Public Repositories</span>
                <IconCode size={16} color="#B9572B" />
              </div>
              <div style={{ fontSize: '30px', fontWeight: 800, color: 'var(--ink)', fontFamily: 'var(--font-serif)' }}>
                {profile.public_repos}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--ink-faint)', marginTop: '4px' }}>Live count on GitHub</div>
            </div>

            <div className="app-glass-card" style={{ padding: '1.4rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: 'var(--ink-muted)', fontWeight: 600 }}>Followers</span>
                <span style={{ fontSize: '16px' }}>👥</span>
              </div>
              <div style={{ fontSize: '30px', fontWeight: 800, color: 'var(--ink)', fontFamily: 'var(--font-serif)' }}>
                {profile.followers}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--ink-faint)', marginTop: '4px' }}>Community reach</div>
            </div>

            <div className="app-glass-card" style={{ padding: '1.4rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: 'var(--ink-muted)', fontWeight: 600 }}>Recent Public Events</span>
                <IconAward size={16} color="#2A7D4F" />
              </div>
              <div style={{ fontSize: '30px', fontWeight: 800, color: 'var(--ink)', fontFamily: 'var(--font-serif)' }}>
                {events.length}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--ink-faint)', marginTop: '4px' }}>Logged GitHub events</div>
            </div>

            <div className="app-glass-card" style={{ padding: '1.4rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: 'var(--ink-muted)', fontWeight: 600 }}>NEAR Chain Target</span>
                <IconWallet size={16} color="#B9572B" />
              </div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--ink)', fontFamily: 'var(--font-mono)', marginTop: '6px' }}>
                {linkedWallet ? linkedWallet : 'signet.testnet'}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--ink-faint)', marginTop: '6px' }}>
                {linkedWallet ? 'Active Settlement Account' : 'Ready for Protocol Linking'}
              </div>
            </div>
          </div>

          {/* Authentic Live GitHub Contributions Activity Stream */}
          <div className="app-glass-card" style={{ padding: '1.8rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px 0', color: 'var(--ink)', fontFamily: 'var(--font-serif)' }}>
                  Authentic Open-Source Activity Stream
                </h3>
                <p style={{ fontSize: '12.5px', color: 'var(--ink-muted)', margin: 0 }}>
                  Real public repository events and pull request contributions directly from GitHub API
                </p>
              </div>

              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '3px 10px',
                  borderRadius: '99px',
                  backgroundColor: 'rgba(185, 87, 43, 0.12)',
                  color: '#B9572B',
                }}
              >
                LIVE GITHUB FEED
              </span>
            </div>

            {events.length === 0 ? (
              <div
                style={{
                  padding: '2.5rem 1rem',
                  textAlign: 'center',
                  backgroundColor: 'var(--paper)',
                  borderRadius: '10px',
                  border: '1px dashed var(--rule)',
                  fontSize: '13px',
                  color: 'var(--ink-muted)',
                }}
              >
                No public events recorded in the last 90 days for @{profile.login}.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {events.map((ev) => (
                  <div
                    key={ev.id}
                    style={{
                      padding: '12px 16px',
                      backgroundColor: 'var(--paper)',
                      borderRadius: '10px',
                      border: '1px solid var(--rule)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          backgroundColor: ev.type === 'PullRequestEvent' ? 'rgba(42, 125, 79, 0.15)' : 'rgba(185, 87, 43, 0.12)',
                          color: ev.type === 'PullRequestEvent' ? '#2A7D4F' : '#B9572B',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <IconCode size={15} color="currentColor" />
                      </div>

                      <div>
                        <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--ink)' }}>
                          <span style={{ color: 'var(--signet-orange)' }}>{ev.type.replace('Event', '')}</span> on{' '}
                          <a
                            href={`https://github.com/${ev.repo.name}`}
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: 'var(--ink)', textDecoration: 'none', fontWeight: 700 }}
                          >
                            {ev.repo.name}
                          </a>
                        </div>
                        <div style={{ fontSize: '11.5px', color: 'var(--ink-faint)', marginTop: '2px' }}>
                          {ev.payload?.commits?.[0]?.message || ev.payload?.action || 'Public contribution action'}
                        </div>
                      </div>
                    </div>

                    <div style={{ fontSize: '11.5px', color: 'var(--ink-faint)', whiteSpace: 'nowrap' }}>
                      {new Date(ev.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
