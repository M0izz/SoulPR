import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import BadgeDetailModal, { type BadgeData } from '../components/BadgeDetailModal'
import { getAttestations } from '../lib/contract'

// Demo data so the dashboard is interactive before the contract is deployed
const DEMO_BADGES: BadgeData[] = [
  {
    tokenId: 1,
    repo: 'moizz/CNTRL',
    prNumber: 38,
    prTitle: 'Merkle Tree optimization for DEX protocol',
    contributor: '0x8a3f5a70966a3f457c19e5a70966a3f457c19e5a',
    mergeTimestamp: 1752364920,
    txHash: '0xabc123',
    network: 'Monad testnet',
  },
  {
    tokenId: 2,
    repo: 'moizz/JugaadLang',
    prNumber: 20,
    prTitle: 'Implemented gasless transactions feature',
    contributor: '0x8a3f5a70966a3f457c19e5a70966a3f457c19e5a',
    mergeTimestamp: 1750636800,
    txHash: '0xdef456',
    network: 'Monad testnet',
  },
  {
    tokenId: 3,
    repo: 'moizz/semantic-plagiarism-detector',
    prNumber: 8,
    prTitle: 'Added support for new token standard',
    contributor: '0x8a3f5a70966a3f457c19e5a70966a3f457c19e5a',
    mergeTimestamp: 1749600000,
    txHash: '0xghi789',
    network: 'Monad testnet',
  },
]

