import React, { useState } from 'react'

export interface EvidenceRecord {
  isSample: boolean
  contributor: string
  contributorAccount: string
  repo: string
  prNumber: number
  prTitle: string
  mergeCommitSha: string
  mergeTimestamp: string
  diffStats: {
    additions: number
    deletions: number
    filesChanged: number
  }
  schemaVersion: string
  evidenceHash: string
  transactionRef: string
  contractRef: string
  blockHeight: string
  onChainVerificationState: string
}

interface EvidenceInspectorProps {
  evidence: EvidenceRecord
  className?: string
  style?: React.CSSProperties
}

/**
 * SIGNET Evidence Inspector
 * Progressive disclosure component allowing visitors and reviewers to deeply
 * inspect git diffs, commit provenance, protocol audit trails, and cryptographic integrity.
 */
export const EvidenceInspector: React.FC<EvidenceInspectorProps> = ({
  evidence,
  className,
  style,
}) => {
  const [openSection, setOpenSection] = useState<'git' | 'pr' | 'lifecycle' | 'integrity' | 'chain'>('git')

  const toggleSection = (section: 'git' | 'pr' | 'lifecycle' | 'integrity' | 'chain') => {
    setOpenSection(openSection === section ? ('' as any) : section)
  }

  return (
    <div
      className={className}
      style={{
        width: '100%',
        maxWidth: '780px',
        margin: '0 auto',
        backgroundColor: '#FAF3E7',
        border: '1px solid rgba(118, 103, 91, 0.28)',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
        color: '#191715',
        textAlign: 'left',
        ...style,
      }}
      aria-label="Contribution Evidence Inspector"
    >
      {/* Inspector Chrome Bar */}
      <div
        style={{
          backgroundColor: '#191715',
          color: '#EDE2D0',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#B9572B' }} />
          <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Evidence Audit & Integrity Inspector
          </span>
        </div>
        <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'rgba(237, 226, 208, 0.65)' }}>
          Schema v{evidence.schemaVersion}
        </span>
      </div>

      {/* Accordion Container */}
      <div style={{ padding: '1rem 1.5rem' }}>

        {/* ── SECTION 1: Git Object & Commit Provenance ── */}
        <div style={{ borderBottom: '1px solid rgba(118, 103, 91, 0.18)', padding: '12px 0' }}>
          <button
            onClick={() => toggleSection('git')}
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '6px 0',
              textAlign: 'left',
            }}
            aria-expanded={openSection === 'git'}
          >
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#191715' }}>
                1. Git Object & Commit Provenance
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--signet-muted)' }}>
                Inspect commit SHA, tree object, and diff statistics
              </div>
            </div>
            <span style={{ fontSize: '16px', color: '#B9572B', fontWeight: 700 }}>
              {openSection === 'git' ? '−' : '+'}
            </span>
          </button>

          {openSection === 'git' && (
            <div style={{ marginTop: '12px', backgroundColor: '#FFF', borderRadius: '8px', padding: '14px', border: '1px solid rgba(118, 103, 91, 0.15)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--signet-muted)', textTransform: 'uppercase' }}>Merge Commit SHA</span>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 600, color: '#191715', marginTop: '2px' }}>
                    {evidence.mergeCommitSha}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--signet-muted)', textTransform: 'uppercase' }}>Diff Metrics</span>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 600, color: '#2A7D4F', marginTop: '2px' }}>
                    +{evidence.diffStats.additions} lines / -{evidence.diffStats.deletions} lines ({evidence.diffStats.filesChanged} files)
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: '#10100F', color: '#EDE2D0', borderRadius: '6px', padding: '10px 12px', fontFamily: 'var(--font-mono)', fontSize: '11px', lineHeight: 1.5 }}>
                <div style={{ color: 'rgba(237, 226, 208, 0.5)' }}>// Verified git tree reference</div>
                <div>commit: {evidence.mergeCommitSha}</div>
                <div>author: {evidence.contributor}</div>
                <div>date: {evidence.mergeTimestamp}</div>
              </div>
            </div>
          )}
        </div>

        {/* ── SECTION 2: Pull Request Context ── */}
        <div style={{ borderBottom: '1px solid rgba(118, 103, 91, 0.18)', padding: '12px 0' }}>
          <button
            onClick={() => toggleSection('pr')}
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '6px 0',
              textAlign: 'left',
            }}
            aria-expanded={openSection === 'pr'}
          >
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#191715' }}>
                2. Pull Request & Repository Context
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--signet-muted)' }}>
                Target repository, merge state, and discussion references
              </div>
            </div>
            <span style={{ fontSize: '16px', color: '#B9572B', fontWeight: 700 }}>
              {openSection === 'pr' ? '−' : '+'}
            </span>
          </button>

          {openSection === 'pr' && (
            <div style={{ marginTop: '12px', backgroundColor: '#FFF', borderRadius: '8px', padding: '14px', border: '1px solid rgba(118, 103, 91, 0.15)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                <div>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--signet-muted)', textTransform: 'uppercase' }}>Repository</span>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 600, color: '#191715', marginTop: '2px' }}>
                    {evidence.repo}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--signet-muted)', textTransform: 'uppercase' }}>Pull Request ID</span>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 600, color: '#191715', marginTop: '2px' }}>
                    #{evidence.prNumber} — {evidence.prTitle}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── SECTION 3: Protocol Verification Lifecycle ── */}
        <div style={{ borderBottom: '1px solid rgba(118, 103, 91, 0.18)', padding: '12px 0' }}>
          <button
            onClick={() => toggleSection('lifecycle')}
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '6px 0',
              textAlign: 'left',
            }}
            aria-expanded={openSection === 'lifecycle'}
          >
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#191715' }}>
                3. Verification Lifecycle Audit Trail
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--signet-muted)' }}>
                Step-by-step state machine transition audit
              </div>
            </div>
            <span style={{ fontSize: '16px', color: '#B9572B', fontWeight: 700 }}>
              {openSection === 'lifecycle' ? '−' : '+'}
            </span>
          </button>

          {openSection === 'lifecycle' && (
            <div style={{ marginTop: '12px', backgroundColor: '#FFF', borderRadius: '8px', padding: '14px', border: '1px solid rgba(118, 103, 91, 0.15)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px' }}>
                  <span style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#2A7D4F', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 800 }}>✓</span>
                  <span style={{ fontWeight: 600 }}>1. Contribution Discovered:</span>
                  <span style={{ color: 'var(--signet-muted)', fontFamily: 'var(--font-mono)' }}>Merged PR webhook event received</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px' }}>
                  <span style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#2A7D4F', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 800 }}>✓</span>
                  <span style={{ fontWeight: 600 }}>2. Evidence Inspected:</span>
                  <span style={{ color: 'var(--signet-muted)', fontFamily: 'var(--font-mono)' }}>Git tree, author identity & commit SHA verified</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px' }}>
                  <span style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#2A7D4F', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 800 }}>✓</span>
                  <span style={{ fontWeight: 600 }}>3. Credential Synthesized:</span>
                  <span style={{ color: 'var(--signet-muted)', fontFamily: 'var(--font-mono)' }}>Bound to schema v{evidence.schemaVersion}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px' }}>
                  <span style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#B9572B', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 800 }}>○</span>
                  <span style={{ fontWeight: 600 }}>4. Public Inspection Indexed:</span>
                  <span style={{ color: 'var(--signet-muted)', fontFamily: 'var(--font-mono)' }}>Accessible without platform login</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── SECTION 4: Cryptographic & Integrity Proof ── */}
        <div style={{ borderBottom: '1px solid rgba(118, 103, 91, 0.18)', padding: '12px 0' }}>
          <button
            onClick={() => toggleSection('integrity')}
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '6px 0',
              textAlign: 'left',
            }}
            aria-expanded={openSection === 'integrity'}
          >
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#191715' }}>
                4. Cryptographic Integrity & Schema Hashes
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--signet-muted)' }}>
                Evidence checksums, issuer signatures, and schema compliance
              </div>
            </div>
            <span style={{ fontSize: '16px', color: '#B9572B', fontWeight: 700 }}>
              {openSection === 'integrity' ? '−' : '+'}
            </span>
          </button>

          {openSection === 'integrity' && (
            <div style={{ marginTop: '12px', backgroundColor: '#FFF', borderRadius: '8px', padding: '14px', border: '1px solid rgba(118, 103, 91, 0.15)' }}>
              <div style={{ marginBottom: '10px' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--signet-muted)', textTransform: 'uppercase' }}>Evidence Payload Hash</span>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11.5px', color: '#191715', marginTop: '2px', wordBreak: 'break-all' }}>
                  {evidence.evidenceHash}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--signet-muted)', textTransform: 'uppercase' }}>Recipient Identity Vector</span>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#191715', marginTop: '2px' }}>
                  {evidence.contributorAccount}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── SECTION 5: On-Chain Settlement (Mandatory Truth Placeholders) ── */}
        <div style={{ padding: '12px 0' }}>
          <button
            onClick={() => toggleSection('chain')}
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '6px 0',
              textAlign: 'left',
            }}
            aria-expanded={openSection === 'chain'}
          >
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#191715' }}>
                5. On-Chain Settlement & Network Reference
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--signet-muted)' }}>
                NEAR Protocol contract reference and transaction status
              </div>
            </div>
            <span style={{ fontSize: '16px', color: '#B9572B', fontWeight: 700 }}>
              {openSection === 'chain' ? '−' : '+'}
            </span>
          </button>

          {openSection === 'chain' && (
            <div style={{ marginTop: '12px', backgroundColor: '#FFF', borderRadius: '8px', padding: '14px', border: '1px solid rgba(118, 103, 91, 0.15)' }}>
              {evidence.isSample && (
                <div style={{ backgroundColor: 'rgba(185, 87, 43, 0.08)', border: '1px solid rgba(185, 87, 43, 0.25)', borderRadius: '6px', padding: '10px 12px', marginBottom: '12px', fontSize: '11.5px', color: '#B9572B', lineHeight: 1.5 }}>
                  <strong>Product Truth Rule Enforced:</strong> This sample credential displays strictly explicit illustrative placeholders. No fabricated blockchain transactions, false block heights, or counterfeit confirmation hashes are shown.
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
                <div style={{ padding: '8px 10px', backgroundColor: 'rgba(25, 23, 21, 0.03)', borderRadius: '6px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--signet-muted)', textTransform: 'uppercase' }}>Transaction Reference</span>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: '#191715', marginTop: '2px' }}>
                    {evidence.transactionRef}
                  </div>
                </div>

                <div style={{ padding: '8px 10px', backgroundColor: 'rgba(25, 23, 21, 0.03)', borderRadius: '6px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--signet-muted)', textTransform: 'uppercase' }}>Contract Address</span>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: '#191715', marginTop: '2px' }}>
                    {evidence.contractRef}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div style={{ padding: '8px 10px', backgroundColor: 'rgba(25, 23, 21, 0.03)', borderRadius: '6px' }}>
                    <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--signet-muted)', textTransform: 'uppercase' }}>Block Height</span>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: '#191715', marginTop: '2px' }}>
                      {evidence.blockHeight}
                    </div>
                  </div>

                  <div style={{ padding: '8px 10px', backgroundColor: 'rgba(25, 23, 21, 0.03)', borderRadius: '6px' }}>
                    <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--signet-muted)', textTransform: 'uppercase' }}>On-Chain Verification State</span>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: '#B9572B', marginTop: '2px' }}>
                      {evidence.onChainVerificationState}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default EvidenceInspector
