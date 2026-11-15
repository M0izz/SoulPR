import { Link, useNavigate } from 'react-router-dom'
import { useWorkspace, type EvidenceClassification } from '../../context/WorkspaceContext'
import CredentialSeal from '../../components/credential/CredentialSeal'
import HolographicCredential3D from '../../components/credential/HolographicCredential3D'
import {
  IconExternalLink,
  IconArrowRight,
  IconCheckCircle,
} from '../../components/Icons'

export default function CredentialsPage() {
  const navigate = useNavigate()
  const { contributions, userGithub, nearAccount } = useWorkspace()

  // Filter confirmed credentials
  const confirmedCredentials = contributions.filter((c) => c.credentialStatus === 'confirmed')

  const getClassificationBadge = (classification: EvidenceClassification) => {
    switch (classification) {
      case 'independently_merged':
        return { label: 'INDEPENDENTLY MERGED', color: '#10B981', bg: 'rgba(16, 185, 129, 0.12)' }
      case 'self_maintained':
        return { label: 'SELF-MAINTAINED', color: '#38BDF8', bg: 'rgba(56, 189, 248, 0.12)' }
      case 'community_verified':
        return { label: 'COMMUNITY VERIFIED', color: '#A855F7', bg: 'rgba(168, 85, 247, 0.12)' }
      case 'maintainer_verified':
        return { label: 'MAINTAINER VERIFIED', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.12)' }
      default:
        return { label: 'GITHUB VERIFIED', color: '#B9572B', bg: 'rgba(185, 87, 43, 0.12)' }
    }
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* ── HEADER ── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '26px',
              fontWeight: 700,
              margin: '0 0 6px 0',
              fontFamily: 'var(--font-serif)',
              color: 'var(--ink)',
            }}
          >
            Contribution Credentials Shelf
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--ink-muted)', margin: 0 }}>
            Verifiable, evidence-backed credentials across external repositories, maintained tools, and collaborative reviews.
          </p>
        </div>

        <button
          onClick={() => navigate('/verify/sample')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'transparent',
            border: '1px solid #B9572B',
            color: '#B9572B',
            borderRadius: '8px',
            padding: '8px 16px',
            fontSize: '12.5px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Inspect Illustrative 3D Sample <IconExternalLink size={12} />
        </button>
      </div>

      {/* ── CONFIRMED CREDENTIALS GRID ── */}
      {confirmedCredentials.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {confirmedCredentials.map((cred) => {
            const badge = getClassificationBadge(cred.evidenceClassification)
            return (
              <div
                key={cred.id}
                className="app-glass-card"
                style={{
                  backgroundColor: 'var(--paper-raised)',
                  border: '1px solid var(--rule)',
                  borderRadius: '14px',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Header */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '4px',
                          background: badge.bg,
                          color: badge.color,
                          border: `1px solid ${badge.color}40`,
                          letterSpacing: '0.04em',
                        }}
                      >
                        {badge.label}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--ink-muted)', fontWeight: 600 }}>
                        {cred.contributionType === 'external' && '01. External PR'}
                        {cred.contributionType === 'maintainer' && '02. Project Maintainer'}
                        {cred.contributionType === 'community' && '03. Community & Review'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10B981', fontSize: '11px', fontWeight: 700 }}>
                      <IconCheckCircle size={13} /> CONFIRMED
                    </div>
                  </div>

                  <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 6px 0', color: 'var(--ink)', fontFamily: 'var(--font-serif)' }}>
                    {cred.prTitle}
                  </h3>

                  <div style={{ fontSize: '12.5px', color: 'var(--clay)', fontFamily: 'var(--font-mono)', marginBottom: '12px', fontWeight: 600 }}>
                    {cred.repo} {cred.prNumber ? `#${cred.prNumber}` : ''}
                  </div>

                  {/* 8 Required Protocol Credential Attributes */}
                  <div
                    style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      background: 'rgba(0, 0, 0, 0.25)',
                      border: '1px solid var(--rule)',
                      fontSize: '11.5px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '5px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--ink-muted)' }}>Developer Identity:</span>
                      <strong style={{ color: 'var(--ink)' }}>@{cred.author || userGithub || 'contributor'}</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--ink-muted)' }}>Settlement Wallet:</span>
                      <span style={{ color: '#10B981', fontFamily: 'var(--font-mono)' }}>
                        {nearAccount || 'soulpr.testnet'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--ink-muted)' }}>Reference:</span>
                      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink)' }}>
                        {cred.prNumber ? `PR #${cred.prNumber}` : cred.maintainerEvidence?.defaultBranch ? `Branch: ${cred.maintainerEvidence.defaultBranch}` : 'Commit Event'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--ink-muted)' }}>SHA-256 Provenance:</span>
                      <span style={{ fontFamily: 'var(--font-mono)', color: '#38BDF8' }}>
                        {cred.mergeCommitSha ? `${cred.mergeCommitSha.slice(0, 12)}...` : 'sha256:e3b0c4...'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--ink-muted)' }}>Issuance Date:</span>
                      <span style={{ color: 'var(--ink-muted)' }}>
                        {new Date(cred.mergedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.8rem', borderTop: '1px solid var(--rule)' }}>
                  <Link
                    to={`/contributions/${cred.id}`}
                    style={{
                      fontSize: '12px',
                      color: 'var(--ink-muted)',
                      textDecoration: 'none',
                    }}
                  >
                    Inspect Full Evidence
                  </Link>

                  <Link
                    to="/verify/sample"
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#B9572B',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    View Hologram <IconArrowRight size={12} />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div
          className="app-glass-card"
          style={{
            backgroundColor: 'var(--paper-raised)',
            border: '1px solid var(--rule)',
            borderRadius: '14px',
            padding: '3.5rem 2rem',
            textAlign: 'center',
          }}
        >
          <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
            <CredentialSeal size={64} glow={true} />
          </div>

          <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 8px 0', color: 'var(--ink)', fontFamily: 'var(--font-serif)' }}>
            No Credentials Confirmed Yet
          </h2>

          <p style={{ fontSize: '13px', color: 'var(--ink-muted)', maxWidth: '480px', margin: '0 auto 1.5rem auto', lineHeight: 1.5 }}>
            Verify external PRs, repositories you maintain, or collaborative reviews in your dashboard to generate your credentials.
          </p>

          <Link
            to="/dashboard"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#B9572B',
              color: '#EDE2D0',
              textDecoration: 'none',
              padding: '9px 18px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 700,
            }}
          >
            Go to Verification Terminal <IconArrowRight size={13} />
          </Link>
        </div>
      )}

      {/* ── 3D HOLOGRAPHIC SAMPLE SHOWCASE ── */}
      <section
        className="app-glass-card"
        style={{
          border: '1px solid var(--rule)',
          borderRadius: '14px',
          padding: '2rem',
          textAlign: 'center',
          backgroundColor: 'var(--paper-raised)',
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '10px',
            fontWeight: 800,
            color: 'var(--signet-orange)',
            background: 'var(--signet-orange-subtle)',
            border: '1px solid var(--signet-orange-border)',
            padding: '4px 14px',
            borderRadius: '99px',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            marginBottom: '10px',
          }}
        >
          ILLUSTRATIVE SAMPLE · ROTATING 3D HOLOGRAPHIC CREDENTIAL
        </span>
        <p style={{ fontSize: '13px', color: 'var(--ink-muted)', maxWidth: '440px', margin: '0 auto 1.5rem auto' }}>
          Real-time dynamic visualization of a SIGNET soulbound credential rotating on its own axis.
        </p>
        <HolographicCredential3D autoRotate={true} showPedestal={true} />
      </section>
    </div>
  )
}