function formatDate(ts: number) {
  return new Date(ts * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toLowerCase()
}

function formatFirstContrib(ts: number) {
  const date = new Date(ts * 1000)
  const month = date.toLocaleDateString('en-US', { month: 'short' }).toLowerCase()
  return `${month}  ${date.getFullYear()}`
}

export default function Dashboard() {
  const [query, setQuery] = useState('')
  const [searched, setSearched] = useState(false)
  const [badges, setBadges] = useState<BadgeData[]>([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<BadgeData | null>(null)
  
  // Theme state & toggler matching the navigation bar
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'default')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  // Pre-load demo contributor history on first mount so the user immediately sees the visual design
  useEffect(() => {
    setQuery('demo')
    setBadges(DEMO_BADGES)
    setSearched(true)
  }, [])

  async function handleLookup() {
    if (!query.trim()) return
    setLoading(true)
    setSearched(false)

    try {
      const liveBadges = await getAttestations(query.trim());
      if (liveBadges.length > 0) {
        setBadges(liveBadges);
      } else if (query.toLowerCase().includes('8a3f') || query.toLowerCase() === 'demo') {
        setBadges(DEMO_BADGES);
      } else {
        setBadges([]);
      }
    } catch {
      if (query.toLowerCase().includes('8a3f') || query.toLowerCase() === 'demo') {
        setBadges(DEMO_BADGES);
      } else {
        setBadges([]);
      }
    } finally {
      setSearched(true)
      setLoading(false)
    }
  }

  const uniqueRepos = new Set(badges.map((b) => b.repo)).size
  const firstTs = badges.length ? Math.min(...badges.map((b) => b.mergeTimestamp)) : 0
  const shortWallet = badges.length && badges[0].contributor
    ? `${badges[0].contributor.slice(0, 6)}...${badges[0].contributor.slice(-4)}`
    : '0x8a3f...c19e';

  return (
    <div className="page" style={{ paddingTop: '1rem', maxWidth: '1100px' }}>
      
      {/* Header bar back link */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <Link to="/" className="nav-link" style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          ← SoulPR
        </Link>
        <div className="eyebrow" style={{ color: 'var(--ink-muted)', fontSize: '10px' }}>verified lookup dashboard</div>
      </div>

      {/* Search Input block */}
      <div className="search-row" style={{ marginBottom: '2.5rem' }}>
        <input
          id="wallet-search"
          className="input"
          placeholder="0x8a3f...c19e"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
          style={{ flex: 1 }}
        />
        <button
          id="lookup-btn"
          className="btn"
          onClick={handleLookup}
          disabled={loading}
          style={{ background: 'linear-gradient(135deg, #FF7B00 0%, #E05300 100%)', color: 'white' }}
        >
          {loading ? <span className="spinner" /> : 'look up'}
        </button>
      </div>

      {/* Results Workspace Grid */}
      {searched && badges.length > 0 && (
        <div className="dashboard-layout-grid">
          
          {/* LEFT COLUMN: Sticky Glass Profile & Stats Sidebar */}
          <aside className="dashboard-sidebar">
            <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '1.2rem', background: 'rgba(255, 255, 255, 0.45)', border: '1px solid rgba(255, 255, 255, 0.65)' }}>
              
              {/* Profile Card Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'linear-gradient(135deg, #FF9F29 0%, #FF7B00 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '16px' }}>
                  M
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '15px', color: 'var(--ink)' }}>moizz</div>
                  <div className="stamp" style={{ transform: 'none', borderStyle: 'solid', borderWidth: '1px', fontSize: '8px', padding: '1px 6px', background: 'var(--success-bg)', color: 'var(--success)', borderColor: 'var(--success)', marginTop: '2px', display: 'inline-block' }}>
                    ✓ VERIFIED
                  </div>
                </div>
              </div>

              {/* Wallet Copy info */}
              <div>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--ink-faint)', fontWeight: 700, marginBottom: '4px' }}>Wallet Address</div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input
                    readOnly
                    value={shortWallet}
                    style={{ flex: 1, padding: '5px 10px', fontSize: '11px', background: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.6)', borderRadius: '6px', color: 'var(--ink-muted)', outline: 'none' }}
                  />
                  <button className="btn btn-sm" style={{ background: 'var(--stamp)', color: 'white', borderRadius: '6px', padding: '0 8px', fontSize: '10px', height: '24px', alignSelf: 'center' }}>
                    Copy
                  </button>
                </div>
              </div>

              <div className="landing-divider" style={{ margin: 0 }} />

              {/* Summary Stats block */}
              <div>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--ink-faint)', fontWeight: 700, marginBottom: '8px' }}>Global Statistics</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ color: 'var(--ink-muted)' }}>Badges Minted:</span>
                    <strong style={{ color: 'var(--stamp)' }}>{badges.length}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ color: 'var(--ink-muted)' }}>Unique Repos:</span>
                    <strong>{uniqueRepos}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ color: 'var(--ink-muted)' }}>First Entry:</span>
                    <strong>{formatFirstContrib(firstTs)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ color: 'var(--ink-muted)' }}>Rank Level:</span>
                    <strong style={{ color: 'var(--success)' }}>Gold Forger</strong>
                  </div>
                </div>
              </div>

            </div>
          </aside>

          {/* RIGHT COLUMN: Collectible Cards Showcase & Timeline */}
          <section className="dashboard-main-content">
            
            {/* Collectible SBT Cards Grid (Telegram inspired) */}
            <div style={{ marginBottom: '2.5rem' }}>
              <div className="eyebrow" style={{ marginBottom: '1rem', fontSize: '11px' }}>SBT digital collectibles</div>
              
              <div className="telegram-sbt-grid">
                {badges.map((b) => (
                  <div 
                    key={b.tokenId} 
                    className="telegram-sbt-card" 
                    onClick={() => setSelected(b)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Status Pill */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--ink-muted)' }}>ID #{b.tokenId}</span>
                      <span className="sbt-badge-pill">SOULBOUND</span>
                    </div>

                    {/* Central Emblem Badge (Polygonal abstract icon render) */}
                    <div className="sbt-emblem-wrap">
                      <div className="sbt-glow-layer" />
                      <div className="sbt-emblem-icon">
                        <span style={{ fontSize: '26px' }}>Σ</span>
                      </div>
                    </div>

                    {/* Metadata Footer */}
                    <div style={{ marginTop: '1.2rem', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '0.8rem', textAlign: 'left' }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 800, color: 'var(--ink)', textTransform: 'uppercase', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {b.repo.split('/')[1]}
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--stamp)', marginTop: '2px' }}>
                        PR #{b.prNumber}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Vertical Redesigned Timeline */}
            <div>
              <div className="eyebrow" style={{ marginBottom: '1.5rem', fontSize: '11px' }}>Chronological contributions</div>
              
              <div className="custom-timeline">
                {badges.map((b, i) => {
                  const year = new Date(b.mergeTimestamp * 1000).getFullYear();
                  const prUrl = `https://github.com/${b.repo}/pull/${b.prNumber}`;
                  const txUrl = b.txHash ? `https://testnet.monadexplorer.com/tx/${b.txHash}` : '#';

                  return (
                    <div
                      key={b.tokenId}
                      className="timeline-item"
                      onClick={() => setSelected(b)}
                    >
                      {/* Left Column: Year + Node + Line */}
                      <div className="timeline-left">
                        <span className="timeline-year">{year}</span>
                        <div className="timeline-node-container">
                          <span className="timeline-dot" />
                          {i < badges.length - 1 && <div className="timeline-connector" />}
                        </div>
                      </div>

                      {/* Right Column: Title + Platform Icons + Contribution Links */}
                      <div className="timeline-right">
                        <h3 className="timeline-title">{b.prTitle || 'Project contribution'}</h3>

                        <div className="timeline-meta">
                          {/* Code Braces circle */}
                          <div className="platform-icon code-icon" title="Source Code">
                            <svg width="9" height="9" viewBox="0 0 20 20" fill="none">
                              <path d="M6 14L2 10L6 6M14 6L18 10L14 14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                          </div>

                          {/* Monad Sigma circle */}
                          <div className="platform-icon monad-icon" title="On-chain Attestation">
                            <span style={{ fontSize: '9px', fontWeight: 'bold' }}>Σ</span>
                          </div>

                          <a
                            href={prUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="timeline-link"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Project contribution
                          </a>

                          <span className="timeline-pipe">|</span>

                          <a
                            href={txUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="timeline-link"
                            onClick={(e) => e.stopPropagation()}
                          >
                            links
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Explanation small label footer */}
            <div className="mono" style={{ fontSize: '11px', color: 'var(--ink-faint)', marginTop: '2.5rem', textAlign: 'left', opacity: 0.8 }}>
              click any collectible card or timeline node to inspect raw soulbound metadata on-chain
            </div>

          </section>

        </div>
      )}

      {/* Empty states */}
      {searched && badges.length === 0 && (
        <div className="empty">
          <div className="empty-label">No badges yet</div>
          <div className="empty-hint">
            Merge a pull request on a tracked repo to mint your first one.
          </div>
          <Link to="/link-wallet">
            <button className="btn btn-ghost btn-sm mt-md">Link your wallet</button>
          </Link>
        </div>
      )}

      {/* Badge detail receipt modal */}
      {selected && (
        <BadgeDetailModal badge={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}
