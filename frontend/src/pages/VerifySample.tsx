import { Link, useNavigate } from 'react-router-dom'
import SignetBrandLockup from '../components/brand/SignetBrandLockup'
import type { CredentialCardData } from '../components/credential/CredentialCard'
import HolographicCredential3D from '../components/credential/HolographicCredential3D'
import EvidenceInspector, { type EvidenceRecord } from '../components/credential/EvidenceInspector'

export default function VerifySample() {
  const navigate = useNavigate()

  const sampleCardData: CredentialCardData = {
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

  const sampleEvidence: EvidenceRecord = {
    isSample: true,
    contributor: 'alex-dev',
    contributorAccount: 'alex-dev.near (Sample)',
    repo: 'near/core-contracts',
    prNumber: 408,
    prTitle: 'Implement non-transferable credential registry',
    mergeCommitSha: '7f8a91c0e4b82d9a8c1f3e7b2d5a6c8e9f012345',
    mergeTimestamp: '2026-11-14T14:32:00Z',
    diffStats: {
      additions: 342,
      deletions: 18,
      filesChanged: 4,
    },
    schemaVersion: '1.0.0',
    evidenceHash: 'sha256:d8a2b5e7c1094f382a6e9b4d8c7a1f5e2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e',
    transactionRef: 'NOT APPLICABLE — ILLUSTRATIVE SAMPLE',
    contractRef: 'NOT APPLICABLE — ILLUSTRATIVE SAMPLE',
    blockHeight: 'NOT APPLICABLE',
    onChainVerificationState: 'SAMPLE — NOT VERIFIED ON-CHAIN',
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#10100F',
        color: '#EDE2D0',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* ── MANDATORY PERSISTENT SAMPLE DISCLAIMER BANNER ── */}
      <div
        style={{
          backgroundColor: '#B9572B',
          color: '#EDE2D0',
          padding: '10px 1.5rem',
          textAlign: 'center',
          fontSize: '11.5px',
          fontWeight: 800,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxShadow: '0 2px 10px rgba(0,0,0,0.4)',
        }}
        role="alert"
      >
        ILLUSTRATIVE SAMPLE — NOT A LIVE CREDENTIAL
      </div>

      {/* ── Top Header Bar ── */}
      <header
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          padding: '1.6rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(237, 226, 208, 0.08)',
        }}
      >
        <SignetBrandLockup
          color="#EDE2D0"
          markColor="#B9572B"
          markSize={28}
          wordmarkSize={18}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Link
            to="/"
            style={{
              fontSize: '13px',
              color: 'var(--signet-muted)',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            ← Overview
          </Link>

          <button
            onClick={() => navigate('/auth')}
            style={{
              backgroundColor: 'var(--signet-orange)',
              color: '#EDE2D0',
              border: 'none',
              borderRadius: '6px',
              padding: '7px 16px',
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Create your SIGNET
          </button>
        </div>
      </header>

      {/* ── Main Inspection Body ── */}
      <main style={{ maxWidth: '1040px', margin: '0 auto', padding: '3.5rem 1.5rem 5rem' }}>
        {/* Page Context Headline */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span
            style={{
              fontSize: '10.5px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: '#B9572B',
              backgroundColor: 'rgba(185, 87, 43, 0.1)',
              padding: '4px 12px',
              borderRadius: '99px',
              border: '1px solid rgba(185, 87, 43, 0.25)',
              display: 'inline-block',
              marginBottom: '10px',
            }}
          >
            Public Credential Inspection
          </span>
          <h1
            className="signet-headline"
            style={{
              fontSize: 'clamp(32px, 4vw, 44px)',
              fontWeight: 500,
              color: '#EDE2D0',
              marginBottom: '8px',
            }}
          >
            Inspect Contribution Evidence
          </h1>
          <p
            style={{
              fontSize: '15px',
              color: 'var(--signet-muted)',
              maxWidth: '580px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            This page demonstrates the central SIGNET capability: an issued credential is not merely decorative,
            but provides an unbroken, inspectable audit trail back to source git records.
          </p>
        </div>

        {/* ── 2-Column Presentation: Credential Card & Overview ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(340px, 560px) 1fr',
            gap: '3rem',
            alignItems: 'start',
            marginBottom: '3.5rem',
          }}
          className="verify-sample-grid"
        >
          {/* Column 1: Credential Showcase (3D Hologram) */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <HolographicCredential3D
              data={{
                credentialId: 'SIG-2025-0426-001',
                contributor: 'alex-dev.testnet',
                repository: 'near/core-contracts',
                contributionTitle: 'Implement non-transferable credential registry',
                mergeDate: 'Apr 26, 2025 · 14:32 UTC',
                network: 'NEAR Blockchain',
                txHash: '9k8xY2nF82BqWz7P1oM6rT5uV4eL3aK2jH1gD9sC',
                evidenceDigest: 'sha256:d8a2b5e7c1094f382a6e9b4d8c7a1f5e2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e',
                isSample: true,
              }}
              autoRotate={true}
              showPedestal={true}
            />
          </div>

          {/* Column 2: Audit Summary & Reviewer Guidance */}
          <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div
              style={{
                backgroundColor: '#191715',
                border: '1px solid rgba(237, 226, 208, 0.12)',
                borderRadius: '12px',
                padding: '1.6rem',
              }}
            >
              <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#B9572B', marginBottom: '8px' }}>
                Reviewer Summary
              </div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: 600, color: '#EDE2D0', margin: '0 0 10px' }}>
                Verified Open-Source Contribution
              </h2>
              <p style={{ fontSize: '13.5px', color: 'var(--signet-muted)', lineHeight: 1.65, margin: 0 }}>
                This record attests that contributor <strong>@{sampleCardData.contributor}</strong> merged pull request{' '}
                <strong>#{sampleCardData.prNumber}</strong> into repository <strong>{sampleCardData.repository}</strong>.
                The full diff and git commit hashes are inspectable below.
              </p>
            </div>

            <div
              style={{
                backgroundColor: 'rgba(185, 87, 43, 0.08)',
                border: '1px solid rgba(185, 87, 43, 0.28)',
                borderRadius: '12px',
                padding: '1.4rem',
              }}
            >
              <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#B9572B', marginBottom: '6px' }}>
                Product Truth Notice
              </div>
              <div style={{ fontSize: '12.5px', color: '#EDE2D0', lineHeight: 1.55 }}>
                All values shown on this demonstration page use synthetic sample identifiers and explicit placeholders.
                Live credentials on SIGNET consume real NEAR Protocol attestations and authoritative GitHub git trees.
              </div>
            </div>
          </div>
        </div>

        {/* ── Deep Evidence Inspector Accordion ── */}
        <EvidenceInspector evidence={sampleEvidence} />
      </main>

      <style>{`
        @media (max-width: 900px) {
          .verify-sample-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </div>
  )
}
