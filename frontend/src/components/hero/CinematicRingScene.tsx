import React from 'react'
import SignetInsignia from '../brand/SignetInsignia'

interface CinematicRingSceneProps {
  onAnimationComplete?: () => void
}

/**
 * Biblically Accurate Ophanim (Gyroscopic) Cryptographic Seal Engine
 * Features multi-axis revolving nested gimbal rings ("wheels within wheels"):
 * 1. Radiant luminous cyan neon outer orbit ring revolving on a 3D tilted plane.
 * 2. Golden celestial astrolabe dial ring with radial tick marks counter-revolving.
 * 3. Inner coordinate gimbal ring revolving on a third intersecting axis.
 * 4. Center floating architectural titanium & rose-gold intaglio seal matrix.
 * 5. Vertical celestial light beam descending onto a multi-tier glowing floor dais.
 * 6. Floating glassmorphic HUD badges: "CRYPTOGRAPHIC SEAL" & "ATTESTATION SETTLED".
 */
export const CinematicRingScene: React.FC<CinematicRingSceneProps> = () => {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '560px',
        height: '500px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        perspective: '1400px',
        userSelect: 'none',
      }}
      role="region"
      aria-label="SIGNET Ophanim Cryptographic Seal Engine"
    >
      {/* ── Background Celestial Glow Behind Gyroscope ── */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '420px',
          height: '360px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(245, 158, 11, 0.16) 0%, rgba(56, 189, 248, 0.08) 45%, transparent 75%)',
          filter: 'blur(55px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ── Floor Perspective Tech Grid ── */}
      <div
        style={{
          position: 'absolute',
          bottom: '0px',
          width: '100%',
          height: '140px',
          backgroundImage:
            'linear-gradient(to right, rgba(237, 226, 208, 0.06) 1px, transparent 1px), linear-gradient(to top, rgba(237, 226, 208, 0.06) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
          transform: 'rotateX(75deg)',
          maskImage: 'radial-gradient(ellipse at 50% 60%, black 20%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 60%, black 20%, transparent 80%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* ── Vertical Celestial Light Beam ── */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          bottom: '60px',
          width: '56px',
          background:
            'linear-gradient(180deg, rgba(245, 158, 11, 0) 0%, rgba(245, 158, 11, 0.15) 30%, rgba(224, 109, 56, 0.3) 70%, rgba(245, 158, 11, 0.65) 100%)',
          animation: 'celestialBeamPulse 4s ease-in-out infinite',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />

      {/* ── Bottom Dais (Floor Light Altar) ── */}
      <div
        style={{
          position: 'absolute',
          bottom: '40px',
          width: '190px',
          height: '52px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          zIndex: 3,
        }}
      >
        {/* Outer glowing floor ring */}
        <div
          style={{
            position: 'absolute',
            width: '180px',
            height: '46px',
            borderRadius: '50%',
            border: '1.5px solid rgba(245, 158, 11, 0.5)',
            boxShadow: '0 0 25px rgba(245, 158, 11, 0.4), inset 0 0 15px rgba(245, 158, 11, 0.2)',
            transform: 'rotateX(75deg)',
          }}
        />

        {/* Multi-tiered metallic dais platform */}
        <div
          style={{
            position: 'absolute',
            width: '124px',
            height: '32px',
            borderRadius: '50%',
            background: 'linear-gradient(180deg, #2D2621 0%, #151311 100%)',
            border: '2px solid #F59E0B',
            boxShadow: '0 10px 25px rgba(0,0,0,0.8)',
            transform: 'rotateX(75deg)',
          }}
        />

        {/* Core radiant light lens */}
        <div
          style={{
            position: 'absolute',
            width: '76px',
            height: '20px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #FFF7D6 0%, #F59E0B 65%, transparent 100%)',
            filter: 'blur(3px)',
            boxShadow: '0 0 30px #F59E0B',
            transform: 'rotateX(75deg)',
          }}
        />
      </div>

      {/* ── 3D OPHANIM GYROSCOPE SPHERE (WHEELS WITHIN WHEELS) ── */}
      <div
        style={{
          position: 'relative',
          width: '440px',
          height: '440px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transformStyle: 'preserve-3d',
          zIndex: 4,
        }}
      >
        {/* ========================================================
            RING 1: LUMINOUS CYAN NEON ORBIT GIMBAL
            Tilted at 68deg X, -28deg Y, rotating smoothly on Z
            ======================================================== */}
        <div
          style={{
            position: 'absolute',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            border: '3.5px solid #38BDF8',
            boxShadow:
              '0 0 28px rgba(56, 189, 248, 0.85), inset 0 0 20px rgba(56, 189, 248, 0.45)',
            transformStyle: 'preserve-3d',
            animation: 'ophanimCyanRotate 18s linear infinite',
            pointerEvents: 'none',
          }}
        >
          {/* Orbital Neon Satellite Node 1 */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '-7px',
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              background: '#FFFFFF',
              boxShadow: '0 0 16px #38BDF8, 0 0 28px #38BDF8',
              transform: 'translateY(-50%)',
            }}
          />
          {/* Orbital Neon Satellite Node 2 */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              right: '-7px',
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              background: '#FFFFFF',
              boxShadow: '0 0 16px #38BDF8, 0 0 28px #38BDF8',
              transform: 'translateY(-50%)',
            }}
          />
        </div>

        {/* ========================================================
            RING 2: CELESTIAL ASTROLABE / GOLDEN CHRONOMETER TICKET RING
            Tilted at -58deg X, 32deg Y, counter-rotating smoothly
            ======================================================== */}
        <div
          style={{
            position: 'absolute',
            width: '340px',
            height: '340px',
            borderRadius: '50%',
            transformStyle: 'preserve-3d',
            animation: 'ophanimGoldRotate 14s linear infinite',
            pointerEvents: 'none',
          }}
        >
          <svg
            width="340"
            height="340"
            viewBox="0 0 340 340"
            style={{
              width: '100%',
              height: '100%',
              overflow: 'visible',
            }}
          >
            <defs>
              <filter id="goldDialGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#F59E0B" floodOpacity="0.75" />
              </filter>
            </defs>

            {/* Main Outer Gold Rim */}
            <circle
              cx="170"
              cy="170"
              r="165"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="2.5"
              filter="url(#goldDialGlow)"
            />

            {/* Concentric Dashed Gauge Line */}
            <circle
              cx="170"
              cy="170"
              r="156"
              fill="none"
              stroke="#FDE68A"
              strokeWidth="1.2"
              strokeDasharray="4 6"
              opacity="0.8"
            />

            {/* Inner Concentric Hairline */}
            <circle
              cx="170"
              cy="170"
              r="144"
              fill="none"
              stroke="#D97706"
              strokeWidth="1"
              opacity="0.6"
            />

            {/* 72 Chronometer Precision Tick Marks */}
            <g stroke="#FDE68A" strokeWidth="1.5" opacity="0.9">
              {[...Array(72)].map((_, i) => {
                const angle = (i * 360) / 72
                const isMajor = i % 6 === 0
                const tickLen = isMajor ? 12 : 6
                const rad = (angle * Math.PI) / 180
                const x1 = 170 + 165 * Math.cos(rad)
                const y1 = 170 + 165 * Math.sin(rad)
                const x2 = 170 + (165 - tickLen) * Math.cos(rad)
                const y2 = 170 + (165 - tickLen) * Math.sin(rad)
                return (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    strokeWidth={isMajor ? 2.2 : 1.2}
                    stroke={isMajor ? '#FFF7D6' : '#F59E0B'}
                  />
                )
              })}
            </g>
          </svg>
        </div>

        {/* ========================================================
            RING 3: INNER COORDINATE GIMBAL RING
            Tilted at 45deg X, 65deg Y, revolving on a 3rd axis
            ======================================================== */}
        <div
          style={{
            position: 'absolute',
            width: '270px',
            height: '270px',
            borderRadius: '50%',
            border: '2px solid rgba(245, 158, 11, 0.45)',
            boxShadow: '0 0 16px rgba(245, 158, 11, 0.3), inset 0 0 12px rgba(245, 158, 11, 0.15)',
            transformStyle: 'preserve-3d',
            animation: 'ophanimInnerRotate 10s linear infinite',
            pointerEvents: 'none',
          }}
        >
          {/* Inner Cyan Coordinate Points */}
          <div
            style={{
              position: 'absolute',
              top: '-5px',
              left: '50%',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: '#38BDF8',
              boxShadow: '0 0 12px #38BDF8',
              transform: 'translateX(-50%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-5px',
              left: '50%',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: '#F59E0B',
              boxShadow: '0 0 12px #F59E0B',
              transform: 'translateX(-50%)',
            }}
          />
        </div>

        {/* ========================================================
            CENTER CORE: ARCHITECTURAL TITANIUM & ROSE-GOLD SEAL DISC
            Levitating at center with subtle breathing hover
            ======================================================== */}
        <div
          style={{
            position: 'relative',
            width: '174px',
            height: '174px',
            borderRadius: '50%',
            transformStyle: 'preserve-3d',
            animation: 'ophanimCoreFloat 6s ease-in-out infinite',
            zIndex: 5,
          }}
        >
          {/* Heavy Titanium Bezel Outer Body */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              background:
                'linear-gradient(135deg, #3C342E 0%, #1A1715 45%, #2D2722 80%, #151311 100%)',
              border: '18px solid #28231F',
              boxShadow:
                '0 25px 60px rgba(0, 0, 0, 0.9), inset 0 4px 12px rgba(255, 255, 255, 0.18), inset 0 -8px 18px rgba(0, 0, 0, 0.9), 0 0 25px rgba(245, 158, 11, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Polished Rose-Gold Inner Inlay Ring */}
            <div
              style={{
                position: 'absolute',
                inset: '2px',
                borderRadius: '50%',
                border: '2.5px solid rgba(245, 158, 11, 0.75)',
                boxShadow: '0 0 10px rgba(245, 158, 11, 0.4)',
                pointerEvents: 'none',
              }}
            />

            {/* Specular Glint Across Metal Surface */}
            <div
              style={{
                position: 'absolute',
                inset: '-12px',
                borderRadius: '50%',
                background:
                  'linear-gradient(115deg, transparent 38%, rgba(254, 243, 199, 0.45) 50%, transparent 62%)',
                pointerEvents: 'none',
                animation: 'ring-specular-sweep 6s ease-in-out infinite',
              }}
            />

            {/* Deep Obsidian Chamber with Rounded Corners */}
            <div
              style={{
                width: '92px',
                height: '92px',
                borderRadius: '16px',
                backgroundColor: '#090807',
                border: '2.5px solid #F59E0B',
                boxShadow:
                  'inset 0 4px 16px rgba(0, 0, 0, 0.95), 0 0 24px rgba(245, 158, 11, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Inner ambient golden radial illumination */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'radial-gradient(circle at 40% 35%, rgba(245, 158, 11, 0.28) 0%, transparent 70%)',
                }}
              />

              {/* Glowing Golden Geometric Insignia */}
              <SignetInsignia size={60} color="#FDE68A" variant="engraved" />
            </div>
          </div>
        </div>
      </div>

      {/* ── High-Tech Floating Micro-HUD Badges (Matching Reference Image) ── */}
      {/* Top-Left: Cryptographic Seal */}
      <div
        className="signet-fluid-drift-a"
        style={{
          position: 'absolute',
          top: '40px',
          left: '20px',
          zIndex: 6,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(24, 18, 12, 0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1.5px solid rgba(245, 158, 11, 0.45)',
          borderRadius: '99px',
          padding: '7px 18px',
          boxShadow: '0 10px 28px rgba(0, 0, 0, 0.7), 0 0 18px rgba(245, 158, 11, 0.3)',
          fontSize: '11px',
          fontWeight: 800,
          color: '#FEF3C7',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          pointerEvents: 'none',
        }}
      >
        <span
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#F59E0B',
            boxShadow: '0 0 10px #F59E0B',
          }}
        />
        CRYPTOGRAPHIC SEAL
      </div>

      {/* Bottom-Right: Attestation Settled */}
      <div
        className="signet-fluid-drift-b"
        style={{
          position: 'absolute',
          bottom: '55px',
          right: '15px',
          zIndex: 6,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(12, 22, 38, 0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1.5px solid rgba(56, 189, 248, 0.45)',
          borderRadius: '99px',
          padding: '7px 18px',
          boxShadow: '0 10px 28px rgba(0, 0, 0, 0.7), 0 0 18px rgba(56, 189, 248, 0.3)',
          fontSize: '11px',
          fontWeight: 800,
          color: '#F0F9FF',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          pointerEvents: 'none',
        }}
      >
        <span
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#38BDF8',
            boxShadow: '0 0 10px #38BDF8',
          }}
        />
        ATTESTATION SETTLED
      </div>

      {/* Faint Background HUD Corner Telemetry Marks */}
      <div
        style={{
          position: 'absolute',
          top: '25px',
          right: '25px',
          fontSize: '9.5px',
          fontFamily: 'var(--font-mono)',
          color: 'rgba(237, 226, 208, 0.22)',
          textAlign: 'right',
          lineHeight: 1.4,
          pointerEvents: 'none',
        }}
      >
        <div>OPHANIM_ENGINE_v2.4</div>
        <div>GYRO_ROTATION: MULTI_AXIS</div>
        <div>NEAR_INDEX: #408_FINAL</div>
      </div>
    </div>
  )
}

export default CinematicRingScene
