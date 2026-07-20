import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import BadgeDetailModal, { type BadgeData } from '../components/BadgeDetailModal'
import { getAttestations } from '../lib/contract'
import ThemeToggle from '../components/ThemeToggle'
import {
  IconSoulPRLogo, IconHome, IconShieldCheck, IconAward, IconCode,
  IconSettings, IconWallet,
  IconPackage, IconUserPlus, IconBook, IconFolder, IconCheck,
} from '../components/Icons'

// ─── Types ──────────────────────────────────────────────────
type NavId = 'overview' | 'sbts' | 'contributions' | 'settings'

// ─── Mock data ───────────────────────────────────────────────
const MOCK_BADGES: BadgeData[] = [
  { tokenId: 42, repo: 'soulpr/website', prNumber: 106, prTitle: 'feat: add dark mode toggle',        contributor: '0xA7f2d5e3052E9B663a8a3f5a70966a3f457c19e5', mergeTimestamp: Math.floor(Date.now() / 1000) - 7200,   txHash: '0xabc123', network: 'Monad Testnet' },
  { tokenId: 43, repo: 'soulpr/website', prNumber: 123, prTitle: 'fix: resolve UI alignment issue',   contributor: '0xA7f2d5e3052E9B663a8a3f5a70966a3f457c19e5', mergeTimestamp: Math.floor(Date.now() / 1000) - 86400,  txHash: '0xdef456', network: 'Monad Testnet' },
  { tokenId: 44, repo: 'soulpr/docs',    prNumber: 8,   prTitle: 'docs: update contribution guide',  contributor: '0xA7f2d5e3052E9B663a8a3f5a70966a3f457c19e5', mergeTimestamp: Math.floor(Date.now() / 1000) - 259200, txHash: '0xghi789', network: 'Monad Testnet' },
  { tokenId: 45, repo: 'soulpr/core',    prNumber: 45,  prTitle: 'feat: add webhook integration',    contributor: '0xA7f2d5e3052E9B663a8a3f5a70966a3f457c19e5', mergeTimestamp: Math.floor(Date.now() / 1000) - 432000, txHash: '0xjkl012', network: 'Monad Testnet' },
  { tokenId: 46, repo: 'soulpr/core',    prNumber: 12,  prTitle: 'chore: improve test coverage',     contributor: '0xA7f2d5e3052E9B663a8a3f5a70966a3f457c19e5', mergeTimestamp: Math.floor(Date.now() / 1000) - 604800, txHash: '0xmnp345', network: 'Monad Testnet' },
]

// ─── Helpers ─────────────────────────────────────────────────
function formatDuration(ts: number) {
  const d = Math.floor(Date.now() / 1000) - ts
  if (d < 3600)   return `${Math.floor(d / 60)} minutes ago`
  if (d < 86400)  return `${Math.floor(d / 3600)} hours ago`
  if (d < 604800) return `${Math.floor(d / 86400)} days ago`
  return `${Math.floor(d / 604800)} week ago`
}

