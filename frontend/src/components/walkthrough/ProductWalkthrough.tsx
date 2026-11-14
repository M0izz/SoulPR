import React, { useState } from 'react'

interface WalkthroughStage {
  id: number
  title: string
  subtitle: string
  statusTag: 'Live Capability' | 'Protocol Capability (Staged)'
  statusColor: string
  truthNote: string
  description: string
  interfaceContent: React.ReactNode
}

export const ProductWalkthrough: React.FC = () => {
  const [activeStage, setActiveStage] = useState(1)

  const stages: WalkthroughStage[] = [
    {
      id: 1,
      title: '1. Connect GitHub',
      subtitle: 'Identity Authorization',
      statusTag: 'Live Capability',
      statusColor: '#2A7D4F',
      truthNote: 'Sign-in authenticates contributor identity; contribution access scopes are requested separately.',
      description:
        'A developer connects their GitHub account. SIGNET validates the contributor handle and permissions without requiring invasive repository write access.',
      interfaceContent: (
        <div style={{ padding: '1.6rem', textAlign: 'left', color: '#191715' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem', paddingBottom: '12px', borderBottom: '1px solid rgba(118, 103, 91, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#191715', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontWeight: 700, fontSize: '13px' }}>
                GH
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '13px' }}>GitHub Contributor Authorization</div>
                <div style={{ fontSize: '11px', color: 'var(--signet-muted)' }}>OAuth Scope: read:user (identity validation only)</div>
              </div>
            </div>
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#2A7D4F', backgroundColor: 'rgba(42, 125, 79, 0.1)', padding: '4px 10px', borderRadius: '99px' }}>
              Connected ✓
            </span>
          </div>

          <div style={{ backgroundColor: 'rgba(25, 23, 21, 0.03)', borderRadius: '8px', padding: '14px', marginBottom: '1rem', border: '1px solid rgba(118, 103, 91, 0.15)' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--signet-muted)', marginBottom: '4px' }}>CONNECTED IDENTITY</div>
            <div style={{ fontSize: '15px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>@alex-dev</div>
            <div style={{ fontSize: '11.5px', color: 'var(--signet-muted)', marginTop: '4px' }}>Public contributions discoverable across tracked repositories</div>
          </div>

          <div style={{ fontSize: '11px', color: 'var(--signet-muted)', fontStyle: 'italic' }}>
            Note: Authentication verifies username ownership. It does not grant arbitrary repository access.
          </div>
        </div>
      ),
    },
    {
      id: 2,
      title: '2. Discover Contribution',
      subtitle: 'Merged Pull Request Event',
      statusTag: 'Live Capability',
      statusColor: '#2A7D4F',
      truthNote: 'Only merged pull requests with valid author identity are eligible for credentialing.',
      description:
        'SIGNET scans tracked repositories for closed and merged pull requests. Eligible contributions are surfaced with their exact repository context.',
      interfaceContent: (
        <div style={{ padding: '1.6rem', textAlign: 'left', color: '#191715' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--signet-muted)', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.06em' }}>
            Discovered Eligible Contributions (Sample View)
          </div>

          <div style={{ border: '1px solid rgba(118, 103, 91, 0.25)', borderRadius: '10px', padding: '14px', backgroundColor: '#FFF', marginBottom: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 600, color: '#B9572B' }}>
                near/core-contracts · PR #408
              </span>
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#2A7D4F', backgroundColor: 'rgba(42, 125, 79, 0.1)', padding: '3px 8px', borderRadius: '4px' }}>
                MERGED
              </span>
            </div>
            <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '6px' }}>
              Implement non-transferable credential registry
            </div>
            <div style={{ fontSize: '11px', color: 'var(--signet-muted)', fontFamily: 'var(--font-mono)' }}>
              Merged by maintainer on 2026-11-14 · Commit: 7f8a91c
            </div>
          </div>

          <div style={{ fontSize: '11px', color: 'var(--signet-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#2A7D4F' }} />
            Eligible for evidence inspection and credential synthesis
          </div>
        </div>
      ),
    },
    {
      id: 3,
      title: '3. Inspect Evidence',
      subtitle: 'Source Record Inspection',
      statusTag: 'Live Capability',
      statusColor: '#2A7D4F',
      truthNote: 'Demonstrates source git diffs, commit hashes, and maintainer merge signatures.',
      description:
        'Before any credential is generated, the underlying git records, author signatures, commit SHAs, and diff metrics are inspected for structural integrity.',
      interfaceContent: (
        <div style={{ padding: '1.6rem', textAlign: 'left', color: '#191715' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#B9572B', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.06em' }}>
            Source Evidence Audit (PR #408)
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
            <div style={{ backgroundColor: 'rgba(25, 23, 21, 0.04)', padding: '10px', borderRadius: '6px', border: '1px solid rgba(118, 103, 91, 0.15)' }}>
              <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--signet-muted)' }}>MERGE COMMIT SHA</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11.5px', fontWeight: 600 }}>7f8a91c0e4b82d</div>
            </div>
            <div style={{ backgroundColor: 'rgba(25, 23, 21, 0.04)', padding: '10px', borderRadius: '6px', border: '1px solid rgba(118, 103, 91, 0.15)' }}>
              <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--signet-muted)' }}>DIFF METRICS</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11.5px', fontWeight: 600, color: '#2A7D4F' }}>+342 lines / -18 lines</div>
            </div>
          </div>

          <div style={{ backgroundColor: '#10100F', color: '#EDE2D0', borderRadius: '8px', padding: '10px 12px', fontFamily: 'var(--font-mono)', fontSize: '11px', lineHeight: 1.5 }}>
            <div style={{ color: 'rgba(237, 226, 208, 0.5)' }}>// Evidence integrity checksum</div>
            <div>evidence_hash: sha256:d8a2...3f1c</div>
            <div style={{ color: '#2A7D4F' }}>✓ Git tree verification passed</div>
          </div>
        </div>
      ),
    },
    {
      id: 4,
      title: '4. Issue Credential',
      subtitle: 'Protocol Attestation',
      statusTag: 'Protocol Capability (Staged)',
      statusColor: '#B9572B',
      truthNote: 'Protocol synthesis packages inspectable records into a structured SIGNET schema credential.',
      description:
        'When requirements are met, SIGNET mints an unalterable credential. The record binds contributor, repository context, and evidence hashes into a permanent record.',
      interfaceContent: (
        <div style={{ padding: '1.6rem', textAlign: 'left', color: '#191715' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#B9572B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Credential Synthesis
            </div>
            <span style={{ fontSize: '9px', fontWeight: 800, color: '#B9572B', backgroundColor: 'rgba(185, 87, 43, 0.1)', padding: '3px 8px', borderRadius: '4px' }}>
              SCHEMA V1.0.0
            </span>
          </div>

          <div style={{ backgroundColor: '#FAF3E7', border: '1px solid rgba(185, 87, 43, 0.3)', borderRadius: '10px', padding: '14px', marginBottom: '12px' }}>
            <div style={{ fontSize: '10px', color: 'var(--signet-muted)', fontFamily: 'var(--font-mono)', marginBottom: '3px' }}>
              CREDENTIAL ID: SGT-2026-08492-NEAR
            </div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '16px', fontWeight: 600, color: '#191715' }}>
              Non-Transferable Contribution Credential
            </div>
            <div style={{ fontSize: '11px', color: 'var(--signet-muted)', marginTop: '4px' }}>
              Recipient: alex-dev.near · Issuer: SIGNET Protocol Registry
            </div>
          </div>

          <div style={{ fontSize: '11px', color: 'var(--signet-muted)', fontStyle: 'italic' }}>
            Status: Staged for NEAR Protocol settlement. Permanent & non-transferable.
          </div>
        </div>
      ),
    },
    {
      id: 5,
      title: '5. Independently Inspect',
      subtitle: 'Public Verification',
      statusTag: 'Live Capability',
      statusColor: '#2A7D4F',
      truthNote: 'Any reviewer can verify the contribution evidence directly on /verify/sample without logging in.',
      description:
        'A recruiter, maintainer, or reviewer accesses the credential via its public identifier. All source evidence, commit hashes, and verification lifecycle states are inspectable.',
      interfaceContent: (
        <div style={{ padding: '1.6rem', textAlign: 'left', color: '#191715' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#2A7D4F', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.06em' }}>
            Independent Public Verification View
          </div>

          <div style={{ backgroundColor: '#10100F', color: '#EDE2D0', borderRadius: '8px', padding: '12px 14px', marginBottom: '12px' }}>
            <div style={{ fontSize: '10px', color: '#B9572B', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
              PUBLIC ROUTE: /verify/sample
            </div>
            <div style={{ fontSize: '13px', fontWeight: 600 }}>Zero Login Required for Reviewers</div>
            <div style={{ fontSize: '11px', color: 'rgba(237, 226, 208, 0.65)', marginTop: '4px' }}>
              Reviewers inspect source commits, diff metrics, and integrity signatures without trusting self-reported claims.
            </div>
          </div>

          <a
            href="/verify/sample"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12.5px',
              fontWeight: 700,
              color: '#B9572B',
              textDecoration: 'none',
            }}
          >
            Launch illustrative credential inspection →
          </a>
        </div>
      ),
    },
  ]

  const current = stages.find((s) => s.id === activeStage) || stages[0]

  return (
    <section
      id="walkthrough"
      style={{
        backgroundColor: '#F3E8D5',
        color: '#191715',
        padding: '6rem 2rem 6.5rem',
        borderTop: '1px solid rgba(118, 103, 91, 0.22)',
        borderBottom: '1px solid rgba(118, 103, 91, 0.22)',
      }}
      aria-labelledby="walkthrough-headline"
    >
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span
            style={{
              fontSize: '10.5px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: '#B9572B',
              display: 'block',
              marginBottom: '8px',
            }}
          >
            Interactive Product Walkthrough
          </span>
          <h2
            id="walkthrough-headline"
            className="signet-headline"
            style={{
              fontSize: 'clamp(32px, 4vw, 48px)',
              fontWeight: 500,
              color: '#191715',
              marginBottom: '1rem',
            }}
          >
            From contribution to credential.
          </h2>
          <p
            style={{
              fontSize: '16px',
              color: 'var(--signet-muted)',
              maxWidth: '620px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            Explore the five sequential stages of the SIGNET protocol journey.
            Select each stage to inspect its real interface mechanics and truth requirements.
          </p>
        </div>

        {/* 5-Stage Step Selector Tabs */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '8px',
            marginBottom: '2.5rem',
          }}
          className="walkthrough-tabs-grid"
          role="tablist"
          aria-label="Walkthrough stages"
        >
          {stages.map((stg) => {
            const isActive = stg.id === activeStage
            return (
              <button
                key={stg.id}
                role="tab"
                aria-selected={isActive}
                aria-controls={`walkthrough-panel-${stg.id}`}
                id={`walkthrough-tab-${stg.id}`}
                onClick={() => setActiveStage(stg.id)}
                style={{
                  backgroundColor: isActive ? '#191715' : 'rgba(25, 23, 21, 0.05)',
                  color: isActive ? '#EDE2D0' : '#191715',
                  borderRadius: '10px',
                  padding: '14px 12px',
                  border: isActive ? '1px solid #191715' : '1px solid rgba(118, 103, 91, 0.2)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? '0 6px 18px rgba(0,0,0,0.15)' : 'none',
                }}
              >
                <div style={{ fontSize: '11px', fontWeight: 800, color: isActive ? '#B9572B' : 'var(--signet-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Stage {stg.id}
                </div>
                <div style={{ fontSize: '13px', fontWeight: 700, lineHeight: 1.3 }}>
                  {stg.title.replace(`${stg.id}. `, '')}
                </div>
              </button>
            )
          })}
        </div>

        {/* Active Stage Display Panel (Split-screen) */}
        <div
          id={`walkthrough-panel-${current.id}`}
          role="tabpanel"
          aria-labelledby={`walkthrough-tab-${current.id}`}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.25fr',
            gap: '2.5rem',
            alignItems: 'center',
            backgroundColor: '#FAF3E7',
            borderRadius: '18px',
            border: '1px solid rgba(118, 103, 91, 0.25)',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.06)',
            padding: '2.5rem',
          }}
          className="walkthrough-detail-panel"
        >
          {/* Left Column: Stage Narrative & Truth Requirements */}
          <div style={{ textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: current.statusColor,
                  backgroundColor: `${current.statusColor}18`,
                  padding: '3px 8px',
                  borderRadius: '4px',
                }}
              >
                {current.statusTag}
              </span>
            </div>

            <h3
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '28px',
                fontWeight: 600,
                color: '#191715',
                marginBottom: '1rem',
              }}
            >
              {current.title}
            </h3>

            <p style={{ fontSize: '15px', color: '#191715', lineHeight: 1.7, marginBottom: '1.6rem' }}>
              {current.description}
            </p>

            <div
              style={{
                backgroundColor: 'rgba(185, 87, 43, 0.07)',
                borderLeft: '3px solid #B9572B',
                padding: '12px 14px',
                borderRadius: '0 6px 6px 0',
              }}
            >
              <div style={{ fontSize: '10px', fontWeight: 800, color: '#B9572B', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '3px' }}>
                Product Truth Requirement
              </div>
              <div style={{ fontSize: '12px', color: 'var(--signet-muted)', lineHeight: 1.5 }}>
                {current.truthNote}
              </div>
            </div>

            {/* Stepper controls */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '2rem' }}>
              <button
                disabled={activeStage === 1}
                onClick={() => setActiveStage(activeStage - 1)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: '1px solid rgba(118, 103, 91, 0.3)',
                  backgroundColor: 'transparent',
                  color: activeStage === 1 ? 'rgba(118, 103, 91, 0.4)' : '#191715',
                  cursor: activeStage === 1 ? 'not-allowed' : 'pointer',
                  fontWeight: 600,
                  fontSize: '12px',
                }}
              >
                ← Previous Stage
              </button>

              <button
                disabled={activeStage === 5}
                onClick={() => setActiveStage(activeStage + 1)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: activeStage === 5 ? 'rgba(185, 87, 43, 0.4)' : '#B9572B',
                  color: '#EDE2D0',
                  cursor: activeStage === 5 ? 'not-allowed' : 'pointer',
                  fontWeight: 700,
                  fontSize: '12px',
                }}
              >
                Next Stage →
              </button>
            </div>
          </div>

          {/* Right Column: Realistic Interface Frame */}
          <div
            style={{
              backgroundColor: '#FFF',
              borderRadius: '12px',
              border: '1px solid rgba(118, 103, 91, 0.28)',
              boxShadow: '0 12px 28px rgba(0, 0, 0, 0.08)',
              overflow: 'hidden',
            }}
          >
            {/* Window Chrome Header */}
            <div
              style={{
                backgroundColor: '#191715',
                padding: '9px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'rgba(237, 226, 208, 0.3)' }} />
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'rgba(237, 226, 208, 0.3)' }} />
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'rgba(237, 226, 208, 0.3)' }} />
              </div>
              <span style={{ fontSize: '10px', color: '#EDE2D0', fontFamily: 'var(--font-mono)', opacity: 0.75 }}>
                signet.protocol / stage-{current.id}
              </span>
              <div style={{ width: '28px' }} />
            </div>

            {current.interfaceContent}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .walkthrough-tabs-grid {
            grid-template-columns: 1fr !important;
          }
          .walkthrough-detail-panel {
            grid-template-columns: 1fr !important;
            padding: 1.5rem !important;
          }
        }
      `}</style>
    </section>
  )
}

export default ProductWalkthrough
