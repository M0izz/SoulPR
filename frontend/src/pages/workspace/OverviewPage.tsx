import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useWorkspace, type ContributionType, type EvidenceClassification } from '../../context/WorkspaceContext'
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
  IconGlobe,
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
    importProjectOwnership,
    importCommunityContribution,
  } = useWorkspace()

  const navigate = useNavigate()

  // Active contribution registration tab: 1 (External), 2 (Maintainer), 3 (Community)
  const [activeTab, setActiveTab] = useState<ContributionType>('external')
  const [filterType, setFilterType] = useState<'all' | ContributionType>('all')

  // Form input states
  const [inputUrl, setInputUrl] = useState('')
  const [communityType, setCommunityType] = useState<'code_review' | 'issue_triage' | 'documentation'>('code_review')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const [actionSuccess, setActionSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setActionError(null)
    setActionSuccess(null)
    const val = inputUrl.trim()
    if (!val) return

    try {
      setIsSubmitting(true)
      if (activeTab === 'external') {
        const record = await importPullRequest(val)
        setActionSuccess(`Verified merged PR #${record.prNumber} from ${record.repo}!`)
        setInputUrl('')
        setTimeout(() => navigate(`/contributions/${record.id}`), 1000)
      } else if (activeTab === 'maintainer') {
        const record = await importProjectOwnership(val)
        setActionSuccess(`Verified repository ownership & maintenance signals for ${record.repo}!`)
        setInputUrl('')
        setTimeout(() => navigate(`/contributions/${record.id}`), 1000)
      } else {
        const record = await importCommunityContribution(val, communityType)
        setActionSuccess(`Verified collaborative ${communityType.replace('_', ' ')} on ${record.repo}!`)
        setInputUrl('')
        setTimeout(() => navigate(`/contributions/${record.id}`), 1000)
      }
    } catch (err: unknown) {
      setActionError((err as Error).message || 'Verification failed. Please verify input URL.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredContributions =
    filterType === 'all' ? contributions : contributions.filter((c) => c.contributionType === filterType)

  const getClassificationBadge = (classification: EvidenceClassification) => {
    switch (classification) {
      case 'independently_merged':
        return { label: 'INDEPENDENTLY MERGED', color: '#10B981', bg: 'rgba(16, 185, 129, 0.12)', border: 'rgba(16, 185, 129, 0.3)' }
      case 'self_maintained':
        return { label: 'SELF-MAINTAINED', color: '#38BDF8', bg: 'rgba(56, 189, 248, 0.12)', border: 'rgba(56, 189, 248, 0.3)' }
      case 'community_verified':
        return { label: 'COMMUNITY VERIFIED', color: '#A855F7', bg: 'rgba(168, 85, 247, 0.12)', border: 'rgba(168, 85, 247, 0.3)' }
      case 'maintainer_verified':
        return { label: 'MAINTAINER VERIFIED', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.12)', border: 'rgba(245, 158, 11, 0.3)' }
      case 'github_verified':
      default:
        return { label: 'GITHUB VERIFIED', color: '#B9572B', bg: 'rgba(185, 87, 43, 0.12)', border: 'rgba(185, 87, 43, 0.3)' }
    }
  }

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
            background: 'linear-gradient(90deg, transparent, #B9572B, #38BDF8, #A855F7, transparent)',
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#B9572B', whiteSpace: 'nowrap' }}>
                Universal Contribution Terminal
              </span>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '11px',
                  color: '#10B981',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  padding: '2px 8px',
                  borderRadius: '99px',
                  whiteSpace: 'nowrap',
                  fontWeight: 600,
                  lineHeight: '1.2',
                }}
              >
                <span className="pulse-live-indicator" style={{ width: '6px', height: '6px', backgroundColor: '#10B981' }} />
                <span>Network Synchronized</span>
              </div>
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

      {/* ── 4 KPI TILES ACROSS THE THREE CONTRIBUTION TYPES ── */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '0.85rem',
        }}
      >
        {[
          {
            label: 'TOTAL VERIFIED WORK',
            val: contributions.length,
            sub: 'Across all 3 contribution pillars',
            accent: '#B9572B',
            icon: <IconZap size={16} color="#B9572B" />,
          },
          {
            label: '01. EXTERNAL CONTRIBUTIONS',
            val: contributions.filter((c) => c.contributionType === 'external').length,
            sub: 'Strongest independent merged code',
            accent: '#10B981',
            icon: <IconCode size={16} color="#10B981" />,
          },
          {
            label: '02. MAINTAINED PROJECTS',
            val: contributions.filter((c) => c.contributionType === 'maintainer').length,
            sub: 'Owned repos, licenses & releases',
            accent: '#38BDF8',
            icon: <IconGlobe size={16} color="#38BDF8" />,
          },
          {
            label: '03. COMMUNITY & REVIEWS',
            val: contributions.filter((c) => c.contributionType === 'community').length,
            sub: 'Collaborative code reviews & triage',
            accent: '#A855F7',
            icon: <IconAward size={16} color="#A855F7" />,
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
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'transform 0.2s ease, border-color 0.2s ease',
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

      {/* ── THREE-PILLAR CONTRIBUTION VERIFICATION ENGINE ── */}
      <section
        className="app-glass-card"
        style={{
          background: 'linear-gradient(135deg, rgba(25, 23, 21, 0.98) 0%, rgba(20, 18, 16, 0.95) 100%)',
          borderRadius: '14px',
          padding: '1.4rem 1.6rem',
          border: '1px solid rgba(185, 87, 43, 0.25)',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.2rem' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#B9572B', marginBottom: '4px' }}>
              Multi-Pillar Evidence Engine
            </div>
            <h2 style={{ fontSize: '17px', fontWeight: 600, color: '#EDE2D0', margin: 0 }}>
              Establish Your Work According to its Verifiable Source
            </h2>
          </div>

          {/* 3 Pillar Mode Selector Tabs */}
          <div
            style={{
              display: 'flex',
              background: 'rgba(0, 0, 0, 0.4)',
              borderRadius: '8px',
              padding: '3px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            {[
              { id: 'external', label: '01. External PRs', color: '#10B981' },
              { id: 'maintainer', label: '02. Project Ownership', color: '#38BDF8' },
              { id: 'community', label: '03. Community & Reviews', color: '#A855F7' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id as ContributionType)
                  setActionError(null)
                  setActionSuccess(null)
                  setInputUrl('')
                }}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: activeTab === tab.id ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                  color: activeTab === tab.id ? tab.color : '#B3A69A',
                  transition: 'all 0.15s ease',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Verification Details & Context */}
        <div
          style={{
            padding: '10px 14px',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            marginBottom: '1rem',
            fontSize: '12px',
            color: '#B3A69A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          {activeTab === 'external' && (
            <div>
              <strong style={{ color: '#10B981' }}>Strongest Independent Evidence:</strong> Checks PR author, target repository, merge status, commit association, and maintainer reviewer checks.
            </div>
          )}
          {activeTab === 'maintainer' && (
            <div>
              <strong style={{ color: '#38BDF8' }}>Maintainer Contribution:</strong> Verifies account control, repository ownership, open-source license, commit history cadence, releases, and community activity.
            </div>
          )}
          {activeTab === 'community' && (
            <div>
              <strong style={{ color: '#A855F7' }}>Collaborative Evidence:</strong> Verifies PR code reviews, approved sign-offs, issue resolution triage, documentation, and release management.
            </div>
          )}

          {/* Quick Test Chips for Active Tab */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {activeTab === 'external' && (
              <>
                <button
                  type="button"
                  onClick={() => setInputUrl('https://github.com/facebook/react/pull/28000')}
                  style={{
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                    padding: '3px 8px',
                    borderRadius: '4px',
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
                  onClick={() => setInputUrl('https://github.com/near/nearcore/pull/10000')}
                  style={{
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#B3A69A',
                    cursor: 'pointer',
                  }}
                >
                  Test: nearcore #10000
                </button>
              </>
            )}

            {activeTab === 'maintainer' && (
              <>
                <button
                  type="button"
                  onClick={() => setInputUrl('https://github.com/M0izz/SoulPR')}
                  style={{
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#B3A69A',
                    cursor: 'pointer',
                  }}
                >
                  Test: M0izz/SoulPR
                </button>
                <button
                  type="button"
                  onClick={() => setInputUrl('https://github.com/pallets/flask')}
                  style={{
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#B3A69A',
                    cursor: 'pointer',
                  }}
                >
                  Test: pallets/flask
                </button>
              </>
            )}

            {activeTab === 'community' && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setCommunityType('code_review')
                    setInputUrl('https://github.com/facebook/react/pull/28014')
                  }}
                  style={{
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#B3A69A',
                    cursor: 'pointer',
                  }}
                >
                  Test: React #28014 Review
                </button>
              </>
            )}
          </div>
        </div>

        {/* Verification Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {activeTab === 'community' && (
            <select
              value={communityType}
              onChange={(e) => setCommunityType(e.target.value as any)}
              style={{
                padding: '10px 12px',
                borderRadius: '8px',
                background: '#141210',
                border: '1px solid rgba(185, 87, 43, 0.4)',
                color: '#EDE2D0',
                fontSize: '13px',
                outline: 'none',
              }}
            >
              <option value="code_review">Code Review & Approval</option>
              <option value="issue_triage">Issue Triage & Resolution</option>
              <option value="documentation">Documentation Improvement</option>
              <option value="release_management">Release Management</option>
            </select>
          )}

          <div style={{ flex: '1 1 360px' }}>
            <input
              type="text"
              required
              placeholder={
                activeTab === 'external'
                  ? 'https://github.com/owner/repository/pull/123'
                  : activeTab === 'maintainer'
                  ? 'https://github.com/owner/repository or owner/repository'
                  : 'https://github.com/owner/repository/pull/123 or issue URL'
              }
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                background: '#141210',
                border: actionError ? '1px solid #EF4444' : '1px solid rgba(185, 87, 43, 0.4)',
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
            disabled={isSubmitting || !inputUrl.trim()}
            style={{
              padding: '10px 22px',
              borderRadius: '8px',
              background: isSubmitting ? '#7A3516' : '#B9572B',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '13px',
              fontWeight: 600,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 14px rgba(185, 87, 43, 0.3)',
              transition: 'all 0.15s ease',
            }}
          >
            {isSubmitting ? (
              <>
                <IconRefresh size={14} className="spin-animation" />
                <span>Verifying Source...</span>
              </>
            ) : (
              <>
                <span>
                  {activeTab === 'external'
                    ? 'Verify External PR'
                    : activeTab === 'maintainer'
                    ? 'Verify Project Ownership'
                    : 'Verify Community Evidence'}
                </span>
                <IconArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        {actionError && (
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
            <span>{actionError}</span>
          </div>
        )}

        {actionSuccess && (
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
            <span>{actionSuccess}</span>
          </div>
        )}
      </section>

      {/* ── FULL-WIDTH VERIFIED CONTRIBUTION REGISTRY ── */}
      <section
        className="app-glass-card"
        style={{
          background: 'var(--paper-raised)',
          border: '1px solid var(--rule)',
          borderRadius: '14px',
          padding: '1.4rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 2px 0', color: 'var(--ink)' }}>
              Verified Contribution Records
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--ink-muted)', margin: 0 }}>
              Evidence-backed credentials across external repositories, maintained tools, and collaborative reviews
            </p>
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: `All (${contributions.length})` },
              { id: 'external', label: `External PRs (${contributions.filter((c) => c.contributionType === 'external').length})` },
              { id: 'maintainer', label: `Maintained (${contributions.filter((c) => c.contributionType === 'maintainer').length})` },
              { id: 'community', label: `Community (${contributions.filter((c) => c.contributionType === 'community').length})` },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilterType(f.id as any)}
                style={{
                  fontSize: '11.5px',
                  fontWeight: 600,
                  padding: '4px 10px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  border: filterType === f.id ? '1px solid var(--clay)' : '1px solid var(--rule)',
                  background: filterType === f.id ? 'var(--clay)' : 'var(--paper)',
                  color: filterType === f.id ? '#FFFFFF' : 'var(--ink-muted)',
                  transition: 'all 0.15s ease',
                }}
              >
                {f.label}
              </button>
            ))}

            <Link
              to="/contributors"
              style={{
                fontSize: '11.5px',
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
              <span>Lookup Contributor</span>
            </Link>
          </div>
        </div>

        {/* Contributions List */}
        {filteredContributions.length === 0 ? (
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
              No records under this filter
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--ink-muted)', maxWidth: '400px', margin: '0 auto 16px auto' }}>
              Use the verification engine above to register external pull requests, open-source repositories you maintain, or collaborative reviews.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filteredContributions.map((record) => {
              const badge = getClassificationBadge(record.evidenceClassification)
              return (
                <div
                  key={record.id}
                  onClick={() => navigate(`/contributions/${record.id}`)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: '10px',
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        background:
                          record.contributionType === 'external'
                            ? 'rgba(16, 185, 129, 0.1)'
                            : record.contributionType === 'maintainer'
                            ? 'rgba(56, 189, 248, 0.1)'
                            : 'rgba(168, 85, 247, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {record.contributionType === 'external' && <IconCode size={18} color="#10B981" />}
                      {record.contributionType === 'maintainer' && <IconGlobe size={18} color="#38BDF8" />}
                      {record.contributionType === 'community' && <IconAward size={18} color="#A855F7" />}
                    </div>

                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '13px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--ink)' }}>
                          {record.repo} {record.prNumber ? `#${record.prNumber}` : ''}
                        </span>

                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            padding: '2px 7px',
                            borderRadius: '4px',
                            background: badge.bg,
                            color: badge.color,
                            border: `1px solid ${badge.border}`,
                            letterSpacing: '0.04em',
                          }}
                        >
                          {badge.label}
                        </span>

                        <span
                          style={{
                            fontSize: '10px',
                            color: 'var(--ink-muted)',
                            textTransform: 'uppercase',
                            fontWeight: 600,
                          }}
                        >
                          {record.contributionType === 'external' && '01. External PR'}
                          {record.contributionType === 'maintainer' && '02. Project Maintainer'}
                          {record.contributionType === 'community' && '03. Community & Review'}
                        </span>
                      </div>

                      <div
                        style={{
                          fontSize: '12px',
                          color: 'var(--ink-muted)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          maxWidth: '560px',
                        }}
                      >
                        {record.prTitle}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
                    {record.maintainerEvidence ? (
                      <div style={{ textAlign: 'right', fontSize: '11.5px', fontFamily: 'var(--font-mono)' }}>
                        <span style={{ color: '#F59E0B' }}>★ {record.maintainerEvidence.stars}</span>{' '}
                        <span style={{ color: '#38BDF8' }}>⎇ {record.maintainerEvidence.releasesCount} rel</span>
                      </div>
                    ) : (
                      <div style={{ textAlign: 'right', fontSize: '11.5px', fontFamily: 'var(--font-mono)' }}>
                        <span style={{ color: '#10B981' }}>+{record.additions}</span>{' '}
                        <span style={{ color: '#EF4444' }}>-{record.deletions}</span>
                      </div>
                    )}

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
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
