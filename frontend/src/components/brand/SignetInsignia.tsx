import React from 'react'

interface SignetInsigniaProps {
  size?: number
  color?: string
  strokeWidth?: number
  className?: string
  style?: React.CSSProperties
  variant?: 'outline' | 'engraved' | 'seal'
}

/**
 * SIGNET Master Insignia
 * Based on the 3x3 / XXXIII architectural matrix:
 * Three horizontal registers (Contribution, Evidence, Attestation)
 * interlocked with three vertical columns (Identity, Permanence, Inspection),
 * centered on an engraved intaglio seal core.
 */
export const SignetInsignia: React.FC<SignetInsigniaProps> = ({
  size = 32,
  color = '#B9572B',
  strokeWidth = 1.75,
  className,
  style,
  variant = 'outline',
}) => {
  if (variant === 'seal') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={style}
        role="img"
        aria-label="SIGNET Master Seal"
      >
        <circle cx="32" cy="32" r="30" fill="rgba(185, 87, 43, 0.12)" stroke={color} strokeWidth="1.5" />
        <circle cx="32" cy="32" r="26.5" stroke={color} strokeWidth="0.75" strokeDasharray="2 2" opacity="0.6" />
        {/* Outer 3x3 frame */}
        <rect x="18" y="18" width="28" height="28" rx="2" stroke={color} strokeWidth={strokeWidth} />
        {/* Inner cross bars (3x3 grid lines) */}
        <line x1="27" y1="18" x2="27" y2="46" stroke={color} strokeWidth={strokeWidth * 0.9} />
        <line x1="37" y1="18" x2="37" y2="46" stroke={color} strokeWidth={strokeWidth * 0.9} />
        <line x1="18" y1="27" x2="46" y2="27" stroke={color} strokeWidth={strokeWidth * 0.9} />
        <line x1="18" y1="37" x2="46" y2="37" stroke={color} strokeWidth={strokeWidth * 0.9} />
        {/* Core architectural signet diamond */}
        <polygon points="32,22 42,32 32,42 22,32" stroke={color} strokeWidth={strokeWidth} fill="rgba(185, 87, 43, 0.2)" />
        <circle cx="32" cy="32" r="2.5" fill={color} />
      </svg>
    )
  }

  if (variant === 'engraved') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={style}
        role="img"
        aria-label="SIGNET Engraved Insignia"
      >
        <defs>
          <filter id="engrave-bevel" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0.5" dy="1" stdDeviation="0.8" floodColor="#000" floodOpacity="0.6" />
          </filter>
        </defs>
        {/* Ring-face bezel */}
        <rect x="6" y="6" width="52" height="52" rx="10" fill="#141312" stroke={color} strokeWidth="2" />
        <rect x="11" y="11" width="42" height="42" rx="6" stroke="rgba(237, 226, 208, 0.15)" strokeWidth="0.8" />
        {/* 3x3 Geometry */}
        <g filter="url(#engrave-bevel)">
          <path
            d="M20 20H44V44H20V20Z"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="square"
          />
          <path d="M28 20V44" stroke={color} strokeWidth="1.5" />
          <path d="M36 20V44" stroke={color} strokeWidth="1.5" />
          <path d="M20 28H44" stroke={color} strokeWidth="1.5" />
          <path d="M20 36H44" stroke={color} strokeWidth="1.5" />
          <polygon points="32,23 41,32 32,41 23,32" stroke="#EDE2D0" strokeWidth="1.5" fill="none" />
          <circle cx="32" cy="32" r="3" fill={color} />
        </g>
      </svg>
    )
  }

  // Default clean architectural outline
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      role="img"
      aria-label="SIGNET Insignia"
    >
      {/* Outer precision frame */}
      <rect x="4" y="4" width="24" height="24" rx="2" stroke={color} strokeWidth={strokeWidth} />
      {/* 3x3 grid markers */}
      <line x1="12" y1="4" x2="12" y2="28" stroke={color} strokeWidth={strokeWidth * 0.75} strokeOpacity="0.75" />
      <line x1="20" y1="4" x2="20" y2="28" stroke={color} strokeWidth={strokeWidth * 0.75} strokeOpacity="0.75" />
      <line x1="4" y1="12" x2="28" y2="12" stroke={color} strokeWidth={strokeWidth * 0.75} strokeOpacity="0.75" />
      <line x1="4" y1="20" x2="28" y2="20" stroke={color} strokeWidth={strokeWidth * 0.75} strokeOpacity="0.75" />
      {/* Central signet intaglio diamond */}
      <polygon points="16,8 24,16 16,24 8,16" stroke={color} strokeWidth={strokeWidth} fill="none" />
      <circle cx="16" cy="16" r="1.75" fill={color} />
    </svg>
  )
}

export default SignetInsignia
