import React, { useState, useEffect } from 'react'
import SignetInsignia from '../brand/SignetInsignia'

interface CinematicRingSceneProps {
  onAnimationComplete?: () => void
}

/**
 * Enhanced SIGNET Cinematic Architectural Ring & Seal Sequence
 * Elevates the physical ring-stamping metaphor to match the luxury cryptographic protocol:
 * 1. Heavy chamfered titanium & gold-inlay signet ring descends in 3D perspective.
 * 2. Specular metallic reflection sweeps across the beveled facets.
 * 3. Presses firmly into the cryptographic intaglio vault dais with mechanical precision.
 * 4. Stamping creates an illuminated golden seal impression with radiant shockwaves and particle aura.
 * 5. Remains alive with continuous gentle levitation and breathing ambient light.
 */
export const CinematicRingScene: React.FC<CinematicRingSceneProps> = ({ onAnimationComplete }) => {
  const [stage, setStage] = useState<'enter' | 'sweep' | 'descend' | 'stamp' | 'settled'>('enter')
  const [replayKey, setReplayKey] = useState(0)

  useEffect(() => {
    setStage('enter')
    const t1 = setTimeout(() => setStage('sweep'), 700)
    const t2 = setTimeout(() => setStage('descend'), 1600)
    const t3 = setTimeout(() => setStage('stamp'), 2400)
    const t4 = setTimeout(() => {
      setStage('settled')
      if (onAnimationComplete) onAnimationComplete()
    }, 3200)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
    }
  }, [replayKey, onAnimationComplete])

  const isStamped = stage === 'stamp' || stage === 'settled'

  return (
    <div
      key={replayKey}
      onClick={() => setReplayKey((k) => k + 1)}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '520px',
        height: '460px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        perspective: '1300px',
        userSelect: 'none',
        cursor: 'pointer',
      }}
      role="region"
      aria-label="SIGNET Architectural Signet Ring & Cryptographic Stamping Dais (Click to restamp)"
      title="Click to replay the cryptographic stamping sequence"
    >
      {/* ── Ambient Radial Halo Behind Dais ── */}
      <div
        style={{
          position: 'absolute',
          bottom: '50px',
          width: '380px',
          height: '240px',
          borderRadius: '50%',
          background: isStamped
            ? 'radial-gradient(ellipse at center, rgba(224, 109, 56, 0.28) 0%, rgba(245, 158, 11, 0.12) 45%, transparent 75%)'
            : 'radial-gradient(ellipse at center, rgba(224, 109, 56, 0.12) 0%, transparent 70%)',
          filter: 'blur(35px)',
          transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ── THE CRYPTOGRAPHIC INTAGLIO DAIS (VAULT PLATFORM) ── */}
      <div
        style={{
          position: 'absolute',
          bottom: '30px',
          width: '360px',
          height: '240px',
          borderRadius: '50%',
          transform: 'rotateX(64deg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1,
        }}
      >
        {/* Outer Heavy Beveled Bronze Rim */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: 'linear-gradient(145deg, #2D2520 0%, #151311 50%, #2A221E 100%)',
            border: '2px solid rgba(245, 158, 11, 0.35)',
            boxShadow: isStamped
              ? '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(224, 109, 56, 0.35), inset 0 2px 16px rgba(245, 158, 11, 0.2)'
              : '0 20px 50px rgba(0, 0, 0, 0.7), inset 0 2px 10px rgba(255, 255, 255, 0.05)',
            transition: 'box-shadow 0.5s ease',
          }}
        />

        {/* Concentric Cryptographic Rune Ring */}
        <div
          style={{
            position: 'absolute',
            width: '280px',
            height: '280px',
            borderRadius: '50%',
            border: '1.5px dashed rgba(245, 158, 11, 0.4)',
            boxShadow: isStamped ? '0 0 20px rgba(245, 158, 11, 0.35)' : 'none',
            animation: 'dais-rotate-slow 40s linear infinite',
            pointerEvents: 'none',
          }}
        />

        {/* Inner Laser Track Ring */}
        <div
          style={{
            position: 'absolute',
            width: '220px',
            height: '220px',
            borderRadius: '50%',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            boxShadow: isStamped ? '0 0 15px rgba(56, 189, 248, 0.3)' : 'none',
          }}
        />

        {/* Core Seal Bed (Intaglio Wax & Metal Reservoir) */}
        <div
          style={{
            position: 'relative',
            width: '160px',
            height: '160px',
            borderRadius: '50%',
            backgroundColor: '#0E0C0B',
            border: '2px solid rgba(224, 109, 56, 0.5)',
            boxShadow: 'inset 0 4px 18px rgba(0, 0, 0, 0.95), 0 0 25px rgba(224, 109, 56, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Subtle gold leaf flecks */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(circle at 35% 35%, rgba(245, 158, 11, 0.15) 0%, transparent 60%)',
            }}
          />

          {/* Embossed Wax Seal Impression appearing on stamping */}
          <div
            style={{
              position: 'relative',
              width: '92px',
              height: '92px',
              borderRadius: '50%',
              background:
                'radial-gradient(circle, #E06D38 0%, #B9572B 60%, #7C2D12 100%)',
              border: '2px solid #FDE68A',
              boxShadow: isStamped
                ? '0 0 35px rgba(224, 109, 56, 0.8), inset 0 2px 8px rgba(255, 255, 255, 0.4), inset 0 -3px 8px rgba(0,0,0,0.6)'
                : 'none',
              opacity: isStamped ? 1 : 0,
              transform: isStamped ? 'scale(1)' : 'scale(0.75)',
              transition: 'opacity 0.5s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <SignetInsignia size={52} color="#FFF7D6" variant="seal" />
          </div>
        </div>

        {/* Stamping Radiance Shockwave Ring */}
        {isStamped && (
          <div
            style={{
              position: 'absolute',
              width: '320px',
              height: '320px',
              borderRadius: '50%',
              border: '2px solid rgba(245, 158, 11, 0.65)',
              animation: 'seal-shockwave 2.2s cubic-bezier(0.16, 1, 0.3, 1) infinite',
              pointerEvents: 'none',
            }}
          />
        )}
      </div>

      {/* ── THE ARCHITECTURAL SIGNET RING (HEAVY METALLURGY) ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 3,
          width: '210px',
          height: '260px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transformStyle: 'preserve-3d',
          transform:
            stage === 'enter'
              ? 'translateY(-70px) rotateX(20deg) rotateY(-22deg) scale(0.92)'
              : stage === 'sweep'
              ? 'translateY(-35px) rotateX(12deg) rotateY(14deg) scale(1.02)'
              : stage === 'descend'
              ? 'translateY(18px) rotateX(6deg) rotateY(0deg) scale(1)'
              : stage === 'stamp'
              ? 'translateY(36px) rotateX(2deg) scale(0.97)'
              : 'translateY(28px) rotateX(4deg) scale(0.99)',
          transition:
            stage === 'descend'
              ? 'transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)'
              : stage === 'stamp'
              ? 'transform 0.12s cubic-bezier(0.1, 0.9, 0.2, 1)'
              : stage === 'settled'
              ? 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
              : 'transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
          animation: stage === 'settled' ? 'ring-gentle-hover 5s ease-in-out infinite' : undefined,
        }}
      >
        {/* Ring Shank (Beveled Titanium & Rose-Gold Inlay) */}
        <div
          style={{
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            border: '18px solid #28231F',
            boxShadow:
              'inset 0 4px 14px rgba(255,255,255,0.18), inset 0 -8px 18px rgba(0,0,0,0.9), 0 16px 40px rgba(0,0,0,0.8), 0 0 20px rgba(245, 158, 11, 0.25)',
            position: 'relative',
            background:
              'linear-gradient(135deg, #38312B 0%, #1A1715 45%, #2E2823 80%, #151311 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Specular Glint Across Bezel */}
          <div
            style={{
              position: 'absolute',
              inset: '-12px',
              borderRadius: '50%',
              background:
                'linear-gradient(115deg, transparent 38%, rgba(254, 243, 199, 0.4) 50%, transparent 62%)',
              pointerEvents: 'none',
              animation: 'ring-specular-sweep 5s ease-in-out infinite',
            }}
          />

          {/* Rose Gold Inner Inlay Ring */}
          <div
            style={{
              position: 'absolute',
              inset: '3px',
              borderRadius: '50%',
              border: '2px solid rgba(245, 158, 11, 0.6)',
              pointerEvents: 'none',
            }}
          />

          {/* Intaglio Engraved Ring Face (Seal Matrix) */}
          <div
            style={{
              width: '90px',
              height: '90px',
              borderRadius: '14px',
              backgroundColor: '#0C0A09',
              border: '2.5px solid #F59E0B',
              boxShadow:
                'inset 0 4px 14px rgba(0,0,0,0.95), 0 0 24px rgba(245, 158, 11, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Core intaglio matrix reflection */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'radial-gradient(circle at 40% 30%, rgba(245, 158, 11, 0.2) 0%, transparent 70%)',
              }}
            />
            <SignetInsignia size={58} color="#FDE68A" variant="engraved" />
          </div>
        </div>

        {/* Ring Band Stem / Neck Connection */}
        <div
          style={{
            width: '32px',
            height: '42px',
            background: 'linear-gradient(180deg, #2D2722 0%, #171412 100%)',
            borderLeft: '1.5px solid rgba(245, 158, 11, 0.4)',
            borderRight: '1.5px solid rgba(245, 158, 11, 0.4)',
            borderRadius: '4px',
            marginTop: '-6px',
            boxShadow: '0 6px 14px rgba(0,0,0,0.7)',
          }}
        />
      </div>

      {/* ── High-Tech Floating Micro-HUD Indicators ── */}
      {isStamped && (
        <>
          {/* Top-Left: Cryptographic Seal */}
          <div
            className="signet-fluid-drift-a"
            style={{
              position: 'absolute',
              top: '30px',
              left: '-10px',
              zIndex: 4,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(22, 18, 15, 0.85)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              borderRadius: '99px',
              padding: '6px 14px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6), 0 0 16px rgba(245, 158, 11, 0.25)',
              fontSize: '10.5px',
              fontWeight: 700,
              color: '#FEF3C7',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              pointerEvents: 'none',
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: '#F59E0B',
                boxShadow: '0 0 8px #F59E0B',
              }}
            />
            Cryptographic Seal
          </div>

          {/* Bottom-Right: Attestation Settled */}
          <div
            className="signet-fluid-drift-b"
            style={{
              position: 'absolute',
              bottom: '50px',
              right: '-10px',
              zIndex: 4,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              borderRadius: '99px',
              padding: '6px 14px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6), 0 0 16px rgba(56, 189, 248, 0.25)',
              fontSize: '10.5px',
              fontWeight: 700,
              color: '#F0F9FF',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              pointerEvents: 'none',
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: '#38BDF8',
                boxShadow: '0 0 8px #38BDF8',
              }}
            />
            Attestation Settled
          </div>
        </>
      )}

      {/* ── Dynamic Keyframes ── */}
      <style>{`
        @keyframes dais-rotate-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes ring-specular-sweep {
          0% { transform: rotate(0deg); opacity: 0.25; }
          50% { transform: rotate(180deg); opacity: 0.75; }
          100% { transform: rotate(360deg); opacity: 0.25; }
        }
        @keyframes ring-gentle-hover {
          0%, 100% { transform: translateY(28px) rotateX(4deg) scale(0.99); }
          50% { transform: translateY(23px) rotateX(6deg) scale(1.01); }
        }
        @keyframes seal-shockwave {
          0% { transform: scale(0.65); opacity: 0.9; }
          100% { transform: scale(1.35); opacity: 0; }
        }
      `}</style>
    </div>
  )
}

export default CinematicRingScene
