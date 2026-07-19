import { useNavigate } from 'react-router-dom'
import Nav from '../components/Nav'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', background: '#0B0A09' }}>
      
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

      <main className="landing-outer animate-fade-in" style={{ padding: '4.5rem 1.5rem 5rem', position: 'relative', zIndex: 5, maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* 2-Column Split Hero Layout */}
        <div className="hero-split-two" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '3.5rem', alignItems: 'center' }}>
          
          {/* Column 1: Left Text & CTA */}
          <div className="hero-text-col" style={{ display: 'flex', flexDirection: 'column', alignSelf: 'center', textAlign: 'left' }}>
            
            {/* Tag/Pill at top */}
            <div className="animate-slide-up-1" style={{ marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', color: '#FF7B00', background: 'rgba(255, 123, 0, 0.08)', border: '1px solid rgba(255, 123, 0, 0.25)', padding: '5px 12px', borderRadius: '99px', letterSpacing: '0.08em' }}>
                🛡️ SOULBOUND. NON-TRANSFERABLE. FOREVER YOURS.
              </span>
            </div>

            <h1 className="forge-headline animate-slide-up-2" style={{ fontSize: '56px', lineHeight: '1.05', marginBottom: '1.5rem', color: '#FFF', fontWeight: 900, fontFamily: 'var(--font-display)' }}>
              Your Code.<br />
              Your Impact.<br />
              <span style={{ color: '#FF7B00' }}>Your Proof.</span>
            </h1>

            <p className="landing-body animate-slide-up-3" style={{ fontSize: '15px', color: 'rgba(255, 255, 255, 0.65)', marginBottom: '2.5rem', lineHeight: '1.7', maxWidth: '480px' }}>
              SoulPR turns every merged pull request into a permanent, on-chain attestation — verifiable by anyone, anywhere. Built in public. Earned forever.
            </p>

            <div className="animate-slide-up-4" style={{ display: 'flex', gap: '12px' }}>
              <button
                id="cta-dashboard"
                className="btn btn-primary"
                onClick={() => navigate('/dashboard')}
                style={{
                  background: 'linear-gradient(135deg, #FF7B00 0%, #E05300 100%)',
                  color: 'white',
                  borderRadius: '8px',
                  padding: '0.95rem 2rem',
                  fontWeight: 700,
                  fontSize: '15px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 6px 20px rgba(255, 123, 0, 0.2)'
                }}
              >
                Dashboard →
              </button>
              <button
                id="cta-lookup"
                className="btn"
                onClick={() => navigate('/dashboard')}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#FFF',
                  borderRadius: '8px',
                  padding: '0.95rem 2rem',
                  fontWeight: 700,
                  fontSize: '15px',
                  border: '1px solid rgba(255,255,255,0.15)',
                  cursor: 'pointer'
                }}
              >
                Look up a contributor →
              </button>
            </div>

            {/* Scroll indicator anchor */}
            <div style={{ marginTop: '4rem', display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.4)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              <span style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.2)' }} />
              SCROLL TO EXPLORE
            </div>

          </div>

          {/* Column 2: Center/Right Glowing Monad Coin (Bigger representation) */}
          <div className="hero-center-col animate-float" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              {/* Radial gradient background behind the coin */}
              <div style={{ position: 'absolute', inset: '-50px', background: 'radial-gradient(circle, rgba(255, 123, 0, 0.15) 0%, rgba(255, 123, 0, 0) 70%)', filter: 'blur(30px)', zIndex: 1 }} />
              <img 
                src="/golden_monad_coin.png?v=3" 
                alt="Golden Monad Refraction Coin" 
                style={{ width: '100%', maxWidth: '350px', position: 'relative', zIndex: 2, filter: 'drop-shadow(0 20px 40px rgba(255, 123, 0, 0.2))', mixBlendMode: 'screen' }}
              />
            </div>
          </div>

        </div>

        <div className="landing-divider" style={{ margin: '4rem 0 3rem', background: 'rgba(78, 66, 56, 0.3)' }} />

        {/* Bottom row: Features layout grid */}
        <div className="hero-bottom-row animate-slide-up-5" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', textAlign: 'left' }}>
          
          <div className="glass-panel" style={{ padding: '1.8rem 1.5rem', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(78, 66, 56, 0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255, 123, 0, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF7B00', fontWeight: 'bold', border: '1px solid rgba(255,123,0,0.2)' }}>
                🛡️
              </div>
              <div style={{ fontWeight: 800, fontSize: '14px', color: '#FFF', textTransform: 'uppercase', letterSpacing: '0.04em' }}>SOULBOUND</div>
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.6' }}>
              Non-transferable. Forever yours. Bound securely to your wallet.
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.8rem 1.5rem', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(78, 66, 56, 0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255, 123, 0, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF7B00', fontWeight: 'bold', border: '1px solid rgba(255,123,0,0.2)' }}>
                ⛓️
              </div>
              <div style={{ fontWeight: 800, fontSize: '14px', color: '#FFF', textTransform: 'uppercase', letterSpacing: '0.04em' }}>VERIFIABLE</div>
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.6' }}>
              On-chain forever. No central control. Anyone can query and verify.
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.8rem 1.5rem', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(78, 66, 56, 0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255, 123, 0, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF7B00', fontWeight: 'bold', border: '1px solid rgba(255,123,0,0.2)' }}>
                &lt;/&gt;
              </div>
              <div style={{ fontWeight: 800, fontSize: '14px', color: '#FFF', textTransform: 'uppercase', letterSpacing: '0.04em' }}>OPEN SOURCE</div>
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.6' }}>
              Built for builders. Trusted by the community. Always transparent.
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.8rem 1.5rem', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(78, 66, 56, 0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255, 123, 0, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF7B00', fontWeight: 'bold', border: '1px solid rgba(255,123,0,0.2)' }}>
                ⚡
              </div>
              <div style={{ fontWeight: 800, fontSize: '14px', color: '#FFF', textTransform: 'uppercase', letterSpacing: '0.04em' }}>BUILT ON MONAD</div>
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.6' }}>
              Low gas fees. Extreme scalability performance. Ready for Web3 scale.
            </div>
          </div>

        </div>

      </main>
    </div>
  )
}
