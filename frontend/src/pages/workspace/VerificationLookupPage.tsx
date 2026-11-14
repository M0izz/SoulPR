import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CredentialSeal from '../../components/credential/CredentialSeal'
import {
  IconSearch,
  IconShieldCheck,
  IconCode,
  IconCheckCircle,
  IconExternalLink,
  IconArrowRight,
} from '../../components/Icons'

export default function VerificationLookupPage() {
  const [lookupId, setLookupId] = useState('')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleLookup = (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    const clean = lookupId.trim()
    if (!clean) {
      setError('Please enter a valid credential ID.')
      return
    }
    navigate(`/verify/${encodeURIComponent(clean)}`)
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* ── HEADER ── */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <CredentialSeal size={72} glow={true} />
        </div>
        <h1
          style={{
            fontSize: '30px',
            fontWeight: 700,
            margin: '0 0 8px 0',
            fontFamily: 'var(--font-serif)',
            color: 'var(--ink)',
          }}
        >
          Public Credential Verification
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--ink-muted)', maxWidth: '520px', margin: '0 auto', lineHeight: 1.5 }}>
          Independent verification of contribution credentials. Inspect GitHub source facts, cryptographic evidence
          digests, and NEAR Protocol contract records.
        </p>
      </div>

      {/* ── LOOKUP INPUT CARD ── */}
      <div
        style={{
          backgroundColor: 'var(--paper-raised)',
          border: '1px solid var(--rule)',
          borderRadius: '14px',
          padding: '2rem',
          marginBottom: '2.5rem',
        }}
      >
        <form onSubmit={handleLookup} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ink)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Enter Resolvable Credential Identifier
          </label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flex: 1,
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid var(--rule)',
                backgroundColor: 'var(--paper)',
              }}
            >
              <IconSearch size={16} color="var(--ink-muted)" />
              <input
                type="text"
                placeholder="e.g. signet-cred-42 or 0x..."
                value={lookupId}
                onChange={(e) => setLookupId(e.target.value)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--ink)',
                  fontSize: '14px',
                  fontFamily: 'monospace',
                  width: '100%',
                  outline: 'none',
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                padding: '10px 22px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#B9572B',
                color: '#EDE2D0',
                fontSize: '13.5px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              Verify <IconArrowRight size={14} />
            </button>
          </div>

          {error && <div style={{ fontSize: '12px', color: '#D32F2F', fontWeight: 600 }}>{error}</div>}
        </form>

        <div style={{ marginTop: '1.2rem', paddingTop: '1rem', borderTop: '1px solid var(--rule)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
          <span style={{ color: 'var(--ink-muted)' }}>Want to inspect the canonical format?</span>
          <Link
            to="/verify/sample"
            style={{ color: '#B9572B', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            Inspect Illustrative Sample Credential <IconExternalLink size={12} />
          </Link>
        </div>
      </div>

      {/* ── 4 VERIFICATION LAYERS EXPLANATION ── */}
      <div
        style={{
          backgroundColor: 'var(--paper-raised)',
          border: '1px solid var(--rule)',
          borderRadius: '14px',
          padding: '2rem',
        }}
      >
        <h2 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 1.2rem 0', color: 'var(--ink)', fontFamily: 'var(--font-serif)' }}>
          The Four Independent Verification Layers
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
          {[
            {
              step: '1',
              title: 'Credential Lookup',
              desc: 'Resolves unique identifier against registered registry entries.',
              icon: <IconSearch size={16} color="#B9572B" />,
            },
            {
              step: '2',
              title: 'GitHub Source Facts',
              desc: 'Authoritative git merge timestamp, author ID, and commit SHA.',
              icon: <IconCode size={16} color="#B9572B" />,
            },
            {
              step: '3',
              title: 'Evidence Integrity',
              desc: 'SHA-256 content digest matches the signed snapshot exactly.',
              icon: <IconShieldCheck size={16} color="#B9572B" />,
            },
            {
              step: '4',
              title: 'NEAR On-Chain Record',
              desc: 'Direct read-back from the Soulbound smart contract state.',
              icon: <IconCheckCircle size={16} color="#2E7D32" />,
            },
          ].map((item) => (
            <div
              key={item.step}
              style={{
                padding: '1.2rem',
                borderRadius: '8px',
                backgroundColor: 'var(--paper)',
                border: '1px solid var(--rule)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                {item.icon}
                <div style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--ink)' }}>{item.title}</div>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--ink-muted)', margin: 0, lineHeight: 1.45 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
