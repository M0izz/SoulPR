import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../lib/api'
import {
  IconGitHub,
  IconCheck,
  IconFolder,
  IconShieldCheck,
  IconZap,
  IconArrowRight,
} from '../components/Icons'

interface RepoItem {
  fullName: string
  tracked: boolean
}

export default function Install() {
  const [repos, setRepos] = useState<RepoItem[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [installationConfigured, setInstallationConfigured] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadRepos = async () => {
      try {
        const data = await api.getTrackedRepos()
        setInstallationConfigured(data.installationConfigured)
        setRepos(data.repos)
      } catch (err: any) {
        console.warn('[Install] Failed to load repositories:', err.message)
        setError('Unable to load repository configuration. Please check backend connection.')
      } finally {
        setLoading(false)
      }
    }
    loadRepos()
  }, [])

  function toggleRepo(fullName: string) {
    setSaved(false)
    setRepos((prev) =>
      prev.map((r) => (r.fullName === fullName ? { ...r, tracked: !r.tracked } : r))
    )
  }

  async function saveChanges() {
    setSaving(true)
    setError(null)
    setSaved(false)
    try {
      const trackedList = repos.filter((r) => r.tracked).map((r) => r.fullName)
      await api.saveTrackedRepos(trackedList)
      setSaved(true)
    } catch (err: any) {
      console.warn('[Install] Failed to save tracked repos:', err.message)
      setError(err.message || 'Unable to save repository configuration.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <main
        style={{
          minHeight: 'calc(100vh - 90px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--paper)',
        }}
      >
        <div
          role="status"
          aria-live="polite"
          style={{
            fontSize: '14px',
            color: 'var(--ink-muted)',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <span className="spinner" aria-hidden="true" style={{ width: '16px', height: '16px' }} />
          Loading tracked repositories...
        </div>
      </main>
    )
  }

  return (
    <main
      className="install-page signet-enter-fade"
      style={{
        minHeight: 'calc(100vh - 90px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3.5rem 1.5rem',
        background: 'var(--paper)',
      }}
    >
      <div style={{ maxWidth: '600px', width: '100%' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
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
              borderRadius: '99px',
              padding: '4px 14px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '1rem',
            }}
          >
            <IconZap size={12} color="var(--signet-orange)" />
            REPOSITORY DISCOVERY & TRACKING
          </span>
          <h1
            className="signet-headline"
            style={{ fontSize: '34px', color: 'var(--ink)', marginBottom: '8px' }}
          >
            Tracked Repositories
          </h1>
          <p
            style={{
              fontSize: '14.5px',
              color: 'var(--ink-muted)',
              lineHeight: '1.6',
              maxWidth: '480px',
              margin: '0 auto',
            }}
          >
            Choose which open-source repositories SIGNET monitors for merged contribution discovery and
            evidence dossier ingestion.
          </p>
        </div>

        {/* Card */}
        <div
          className="signet-glass-card"
          style={{
            padding: '2.2rem',
            background: 'var(--paper-raised)',
            border: '1px solid var(--rule-strong)',
            borderRadius: '20px',
          }}
        >
          {/* Configuration status banner */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'var(--paper)',
              border: '1px solid var(--rule)',
              borderRadius: '12px',
              padding: '1.1rem 1.3rem',
              marginBottom: '1.8rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'var(--signet-charcoal)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <IconGitHub size={20} color="#EDE2D0" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--ink)' }}>
                  SIGNET GitHub Integration
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--ink-muted)' }}>
                  {installationConfigured
                    ? 'Webhook listener and App integration active'
                    : 'GitHub App ID not configured in backend'}
                </div>
              </div>
            </div>

            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                background: installationConfigured
                  ? 'rgba(42, 125, 79, 0.12)'
                  : 'rgba(185, 87, 43, 0.1)',
                border: `1px solid ${
                  installationConfigured ? 'rgba(42, 125, 79, 0.3)' : 'var(--signet-orange-border)'
                }`,
                borderRadius: '99px',
                padding: '4px 12px',
                fontSize: '11px',
                color: installationConfigured ? '#2A7D4F' : 'var(--signet-orange)',
                fontWeight: 700,
              }}
            >
              <IconShieldCheck
                size={12}
                color={installationConfigured ? '#2A7D4F' : 'var(--signet-orange)'}
              />
              {installationConfigured ? 'Active' : 'Standby'}
            </span>
          </div>

          {/* Tracked Repos List */}
          <div
            style={{
              fontSize: '11px',
              fontWeight: 800,
              color: 'var(--signet-orange)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '10px',
            }}
          >
            SELECT REPOSITORIES TO MONITOR
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              marginBottom: '1.8rem',
            }}
          >
            {repos.length === 0 ? (
              <div
                role={error ? 'alert' : undefined}
                style={{
                  padding: '1.5rem',
                  border: '1px dashed var(--rule)',
                  borderRadius: '10px',
                  color: 'var(--ink-muted)',
                  fontSize: '13px',
                  textAlign: 'center',
                  background: 'var(--paper)',
                }}
              >
                {error || 'No repository catalog configured on the backend yet.'}
              </div>
            ) : (
              repos.map((repo) => (
                <div
                  key={repo.fullName}
                  role="checkbox"
                  tabIndex={0}
                  aria-checked={repo.tracked}
                  aria-label={`Track repository ${repo.fullName}`}
                  onClick={() => toggleRepo(repo.fullName)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      toggleRepo(repo.fullName)
                    }
                  }}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: `1px solid ${
                      repo.tracked ? 'var(--signet-orange)' : 'var(--rule)'
                    }`,
                    background: repo.tracked
                      ? 'var(--stamp-bg)'
                      : 'var(--paper)',
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <IconFolder
                      size={16}
                      color={repo.tracked ? 'var(--signet-orange)' : 'var(--ink-faint)'}
                    />
                    <span
                      style={{
                        fontSize: '13.5px',
                        fontWeight: repo.tracked ? 700 : 500,
                        color: 'var(--ink)',
                      }}
                    >
                      {repo.fullName}
                    </span>
                  </div>

                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '6px',
                      border: repo.tracked ? 'none' : '1.5px solid var(--rule-strong)',
                      background: repo.tracked ? 'var(--signet-orange)' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.18s ease',
                    }}
                  >
                    {repo.tracked && <IconCheck size={12} color="#EDE2D0" strokeWidth={3} />}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={saveChanges}
              disabled={saving || !installationConfigured || repos.length === 0}
              aria-busy={saving}
              className="btn-signet-primary"
              style={{
                flex: 1,
                minHeight: '44px',
                background: saved ? '#2A7D4F' : undefined,
              }}
            >
              {saved ? '✓ Changes Saved' : saving ? 'Saving...' : 'Save Configuration'}
            </button>

            <Link
              to="/dashboard"
              className="btn-signet-secondary"
              style={{ minHeight: '44px', fontSize: '13px' }}
            >
              Go to Workspace <IconArrowRight size={13} color="currentColor" />
            </Link>
          </div>

          {error && repos.length > 0 && (
            <div
              className="status-message signet-enter-fade"
              role="alert"
              aria-live="assertive"
              style={{ marginTop: '14px', color: '#DC2626', fontSize: '12.5px', fontWeight: 600 }}
            >
              {error}
            </div>
          )}

          {saved && (
            <div
              className="signet-enter-fade"
              role="status"
              aria-live="polite"
              style={{
                marginTop: '14px',
                color: '#2A7D4F',
                fontSize: '12.5px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <IconCheck size={14} color="#2A7D4F" />
              Repository monitoring configuration saved successfully.
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