function RepoAvatar({ repo }: { repo: string }) {
  const isCore = repo.startsWith('soulpr/core')
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
      <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#1B1816', marginBottom: '1.5rem' }}>SBTs</h2>
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
            <div style={{ fontSize: '9px', fontWeight: 800, color: '#A855F7', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>ACHIEVEMENT</div>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#1B1816', textTransform: 'uppercase', marginBottom: '4px' }}>Open Source Contributor</div>
            <div style={{ fontSize: '10px', color: '#9E9089', fontFamily: 'var(--font-mono)' }}>SBT #{String(b.tokenId).padStart(5, '0')}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ContributionsPanel({ badges }: { badges: BadgeData[] }) {
  return (
    <div>
      <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#1B1816', marginBottom: '1.5rem' }}>Contributions</h2>
      <div style={{ background: '#FFF', border: '1px solid rgba(78,66,56,0.1)', borderRadius: '16px', padding: '1.6rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          {[
            { label: 'Total Merged PRs', val: '42', color: '#FF7B00' },
            { label: 'Repositories', val: '8', color: '#16A34A' },
            { label: 'On-chain Attested', val: `${badges.length}`, color: '#A855F7' },
          ].map(({ label, val, color }) => (
            <div key={label} style={{ background: '#FAF8F5', borderRadius: '10px', padding: '1rem', textAlign: 'center', border: '1px solid rgba(78,66,56,0.08)' }}>
              <div style={{ fontSize: '26px', fontWeight: 900, color, marginBottom: '4px' }}>{val}</div>
              <div style={{ fontSize: '11px', color: '#5C544F', fontWeight: 600 }}>{label}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: '12px', fontWeight: 800, color: '#1B1816', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>All Contributions</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {badges.map(b => (
            <div key={b.tokenId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: '8px', background: '#FAF8F5', border: '1px solid rgba(78,66,56,0.07)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <RepoAvatar repo={b.repo} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '13px', color: '#1B1816' }}>{b.prTitle}</div>
                  <div style={{ fontSize: '10px', color: '#9E9089' }}>{b.repo} · PR #{b.prNumber}</div>
                </div>
              </div>
              <div style={{ fontSize: '11px', color: '#9E9089' }}>{formatDuration(b.mergeTimestamp)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function SettingsPanel() {
  const [saved, setSaved] = useState(false)
  const [github, setGithub] = useState('moizz')
  const [notifs, setNotifs] = useState(true)

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#1B1816', marginBottom: '1.5rem' }}>Settings</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', maxWidth: '560px' }}>

        {/* GitHub */}
        <div style={{ background: '#FFF', border: '1px solid rgba(78,66,56,0.1)', borderRadius: '14px', padding: '1.4rem' }}>
          <div style={{ fontWeight: 800, fontSize: '13px', color: '#1B1816', marginBottom: '4px' }}>GitHub Username</div>
          <div style={{ fontSize: '12px', color: '#5C544F', marginBottom: '12px' }}>Linked GitHub account for proof attestation</div>
          <input
            value={github}
            onChange={e => setGithub(e.target.value)}
            placeholder="your-github-username"
            style={{ width: '100%', padding: '10px 14px', border: '1px solid rgba(78,66,56,0.2)', borderRadius: '8px', fontSize: '13px', fontFamily: 'inherit', outline: 'none', color: '#1B1816', background: '#FAF8F5' }}
          />
        </div>

        {/* Wallet */}
        <div style={{ background: '#FFF', border: '1px solid rgba(78,66,56,0.1)', borderRadius: '14px', padding: '1.4rem' }}>
          <div style={{ fontWeight: 800, fontSize: '13px', color: '#1B1816', marginBottom: '4px' }}>Connected Wallet</div>
          <div style={{ fontSize: '12px', color: '#5C544F', marginBottom: '12px' }}>Your on-chain identity for SBT minting</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', border: '1px solid rgba(255,123,0,0.25)', borderRadius: '8px', background: '#FFF7ED', color: '#FF7B00', fontSize: '12px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
            <IconWallet size={14} color="#FF7B00" />
            0xA7f2d5e3052E9B663a8a3f5a70966a3f457c19e5
          </div>
        </div>

        {/* Notifications */}
        <div style={{ background: '#FFF', border: '1px solid rgba(78,66,56,0.1)', borderRadius: '14px', padding: '1.4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: '13px', color: '#1B1816', marginBottom: '3px' }}>Proof Notifications</div>
            <div style={{ fontSize: '12px', color: '#5C544F' }}>Get notified when a new SBT is minted</div>
          </div>
          <button
            onClick={() => setNotifs(v => !v)}
            style={{
              width: '42px', height: '24px', borderRadius: '99px', border: 'none', cursor: 'pointer',
              background: notifs ? '#FF7B00' : '#E5E0DB',
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
        <div style={{ background: '#FFF', border: '1px solid rgba(78,66,56,0.1)', borderRadius: '14px', padding: '1.4rem' }}>
          <div style={{ fontWeight: 800, fontSize: '13px', color: '#1B1816', marginBottom: '4px' }}>Network</div>
          <div style={{ fontSize: '12px', color: '#5C544F', marginBottom: '12px' }}>Active blockchain network</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', border: '1px solid rgba(78,66,56,0.15)', borderRadius: '8px', fontSize: '12px', fontWeight: 600, color: '#1B1816' }}>
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
      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: '10px', border: '1px solid rgba(78,66,56,0.07)', background: '#FAFAF9', cursor: 'pointer', transition: 'background 0.15s, border-color 0.15s', textAlign: 'left' }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#FFF7ED'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,123,0,0.18)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#FAFAF9'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(78,66,56,0.07)' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <RepoAvatar repo={b.repo} />
        <div>
          <div style={{ fontWeight: 700, fontSize: '13px', color: '#1B1816' }}>{b.prTitle}</div>
          <div style={{ fontSize: '10px', color: '#9E9089', marginTop: '2px' }}>{b.repo}</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
        <span style={{ fontSize: '11px', color: '#9E9089' }}>{formatDuration(b.mergeTimestamp)}</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#DCFCE7', color: '#16A34A', border: '1px solid rgba(22,163,74,0.2)', borderRadius: '99px', fontSize: '10px', fontWeight: 700, padding: '3px 9px', whiteSpace: 'nowrap' }}>
          <IconCheck size={10} color="#16A34A" /> Attested
        </span>
      </div>
    </div>
  )
}

// ─── Overview panel ───────────────────────────────────────────
function OverviewPanel({
  badges, onSelect, onViewAll, onNavTo, onSearch,
}: {
  badges: BadgeData[]
  onSelect: (b: BadgeData) => void
  onViewAll: () => void
  onNavTo: (id: NavId) => void
  onSearch: () => void
}) {
  const navigate = useNavigate()
  return (
    <>
      {/* Builder score hero */}
      <section style={{ background: '#110F0E', color: 'white', borderRadius: '16px', padding: '2rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.8rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 5% 30%, rgba(255,123,0,0.1) 0%, transparent 55%)' }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ fontSize: '10px', fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>YOUR BUILDER XP</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '8px' }}>
            <span style={{ fontSize: '44px', fontWeight: 900, color: '#FFF', lineHeight: 1 }}>1,245</span>
            <span style={{ background: 'rgba(255,123,0,0.15)', border: '1px solid rgba(255,123,0,0.3)', borderRadius: '99px', padding: '4px 12px', fontSize: '10px', color: '#FF7B00', fontWeight: 800 }}>
              Builder <span style={{ opacity: 0.7 }}>Lv. 3</span>
            </span>
          </div>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', marginBottom: '1.4rem' }}>Keep contributing to level up!</p>
          <div style={{ width: '300px' }}>
            <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '99px', overflow: 'hidden', marginBottom: '6px' }}>
              <div style={{ width: '62.25%', height: '100%', background: 'linear-gradient(90deg,#FFA940,#FF7B00)', borderRadius: '99px' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-mono)' }}>
              <span>1,245 / 2,000 XP</span><span>2,000 XP</span>
            </div>
          </div>
        </div>
        <div style={{ position: 'relative', width: '130px', height: '130px', zIndex: 2, flexShrink: 0 }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle, rgba(255,123,0,0.28) 0%, transparent 70%)', filter: 'blur(14px)' }} />
          <img src="/reputation_shield.png" alt="Builder Shield" className="animate-float" style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 10px 24px rgba(255,123,0,0.4))', mixBlendMode: 'screen' }} />
        </div>
      </section>

      {/* 4 stats */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.2rem', marginBottom: '1.8rem' }}>
        {[
          { icon: <IconCode size={14} color="#FF7B00" />,         label: 'Total Proofs',      value: '28',   sub: '+5 this month',       subColor: '#16A34A', nav: 'contributions' as NavId },
          { icon: <IconAward size={14} color="#FF7B00" />,        label: 'SBTs Minted',       value: '12',   sub: '+3 this month',       subColor: '#16A34A', nav: 'sbts' as NavId },
          { icon: <IconShieldCheck size={14} color="#FF7B00" />,  label: 'Contribution Level',value: 'Lv. 3',sub: 'Top 18% of builders', subColor: '#FF7B00', nav: undefined },
          { icon: <IconFolder size={14} color="#FF7B00" />,       label: 'Repositories',      value: '8',    sub: 'Across all networks',  subColor: '#9E9089', nav: 'contributions' as NavId },
        ].map(({ icon, label, value, sub, subColor, nav }) => (
          <div
            key={label}
            onClick={() => nav && onNavTo(nav)}
            style={{ background: '#FFF', border: '1px solid rgba(78,66,56,0.1)', borderRadius: '12px', padding: '1.4rem', textAlign: 'left', cursor: nav ? 'pointer' : 'default', transition: 'box-shadow 0.15s' }}
            onMouseEnter={e => { if (nav) (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(255,123,0,0.08)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}
          >
            <div style={{ fontSize: '11px', color: '#9E9089', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>{icon} {label}</div>
            <span style={{ fontSize: '30px', fontWeight: 900, color: '#1B1816', display: 'block', lineHeight: 1 }}>{value}</span>
            <span style={{ fontSize: '10px', color: subColor, fontWeight: 700, marginTop: '6px', display: 'block' }}>{sub}</span>
          </div>
        ))}
      </section>

      {/* 2-col bottom */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 0.7fr', gap: '1.8rem', alignItems: 'start' }}>

        {/* Recent Proofs */}
        <section style={{ background: '#FFF', border: '1px solid rgba(78,66,56,0.1)', borderRadius: '16px', padding: '1.6rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.4rem' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 900, color: '#1B1816', margin: 0 }}>Recent Proofs</h2>
            <button id="view-all-proofs" onClick={onViewAll} style={{ color: '#FF7B00', fontSize: '12px', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>View all</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {badges.map(b => <ProofRow key={b.tokenId} b={b} onSelect={onSelect} />)}
          </div>
        </section>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Your Stats */}
          <div style={{ background: '#FFF', border: '1px solid rgba(78,66,56,0.1)', borderRadius: '16px', padding: '1.4rem' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 800, color: '#1B1816', borderBottom: '1px solid rgba(78,66,56,0.08)', paddingBottom: '10px', marginBottom: '14px' }}>Your Stats</h3>
            {[
              { icon: <IconCode size={13} color="#9E9089" />,    label: 'Contributions', val: '42' },
              { icon: <IconFolder size={13} color="#9E9089" />,  label: 'Repositories',  val: '8' },
              { icon: <IconGlobe size={13} color="#9E9089" />,   label: 'Networks',      val: '1', sub: 'Monad Testnet' },
              { icon: <IconAward size={13} color="#9E9089" />,   label: 'Member Since',  val: 'Apr 8, 2025' },
            ].map(({ icon, label, val, sub }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', fontSize: '12px', padding: '5px 0', borderBottom: '1px solid rgba(78,66,56,0.05)' }}>
                <span style={{ color: '#5C544F', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>{icon}{label}</span>
                <div style={{ textAlign: 'right' }}>
                  <strong style={{ color: '#1B1816', display: 'block' }}>{val}</strong>
                  {sub && <span style={{ fontSize: '10px', color: '#9E9089' }}>{sub}</span>}
                </div>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div style={{ background: '#FFF', border: '1px solid rgba(78,66,56,0.1)', borderRadius: '16px', padding: '1.4rem' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 800, color: '#1B1816', borderBottom: '1px solid rgba(78,66,56,0.08)', paddingBottom: '10px', marginBottom: '14px' }}>Recent Activity</h3>
            {[
              { title: 'SBT Minted',     desc: '"Open Source Contributor"',  time: '2h ago' },
              { title: 'Proof Attested', desc: 'feat: add dark mode toggle', time: '2h ago' },
              { title: 'Proof Attested', desc: 'fix: resolve UI alignment',  time: '1d ago' },
              { title: 'SBT Minted',     desc: '"Early Builder"',            time: '3d ago' },
            ].map(({ title, desc, time }, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', fontSize: '11px', padding: '6px 0', gap: '8px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FF7B00', marginTop: '4px', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: 800, color: '#1B1816' }}>{title}</div>
                    <div style={{ color: '#5C544F', marginTop: '1px' }}>{desc}</div>
                  </div>
                </div>
                <span style={{ color: '#C0824E', fontSize: '10px', flexShrink: 0 }}>{time}</span>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div style={{ background: '#FFF', border: '1px solid rgba(78,66,56,0.1)', borderRadius: '16px', padding: '1.2rem 1.4rem' }}>
            <h3 style={{ fontSize: '11px', color: '#9E9089', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '14px' }}>Quick Actions</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              {[
                { icon: <IconShieldCheck size={18} color="#FF7B00" />, label: 'Verify Proof',    action: () => navigate('/how-it-works') },
                { icon: <IconPackage size={18} color="#FF7B00" />,     label: 'Mint SBT',        action: () => onNavTo('sbts') },
                { icon: <IconUserPlus size={18} color="#FF7B00" />,    label: 'Invite Builder',  action: onSearch },
                { icon: <IconBook size={18} color="#FF7B00" />,        label: 'View Docs',       action: () => navigate('/install') },
              ].map(({ icon, label, action }) => (
                <button
                  key={label}
                  onClick={action}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'center', padding: '4px 0' }}
                >
                  <div
                    style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#FFF7ED', border: '1px solid rgba(255,123,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px', transition: 'background 0.15s' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#FFE8CC'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#FFF7ED'}
                  >
                    {icon}
                  </div>
                  <span style={{ fontSize: '9px', fontWeight: 700, color: '#5C544F', display: 'block', lineHeight: 1.2 }}>{label}</span>
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
  const [badges, setBadges] = useState<BadgeData[]>(MOCK_BADGES)
  const [selected, setSelected] = useState<BadgeData | null>(null)
  const [loading, setLoading] = useState(false)
  const [showSearchModal, setShowSearchModal] = useState(false)
  const [activeNav, setActiveNav] = useState<NavId>('overview')

  async function handleLookup(lookupQuery: string) {
    if (!lookupQuery.trim()) return
    setLoading(true)
    let target = lookupQuery.trim()
    if (!target.startsWith('0x') || target.length !== 42) {
      try {
        const res = await fetch(`/api/wallet/resolve?query=${encodeURIComponent(target)}`)
        if (res.ok) { const d = await res.json(); target = d.walletAddress }
        else if (['demo', 'moizz'].includes(target.toLowerCase())) target = '0xA7f2d5e3052E9B663a8a3f5a70966a3f457c19e5'
      } catch {
        if (['demo', 'moizz'].includes(target.toLowerCase())) target = '0xA7f2d5e3052E9B663a8a3f5a70966a3f457c19e5'
      }
    }
    try {
      const live = await getAttestations(target)
      setBadges(live.length > 0 ? live : MOCK_BADGES)
    } catch { setBadges(MOCK_BADGES) }
    finally { setLoading(false); setShowSearchModal(false) }
  }

  const sidebarLinks: { id: NavId; icon: React.ReactNode; label: string }[] = [
    { id: 'overview',       icon: <IconHome size={16} />,         label: 'Overview' },
    { id: 'sbts',           icon: <IconAward size={16} />,        label: 'SBTs' },
    { id: 'contributions',  icon: <IconCode size={16} />,         label: 'Contributions' },
    { id: 'settings',       icon: <IconSettings size={16} />,     label: 'Settings' },
  ]

  const pageTitle: Record<NavId, string> = {
    overview:       'Dashboard',
    sbts:           'SBTs',
    contributions:  'Contributions',
    settings:       'Settings',
  }

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
        <div style={{ background: '#FFF7ED', border: '1px solid rgba(255,123,0,0.15)', borderRadius: '12px', padding: '1.2rem 1rem', textAlign: 'center' }}>
          <div style={{ width: '42px', height: '42px', margin: '0 auto 10px', background: 'rgba(255,123,0,0.1)', border: '1.5px solid rgba(255,123,0,0.25)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconShieldCheck size={22} color="#FF7B00" />
          </div>
          <div style={{ fontWeight: 800, fontSize: '12px', color: '#1B1816', marginBottom: '5px' }}>Build. Proof. Grow.</div>
          <div style={{ fontSize: '11px', color: '#5C544F', marginBottom: '14px', lineHeight: 1.5 }}>Your proof is your superpower.</div>
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
            {activeNav === 'overview' && <div style={{ fontSize: '13px', color: 'var(--ink-muted)', marginTop: '3px' }}>Welcome back, builder!</div>}
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
              0xA7f2...9c4E
              <span style={{ fontSize: '8px', opacity: 0.5 }}>▼</span>
            </button>
            <ThemeToggle />
          </div>
        </header>

        {/* Active panel */}
        {activeNav === 'overview' && (
          <OverviewPanel
            badges={badges}
            onSelect={setSelected}
            onViewAll={() => setActiveNav('contributions')}
            onNavTo={setActiveNav}
            onSearch={() => setShowSearchModal(true)}
          />
        )}
        {activeNav === 'sbts'          && <SBTsPanel          badges={badges} onSelect={setSelected} />}
        {activeNav === 'contributions' && <ContributionsPanel badges={badges} />}
        {activeNav === 'settings'      && <SettingsPanel />}
      </main>

      {/* Search Modal */}
      {showSearchModal && (
        <div className="modal-overlay" onClick={() => setShowSearchModal(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#FFF', padding: '2rem', borderRadius: '16px', width: '100%', maxWidth: '420px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 900, marginBottom: '1rem', color: '#1B1816' }}>Look up a contributor</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                id="lookup-input"
                placeholder="GitHub username or wallet address"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLookup(query)}
                style={{ flex: 1, padding: '10px 14px', border: '1px solid rgba(78,66,56,0.2)', borderRadius: '8px', fontSize: '13px', fontFamily: 'inherit', outline: 'none' }}
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
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
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
