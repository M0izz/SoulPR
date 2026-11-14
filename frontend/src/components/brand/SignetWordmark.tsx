import React from 'react'

interface SignetWordmarkProps {
  size?: number | string
  color?: string
  className?: string
  style?: React.CSSProperties
  subtitle?: boolean
}

/**
 * SIGNET Display Wordmark
 * Follows PRD Section 3.4:
 * Custom display lettering coherent with the master insignia geometry.
 */
export const SignetWordmark: React.FC<SignetWordmarkProps> = ({
  size = 22,
  color = 'currentColor',
  className,
  style,
  subtitle = false,
}) => {
  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        lineHeight: 1,
        letterSpacing: '0.18em',
        fontFamily: 'var(--font-sans)',
        ...style,
      }}
    >
      <span
        style={{
          fontSize: typeof size === 'number' ? `${size}px` : size,
          fontWeight: 800,
          color,
          textTransform: 'uppercase',
          letterSpacing: '0.18em',
        }}
      >
        SIGNET
      </span>
      {subtitle && (
        <span
          style={{
            fontSize: '9px',
            fontWeight: 500,
            color: 'var(--signet-muted)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginTop: '3px',
          }}
        >
          Your work is your mark
        </span>
      )}
    </div>
  )
}

export default SignetWordmark
