import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  IconArrowLeft, IconCheck, IconCopy, IconCalendar,
  IconUser, IconShieldCheck, IconExternalLink,
  IconCode, IconAward, IconSoulPRLogo, IconWallet,
} from './Icons'

export interface BadgeData {
  tokenId: number
  repo: string
  prNumber: number
  prTitle: string
  githubUsername?: string
  mergeCommitSha?: string
  contributor: string
  mergeTimestamp: number
  txHash: string
  network: string
}

interface Props {
  badge: BadgeData
  onClose: () => void
}

function fmt(ts: number) {
  return new Date(ts * 1000).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
  })
}

function fmtDate(ts: number) {
  return new Date(ts * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function short(addr: string) {
  if (addr.length <= 13) return addr
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

// Star positions (% based so they work at any size)
const STARS = [
  { x: 8,  y: 6,  s: 2,   d: 0 },    { x: 22, y: 3,  s: 1.5, d: 0.4 },
  { x: 48, y: 8,  s: 1,   d: 0.8 },  { x: 68, y: 4,  s: 2,   d: 1.2 },
  { x: 85, y: 12, s: 1.5, d: 0.6 },  { x: 93, y: 6,  s: 1,   d: 1.8 },
  { x: 14, y: 28, s: 1,   d: 0.3 },  { x: 36, y: 22, s: 2,   d: 1.1 },
  { x: 72, y: 18, s: 1,   d: 0.7 },  { x: 90, y: 32, s: 1.5, d: 1.5 },
  { x: 5,  y: 52, s: 1,   d: 0.9 },  { x: 58, y: 45, s: 2,   d: 0.2 },
  { x: 95, y: 48, s: 1,   d: 1.4 },  { x: 18, y: 68, s: 1.5, d: 0.5 },
  { x: 78, y: 62, s: 1,   d: 1.7 },  { x: 44, y: 78, s: 2,   d: 0.1 },
  { x: 62, y: 85, s: 1,   d: 1.3 },  { x: 28, y: 90, s: 1.5, d: 0.8 },
  { x: 88, y: 80, s: 1,   d: 0.4 },  { x: 50, y: 95, s: 2,   d: 1.6 },
]

export default function BadgeDetailModal({ badge, onClose }: Props) {
  const [copied, setCopied] = useState(false)

  function copyAddr() {
    navigator.clipboard.writeText(badge.contributor).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: '#08060F',
      display: 'flex', flexDirection: 'column',
      fontFamily: 'var(--font-body)',
      overflowY: 'auto',
    }}>

      {/* ── TOP NAVIGATION ── */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0.7rem 2rem',
        background: 'rgba(8, 6, 15, 0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(168,85,247,0.12)',
        position: 'sticky', top: 0, zIndex: 20, flexShrink: 0,
      }}>
        {/* Logo */}
        <Link to="/" onClick={onClose} style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <IconSoulPRLogo size={28} />
          <div style={{ lineHeight: 1.1 }}>
            <div style={{ fontWeight: 900, fontSize: '15px', color: '#FFF' }}>SoulPR</div>
            <div style={{ fontSize: '7px', textTransform: 'uppercase', color: '#E05300', letterSpacing: '0.06em', fontWeight: 700 }}>proof that builds you</div>
          </div>
        </Link>

        {/* Nav links */}
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          {['Dashboard', 'My Proofs', 'SBTs', 'Contributions'].map(lbl => {
            const active = lbl === 'SBTs'
            return (
              <button
                key={lbl}
                onClick={onClose}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer', padding: '2px 0',
                  fontSize: '13px', fontWeight: active ? 700 : 500,
                  color: active ? '#FF7B00' : 'rgba(255,255,255,0.6)',
                  borderBottom: active ? '2px solid #FF7B00' : '2px solid transparent',
                  transition: 'color 0.15s',
                }}
              >
                {lbl}
              </button>
            )
          })}
        </div>

        {/* Right controls */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.28)', borderRadius: '8px', padding: '5px 12px', color: '#C084FC', fontSize: '11px', fontWeight: 600 }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#A855F7', display: 'inline-block' }} />
            MONAD TESTNET
            <span style={{ fontSize: '7px', opacity: 0.6 }}>▼</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,123,0,0.38)', borderRadius: '8px', padding: '5px 12px', color: '#FF7B00', fontSize: '11px', fontWeight: 700 }}>
            <IconWallet size={13} color="#FF7B00" />
            0xA7f2...9c4E
            <span style={{ fontSize: '7px', opacity: 0.5 }}>▼</span>
          </div>
        </div>
      </nav>

      {/* ── BACK LINK ── */}
      <div style={{ padding: '1rem 2rem 0', flexShrink: 0 }}>
        <button
          onClick={onClose}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.45)', fontSize: '13px', fontWeight: 600, padding: 0, transition: 'color 0.15s' }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#FFF'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.45)'}
        >
          <IconArrowLeft size={14} /> Back to all SBTs
        </button>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', flex: 1, minHeight: '600px' }}>

        {/* ══════════════════════════════════════
            LEFT COLUMN — Holographic SBT Card
            ══════════════════════════════════════ */}
        <div style={{
          background: 'linear-gradient(160deg, #1e1040 0%, #0e082a 45%, #130a30 100%)',
          position: 'relative', overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
          padding: '2.2rem 2rem',
          borderRight: '1px solid rgba(168,85,247,0.12)',
        }}>

          {/* ── Star particles ── */}
          {STARS.map((st, i) => (
            <div key={i} style={{
              position: 'absolute',
              left: `${st.x}%`, top: `${st.y}%`,
              width: `${st.s}px`, height: `${st.s}px`,
              borderRadius: '50%', background: '#fff',
              opacity: 0.35,
              animation: `starTwinkle ${2.5 + (i % 4) * 0.5}s ease-in-out infinite`,
              animationDelay: `${st.d}s`,
              pointerEvents: 'none',
            }} />
          ))}

          {/* ── Wave aurora — bottom ── */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '260px',
            background: 'radial-gradient(ellipse at 50% 120%, rgba(120,50,220,0.4) 0%, rgba(60,10,140,0.2) 40%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          {/* Second aurora layer */}
          <div style={{
            position: 'absolute', bottom: '-20px', left: '-20px', width: '280px', height: '280px',
            background: 'radial-gradient(circle, rgba(168,85,247,0.18) 0%, transparent 65%)',
            filter: 'blur(25px)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', bottom: '-20px', right: '-20px', width: '200px', height: '200px',
            background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 65%)',
            filter: 'blur(20px)',
            pointerEvents: 'none',
          }} />

          {/* Card content */}
          <div style={{ position: 'relative', zIndex: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.8rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 900, color: 'rgba(255,255,255,0.88)', letterSpacing: '0.08em' }}>SOULPR</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'rgba(255,255,255,0.48)' }}>SBT #{String(badge.tokenId).padStart(5, '0')}</span>
            </div>

            {/* ── Hexagon with rotating animations ── */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.8rem' }}>
              <div style={{ position: 'relative', width: '150px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

                {/* Outer rotating conic glow ring */}
                <div style={{
                  position: 'absolute', inset: '-18px',
                  borderRadius: '50%',
                  background: 'conic-gradient(from 0deg, rgba(168,85,247,0.85) 0deg, rgba(99,102,241,0.7) 90deg, transparent 180deg, rgba(168,85,247,0.85) 270deg, rgba(59,130,246,0.85) 360deg)',
                  animation: 'sbtSpinCW 3.5s linear infinite',
                  opacity: 0.55,
                  filter: 'blur(4px)',
                }} />

                {/* Middle counter-rotating dashed ring */}
                <div style={{
                  position: 'absolute', inset: '-8px',
                  borderRadius: '50%',
                  border: '1.5px dashed rgba(168,85,247,0.35)',
                  animation: 'sbtSpinCCW 7s linear infinite',
                }} />

                {/* Inner solid ring accent */}
                <div style={{
                  position: 'absolute', inset: '-2px',
                  borderRadius: '50%',
                  border: '1px solid rgba(168,85,247,0.2)',
                }} />

                {/* ── Main hexagon shape ── */}
                <div style={{
                  width: '128px', height: '144px',
                  clipPath: 'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)',
                  position: 'relative',
                  animation: 'sbtFloat 4.5s ease-in-out infinite',
                  filter: 'drop-shadow(0 0 18px rgba(168,85,247,0.6)) drop-shadow(0 0 40px rgba(168,85,247,0.25))',
                }}>
                  {/* Hex border shell (outer bright layer) */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    clipPath: 'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)',
                    background: 'linear-gradient(145deg, rgba(168,85,247,0.9) 0%, rgba(99,102,241,0.8) 50%, rgba(59,130,246,0.9) 100%)',
                  }} />
                  {/* Hex fill (inner dark layer — creates border illusion) */}
                  <div style={{
                    position: 'absolute', inset: '3px',
                    clipPath: 'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)',
                    background: 'linear-gradient(145deg, rgba(50,20,100,0.92) 0%, rgba(30,10,70,0.95) 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {/* Inner glow */}
                    <div style={{
                      position: 'absolute', inset: '20%',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, rgba(168,85,247,0.25) 0%, transparent 70%)',
                    }} />
                    {/* Code icon */}
                    <IconCode size={42} color="#E9D5FF" strokeWidth={1.8} style={{ position: 'relative', zIndex: 1 }} />
                  </div>
                </div>
              </div>
            </div>

            {/* ACHIEVEMENT pill */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.2rem' }}>
              <span style={{
                background: 'linear-gradient(90deg, rgba(139,92,246,0.35), rgba(99,102,241,0.3))',
                border: '1px solid rgba(168,85,247,0.55)',
                borderRadius: '99px', padding: '5px 22px',
                fontSize: '10px', fontWeight: 800, color: '#DDD6FE',
                textTransform: 'uppercase', letterSpacing: '0.12em',
              }}>ACHIEVEMENT</span>
            </div>

            {/* Title — large bold uppercase */}
            <h2 style={{
              textAlign: 'center', color: '#FFF',
              fontSize: '26px', fontWeight: 950,
              textTransform: 'uppercase', letterSpacing: '0.03em',
              margin: '0 0 1rem', lineHeight: 1.2,
            }}>
              OPEN SOURCE<br />CONTRIBUTOR
            </h2>

            {/* Description */}
            <p style={{
              textAlign: 'center', fontSize: '12px',
              color: 'rgba(255,255,255,0.45)', lineHeight: 1.65,
              margin: '0 1rem', flexGrow: 1,
            }}>
              Awarded for making your first meaningful contribution to an open source repository.
            </p>

            {/* Issued to / on */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '1.1rem', marginTop: '1.5rem', marginBottom: '1.1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8px', color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '7px' }}>
                <span>ISSUED TO</span>
                <span>ISSUED ON</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ flex: 1, fontSize: '12px', fontWeight: 700, color: '#FFF', fontFamily: 'var(--font-mono)' }}>
                  {short(badge.contributor)}
                </span>
                <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)', margin: '0 14px' }} />
                <span style={{ flex: 1, fontSize: '12px', fontWeight: 700, color: '#FFF', textAlign: 'right' }}>
                  {fmtDate(badge.mergeTimestamp)}
                </span>
              </div>
            </div>

            {/* Verifiable footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '9px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                <IconShieldCheck size={11} color="rgba(255,255,255,0.3)" />
                VERIFIABLE ON <span style={{ color: '#FF7B00', fontWeight: 800 }}>MONAD TESTNET</span>
              </span>
              <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(168,85,247,0.18)', border: '1px solid rgba(168,85,247,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#A855F7', fontWeight: 900 }}>
                ◆
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════
            RIGHT COLUMN — Details
            ══════════════════════════════════════ */}
        <div style={{ padding: '2.5rem 3rem', color: '#FFF', background: '#0A0814', overflowY: 'auto' }}>

          {/* ACHIEVEMENT SBT + Valid SBT */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 800, color: '#FF7B00', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              <IconAward size={13} color="#FF7B00" /> ACHIEVEMENT SBT
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(22,163,74,0.1)', border: '1px solid rgba(22,163,74,0.32)', borderRadius: '99px', padding: '4px 12px', fontSize: '10px', color: '#4ADE80', fontWeight: 800 }}>
              <IconCheck size={10} color="#4ADE80" /> Valid SBT
            </span>
          </div>

          {/* Title */}
          <h1 style={{ fontSize: '30px', fontWeight: 900, color: '#FFF', margin: '0 0 12px', lineHeight: 1.15 }}>
            Open Source Contributor
          </h1>

          {/* Subtitle */}
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.48)', lineHeight: 1.7, marginBottom: '1.4rem' }}>
            Awarded for making your first meaningful contribution to an open source repository through a merged pull request.
          </p>

          {/* Tag badges */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '2rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.3)', borderRadius: '8px', padding: '6px 14px', fontSize: '12px', color: '#D8B4FE', fontWeight: 700 }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#A855F7', display: 'inline-block' }} />
              Monad Testnet
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '6px 14px', fontSize: '12px', color: 'rgba(255,255,255,0.65)', fontWeight: 700 }}>
              <IconShieldCheck size={13} color="rgba(255,255,255,0.45)" />
              Non-transferable Soulbound Token
            </span>
          </div>

          {/* ── DETAILS table ── */}
          <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.3rem', marginBottom: '1.2rem' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#FF7B00', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '14px' }}>
              DETAILS
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {[
                {
                  icon: <IconAward size={13} color="rgba(255,255,255,0.32)" />,
                  label: 'SBT ID',
                  val: <span style={{ fontFamily: 'var(--font-mono)', color: '#FFF' }}>#{String(badge.tokenId).padStart(5, '0')}</span>,
                },
                {
                  icon: <IconUser size={13} color="rgba(255,255,255,0.32)" />,
                  label: 'Issued To',
                  val: (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-mono)', color: '#FFF' }}>
                      {short(badge.contributor)}
                      <button
                        onClick={copyAddr}
                        title="Copy address"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: copied ? '#4ADE80' : 'rgba(255,255,255,0.3)', padding: 0, display: 'flex', transition: 'color 0.15s' }}
                      >
                        {copied ? <IconCheck size={12} color="#4ADE80" /> : <IconCopy size={12} />}
                      </button>
                    </span>
                  ),
                },
                {
                  icon: <IconCalendar size={13} color="rgba(255,255,255,0.32)" />,
                  label: 'Issued On',
                  val: <span style={{ color: '#FFF' }}>{fmt(badge.mergeTimestamp)}</span>,
                },
                {
                  icon: <IconShieldCheck size={13} color="rgba(255,255,255,0.32)" />,
                  label: 'Issuer',
                  val: (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#FF7B00' }}>
                      SoulPR Protocol
                      <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#FF7B00', display: 'inline-block' }} />
                    </span>
                  ),
                },
                {
                  icon: <IconGlobe size={13} color="rgba(255,255,255,0.32)" />,
                  label: 'Network',
                  val: (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#FFF' }}>
                      Monad Testnet
                      <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#A855F7', display: 'inline-block' }} />
                    </span>
                  ),
                },
                {
                  icon: <IconCode size={13} color="rgba(255,255,255,0.32)" />,
                  label: 'Standard',
                  val: <span style={{ color: '#FFF' }}>ERC-5192 (SBT)</span>,
                },
              ].map(({ icon, label, val }, i, arr) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12.5px', padding: '10px 0', borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.36)' }}>{icon}{label}</span>
                  <strong style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>{val}</strong>
                </div>
              ))}
            </div>
          </div>

          {/* ── ABOUT THIS SBT ── */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.2rem 1.3rem', marginBottom: '1.2rem', gap: '1.2rem' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#FF7B00', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '6px' }}>ABOUT THIS SBT</div>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, margin: 0 }}>
                This SBT represents your on-chain identity as an open source contributor. It proves that you've made your first contribution that was accepted and merged into a public repository.
              </p>
            </div>
            <div style={{
              width: '46px', height: '52px', flexShrink: 0,
              clipPath: 'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)',
              background: 'linear-gradient(145deg, rgba(168,85,247,0.22), rgba(59,130,246,0.18))',
              border: '1.5px solid rgba(168,85,247,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <IconCode size={18} color="#D8B4FE" strokeWidth={1.8} />
            </div>
          </div>

          {/* ── VERIFICATION ── */}
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center', background: 'rgba(255,123,0,0.04)', border: '1px solid rgba(255,123,0,0.14)', borderRadius: '12px', padding: '1.2rem 1.3rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(255,123,0,0.1)', border: '1px solid rgba(255,123,0,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <IconShieldCheck size={20} color="#FF7B00" />
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#FF7B00', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '4px' }}>VERIFICATION</div>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.42)', margin: '0 0 7px', lineHeight: 1.55 }}>
                This Soulbound Token is non-transferable and permanently bound to your wallet.
              </p>
              <a
                id="verify-on-explorer"
                href={`https://testnet.monadexplorer.com/tx/${badge.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#FF7B00', fontWeight: 800, textDecoration: 'none', transition: 'opacity 0.15s' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.7'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
              >
                Verify on Monad Explorer <IconExternalLink size={12} color="#FF7B00" />
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* ── CSS KEYFRAME ANIMATIONS ── */}
      <style>{`
        @keyframes sbtSpinCW {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes sbtSpinCCW {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
        @keyframes sbtFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes starTwinkle {
          0%, 100% { opacity: 0.18; transform: scale(1); }
          50%       { opacity: 0.9;  transform: scale(1.5); }
        }
      `}</style>
    </div>
  )
}

// ─── Inline icon (avoids import conflict) ─────────────────────
function IconGlobe({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  )
}
