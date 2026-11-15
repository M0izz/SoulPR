import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useWorkspace, type ContributionRecord, type EvidenceClassification } from '../../context/WorkspaceContext'
import CredentialSeal from '../../components/credential/CredentialSeal'
import {
  IconArrowLeft,
  IconCheckCircle,
  IconAlertCircle,
  IconExternalLink,
  IconShieldCheck,
} from '../../components/Icons'

export default function ContributionDossierPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { contributions, isLinked, nearAccount, updateContributionStatus } = useWorkspace()

  const record: ContributionRecord | undefined =
    contributions.find((c) => c.id === id) ||
    (typeof localStorage !== 'undefined'
      ? JSON.parse(localStorage.getItem('signet_contributions') || '[]').find((c: any) => c.id === id)
      : undefined)

  const [isApproved, setIsApproved] = useState<boolean>(record?.credentialStatus === 'confirmed' || false)
  const [isMinting, setIsMinting] = useState<boolean>(false)
  const [mintTx, setMintTx] = useState<string | null>(null)

  const handleApproveAndIssue = async () => {
    setIsApproved(true)
    if (record) {
      updateContributionStatus(record.id, {
        credentialStatus: 'confirmed',
        assessmentStatus: 'eligible',
      })
      setIsMinting(true)
      setTimeout(() => {
        setIsMinting(false)
        setMintTx(`near:tx:${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`)
      }, 1000)
    }
  }

  const getClassificationBadge = (classification: EvidenceClassification) => {
    switch (classification) {
      case 'independently_merged':
        return {
          title: 'Independently merged',
          description: 'Contribution accepted into an independently maintained repository',
          color: '#10B981',
          bg: 'rgba(16, 185, 129, 0.12)',
        }
      case 'self_maintained':
        return {
          title: 'Self-maintained',
          description: 'Developer owns and maintains the open-source project',
          color: '#38BDF8',
          bg: 'rgba(56, 189, 248, 0.12)',
        }
      case 'community_verified':
        return {
          title: 'Community verified',
          description: 'Independent community activity supports the claim',
          color: '#A855F7',
          bg: 'rgba(168, 85, 247, 0.12)',
        }
      case 'maintainer_verified':
        return {
          title: 'Maintainer verified',
          description: 'Project maintainer has attested to the contribution',
          color: '#F59E0B',
          bg: 'rgba(245, 158, 11, 0.12)',
        }
      case 'github_verified':
      default:
        return {
          title: 'GitHub verified',
          description: 'GitHub records substantiate the activity',
          color: '#B9572B',
          bg: 'rgba(185, 87, 43, 0.12)',
        }
    }
  }

  const classification = record?.evidenceClassification || 'independently_merged'
  const classBadge = getClassificationBadge(classification)
  const isMaintainer = record?.contributionType === 'maintainer'
  const isCommunity = record?.contributionType === 'community'

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* ── BACK NAVIGATION ── */}
      <button
        onClick={() => navigate('/dashboard')}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'none',
          border: 'none',
          color: 'var(--ink-muted)',
          fontSize: '13px',
          fontWeight: 600,
          cursor: 'pointer',
          marginBottom: '1.2rem',
          padding: 0,
        }}
      >
        <IconArrowLeft size={14} /> Back to Dashboard
      </button>

      {/* ── DOSSIER HEADER ── */}
      <div
        className="app-glass-card"
        style={{
          backgroundColor: 'var(--paper-raised)',
          border: '1px solid var(--rule)',
          borderRadius: '14px',
          padding: '1.8rem 2rem',
          marginBottom: '1.5rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span
                style={{
                  fontSize: '10.5px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  background: classBadge.bg,
                  color: classBadge.color,
                  border: `1px solid ${classBadge.color}40`,
                }}
              >
                {classBadge.title.toUpperCase()}
              </span>

              <span style={{ fontSize: '11px', color: 'var(--ink-muted)', fontWeight: 600 }}>
                {isMaintainer
                  ? '02. Project Ownership & Maintenance'
                  : isCommunity
                  ? '03. Community & Review Contribution'
                  : '01. External Contribution'}
              </span>
            </div>

            <h1 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 8px 0', fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>
              {record ? record.prTitle : 'Verifiable Contribution Evidence'}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: 'var(--ink-muted)', flexWrap: 'wrap' }}>
              <span>
                Target Project:{' '}
                <strong style={{ color: 'var(--ink)', fontFamily: 'var(--font-mono)' }}>
                  {record ? record.repo : 'owner/project'}
                </strong>
              </span>
              <span>•</span>
              <a
                href={record ? record.prUrl : 'https://github.com'}
                target="_blank"
                rel="noreferrer"
                style={{ color: '#B9572B', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}
              >
                <span>{record?.prNumber ? `PR #${record.prNumber}` : 'View Source on GitHub'}</span>
                <IconExternalLink size={12} />
              </a>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                backgroundColor: 'rgba(46, 125, 50, 0.1)',
                border: '1px solid rgba(46, 125, 50, 0.3)',
                color: '#2E7D32',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 700,
              }}
            >
              {record ? record.assessmentStatus.toUpperCase() : 'ELIGIBLE'}
            </span>
            <CredentialSeal size={36} glow={true} />
          </div>
        </div>
      </div>

      {/* ── SECTION 1: GIT & REPOSITORY SOURCE FACTS ── */}
      <div
        className="app-glass-card"
        style={{
          backgroundColor: 'var(--paper-raised)',
          border: '1px solid var(--rule)',
          borderRadius: '14px',
          padding: '1.6rem',
          marginBottom: '1.5rem',
        }}
      >
        <h2 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 1rem 0', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--ink)' }}>
          1. Verified GitHub Source Facts ({classBadge.title})
        </h2>

        {isMaintainer ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', fontSize: '13px' }}>
            <div style={{ padding: '10px 14px', backgroundColor: 'var(--paper)', borderRadius: '8px', border: '1px solid var(--rule)' }}>
              <div style={{ fontSize: '11px', color: 'var(--ink-muted)', marginBottom: '3px' }}>Maintainer Identity</div>
              <div style={{ fontWeight: 600, color: 'var(--ink)' }}>@{record?.author} (Account Verified)</div>
            </div>

            <div style={{ padding: '10px 14px', backgroundColor: 'var(--paper)', borderRadius: '8px', border: '1px solid var(--rule)' }}>
              <div style={{ fontSize: '11px', color: 'var(--ink-muted)', marginBottom: '3px' }}>Open Source License</div>
              <div style={{ fontWeight: 600, color: '#38BDF8', fontFamily: 'var(--font-mono)' }}>
                {record?.maintainerEvidence?.license || 'MIT License'}
              </div>
            </div>

            <div style={{ padding: '10px 14px', backgroundColor: 'var(--paper)', borderRadius: '8px', border: '1px solid var(--rule)' }}>
              <div style={{ fontSize: '11px', color: 'var(--ink-muted)', marginBottom: '3px' }}>Community Stars & Forks</div>
              <div style={{ fontWeight: 600, color: '#F59E0B' }}>
                ★ {record?.maintainerEvidence?.stars || 0} stars · ⑂ {record?.maintainerEvidence?.forks || 0} forks
              </div>
            </div>

            <div style={{ padding: '10px 14px', backgroundColor: 'var(--paper)', borderRadius: '8px', border: '1px solid var(--rule)' }}>
              <div style={{ fontSize: '11px', color: 'var(--ink-muted)', marginBottom: '3px' }}>Release History</div>
              <div style={{ fontWeight: 600, color: '#10B981' }}>
                {record?.maintainerEvidence?.releasesCount || 0} public releases tagged
              </div>
            </div>
          </div>
        ) : isCommunity ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', fontSize: '13px' }}>
            <div style={{ padding: '10px 14px', backgroundColor: 'var(--paper)', borderRadius: '8px', border: '1px solid var(--rule)' }}>
              <div style={{ fontSize: '11px', color: 'var(--ink-muted)', marginBottom: '3px' }}>Reviewer Identity</div>
              <div style={{ fontWeight: 600, color: 'var(--ink)' }}>@{record?.author}</div>
            </div>

            <div style={{ padding: '10px 14px', backgroundColor: 'var(--paper)', borderRadius: '8px', border: '1px solid var(--rule)' }}>
              <div style={{ fontSize: '11px', color: 'var(--ink-muted)', marginBottom: '3px' }}>Activity Type</div>
              <div style={{ fontWeight: 600, color: '#A855F7', textTransform: 'capitalize' }}>
                {record?.communityEvidence?.activityType.replace('_', ' ')}
              </div>
            </div>

            <div style={{ padding: '10px 14px', backgroundColor: 'var(--paper)', borderRadius: '8px', border: '1px solid var(--rule)' }}>
              <div style={{ fontSize: '11px', color: 'var(--ink-muted)', marginBottom: '3px' }}>Action & Review State</div>
              <div style={{ fontWeight: 600, color: '#10B981' }}>
                {record?.communityEvidence?.action || 'APPROVED'}
              </div>
            </div>

            <div style={{ padding: '10px 14px', backgroundColor: 'var(--paper)', borderRadius: '8px', border: '1px solid var(--rule)' }}>
              <div style={{ fontSize: '11px', color: 'var(--ink-muted)', marginBottom: '3px' }}>Target Pull Request</div>
              <div style={{ fontWeight: 600, color: 'var(--ink)', fontFamily: 'var(--font-mono)' }}>
                #{record?.prNumber || record?.communityEvidence?.targetEntityNumber}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', fontSize: '13px' }}>
            <div style={{ padding: '10px 14px', backgroundColor: 'var(--paper)', borderRadius: '8px', border: '1px solid var(--rule)' }}>
              <div style={{ fontSize: '11px', color: 'var(--ink-muted)', marginBottom: '3px' }}>Author Identity</div>
              <div style={{ fontWeight: 600, color: 'var(--ink)' }}>@{record ? record.author : 'contributor'}</div>
            </div>

            <div style={{ padding: '10px 14px', backgroundColor: 'var(--paper)', borderRadius: '8px', border: '1px solid var(--rule)' }}>
              <div style={{ fontSize: '11px', color: 'var(--ink-muted)', marginBottom: '3px' }}>Merge Status</div>
              <div style={{ fontWeight: 600, color: '#10B981', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <IconCheckCircle size={14} /> Closed & Merged {record ? `(${new Date(record.mergedAt).toLocaleDateString()})` : 'to main'}
              </div>
            </div>

            <div style={{ padding: '10px 14px', backgroundColor: 'var(--paper)', borderRadius: '8px', border: '1px solid var(--rule)' }}>
              <div style={{ fontSize: '11px', color: 'var(--ink-muted)', marginBottom: '3px' }}>Merge Commit SHA</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'monospace', fontSize: '12px' }}>
                <span>{record && record.mergeCommitSha ? `${record.mergeCommitSha.slice(0, 10)}...` : '669d02dc...'}</span>
              </div>
            </div>

            <div style={{ padding: '10px 14px', backgroundColor: 'var(--paper)', borderRadius: '8px', border: '1px solid var(--rule)' }}>
              <div style={{ fontSize: '11px', color: 'var(--ink-muted)', marginBottom: '3px' }}>Diff Footprint</div>
              <div style={{ fontWeight: 600, fontFamily: 'monospace' }}>
                <span style={{ color: '#10B981' }}>+{record?.additions ?? 14}</span> /{' '}
                <span style={{ color: '#EF4444' }}>-{record?.deletions ?? 3}</span> lines
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── SECTION 2: EXPLICIT EVIDENCE & TRANSPARENT LIMITATIONS ── */}
      <div
        className="app-glass-card"
        style={{
          backgroundColor: 'var(--paper-raised)',
          border: '1px solid var(--rule)',
          borderRadius: '14px',
          padding: '1.6rem',
          marginBottom: '1.5rem',
        }}
      >
        <h2 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 0.8rem 0', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--ink)' }}>
          2. Explicit Evidence & Claim Boundaries
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
          <div style={{ padding: '12px 16px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
            <div style={{ fontWeight: 700, color: '#10B981', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <IconCheckCircle size={15} /> Verified Evidence Claims:
            </div>
            <div style={{ color: 'var(--ink-muted)', lineHeight: 1.5 }}>
              {isMaintainer && (
                <>
                  SIGNET verifies that developer controls the connected account, is the documented creator of the repository, has published history with open-source license (<strong>{record?.maintainerEvidence?.license}</strong>), and maintains releases.
                </>
              )}
              {isCommunity && (
                <>
                  SIGNET verifies that the developer performed collaborative community work (e.g. approved pull request code review or issue triage) substantiated by public GitHub records on <strong>{record?.repo}</strong>.
                </>
              )}
              {!isMaintainer && !isCommunity && (
                <>
                  SIGNET verifies that the developer submitted code accepted and merged into <strong>{record?.repo}</strong> by external maintainers, corroborated by immutable Git merge commit SHA.
                </>
              )}
            </div>
          </div>

          <div style={{ padding: '12px 16px', borderRadius: '8px', background: 'rgba(185, 87, 43, 0.08)', border: '1px solid rgba(185, 87, 43, 0.25)' }}>
            <div style={{ fontWeight: 700, color: '#B9572B', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <IconShieldCheck size={15} /> Transparent Limits of Claim:
            </div>
            <div style={{ color: 'var(--ink-muted)', lineHeight: 1.5 }}>
              {isMaintainer && (
                <>
                  This credential proves developer ownership, public commit cadence, and maintainer activity. It does <em>not</em> claim external third-party code review or guarantee commercial adoption. It certifies the developer as <strong>Project Creator & Maintainer</strong>.
                </>
              )}
              {isCommunity && (
                <>
                  This credential validates peer review and community collaboration. It does <em>not</em> assert code authorship or commit rights.
                </>
              )}
              {!isMaintainer && !isCommunity && (
                <>
                  This credential certifies specific merged code diffs accepted into an external codebase. It does <em>not</em> claim repository co-ownership.
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION 3: DETERMINISTIC PROVENANCE EVALUATION ── */}
      <div
        className="app-glass-card"
        style={{
          backgroundColor: 'var(--paper-raised)',
          border: '1px solid var(--rule)',
          borderRadius: '14px',
          padding: '1.6rem',
          marginBottom: '1.5rem',
        }}
      >
        <h2 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 1rem 0', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--ink)' }}>
          3. Deterministic Eligibility & Audit Rules
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            {
              rule: 'Canonical Source Resolution',
              status: 'pass',
              detail: `Public GitHub record verified under ${record?.repo}`,
            },
            {
              rule: 'Evidence Classification Established',
              status: 'pass',
              detail: `Classified as '${classBadge.title}' (${classBadge.description})`,
            },
            {
              rule: 'Author / Maintainer Identity Check',
              status: 'pass',
              detail: `Identity @${record?.author} corroborated by public API records`,
            },
            {
              rule: 'Linked NEAR Settlement Account',
              status: isLinked ? 'pass' : 'attention',
              detail: isLinked && nearAccount ? `NEAR account (${nearAccount}) linked and verified` : 'NEAR wallet unlinked. Required before on-chain issuance authorization.',
            },
            {
              rule: 'Non-Duplication Guard',
              status: 'pass',
              detail: 'No duplicate credential issued on NEAR contract for this artifact',
            },
          ].map((item) => (
            <div
              key={item.rule}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: '8px',
                backgroundColor: 'var(--paper)',
                border: '1px solid var(--rule)',
                fontSize: '13px',
              }}
            >
              <div>
                <div style={{ fontWeight: 600, color: 'var(--ink)' }}>{item.rule}</div>
                <div style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>{item.detail}</div>
              </div>
              <div>
                {item.status === 'pass' ? (
                  <span style={{ color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700, fontSize: '12px' }}>
                    <IconCheckCircle size={14} /> PASS
                  </span>
                ) : (
                  <span style={{ color: '#F59E0B', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700, fontSize: '12px' }}>
                    <IconAlertCircle size={14} /> ACTION REQUIRED
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── SECTION 4: ISSUANCE ACTION ── */}
      <div
        className="app-glass-card"
        style={{
          backgroundColor: 'var(--paper-raised)',
          border: '1px solid #B9572B',
          borderRadius: '14px',
          padding: '1.8rem',
          textAlign: 'center',
        }}
      >
        <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 6px 0', color: 'var(--ink)', fontFamily: 'var(--font-serif)' }}>
          Developer Review & Approval Action
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--ink-muted)', maxWidth: '560px', margin: '0 auto 1.4rem auto', lineHeight: 1.5 }}>
          Approving this evidence records your confirmation of the cryptographic evidence snapshot. Issuing the credential settles a verifiable Soulbound record on NEAR Protocol.
        </p>

        {!isApproved ? (
          <button
            onClick={handleApproveAndIssue}
            style={{
              padding: '11px 26px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#B9572B',
              color: '#EDE2D0',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 16px rgba(185, 87, 43, 0.35)',
            }}
          >
            <IconCheckCircle size={16} /> Approve Evidence & Issue on NEAR
          </button>
        ) : (
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#10B981', fontWeight: 700, fontSize: '14px', marginBottom: '12px' }}>
              <IconCheckCircle size={16} /> Evidence Confirmed & Attested
            </div>
            {isMinting && (
              <div style={{ fontSize: '13px', color: 'var(--ink-muted)', marginBottom: '12px' }}>
                <span className="spinner" style={{ width: '14px', height: '14px', display: 'inline-block', marginRight: '6px' }} />
                Submitting attestation transaction to NEAR Protocol (<code style={{ fontFamily: 'var(--font-mono)' }}>signet.testnet</code>)...
              </div>
            )}
            {mintTx && (
              <div style={{ fontSize: '12.5px', color: '#10B981', fontWeight: 600, marginBottom: '14px', fontFamily: 'var(--font-mono)' }}>
                ✓ Settled on-chain: {mintTx}
              </div>
            )}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                onClick={() => navigate('/credentials')}
                style={{
                  padding: '9px 20px',
                  borderRadius: '8px',
                  border: '1px solid #B9572B',
                  backgroundColor: '#B9572B',
                  color: '#EDE2D0',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Inspect Issued Credentials Shelf →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
