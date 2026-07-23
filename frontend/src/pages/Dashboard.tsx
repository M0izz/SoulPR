import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import BadgeDetailModal, { type BadgeData } from '../components/BadgeDetailModal'
import { getAttestations } from '../lib/contract'
import api from '../lib/api'
import { fetchGitHubUserStats, type GitHubStats } from '../lib/github'
import ThemeToggle from '../components/ThemeToggle'
import {
  IconSoulPRLogo, IconHome, IconShieldCheck, IconAward, IconCode,
  IconSettings, IconWallet,
  IconPackage, IconUserPlus, IconBook, IconFolder, IconCheck,
} from '../components/Icons'

// ─── Types ──────────────────────────────────────────────────
type NavId = 'overview' | 'sbts' | 'contributions' | 'settings'

// ─── Helpers ─────────────────────────────────────────────────
function formatDuration(ts: number) {
  const d = Math.floor(Date.now() / 1000) - ts
  if (d < 60) return 'Just now'
  if (d < 3600) return `${Math.floor(d / 60)} minutes ago`
  if (d < 86400) return `${Math.floor(d / 3600)} hours ago`
  if (d < 604800) return `${Math.floor(d / 86400)} days ago`
  return `${Math.floor(d / 604800)} week ago`
}

function formatDate(isoString?: string) {
  if (!isoString) return 'N/A'
  try {
    const d = new Date(isoString)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return 'N/A'
  }
}

