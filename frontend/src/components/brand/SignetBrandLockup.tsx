import React from 'react'
import { Link } from 'react-router-dom'
import SignetInsignia from './SignetInsignia'
import SignetWordmark from './SignetWordmark'

interface SignetBrandLockupProps {
  markSize?: number
  wordmarkSize?: number
  color?: string
  markColor?: string
  showMotto?: boolean
  linked?: boolean
  className?: string
  style?: React.CSSProperties
}

/**
 * SIGNET Brand Lockup
 * Master lockup uniting the geometric insignia with the display wordmark.
 */
export const SignetBrandLockup: React.FC<SignetBrandLockupProps> = ({
  markSize = 28,
  wordmarkSize = 18,
  color = 'var(--ink)',
  markColor = '#B9572B',
  showMotto = false,
  linked = true,
  className,
  style,
}) => {
  const content = (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '12px',
        textDecoration: 'none',
        userSelect: 'none',
        ...style,
      }}
    >
      <SignetInsignia size={markSize} color={markColor} />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <SignetWordmark size={wordmarkSize} color={color} />
        {showMotto && (
          <span
            style={{
              fontSize: '8.5px',
              fontWeight: 600,
              color: 'var(--signet-muted)',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              marginTop: '2px',
            }}
          >
            Your work is your mark
          </span>
        )}
      </div>
    </div>
  )

  if (linked) {
    return (
      <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
        {content}
      </Link>
    )
  }

  return content
}

export default SignetBrandLockup
