import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  useWorkspace,
  type ContributionType,
  type EvidenceClassification,
} from '../../context/WorkspaceContext'
import {
  IconSearch,
  IconFilter,
  IconCode,
  IconExternalLink,
  IconCheckCircle,
  IconArrowRight,
  IconCheck,
  IconGlobe,
  IconAward,
} from '../../components/Icons'

export default function ContributionsPage() {
  const navigate = useNavigate()
  const {
    contributions,
    importPullRequest,
    importProjectOwnership,
    importCommunityContribution,
  } = useWorkspace()

  const [filterType, setFilterType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchRepo, setSearchRepo] = useState<string>('')

  // Modal states
  const [showImportModal, setShowImportModal] = useState<boolean>(false)
  const [modalTab, setModalTab] = useState<ContributionType>('external')
  const [importUrl, setImportUrl] = useState<string>('')
  const [communityType, setCommunityType] = useState<'code_review' | 'issue_triage' | 'documentation'>('code_review')
  const [importError, setImportError] = useState<string | null>(null)
  const [importSuccess, setImportSuccess] = useState<string | null>(null)
  const [isImporting, setIsImporting] = useState<boolean>(false)

  const handleImportSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setImportError(null)
    setImportSuccess(null)
    setIsImporting(true)

    try {
      let record
      if (modalTab === 'external') {
        record = await importPullRequest(importUrl)
        setImportSuccess(`Successfully imported merged PR #${record.prNumber} from ${record.repo}!`)
      } else if (modalTab === 'maintainer') {
        record = await importProjectOwnership(importUrl)
        setImportSuccess(`Successfully verified repository ownership for ${record.repo}!`)
      } else {
        record = await importCommunityContribution(importUrl, communityType)
        setImportSuccess(`Successfully verified community ${communityType.replace('_', ' ')} on ${record.repo}!`)
      }

      setTimeout(() => {
        setShowImportModal(false)
        setImportSuccess(null)
        setImportUrl('')
        navigate(`/contributions/${record.id}`)
      }, 1000)
    } catch (err: any) {
      setImportError(err.message || 'Import failed')
    } finally {
      setIsImporting(false)
    }
  }

  const handleQuickImport = async (sampleUrl: string, type: ContributionType = 'external') => {
    setImportUrl(sampleUrl)
    setModalTab(type)
    setImportError(null)
    setIsImporting(true)
    try {
      let record
      if (type === 'external') {
        record = await importPullRequest(sampleUrl)
      } else if (type === 'maintainer') {
        record = await importProjectOwnership(sampleUrl)
      } else {
        record = await importCommunityContribution(sampleUrl, 'code_review')
      }
      setImportSuccess(`Successfully verified ${record.repo}!`)
      setTimeout(() => {
        setShowImportModal(false)
        setImportSuccess(null)
        setImportUrl('')
        navigate(`/contributions/${record.id}`)
      }, 1000)
    } catch (err: any) {
      setImportError(err.message || 'Import failed')
    } finally {
      setIsImporting(false)
    }
  }

  // Filter contributions
  const filtered = contributions.filter((c) => {
    if (filterType !== 'all' && c.contributionType !== filterType) return false
    if (filterStatus !== 'all' && c.assessmentStatus !== filterStatus) return false
    if (searchRepo && !c.repo.toLowerCase().includes(searchRepo.toLowerCase())) return false
    return true
  })

  const getBadgeStyle = (classification: EvidenceClassification) => {
    switch (classification) {
      case 'independently_merged':
        return { label: 'INDEPENDENTLY MERGED', color: '#10B981', bg: 'rgba(16, 185, 129, 0.12)' }
      case 'self_maintained':
        return { label: 'SELF-MAINTAINED', color: '#38BDF8', bg: 'rgba(56, 189, 248, 0.12)' }
      case 'community_verified':
        return { label: 'COMMUNITY VERIFIED', color: '#A855F7', bg: 'rgba(168, 85, 247, 0.12)' }
      case 'maintainer_verified':
        return { label: 'MAINTAINER VERIFIED', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.12)' }
      default:
        return { label: 'GITHUB VERIFIED', color: '#B9572B', bg: 'rgba(185, 87, 43, 0.12)' }
    }
  }

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
            Structured Contributions Registry
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--ink-muted)', margin: 0 }}>
            Unified registry of external merged pull requests, self-maintained open-source projects, and community contributions.
          </p>
        </div>

        <button
          onClick={() => {
            setShowImportModal(true)
            setImportError(null)
            setImportSuccess(null)
          }}
          className="btn-signet-primary"
          style={{ fontSize: '13px' }}
        >
          <IconCode size={15} /> Verify Contribution
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

        {/* Contribution Type Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <IconFilter size={14} color="var(--ink-muted)" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{
              backgroundColor: 'var(--paper)',
              border: '1px solid var(--rule)',
              borderRadius: '6px',
              padding: '6px 10px',
              fontSize: '12.5px',
              color: 'var(--ink)',
              outline: 'none',
            }}
          >
            <option value="all">All Contribution Types</option>
            <option value="external">01. External PRs</option>
            <option value="maintainer">02. Project Ownership & Maintenance</option>
            <option value="community">03. Community & Reviews</option>
          </select>
        </div>

        {/* Assessment status filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{
            backgroundColor: 'var(--paper)',
            border: '1px solid var(--rule)',
            borderRadius: '6px',
            padding: '6px 10px',
            fontSize: '12.5px',
            color: 'var(--ink)',
            outline: 'none',
          }}
        >
          <option value="all">All Eligibility</option>
          <option value="eligible">Eligible</option>
          <option value="needs_attention">Needs Review</option>
        </select>
      </div>

      {/* ── REGISTRY TABLE ── */}
      <div
        className="app-glass-card"
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
                <th style={{ padding: '12px 16px' }}>Contribution & Type</th>
                <th style={{ padding: '12px 16px' }}>Repository</th>
                <th style={{ padding: '12px 16px' }}>Classification</th>
                <th style={{ padding: '12px 16px' }}>Diff / Activity</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--ink-muted)' }}>
                    <div style={{ marginBottom: '10px' }}>
                      <IconCode size={32} color="var(--ink-faint)" />
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--ink)', marginBottom: '4px' }}>
                      No contribution records found
                    </div>
                    <div style={{ fontSize: '12.5px', color: 'var(--ink-muted)', maxWidth: '400px', margin: '0 auto 1.2rem auto' }}>
                      Verify external PRs, repositories you maintain, or collaborative reviews to build your contribution identity.
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
                      Verify Contribution
                    </button>
                  </td>
                </tr>
              ) : (
                filtered.map((c) => {
                  const badge = getBadgeStyle(c.evidenceClassification)
                  return (
                    <tr
                      key={c.id}
                      style={{
                        borderBottom: '1px solid var(--rule)',
                        transition: 'background-color 0.15s ease',
                      }}
                    >
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                          {c.contributionType === 'external' && <IconCode size={14} color="#10B981" />}
                          {c.contributionType === 'maintainer' && <IconGlobe size={14} color="#38BDF8" />}
                          {c.contributionType === 'community' && <IconAward size={14} color="#A855F7" />}
                          <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{c.prTitle}</span>
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--ink-muted)' }}>
                          {c.contributionType === 'external' && '01. External PR Merged'}
                          {c.contributionType === 'maintainer' && '02. Creator & Lead Maintainer'}
                          {c.contributionType === 'community' && '03. Community Code Review'}
                        </div>
                      </td>

                      <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)' }}>
                        <a
                          href={c.prUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: 'var(--clay)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          {c.repo} {c.prNumber ? `#${c.prNumber}` : ''} <IconExternalLink size={11} />
                        </a>
                      </td>

                      <td style={{ padding: '14px 16px' }}>
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '4px',
                            background: badge.bg,
                            color: badge.color,
                            border: `1px solid ${badge.color}40`,
                            letterSpacing: '0.04em',
                          }}
                        >
                          {badge.label}
                        </span>
                      </td>

                      <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                        {c.maintainerEvidence ? (
                          <span>
                            ★ {c.maintainerEvidence.stars} · {c.maintainerEvidence.releasesCount} rels
                          </span>
                        ) : (
                          <span>
                            <span style={{ color: '#10B981' }}>+{c.additions}</span>{' '}
                            <span style={{ color: '#EF4444' }}>-{c.deletions}</span>
                          </span>
                        )}
                      </td>

                      <td style={{ padding: '14px 16px' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '11px',
                            fontWeight: 700,
                            color: c.credentialStatus === 'confirmed' ? '#10B981' : '#F59E0B',
                          }}
                        >
                          <IconCheckCircle size={13} />
                          {c.credentialStatus === 'confirmed' ? 'MINTED' : 'EVALUATED'}
                        </span>
                      </td>

                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <Link
                          to={`/contributions/${c.id}`}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '5px 12px',
                            borderRadius: '6px',
                            backgroundColor: 'var(--paper)',
                            border: '1px solid var(--rule)',
                            color: 'var(--clay)',
                            fontSize: '12px',
                            fontWeight: 600,
                            textDecoration: 'none',
                          }}
                        >
                          Inspect Dossier <IconArrowRight size={12} />
                        </Link>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── IMPORT MODAL FOR THE 3 CONTRIBUTION PILLARS ── */}
      {showImportModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '1rem',
            backdropFilter: 'blur(4px)',
          }}
        >
          <div
            className="app-glass-card"
            style={{
              width: '100%',
              maxWidth: '560px',
              backgroundColor: 'var(--paper-raised)',
              border: '1px solid var(--rule)',
              borderRadius: '14px',
              padding: '2rem',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>
                Verify Contribution Evidence
              </h2>
              <button
                onClick={() => setShowImportModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--ink-muted)', fontSize: '18px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {/* Modal Pillar Selector */}
            <div
              style={{
                display: 'flex',
                background: 'rgba(0,0,0,0.2)',
                borderRadius: '8px',
                padding: '3px',
                marginBottom: '1.2rem',
                border: '1px solid var(--rule)',
              }}
            >
              {[
                { id: 'external', label: '01. External PR' },
                { id: 'maintainer', label: '02. Project Ownership' },
                { id: 'community', label: '03. Community & Review' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setModalTab(tab.id as ContributionType)
                    setImportError(null)
                    setImportSuccess(null)
                    setImportUrl('')
                  }}
                  style={{
                    flex: 1,
                    padding: '6px 8px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '11.5px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: modalTab === tab.id ? 'var(--clay)' : 'transparent',
                    color: modalTab === tab.id ? '#FFFFFF' : 'var(--ink-muted)',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleImportSubmit}>
              {modalTab === 'community' && (
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: 'var(--ink)' }}>
                    Community Activity Type
                  </label>
                  <select
                    value={communityType}
                    onChange={(e) => setCommunityType(e.target.value as any)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--rule)',
                      backgroundColor: 'var(--paper)',
                      color: 'var(--ink)',
                      fontSize: '13px',
                    }}
                  >
                    <option value="code_review">Code Review & Approval</option>
                    <option value="issue_triage">Issue Triage & Resolution</option>
                    <option value="documentation">Documentation Improvement</option>
                  </select>
                </div>
              )}

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: 'var(--ink)' }}>
                  {modalTab === 'external'
                    ? 'Canonical GitHub PR URL'
                    : modalTab === 'maintainer'
                    ? 'Repository URL or Name (owner/repo)'
                    : 'Target PR or Issue URL'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    modalTab === 'external'
                      ? 'https://github.com/owner/repository/pull/123'
                      : modalTab === 'maintainer'
                      ? 'https://github.com/owner/repo or owner/repo'
                      : 'https://github.com/owner/repo/pull/123'
                  }
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
                {importSuccess && (
                  <div style={{ fontSize: '12.5px', color: '#2A7D4F', marginTop: '8px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <IconCheck size={14} color="#2A7D4F" /> {importSuccess}
                  </div>
                )}
              </div>

              {/* Quick sample chips */}
              <div style={{ marginBottom: '1.2rem' }}>
                <span style={{ fontSize: '11px', color: 'var(--ink-muted)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                  Quick test with verified open-source targets:
                </span>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {modalTab === 'external' && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleQuickImport('https://github.com/facebook/react/pull/28000', 'external')}
                        disabled={isImporting}
                        style={{
                          padding: '4px 10px',
                          fontSize: '11.5px',
                          borderRadius: '6px',
                          border: '1px solid var(--rule)',
                          backgroundColor: 'var(--paper)',
                          color: 'var(--ink-muted)',
                          cursor: isImporting ? 'wait' : 'pointer',
                          fontFamily: 'var(--font-mono)',
                        }}
                      >
                        + React #28000
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickImport('https://github.com/near/nearcore/pull/10000', 'external')}
                        disabled={isImporting}
                        style={{
                          padding: '4px 10px',
                          fontSize: '11.5px',
                          borderRadius: '6px',
                          border: '1px solid var(--rule)',
                          backgroundColor: 'var(--paper)',
                          color: 'var(--ink-muted)',
                          cursor: isImporting ? 'wait' : 'pointer',
                          fontFamily: 'var(--font-mono)',
                        }}
                      >
                        + nearcore #10000
                      </button>
                    </>
                  )}

                  {modalTab === 'maintainer' && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleQuickImport('https://github.com/M0izz/SoulPR', 'maintainer')}
                        disabled={isImporting}
                        style={{
                          padding: '4px 10px',
                          fontSize: '11.5px',
                          borderRadius: '6px',
                          border: '1px solid var(--rule)',
                          backgroundColor: 'var(--paper)',
                          color: 'var(--ink-muted)',
                          cursor: isImporting ? 'wait' : 'pointer',
                          fontFamily: 'var(--font-mono)',
                        }}
                      >
                        + M0izz/SoulPR
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickImport('https://github.com/pallets/flask', 'maintainer')}
                        disabled={isImporting}
                        style={{
                          padding: '4px 10px',
                          fontSize: '11.5px',
                          borderRadius: '6px',
                          border: '1px solid var(--rule)',
                          backgroundColor: 'var(--paper)',
                          color: 'var(--ink-muted)',
                          cursor: isImporting ? 'wait' : 'pointer',
                          fontFamily: 'var(--font-mono)',
                        }}
                      >
                        + pallets/flask
                      </button>
                    </>
                  )}

                  {modalTab === 'community' && (
                    <button
                      type="button"
                      onClick={() => handleQuickImport('https://github.com/facebook/react/pull/28014', 'community')}
                      disabled={isImporting}
                      style={{
                        padding: '4px 10px',
                        fontSize: '11.5px',
                        borderRadius: '6px',
                        border: '1px solid var(--rule)',
                        backgroundColor: 'var(--paper)',
                        color: 'var(--ink-muted)',
                        cursor: isImporting ? 'wait' : 'pointer',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      + React #28014 Review
                    </button>
                  )}
                </div>
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
                  disabled={!importUrl.trim() || isImporting}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: '#B9572B',
                    color: '#EDE2D0',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: importUrl.trim() && !isImporting ? 'pointer' : 'not-allowed',
                    opacity: isImporting ? 0.7 : 1,
                  }}
                >
                  {isImporting ? 'Validating on GitHub...' : 'Verify Evidence Dossier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
