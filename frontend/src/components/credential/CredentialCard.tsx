import React from 'react'
import CredentialSeal from './CredentialSeal'

export interface CredentialCardData {
  credentialId: string
  contributor: string
  contributionTitle: string
  repository: string
  prNumber: number
  issuer: string
  issuanceDate: string
  status: 'Sample Demonstrator' | 'Evidence Inspected' | 'Attested'
  isSample?: boolean
  txRef?: string
  contractRef?: string
}

interface CredentialCardProps {
  data?: CredentialCardData
  onInspect?: () => void
  interactive?: boolean
  className?: string
  style?: React.CSSProperties
}

const DEFAULT_SAMPLE_DATA: CredentialCardData = {
  credentialId: 'SGT-2026-08492-NEAR',
  contributor: 'alex-dev',
  contributionTitle: 'Implement non-transferable credential registry',
  repository: 'near/core-contracts',
  prNumber: 408,
  issuer: 'SIGNET Protocol Core',
  issuanceDate: '2026-11-14',
  status: 'Sample Demonstrator',
  isSample: true,
  txRef: 'NOT APPLICABLE — ILLUSTRATIVE SAMPLE',
  contractRef: 'NOT APPLICABLE — ILLUSTRATIVE SAMPLE',
}

/**
 * SIGNET Credential Card
 * Follows PRD Section 5.6 & Section 7:
 * Archival luxury credential on warm cream paper surface with intaglio seal,
 * precise monospace metadata, and tabular figures. Avoids NFT collectible aesthetic.
 */
export const CredentialCard: React.FC<CredentialCardProps> = ({
  data = DEFAULT_SAMPLE_DATA,
  onInspect,
  interactive = true,
  className,
  style,
}) => {
  return (
    <article
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '440px',
        backgroundColor: '#F3E8D5',
        color: '#191715',
        borderRadius: '16px',
        padding: '2.2rem 2.2rem 1.8rem',
        boxShadow:
          '0 24px 60px rgba(0, 0, 0, 0.45), 0 4px 16px rgba(118, 103, 91, 0.2), inset 0 1px 3px rgba(255, 255, 255, 0.8)',
        border: '1px solid rgba(118, 103, 91, 0.28)',
        userSelect: 'none',
        transition: interactive ? 'transform 0.3s ease, box-shadow 0.3s ease' : 'none',
        ...style,
      }}
      aria-label={`Contribution Credential ${data.credentialId}`}
    >
      {/* Archival watermarked paper texture border */}
      <div
        style={{
          position: 'absolute',
          inset: '8px',
          border: '1px solid rgba(118, 103, 91, 0.2)',
          borderRadius: '10px',
          pointerEvents: 'none',
        }}
      />

      {/* Header: Organization & Seal Lockup */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '1.6rem',
        }}
      >
        <div>
          <span
            style={{
              fontSize: '10px',
              fontFamily: 'var(--font-sans)',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: '#B9572B',
              display: 'block',
              marginBottom: '3px',
            }}
          >
            Contribution Credential
          </span>
          <span
            style={{
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--signet-muted)',
              letterSpacing: '0.04em',
            }}
          >
            {data.credentialId}
          </span>
        </div>

        <CredentialSeal size={48} glow={interactive} />
      </div>

      {/* Title & Contribution Subject */}
      <div style={{ marginBottom: '1.8rem', textAlign: 'left' }}>
        <h3
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '24px',
            lineHeight: 1.25,
            fontWeight: 600,
            color: '#191715',
            margin: '0 0 6px',
          }}
        >
          {data.contributionTitle}
        </h3>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '12.5px',
            color: 'var(--signet-muted)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          <span>{data.repository}</span>
          <span>·</span>
          <span>PR #{data.prNumber}</span>
        </div>
      </div>

      {/* Structured Technical Metadata (Tabular figures) */}
      <div
        style={{
          backgroundColor: 'rgba(25, 23, 21, 0.04)',
          borderRadius: '8px',
          padding: '12px 14px',
          marginBottom: '1.6rem',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px 14px',
          fontSize: '11px',
          textAlign: 'left',
          border: '1px solid rgba(118, 103, 91, 0.15)',
        }}
      >
        <div>
          <span style={{ color: 'var(--signet-muted)', textTransform: 'uppercase', fontSize: '9px', fontWeight: 700, display: 'block', letterSpacing: '0.06em' }}>
            Contributor
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#191715' }}>
            @{data.contributor}
          </span>
        </div>

        <div>
          <span style={{ color: 'var(--signet-muted)', textTransform: 'uppercase', fontSize: '9px', fontWeight: 700, display: 'block', letterSpacing: '0.06em' }}>
            Issuance Date
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#191715' }}>
            {data.issuanceDate}
          </span>
        </div>

        <div>
          <span style={{ color: 'var(--signet-muted)', textTransform: 'uppercase', fontSize: '9px', fontWeight: 700, display: 'block', letterSpacing: '0.06em' }}>
            Issuer
          </span>
          <span style={{ fontWeight: 600, color: '#191715' }}>
            {data.issuer}
          </span>
        </div>

        <div>
          <span style={{ color: 'var(--signet-muted)', textTransform: 'uppercase', fontSize: '9px', fontWeight: 700, display: 'block', letterSpacing: '0.06em' }}>
            Status
          </span>
          <span
            style={{
              fontWeight: 700,
              color: '#B9572B',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#B9572B' }} />
            {data.status}
          </span>
        </div>
      </div>

      {/* Card Action & Sample Notice */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '8px',
          borderTop: '1px solid rgba(118, 103, 91, 0.18)',
        }}
      >
        <span
          style={{
            fontSize: '9px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#B9572B',
            backgroundColor: 'rgba(185, 87, 43, 0.08)',
            padding: '3px 8px',
            borderRadius: '4px',
            border: '1px solid rgba(185, 87, 43, 0.2)',
          }}
        >
          {data.isSample ? 'Illustrative Sample' : 'Active Credential'}
        </span>

        {onInspect && (
          <button
            onClick={onInspect}
            style={{
              fontSize: '12px',
              fontWeight: 700,
              color: '#191715',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '4px 6px',
              transition: 'color 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#B9572B')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#191715')}
          >
            Inspect evidence
            <span style={{ fontSize: '14px' }}>→</span>
          </button>
        )}
      </div>
    </article>
  )
}

export default CredentialCard
