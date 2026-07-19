import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import BadgeDetailModal, { type BadgeData } from '../components/BadgeDetailModal'
import { getAttestations } from '../lib/contract'

// Hardcoded mock values matching the screenshot for full design fidelity
const MOCK_BADGES: BadgeData[] = [
  {
    tokenId: 42,
    repo: 'soulpr/website',
    prNumber: 106,
    prTitle: 'feat: add dark mode toggle',
    contributor: '0xA7f2d5e3052E9B663a8a3f5a70966a3f457c19e5',
    mergeTimestamp: Math.floor(Date.now() / 1000) - 7200, // 2h ago
    txHash: '0xabc123',
    network: 'Monad Testnet',
  },
  {
    tokenId: 43,
    repo: 'soulpr/website',
    prNumber: 123,
    prTitle: 'fix: resolve UI alignment issue',
    contributor: '0xA7f2d5e3052E9B663a8a3f5a70966a3f457c19e5',
    mergeTimestamp: Math.floor(Date.now() / 1000) - 86400, // 1d ago
    txHash: '0xdef456',
    network: 'Monad Testnet',
  },
  {
    tokenId: 44,
    repo: 'soulpr/docs',
    prNumber: 8,
    prTitle: 'docs: update contribution guide',
    contributor: '0xA7f2d5e3052E9B663a8a3f5a70966a3f457c19e5',
    mergeTimestamp: Math.floor(Date.now() / 1000) - 259200, // 3d ago
    txHash: '0xghi789',
    network: 'Monad Testnet',
  },
  {
    tokenId: 45,
    repo: 'soulpr/core',
    prNumber: 45,
    prTitle: 'feat: add webhook integration',
    contributor: '0xA7f2d5e3052E9B663a8a3f5a70966a3f457c19e5',
    mergeTimestamp: Math.floor(Date.now() / 1000) - 432000, // 5d ago
    txHash: '0xjkl012',
    network: 'Monad Testnet',
  },
  {
    tokenId: 46,
    repo: 'soulpr/core',
    prNumber: 12,
    prTitle: 'chore: improve test coverage',
    contributor: '0xA7f2d5e3052E9B663a8a3f5a70966a3f457c19e5',
    mergeTimestamp: Math.floor(Date.now() / 1000) - 604800, // 1w ago
    txHash: '0xmnp345',
    network: 'Monad Testnet',
  }
]

