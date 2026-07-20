import { useNavigate } from 'react-router-dom'
import Nav from '../components/Nav'
import {
  IconShield, IconLink, IconCode, IconZap,
  IconArrowRight, IconUser
} from '../components/Icons'

export default function Landing() {
  const navigate = useNavigate()

  const featureCard = (
    icon: React.ReactNode,
    title: string,
    desc: string,
  ) => (
    <div
      key={title}
      style={{
        padding: '1.6rem',
        borderRadius: '16px',
        background: 'var(--paper-raised)',
        border: '1px solid var(--rule)',
        textAlign: 'left',
        transition: 'border-color 0.2s, background 0.2s',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255, 123, 0, 0.4)'
        ;(e.currentTarget as HTMLElement).style.background = 'var(--stamp-bg)'
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--rule)'
        ;(e.currentTarget as HTMLElement).style.background = 'var(--paper-raised)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
        <div style={{
          width: '34px', height: '34px', borderRadius: '8px',
          background: 'rgba(255, 123, 0, 0.08)',
          border: '1px solid rgba(255, 123, 0, 0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          {icon}
        </div>
        <div style={{ fontWeight: 800, fontSize: '13px', color: 'var(--ink)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {title}
        </div>
      </div>
      <div style={{ fontSize: '12px', color: 'var(--ink-muted)', lineHeight: '1.65' }}>
        {desc}
      </div>
    </div>
  )

  return (
    <div style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', background: 'var(--paper)', color: 'var(--ink)', transition: 'background 0.3s, color 0.3s' }}>

      {/* Floating ember particles */}
      <div className="forge-embers" aria-hidden="true">
        <div className="ember" style={{ left: '10%', width: '3px', height: '3px', animationDelay: '0s', animationDuration: '6s' }} />
        <div className="ember" style={{ left: '30%', width: '4px', height: '4px', animationDelay: '1.5s', animationDuration: '8s' }} />
        <div className="ember" style={{ left: '55%', width: '2px', height: '2px', animationDelay: '3s', animationDuration: '5s' }} />
        <div className="ember" style={{ left: '72%', width: '5px', height: '5px', animationDelay: '4.5s', animationDuration: '9s' }} />
        <div className="ember" style={{ left: '88%', width: '3px', height: '3px', animationDelay: '2s', animationDuration: '7s' }} />
      </div>

      {/* Background coin glow */}
      <div className="bg-animation-container" aria-hidden="true">
        <div className="bg-anim-coin coin-main" />
        <div className="bg-anim-coin coin-top-left" />
        <div className="bg-anim-coin coin-bottom-right" />
      </div>

      <Nav />

      <main style={{ padding: '5rem 2rem 5rem', position: 'relative', zIndex: 5, maxWidth: '1240px', margin: '0 auto' }}>

        {/* 2-Column Hero */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: '4rem', alignItems: 'center', marginBottom: '5rem' }}>

          {/* Left column */}
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>

            {/* Top pill badge */}
            <div style={{ marginBottom: '1.8rem' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                fontSize: '11px', fontWeight: 800, textTransform: 'uppercase',
                color: '#FF7B00',
                background: 'rgba(255, 123, 0, 0.07)',
                border: '1px solid rgba(255, 123, 0, 0.2)',
                padding: '7px 16px', borderRadius: '99px', letterSpacing: '0.08em',
              }}>
                <IconShield size={13} color="#FF7B00" />
                SOULBOUND. NON-TRANSFERABLE. FOREVER YOURS.
              </span>
            </div>

            {/* Headline */}
            <h1 style={{
              fontSize: '66px', lineHeight: '1.04',
              marginBottom: '1.6rem', color: 'var(--ink)',
              fontWeight: 900, fontFamily: 'var(--font-display)',
            }}>
              Your Code.<br />
              Your Impact.<br />
              <span style={{ color: '#FF7B00' }}>Your Proof.</span>
            </h1>

            {/* Divider accent */}
            <div style={{ width: '56px', height: '4px', background: '#FF7B00', borderRadius: '99px', marginBottom: '1.8rem', opacity: 0.8 }} />

            {/* Body copy */}
            <p style={{ fontSize: '17.5px', color: 'var(--ink-muted)', marginBottom: '2.8rem', lineHeight: '1.75', maxWidth: '520px' }}>
              SoulPR turns every merged pull request into a permanent, on-chain attestation — verifiable by anyone, anywhere. Built in public. Earned forever.
            </p>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <button
                id="cta-dashboard"
                onClick={() => navigate('/dashboard')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  background: 'linear-gradient(135deg, #FF7B00 0%, #E05300 100%)',
                  color: 'white', borderRadius: '10px',
                  padding: '1.05rem 2.2rem',
                  fontWeight: 800, fontSize: '16px', border: 'none',
                  cursor: 'pointer', boxShadow: '0 6px 20px rgba(255, 123, 0, 0.22)',
                  transition: 'transform 0.15s, box-shadow 0.15s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'
                  ;(e.currentTarget as HTMLElement).style.boxShadow = '0 10px 28px rgba(255,123,0,0.3)'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
                  ;(e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(255,123,0,0.22)'
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                </svg>
                Dashboard
                <IconArrowRight size={14} color="white" />
              </button>

              <button
                id="cta-lookup"
                onClick={() => navigate('/dashboard')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  color: '#FFF', borderRadius: '8px',
                  padding: '0.9rem 1.8rem',
                  fontWeight: 700, fontSize: '14px',
                  border: '1px solid rgba(255,255,255,0.12)',
                  cursor: 'pointer', transition: 'background 0.2s, border-color 0.2s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)'
                  ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.2)'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'
                  ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)'
                }}
              >
                <IconUser size={14} color="#FFF" />
                Look up a contributor
                <IconArrowRight size={14} color="#FFF" />
              </button>
            </div>

            {/* Scroll indicator */}
            <div style={{ marginTop: '4.5rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
              <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700 }}>
                SCROLL TO EXPLORE
              </span>
              <div style={{ width: '24px', height: '40px', border: '1.5px solid rgba(255,255,255,0.15)', borderRadius: '99px', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '5px' }}>
                <div style={{ width: '4px', height: '8px', background: '#FF7B00', borderRadius: '99px', animation: 'scrollDot 1.8s ease-in-out infinite' }} />
              </div>
            </div>
          </div>

          {/* Right column: Monad coin */}
          <div className="animate-float" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', inset: '-60px', background: 'radial-gradient(circle, rgba(255, 123, 0, 0.18) 0%, transparent 70%)', filter: 'blur(30px)', zIndex: 1 }} />
              <img
                src="/golden_monad_coin.png?v=3"
                alt="Monad Coin"
                style={{ width: '100%', maxWidth: '460px', position: 'relative', zIndex: 2, filter: 'drop-shadow(0 20px 50px rgba(255, 123, 0, 0.25))', mixBlendMode: 'screen' }}
              />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'rgba(78, 66, 56, 0.28)', marginBottom: '3.5rem' }} />

        {/* Feature cards row */}
        <div id="features" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', scrollMarginTop: '100px' }}>
          {featureCard(<IconShield size={16} color="#FF7B00" />, 'SOULBOUND', 'Non-transferable. Forever yours. Bound securely to your wallet.')}
          {featureCard(<IconLink size={16} color="#FF7B00" />, 'VERIFIABLE', 'On-chain forever. No central control. Anyone can query and verify.')}
          {featureCard(<IconCode size={16} color="#FF7B00" />, 'OPEN SOURCE', 'Built for builders. Trusted by the community. Always transparent.')}
          {featureCard(<IconZap size={16} color="#FF7B00" />, 'BUILT ON MONAD', 'Low gas fees. Extreme scalability. Ready for Web3 scale.')}
        </div>

        {/* How It Works section */}
        <div id="how-it-works" style={{ marginTop: '5rem', padding: '3.5rem 2.5rem', background: 'var(--paper-raised)', border: '1px solid var(--rule)', borderRadius: '20px', textAlign: 'center', scrollMarginTop: '100px' }}>
          <div style={{ fontSize: '10px', fontWeight: 800, color: '#FF7B00', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '10px' }}>
            HOW IT WORKS & FAQ
          </div>
          <h2 style={{ fontSize: '32px', fontWeight: 900, color: 'var(--ink)', marginBottom: '1rem', fontFamily: 'var(--font-display)' }}>
            From Pull Request to <span style={{ color: '#FF7B00' }}>On-Chain Proof</span>
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--ink-muted)', maxWidth: '560px', margin: '0 auto 2.5rem', lineHeight: '1.7' }}>
            SoulPR monitors tracked GitHub repositories. When a pull request is merged, an automated webhook triggers the minting of a non-transferable Soulbound Token to your linked wallet.
          </p>

          {/* FAQ list inside Landing page */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '760px', margin: '0 auto', textAlign: 'left' }}>
            {[
              { q: 'What is SoulPR?', a: 'SoulPR turns your real contributions (like merged pull requests) into soulbound attestations on Monad. These proofs are non-transferable, verifiable by anyone, and permanently tied to your identity.' },
              { q: 'How does automated minting work?', a: 'We monitor GitHub pull requests. The moment a PR is merged in a tracked repository, a webhook triggers. If your GitHub identity is linked to a wallet, a Soulbound Token is automatically minted to your address.' },
              { q: 'What is a Soulbound Token (SBT)?', a: 'Soulbound Tokens (SBTs) are non-fungible tokens that represent traits, features, or achievements on-chain. Once minted to a wallet, they cannot be transferred or sold.' },
              { q: 'Do I need to pay gas fees?', a: 'No. Gas fees for minting the on-chain SBT are covered entirely by our backend minter wallet, making the experience 100% free for open-source contributors.' },
            ].map(({ q, a }, idx) => (
              <details key={idx} style={{ background: 'rgba(255,123,0,0.02)', border: '1px solid var(--rule)', borderRadius: '12px', padding: '1.2rem 1.4rem', cursor: 'pointer' }}>
                <summary style={{ fontSize: '15px', fontWeight: 700, color: 'var(--ink)', outline: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{q}</span>
                  <span style={{ color: '#FF7B00', fontSize: '18px', fontWeight: 900 }}>+</span>
                </summary>
                <p style={{ fontSize: '13px', color: 'var(--ink-muted)', lineHeight: '1.65', marginTop: '1rem', marginBottom: 0 }}>
                  {a}
                </p>
              </details>
            ))}
          </div>
        </div>

        {/* About section */}
        <div id="about" style={{ marginTop: '3.5rem', padding: '3rem 2.5rem', background: 'var(--paper-raised)', border: '1px solid var(--rule)', borderRadius: '16px', textAlign: 'center', scrollMarginTop: '100px' }}>
          <div style={{ fontSize: '10px', fontWeight: 800, color: '#FF7B00', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '10px' }}>ABOUT SOULPR</div>
          <h2 style={{ fontSize: '28px', fontWeight: 900, color: 'var(--ink)', marginBottom: '1rem', fontFamily: 'var(--font-display)' }}>
            Built for Builders, Owned by You
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--ink-muted)', maxWidth: '640px', margin: '0 auto 1.5rem', lineHeight: '1.7' }}>
            SoulPR bridges open-source contribution and Web3 identity. By turning merged pull requests into non-transferable Soulbound Tokens (SBTs) on the Monad network, SoulPR ensures that your code contributions are permanently verifiable, tamper-proof, and forever attributed to your identity.
          </p>
        </div>

      </main>

      <style>{`
        @keyframes scrollDot {
          0% { transform: translateY(0); opacity: 1; }
          80% { transform: translateY(14px); opacity: 0.2; }
          100% { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
