import React from 'react'
import SignetInsignia from '../brand/SignetInsignia'

interface CredentialSealProps {
  size?: number
  color?: string
  glow?: boolean
  className?: string
  style?: React.CSSProperties
}

/**
 * SIGNET Intaglio Credential Seal
 * Embossed physical wax/metal seal motif with concentric precision borders.
 */
export const CredentialSeal: React.FC<CredentialSealProps> = ({
  size = 56,
  color = '#B9572B',
  glow = false,
  className,
  style,
}) => {
  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: `${size}px`,
        height: `${size}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
    >
      {/* Outer ambient glow */}
      {glow && (
        <div
          style={{
            position: 'absolute',
            inset: '-6px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(185, 87, 43, 0.3) 0%, transparent 70%)',
            filter: 'blur(8px)',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Outer scalloped/beveled ring */}
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          border: `1.5px solid ${color}`,
          backgroundColor: 'rgba(185, 87, 43, 0.08)',
          boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.15), 0 4px 12px rgba(185, 87, 43, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Fine concentric dashed border */}
        <div
          style={{
            position: 'absolute',
            inset: '3px',
            borderRadius: '50%',
            border: `0.75px dashed ${color}`,
            opacity: 0.6,
          }}
        />

        {/* Master Insignia Core */}
        <SignetInsignia size={Math.round(size * 0.58)} color={color} />
      </div>
    </div>
  )
}

export default CredentialSeal
