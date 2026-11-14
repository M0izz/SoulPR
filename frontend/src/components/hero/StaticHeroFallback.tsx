import React from 'react'
import SignetInsignia from '../brand/SignetInsignia'

export const StaticHeroFallback: React.FC = () => {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '480px',
        height: '420px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      role="region"
      aria-label="SIGNET Architectural Signet Ring Still"
    >
      {/* Warm Cream Paper Base */}
      <div
        style={{
          width: '280px',
          height: '280px',
          borderRadius: '50%',
          backgroundColor: '#F3E8D5',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.4), inset 0 2px 10px rgba(118, 103, 91, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Concentric Embossed Impression Ring */}
        <div
          style={{
            position: 'absolute',
            width: '210px',
            height: '210px',
            borderRadius: '50%',
            border: '1.5px solid rgba(185, 87, 43, 0.4)',
          }}
        />

        {/* Intaglio Embossed Mark */}
        <div
          style={{
            width: '90px',
            height: '90px',
            borderRadius: '14px',
            backgroundColor: '#10100F',
            border: '2px solid #B9572B',
            boxShadow: '0 0 28px rgba(185, 87, 43, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <SignetInsignia size={54} color="#EDE2D0" variant="engraved" />
        </div>
      </div>

      <div
        style={{
          marginTop: '1.5rem',
          fontSize: '11px',
          fontWeight: 700,
          color: 'var(--signet-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
        }}
      >
        Signet Intaglio Seal
      </div>
    </div>
  )
}

export default StaticHeroFallback
