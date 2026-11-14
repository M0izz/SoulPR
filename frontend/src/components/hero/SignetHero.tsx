import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import CinematicRingScene from './CinematicRingScene'
import StaticHeroFallback from './StaticHeroFallback'

export const SignetHero: React.FC = () => {
  const navigate = useNavigate()
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return (
    <section
      style={{
        position: 'relative',
        minHeight: '94vh',
        backgroundColor: '#10100F',
        color: '#EDE2D0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '7rem 2rem 4rem',
        overflow: 'hidden',
      }}
      aria-labelledby="hero-headline"
    >
      {/* Ambient background illumination */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '700px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(185, 87, 43, 0.12) 0%, rgba(25, 23, 21, 0.4) 50%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
        aria-hidden="true"
      />

      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          width: '100%',
          position: 'relative',
          zIndex: 1,
          display: 'grid',
          gridTemplateColumns: '1.05fr 0.95fr',
          gap: '3.5rem',
          alignItems: 'center',
        }}
        className="signet-hero-grid"
      >
        {/* Left Column: Editorial Brand Headline & CTAs */}
        <div style={{ textAlign: 'left' }}>
          {/* Top subtle badge */}
          <div style={{ marginBottom: '1.4rem' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '11px',
                fontWeight: 700,
                color: '#B9572B',
                backgroundColor: 'rgba(185, 87, 43, 0.08)',
                border: '1px solid rgba(185, 87, 43, 0.25)',
                padding: '6px 14px',
                borderRadius: '99px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#B9572B',
                  display: 'inline-block',
                }}
              />
              Contribution Credential Protocol
            </span>
          </div>

          {/* Master Headline */}
          <h1
            id="hero-headline"
            className="signet-headline"
            style={{
              fontSize: 'clamp(44px, 5.5vw, 68px)',
              color: '#EDE2D0',
              marginBottom: '1.2rem',
              fontWeight: 500,
            }}
          >
            Your work is your mark.
          </h1>

          {/* Supporting Statement */}
          <p
            style={{
              fontSize: 'clamp(18px, 2vw, 22px)',
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              color: '#B9572B',
              marginBottom: '1.8rem',
              lineHeight: 1.3,
            }}
          >
            Your contribution, made permanent.
          </p>

          <p
            style={{
              fontSize: '15.5px',
              color: 'var(--signet-muted)',
              lineHeight: 1.7,
              maxWidth: '520px',
              marginBottom: '2.5rem',
            }}
          >
            SIGNET connects a developer, a verified contribution, and inspectable evidence
            into a durable cryptographic credential. Designed for open-source builders who care about truth.
          </p>

          {/* Action Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              flexWrap: 'wrap',
            }}
          >
            <button
              onClick={() => navigate('/auth')}
              style={{
                backgroundColor: 'var(--signet-orange)',
                color: '#EDE2D0',
                fontWeight: 700,
                fontSize: '15px',
                padding: '13px 26px',
                borderRadius: '8px',
                border: '1px solid rgba(185, 87, 43, 0.65)',
                cursor: 'pointer',
                letterSpacing: '0.02em',
                boxShadow: '0 6px 20px rgba(185, 87, 43, 0.32)',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)'
                e.currentTarget.style.boxShadow = '0 10px 28px rgba(185, 87, 43, 0.45)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(185, 87, 43, 0.32)'
              }}
            >
              Create your SIGNET
            </button>

            <a
              href="#protocol"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('protocol')?.scrollIntoView({ behavior: 'smooth' })
              }}
              style={{
                color: '#EDE2D0',
                fontWeight: 600,
                fontSize: '14px',
                padding: '12px 22px',
                borderRadius: '8px',
                border: '1px solid rgba(237, 226, 208, 0.18)',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                textDecoration: 'none',
                transition: 'background-color 0.2s, border-color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'
                e.currentTarget.style.borderColor = 'rgba(237, 226, 208, 0.35)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)'
                e.currentTarget.style.borderColor = 'rgba(237, 226, 208, 0.18)'
              }}
            >
              Explore the protocol
            </a>
          </div>
        </div>

        {/* Right Column: Architectural Ring Scene */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {reducedMotion ? <StaticHeroFallback /> : <CinematicRingScene />}
        </div>
      </div>

      {/* Subtle Bottom Scroll Cue */}
      <div
        style={{
          marginTop: '3.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          opacity: 0.55,
          userSelect: 'none',
        }}
        aria-hidden="true"
      >
        <span
          style={{
            fontSize: '9px',
            textTransform: 'uppercase',
            letterSpacing: '0.16em',
            fontFamily: 'var(--font-sans)',
            fontWeight: 700,
          }}
        >
          Scroll to explore
        </span>
        <div
          style={{
            width: '20px',
            height: '32px',
            border: '1.5px solid rgba(237, 226, 208, 0.25)',
            borderRadius: '99px',
            display: 'flex',
            justifyContent: 'center',
            paddingTop: '5px',
          }}
        >
          <div
            style={{
              width: '3px',
              height: '6px',
              backgroundColor: '#B9572B',
              borderRadius: '99px',
              animation: 'scroll-cue-pulse 2s ease-in-out infinite',
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes scroll-cue-pulse {
          0% { transform: translateY(0); opacity: 1; }
          70% { transform: translateY(10px); opacity: 0.15; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @media (max-width: 900px) {
          .signet-hero-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
            text-align: center !important;
          }
          .signet-hero-grid > div:first-child {
            text-align: center !important;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
    </section>
  )
}

export default SignetHero
