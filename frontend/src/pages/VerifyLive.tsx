import { useParams, Link, useNavigate } from 'react-router-dom'
import SignetBrandLockup from '../components/brand/SignetBrandLockup'
import CredentialCard, { type CredentialCardData } from '../components/credential/CredentialCard'
import EvidenceInspector, { type EvidenceRecord } from '../components/credential/EvidenceInspector'

export default function VerifyLive() {
  const { credentialId } = useParams<{ credentialId: string }>()
  const navigate = useNavigate()

  const safeCredentialId = credentialId || 'SGT-UNKNOWN'

  // Honest fallback record when querying a live ID before NEAR testnet settlement
  const liveCardData: CredentialCardData = {
    credentialId: safeCredentialId,
    contributor: 'unresolved-identity',
    contributionTitle: 'Awaiting Protocol Attestation',
    repository: 'github/repository',
    prNumber: 0,
    issuer: 'SIGNET Protocol Core',
    issuanceDate: new Date().toISOString().split('T')[0],
    status: 'Evidence Inspected',
    isSample: false,
    txRef: 'PENDING — NEAR TESTNET CONTRACT SETTLEMENT',
    contractRef: 'PENDING — NEAR TESTNET CONTRACT SETTLEMENT',
  }

  const liveEvidence: EvidenceRecord = {
    isSample: false,
    contributor: 'unresolved-identity',
    contributorAccount: 'pending.near',
    repo: 'github/repository',
    prNumber: 0,
    prTitle: 'Awaiting Protocol Attestation',
    mergeCommitSha: '0000000000000000000000000000000000000000',
    mergeTimestamp: new Date().toISOString(),
    diffStats: {
      additions: 0,
      deletions: 0,
      filesChanged: 0,
    },
    schemaVersion: '1.0.0',
    evidenceHash: 'sha256:0000000000000000000000000000000000000000000000000000000000000000',
    transactionRef: 'PENDING — NEAR TESTNET CONTRACT SETTLEMENT',
    contractRef: 'PENDING — NEAR TESTNET CONTRACT SETTLEMENT',
    blockHeight: 'PENDING',
    onChainVerificationState: 'PENDING ON-CHAIN SETTLEMENT',
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
            to="/verify/sample"
            style={{
              fontSize: '13px',
              color: '#B9572B',
              textDecoration: 'none',
              fontWeight: 700,
            }}
          >
            View Illustrative Sample →
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
            Sign in
          </button>
        </div>
      </header>

      {/* ── Main Body ── */}
      <main style={{ maxWidth: '1040px', margin: '0 auto', padding: '3.5rem 1.5rem 5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span
            style={{
              fontSize: '10px',
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
            Public Credential Audit
          </span>
          <h1
            className="signet-headline"
            style={{
              fontSize: 'clamp(28px, 3.5vw, 40px)',
              fontWeight: 500,
              color: '#EDE2D0',
              marginBottom: '8px',
            }}
          >
            Credential Inspection: <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85em', color: '#B9572B' }}>{safeCredentialId}</span>
          </h1>
        </div>

        {/* Honest Protocol Settlement Status Notice */}
        <div
          style={{
            backgroundColor: '#191715',
            border: '1px solid rgba(185, 87, 43, 0.35)',
            borderRadius: '12px',
            padding: '1.4rem 1.8rem',
            marginBottom: '3rem',
            textAlign: 'left',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#B9572B' }} />
            <strong style={{ fontSize: '13px', color: '#EDE2D0' }}>Protocol Truth Status:</strong>
            <span style={{ fontSize: '12px', color: '#B9572B', fontWeight: 700 }}>Awaiting NEAR Testnet Contract Settlement</span>
          </div>
          <p style={{ fontSize: '12.5px', color: 'var(--signet-muted)', lineHeight: 1.6, margin: 0 }}>
            This live verification view adheres to strict product truth rules. Credential <code>{safeCredentialId}</code> is currently
            in local record staging. Because the public NEAR smart contract has not yet settled this transaction on testnet,
            no fake blockchain hashes or counterfeit confirmations are displayed.
          </p>
        </div>

        {/* 2-Column Credential Presentation */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '440px 1fr',
            gap: '3rem',
            alignItems: 'start',
            marginBottom: '3.5rem',
          }}
          className="verify-live-grid"
        >
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <CredentialCard data={liveCardData} interactive={false} />
          </div>

          <div style={{ textAlign: 'left' }}>
            <div
              style={{
                backgroundColor: '#191715',
                border: '1px solid rgba(237, 226, 208, 0.12)',
                borderRadius: '12px',
                padding: '1.6rem',
                marginBottom: '1.5rem',
              }}
            >
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: 600, color: '#EDE2D0', margin: '0 0 10px' }}>
                How Real Verification Works
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--signet-muted)', lineHeight: 1.65, margin: 0 }}>
                When settled on NEAR Protocol, the credential's hash is recorded in a non-transferable attestation contract.
                Any reviewer can inspect the exact commit SHA, pull request metadata, and git tree integrity without logging in.
              </p>
            </div>

            <Link
              to="/verify/sample"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                fontWeight: 700,
                color: '#B9572B',
                textDecoration: 'none',
              }}
            >
              Explore fully populated sample credential →
            </Link>
          </div>
        </div>

        {/* Deep Evidence Inspector */}
        <EvidenceInspector evidence={liveEvidence} />
      </main>

      <style>{`
        @media (max-width: 900px) {
          .verify-live-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </div>
  )
}
