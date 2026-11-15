import React from 'react'
import { useNavigate } from 'react-router-dom'
import CinematicRingScene from './CinematicRingScene'

export const SignetHero: React.FC = () => {
  const navigate = useNavigate()

  return (
    <section
      style={{
        position: 'relative',
        minHeight: '88vh',
        backgroundColor: '#0A0908',
        color: '#EDE2D0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '7.5rem 2rem 5rem',
        overflow: 'hidden',
      }}
      aria-labelledby="hero-headline"
    >
      {/* ── Fluid Ambient Aurora Illumination (Enhanced Palette) ── */}
      <div
        className="signet-glow-pulse"
        style={{
          position: 'absolute',
          top: '15%',
          left: '48%',
          transform: 'translateX(-50%)',
          width: '780px',
          height: '520px',
          background:
            'radial-gradient(circle, rgba(224, 109, 56, 0.18) 0%, rgba(245, 158, 11, 0.08) 40%, rgba(56, 189, 248, 0.05) 65%, transparent 75%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
        aria-hidden="true"
      />

      {/* Subtle Grid Overlay Texture */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(rgba(237, 226, 208, 0.04) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          pointerEvents: 'none',
          opacity: 0.6,
          zIndex: 0,
        }}
        aria-hidden="true"
      />

      <div
        style={{
          maxWidth: '1260px',
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
        {/* ── Left Column: Editorial Brand Headline & CTAs ── */}
        <div style={{ textAlign: 'left' }}>
          {/* Top glowing status pill */}
          <div style={{ marginBottom: '1.4rem' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '11px',
                fontWeight: 700,
                color: '#E06D38',
                backgroundColor: 'rgba(224, 109, 56, 0.09)',
                border: '1px solid rgba(224, 109, 56, 0.3)',
                padding: '6px 14px',
                borderRadius: '99px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                boxShadow: '0 0 16px rgba(224, 109, 56, 0.15)',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#E06D38',
                  boxShadow: '0 0 8px #E06D38',
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
              color: '#FBF8F3',
              marginBottom: '1.2rem',
              fontWeight: 500,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
            }}
          >
            Your work is your mark.
          </h1>

          {/* Supporting Statement in Amber */}
          <p
            style={{
              fontSize: 'clamp(19px, 2.2vw, 24px)',
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              color: '#F59E0B',
              marginBottom: '1.8rem',
              lineHeight: 1.3,
              textShadow: '0 0 20px rgba(245, 158, 11, 0.25)',
            }}
          >
            Your contribution, made permanent.
          </p>

          <p
            style={{
              fontSize: '16px',
              color: 'var(--signet-muted)',
              lineHeight: 1.75,
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
              marginBottom: '3rem',
            }}
          >
            <button
              onClick={() => navigate('/auth')}
              style={{
                backgroundColor: 'var(--signet-orange)',
                color: '#EDE2D0',
                fontWeight: 700,
                fontSize: '15px',
                padding: '13px 28px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 122, 61, 0.7)',
                cursor: 'pointer',
                letterSpacing: '0.02em',
                boxShadow:
                  '0 8px 24px rgba(185, 87, 43, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow =
                  '0 12px 32px rgba(185, 87, 43, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow =
                  '0 8px 24px rgba(185, 87, 43, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
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
                padding: '12px 24px',
                borderRadius: '8px',
                border: '1px solid rgba(237, 226, 208, 0.2)',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                backdropFilter: 'blur(8px)',
                textDecoration: 'none',
                transition: 'background-color 0.2s, border-color 0.2s, transform 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'
                e.currentTarget.style.borderColor = 'rgba(237, 226, 208, 0.4)'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)'
                e.currentTarget.style.borderColor = 'rgba(237, 226, 208, 0.2)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              Explore the protocol
            </a>
          </div>

          {/* Protocol Pillars Micro-Pills */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              fontSize: '11.5px',
              color: 'var(--signet-muted)',
              borderTop: '1px solid rgba(237, 226, 208, 0.08)',
              paddingTop: '1.2rem',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#38BDF8' }} />
              <span>NEAR Blockchain Attestation</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
              <span>Git-Native Evidence</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#2A7D4F' }} />
              <span>Soulbound Non-Transferable</span>
            </div>
          </div>
        </div>

        {/* ── Right Column: Enhanced Architectural Signet Ring & Stamping Sequence ── */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <CinematicRingScene />
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .signet-hero-grid {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
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
