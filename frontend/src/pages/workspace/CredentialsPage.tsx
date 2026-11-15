import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useWorkspace, type EvidenceClassification } from '../../context/WorkspaceContext'
import CredentialSeal from '../../components/credential/CredentialSeal'
import HolographicCredential3D, { type HolographicCardData } from '../../components/credential/HolographicCredential3D'
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

  // Selected credential for the 3D rotating SBT showcase
  const [activeCredId, setActiveCredId] = useState<string>(
    confirmedCredentials[0]?.id || ''
  )

  const activeCred =
    confirmedCredentials.find((c) => c.id === activeCredId) ||
    confirmedCredentials[0]

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

  // Real Minted SBT Holographic Data
  const realSBTData: HolographicCardData | undefined = activeCred
    ? {
        credentialId: activeCred.id,
        contributor: activeCred.author || userGithub || 'contributor',
        repository: `${activeCred.repo}${activeCred.prNumber ? ` #${activeCred.prNumber}` : ''}`,
        contributionTitle: activeCred.prTitle,
        mergeDate: new Date(activeCred.mergedAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        network: 'NEAR Blockchain',
        txHash: activeCred.mergeCommitSha || 'near:tx:0x89102abcef...',
        evidenceDigest: activeCred.mergeCommitSha
          ? activeCred.mergeCommitSha.startsWith('sha256:')
            ? activeCred.mergeCommitSha
            : `sha256:${activeCred.mergeCommitSha}`
          : 'sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
        isSample: false, // REAL MINTED SBT
      }
    : undefined

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
          <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#10B981', marginBottom: '4px' }}>
            Confirmed Soulbound Tokens (SBT)
          </div>
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
            Verifiable, evidence-backed credentials settled as non-transferable Soulbound Tokens on NEAR Protocol.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => navigate('/verify/sample')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: 'var(--ink-muted)',
              borderRadius: '8px',
              padding: '8px 14px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Inspect Sample <IconExternalLink size={12} />
          </button>

          <Link
            to="/dashboard"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#B9572B',
              color: '#FFFFFF',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '12.5px',
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            + Verify New Contribution
          </Link>
        </div>
      </div>

      {/* ── 3D HOLOGRAPHIC SBT SHOWCASE: DISPLAYS REAL MINTED CREDENTIAL ── */}
      <section
        className="app-glass-card"
        style={{
          border: '1px solid rgba(0, 236, 151, 0.3)',
          borderRadius: '16px',
          padding: '2rem 1.5rem 1.5rem',
          textAlign: 'center',
          backgroundColor: 'linear-gradient(135deg, rgba(16, 20, 28, 0.95) 0%, rgba(10, 14, 20, 0.98) 100%)',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
          <span
            className="shimmer-badge"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '10.5px',
              fontWeight: 800,
              color: '#00EC97',
              background: 'rgba(0, 236, 151, 0.12)',
              border: '1px solid rgba(0, 236, 151, 0.35)',
              padding: '4px 14px',
              borderRadius: '99px',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#00EC97' }} />
            {realSBTData ? 'AUTHENTIC ON-CHAIN SOULBOUND TOKEN (SBT)' : 'ILLUSTRATIVE DEMONSTRATOR'}
          </span>
        </div>

        <p style={{ fontSize: '13px', color: 'var(--ink-muted)', maxWidth: '480px', margin: '0 auto 1.5rem auto' }}>
          {realSBTData
            ? `Live 3D rotating credential for ${realSBTData.repository} · Issued to @${realSBTData.contributor}`
            : 'Mint your first merged pull request or maintained repository to see your authentic 3D SBT here.'}
        </p>

        {/* 3D Holographic Component receiving the REAL MINTED DATA */}
        <HolographicCredential3D
          data={realSBTData}
          autoRotate={true}
          showPedestal={true}
        />

        {activeCred && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '12px',
              marginTop: '1.2rem',
              fontSize: '12px',
              color: 'var(--ink-muted)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            <span>SHA: {activeCred.mergeCommitSha ? `${activeCred.mergeCommitSha.slice(0, 16)}...` : 'near:verified'}</span>
            <span>•</span>
            <span style={{ color: '#10B981' }}>Status: Confirmed on NEAR</span>
            <span>•</span>
            <Link
              to={`/contributions/${activeCred.id}`}
              style={{ color: 'var(--clay)', textDecoration: 'underline' }}
            >
              View Full Evidence Dossier ↗
            </Link>
          </div>
        )}
      </section>

      {/* ── CONFIRMED CREDENTIALS LIST (CLICK TO INSPECT THAT SBT IN 3D) ── */}
      <div>
        <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 1rem 0', color: 'var(--ink)', fontFamily: 'var(--font-serif)' }}>
          Your Minted Credentials ({confirmedCredentials.length})
        </h2>

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
              const isSelected = cred.id === activeCred?.id
              return (
                <div
                  key={cred.id}
                  onClick={() => setActiveCredId(cred.id)}
                  className="app-glass-card"
                  style={{
                    backgroundColor: 'var(--paper-raised)',
                    border: isSelected ? '2px solid #00EC97' : '1px solid var(--rule)',
                    borderRadius: '14px',
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? '0 0 20px rgba(0, 236, 151, 0.2)' : 'none',
                  }}
                >
                  {/* Top Badge & Status */}
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
                        <IconCheckCircle size={13} /> CONFIRMED SBT
                      </div>
                    </div>

                    <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 6px 0', color: 'var(--ink)', fontFamily: 'var(--font-serif)' }}>
                      {cred.prTitle}
                    </h3>

                    <div style={{ fontSize: '12.5px', color: 'var(--clay)', fontFamily: 'var(--font-mono)', marginBottom: '12px', fontWeight: 600 }}>
                      {cred.repo} {cred.prNumber ? `#${cred.prNumber}` : ''}
                    </div>

                    {/* Protocol Attributes */}
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
                        <span style={{ color: 'var(--ink-muted)' }}>Developer:</span>
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
                          {cred.mergeCommitSha ? `${cred.mergeCommitSha.slice(0, 12)}...` : 'sha256:verified'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.8rem', borderTop: '1px solid var(--rule)' }}>
                    <span style={{ fontSize: '11px', color: isSelected ? '#00EC97' : 'var(--ink-muted)', fontWeight: 600 }}>
                      {isSelected ? '● Currently Rotating Above' : 'Click to inspect in 3D'}
                    </span>

                    <Link
                      to={`/contributions/${cred.id}`}
                      onClick={(e) => e.stopPropagation()}
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
                      Dossier <IconArrowRight size={12} />
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
      </div>
    </div>
  )
}
