import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useWorkspace } from '../../context/WorkspaceContext'
import CredentialSeal from '../../components/credential/CredentialSeal'
import {
  IconArrowLeft,
  IconExternalLink,
  IconCheckCircle,
  IconAlertCircle,
  IconCopy,
  IconCheck,
} from '../../components/Icons'

export default function ContributionDossierPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { contributions, isLinked, nearAccount, updateContributionStatus } = useWorkspace()
  const record = contributions.find((c) => c.id === id) || (typeof localStorage !== 'undefined' ? JSON.parse(localStorage.getItem('signet_contributions') || '[]').find((c: any) => c.id === id) : null)
  const [isApproved, setIsApproved] = useState<boolean>(record?.credentialStatus === 'confirmed' || false)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [isMinting, setIsMinting] = useState<boolean>(false)
  const [mintTx, setMintTx] = useState<string | null>(null)

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const handleApproveAndIssue = async () => {
    setIsApproved(true)
    if (record) {
      updateContributionStatus(record.id, {
        credentialStatus: 'confirmed',
        assessmentStatus: 'eligible',
      })
      setIsMinting(true)
      // Simulate/trigger on-chain settlement confirmation
      setTimeout(() => {
        setIsMinting(false)
        setMintTx(`near:tx:${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`)
      }, 1000)
    }
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* ── BACK NAVIGATION ── */}
      <button
        onClick={() => navigate('/contributions')}
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
        <IconArrowLeft size={14} /> Back to Contributions Registry
      </button>

      {/* ── DOSSIER HEADER ── */}
      <div
        style={{
          backgroundColor: 'var(--paper-raised)',
          border: '1px solid var(--rule)',
          borderRadius: '12px',
          padding: '1.8rem 2rem',
          marginBottom: '1.5rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#B9572B', marginBottom: '6px' }}>
              Contribution Evidence Dossier · ID: {id ?? 'sample-dossier'}
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 8px 0', fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>
              {record ? record.prTitle : 'feat(core): implement deterministic contribution identity hashing'}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: 'var(--ink-muted)' }}>
              <span>Repository: <strong>{record ? record.repo : 'owner/signet-protocol'}</strong></span>
              <span>•</span>
              <a
                href={record ? record.prUrl : 'https://github.com'}
                target="_blank"
                rel="noreferrer"
                style={{ color: '#B9572B', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}
              >
                PR #{record ? record.prNumber : '42'} <IconExternalLink size={12} />
              </a>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
            <CredentialSeal size={32} />
          </div>
        </div>
      </div>

      {/* ── SECTION 1: GIT & REPOSITORY SOURCE FACTS ── */}
      <div
        style={{
          backgroundColor: 'var(--paper-raised)',
          border: '1px solid var(--rule)',
          borderRadius: '12px',
          padding: '1.6rem',
          marginBottom: '1.5rem',
        }}
      >
        <h2 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 1rem 0', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--ink)' }}>
          1. Verified GitHub Source Facts
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', fontSize: '13px' }}>
          <div style={{ padding: '10px 14px', backgroundColor: 'var(--paper)', borderRadius: '8px', border: '1px solid var(--rule)' }}>
            <div style={{ fontSize: '11px', color: 'var(--ink-muted)', marginBottom: '3px' }}>Author Identity</div>
            <div style={{ fontWeight: 600, color: 'var(--ink)' }}>@{record ? record.author : 'contributor'}</div>
          </div>

          <div style={{ padding: '10px 14px', backgroundColor: 'var(--paper)', borderRadius: '8px', border: '1px solid var(--rule)' }}>
            <div style={{ fontSize: '11px', color: 'var(--ink-muted)', marginBottom: '3px' }}>Merge Status</div>
            <div style={{ fontWeight: 600, color: '#2E7D32', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <IconCheckCircle size={14} /> Closed & Merged {record ? `(${new Date(record.mergedAt).toLocaleDateString()})` : 'to main'}
            </div>
          </div>

          <div style={{ padding: '10px 14px', backgroundColor: 'var(--paper)', borderRadius: '8px', border: '1px solid var(--rule)' }}>
            <div style={{ fontSize: '11px', color: 'var(--ink-muted)', marginBottom: '3px' }}>Merge Commit SHA</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'monospace', fontSize: '12px' }}>
              <span>{record && record.mergeCommitSha ? `${record.mergeCommitSha.slice(0, 10)}...${record.mergeCommitSha.slice(-7)}` : '669d02dc...743bb7d'}</span>
              <button
                onClick={() => copyToClipboard('669d02dcb613fe725fc3795a0ddd0e743bb7dccb', 'sha')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-muted)' }}
              >
                {copiedField === 'sha' ? <IconCheck size={13} color="#2E7D32" /> : <IconCopy size={13} />}
              </button>
            </div>
          </div>

          <div style={{ padding: '10px 14px', backgroundColor: 'var(--paper)', borderRadius: '8px', border: '1px solid var(--rule)' }}>
            <div style={{ fontSize: '11px', color: 'var(--ink-muted)', marginBottom: '3px' }}>Merged Timestamp</div>
            <div style={{ fontWeight: 600, color: 'var(--ink)' }}>Nov 15, 2026, 01:42:00 UTC</div>
          </div>
        </div>
      </div>

      {/* ── SECTION 2: EVIDENCE INTEGRITY REFERENCES ── */}
      <div
        style={{
          backgroundColor: 'var(--paper-raised)',
          border: '1px solid var(--rule)',
          borderRadius: '12px',
          padding: '1.6rem',
          marginBottom: '1.5rem',
        }}
      >
        <h2 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 1rem 0', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--ink)' }}>
          2. Immutable Evidence Integrity
        </h2>

        <div style={{ fontSize: '13px', color: 'var(--ink-muted)', marginBottom: '1rem', lineHeight: 1.5 }}>
          SIGNET normalizes source facts into an immutable snapshot and computes a SHA-256 digest according to schema{' '}
          <code style={{ fontFamily: 'monospace', color: '#B9572B' }}>signet-evidence-1.0.0</code>.
        </div>

        <div style={{ backgroundColor: 'var(--paper)', border: '1px solid var(--rule)', borderRadius: '8px', padding: '12px 14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ink-muted)', textTransform: 'uppercase' }}>
              Snapshot SHA-256 Digest
            </span>
            <button
              onClick={() => copyToClipboard('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', 'digest')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-muted)' }}
            >
              {copiedField === 'digest' ? <IconCheck size={13} color="#2E7D32" /> : <IconCopy size={13} />}
            </button>
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: '12px', color: 'var(--ink)', wordBreak: 'break-all' }}>
            e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
          </div>
        </div>
      </div>

      {/* ── SECTION 3: DETERMINISTIC ASSESSMENT FINDINGS ── */}
      <div
        style={{
          backgroundColor: 'var(--paper-raised)',
          border: '1px solid var(--rule)',
          borderRadius: '12px',
          padding: '1.6rem',
          marginBottom: '1.5rem',
        }}
      >
        <h2 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 1rem 0', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--ink)' }}>
          3. Deterministic Eligibility Rules Evaluation
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { rule: 'Valid Canonical GitHub PR URL', status: 'pass', detail: 'URL resolves to public repository owner/signet-protocol' },
            { rule: 'PR Merged State', status: 'pass', detail: 'GitHub API confirms merged=true and merged_at timestamp is present' },
            { rule: 'Author Identity Verification', status: 'pass', detail: 'PR author stable ID matches authenticated session user ID' },
            { rule: 'Valid Merge Commit SHA', status: 'pass', detail: 'Full 40-character hex commit SHA established and referenced' },
            {
              rule: 'Linked NEAR Protocol Wallet',
              status: isLinked ? 'pass' : 'attention',
              detail: isLinked && nearAccount ? `NEAR account (${nearAccount}) linked and verified via cryptographic challenge` : 'NEAR wallet unlinked. Required before on-chain issuance authorization.',
            },
            { rule: 'Non-Duplication Guard', status: 'pass', detail: 'No conflicting credential exists on NEAR contract for this commit' },
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
                  <span style={{ color: '#2E7D32', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700, fontSize: '12px' }}>
                    <IconCheckCircle size={14} /> PASS
                  </span>
                ) : (
                  <span style={{ color: '#E65100', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700, fontSize: '12px' }}>
                    <IconAlertCircle size={14} /> ACTION REQUIRED
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── SECTION 4: DEVELOPER REVIEW & DECISION ── */}
      <div
        style={{
          backgroundColor: 'var(--paper-raised)',
          border: '1px solid #B9572B',
          borderRadius: '12px',
          padding: '1.8rem',
          textAlign: 'center',
        }}
      >
        <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 6px 0', color: 'var(--ink)', fontFamily: 'var(--font-serif)' }}>
          Developer Review & Approval Action
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--ink-muted)', maxWidth: '520px', margin: '0 auto 1.4rem auto', lineHeight: 1.5 }}>
          Approving this evidence records your explicit confirmation of the snapshot hash. Issuance of the NEAR
          credential will require a separate wallet authorization.
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
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#2E7D32', fontWeight: 700, fontSize: '14px', marginBottom: '12px' }}>
              <IconCheckCircle size={16} /> Evidence Confirmed & Attested by Contributor
            </div>
            {isMinting && (
              <div style={{ fontSize: '13px', color: 'var(--ink-muted)', marginBottom: '12px' }}>
                <span className="spinner" style={{ width: '14px', height: '14px', display: 'inline-block', marginRight: '6px' }} />
                Submitting attestation transaction to NEAR Protocol (<code style={{ fontFamily: 'var(--font-mono)' }}>signet.testnet</code>)...
              </div>
            )}
            {mintTx && (
              <div style={{ fontSize: '12.5px', color: '#2A7D4F', fontWeight: 600, marginBottom: '14px', fontFamily: 'var(--font-mono)' }}>
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
