import React, { useState, useRef } from 'react'
import { IconCheck, IconCopy } from '../Icons'

export interface HolographicCardData {
  credentialId: string
  contributor: string
  repository: string
  contributionTitle: string
  mergeDate: string
  network: string
  txHash?: string
  evidenceDigest?: string
  isSample?: boolean
}

const DEFAULT_CARD_DATA: HolographicCardData = {
  credentialId: 'SIG-2025-0426-001',
  contributor: 'm0izz.testnet',
  repository: 'm0izz/signet',
  contributionTitle: 'Add evidence dossier support',
  mergeDate: 'Apr 26, 2025 · 14:32 UTC',
  network: 'NEAR Blockchain',
  txHash: '9k8xY2nF82BqWz7P1oM6rT5uV4eL3aK2jH1gD9sC',
  evidenceDigest: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
  isSample: true,
}

interface HolographicCredential3DProps {
  data?: HolographicCardData
  autoRotate?: boolean
  showPedestal?: boolean
  className?: string
  style?: React.CSSProperties
}

export const HolographicCredential3D: React.FC<HolographicCredential3DProps> = ({
  data = DEFAULT_CARD_DATA,
  autoRotate = true,
  showPedestal = true,
  className,
  style,
}) => {
  const [copied, setCopied] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleCopy = (e: React.MouseEvent, text: string) => {
    e.stopPropagation()
    navigator.clipboard?.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: showPedestal ? '2rem 1rem 3.5rem' : '1rem 0',
        userSelect: 'none',
        ...style,
      }}
    >
      {/* ── 3D SCENE PERSPECTIVE CONTAINER (STRICT HORIZONTAL / LANDSCAPE) ── */}
      <div
        style={{
          perspective: '1300px',
          width: '540px',
          maxWidth: '100%',
          height: '340px',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2,
        }}
      >
        {/* ROTATING 3D CARD ANCHOR */}
        <div
          ref={cardRef}
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            transformStyle: 'preserve-3d',
            animation: autoRotate
              ? 'signetHoloSpin 14s linear infinite'
              : undefined,
          }}
        >
          {/* ========================================================
              CARD FRONT: HOLOGRAPHIC CONTRIBUTION CREDENTIAL
              ======================================================== */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              borderRadius: '20px',
              background:
                'linear-gradient(135deg, rgba(14, 23, 42, 0.88) 0%, rgba(8, 14, 26, 0.94) 60%, rgba(4, 8, 16, 0.96) 100%)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1.5px solid rgba(56, 189, 248, 0.55)',
              boxShadow:
                '0 25px 60px -10px rgba(0, 0, 0, 0.8), 0 0 35px rgba(56, 189, 248, 0.35), inset 0 0 25px rgba(56, 189, 248, 0.15)',
              padding: '1.8rem 2.2rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              overflow: 'hidden',
              boxSizing: 'border-box',
            }}
          >
            {/* Holographic Refractive Sheen Overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(115deg, transparent 20%, rgba(56, 189, 248, 0.12) 40%, rgba(245, 158, 11, 0.14) 55%, transparent 70%)',
                backgroundSize: '200% 200%',
                pointerEvents: 'none',
                animation: 'signetHoloSheen 6s ease-in-out infinite alternate',
              }}
            />

            {/* Circuit Traces Vector Background */}
            <svg
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                opacity: 0.28,
                pointerEvents: 'none',
              }}
              viewBox="0 0 540 340"
              fill="none"
            >
              <path
                d="M 20 60 L 80 60 L 110 90 L 220 90"
                stroke="#38BDF8"
                strokeWidth="1.2"
                strokeDasharray="4 4"
              />
              <path
                d="M 520 120 L 460 120 L 430 90 L 360 90"
                stroke="#38BDF8"
                strokeWidth="1.2"
              />
              <path
                d="M 30 280 L 100 280 L 140 240 L 280 240"
                stroke="#F59E0B"
                strokeWidth="1.2"
                strokeDasharray="3 3"
              />
              <circle cx="220" cy="90" r="3" fill="#38BDF8" />
              <circle cx="360" cy="90" r="3" fill="#38BDF8" />
              <circle cx="280" cy="240" r="3" fill="#F59E0B" />
              {/* Corner tech brackets */}
              <path d="M 12 35 L 12 12 L 35 12" stroke="#38BDF8" strokeWidth="2.5" />
              <path d="M 528 35 L 528 12 L 505 12" stroke="#F59E0B" strokeWidth="2.5" />
              <path d="M 12 305 L 12 328 L 35 328" stroke="#38BDF8" strokeWidth="2.5" />
              <path d="M 528 305 L 528 328 L 505 328" stroke="#F59E0B" strokeWidth="2.5" />
            </svg>

            {/* GOLD RIBBON & EMBOSSED MEDAL (TOP-LEFT SECTION) */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '38px',
                width: '96px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                zIndex: 3,
                pointerEvents: 'none',
              }}
            >
              {/* Ribbon Header */}
              <div
                style={{
                  width: '38px',
                  height: '56px',
                  background:
                    'linear-gradient(180deg, #091220 0%, #020617 100%)',
                  borderLeft: '2px solid #F59E0B',
                  borderRight: '2px solid #F59E0B',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.7)',
                }}
              />

              {/* Gold Medallion Medal */}
              <div
                style={{
                  position: 'relative',
                  width: '94px',
                  height: '94px',
                  marginTop: '-16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  filter:
                    'drop-shadow(0 8px 20px rgba(245, 158, 11, 0.55)) drop-shadow(0 2px 8px rgba(0,0,0,0.85))',
                }}
              >
                <svg width="94" height="94" viewBox="0 0 100 100">
                  <defs>
                    <radialGradient id="goldGradient" cx="35%" cy="30%" r="70%">
                      <stop offset="0%" stopColor="#FFF7D6" />
                      <stop offset="35%" stopColor="#FBBF24" />
                      <stop offset="70%" stopColor="#D97706" />
                      <stop offset="100%" stopColor="#78350F" />
                    </radialGradient>
                    <radialGradient id="innerRim" cx="50%" cy="50%" r="50%">
                      <stop offset="75%" stopColor="#92400E" />
                      <stop offset="100%" stopColor="#FDE68A" />
                    </radialGradient>
                    <filter id="medalEmboss">
                      <feDropShadow dx="1" dy="2" stdDeviation="1" floodColor="#000" floodOpacity="0.6" />
                    </filter>
                  </defs>

                  {/* Scalloped Starburst Cog Rim */}
                  <g fill="url(#goldGradient)">
                    {[...Array(24)].map((_, i) => (
                      <rect
                        key={i}
                        x="46"
                        y="2"
                        width="8"
                        height="96"
                        rx="4"
                        transform={`rotate(${i * 7.5} 50 50)`}
                      />
                    ))}
                    <circle cx="50" cy="50" r="42" />
                  </g>

                  {/* Inner Concentric Rings */}
                  <circle cx="50" cy="50" r="37" fill="none" stroke="#FEF3C7" strokeWidth="1.2" />
                  <circle cx="50" cy="50" r="34" fill="url(#innerRim)" />

                  {/* Laurel Wreath Border Ring */}
                  <circle cx="50" cy="50" r="30" fill="none" stroke="#FDE68A" strokeWidth="1.5" strokeDasharray="3 2" />

                  {/* Embossed Center Signet Mark */}
                  <g filter="url(#medalEmboss)">
                    <path
                      d="M 50 28 L 62 35 L 62 47 L 50 54 L 38 47 L 38 35 Z"
                      fill="none"
                      stroke="#FFF7D6"
                      strokeWidth="2.4"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M 44 38 L 56 38 L 50 42 L 56 46 L 44 46"
                      stroke="#FFF7D6"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <text
                      x="50"
                      y="66"
                      textAnchor="middle"
                      fill="#FFF7D6"
                      fontSize="7.5"
                      fontFamily="'Inter', sans-serif"
                      fontWeight="900"
                      letterSpacing="1.2"
                    >
                      SIGNET
                    </text>
                  </g>
                </svg>

                {/* Ribbon Tails */}
                <div
                  style={{
                    position: 'absolute',
                    top: '86px',
                    width: '36px',
                    height: '48px',
                    background:
                      'linear-gradient(180deg, #091220 0%, #020617 100%)',
                    borderLeft: '2px solid #F59E0B',
                    borderRight: '2px solid #F59E0B',
                    clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 70%, 0 100%)',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.6)',
                  }}
                />
              </div>
            </div>

            {/* ── CARD HEADER (BRAND & TITLE) ── */}
            <div style={{ marginLeft: '135px', textAlign: 'left' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '4px',
                }}
              >
                {/* Brand Hex Mark */}
                <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
                  <path
                    d="M16 2L28 9V23L16 30L4 23V9L16 2Z"
                    stroke="#F59E0B"
                    strokeWidth="3"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M11 12H21L13 18H21"
                    stroke="#F59E0B"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    letterSpacing: '0.18em',
                    color: '#EDE2D0',
                    textTransform: 'uppercase',
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  SIGNET
                </span>
              </div>

              <h2
                style={{
                  fontSize: '24px',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  fontFamily: 'var(--font-serif)',
                  letterSpacing: '-0.01em',
                  margin: 0,
                  textShadow: '0 2px 10px rgba(0, 0, 0, 0.6)',
                }}
              >
                Contribution Credential
              </h2>
              <div
                style={{
                  fontSize: '12.5px',
                  fontWeight: 600,
                  color: '#F59E0B',
                  letterSpacing: '0.02em',
                  marginTop: '2px',
                }}
              >
                Verified Open Source Contribution
              </div>
            </div>

            {/* ── CARD BODY (METADATA TABLE & QR CODE) ── */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginLeft: '135px',
                marginTop: '10px',
                gap: '12px',
              }}
            >
              {/* Metadata Fields */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6.5px',
                  fontSize: '11.5px',
                  flex: 1,
                }}
              >
                {/* Developer */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#94A3B8', width: '84px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    Developer
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span
                      className="signet-mono"
                      style={{ color: '#F1F5F9', fontWeight: 600 }}
                    >
                      {data.contributor}
                    </span>
                    <button
                      onClick={(e) => handleCopy(e, data.contributor)}
                      title="Copy contributor ID"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: copied ? '#2A7D4F' : '#64748B',
                        padding: '1px',
                        cursor: 'pointer',
                        display: 'flex',
                      }}
                    >
                      <IconCopy size={11} />
                    </button>
                  </div>
                </div>

                {/* Repository */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#94A3B8', width: '84px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2">
                      <circle cx="18" cy="18" r="3" />
                      <circle cx="6" cy="6" r="3" />
                      <path d="M6 9v12" />
                      <path d="M18 9a9 9 0 0 0-9 9" />
                    </svg>
                    Repository
                  </span>
                  <span
                    className="signet-mono"
                    style={{ color: '#F1F5F9', fontWeight: 600 }}
                  >
                    {data.repository}
                  </span>
                </div>

                {/* Contribution */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#94A3B8', width: '84px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <polyline points="9 15 11 17 15 13" />
                    </svg>
                    Contribution
                  </span>
                  <span
                    style={{
                      color: '#F1F5F9',
                      fontWeight: 500,
                      maxWidth: '160px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {data.contributionTitle}
                  </span>
                </div>

                {/* Merged */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#94A3B8', width: '84px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    Merged
                  </span>
                  <span className="signet-mono" style={{ color: '#94A3B8' }}>
                    {data.mergeDate}
                  </span>
                </div>
              </div>

              {/* QR Code Container */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  background: 'rgba(15, 23, 42, 0.7)',
                  border: '1px solid rgba(56, 189, 248, 0.35)',
                  borderRadius: '10px',
                  padding: '6px 8px 4px',
                  boxShadow: '0 0 16px rgba(56, 189, 248, 0.15)',
                }}
              >
                {/* SVG QR Code */}
                <svg width="52" height="52" viewBox="0 0 29 29" fill="#F8FAFC">
                  <path d="M0 0h7v7H0zM2 2h3v3H2zM9 0h2v1H9zM12 0h1v2h-1zM14 0h1v1h-1zM16 0h1v1h-1zM18 0h1v2h-1zM22 0h7v7h-7zM24 2h3v3h-3zM9 2h1v1H9zM11 2h1v1h-1zM14 2h2v1h-2zM17 2h1v1h-1zM9 4h2v1H9zM12 4h1v1h-1zM15 4h1v2h-1zM18 4h1v1h-1zM19 4h1v2h-1zM0 9h1v1H0zM2 9h2v1H2zM5 9h1v2H5zM8 9h1v1H8zM10 9h1v1h-1zM12 9h2v1h-2zM16 9h1v1h-1zM18 9h1v2h-1zM20 9h2v1h-2zM23 9h1v1h-1zM25 9h1v2h-1zM27 9h2v1h-2zM1 10h1v1H1zM3 10h1v1H3zM7 10h1v1H7zM9 10h1v1H9zM11 10h1v2h-1zM14 10h1v1h-1zM17 10h1v1h-1zM22 10h1v1h-2zM24 10h1v1h-1zM26 10h1v1h-1zM28 10h1v2h-1zM0 12h2v1H0zM3 12h1v1H3zM6 12h1v1H6zM8 12h2v1H8zM12 12h1v1h-1zM14 12h1v1h-1zM16 12h1v1h-1zM20 12h2v1h-2zM23 12h1v1h-1zM27 12h1v1h-1zM0 14h1v1H0zM4 14h1v1H4zM6 14h2v1H6zM10 14h1v2h-1zM13 14h1v1h-1zM15 14h2v1h-2zM19 14h2v1h-2zM22 14h1v1h-1zM25 14h1v1h-1zM28 14h1v1h-1zM0 22h7v7H0zM2 24h3v3H2zM9 22h1v1H9zM12 22h1v1h-1zM14 22h1v2h-1zM18 22h1v1h-1zM20 22h2v1h-2zM23 22h1v1h-1zM25 22h1v2h-1zM27 22h1v1h-1zM9 24h1v1H9zM11 24h2v1h-2zM15 24h1v1h-1zM17 24h2v1h-2zM20 24h1v1h-1zM22 24h2v1h-2zM26 24h2v1h-2zM9 26h2v1H9zM13 26h1v1h-1zM16 26h1v2h-1zM18 26h1v1h-1zM21 26h1v1h-1zM24 26h1v1h-1zM27 26h2v1h-2z" />
                </svg>
                <span
                  style={{
                    fontSize: '9px',
                    fontWeight: 800,
                    color: '#38BDF8',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    marginTop: '2px',
                  }}
                >
                  Verify
                </span>
              </div>
            </div>

            {/* ── CARD FOOTER (VERIFIED BADGE & ISSUED FOOTER) ── */}
            <div style={{ marginLeft: '135px' }}>
              {/* Cyan Verified Pill Badge */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background:
                    'linear-gradient(90deg, rgba(56, 189, 248, 0.16) 0%, rgba(14, 165, 233, 0.08) 100%)',
                  border: '1px solid #38BDF8',
                  borderRadius: '99px',
                  padding: '5px 14px',
                  boxShadow: '0 0 16px rgba(56, 189, 248, 0.3)',
                  marginBottom: '10px',
                }}
              >
                <span
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: '#38BDF8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <IconCheck size={11} color="#0F172A" strokeWidth={3} />
                </span>
                <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                  <div
                    style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      color: '#F0F9FF',
                      letterSpacing: '0.02em',
                    }}
                  >
                    Cryptographically Verified
                  </div>
                  <div
                    style={{
                      fontSize: '9.5px',
                      fontWeight: 600,
                      color: '#38BDF8',
                    }}
                  >
                    On {data.network}
                  </div>
                </div>
              </div>

              {/* Sub-Footer Line */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '9.5px',
                  color: '#64748B',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  paddingTop: '6px',
                }}
              >
                <span>
                  Issued by <strong style={{ color: '#F8FAFC' }}>SIGNET</strong>
                </span>
                <span className="signet-mono" style={{ color: '#94A3B8' }}>
                  Credential ID: {data.credentialId}
                </span>
              </div>
            </div>
          </div>

          {/* ========================================================
              CARD BACK: TECHNICAL CRYPTOGRAPHIC MANIFEST & ATTESTATION
              ======================================================== */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              borderRadius: '20px',
              background:
                'linear-gradient(135deg, rgba(8, 14, 26, 0.94) 0%, rgba(14, 23, 42, 0.92) 50%, rgba(4, 8, 16, 0.98) 100%)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1.5px solid rgba(245, 158, 11, 0.55)',
              boxShadow:
                '0 25px 60px -10px rgba(0, 0, 0, 0.8), 0 0 35px rgba(245, 158, 11, 0.3), inset 0 0 25px rgba(245, 158, 11, 0.12)',
              padding: '1.8rem 2.2rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              overflow: 'hidden',
              boxSizing: 'border-box',
              textAlign: 'left',
            }}
          >
            {/* Holographic Refractive Sheen Overlay (Amber/Cyan Reverse) */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(115deg, transparent 20%, rgba(245, 158, 11, 0.12) 40%, rgba(56, 189, 248, 0.14) 55%, transparent 70%)',
                backgroundSize: '200% 200%',
                pointerEvents: 'none',
                animation: 'signetHoloSheen 6s ease-in-out infinite alternate',
              }}
            />

            {/* Top Security Header */}
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid rgba(245, 158, 11, 0.25)',
                  paddingBottom: '8px',
                  marginBottom: '14px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#F59E0B',
                      boxShadow: '0 0 8px #F59E0B',
                    }}
                  />
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      color: '#F59E0B',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                    }}
                  >
                    PROTOCOL PROVENANCE MANIFEST
                  </span>
                </div>
                <span
                  className="signet-mono"
                  style={{
                    fontSize: '10px',
                    color: '#94A3B8',
                    background: 'rgba(255, 255, 255, 0.06)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                  }}
                >
                  SEC-LEVEL 4
                </span>
              </div>

              {/* Technical Specifications Grid */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '9px',
                  fontSize: '11.5px',
                }}
              >
                {/* Canonical SHA-256 Digest */}
                <div>
                  <span style={{ fontSize: '10px', color: '#94A3B8', display: 'block' }}>
                    CANONICAL EVIDENCE SHA-256 DIGEST:
                  </span>
                  <div
                    className="signet-mono"
                    style={{
                      color: '#38BDF8',
                      fontSize: '10px',
                      wordBreak: 'break-all',
                      background: 'rgba(56, 189, 248, 0.08)',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      border: '1px solid rgba(56, 189, 248, 0.2)',
                    }}
                  >
                    {data.evidenceDigest}
                  </div>
                </div>

                {/* Contract & TX details */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <span style={{ fontSize: '10px', color: '#94A3B8', display: 'block' }}>
                      SMART CONTRACT:
                    </span>
                    <span className="signet-mono" style={{ color: '#F1F5F9', fontSize: '11px', fontWeight: 600 }}>
                      signet.testnet
                    </span>
                  </div>
                  <div>
                    <span style={{ fontSize: '10px', color: '#94A3B8', display: 'block' }}>
                      ON-CHAIN FINALITY:
                    </span>
                    <span className="signet-mono" style={{ color: '#2A7D4F', fontSize: '11px', fontWeight: 700 }}>
                      100% Finalized (Final)
                    </span>
                  </div>
                </div>

                {/* Schema & Non-transferable claim */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <span style={{ fontSize: '10px', color: '#94A3B8', display: 'block' }}>
                      SCHEMA SPEC:
                    </span>
                    <span className="signet-mono" style={{ color: '#F1F5F9', fontSize: '11px' }}>
                      signet.evidence.v1.0
                    </span>
                  </div>
                  <div>
                    <span style={{ fontSize: '10px', color: '#94A3B8', display: 'block' }}>
                      TOKEN TYPE:
                    </span>
                    <span className="signet-mono" style={{ color: '#F59E0B', fontSize: '11px', fontWeight: 600 }}>
                      Soulbound Attestation
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Security Footer */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                paddingTop: '8px',
                fontSize: '10px',
                color: '#64748B',
              }}
            >
              <span>Non-transferable · Cryptographically Bound</span>
              <span style={{ color: '#F59E0B', fontWeight: 700 }}>
                NEAR PROTOCOL TESTNET
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── HOLOGRAPHIC LIGHT PODIUM / PEDESTAL (BELOW CARD) ── */}
      {showPedestal && (
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '500px',
            height: '80px',
            marginTop: '-35px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        >
          {/* Vertical light projector cone */}
          <div
            style={{
              position: 'absolute',
              bottom: '30px',
              width: '360px',
              height: '180px',
              background:
                'radial-gradient(ellipse at 50% 100%, rgba(56, 189, 248, 0.28) 0%, rgba(245, 158, 11, 0.12) 40%, transparent 75%)',
              filter: 'blur(14px)',
            }}
          />

          {/* Outer Glowing Cyan Ring */}
          <div
            style={{
              position: 'absolute',
              width: '420px',
              height: '54px',
              borderRadius: '50%',
              border: '2px solid rgba(56, 189, 248, 0.55)',
              boxShadow:
                '0 0 24px rgba(56, 189, 248, 0.6), inset 0 0 16px rgba(56, 189, 248, 0.3)',
              transform: 'rotateX(75deg)',
            }}
          />

          {/* Inner Glowing Gold Ring */}
          <div
            style={{
              position: 'absolute',
              width: '300px',
              height: '42px',
              borderRadius: '50%',
              border: '2px solid rgba(245, 158, 11, 0.75)',
              boxShadow:
                '0 0 20px rgba(245, 158, 11, 0.7), inset 0 0 14px rgba(245, 158, 11, 0.4)',
              transform: 'rotateX(75deg)',
            }}
          />

          {/* Core Spotlight Disc */}
          <div
            style={{
              position: 'absolute',
              width: '180px',
              height: '26px',
              borderRadius: '50%',
              background:
                'radial-gradient(circle, #F8FAFC 0%, #38BDF8 50%, #F59E0B 85%, transparent 100%)',
              filter: 'blur(4px)',
              boxShadow: '0 0 35px #38BDF8',
              transform: 'rotateX(75deg)',
            }}
          />
        </div>
      )}
    </div>
  )
}

export default HolographicCredential3D
