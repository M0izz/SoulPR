import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  IconSearch,
  IconFilter,
  IconCode,
  IconExternalLink,
  IconCheckCircle,
  IconAlertCircle,
  IconArrowRight,
} from '../../components/Icons'

export interface ContributionRecord {
  id: string
  repo: string
  prNumber: number
  prTitle: string
  prUrl: string
  mergedAt: string
  source: 'auto_sync' | 'manual_import'
  evidenceStatus: 'ready' | 'partial' | 'unavailable' | 'stale'
  assessmentStatus: 'eligible' | 'ineligible' | 'needs_attention' | 'not_assessed'
  credentialStatus: 'not_issued' | 'awaiting_approval' | 'awaiting_signature' | 'confirmed' | 'failed'
}

export default function ContributionsPage() {
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterSource, setFilterSource] = useState<string>('all')
  const [searchRepo, setSearchRepo] = useState<string>('')
  const [showImportModal, setShowImportModal] = useState<boolean>(false)
  const [importUrl, setImportUrl] = useState<string>('')
  const [importError, setImportError] = useState<string | null>(null)

  // Empty initial list adhering strictly to PRD: no fake records
  const [contributions] = useState<ContributionRecord[]>([])

  const handleImportSubmit = (e: FormEvent) => {
    e.preventDefault()
    setImportError(null)
    const match = importUrl.trim().match(/^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/i)
    if (!match) {
      setImportError('Invalid GitHub PR URL format. Expected: https://github.com/owner/repo/pull/123')
      return
    }
    // Closes modal and navigates to dossier
    setShowImportModal(false)
    setImportUrl('')
  }

  const filtered = contributions.filter((c) => {
    if (filterStatus !== 'all' && c.assessmentStatus !== filterStatus) return false
    if (filterSource !== 'all' && c.source !== filterSource) return false
    if (searchRepo && !c.repo.toLowerCase().includes(searchRepo.toLowerCase())) return false
    return true
  })

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* ── HEADER & ACTIONS ── */}
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
            Structured Contributions Registry
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--ink-muted)', margin: 0 }}>
            Operational registry of discovered and imported pull requests, evidence snapshots, and eligibility states.
          </p>
        </div>

        <button
          onClick={() => setShowImportModal(true)}
          className="btn-signet-primary"
          style={{
            fontSize: '13px',
          }}
        >
          <IconCode size={15} /> Import PR URL
        </button>
      </div>

      {/* ── FILTER BAR ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          backgroundColor: 'var(--paper-raised)',
          border: '1px solid var(--rule)',
          borderRadius: '10px',
          padding: '10px 14px',
        }}
      >
        {/* Repo search */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--paper)',
            border: '1px solid var(--rule)',
            borderRadius: '6px',
            padding: '6px 10px',
            flex: '1',
            minWidth: '200px',
          }}
        >
          <IconSearch size={14} color="var(--ink-muted)" />
          <input
            type="text"
            placeholder="Search by owner/repository..."
            value={searchRepo}
            onChange={(e) => setSearchRepo(e.target.value)}
            style={{
              border: 'none',
              background: 'transparent',
              fontSize: '13px',
              color: 'var(--ink)',
              outline: 'none',
              width: '100%',
            }}
          />
        </div>

        {/* Status filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <IconFilter size={13} color="var(--ink-muted)" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              padding: '6px 10px',
              borderRadius: '6px',
              border: '1px solid var(--rule)',
              backgroundColor: 'var(--paper)',
              color: 'var(--ink)',
              fontSize: '12.5px',
              cursor: 'pointer',
            }}
          >
            <option value="all">All Statuses</option>
            <option value="eligible">Eligible</option>
            <option value="needs_attention">Needs Attention</option>
            <option value="ineligible">Ineligible</option>
            <option value="not_assessed">Not Assessed</option>
          </select>
        </div>

        {/* Source filter */}
        <select
          value={filterSource}
          onChange={(e) => setFilterSource(e.target.value)}
          style={{
            padding: '6px 10px',
            borderRadius: '6px',
            border: '1px solid var(--rule)',
            backgroundColor: 'var(--paper)',
            color: 'var(--ink)',
            fontSize: '12.5px',
            cursor: 'pointer',
          }}
        >
          <option value="all">All Sources</option>
          <option value="auto_sync">Automatic Sync</option>
          <option value="manual_import">Manual Import</option>
        </select>
      </div>

      {/* ── REGISTRY TABLE ── */}
      <div
        style={{
          backgroundColor: 'var(--paper-raised)',
          border: '1px solid var(--rule)',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr
                style={{
                  backgroundColor: 'var(--paper)',
                  borderBottom: '1px solid var(--rule)',
                  color: 'var(--ink-muted)',
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                <th style={{ padding: '12px 16px' }}>Contribution</th>
                <th style={{ padding: '12px 16px' }}>Repository</th>
                <th style={{ padding: '12px 16px' }}>Merged</th>
                <th style={{ padding: '12px 16px' }}>Source</th>
                <th style={{ padding: '12px 16px' }}>Evidence</th>
                <th style={{ padding: '12px 16px' }}>Assessment</th>
                <th style={{ padding: '12px 16px' }}>Credential</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--ink-muted)' }}>
                    <div style={{ marginBottom: '10px' }}>
                      <IconCode size={32} color="var(--ink-faint)" />
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--ink)', marginBottom: '4px' }}>
                      No contribution records found
                    </div>
                    <div style={{ fontSize: '12.5px', color: 'var(--ink-muted)', maxWidth: '400px', margin: '0 auto 1.2rem auto' }}>
                      Synchronize your GitHub account or manually import a merged pull request URL to inspect its
                      evidence dossier.
                    </div>
                    <button
                      onClick={() => setShowImportModal(true)}
                      style={{
                        padding: '7px 14px',
                        borderRadius: '6px',
                        border: '1px solid #B9572B',
                        backgroundColor: 'transparent',
                        color: '#B9572B',
                        fontSize: '12.5px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Import Pull Request URL
                    </button>
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr
                    key={c.id}
                    style={{
                      borderBottom: '1px solid var(--rule)',
                      transition: 'background-color 0.15s ease',
                    }}
                  >
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--ink)' }}>{c.prTitle}</div>
                      <a
                        href={c.prUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          fontSize: '11.5px',
                          color: '#B9572B',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px',
                        }}
                      >
                        #{c.prNumber} <IconExternalLink size={10} />
                      </a>
                    </td>

                    <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontSize: '12px' }}>
                      {c.repo}
                    </td>

                    <td style={{ padding: '14px 16px', color: 'var(--ink-muted)', fontSize: '12px' }}>
                      {new Date(c.mergedAt).toLocaleDateString()}
                    </td>

                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          backgroundColor: 'var(--paper)',
                          border: '1px solid var(--rule)',
                        }}
                      >
                        {c.source === 'auto_sync' ? 'Auto-Sync' : 'Manual Import'}
                      </span>
                    </td>

                    <td style={{ padding: '14px 16px' }}>
                      {c.evidenceStatus === 'ready' && (
                        <span style={{ color: '#2E7D32', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 600 }}>
                          <IconCheckCircle size={13} /> Ready
                        </span>
                      )}
                      {c.evidenceStatus === 'partial' && (
                        <span style={{ color: '#E65100', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 600 }}>
                          <IconAlertCircle size={13} /> Partial
                        </span>
                      )}
                    </td>

                    <td style={{ padding: '14px 16px' }}>
                      {c.assessmentStatus === 'eligible' && (
                        <span style={{ color: '#2E7D32', fontWeight: 600, fontSize: '12px' }}>Eligible</span>
                      )}
                      {c.assessmentStatus === 'needs_attention' && (
                        <span style={{ color: '#E65100', fontWeight: 600, fontSize: '12px' }}>Needs Attention</span>
                      )}
                      {c.assessmentStatus === 'ineligible' && (
                        <span style={{ color: '#D32F2F', fontWeight: 600, fontSize: '12px' }}>Ineligible</span>
                      )}
                    </td>

                    <td style={{ padding: '14px 16px' }}>
                      {c.credentialStatus === 'confirmed' ? (
                        <span style={{ color: '#B9572B', fontWeight: 600, fontSize: '12px' }}>Confirmed</span>
                      ) : (
                        <span style={{ color: 'var(--ink-faint)', fontSize: '12px' }}>Not Issued</span>
                      )}
                    </td>

                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <Link
                        to={`/contributions/${c.id}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '12px',
                          fontWeight: 700,
                          color: '#B9572B',
                          textDecoration: 'none',
                        }}
                      >
                        Inspect Dossier <IconArrowRight size={12} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── MANUAL IMPORT MODAL ── */}
      {showImportModal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            onClick={() => setShowImportModal(false)}
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(3px)' }}
          />

          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '520px',
              backgroundColor: 'var(--paper-raised)',
              border: '1px solid var(--rule)',
              borderRadius: '14px',
              padding: '2rem',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>
                Import Pull Request Evidence
              </h2>
              <button
                onClick={() => setShowImportModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--ink-muted)', fontSize: '18px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--ink-muted)', margin: '0 0 1.2rem 0', lineHeight: 1.5 }}>
              Enter a canonical GitHub pull request URL. SIGNET will independently verify the repository facts, author
              identity, merge status, and commit SHA before creating an immutable evidence snapshot.
            </p>

            <form onSubmit={handleImportSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: 'var(--ink)' }}>
                  Canonical GitHub PR URL
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/owner/repository/pull/123"
                  value={importUrl}
                  onChange={(e) => setImportUrl(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid var(--rule)',
                    backgroundColor: 'var(--paper)',
                    color: 'var(--ink)',
                    fontSize: '13px',
                    fontFamily: 'monospace',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                />
                {importError && (
                  <div style={{ fontSize: '12px', color: '#D32F2F', marginTop: '6px', fontWeight: 500 }}>
                    {importError}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: '1px solid var(--rule)',
                    backgroundColor: 'transparent',
                    color: 'var(--ink)',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!importUrl.trim()}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: '#B9572B',
                    color: '#EDE2D0',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: importUrl.trim() ? 'pointer' : 'not-allowed',
                  }}
                >
                  Import & Generate Dossier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
