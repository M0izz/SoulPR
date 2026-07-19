import { useNavigate } from 'react-router-dom'
import Nav from '../components/Nav'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh' }}>
      {/* Floating Spark Particles (Forge embers) */}
      <div className="forge-embers" aria-hidden="true">
        <div className="ember" style={{ left: '10%', width: '3px', height: '3px', animationDelay: '0s', animationDuration: '6s' }} />
        <div className="ember" style={{ left: '30%', width: '4px', height: '4px', animationDelay: '1.5s', animationDuration: '8s' }} />
        <div className="ember" style={{ left: '50%', width: '2px', height: '2px', animationDelay: '3s', animationDuration: '5s' }} />
        <div className="ember" style={{ left: '70%', width: '5px', height: '5px', animationDelay: '4.5s', animationDuration: '9s' }} />
        <div className="ember" style={{ left: '85%', width: '3px', height: '3px', animationDelay: '2.5s', animationDuration: '7s' }} />
      </div>

      {/* Moving Background Coin Animation (Inspired by Telegram collectibles) */}
      <div className="bg-animation-container" aria-hidden="true">
        <div className="bg-anim-coin coin-main" />
        <div className="bg-anim-coin coin-top-left" />
        <div className="bg-anim-coin coin-bottom-right" />
      </div>

      <Nav />

      <main className="landing-outer animate-fade-in" style={{ padding: '3.5rem 1.5rem 5rem', position: 'relative', zIndex: 5 }}>
        {/* 2-Column Split Hero Layout */}
        <div className="hero-split-two">
          
          {/* Column 1: Left Text & Connect CTA */}
          <div className="hero-text-col" style={{ display: 'flex', flexDirection: 'column', alignSelf: 'center' }}>
            <div className="landing-eyebrow animate-slide-up-1" style={{ marginBottom: '1.2rem' }}>
              <span className="live-dot" />
              <span className="eyebrow" style={{ color: 'var(--ink)' }}>live on monad testnet</span>
            </div>

            <h1 className="forge-headline animate-slide-up-2" style={{ fontSize: '38px', lineHeight: '1.1', marginBottom: '1.2rem', color: 'var(--ink)', fontWeight: 800 }}>
              Claim Your Unfakable Open Source Contribution Receipt.
            </h1>

            <p className="landing-body animate-slide-up-3" style={{ fontSize: '15px', color: 'var(--ink-muted)', marginBottom: '2rem', lineHeight: '1.6' }}>
              Automatically convert your merged GitHub PRs into soulbound, verifiable badges on the Monad testnet.
            </p>

            <div className="animate-slide-up-4">
              <button
                id="cta-link-wallet"
                className="btn btn-primary"
                onClick={() => navigate('/link-wallet')}
                style={{
                  background: 'linear-gradient(135deg, #FF7B00 0%, #E05300 100%)',
                  color: 'white',
                  borderRadius: '99px',
                  padding: '0.85rem 1.8rem',
                  fontWeight: 700,
                  fontSize: '15px'
                }}
              >
                Connect GitHub & Wallet
              </button>
              <div style={{ marginTop: '0.8rem', fontSize: '13px', color: 'var(--ink-muted)' }}>
                Already have an account? <span style={{ color: 'var(--stamp)', fontWeight: 600, cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>Sign In</span>
              </div>
            </div>
          </div>

          {/* Column 2: Right Verifiable Profile Card */}
          <div className="hero-profile-col animate-slide-up-3" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px', width: '100%', maxWidth: '320px' }}>
              
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ink)' }}>Your Verifiable Contribution Profile</div>
              <div style={{ fontSize: '11px', color: 'var(--ink-muted)', marginBottom: '1.2rem' }}>Preview a public dashboard</div>

              {/* Profile Card Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--paper-raised)', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--rule)', marginBottom: '1.2rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #FF9F29 0%, #FF7B00 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '13px' }}>
                  M
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--ink)' }}>moizz</div>
                  <div className="stamp" style={{ transform: 'none', borderStyle: 'solid', borderWidth: '1px', fontSize: '8px', padding: '1px 6px', background: 'var(--success-bg)', color: 'var(--success)', borderColor: 'var(--success)', marginTop: '2px' }}>
                    ✓ VERIFIED
                  </div>
                </div>
              </div>

              {/* Wallet lookup card copy bar */}
              <div style={{ display: 'flex', gap: '6px', marginBottom: '1.2rem' }}>
                <input
                  readOnly
                  value="0x8a3f...c19e"
                  style={{ flex: 1, padding: '5px 10px', fontSize: '12px', background: 'var(--paper)', border: '1px solid var(--rule)', borderRadius: '6px', color: 'var(--ink-muted)', outline: 'none' }}
                />
                <button className="btn btn-sm" style={{ background: 'var(--stamp)', color: 'white', borderRadius: '6px', padding: '0 10px', fontSize: '11px', fontWeight: 700 }}>
                  Copy
                </button>
              </div>

              {/* Table list */}
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ink-muted)', marginBottom: '6px' }}>Repo Contributions</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '4px', color: 'var(--ink-faint)' }}>
                  <span>Repo</span>
                  <span>PR</span>
                  <span>Timestamp</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--ink)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>🍴 filedrop</span>
                  <span style={{ color: 'var(--stamp)', fontWeight: 600 }}>PR 106</span>
                  <span style={{ color: 'var(--ink-muted)' }}>5 hours ago</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--ink)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>🍴 CNTRL</span>
                  <span style={{ color: 'var(--stamp)', fontWeight: 600 }}>PR 123</span>
                  <span style={{ color: 'var(--ink-muted)' }}>7 hours ago</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--ink)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>🍴 JugaadLang</span>
                  <span style={{ color: 'var(--stamp)', fontWeight: 600 }}>PR 133</span>
                  <span style={{ color: 'var(--ink-muted)' }}>7 hours ago</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        <div className="landing-divider" style={{ margin: '3.5rem 0 2.5rem' }} />

        {/* Bottom row: Features & CTA card */}
        <div className="hero-bottom-row animate-slide-up-5" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          
          <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'var(--stamp-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--stamp)', fontWeight: 'bold' }}>
                🍴
              </div>
              <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--ink)' }}>Merged & Minted</div>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>
              Your merged PRs instantly become soulbound tokens.
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'var(--stamp-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--stamp)', fontWeight: 'bold' }}>
                ⛓
              </div>
              <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--ink)' }}>Soulbound Proof</div>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>
              Non-transferable verification, secured on-chain.
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.2rem 1.5rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--ink)', textAlign: 'center', marginBottom: '8px' }}>
              Build Your Verifiable Portfolio Today
            </div>
            <button 
              className="btn btn-sm"
              onClick={() => navigate('/link-wallet')}
              style={{ background: 'linear-gradient(135deg, #FF7B00 0%, #E05300 100%)', color: 'white', borderRadius: '99px', width: '100%', maxWidth: '140px', fontWeight: 700, padding: '6px 0', cursor: 'pointer' }}
            >
              Get Started
            </button>
          </div>

        </div>

        {/* Brand Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4rem', fontSize: '12px', color: 'var(--ink-muted)', borderTop: '1px solid var(--rule)', paddingTop: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('/how-it-works')}>How It Works</span>
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('/install')}>GitHub App</span>
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('/link-wallet')}>Connect Wallet</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--stamp)', display: 'inline-block' }} />
            Monad testnet
          </div>
        </div>
      </main>
    </div>
  )
}
