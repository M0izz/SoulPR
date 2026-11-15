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
        <div style={{ padding: '1.8rem', textAlign: 'left', color: '#EDE2D0' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.4rem',
              paddingBottom: '14px',
              borderBottom: '1px solid rgba(237, 226, 208, 0.1)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#1E1B18',
                  border: '1px solid rgba(237, 226, 208, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFF',
                  fontWeight: 700,
                  fontSize: '13px',
                }}
              >
                GH
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '13.5px', color: '#FBF8F3' }}>
                  GitHub Contributor Authorization
                </div>
                <div style={{ fontSize: '11px', color: 'var(--signet-muted)' }}>
                  OAuth Scope: read:user (identity validation only)
                </div>
              </div>
            </div>
            <span
              style={{
                fontSize: '10px',
                fontWeight: 700,
                color: '#4ADE80',
                backgroundColor: 'rgba(74, 222, 128, 0.1)',
                border: '1px solid rgba(74, 222, 128, 0.25)',
                padding: '4px 12px',
                borderRadius: '99px',
              }}
            >
              Connected ✓
            </span>
          </div>

          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '10px',
              padding: '16px',
              marginBottom: '1.2rem',
              border: '1px solid rgba(237, 226, 208, 0.1)',
            }}
          >
            <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#F59E0B', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.06em' }}>
              CONNECTED IDENTITY
            </div>
            <div style={{ fontSize: '16px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#FBF8F3' }}>
              @alex-dev
            </div>
            <div style={{ fontSize: '12px', color: 'var(--signet-muted)', marginTop: '4px' }}>
              Public contributions discoverable across tracked repositories
            </div>
          </div>

          <div style={{ fontSize: '11.5px', color: 'var(--signet-muted)', fontStyle: 'italic' }}>
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
        <div style={{ padding: '1.8rem', textAlign: 'left', color: '#EDE2D0' }}>
          <div
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--signet-muted)',
              textTransform: 'uppercase',
              marginBottom: '14px',
              letterSpacing: '0.08em',
            }}
          >
            Discovered Eligible Contributions (Sample View)
          </div>

          <div
            style={{
              border: '1px solid rgba(224, 109, 56, 0.25)',
              borderRadius: '12px',
              padding: '16px',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              marginBottom: '14px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '8px',
              }}
            >
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12.5px', fontWeight: 600, color: '#F59E0B' }}>
                near/core-contracts · PR #408
              </span>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 800,
                  color: '#4ADE80',
                  backgroundColor: 'rgba(74, 222, 128, 0.12)',
                  border: '1px solid rgba(74, 222, 128, 0.3)',
                  padding: '3px 8px',
                  borderRadius: '4px',
                }}
              >
                MERGED
              </span>
            </div>
            <div style={{ fontWeight: 700, fontSize: '15px', color: '#FBF8F3', marginBottom: '8px' }}>
              Implement non-transferable credential registry
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--signet-muted)', fontFamily: 'var(--font-mono)' }}>
              Merged by maintainer on 2026-11-14 · Commit: 7f8a91c
            </div>
          </div>

          <div style={{ fontSize: '11.5px', color: 'var(--signet-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#4ADE80', boxShadow: '0 0 6px #4ADE80' }} />
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
        <div style={{ padding: '1.8rem', textAlign: 'left', color: '#EDE2D0' }}>
          <div
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color: '#F59E0B',
              textTransform: 'uppercase',
              marginBottom: '14px',
              letterSpacing: '0.08em',
            }}
          >
            Source Evidence Audit (PR #408)
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(237, 226, 208, 0.1)',
              }}
            >
              <div style={{ fontSize: '9.5px', fontWeight: 700, color: 'var(--signet-muted)', letterSpacing: '0.06em' }}>
                MERGE COMMIT SHA
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 600, color: '#38BDF8', marginTop: '3px' }}>
                7f8a91c0e4b82d
              </div>
            </div>
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(237, 226, 208, 0.1)',
              }}
            >
              <div style={{ fontSize: '9.5px', fontWeight: 700, color: 'var(--signet-muted)', letterSpacing: '0.06em' }}>
                DIFF METRICS
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 600, color: '#4ADE80', marginTop: '3px' }}>
                +342 lines / -18 lines
              </div>
            </div>
          </div>

          <div
            style={{
              backgroundColor: '#0A0908',
              color: '#EDE2D0',
              borderRadius: '8px',
              padding: '12px 14px',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              lineHeight: 1.6,
              border: '1px solid rgba(237, 226, 208, 0.08)',
            }}
          >
            <div style={{ color: 'rgba(237, 226, 208, 0.45)' }}>// Evidence integrity checksum</div>
            <div style={{ color: '#F1F5F9' }}>evidence_hash: sha256:d8a2...3f1c</div>
            <div style={{ color: '#4ADE80', marginTop: '2px' }}>✓ Git tree verification passed</div>
          </div>
        </div>
      ),
    },
    {
      id: 4,
      title: '4. Issue Credential',
      subtitle: 'Protocol Attestation',
      statusTag: 'Protocol Capability (Staged)',
      statusColor: '#E06D38',
      truthNote: 'Protocol synthesis packages inspectable records into a structured SIGNET schema credential.',
      description:
        'When requirements are met, SIGNET mints an unalterable credential. The record binds contributor, repository context, and evidence hashes into a permanent record.',
      interfaceContent: (
        <div style={{ padding: '1.8rem', textAlign: 'left', color: '#EDE2D0' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '14px',
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#E06D38', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Credential Synthesis
            </div>
            <span
              style={{
                fontSize: '9.5px',
                fontWeight: 800,
                color: '#F59E0B',
                backgroundColor: 'rgba(245, 158, 11, 0.12)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                padding: '3px 8px',
                borderRadius: '4px',
              }}
            >
              SCHEMA V1.0.0
            </span>
          </div>

          <div
            style={{
              backgroundColor: 'rgba(224, 109, 56, 0.08)',
              border: '1px solid rgba(224, 109, 56, 0.3)',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '14px',
            }}
          >
            <div style={{ fontSize: '10px', color: 'var(--signet-muted)', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
              CREDENTIAL ID: SGT-2026-08492-NEAR
            </div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '17px', fontWeight: 600, color: '#FBF8F3' }}>
              Non-Transferable Contribution Credential
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--signet-muted)', marginTop: '4px' }}>
              Recipient: alex-dev.near · Issuer: SIGNET Protocol Registry
            </div>
          </div>

          <div style={{ fontSize: '11.5px', color: 'var(--signet-muted)', fontStyle: 'italic' }}>
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
        <div style={{ padding: '1.8rem', textAlign: 'left', color: '#EDE2D0' }}>
          <div
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color: '#38BDF8',
              textTransform: 'uppercase',
              marginBottom: '14px',
              letterSpacing: '0.08em',
            }}
          >
            Independent Public Verification View
          </div>

          <div
            style={{
              backgroundColor: '#0A0908',
              color: '#EDE2D0',
              borderRadius: '10px',
              padding: '14px 16px',
              marginBottom: '14px',
              border: '1px solid rgba(237, 226, 208, 0.09)',
            }}
          >
            <div style={{ fontSize: '10px', color: '#F59E0B', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>
              PUBLIC ROUTE: /verify/sample
            </div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#FBF8F3' }}>
              Zero Login Required for Reviewers
            </div>
            <div style={{ fontSize: '11.5px', color: 'rgba(237, 226, 208, 0.7)', marginTop: '4px', lineHeight: 1.5 }}>
              Reviewers inspect source commits, diff metrics, and integrity signatures without trusting self-reported claims.
            </div>
          </div>

          <a
            href="/verify/sample"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: 700,
              color: '#F59E0B',
              textDecoration: 'none',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateX(3px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateX(0)')}
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
        backgroundColor: '#0C0B0A',
        color: '#EDE2D0',
        padding: '7rem 2rem 7.5rem',
        borderTop: '1px solid rgba(237, 226, 208, 0.08)',
        borderBottom: '1px solid rgba(237, 226, 208, 0.08)',
        position: 'relative',
        overflow: 'hidden',
      }}
      aria-labelledby="walkthrough-headline"
    >
      {/* Background glow */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          right: '10%',
          width: '500px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(224, 109, 56, 0.08) 0%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: '1260px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: '#E06D38',
              display: 'block',
              marginBottom: '10px',
            }}
          >
            Interactive Product Walkthrough
          </span>
          <h2
            id="walkthrough-headline"
            className="signet-headline"
            style={{
              fontSize: 'clamp(34px, 4.5vw, 52px)',
              fontWeight: 500,
              color: '#FBF8F3',
              marginBottom: '1.2rem',
            }}
          >
            From contribution to credential.
          </h2>
          <p
            style={{
              fontSize: '16.5px',
              color: 'var(--signet-muted)',
              maxWidth: '640px',
              margin: '0 auto',
              lineHeight: 1.7,
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
            gap: '12px',
            marginBottom: '3rem',
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
                  backgroundColor: isActive ? 'rgba(224, 109, 56, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                  color: isActive ? '#FBF8F3' : 'var(--signet-muted)',
                  borderRadius: '12px',
                  padding: '16px 14px',
                  border: isActive
                    ? '1.5px solid #E06D38'
                    : '1px solid rgba(237, 226, 208, 0.09)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: isActive ? '0 8px 24px rgba(0,0,0,0.5), 0 0 16px rgba(224, 109, 56, 0.2)' : 'none',
                }}
              >
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    color: isActive ? '#F59E0B' : 'var(--signet-muted)',
                    textTransform: 'uppercase',
                    marginBottom: '6px',
                    letterSpacing: '0.06em',
                  }}
                >
                  Stage {stg.id}
                </div>
                <div style={{ fontSize: '13.5px', fontWeight: 700, lineHeight: 1.35 }}>
                  {stg.title.replace(`${stg.id}. `, '')}
                </div>
              </button>
            )
          })}
        </div>

        {/* Active Stage Display Panel (Split-screen Glassmorphic) */}
        <div
          id={`walkthrough-panel-${current.id}`}
          role="tabpanel"
          aria-labelledby={`walkthrough-tab-${current.id}`}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.25fr',
            gap: '3rem',
            alignItems: 'center',
            backgroundColor: 'rgba(22, 19, 16, 0.75)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            border: '1px solid rgba(237, 226, 208, 0.12)',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.65), 0 0 30px rgba(224, 109, 56, 0.08)',
            padding: '3rem',
          }}
          className="walkthrough-detail-panel"
        >
          {/* Left Column: Stage Narrative & Truth Requirements */}
          <div style={{ textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <span
                style={{
                  fontSize: '10.5px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: current.statusColor,
                  backgroundColor: `${current.statusColor}22`,
                  border: `1px solid ${current.statusColor}44`,
                  padding: '4px 10px',
                  borderRadius: '99px',
                }}
              >
                {current.statusTag}
              </span>
            </div>

            <h3
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '30px',
                fontWeight: 600,
                color: '#FBF8F3',
                marginBottom: '1rem',
              }}
            >
              {current.title}
            </h3>

            <p style={{ fontSize: '15.5px', color: 'var(--signet-muted)', lineHeight: 1.75, marginBottom: '1.8rem' }}>
              {current.description}
            </p>

            <div
              style={{
                backgroundColor: 'rgba(224, 109, 56, 0.08)',
                borderLeft: '3px solid #E06D38',
                padding: '14px 16px',
                borderRadius: '0 8px 8px 0',
              }}
            >
              <div
                style={{
                  fontSize: '10.5px',
                  fontWeight: 800,
                  color: '#F59E0B',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: '4px',
                }}
              >
                Product Truth Requirement
              </div>
              <div style={{ fontSize: '12.5px', color: '#EDE2D0', lineHeight: 1.6 }}>
                {current.truthNote}
              </div>
            </div>

            {/* Stepper controls */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '2.4rem' }}>
              <button
                disabled={activeStage === 1}
                onClick={() => setActiveStage(activeStage - 1)}
                style={{
                  padding: '9px 18px',
                  borderRadius: '8px',
                  border: '1px solid rgba(237, 226, 208, 0.2)',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  color: activeStage === 1 ? 'rgba(237, 226, 208, 0.25)' : '#EDE2D0',
                  cursor: activeStage === 1 ? 'not-allowed' : 'pointer',
                  fontWeight: 600,
                  fontSize: '13px',
                  transition: 'all 0.2s',
                }}
              >
                ← Previous Stage
              </button>

              <button
                disabled={activeStage === 5}
                onClick={() => setActiveStage(activeStage + 1)}
                style={{
                  padding: '9px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: activeStage === 5 ? 'rgba(224, 109, 56, 0.3)' : 'var(--signet-orange)',
                  color: '#EDE2D0',
                  cursor: activeStage === 5 ? 'not-allowed' : 'pointer',
                  fontWeight: 700,
                  fontSize: '13px',
                  boxShadow: activeStage === 5 ? 'none' : '0 4px 16px rgba(185, 87, 43, 0.4)',
                  transition: 'all 0.2s',
                }}
              >
                Next Stage →
              </button>
            </div>
          </div>

          {/* Right Column: Realistic Interface Frame */}
          <div
            style={{
              backgroundColor: '#100E0C',
              borderRadius: '16px',
              border: '1px solid rgba(237, 226, 208, 0.16)',
              boxShadow: '0 20px 45px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
              overflow: 'hidden',
            }}
          >
            {/* Window Chrome Header */}
            <div
              style={{
                backgroundColor: '#181512',
                padding: '12px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid rgba(237, 226, 208, 0.08)',
              }}
            >
              <div style={{ display: 'flex', gap: '7px' }}>
                <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
                <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
                <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#10B981' }} />
              </div>
              <span style={{ fontSize: '10.5px', color: '#EDE2D0', fontFamily: 'var(--font-mono)', opacity: 0.8 }}>
                signet.protocol / stage-{current.id}
              </span>
              <div style={{ width: '28px' }} />
            </div>

            {current.interfaceContent}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .walkthrough-tabs-grid {
            grid-template-columns: 1fr !important;
          }
          .walkthrough-detail-panel {
            grid-template-columns: 1fr !important;
            padding: 1.8rem !important;
          }
        }
      `}</style>
    </section>
  )
}

export default ProductWalkthrough