function formatMergeDuration(ts: number) {
  const diff = Math.floor(Date.now() / 1000) - ts
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`
  return `${Math.floor(diff / 604800)} week ago`
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [badges, setBadges] = useState<BadgeData[]>(MOCK_BADGES)
  const [selected, setSelected] = useState<BadgeData | null>(null)
  const [loading, setLoading] = useState(false)
  const [showSearchModal, setShowSearchModal] = useState(false)

  async function handleLookup(lookupQuery: string) {
    if (!lookupQuery.trim()) return
    setLoading(true)
    let targetWallet = lookupQuery.trim()

    // Resolve username to wallet
    if (!targetWallet.startsWith('0x') || targetWallet.length !== 42) {
      try {
        const response = await fetch(`/api/wallet/resolve?query=${encodeURIComponent(targetWallet)}`)
        if (response.ok) {
          const data = await response.json()
          targetWallet = data.walletAddress
        } else if (targetWallet.toLowerCase() === 'demo' || targetWallet.toLowerCase() === 'moizz') {
          targetWallet = '0xA7f2d5e3052E9B663a8a3f5a70966a3f457c19e5'
        }
      } catch {
        if (targetWallet.toLowerCase() === 'demo' || targetWallet.toLowerCase() === 'moizz') {
          targetWallet = '0xA7f2d5e3052E9B663a8a3f5a70966a3f457c19e5'
        }
      }
    }

    try {
      const liveBadges = await getAttestations(targetWallet)
      if (liveBadges.length > 0) {
        setBadges(liveBadges)
      } else {
        setBadges(MOCK_BADGES)
      }
    } catch {
      setBadges(MOCK_BADGES)
    } finally {
      setLoading(false)
      setShowSearchModal(false)
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#FAF8F5', color: '#1B1816', fontFamily: 'var(--font-body)' }}>
      
      {/* 1. LEFT SIDEBAR PANEL */}
      <aside style={{ width: '250px', background: '#FFF', borderRight: '1px solid rgba(78, 66, 56, 0.12)', padding: '2rem 1.2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexShrink: 0, textAlign: 'left' }}>
        <div>
          {/* Logo Brand Header */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 850, fontSize: '18px', color: '#1B1816', marginBottom: '2.5rem' }}>
            <div style={{ width: '22px', height: '22px', border: '2px solid #FF7B00', borderRadius: '6px', transform: 'rotate(45deg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '10px', color: '#FF7B00', fontWeight: 'bold', transform: 'rotate(-45deg)' }}>S</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
              <span style={{ fontWeight: 900, fontSize: '16px' }}>SoulPR</span>
              <span style={{ fontSize: '7px', textTransform: 'uppercase', color: '#E05300', letterSpacing: '0.05em', fontWeight: 700 }}>proof that builds you</span>
            </div>
          </Link>

          {/* Navigation Links list */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div className="sidebar-link active" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '8px', background: '#FFF0E6', color: '#FF7B00', fontWeight: 800, fontSize: '13px', cursor: 'pointer' }}>
              🏠 Overview
            </div>
            <div className="sidebar-link" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '8px', color: '#5C544F', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>
              🛡️ My Proofs
            </div>
            <div className="sidebar-link" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '8px', color: '#5C544F', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>
              🏅 SBTs
            </div>
            <div className="sidebar-link" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '8px', color: '#5C544F', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>
              &lt;/&gt; Contributions
            </div>
            <div className="sidebar-link" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '8px', color: '#5C544F', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>
              ⭐ Reputation
            </div>
            <div className="sidebar-link" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '8px', color: '#5C544F', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>
              👥 Followers
            </div>
            <div className="sidebar-link" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '8px', color: '#5C544F', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>
              ⚙️ Settings
            </div>
          </nav>
        </div>

        {/* Sidebar Bottom Banner Widget */}
        <div style={{ background: '#FFF7ED', border: '1px solid rgba(255, 123, 0, 0.15)', borderRadius: '12px', padding: '1.2rem 1rem', position: 'relative' }}>
          <div style={{ width: '40px', height: '40px', margin: '0 auto 10px', overflow: 'hidden' }}>
            <img src="/reputation_shield.png" alt="Orange Shield" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <div style={{ fontWeight: 800, fontSize: '11px', color: '#1B1816', textAlign: 'center', marginBottom: '4px' }}>
            Build. Proof. Grow.
          </div>
          <div style={{ fontSize: '10px', color: '#5C544F', textAlign: 'center', marginBottom: '12px', lineHeight: 1.4 }}>
            Your reputation is your superpower.
          </div>
          <button 
            onClick={() => setShowSearchModal(true)}
            style={{ width: '100%', background: '#FF7B00', color: '#FFF', border: 'none', borderRadius: '6px', padding: '6px 0', fontSize: '10px', fontWeight: 700, cursor: 'pointer' }}
          >
            Look up a contributor →
          </button>
        </div>

      </aside>

      {/* 2. MAIN CONTENT AREA CONTAINER */}
      <main style={{ flex: 1, padding: '2rem 3rem', overflowY: 'auto', textAlign: 'left' }}>
        
        {/* Header toolbar row */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#1B1816', margin: 0 }}>Dashboard</h1>
            <div style={{ fontSize: '13px', color: '#5C544F', marginTop: '2px' }}>Welcome back, builder! 👋</div>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {/* Monad Network selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#FFF', border: '1px solid rgba(78, 66, 56, 0.15)', borderRadius: '8px', padding: '6px 14px', fontSize: '11px', fontWeight: 600, color: '#1B1816' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FF7B00', display: 'inline-block' }} />
              MONAD TESTNET
              <span style={{ fontSize: '8px', opacity: 0.6, marginLeft: '4px' }}>▼</span>
            </div>

            {/* Wallet details copied block */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#FFF', border: '1px solid rgba(255, 123, 0, 0.35)', borderRadius: '8px', padding: '6px 14px', fontSize: '11px', color: '#FF7B00', fontWeight: 700 }}>
              💳 0xA7f2...9c4E
              <span style={{ fontSize: '8px', opacity: 0.6 }}>▼</span>
            </div>
          </div>
        </header>

        {/* 3D Reputation score header card (dark themed) */}
        <section style={{ background: '#110F0E', color: 'white', borderRadius: '16px', padding: '2.2rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', position: 'relative', overflow: 'hidden' }}>
          
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 10% 20%, rgba(255, 123, 0, 0.08) 0%, rgba(0,0,0,0) 60%)' }} />

          <div style={{ position: 'relative', zIndex: 5 }}>
            <div style={{ fontSize: '10px', fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
              YOUR REPUTATION SCORE
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '6px' }}>
              <span style={{ fontSize: '42px', fontWeight: 900, color: '#FFF' }}>1,245</span>
              <span style={{ background: 'rgba(255, 123, 0, 0.15)', border: '1px solid rgba(255,123,0,0.3)', borderRadius: '99px', padding: '3px 10px', fontSize: '10px', color: '#FF7B00', fontWeight: 800 }}>
                Builder <span style={{ opacity: 0.75 }}>Lv. 3</span>
              </span>
            </div>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '1.2rem' }}>Keep contributing to level up!</p>
            
            {/* Progress Level bar */}
            <div style={{ width: '280px' }}>
              <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '99px', overflow: 'hidden', marginBottom: '6px' }}>
                <div style={{ width: '62.2%', height: '100%', background: 'linear-gradient(90deg, #FF9F29 0%, #FF7B00 100%)', borderRadius: '99px' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>
                <span>1,245 XP</span>
                <span>2,000 XP</span>
              </div>
            </div>

          </div>

          {/* Reputation 3D floating graphic shield */}
          <div style={{ position: 'relative', width: '130px', height: '130px', zIndex: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle, rgba(255, 123, 0, 0.25) 0%, rgba(255, 123, 0, 0) 70%)', filter: 'blur(15px)' }} />
            <img 
              src="/reputation_shield.png" 
              alt="Glowing Shield" 
              className="animate-float"
              style={{ width: '85%', height: '85%', objectFit: 'contain', filter: 'drop-shadow(0 10px 20px rgba(255, 123, 0, 0.35))', mixBlendMode: 'screen' }} 
            />
          </div>

        </section>

        {/* 4 Stats metrics widgets row */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.2rem', marginBottom: '2rem' }}>
          
          <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '12px', background: '#FFF', border: '1px solid rgba(78, 66, 56, 0.1)', textAlign: 'left' }}>
            <div style={{ fontSize: '11px', color: '#5C544F', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              &lt;/&gt; Total Proofs
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '8px' }}>
              <span style={{ fontSize: '28px', fontWeight: 900 }}>28</span>
              <span style={{ fontSize: '10px', color: '#16A34A', fontWeight: 700 }}>+5 this month</span>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '12px', background: '#FFF', border: '1px solid rgba(78, 66, 56, 0.1)', textAlign: 'left' }}>
            <div style={{ fontSize: '11px', color: '#5C544F', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              🏅 SBTs Minted
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '8px' }}>
              <span style={{ fontSize: '28px', fontWeight: 900 }}>12</span>
              <span style={{ fontSize: '10px', color: '#16A34A', fontWeight: 700 }}>+3 this month</span>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '12px', background: '#FFF', border: '1px solid rgba(78, 66, 56, 0.1)', textAlign: 'left' }}>
            <div style={{ fontSize: '11px', color: '#5C544F', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              ⭐ Reputation Score
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '8px' }}>
              <span style={{ fontSize: '28px', fontWeight: 900 }}>1,245</span>
              <span style={{ fontSize: '10px', color: '#FF7B00', fontWeight: 700 }}>Top 18% of builders</span>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '12px', background: '#FFF', border: '1px solid rgba(78, 66, 56, 0.1)', textAlign: 'left' }}>
            <div style={{ fontSize: '11px', color: '#5C544F', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              👥 Followers
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '8px' }}>
              <span style={{ fontSize: '28px', fontWeight: 900 }}>156</span>
              <span style={{ fontSize: '10px', color: '#16A34A', fontWeight: 700 }}>+12 this month</span>
            </div>
          </div>

        </section>

        {/* 2-Column lower layout splitscreen */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem', alignItems: 'start' }}>
          
          {/* LEFT SECTION: Recent Proofs table list */}
          <section className="glass-panel" style={{ background: '#FFF', border: '1px solid rgba(78, 66, 56, 0.1)', borderRadius: '16px', padding: '1.8rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 900, color: '#1B1816', margin: 0 }}>Recent Proofs</h2>
              <span style={{ color: '#FF7B00', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>View all</span>
            </div>

            {/* List Row items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {badges.map((b) => (
                <div 
                  key={b.tokenId}
                  onClick={() => setSelected(b)}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(78,66,56,0.06)', background: '#FAF9F7', cursor: 'pointer', transition: 'all 0.2s' }}
                  className="timeline-item-row"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '18px' }}>🐙</span>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '13px', color: '#1B1816' }}>{b.prTitle}</div>
                      <div style={{ fontSize: '10px', color: '#5C544F', marginTop: '2px' }}>{b.repo}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <span style={{ fontSize: '11px', color: '#5C544F' }}>{formatMergeDuration(b.mergeTimestamp)}</span>
                    <span style={{ background: '#DCFCE7', color: '#16A34A', border: '1px solid rgba(22,163,74,0.25)', borderRadius: '99px', fontSize: '9px', fontWeight: 800, padding: '2px 8px' }}>
                      ✓ Attested ✓
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </section>

          {/* RIGHT COLUMN: Your Stats, Recent activity logger, Quick actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* 1. Your Stats card */}
            <div className="glass-panel" style={{ background: '#FFF', border: '1px solid rgba(78, 66, 56, 0.1)', borderRadius: '16px', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 800, color: '#1B1816', borderBottom: '1px solid rgba(78,66,56,0.1)', paddingBottom: '8px', marginBottom: '12px' }}>
                Your Stats
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#5C544F', fontWeight: 600 }}>🛠️ Contributions:</span>
                  <strong style={{ color: '#1B1816' }}>42</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#5C544F', fontWeight: 600 }}>📁 Repositories:</span>
                  <strong style={{ color: '#1B1816' }}>8</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#5C544F', fontWeight: 600 }}>🌐 Networks:</span>
                  <strong style={{ color: '#1B1816' }}>1 (Monad Testnet)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#5C544F', fontWeight: 600 }}>📅 Member Since:</span>
                  <strong style={{ color: '#1B1816' }}>Apr 8, 2025</strong>
                </div>
              </div>
            </div>

            {/* 2. Recent Activity Card log */}
            <div className="glass-panel" style={{ background: '#FFF', border: '1px solid rgba(78, 66, 56, 0.1)', borderRadius: '16px', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 800, color: '#1B1816', borderBottom: '1px solid rgba(78,66,56,0.1)', paddingBottom: '8px', marginBottom: '12px' }}>
                Recent Activity
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '11px', textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <span style={{ fontWeight: 800, color: '#1B1816' }}>SBT Minted:</span>
                    <div style={{ color: '#5C544F', marginTop: '2px' }}>"Open Source Contributor"</div>
                  </div>
                  <span style={{ color: '#C0824E', fontSize: '10px' }}>2h ago</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <span style={{ fontWeight: 800, color: '#1B1816' }}>Proof Attested:</span>
                    <div style={{ color: '#5C544F', marginTop: '2px' }}>feat: add dark mode toggle</div>
                  </div>
                  <span style={{ color: '#C0824E', fontSize: '10px' }}>2h ago</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <span style={{ fontWeight: 800, color: '#1B1816' }}>New Follower:</span>
                    <div style={{ color: '#5C544F', marginTop: '2px' }}>0xB3d4...7aF1</div>
                  </div>
                  <span style={{ color: '#C0824E', fontSize: '10px' }}>1d ago</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <span style={{ fontWeight: 800, color: '#1B1816' }}>Proof Attested:</span>
                    <div style={{ color: '#5C544F', marginTop: '2px' }}>fix: resolve UI alignment issue</div>
                  </div>
                  <span style={{ color: '#C0824E', fontSize: '10px' }}>1d ago</span>
                </div>
              </div>
            </div>

            {/* 3. Quick Actions row */}
            <div className="glass-panel" style={{ background: '#FFF', border: '1px solid rgba(78, 66, 56, 0.1)', borderRadius: '16px', padding: '1.2rem 1.5rem' }}>
              <h3 style={{ fontSize: '11px', color: '#5C544F', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '12px' }}>
                Quick Actions
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                <div style={{ cursor: 'pointer', textAlign: 'center' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#FFF7ED', border: '1px solid rgba(255,123,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px', fontSize: '16px' }}>🛡️</div>
                  <span style={{ fontSize: '9px', fontWeight: 700, color: '#5C544F' }}>Verify</span>
                </div>
                <div style={{ cursor: 'pointer', textAlign: 'center' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#FFF7ED', border: '1px solid rgba(255,123,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px', fontSize: '16px' }}>📦</div>
                  <span style={{ fontSize: '9px', fontWeight: 700, color: '#5C544F' }}>Mint SBT</span>
                </div>
                <div style={{ cursor: 'pointer', textAlign: 'center' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#FFF7ED', border: '1px solid rgba(255,123,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px', fontSize: '16px' }}>👥</div>
                  <span style={{ fontSize: '9px', fontWeight: 700, color: '#5C544F' }}>Invite</span>
                </div>
                <div style={{ cursor: 'pointer', textAlign: 'center' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#FFF7ED', border: '1px solid rgba(255,123,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px', fontSize: '16px' }}>📖</div>
                  <span style={{ fontSize: '9px', fontWeight: 700, color: '#5C544F' }}>Docs</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* Lookup search modal dialog */}
      {showSearchModal && (
        <div className="modal-overlay" onClick={() => setShowSearchModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ background: '#FFF', padding: '2rem', borderRadius: '16px', width: '100%', maxWidth: '400px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 900, marginBottom: '1rem' }}>Look up a contributor</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input 
                className="input" 
                placeholder="Enter GitHub username or wallet" 
                value={query} 
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLookup(query)}
                style={{ flex: 1 }}
              />
              <button 
                className="btn" 
                onClick={() => handleLookup(query)} 
                disabled={loading}
                style={{ background: '#FF7B00', color: '#FFF', borderRadius: '8px', padding: '0 16px', border: 'none', fontWeight: 700 }}
              >
                {loading ? '...' : 'Search'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Badge detail receipt modal */}
      {selected && (
        <BadgeDetailModal badge={selected} onClose={() => setSelected(null)} />
      )}

    </div>
  )
}
