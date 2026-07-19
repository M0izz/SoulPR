export interface BadgeData {
  tokenId: number
  repo: string
  prNumber: number
  prTitle: string
  githubUsername?: string
  mergeCommitSha?: string
  contributor: string
  mergeTimestamp: number
  txHash: string
  network: string
}

interface Props {
  badge: BadgeData
  onClose: () => void
}

function formatDateTime(ts: number) {
  return new Date(ts * 1000).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

function formatLocalDate(ts: number) {
  return new Date(ts * 1000).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

function shortAddr(addr: string) {
  if (addr.length <= 13) return addr
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

export default function BadgeDetailModal({ badge, onClose }: Props) {
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.65)' }}>
      
      {/* 2-Column Split Modal Panel */}
      <div className="glass-panel" style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '2.5rem', background: '#0F0E0D', color: '#FFF', borderRadius: '20px', border: '1px solid rgba(78, 66, 56, 0.4)', padding: '2.2rem', width: '100%', maxWidth: '880px', position: 'relative', textAlign: 'left', overflow: 'hidden' }}>
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          style={{ position: 'absolute', top: '1.2rem', right: '1.5rem', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '18px', cursor: 'pointer', zIndex: 10 }}
        >
          ✕
        </button>

        {/* ============================================================
             LEFT COLUMN: 3D Holographic Translucent SBT Card
             ============================================================ */}
        <div style={{ position: 'relative', width: '100%', height: '480px', background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.08) 0%, rgba(234, 88, 12, 0.04) 100%)', borderRadius: '16px', border: '1px solid rgba(168, 85, 247, 0.25)', boxShadow: '0 12px 35px rgba(0,0,0,0.4)', padding: '1.8rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden' }}>
          
          {/* Hologram gloss/glow effects */}
          <div style={{ position: 'absolute', top: '-50px', left: '-50px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(30px)' }} />
          <div style={{ position: 'absolute', bottom: '-50px', right: '-50px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(234, 88, 12, 0.15) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(30px)' }} />

          {/* Header Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 2 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 900, letterSpacing: '0.05em', opacity: 0.8 }}>SOULPR</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', opacity: 0.8 }}>SBT #000{badge.tokenId}</span>
          </div>

          {/* Center Content: Hexagon and Title */}
          <div style={{ textAlign: 'center', position: 'relative', zIndex: 2, margin: '2rem 0' }}>
            
            {/* glowing Hexagon Container */}
            <div style={{ width: '80px', height: '90px', background: 'linear-gradient(135deg, rgba(168,85,247,0.3) 0%, rgba(59,130,246,0.3) 100%)', border: '2px solid rgba(168, 85, 247, 0.65)', boxShadow: '0 0 25px rgba(168, 85, 247, 0.35)', margin: '0 auto 1.5rem', clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '26px', color: '#E9D5FF', fontWeight: 'bold' }}>&lt;/&gt;</span>
            </div>

            {/* Achievement Badge Pill */}
            <div style={{ display: 'inline-block', background: 'rgba(168, 85, 247, 0.15)', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: '99px', padding: '3px 12px', fontSize: '9px', fontWeight: 800, color: '#D8B4FE', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>
              ACHIEVEMENT
            </div>

            {/* Title */}
            <h4 style={{ fontSize: '22px', fontWeight: 950, textTransform: 'uppercase', color: '#FFF', letterSpacing: '0.02em', margin: '0 0 8px' }}>
              Open Source Contributor
            </h4>
            
            {/* Description */}
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.5', padding: '0 1rem' }}>
              Awarded for making your first meaningful contribution to an open source repository.
            </p>

          </div>

          {/* Bottom details block */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.2rem', position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
              <span>ISSUED TO</span>
              <span>ISSUED ON</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 700, color: '#FFF', fontFamily: 'var(--font-mono)' }}>
              <span>{shortAddr(badge.contributor)}</span>
              <span>{formatLocalDate(badge.mergeTimestamp)}</span>
            </div>

            {/* Verifiable Monad Footer logo */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.2rem', fontSize: '9px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              <span>🛡️ VERIFIABLE ON MONAD TESTNET</span>
              <span style={{ fontSize: '12px' }}>Σ</span>
            </div>
          </div>

        </div>

        {/* ============================================================
             RIGHT COLUMN: Details list, About, and verification
             ============================================================ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Header Row */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '10px', fontWeight: 800, color: '#FF7B00', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                🏅 ACHIEVEMENT SBT
              </span>
              <span style={{ background: 'rgba(22, 163, 74, 0.15)', border: '1px solid rgba(22, 163, 74, 0.3)', borderRadius: '99px', padding: '2px 8px', fontSize: '9px', color: '#4ADE80', fontWeight: 800 }}>
                ✓ Valid SBT
              </span>
            </div>
            
            <h3 style={{ fontSize: '26px', fontWeight: 900, color: '#FFF', margin: 0 }}>
              Open Source Contributor
            </h3>
            
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.6', marginTop: '8px', marginBottom: '1.2rem' }}>
              Awarded for making your first meaningful contribution to an open source repository through a merged pull request.
            </p>

            {/* Badges Row */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ background: 'rgba(168, 85, 247, 0.12)', border: '1px solid rgba(168, 85, 247, 0.25)', borderRadius: '6px', padding: '4px 10px', fontSize: '10px', color: '#D8B4FE', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                💜 Monad Testnet
              </span>
              <span style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '4px 10px', fontSize: '10px', color: 'rgba(255,255,255,0.7)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                🛡️ Non-transferable Soulbound Token
              </span>
            </div>
          </div>

          {/* Details Table Card */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.2rem' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#FF7B00', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '10px' }}>
              DETAILS
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '11.5px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '6px' }}>
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>🆔 SBT ID</span>
                <strong style={{ color: '#FFF', fontFamily: 'var(--font-mono)' }}>#000{badge.tokenId}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '6px' }}>
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>👤 Issued To</span>
                <strong style={{ color: '#FFF', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {shortAddr(badge.contributor)} 📋
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '6px' }}>
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>📅 Issued On</span>
                <strong style={{ color: '#FFF' }}>{formatDateTime(badge.mergeTimestamp)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '6px' }}>
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>🏫 Issuer</span>
                <strong style={{ color: '#FF7B00', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  SoulPR Protocol 🧡
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '6px' }}>
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>🌐 Network</span>
                <strong style={{ color: '#FFF', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Monad Testnet 🟣
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>🛡️ Standard</span>
                <strong style={{ color: '#FFF' }}>ERC-5192 (SBT)</strong>
              </div>
            </div>
          </div>

          {/* About this SBT block */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1rem 1.2rem' }}>
            <div style={{ maxWidth: '80%' }}>
              <div style={{ fontSize: '10px', color: '#FF7B00', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
                ABOUT THIS SBT
              </div>
              <p style={{ fontSize: '10.5px', color: 'rgba(255,255,255,0.4)', lineHeight: '1.4', margin: 0 }}>
                This SBT represents your on-chain identity as an open source contributor. It proves that you've made your first contribution that was accepted and merged.
              </p>
            </div>
            <div style={{ width: '42px', height: '42px', background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.3)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', color: '#D8B4FE' }}>
              &lt;/&gt;
            </div>
          </div>

          {/* Verification / monad explorer links */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', background: 'rgba(168,85,247,0.05)', border: '1px solid rgba(168,85,247,0.15)', borderRadius: '12px', padding: '1rem 1.2rem' }}>
            <div style={{ width: '38px', height: '38px', background: 'rgba(168,85,247,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', color: '#C084FC' }}>
              🛡️
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#FFF' }}>VERIFICATION</div>
              <p style={{ fontSize: '10.5px', color: 'rgba(255,255,255,0.5)', margin: '2px 0 4px' }}>
                This Soulbound Token is non-transferable and permanently bound to your wallet.
              </p>
              <a 
                href={`https://testnet.monadexplorer.com/tx/${badge.txHash}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ fontSize: '10.5px', color: '#D8B4FE', fontWeight: 800, textDecoration: 'underline' }}
              >
                Verify on Monad Explorer ↗
              </a>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
