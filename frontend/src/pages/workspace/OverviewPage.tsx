import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useWorkspace } from '../../context/WorkspaceContext'
import CredentialSeal from '../../components/credential/CredentialSeal'
import {
  IconGitHub,
  IconWallet,
  IconArrowRight,
  IconCode,
  IconAward,
  IconCheckCircle,
  IconAlertCircle,
  IconShieldCheck,
  IconExternalLink,
} from '../../components/Icons'

export default function OverviewPage() {
  const { userGithub, nearAccount, isAuthenticated, isLinked, syncState, triggerSync } = useWorkspace()
  const navigate = useNavigate()
  const [prUrlInput, setPrUrlInput] = useState('')
  const [importError, setImportError] = useState<string | null>(null)
  const [isImporting, setIsImporting] = useState(false)

  const handleManualImport = (e: FormEvent) => {
    e.preventDefault()
    setImportError(null)

    // Validate canonical GitHub PR URL: github.com/{owner}/{repo}/pull/{number}
    const match = prUrlInput.trim().match(/^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/i)
    if (!match) {
      setImportError('Please enter a valid GitHub pull request URL (e.g., https://github.com/owner/repo/pull/123)')
      return
    }

    setIsImporting(true)
    setTimeout(() => {
      setIsImporting(false)
      setPrUrlInput('')
      navigate('/contributions')
    }, 800)
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* ── IDENTITY & HEADQUARTERS BANNER ── */}
      <section
        style={{
          backgroundColor: '#191715',
          color: '#EDE2D0',
          borderRadius: '16px',
          padding: '2.2rem 2.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(185, 87, 43, 0.25)',
        }}
      >
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div
            style={{
              fontSize: '11px',
              fontWeight: 800,
              color: '#B9572B',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              marginBottom: '8px',
            }}
          >
            Personal Contribution Headquarters
          </div>

          <h1
            style={{
              fontSize: '32px',
              fontWeight: 600,
              color: '#EDE2D0',
              fontFamily: 'var(--font-serif)',
              margin: '0 0 10px 0',
            }}
          >
            {isAuthenticated && userGithub ? `@${userGithub}` : 'Developer Workspace'}
          </h1>

          <p style={{ fontSize: '13.5px', color: '#B3A69A', maxWidth: '580px', margin: '0 0 1.2rem 0', lineHeight: 1.5 }}>
            Evidence-first contribution archive. Turn eligible merged GitHub pull requests into structured,
            verifiable contribution credentials on NEAR Protocol.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                fontSize: '12px',
              }}
            >
              <IconGitHub size={14} color="#EDE2D0" />
              <span>{isAuthenticated && userGithub ? `Signed in as @${userGithub}` : 'GitHub not connected'}</span>
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '8px',
                backgroundColor: isLinked ? 'rgba(185, 87, 43, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                border: isLinked ? '1px solid rgba(185, 87, 43, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
                fontSize: '12px',
              }}
            >
              <IconWallet size={14} color={isLinked ? '#B9572B' : '#B3A69A'} />
              <span style={{ color: isLinked ? '#B9572B' : '#B3A69A', fontWeight: 600 }}>
                {isLinked && nearAccount ? `NEAR: ${nearAccount}` : 'NEAR: Not linked'}
              </span>
            </div>
          </div>
        </div>

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center' }}>
          <CredentialSeal size={100} glow={true} />
        </div>
      </section>

      {/* ── SECTION 6.3: TRUTHFUL SUMMARY METRICS ── */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.2rem',
          marginBottom: '2rem',
        }}
      >
        {[
          {
            label: 'Discovered',
            val: syncState.discoveredCount,
            sub: 'Imported/synced pull requests',
            icon: <IconCode size={18} color="#B9572B" />,
            tooltip: 'Unique PR records imported or discovered and retained for this user',
            to: '/contributions',
          },
          {
            label: 'Eligible',
            val: syncState.eligibleCount,
            sub: 'Passed deterministic rules',
            icon: <IconCheckCircle size={18} color="#2E7D32" />,
            tooltip: 'Records whose current rules evaluation is eligible',
            to: '/contributions?filter=eligible',
          },
          {
            label: 'Needs Review',
            val: syncState.needsReviewCount,
            sub: 'Awaiting developer approval',
            icon: <IconAlertCircle size={18} color="#E65100" />,
            tooltip: 'Records with evidence ready for developer review and decision',
            to: '/contributions?filter=needs_review',
          },
          {
            label: 'Issued Credentials',
            val: syncState.issuedCount,
            sub: 'Confirmed on NEAR Protocol',
            icon: <IconAward size={18} color="#B9572B" />,
            tooltip: 'Credentials whose on-chain issuance reached confirmation threshold',
            to: '/credentials',
          },
        ].map(({ label, val, sub, icon, tooltip, to }) => (
          <div
            key={label}
            onClick={() => navigate(to)}
            title={tooltip}
            className="signet-glass-card"
            style={{
              padding: '1.4rem',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--ink-muted)' }}>{label}</span>
              {icon}
            </div>
            <div
              style={{
                fontSize: '32px',
                fontWeight: 700,
                color: 'var(--ink)',
                fontFamily: 'var(--font-serif)',
                lineHeight: 1,
                marginBottom: '6px',
              }}
            >
              {val}
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--ink-faint)' }}>{sub}</div>
          </div>
        ))}
      </section>

      {/* ── PRIORITY NEXT ACTION & IMPORT DUAL PANEL ── */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        {/* Next Action / Attention Panel */}
        <div
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <IconShieldCheck size={16} color="#B9572B" />
              <h2 style={{ fontSize: '14px', fontWeight: 800, margin: 0, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#B9572B' }}>
                Next Action Required
              </h2>
            </div>

            {!isLinked ? (
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 700, margin: '0 0 6px 0', color: 'var(--ink)' }}>
                  Link your NEAR account
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--ink-muted)', margin: '0 0 1.2rem 0', lineHeight: 1.5 }}>
                  Before contribution credentials can be authorized and issued on-chain, you must link your NEAR
                  Protocol account using a cryptographic challenge.
                </p>
                <Link
                  to="/link-wallet"
                  className="btn-signet-primary"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '13px',
                    textDecoration: 'none',
                  }}
                >
                  Link NEAR Wallet <IconArrowRight size={14} />
                </Link>
              </div>
            ) : (
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 700, margin: '0 0 6px 0', color: 'var(--ink)' }}>
                  All systems ready for contribution review
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--ink-muted)', margin: '0 0 1.2rem 0', lineHeight: 1.5 }}>
                  Your GitHub identity and NEAR account are connected. Import merged pull requests or synchronize to
                  generate evidence dossiers.
                </p>
                <button
                  onClick={triggerSync}
                  disabled={syncState.isSyncing}
                  className="btn-signet-primary"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '13px',
                  }}
                >
                  {syncState.isSyncing ? 'Syncing...' : 'Sync Contributions Now'} <IconArrowRight size={14} />
                </button>
              </div>
            )}
          </div>

          <div style={{ marginTop: '1.2rem', paddingTop: '1rem', borderTop: '1px solid var(--rule)', fontSize: '11.5px', color: 'var(--ink-faint)' }}>
            Strict verification: no credentials are minted without your explicit evidence approval and wallet signature.
          </div>
        </div>

        {/* Manual PR Import Card */}
        <div
          style={{
            backgroundColor: 'var(--paper-raised)',
            border: '1px solid var(--rule)',
            borderRadius: '12px',
            padding: '1.6rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <IconCode size={16} color="#B9572B" />
            <h2 style={{ fontSize: '14px', fontWeight: 800, margin: 0, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink)' }}>
              Import Pull Request URL
            </h2>
          </div>

          <p style={{ fontSize: '13px', color: 'var(--ink-muted)', margin: '0 0 1rem 0' }}>
            Import any canonical GitHub merged PR. SIGNET extracts source facts, creates an immutable evidence
            snapshot, and evaluates eligibility.
          </p>

          <form onSubmit={handleManualImport} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input
              type="url"
              placeholder="https://github.com/owner/repository/pull/123"
              value={prUrlInput}
              onChange={(e) => setPrUrlInput(e.target.value)}
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid var(--rule)',
                backgroundColor: 'var(--paper)',
                color: 'var(--ink)',
                fontSize: '13px',
                fontFamily: 'monospace',
                outline: 'none',
              }}
            />

            {importError && (
              <div style={{ fontSize: '12px', color: '#D32F2F', fontWeight: 500 }}>
                {importError}
              </div>
            )}

            <button
              type="submit"
              disabled={isImporting || !prUrlInput.trim()}
              className="btn-signet-primary"
              style={{
                alignSelf: 'flex-start',
                fontSize: '13px',
                cursor: isImporting || !prUrlInput.trim() ? 'not-allowed' : 'pointer',
                opacity: !prUrlInput.trim() ? 0.6 : 1,
              }}
            >
              {isImporting ? 'Validating PR...' : 'Import PR & Generate Dossier'}
            </button>
          </form>
        </div>
      </section>

      {/* ── RECENT CONTRIBUTIONS & CREDENTIALS ── */}
      <section
        style={{
          backgroundColor: 'var(--paper-raised)',
          border: '1px solid var(--rule)',
          borderRadius: '12px',
          padding: '1.8rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px 0', color: 'var(--ink)', fontFamily: 'var(--font-serif)' }}>
              Recent Contributions Registry
            </h2>
            <p style={{ fontSize: '12.5px', color: 'var(--ink-muted)', margin: 0 }}>
              Audit trail of discovered pull requests and evidence snapshots
            </p>
          </div>

          <Link
            to="/contributions"
            style={{
              fontSize: '12.5px',
              fontWeight: 700,
              color: '#B9572B',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            View Full Registry <IconArrowRight size={13} />
          </Link>
        </div>

        {/* Empty state / clean explanation */}
        <div
          style={{
            padding: '3rem 2rem',
            textAlign: 'center',
            backgroundColor: 'var(--paper)',
            borderRadius: '8px',
            border: '1px dashed var(--rule)',
          }}
        >
          <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'center' }}>
            <CredentialSeal size={40} />
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 6px 0', color: 'var(--ink)' }}>
            No contribution evidence collected yet
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--ink-muted)', maxWidth: '440px', margin: '0 auto 1.5rem auto' }}>
            Connect your GitHub account or manually paste a merged pull request URL above to generate your first
            contribution evidence dossier.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            <button
              onClick={() => navigate('/verify/sample')}
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#B9572B',
                background: 'none',
                border: '1px solid rgba(185, 87, 43, 0.3)',
                borderRadius: '6px',
                padding: '6px 14px',
                cursor: 'pointer',
              }}
            >
              Inspect Illustrative Sample Credential <IconExternalLink size={12} />
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
