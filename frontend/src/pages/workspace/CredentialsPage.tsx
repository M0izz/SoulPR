import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CredentialSeal from '../../components/credential/CredentialSeal'
import HolographicCredential3D from '../../components/credential/HolographicCredential3D'
import {
  IconShieldCheck,
  IconExternalLink,
  IconCode,
  IconArrowRight,
} from '../../components/Icons'

export interface CredentialItem {
  id: string
  repo: string
  prNumber: number
  prTitle: string
  contributor: string
  nearAccount: string
  issuedAt: string
  status: 'confirmed' | 'pending' | 'failed' | 'revoked'
  txHash?: string
}

export default function CredentialsPage() {
  const navigate = useNavigate()
  // Truthful empty list: no fake issued credentials
  const [credentials] = useState<CredentialItem[]>([])

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* ── HEADER ── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.8rem',
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
            Contribution Credentials
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--ink-muted)', margin: 0 }}>
            Persistent, soulbound contribution credentials confirmed on the NEAR Protocol registry.
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
          Inspect Illustrative Sample <IconExternalLink size={12} />
        </button>
      </div>

      {/* ── CREDENTIALS LIST OR TRUTHFUL EMPTY STATE ── */}
      {credentials.length === 0 ? (
        <div
          style={{
            backgroundColor: 'var(--paper-raised)',
            border: '1px solid var(--rule)',
            borderRadius: '14px',
            padding: '4rem 2rem',
            textAlign: 'center',
          }}
        >
          <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
            <CredentialSeal size={64} glow={true} />
          </div>

          <h2
            style={{
              fontSize: '20px',
              fontWeight: 700,
              margin: '0 0 8px 0',
              color: 'var(--ink)',
              fontFamily: 'var(--font-serif)',
            }}
          >
            No Credentials Issued Yet
          </h2>

          <p
            style={{
              fontSize: '13.5px',
              color: 'var(--ink-muted)',
              maxWidth: '480px',
              margin: '0 auto 1.8rem auto',
              lineHeight: 1.5,
            }}
          >
            Credentials represent immutable, on-chain soulbound attestations. When you approve an eligible contribution
            dossier and authorize the NEAR transaction, your confirmed credential will appear here.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <Link
              to="/contributions"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#B9572B',
                color: '#EDE2D0',
                textDecoration: 'none',
                padding: '9px 18px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 700,
              }}
            >
              <IconCode size={15} /> Review Contributions
            </Link>

            <Link
              to="/verify/sample"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'var(--paper)',
                border: '1px solid var(--rule)',
                color: 'var(--ink)',
                textDecoration: 'none',
                padding: '9px 18px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 600,
              }}
            >
              <IconShieldCheck size={15} color="#B9572B" /> View Sample Credential
            </Link>
          </div>

          {/* ── 3D HOLOGRAPHIC SAMPLE SHOWCASE ── */}
          <div style={{ marginTop: '3rem', borderTop: '1px solid var(--rule)', paddingTop: '2.5rem' }}>
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
              How your verified credentials appear upon cryptographic confirmation on NEAR Protocol:
            </p>
            <HolographicCredential3D autoRotate={true} showPedestal={true} />
          </div>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {credentials.map((cred) => (
            <div
              key={cred.id}
              style={{
                backgroundColor: 'var(--paper-raised)',
                border: '1px solid var(--rule)',
                borderRadius: '12px',
                padding: '1.6rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#B9572B', fontWeight: 700 }}>
                    {cred.id}
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '4px',
                      backgroundColor: cred.status === 'confirmed' ? 'rgba(46, 125, 50, 0.1)' : 'rgba(230, 81, 0, 0.1)',
                      color: cred.status === 'confirmed' ? '#2E7D32' : '#E65100',
                    }}
                  >
                    {cred.status.toUpperCase()}
                  </span>
                </div>

                <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 6px 0', color: 'var(--ink)' }}>
                  {cred.prTitle}
                </h3>
                <div style={{ fontSize: '12px', color: 'var(--ink-muted)', marginBottom: '12px' }}>
                  {cred.repo} #{cred.prNumber}
                </div>
              </div>

              <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--rule)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: 'var(--ink-faint)' }}>
                  {new Date(cred.issuedAt).toLocaleDateString()}
                </span>
                <Link
                  to={`/verify/${cred.id}`}
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
                  Verify <IconArrowRight size={12} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
