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
    detail: string,
  ) => (
    <div
      key={title}
      style={{
        padding: '1.8rem',
        borderRadius: '16px',
        background: 'var(--paper-raised)',
        border: '1px solid var(--rule)',
        textAlign: 'left',
        display: 'flex',
        flexDirection: 'column',
        gap: '0',
        transition: 'border-color 0.2s, background 0.2s, transform 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = 'rgba(255, 123, 0, 0.45)'
        el.style.background = 'var(--stamp-bg)'
        el.style.transform = 'translateY(-3px)'
        el.style.boxShadow = '0 12px 32px rgba(255,123,0,0.1)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = 'var(--rule)'
        el.style.background = 'var(--paper-raised)'
        el.style.transform = 'translateY(0)'
        el.style.boxShadow = 'none'
      }}
    >
      {/* Icon + title row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '9px',
          background: 'rgba(255, 123, 0, 0.09)',
          border: '1px solid rgba(255, 123, 0, 0.22)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          {icon}
        </div>
        <div style={{ fontWeight: 800, fontSize: '12px', color: 'var(--ink)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {title}
        </div>
      </div>

      {/* Description */}
      <div style={{ fontSize: '13px', color: 'var(--ink-muted)', lineHeight: '1.7', marginBottom: '16px', flexGrow: 1 }}>
        {desc}
      </div>

      {/* Stat / highlight badge */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '7px',
        fontSize: '11px', fontWeight: 700,
        color: '#FF7B00',
        background: 'rgba(255,123,0,0.07)',
        border: '1px solid rgba(255,123,0,0.15)',
        borderRadius: '99px',
        padding: '5px 12px',
        width: 'fit-content',
      }}>
        <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#FF7B00', display: 'inline-block', flexShrink: 0 }} />
        {detail}
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
                    ; (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 28px rgba(255,123,0,0.3)'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
                    ; (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(255,123,0,0.22)'
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
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
                    ; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.2)'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'
                    ; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)'
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

          {/* Right column: Monad coin — 3D motion graphics */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', animation: 'hero-float 6s ease-in-out infinite' }}>

            {/*
             * OUTER GLOW — lives outside the mask so it bleeds freely
             * into the page background without being clipped
             */}
            <div style={{ position: 'relative', width: '460px', height: '460px' }}>
              <div style={{
                position: 'absolute', inset: '-90px', borderRadius: '50%', zIndex: 0, pointerEvents: 'none',
                background: 'radial-gradient(circle, rgba(255,150,0,0.28) 0%, rgba(255,80,0,0.1) 45%, transparent 68%)',
                filter: 'blur(32px)',
                animation: 'glow-breathe 4s ease-in-out infinite',
              }} />

              {/*
               * MASK WRAPPER — radial circular clip removes the PNG's
               * hard rectangular black corners with a smooth fade-out
               */}
              <div style={{
                position: 'absolute', inset: 0,
                WebkitMaskImage: 'radial-gradient(circle 205px at 50% 50%, black 48%, rgba(0,0,0,0.85) 62%, rgba(0,0,0,0.35) 76%, transparent 92%)',
                maskImage: 'radial-gradient(circle 205px at 50% 50%, black 48%, rgba(0,0,0,0.85) 62%, rgba(0,0,0,0.35) 76%, transparent 92%)',
                zIndex: 2,
              }}>
                <img
                  src="/golden_monad_coin.png?v=3"
                  alt="Monad Coin"
                  style={{
                    width: '100%', height: '100%',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 0 55px rgba(255,145,0,0.65)) brightness(1.12) saturate(1.15)',
                    /* Coin rotates on its own vertical axis — like a coin spinning */
                    animation: 'coin-axis-spin 10s linear infinite',
                  }}
                />
              </div>

              {/*
               * 3D RING SCENE — perspective container so each ring
               * spins on a different real 3D axis
               */}
              <div style={{
                position: 'absolute', inset: '-20px',
                perspective: '700px',
                perspectiveOrigin: '50% 50%',
                zIndex: 3, pointerEvents: 'none',
              }}>

                {/* Ring A — tumbles on X axis (top/bottom go into screen) */}
                <div style={{
                  position: 'absolute', inset: '40px',
                  borderRadius: '50%',
                  border: '3px solid rgba(255,185,55,0.75)',
                  boxShadow: '0 0 14px rgba(255,155,30,0.5), 0 0 4px rgba(255,200,80,0.3)',
                  animation: 'ring-3d-x 9s linear infinite',
                  transformStyle: 'preserve-3d',
                }} />

                {/* Ring B — tilts on Y axis (left/right go into screen) */}
                <div style={{
                  position: 'absolute', inset: '65px',
                  borderRadius: '50%',
                  border: '2.5px solid rgba(255,215,90,0.6)',
                  boxShadow: '0 0 10px rgba(255,200,50,0.35)',
                  animation: 'ring-3d-y 13s linear infinite reverse',
                  transformStyle: 'preserve-3d',
                }} />

                {/* Ring C — flat spin on Z axis */}
                <div style={{
                  position: 'absolute', inset: '90px',
                  borderRadius: '50%',
                  border: '2px dashed rgba(255,145,30,0.55)',
                  boxShadow: '0 0 8px rgba(255,130,20,0.25)',
                  animation: 'ring-3d-z 6s linear infinite',
                  transformStyle: 'preserve-3d',
                }} />

                {/* Ring D — diagonal tumble (X+Y combined) */}
                <div style={{
                  position: 'absolute', inset: '20px',
                  borderRadius: '50%',
                  border: '1.5px solid rgba(255,230,120,0.3)',
                  animation: 'ring-3d-diag 18s linear infinite',
                  transformStyle: 'preserve-3d',
                }} />

              </div>

              {/* Pulse ripple rings */}
              <div style={{
                position: 'absolute', inset: '60px', borderRadius: '50%',
                border: '1.5px solid rgba(255,150,30,0.35)',
                animation: 'pulse-ring 3.2s ease-out infinite',
                zIndex: 4, pointerEvents: 'none',
              }} />
              <div style={{
                position: 'absolute', inset: '40px', borderRadius: '50%',
                border: '1px solid rgba(255,200,80,0.2)',
                animation: 'pulse-ring 3.2s ease-out infinite 1.6s',
                zIndex: 4, pointerEvents: 'none',
              }} />

            </div>
          </div>
        </div>


        {/* Divider */}
        <div style={{ height: '1px', background: 'rgba(78, 66, 56, 0.28)', marginBottom: '3.5rem' }} />

        {/* Feature cards row */}
        <div id="features" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', scrollMarginTop: '100px' }}>
          {featureCard(
            <IconShield size={16} color="#FF7B00" />,
            'Soulbound',
            'Your proof of work is permanently tied to your wallet. It can never be transferred, sold, or revoked. Once earned, it is yours forever on-chain.',
            'Non-transferable by design',
          )}
          {featureCard(
            <IconLink size={16} color="#FF7B00" />,
            'Verifiable',
            'Every attestation is stored on Monad and queryable by anyone, anywhere. No API key, no central server. Pure on-chain transparency.',
            'Query any wallet, anytime',
          )}
          {featureCard(
            <IconCode size={16} color="#FF7B00" />,
            'Open Source',
            'SoulPR\'s contracts, indexer, and webhook engine are open source. Anyone can audit, fork, or build on top. Community-owned infrastructure.',
            'Fully auditable contracts',
          )}
          {featureCard(
            <IconZap size={16} color="#FF7B00" />,
            'Built on Monad',
            'Monad\'s 10,000 TPS throughput means instant minting with sub-cent gas fees. Every PR becomes a zero-friction, permanent on-chain event.',
            '100% free for contributors',
          )}
        </div>

        {/* How It Works section */}
        <div id="how-it-works" style={{ marginTop: '5rem', padding: '3.5rem 2.5rem', background: 'var(--paper-raised)', border: '1px solid var(--rule)', borderRadius: '20px', textAlign: 'center', scrollMarginTop: '100px' }}>
          <div style={{ fontSize: '10px', fontWeight: 800, color: '#FF7B00', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '10px' }}>
            HOW IT WORKS & FAQ
          </div>
          <h2 style={{ fontSize: '32px', fontWeight: 900, color: 'var(--ink)', marginBottom: '1rem', fontFamily: 'var(--font-display)' }}>
            From Pull Request to <span style={{ color: '#FF7B00' }}>On-Chain Proof</span>
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--ink-muted)', maxWidth: '580px', margin: '0 auto 2.5rem', lineHeight: '1.7' }}>
            SoulPR monitors tracked GitHub repositories in real time. The moment a pull request is merged, an automated webhook triggers the minting of a non-transferable Soulbound Token directly to your linked wallet.
          </p>

          {/* FAQ list inside Landing page */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '780px', margin: '0 auto', textAlign: 'left' }}>
            {[
              { q: 'What is SoulPR?', a: 'SoulPR turns your real open-source contributions into soulbound attestations on Monad. These digital credentials are non-transferable, verifiable by anyone worldwide, and permanently bound to your Web3 identity.' },
              { q: 'How does automated minting work?', a: 'We listen to GitHub webhook events. When a pull request is merged in a registered repository, our backend verifies your commit metadata against your linked wallet and triggers a mint transaction on Monad.' },
              { q: 'What is a Soulbound Token (SBT)?', a: 'Soulbound Tokens (SBTs) are non-transferable digital credentials tied to a single address. Unlike regular NFTs, they cannot be bought, sold, or transferred to another wallet.' },
              { q: 'Do I need to pay gas fees?', a: 'No. Gas fees for minting on-chain SBTs are sponsored by our automated backend relayer wallet. Minting is completely free for open-source contributors.' },
              { q: 'Which GitHub repositories are supported?', a: 'SoulPR supports any public or private GitHub repository configured with the SoulPR integration webhook. Maintainers can register their repositories in seconds.' },
              { q: 'What happens if a pull request is closed without merging?', a: 'SBTs are only minted for merged contributions. Closed, unmerged, or draft pull requests do not generate any on-chain tokens.' },
              { q: 'How can recruiters or protocols verify my credentials?', a: 'Anyone can query your wallet address on the Monad blockchain explorer or via the SoulPR dashboard to independently verify your full history of verified contributions.' },
              { q: 'Can I change or update my linked wallet later?', a: 'Yes. You can manage your identity mappings through your GitHub authentication profile. Previously minted SBTs remain attached to the wallet address present at the time of minting.' },
            ].map(({ q, a }, idx) => (
              <details key={idx} style={{ background: 'rgba(255,123,0,0.02)', border: '1px solid var(--rule)', borderRadius: '12px', padding: '1.2rem 1.4rem', cursor: 'pointer' }}>
                <summary style={{ fontSize: '15px', fontWeight: 700, color: 'var(--ink)', outline: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{q}</span>
                  <span style={{ color: '#FF7B00', fontSize: '18px', fontWeight: 900 }}>+</span>
                </summary>
                <p style={{ fontSize: '13.5px', color: 'var(--ink-muted)', lineHeight: '1.7', marginTop: '1rem', marginBottom: 0 }}>
                  {a}
                </p>
              </details>
            ))}
          </div>
        </div>

        {/* About section */}
        <div id="about" style={{ marginTop: '4rem', padding: '4rem 2.5rem', background: 'var(--paper-raised)', border: '1px solid var(--rule)', borderRadius: '20px', textAlign: 'center', scrollMarginTop: '100px' }}>
          <div style={{ fontSize: '10px', fontWeight: 800, color: '#FF7B00', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '10px' }}>
            ABOUT SOULPR
          </div>
          <h2 style={{ fontSize: '32px', fontWeight: 900, color: 'var(--ink)', marginBottom: '1.2rem', fontFamily: 'var(--font-display)' }}>
            Built for Builders, Owned by You
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--ink-muted)', maxWidth: '700px', margin: '0 auto 3rem', lineHeight: '1.75' }}>
            SoulPR bridges open-source development and Web3 identity. By turning merged pull requests into non-transferable Soulbound Tokens (SBTs) on the Monad network, SoulPR ensures that your code contributions are permanently verifiable, tamper-proof, and forever attributed to your identity.
          </p>

          {/* About Pillars Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', textAlign: 'left' }}>
            <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--rule)', borderRadius: '14px' }}>
              <div style={{ color: '#FF7B00', fontWeight: 800, fontSize: '14px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                01. Trustless Reputation
              </div>
              <p style={{ fontSize: '13px', color: 'var(--ink-muted)', lineHeight: '1.65', margin: 0 }}>
                Traditional resumes rely on self-reported claims. SoulPR replaces resume padding with cryptographically proven code contributions that live permanently on-chain.
              </p>
            </div>
            <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--rule)', borderRadius: '14px' }}>
              <div style={{ color: '#FF7B00', fontWeight: 800, fontSize: '14px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                02. Automated Relaying
              </div>
              <p style={{ fontSize: '13px', color: 'var(--ink-muted)', lineHeight: '1.65', margin: 0 }}>
                Developers should focus on code, not transaction signing. Our backend automatically signs and mints tokens for merged work without disrupting your GitHub workflow.
              </p>
            </div>
            <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--rule)', borderRadius: '14px' }}>
              <div style={{ color: '#FF7B00', fontWeight: 800, fontSize: '14px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                03. Ecosystem Native
              </div>
              <p style={{ fontSize: '13px', color: 'var(--ink-muted)', lineHeight: '1.65', margin: 0 }}>
                Designed specifically for Monad high-throughput EVM execution. SoulPR enables DAOs, protocols, and grant funds to query developer credentials instantaneously.
              </p>
            </div>
          </div>
        </div>

      </main>

      <style>{`
        /* Scroll dot */
        @keyframes scrollDot {
          0%   { transform: translateY(0);    opacity: 1;   }
          80%  { transform: translateY(14px); opacity: 0.2; }
          100% { transform: translateY(0);    opacity: 1;   }
        }

        /* Whole scene idle float + slight tilt */
        @keyframes hero-float {
          0%   { transform: translateY(0px)   rotate(0deg);    }
          30%  { transform: translateY(-10px) rotate(0.4deg);  }
          70%  { transform: translateY(-6px)  rotate(-0.3deg); }
          100% { transform: translateY(0px)   rotate(0deg);    }
        }

        /* Coin spins on its own Y axis — coin-flip effect */
        @keyframes coin-axis-spin {
          0%   { transform: rotateY(0deg);   }
          100% { transform: rotateY(360deg); }
        }

        /* Ring A — tumbles top-to-bottom (X axis rotation) */
        @keyframes ring-3d-x {
          0%   { transform: rotateX(0deg);   }
          100% { transform: rotateX(360deg); }
        }

        /* Ring B — tilts left-to-right (Y axis rotation) */
        @keyframes ring-3d-y {
          0%   { transform: rotateY(0deg);   }
          100% { transform: rotateY(360deg); }
        }

        /* Ring C — flat spin (Z axis rotation) */
        @keyframes ring-3d-z {
          0%   { transform: rotateZ(0deg);   }
          100% { transform: rotateZ(360deg); }
        }

        /* Ring D — combined diagonal tumble */
        @keyframes ring-3d-diag {
          0%   { transform: rotateX(0deg)   rotateY(0deg);   }
          50%  { transform: rotateX(180deg) rotateY(90deg);  }
          100% { transform: rotateX(360deg) rotateY(180deg); }
        }

        /* Glow halo breathes in/out */
        @keyframes glow-breathe {
          0%   { opacity: 0.65; transform: scale(1);    }
          50%  { opacity: 1;    transform: scale(1.09); }
          100% { opacity: 0.65; transform: scale(1);    }
        }

        /* Expanding ripple rings */
        @keyframes pulse-ring {
          0%   { transform: scale(1);    opacity: 0.55; }
          65%  { transform: scale(1.22); opacity: 0.12; }
          100% { transform: scale(1.35); opacity: 0;    }
        }
      `}</style>

    </div>
  )
}
