import React, { useState, useEffect } from 'react'
import SignetInsignia from '../brand/SignetInsignia'

interface CinematicRingSceneProps {
  onAnimationComplete?: () => void
}

/**
 * SIGNET Cinematic Ring-Stamping Sequence
 * Follows PRD Section 5.2:
 * 1. Ring enters with controlled rotation.
 * 2. Metal reflections & lighting sweep.
 * 3. Approaches warm cream paper surface.
 * 4. Stamps down; paper visibly compresses.
 * 5. Embossed intaglio impression appears with restrained burnt-orange radiance.
 * 6. Reveals insignia and transitions to wordmark & motto.
 */
export const CinematicRingScene: React.FC<CinematicRingSceneProps> = ({ onAnimationComplete }) => {
  const [stage, setStage] = useState<'enter' | 'sweep' | 'descend' | 'stamp' | 'settled'>('enter')

  useEffect(() => {
    const t1 = setTimeout(() => setStage('sweep'), 800)
    const t2 = setTimeout(() => setStage('descend'), 1800)
    const t3 = setTimeout(() => setStage('stamp'), 2600)
    const t4 = setTimeout(() => {
      setStage('settled')
      if (onAnimationComplete) onAnimationComplete()
    }, 3600)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
    }
  }, [onAnimationComplete])

  const isStamped = stage === 'stamp' || stage === 'settled'

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '520px',
        height: '460px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        perspective: '1200px',
        userSelect: 'none',
      }}
      role="region"
      aria-label="SIGNET Architectural Signet Ring Stage"
    >
      {/* ── Background Paper Surface (Warm Cream compression disc) ── */}
      <div
        style={{
          position: 'absolute',
          bottom: '40px',
          width: '320px',
          height: '240px',
          borderRadius: '50%',
          backgroundColor: '#F3E8D5',
          boxShadow: isStamped
            ? '0 20px 60px rgba(0, 0, 0, 0.45), inset 0 2px 14px rgba(118, 103, 91, 0.35)'
            : '0 15px 40px rgba(0, 0, 0, 0.3)',
          transform: isStamped
            ? 'rotateX(62deg) scale(0.97)'
            : 'rotateX(62deg) scale(1)',
          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease',
          opacity: 0.95,
          zIndex: 1,
        }}
      >
        {/* Embossed Paper Impression appearing upon stamping */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: isStamped ? 1 : 0,
            transition: 'opacity 0.6s ease',
          }}
        >
          {/* Subtle concentric compression rings in paper */}
          <div
            style={{
              position: 'absolute',
              width: '180px',
              height: '180px',
              borderRadius: '50%',
              border: '1.5px solid rgba(185, 87, 43, 0.35)',
              boxShadow: isStamped ? '0 0 30px rgba(185, 87, 43, 0.25)' : 'none',
              transform: isStamped ? 'scale(1)' : 'scale(0.8)',
              transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
          <div
            style={{
              width: '74px',
              height: '74px',
              borderRadius: '8px',
              border: '2px solid #B9572B',
              backgroundColor: 'rgba(185, 87, 43, 0.12)',
              boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.25), 0 0 24px rgba(185, 87, 43, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <SignetInsignia size={42} color="#B9572B" />
          </div>
        </div>
      </div>

      {/* ── Burnt-Orange Restrained Radiance upon stamping ── */}
      {isStamped && (
        <div
          style={{
            position: 'absolute',
            bottom: '70px',
            width: '260px',
            height: '140px',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(185, 87, 43, 0.45) 0%, rgba(185, 87, 43, 0.1) 50%, transparent 70%)',
            filter: 'blur(24px)',
            animation: 'seal-glow-radiance 2.5s ease-out infinite alternate',
            zIndex: 2,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* ── The Architectural Signet Ring ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 3,
          width: '200px',
          height: '240px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transformStyle: 'preserve-3d',
          transform:
            stage === 'enter'
              ? 'translateY(-60px) rotateX(15deg) rotateY(-20deg) scale(0.92)'
              : stage === 'sweep'
              ? 'translateY(-30px) rotateX(10deg) rotateY(10deg) scale(1)'
              : stage === 'descend'
              ? 'translateY(15px) rotateX(5deg) scale(1)'
              : 'translateY(0px) rotateX(8deg) scale(0.98)',
          transition:
            stage === 'descend'
              ? 'transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)'
              : stage === 'stamp'
              ? 'transform 0.15s cubic-bezier(0.1, 0.9, 0.2, 1)'
              : 'transform 1s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Ring Shank (Bezel body & shoulders) */}
        <div
          style={{
            width: '140px',
            height: '140px',
            borderRadius: '50%',
            border: '18px solid #282421',
            boxShadow:
              'inset 0 4px 12px rgba(255,255,255,0.1), inset 0 -6px 14px rgba(0,0,0,0.8), 0 12px 32px rgba(0,0,0,0.7)',
            position: 'relative',
            background: 'linear-gradient(145deg, #1A1816 0%, #302B27 50%, #151312 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Sweeping Light Glint across metal */}
          <div
            style={{
              position: 'absolute',
              inset: '-10px',
              borderRadius: '50%',
              background: 'linear-gradient(115deg, transparent 40%, rgba(255, 230, 200, 0.22) 50%, transparent 60%)',
              pointerEvents: 'none',
              animation: 'metal-light-sweep 6s ease-in-out infinite',
            }}
          />

          {/* Intaglio Engraved Ring Face (Seal Matrix) */}
          <div
            style={{
              width: '84px',
              height: '84px',
              borderRadius: '12px',
              backgroundColor: '#10100F',
              border: '2px solid rgba(185, 87, 43, 0.65)',
              boxShadow: 'inset 0 3px 10px rgba(0,0,0,0.9), 0 0 16px rgba(185, 87, 43, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <SignetInsignia size={54} color="#EDE2D0" variant="engraved" />
          </div>
        </div>

        {/* Ring Band Stem going down into the paper impact point */}
        <div
          style={{
            width: '28px',
            height: '36px',
            background: 'linear-gradient(180deg, #282421 0%, #141312 100%)',
            borderRadius: '4px',
            marginTop: '-6px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.6)',
          }}
        />
      </div>

      <style>{`
        @keyframes seal-glow-radiance {
          0% { opacity: 0.55; transform: scale(0.96); }
          100% { opacity: 0.85; transform: scale(1.05); }
        }
        @keyframes metal-light-sweep {
          0% { transform: rotate(0deg); opacity: 0.3; }
          50% { transform: rotate(180deg); opacity: 0.7; }
          100% { transform: rotate(360deg); opacity: 0.3; }
        }
      `}</style>
    </div>
  )
}

export default CinematicRingScene