function RepoAvatar({ repo }: { repo: string }) {
  const isCore = repo.startsWith('soulpr/core') || repo.includes('core')
  return (
    <div style={{
      width: '30px', height: '30px', borderRadius: '50%', flexShrink: 0,
      background: isCore ? 'linear-gradient(135deg,#7C3AED,#4F46E5)' : '#1B1816',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {isCore
        ? <IconCode size={13} color="white" />
        : <IconGitHub size={17} color="white" />}
    </div>
  )
}

// ─── Panel components ─────────────────────────────────────────

function SBTsPanel({ badges, onSelect }: { badges: BadgeData[]; onSelect: (b: BadgeData) => void }) {
  return (
    <div>
      <h2 style={{ fontSize: '20px', fontWeight: 900, color: 'var(--ink)', marginBottom: '1.5rem' }}>SBTs</h2>
      {badges.length === 0 ? (
        <div style={{ padding: '3rem 2rem', textAlign: 'center', background: 'var(--paper-raised)', border: '1px dashed var(--rule)', borderRadius: '16px', color: 'var(--ink-muted)' }}>
          <div style={{ fontSize: '15px', fontWeight: 800, marginBottom: '6px', color: 'var(--ink)' }}>No Soulbound Tokens Minted Yet</div>
          <div style={{ fontSize: '13px' }}>Merge pull requests on tracked repositories to automatically earn on-chain SBTs.</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.2rem' }}>
          {badges.map(b => (
            <div
              key={b.tokenId}
              onClick={() => onSelect(b)}
              style={{
                background: 'linear-gradient(160deg, rgba(168,85,247,0.08) 0%, rgba(255,123,0,0.04) 100%)',
                border: '1px solid rgba(168,85,247,0.2)', borderRadius: '14px',
                padding: '1.4rem', cursor: 'pointer', textAlign: 'center',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(168,85,247,0.12)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}
            >
              <div style={{
                width: '56px', height: '64px', margin: '0 auto 12px',
                clipPath: 'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)',
                background: 'linear-gradient(135deg,rgba(168,85,247,0.3),rgba(59,130,246,0.3))',
                border: '1.5px solid rgba(168,85,247,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <IconCode size={20} color="#E9D5FF" />
              </div>
              <div style={{ fontSize: '9px', fontWeight: 800, color: '#A855F7', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>ON-CHAIN PROOF</div>
              <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--ink)', textTransform: 'uppercase', marginBottom: '4px' }}>Open Source Contributor</div>
              <div style={{ fontSize: '10px', color: 'var(--ink-muted)', fontFamily: 'var(--font-mono)' }}>SBT #{String(b.tokenId).padStart(5, '0')}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ContributionsPanel({ badges, ghStats, loadingStats }: { badges: BadgeData[]; ghStats: GitHubStats | null; loadingStats: boolean }) {
  const mergedPRsCount = ghStats?.mergedPrCount ?? badges.length
  const reposCount = ghStats?.publicRepos ?? new Set(badges.map(b => b.repo)).size

  return (
    <div>
      <h2 style={{ fontSize: '20px', fontWeight: 900, color: 'var(--ink)', marginBottom: '1.5rem' }}>Contributions</h2>
      <div style={{ background: 'var(--paper-raised)', border: '1px solid var(--rule)', borderRadius: '16px', padding: '1.6rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          {[
            { label: 'GitHub Merged PRs', val: loadingStats ? '...' : mergedPRsCount.toLocaleString(), color: '#FF7B00' },
            { label: 'GitHub Repositories', val: loadingStats ? '...' : reposCount.toLocaleString(), color: '#16A34A' },
            { label: 'On-Chain Attested', val: `${badges.length}`, color: '#A855F7' },
          ].map(({ label, val, color }) => (
            <div key={label} style={{ background: 'var(--paper)', borderRadius: '10px', padding: '1rem', textAlign: 'center', border: '1px solid var(--rule)' }}>
              <div style={{ fontSize: '26px', fontWeight: 900, color, marginBottom: '4px' }}>{val}</div>
              <div style={{ fontSize: '11px', color: 'var(--ink-muted)', fontWeight: 600 }}>{label}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--ink)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Attested Contributions
        </div>
        {badges.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--ink-muted)', fontSize: '12px', background: 'var(--paper)', borderRadius: '8px' }}>
            No attested contributions on Monad Testnet yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {badges.map(b => (
              <div key={b.tokenId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: '8px', background: 'var(--paper)', border: '1px solid var(--rule)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <RepoAvatar repo={b.repo} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--ink)' }}>{b.prTitle}</div>
                    <div style={{ fontSize: '10px', color: 'var(--ink-muted)' }}>{b.repo} · PR #{b.prNumber}</div>
                  </div>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--ink-muted)' }}>{formatDuration(b.mergeTimestamp)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function SettingsPanel({
  githubUser,
  walletAddress,
  onUpdateGithub,
}: {
  githubUser: string
  walletAddress: string | null
  onUpdateGithub: (user: string) => void
}) {
  const [saved, setSaved] = useState(false)
  const [githubInput, setGithubInput] = useState(githubUser)
  const [notifs, setNotifs] = useState(true)

  useEffect(() => {
    setGithubInput(githubUser)
  }, [githubUser])

  function handleSave() {
    onUpdateGithub(githubInput)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <h2 style={{ fontSize: '20px', fontWeight: 900, color: 'var(--ink)', marginBottom: '1.5rem' }}>Settings</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', maxWidth: '560px' }}>

        {/* GitHub */}
        <div style={{ background: 'var(--paper-raised)', border: '1px solid var(--rule)', borderRadius: '14px', padding: '1.4rem' }}>
          <div style={{ fontWeight: 800, fontSize: '13px', color: 'var(--ink)', marginBottom: '4px' }}>GitHub Username</div>
          <div style={{ fontSize: '12px', color: 'var(--ink-muted)', marginBottom: '12px' }}>Linked GitHub handle for fetching real open-source activity</div>
          <input
            value={githubInput}
            onChange={e => setGithubInput(e.target.value)}
            placeholder="your-github-username"
            style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--rule)', borderRadius: '8px', fontSize: '13px', fontFamily: 'inherit', outline: 'none', color: 'var(--ink)', background: 'var(--paper)' }}
          />
        </div>

        {/* Wallet */}
        <div style={{ background: 'var(--paper-raised)', border: '1px solid var(--rule)', borderRadius: '14px', padding: '1.4rem' }}>
          <div style={{ fontWeight: 800, fontSize: '13px', color: 'var(--ink)', marginBottom: '4px' }}>Connected Wallet</div>
          <div style={{ fontSize: '12px', color: 'var(--ink-muted)', marginBottom: '12px' }}>Your on-chain identity for SBT minting on Monad</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', border: '1px solid rgba(255,123,0,0.25)', borderRadius: '8px', background: 'rgba(255,123,0,0.06)', color: '#FF7B00', fontSize: '12px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
            <IconWallet size={14} color="#FF7B00" />
            {walletAddress || '0xA7f2d5e3052E9B663a8a3f5a70966a3f457c19e5'}
          </div>
        </div>

        {/* Notifications */}
        <div style={{ background: 'var(--paper-raised)', border: '1px solid var(--rule)', borderRadius: '14px', padding: '1.4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: '13px', color: 'var(--ink)', marginBottom: '3px' }}>Proof Notifications</div>
            <div style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>Get notified when a new SBT is minted</div>
          </div>
          <button
            onClick={() => setNotifs(v => !v)}
            style={{
              width: '42px', height: '24px', borderRadius: '99px', border: 'none', cursor: 'pointer',
              background: notifs ? '#FF7B00' : 'var(--rule)',
              position: 'relative', transition: 'background 0.2s',
            }}
          >
            <span style={{
              position: 'absolute', top: '3px', left: notifs ? '20px' : '3px',
              width: '18px', height: '18px', borderRadius: '50%', background: '#FFF',
              transition: 'left 0.2s',
            }} />
          </button>
        </div>

        {/* Network */}
        <div style={{ background: 'var(--paper-raised)', border: '1px solid var(--rule)', borderRadius: '14px', padding: '1.4rem' }}>
          <div style={{ fontWeight: 800, fontSize: '13px', color: 'var(--ink)', marginBottom: '4px' }}>Network</div>
          <div style={{ fontSize: '12px', color: 'var(--ink-muted)', marginBottom: '12px' }}>Active blockchain network</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', border: '1px solid var(--rule)', borderRadius: '8px', fontSize: '12px', fontWeight: 600, color: 'var(--ink)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FF7B00', display: 'inline-block' }} />
            Monad Testnet
          </div>
        </div>

        <button
          onClick={handleSave}
          style={{ padding: '11px 0', borderRadius: '8px', border: 'none', background: saved ? '#16A34A' : '#FF7B00', color: '#FFF', fontWeight: 800, fontSize: '14px', cursor: 'pointer', transition: 'background 0.2s' }}
        >
          {saved ? 'Saved!' : 'Save Settings'}
        </button>
      </div>
    </div>
  )
}

// ─── Shared proof row (used in Overview + ProofsPanel) ────────
function ProofRow({ b, onSelect }: { b: BadgeData; onSelect: (b: BadgeData) => void }) {
  return (
    <div
      onClick={() => onSelect(b)}
      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--rule)', background: 'var(--paper)', cursor: 'pointer', transition: 'background 0.15s, border-color 0.15s', textAlign: 'left' }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,123,0,0.05)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,123,0,0.25)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--paper)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--rule)' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <RepoAvatar repo={b.repo} />
        <div>
          <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--ink)' }}>{b.prTitle}</div>
          <div style={{ fontSize: '10px', color: 'var(--ink-muted)', marginTop: '2px' }}>{b.repo}</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
        <span style={{ fontSize: '11px', color: 'var(--ink-muted)' }}>{formatDuration(b.mergeTimestamp)}</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(22,163,74,0.12)', color: '#16A34A', border: '1px solid rgba(22,163,74,0.25)', borderRadius: '99px', fontSize: '10px', fontWeight: 700, padding: '3px 9px', whiteSpace: 'nowrap' }}>
          <IconCheck size={10} color="#16A34A" /> Attested
        </span>
      </div>
    </div>
  )
}

// ─── Overview panel ───────────────────────────────────────────
function OverviewPanel({
  badges,
  ghStats,
  loadingStats,
  onSelect,
  onViewAll,
  onNavTo,
  onSearch,
}: {
  badges: BadgeData[]
  ghStats: GitHubStats | null
  loadingStats: boolean
  onSelect: (b: BadgeData) => void
  onViewAll: () => void
  onNavTo: (id: NavId) => void
  onSearch: () => void
}) {
  // Real metrics calculation
  const mergedPRsCount = ghStats?.mergedPrCount ?? badges.length
  const publicReposCount = ghStats?.publicRepos ?? new Set(badges.map(b => b.repo)).size
  const attestationsCount = badges.length

  // Dynamic real XP calculation
  const builderXP = (mergedPRsCount * 100) + (attestationsCount * 250) + (publicReposCount * 50)
  const builderLevel = Math.max(1, Math.floor(builderXP / 500) + 1)
  const levelFloorXP = (builderLevel - 1) * 500
  const nextLevelXP = builderLevel * 500
  const currentLevelProgress = builderXP - levelFloorXP
  const progressPct = Math.min(100, Math.max(5, (currentLevelProgress / 500) * 100))

  return (
    <>
      {/* Builder score hero */}
      <section style={{ background: '#110F0E', color: 'white', borderRadius: '16px', padding: '2rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.8rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 5% 30%, rgba(255,123,0,0.12) 0%, transparent 55%)' }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ fontSize: '10px', fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>
            {ghStats ? `@${ghStats.username}'S BUILDER XP` : 'YOUR BUILDER XP'}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '8px' }}>
            <span style={{ fontSize: '44px', fontWeight: 900, color: '#FFF', lineHeight: 1 }}>
              {loadingStats ? '...' : builderXP.toLocaleString()}
            </span>
            <span style={{ background: 'rgba(255,123,0,0.15)', border: '1px solid rgba(255,123,0,0.3)', borderRadius: '99px', padding: '4px 12px', fontSize: '10px', color: '#FF7B00', fontWeight: 800 }}>
              Builder <span style={{ opacity: 0.7 }}>Lv. {builderLevel}</span>
            </span>
          </div>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', marginBottom: '1.4rem' }}>
            {loadingStats ? 'Fetching live GitHub and on-chain contributions...' : `Earned from ${mergedPRsCount.toLocaleString()} merged PRs across ${publicReposCount.toLocaleString()} GitHub repositories.`}
          </p>
          <div style={{ width: '320px' }}>
            <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '99px', overflow: 'hidden', marginBottom: '6px' }}>
              <div style={{ width: `${progressPct}%`, height: '100%', background: 'linear-gradient(90deg,#FFA940,#FF7B00)', borderRadius: '99px', transition: 'width 0.4s ease' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-mono)' }}>
              <span>{builderXP.toLocaleString()} / {nextLevelXP.toLocaleString()} XP</span>
              <span>Next: Lv. {builderLevel + 1}</span>
            </div>
          </div>
        </div>
        <div style={{ position: 'relative', width: '130px', height: '130px', zIndex: 2, flexShrink: 0 }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle, rgba(255,123,0,0.28) 0%, transparent 70%)', filter: 'blur(14px)' }} />
          <img src="/reputation_shield.png" alt="Builder Shield" className="animate-float" style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 10px 24px rgba(255,123,0,0.4))', mixBlendMode: 'screen' }} />
        </div>
      </section>

      {/* 4 real stats */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.2rem', marginBottom: '1.8rem' }}>
        {[
          {
            icon: <IconAward size={14} color="#FF7B00" />,
            label: 'On-Chain Proofs',
            value: attestationsCount.toString(),
            sub: attestationsCount > 0 ? `${attestationsCount} SBTs minted` : '0 minted on-chain',
            subColor: attestationsCount > 0 ? '#16A34A' : 'var(--ink-muted)',
            nav: 'sbts' as NavId,
          },
          {
            icon: <IconCode size={14} color="#FF7B00" />,
            label: 'GitHub Merged PRs',
            value: loadingStats ? '...' : mergedPRsCount.toLocaleString(),
            sub: ghStats ? `Real GitHub data` : 'Live GitHub search',
            subColor: '#16A34A',
            nav: 'contributions' as NavId,
          },
          {
            icon: <IconShieldCheck size={14} color="#FF7B00" />,
            label: 'Contribution Level',
            value: `Lv. ${builderLevel}`,
            sub: `${builderXP.toLocaleString()} Verified XP`,
            subColor: '#FF7B00',
            nav: undefined,
          },
          {
            icon: <IconFolder size={14} color="#FF7B00" />,
            label: 'GitHub Repositories',
            value: loadingStats ? '...' : publicReposCount.toLocaleString(),
            sub: 'Public repositories',
            subColor: 'var(--ink-muted)',
            nav: 'contributions' as NavId,
          },
        ].map(({ icon, label, value, sub, subColor, nav }) => (
          <div
            key={label}
            onClick={() => nav && onNavTo(nav)}
            style={{ background: 'var(--paper-raised)', border: '1px solid var(--rule)', borderRadius: '12px', padding: '1.4rem', textAlign: 'left', cursor: nav ? 'pointer' : 'default', transition: 'box-shadow 0.15s' }}
            onMouseEnter={e => { if (nav) (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(255,123,0,0.08)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}
          >
            <div style={{ fontSize: '11px', color: 'var(--ink-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>{icon} {label}</div>
            <span style={{ fontSize: '30px', fontWeight: 900, color: 'var(--ink)', display: 'block', lineHeight: 1 }}>{value}</span>
            <span style={{ fontSize: '10px', color: subColor, fontWeight: 700, marginTop: '6px', display: 'block' }}>{sub}</span>
          </div>
        ))}
      </section>

      {/* 2-col bottom */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 0.7fr', gap: '1.8rem', alignItems: 'start' }}>

        {/* Recent Proofs */}
        <section style={{ background: 'var(--paper-raised)', border: '1px solid var(--rule)', borderRadius: '16px', padding: '1.6rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.4rem' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 900, color: 'var(--ink)', margin: 0 }}>Recent On-Chain Proofs</h2>
            <button id="view-all-proofs" onClick={onViewAll} style={{ color: '#FF7B00', fontSize: '12px', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>View all</button>
          </div>
          {badges.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--ink-muted)', fontSize: '13px', background: 'var(--paper)', borderRadius: '10px', border: '1px dashed var(--rule)' }}>
              No on-chain attestations found for this account yet.<br />
              <span style={{ fontSize: '11px', color: '#FF7B00', marginTop: '6px', display: 'inline-block' }}>Merge a PR on a tracked repository to earn your first SBT.</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {badges.map(b => <ProofRow key={b.tokenId} b={b} onSelect={onSelect} />)}
            </div>
          )}
        </section>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Real GitHub & Chain Stats */}
          <div style={{ background: 'var(--paper-raised)', border: '1px solid var(--rule)', borderRadius: '16px', padding: '1.4rem' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 800, color: 'var(--ink)', borderBottom: '1px solid var(--rule)', paddingBottom: '10px', marginBottom: '14px' }}>
              {ghStats ? `@${ghStats.username}'s GitHub Profile` : 'GitHub & Chain Stats'}
            </h3>
            {[
              { icon: <IconCode size={13} color="var(--ink-muted)" />, label: 'Merged PRs', val: loadingStats ? '...' : mergedPRsCount.toLocaleString() },
              { icon: <IconFolder size={13} color="var(--ink-muted)" />, label: 'Public Repos', val: loadingStats ? '...' : publicReposCount.toLocaleString() },
              { icon: <IconAward size={13} color="var(--ink-muted)" />, label: 'Attested SBTs', val: attestationsCount.toString() },
              { icon: <IconGlobe size={13} color="var(--ink-muted)" />, label: 'Active Network', val: 'Monad Testnet' },
              { icon: <IconUserPlus size={13} color="var(--ink-muted)" />, label: 'GitHub Joined', val: loadingStats ? '...' : formatDate(ghStats?.createdAt) },
            ].map(({ icon, label, val }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', padding: '7px 0', borderBottom: '1px solid var(--rule)' }}>
                <span style={{ color: 'var(--ink-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>{icon}{label}</span>
                <strong style={{ color: 'var(--ink)' }}>{val}</strong>
              </div>
            ))}
          </div>

          {/* Dynamic Recent Activity */}
          <div style={{ background: 'var(--paper-raised)', border: '1px solid var(--rule)', borderRadius: '16px', padding: '1.4rem' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 800, color: 'var(--ink)', borderBottom: '1px solid var(--rule)', paddingBottom: '10px', marginBottom: '14px' }}>Recent Activity</h3>
            {badges.length > 0 ? (
              badges.slice(0, 4).map((b) => (
                <div key={b.tokenId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', fontSize: '11px', padding: '6px 0', gap: '8px' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FF7B00', marginTop: '4px', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontWeight: 800, color: 'var(--ink)' }}>SBT Minted #{b.tokenId}</div>
                      <div style={{ color: 'var(--ink-muted)', marginTop: '1px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '160px' }}>{b.prTitle}</div>
                    </div>
                  </div>
                  <span style={{ color: '#C0824E', fontSize: '10px', flexShrink: 0 }}>{formatDuration(b.mergeTimestamp)}</span>
                </div>
              ))
            ) : (
              <div style={{ fontSize: '11px', color: 'var(--ink-muted)', padding: '8px 0' }}>
                No on-chain activity recorded yet.
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div style={{ background: 'var(--paper-raised)', border: '1px solid var(--rule)', borderRadius: '16px', padding: '1.2rem 1.4rem' }}>
            <h3 style={{ fontSize: '11px', color: 'var(--ink-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '14px' }}>Quick Actions</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              {[
                { icon: <IconShieldCheck size={18} color="#FF7B00" />, label: 'Verify Proof', action: () => navigate('/how-it-works') },
                { icon: <IconPackage size={18} color="#FF7B00" />, label: 'Mint SBT', action: () => onNavTo('sbts') },
                { icon: <IconUserPlus size={18} color="#FF7B00" />, label: 'Lookup User', action: onSearch },
                { icon: <IconBook size={18} color="#FF7B00" />, label: 'View Docs', action: () => navigate('/install') },
              ].map(({ icon, label, action }) => (
                <button
                  key={label}
                  onClick={action}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'center', padding: '4px 0' }}
                >
                  <div
                    style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,123,0,0.06)', border: '1px solid rgba(255,123,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px', transition: 'background 0.15s' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,123,0,0.14)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,123,0,0.06)'}
                  >
                    {icon}
                  </div>
                  <span style={{ fontSize: '9px', fontWeight: 700, color: 'var(--ink-muted)', display: 'block', lineHeight: 1.2 }}>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// ─── Main component ───────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [badges, setBadges] = useState<BadgeData[]>([])
  const [ghStats, setGhStats] = useState<GitHubStats | null>(null)
  const [selected, setSelected] = useState<BadgeData | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingStats, setLoadingStats] = useState(true)
  const [showSearchModal, setShowSearchModal] = useState(false)
  const [activeNav, setActiveNav] = useState<NavId>('overview')
  const [userGithub, setUserGithub] = useState<string>('moizz')
  const [userWallet, setUserWallet] = useState<string | null>(null)

  // 1. Initial load real session & GitHub / Monad stats
  useEffect(() => {
    async function initDashboard() {
      setLoadingStats(true)
      let currentGhUser = 'moizz'
      let currentWallet = '0xA7f2d5e3052E9B663a8a3f5a70966a3f457c19e5'

      try {
        const status = await api.getWalletStatus()
        if (status.authenticated && status.githubUsername) {
          currentGhUser = status.githubUsername
          setUserGithub(status.githubUsername)
        }
        if (status.linked && status.walletAddress) {
          currentWallet = status.walletAddress
          setUserWallet(status.walletAddress)
        }
      } catch (err) {
        console.warn('[Dashboard] Session status check fallback:', err)
      }

      // Fetch GitHub real user stats
      const stats = await fetchGitHubUserStats(currentGhUser)
      setGhStats(stats)

      // Fetch real on-chain attestations for wallet
      try {
        const live = await getAttestations(currentWallet)
        setBadges(live)
      } catch (err) {
        console.warn('[Dashboard] Attestation fetch fallback:', err)
        setBadges([])
      } finally {
        setLoadingStats(false)
      }
    }

    initDashboard()
  }, [])

  // 2. Handle contributor search/lookup
  async function handleLookup(lookupQuery: string) {
    if (!lookupQuery.trim()) return
    setLoading(true)
    setLoadingStats(true)
    const target = lookupQuery.trim().replace(/^@/, '')
    let resolvedWallet = target

    if (!target.startsWith('0x') || target.length !== 42) {
      // Lookup GitHub handle
      setUserGithub(target)
      const ghData = await fetchGitHubUserStats(target)
      if (ghData) {
        setGhStats(ghData)
      }
      try {
        const res = await fetch(`/api/wallet/resolve?query=${encodeURIComponent(target)}`)
        if (res.ok) {
          const d = await res.json()
          resolvedWallet = d.walletAddress
        } else {
          resolvedWallet = '0xA7f2d5e3052E9B663a8a3f5a70966a3f457c19e5'
        }
      } catch {
        resolvedWallet = '0xA7f2d5e3052E9B663a8a3f5a70966a3f457c19e5'
      }
    } else {
      setUserWallet(target)
    }

    try {
      const live = await getAttestations(resolvedWallet)
      setBadges(live)
    } catch {
      setBadges([])
    } finally {
      setLoading(false)
      setLoadingStats(false)
      setShowSearchModal(false)
    }
  }

  const sidebarLinks: { id: NavId; icon: React.ReactNode; label: string }[] = [
    { id: 'overview', icon: <IconHome size={16} />, label: 'Overview' },
    { id: 'sbts', icon: <IconAward size={16} />, label: 'SBTs' },
    { id: 'contributions', icon: <IconCode size={16} />, label: 'Contributions' },
    { id: 'settings', icon: <IconSettings size={16} />, label: 'Settings' },
  ]

  const pageTitle: Record<NavId, string> = {
    overview: 'Dashboard',
    sbts: 'SBTs',
    contributions: 'Contributions',
    settings: 'Settings',
  }

  const displayWallet = userWallet
    ? `${userWallet.slice(0, 6)}...${userWallet.slice(-4)}`
    : '0xA7f2...19e5'

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--paper)', color: 'var(--ink)', fontFamily: 'var(--font-body)', overflowX: 'hidden', transition: 'background 0.3s, color 0.3s' }}>

      {/* ── SIDEBAR ── */}
      <aside style={{ width: '260px', background: 'var(--paper-raised)', flexShrink: 0, borderRight: '1px solid var(--rule)', padding: '2rem 1.2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'sticky', top: 0, height: '100vh' }}>
        <div>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2.5rem', textDecoration: 'none' }}>
            <IconSoulPRLogo size={32} />
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
              <span style={{ fontWeight: 900, fontSize: '17px', color: 'var(--ink)' }}>SoulPR</span>
              <span style={{ fontSize: '8px', textTransform: 'uppercase', color: '#E05300', letterSpacing: '0.06em', fontWeight: 700 }}>proof that builds you</span>
            </div>
          </Link>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {sidebarLinks.map(({ id, icon, label }) => {
              const isActive = activeNav === id
              return (
                <button
                  key={id}
                  id={`sidebar-${id}`}
                  onClick={() => setActiveNav(id)}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 14px', borderRadius: '10px', border: 'none', background: isActive ? 'rgba(255,123,0,0.12)' : 'transparent', color: isActive ? '#FF7B00' : 'var(--ink-muted)', fontWeight: isActive ? 800 : 600, fontSize: '14.5px', cursor: 'pointer', width: '100%', textAlign: 'left', transition: 'background 0.15s, color 0.15s' }}
                  onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'rgba(255,123,0,0.05)' }}
                  onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                >
                  <span style={{ color: isActive ? '#FF7B00' : 'var(--ink-faint)' }}>{icon}</span>
                  {label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Bottom widget */}
        <div style={{ background: 'rgba(255,123,0,0.06)', border: '1px solid rgba(255,123,0,0.15)', borderRadius: '12px', padding: '1.2rem 1rem', textAlign: 'center' }}>
          <div style={{ width: '42px', height: '42px', margin: '0 auto 10px', background: 'rgba(255,123,0,0.1)', border: '1.5px solid rgba(255,123,0,0.25)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconShieldCheck size={22} color="#FF7B00" />
          </div>
          <div style={{ fontWeight: 800, fontSize: '12px', color: 'var(--ink)', marginBottom: '5px' }}>Build. Proof. Grow.</div>
          <div style={{ fontSize: '11px', color: 'var(--ink-muted)', marginBottom: '14px', lineHeight: 1.5 }}>Your proof is your superpower.</div>
          <button
            id="sidebar-lookup-btn"
            onClick={() => setShowSearchModal(true)}
            style={{ width: '100%', background: '#FF7B00', color: '#FFF', border: 'none', borderRadius: '6px', padding: '7px 0', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
          >
            Look up a contributor
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main style={{ flex: 1, padding: '2rem 2.5rem', overflowY: 'auto' }}>

        {/* Header */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div style={{ textAlign: 'left' }}>
            <h1 style={{ fontSize: '26px', fontWeight: 900, color: 'var(--ink)', margin: 0, fontFamily: 'var(--font-display)' }}>{pageTitle[activeNav]}</h1>
            {activeNav === 'overview' && (
              <div style={{ fontSize: '13px', color: 'var(--ink-muted)', marginTop: '3px' }}>
                Welcome back, @{userGithub}!
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--paper-raised)', border: '1px solid var(--rule)', borderRadius: '8px', padding: '6px 14px', fontSize: '11px', fontWeight: 600, color: 'var(--ink)' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FF7B00', display: 'inline-block' }} />
              MONAD TESTNET
              <span style={{ fontSize: '8px', opacity: 0.5 }}>▼</span>
            </div>
            <button
              onClick={() => navigate('/link-wallet')}
              style={{ display: 'flex', alignItems: 'center', gap: '7px', background: 'var(--paper-raised)', border: '1px solid rgba(255,123,0,0.35)', borderRadius: '8px', padding: '6px 14px', fontSize: '11px', color: '#FF7B00', fontWeight: 700, cursor: 'pointer' }}
            >
              <IconWallet size={13} color="#FF7B00" />
              {displayWallet}
              <span style={{ fontSize: '8px', opacity: 0.5 }}>▼</span>
            </button>
            <ThemeToggle />
          </div>
        </header>

        {/* Active panel */}
        {activeNav === 'overview' && (
          <OverviewPanel
            badges={badges}
            ghStats={ghStats}
            loadingStats={loadingStats}
            onSelect={setSelected}
            onViewAll={() => setActiveNav('contributions')}
            onNavTo={setActiveNav}
            onSearch={() => setShowSearchModal(true)}
          />
        )}
        {activeNav === 'sbts' && <SBTsPanel badges={badges} onSelect={setSelected} />}
        {activeNav === 'contributions' && (
          <ContributionsPanel badges={badges} ghStats={ghStats} loadingStats={loadingStats} />
        )}
        {activeNav === 'settings' && (
          <SettingsPanel
            githubUser={userGithub}
            walletAddress={userWallet}
            onUpdateGithub={(newUser) => {
              setUserGithub(newUser)
              fetchGitHubUserStats(newUser).then(setGhStats)
            }}
          />
        )}
      </main>

      {/* Search Modal */}
      {showSearchModal && (
        <div className="modal-overlay" onClick={() => setShowSearchModal(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'var(--paper-raised)', border: '1px solid var(--rule)', padding: '2rem', borderRadius: '16px', width: '100%', maxWidth: '420px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 900, marginBottom: '1rem', color: 'var(--ink)' }}>Look up a contributor</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                id="lookup-input"
                placeholder="GitHub username or wallet address"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLookup(query)}
                style={{ flex: 1, padding: '10px 14px', border: '1px solid var(--rule)', borderRadius: '8px', fontSize: '13px', fontFamily: 'inherit', outline: 'none', color: 'var(--ink)', background: 'var(--paper)' }}
              />
              <button id="lookup-submit" onClick={() => handleLookup(query)} disabled={loading} style={{ background: '#FF7B00', color: '#FFF', border: 'none', borderRadius: '8px', padding: '0 18px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
                {loading ? '...' : 'Search'}
              </button>
            </div>
          </div>
        </div>
      )}

      {selected && <BadgeDetailModal badge={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

// ─── Inline helpers ───────────────────────────────────────────
function IconGlobe({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10z"/>
    </svg>
  )
}
function IconGitHub({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  )
}
