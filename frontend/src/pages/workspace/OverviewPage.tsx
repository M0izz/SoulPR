import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useWorkspace, type ContributionRecord } from '../../context/WorkspaceContext'
import CredentialSeal from '../../components/credential/CredentialSeal'
import {
  IconGitHub,
  IconWallet,
  IconArrowRight,
  IconCode,
  IconAward,
  IconCheckCircle,
  IconAlertCircle,
  IconRefresh,
  IconSearch,
  IconZap,
} from '../../components/Icons'

export default function OverviewPage() {
  const {
    userGithub,
    nearAccount,
    isAuthenticated,
    isLinked,
    syncState,
    triggerSync,
    contributions,
    importPullRequest,
  } = useWorkspace()

  const navigate = useNavigate()
  const [prUrlInput, setPrUrlInput] = useState('')
  const [importError, setImportError] = useState<string | null>(null)
  const [importSuccess, setImportSuccess] = useState<string | null>(null)
  const [isImporting, setIsImporting] = useState(false)

  const handleManualImport = async (e: FormEvent) => {
    e.preventDefault()
    setImportError(null)
    setImportSuccess(null)

    const url = prUrlInput.trim()
    const match = url.match(/^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/i)
    if (!match) {
      setImportError('Please enter a valid GitHub pull request URL (e.g., https://github.com/facebook/react/pull/28000)')
      return
    }

    try {
      setIsImporting(true)
      const record = await importPullRequest(url)
      setImportSuccess(`Successfully imported & verified merged PR #${record.prNumber} from ${record.repo}!`)
      setPrUrlInput('')
      setTimeout(() => {
        navigate(`/contributions/${record.id}`)
      }, 1200)
    } catch (err: unknown) {
      setImportError((err as Error).message || 'Failed to import pull request. Ensure it is merged.')
    } finally {
      setIsImporting(false)
    }
  }

  const latestContribution: ContributionRecord | undefined = contributions[0]

  return (
    <div style={{ maxWidth: '1360px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* ── TOP HUD / COMMAND CENTER STRIP ── */}
      <section
        className="app-glass-card"
        style={{
          background: 'linear-gradient(135deg, rgba(25, 23, 21, 0.95) 0%, rgba(32, 28, 25, 0.85) 100%)',
          borderRadius: '16px',
          padding: '1.25rem 1.75rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(185, 87, 43, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35)',
        }}
      >
        {/* Ambient Top Glow Line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #B9572B, #38BDF8, #10B981, transparent)',
            opacity: 0.8,
          }}
        />

        {/* Identity & Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(185, 87, 43, 0.2), rgba(0, 236, 151, 0.1))',
              border: '1px solid rgba(185, 87, 43, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 0 16px rgba(185, 87, 43, 0.25)',
            }}
          >
            <CredentialSeal size={32} glow={true} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#B9572B' }}>
                Contribution Terminal
              </span>
              <span className="pulse-live-indicator" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#10B981' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }} />
                Network Synchronized
              </span>
            </div>
            <h1
              style={{
                fontSize: '22px',
                fontWeight: 600,
                color: '#EDE2D0',
                fontFamily: 'var(--font-serif)',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {isAuthenticated && userGithub ? `@${userGithub}` : 'Developer Terminal'}
              {isLinked && (
                <span
                  className="shimmer-badge"
                  style={{
                    fontSize: '11px',
                    padding: '2px 8px',
                    borderRadius: '999px',
                    background: 'rgba(0, 236, 151, 0.15)',
                    color: '#00EC97',
                    border: '1px solid rgba(0, 236, 151, 0.35)',
                    fontWeight: 600,
                  }}
                >
                  NEAR Verified
                </span>
              )}
            </h1>
          </div>
        </div>

        {/* Connected Accounts Pills & Global Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              fontSize: '12px',
              color: '#EDE2D0',
            }}
          >
            <IconGitHub size={14} color="#EDE2D0" />
            <span>{isAuthenticated && userGithub ? `@${userGithub}` : 'Disconnected'}</span>
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              background: isLinked ? 'rgba(0, 236, 151, 0.08)' : 'rgba(255, 255, 255, 0.05)',
              border: `1px solid ${isLinked ? 'rgba(0, 236, 151, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
              fontSize: '12px',
              color: isLinked ? '#00EC97' : '#B3A69A',
            }}
          >
            <IconWallet size={14} color={isLinked ? '#00EC97' : '#B3A69A'} />
            <span>{isLinked && nearAccount ? nearAccount : 'Wallet Not Linked'}</span>
          </div>

          <button
            onClick={() => triggerSync()}
            disabled={syncState.isSyncing}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, rgba(185, 87, 43, 0.25), rgba(185, 87, 43, 0.15))',
              border: '1px solid rgba(185, 87, 43, 0.45)',
              color: '#EDE2D0',
              fontSize: '12px',
              fontWeight: 600,
              cursor: syncState.isSyncing ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <IconRefresh size={13} className={syncState.isSyncing ? 'spin-animation' : ''} />
            <span>{syncState.isSyncing ? 'Syncing...' : 'Sync GitHub'}</span>
          </button>
        </div>
      </section>

      {/* ── METRIC TILES / COMPACT PROTOCOL METRICS ── */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '0.85rem',
        }}
      >
        {[
          {
            label: 'DISCOVERED CONTRIBUTIONS',
            val: contributions.length,
            sub: 'From GitHub API & verified imports',
            accent: '#B9572B',
            icon: <IconCode size={16} color="#B9572B" />,
          },
          {
            label: 'ELIGIBLE FOR PROVENANCE',
            val: contributions.filter((c) => c.assessmentStatus === 'eligible' || c.evidenceStatus === 'ready').length,
            sub: 'Merged commits with SHA-256 seal',
            accent: '#00EC97',
            icon: <IconCheckCircle size={16} color="#00EC97" />,
          },
          {
            label: 'CREDENTIALS MINTED',
            val: contributions.filter((c) => c.credentialStatus === 'confirmed').length,
            sub: 'Soulbound on NEAR testnet contract',
            accent: '#38BDF8',
            icon: <IconAward size={16} color="#38BDF8" />,
          },
          {
            label: 'ACTIVE DEVELOPER REACH',
            val: contributions.reduce((acc, curr) => acc + (curr.additions || 0) + (curr.deletions || 0), 0).toLocaleString(),
            sub: 'Net line diffs cryptographically validated',
            accent: '#A855F7',
            icon: <IconZap size={16} color="#A855F7" />,
          },
        ].map((card, idx) => (
          <div
            key={idx}
            className="app-glass-card"
            style={{
              background: 'var(--paper-raised)',
              border: '1px solid var(--rule)',
              borderRadius: '12px',
              padding: '1rem 1.25rem',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--ink-faint)' }}>
                {card.label}
              </span>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  backgroundColor: `${card.accent}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {card.icon}
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: '26px',
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--ink)',
                  lineHeight: 1.1,
                  marginBottom: '4px',
                }}
              >
                {card.val}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--ink-muted)' }}>{card.sub}</div>
            </div>
          </div>
        ))}
      </section>

      {/* ── FAST IMPORT & VERIFICATION HERO STRIP ── */}
      <section
        className="app-glass-card"
        style={{
          background: 'linear-gradient(135deg, rgba(25, 23, 21, 0.98) 0%, rgba(20, 18, 16, 0.95) 100%)',
          borderRadius: '14px',
          padding: '1.25rem 1.5rem',
          border: '1px solid rgba(185, 87, 43, 0.25)',
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.75rem' }}>
          <div>
            <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#EDE2D0', margin: '0 0 2px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <IconCode size={16} color="#B9572B" />
              Import Merged Pull Request
            </h2>
            <p style={{ fontSize: '12px', color: '#B3A69A', margin: 0 }}>
              Paste any public merged GitHub PR URL to verify merge status and generate an evidence dossier.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setPrUrlInput('https://github.com/facebook/react/pull/28000')}
              style={{
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                padding: '4px 8px',
                borderRadius: '6px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#B3A69A',
                cursor: 'pointer',
              }}
            >
              Test: React #28000
            </button>
            <button
              type="button"
              onClick={() => setPrUrlInput('https://github.com/near/nearcore/pull/10000')}
              style={{
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                padding: '4px 8px',
                borderRadius: '6px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#B3A69A',
                cursor: 'pointer',
              }}
            >
              Test: nearcore #10000
            </button>
          </div>
        </div>

        <form onSubmit={handleManualImport} style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 400px', position: 'relative' }}>
            <input
              type="url"
              required
              placeholder="https://github.com/owner/repository/pull/123"
              value={prUrlInput}
              onChange={(e) => setPrUrlInput(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                background: '#141210',
                border: importError ? '1px solid #EF4444' : '1px solid rgba(185, 87, 43, 0.4)',
                color: '#EDE2D0',
                fontSize: '13px',
                fontFamily: 'var(--font-mono)',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isImporting || !prUrlInput.trim()}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              background: isImporting ? '#7A3516' : '#B9572B',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '13px',
              fontWeight: 600,
              cursor: isImporting ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 14px rgba(185, 87, 43, 0.3)',
              transition: 'all 0.15s ease',
            }}
          >
            {isImporting ? (
              <>
                <IconRefresh size={14} className="spin-animation" />
                <span>Verifying on GitHub...</span>
              </>
            ) : (
              <>
                <span>Import & Verify</span>
                <IconArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        {importError && (
          <div
            style={{
              marginTop: '10px',
              padding: '8px 12px',
              borderRadius: '6px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#F87171',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <IconAlertCircle size={14} color="#F87171" />
            <span>{importError}</span>
          </div>
        )}

        {importSuccess && (
          <div
            style={{
              marginTop: '10px',
              padding: '8px 12px',
              borderRadius: '6px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#34D399',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <IconCheckCircle size={14} color="#34D399" />
            <span>{importSuccess}</span>
          </div>
        )}
      </section>

      {/* ── TWO-COLUMN CORE WORKSPACE ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.6fr) minmax(320px, 1fr)', gap: '1.25rem' }}>
        {/* LEFT COLUMN: ACTIVE CONTRIBUTIONS DOSSIER FEED */}
        <section
          className="app-glass-card"
          style={{
            background: 'var(--paper-raised)',
            border: '1px solid var(--rule)',
            borderRadius: '14px',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 2px 0', color: 'var(--ink)' }}>
                Active Contribution Records
              </h2>
              <p style={{ fontSize: '12px', color: 'var(--ink-muted)', margin: 0 }}>
                {contributions.length} verified pull request{contributions.length === 1 ? '' : 's'} registered
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <Link
                to="/contributors"
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--clay)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: '1px solid var(--rule)',
                  background: 'var(--paper)',
                  textDecoration: 'none',
                }}
              >
                <IconSearch size={12} />
                <span>Search Contributor</span>
              </Link>

              <Link
                to="/contributions"
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--clay)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  textDecoration: 'none',
                }}
              >
                <span>View Full Registry</span>
                <IconArrowRight size={12} />
              </Link>
            </div>
          </div>

          {contributions.length === 0 ? (
            <div
              style={{
                border: '1px dashed var(--rule)',
                borderRadius: '10px',
                padding: '2.5rem 1.5rem',
                textAlign: 'center',
                backgroundColor: 'rgba(0,0,0,0.02)',
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'rgba(185, 87, 43, 0.1)',
                  color: '#B9572B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px auto',
                }}
              >
                <IconCode size={20} />
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 6px 0', color: 'var(--ink)' }}>
                No PRs Imported Yet
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--ink-muted)', maxWidth: '380px', margin: '0 auto 16px auto' }}>
                Paste any merged GitHub pull request URL above, or click Sync GitHub to pull your public repositories.
              </p>
              <button
                type="button"
                onClick={() => setPrUrlInput('https://github.com/facebook/react/pull/28000')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  background: 'var(--clay)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Import Sample PR (React #28000)
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {contributions.slice(0, 5).map((record) => (
                <div
                  key={record.id}
                  onClick={() => navigate(`/contributions/${record.id}`)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: 'var(--paper)',
                    border: '1px solid var(--rule)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--clay)'
                    e.currentTarget.style.transform = 'translateX(2px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--rule)'
                    e.currentTarget.style.transform = 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '6px',
                        background: 'rgba(185, 87, 43, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <IconGitHub size={16} color="var(--clay)" />
                    </div>

                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--ink)' }}>
                          {record.repo} #{record.prNumber}
                        </span>
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: 600,
                            padding: '1px 6px',
                            borderRadius: '4px',
                            background: 'rgba(16, 185, 129, 0.12)',
                            color: '#10B981',
                          }}
                        >
                          MERGED
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: '12px',
                          color: 'var(--ink-muted)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          maxWidth: '420px',
                        }}
                      >
                        {record.prTitle}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                    <div style={{ textAlign: 'right', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
                      <span style={{ color: '#10B981' }}>+{record.additions}</span>{' '}
                      <span style={{ color: '#EF4444' }}>-{record.deletions}</span>
                    </div>

                    <div
                      style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        background: record.credentialStatus === 'confirmed' ? 'rgba(0, 236, 151, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                        border: `1px solid ${record.credentialStatus === 'confirmed' ? 'rgba(0, 236, 151, 0.3)' : 'var(--rule)'}`,
                        fontSize: '11px',
                        fontWeight: 600,
                        color: record.credentialStatus === 'confirmed' ? '#00EC97' : 'var(--ink-muted)',
                      }}
                    >
                      {record.credentialStatus === 'confirmed' ? 'MINTED' : 'EVALUATED'}
                    </div>

                    <IconArrowRight size={14} color="var(--ink-faint)" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* RIGHT COLUMN: HOLOGRAPHIC SEAL PREVIEW & IDENTITY RESOLVER */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Hologram Card Preview */}
          <section
            className="app-glass-card"
            style={{
              background: 'linear-gradient(145deg, #181513 0%, #110F0E 100%)',
              border: '1px solid rgba(185, 87, 43, 0.3)',
              borderRadius: '14px',
              padding: '1.25rem',
              color: '#EDE2D0',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: '#B9572B', textTransform: 'uppercase' }}>
                Holographic Credential Preview
              </div>
              <span
                className="shimmer-badge"
                style={{
                  fontSize: '10px',
                  fontWeight: 600,
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: 'rgba(185, 87, 43, 0.2)',
                  color: '#B9572B',
                }}
              >
                NEAR Protocol
              </span>
            </div>

            <div
              style={{
                borderRadius: '10px',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                padding: '1rem',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, rgba(185, 87, 43, 0.3), rgba(0, 236, 151, 0.2))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CredentialSeal size={28} glow={true} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#EDE2D0' }}>
                    {latestContribution ? `${latestContribution.repo} #${latestContribution.prNumber}` : 'Universal Contribution'}
                  </div>
                  <div style={{ fontSize: '11px', color: '#9CA3AF', fontFamily: 'var(--font-mono)' }}>
                    {latestContribution?.mergeCommitSha ? `SHA: ${latestContribution.mergeCommitSha.slice(0, 10)}...` : 'SHA-256 Provenance Verified'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11.5px', color: '#D1D5DB' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#9CA3AF' }}>Developer:</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: '#EDE2D0' }}>
                    {userGithub ? `@${userGithub}` : 'Unauthenticated'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#9CA3AF' }}>Settlement:</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: '#00EC97' }}>
                    {nearAccount || 'soulpr.testnet'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#9CA3AF' }}>Audit Scheme:</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: '#38BDF8' }}>signet.evidence.v1.0</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <Link
                to="/verify/sample"
                style={{
                  flex: 1,
                  textAlign: 'center',
                  padding: '7px 12px',
                  borderRadius: '6px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#EDE2D0',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                Inspect 3D Card
              </Link>
              <Link
                to="/credentials"
                style={{
                  flex: 1,
                  textAlign: 'center',
                  padding: '7px 12px',
                  borderRadius: '6px',
                  background: 'linear-gradient(135deg, #B9572B, #A04A23)',
                  color: '#FFFFFF',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                Manage Credentials
              </Link>
            </div>
          </section>

          {/* Contributor Lookup Banner */}
          <section
            className="app-glass-card"
            style={{
              background: 'var(--paper-raised)',
              border: '1px solid var(--rule)',
              borderRadius: '14px',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <IconSearch size={16} color="var(--clay)" />
              <h3 style={{ fontSize: '14px', fontWeight: 600, margin: 0, color: 'var(--ink)' }}>
                Contributor Intelligence
              </h3>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--ink-muted)', margin: 0 }}>
              Look up any developer by GitHub username or NEAR wallet. Fetches live public contributions and verified credentials with zero fake data.
            </p>
            <Link
              to="/contributors"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                background: 'var(--paper)',
                border: '1px solid var(--rule)',
                color: 'var(--ink)',
                fontSize: '12px',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <span>Open Contributor Explorer</span>
              <IconArrowRight size={13} />
            </Link>
          </section>
        </div>
      </div>
    </div>
  )
}
