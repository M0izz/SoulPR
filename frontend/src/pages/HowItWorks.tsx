import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  IconShieldCheck, IconLink, IconZap,
  IconArrowRight, IconHelpCircle,
} from '../components/Icons'

const FAQs = [
  { q: 'What is SoulPR?', a: 'SoulPR turns your real contributions (like merged pull requests) into soulbound attestations on Monad. These proofs are non-transferable, verifiable by anyone, and permanently tied to your identity.' },
  { q: 'How does SoulPR work?', a: 'We monitor GitHub pull requests. The moment a PR is merged in a tracked repository, a webhook triggers. If your GitHub identity is linked to a wallet, a Soulbound Token is automatically minted to your address, completely covering gas fees on the backend.' },
  { q: 'What is a Soulbound Token (SBT)?', a: 'Soulbound Tokens (SBTs) are non-fungible tokens that represent traits, features, or achievements on-chain. Once minted to a wallet, they cannot be transferred or sold, ensuring the credentials stay with the builder.' },
  { q: 'Is my data and reputation safe?', a: 'Yes, only your contribution parameters (repository name, PR number, title, and timestamp) are stored. We do not store repository code or private GitHub configurations, and you only ever sign free messages to confirm wallet ownership.' },
  { q: 'Where are the attestations stored?', a: 'Attestations are stored as smart contract state variables in the SoulPR contract on the Monad testnet, with full base64 SVG rendering generated natively on-chain.' },
  { q: 'Do I need to pay any fees?', a: 'No. The gas fees for minting the on-chain SBT are covered entirely by our backend minter wallet, making the entire experience 100% free for open-source contributors.' },
  { q: "Can I verify someone else's proof?", a: 'Yes. Every badge includes its Monad Explorer transaction link, allowing anyone to verify ownership and PR validity on the blockchain ledger instantly.' },
  { q: 'Which networks does SoulPR support?', a: 'SoulPR currently operates natively on the Monad testnet to guarantee scale, high speeds, and low transaction operations.' },
]

const STEPS = [
  { n: '01', icon: <GitHubIcon />, title: 'MERGE HAPPENS', desc: 'You merge a pull request on GitHub.' },
  { n: '02', icon: <WebhookIcon />, title: 'WEBHOOK TRIGGERED', desc: 'GitHub sends real-time event to SoulPR.' },
  { n: '03', icon: <ShieldCheckIcon />, title: 'VERIFY & VALIDATE', desc: 'We verify the merge, repo, and contributor data.' },
  { n: '04', icon: <PackageIcon />, title: 'MINT SBT', desc: 'A soulbound token is minted on Monad Testnet.' },
  { n: '05', icon: <DocIcon />, title: 'ATTESTED FOREVER', desc: 'Your contribution is recorded on-chain. Tamper-proof.' },
  { n: '06', icon: <PersonIcon />, title: 'SHOWCASE PROOF', desc: 'View and share your on-chain proof.' },
]

const WHY = [
  { icon: <IconShieldCheck size={22} color="#FF7B00" />, title: 'TAMPER-PROOF', desc: 'On-chain attestations that cannot be changed or faked.' },
  { icon: <IconLink size={22} color="#FF7B00" />, title: 'TRANSFER-PROOF', desc: 'Soulbound by design. Yours forever.' },
  { icon: <IconGlobe size={22} color="#FF7B00" />, title: 'OPEN & PORTABLE', desc: 'Public, permissionless and easy to verify anywhere.' },
  { icon: <IconZap size={22} color="#FF7B00" />, title: 'BUILT ON MONAD', desc: 'High performance chain for the next generation of builders.' },
]

const LOGOS = ['GitHub', 'MONAD', 'Thirdweb', 'Alchemy', 'Viem', 'wagmi', 'RainbowKit']

export default function HowItWorks() {
  const navigate = useNavigate()
  const [activeFaq, setActiveFaq] = useState<number | null>(0)

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: '#FAF6F0', color: '#1B1816', overflowY: 'auto' }}>

      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '4rem 1.5rem 5rem' }}>

        {/* ── SECTION 1: 6-Step Flow ── */}
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <div style={{ fontSize: '10px', fontWeight: 800, color: '#FF7B00', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '10px' }}>
            HOW IT WORKS
          </div>
          <h2 style={{ fontSize: '36px', fontWeight: 900, marginBottom: '14px', color: '#1B1816' }}>
            From Code to <span style={{ color: '#FF7B00' }}>On-Chain Proof</span>
          </h2>
          <p style={{ fontSize: '14px', color: '#5C544F', maxWidth: '500px', margin: '0 auto 3.5rem', lineHeight: '1.7' }}>
            SoulPR captures your real contributions and turns them into verifiable, soulbound attestations on Monad.
          </p>

          {/* Steps row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px', textAlign: 'left' }}>
            {STEPS.map(({ n, icon, title, desc }, i) => (
              <div key={n} style={{ position: 'relative' }}>
                <div style={{ padding: '1.2rem 1rem', borderRadius: '10px', background: 'rgba(255,255,255,0.75)', border: '1px solid rgba(192,130,78,0.22)', boxShadow: '0 2px 8px rgba(192,130,78,0.04)', height: '100%' }}>
                  <div style={{ fontSize: '9px', fontWeight: 800, color: '#FF7B00', marginBottom: '10px', fontFamily: 'var(--font-mono)' }}>{n}</div>
                  <div style={{ marginBottom: '8px', color: '#5C544F' }}>{icon}</div>
                  <div style={{ fontWeight: 800, fontSize: '10px', color: '#1B1816', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.03em' }}>{title}</div>
                  <div style={{ fontSize: '10px', color: '#5C544F', lineHeight: '1.45' }}>{desc}</div>
                </div>
                {/* Arrow connector */}
                {i < STEPS.length - 1 && (
                  <div style={{ position: 'absolute', right: '-8px', top: '50%', transform: 'translateY(-50%)', zIndex: 2, color: '#FF7B00', fontSize: '12px', fontWeight: 900 }}>›</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── SECTION 2: Why SoulPR ── */}
        <div style={{ background: '#110F0E', color: 'white', borderRadius: '16px', padding: '2.8rem 2.5rem', marginBottom: '5rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 8% 30%, rgba(255,123,0,0.07) 0%, transparent 55%)', pointerEvents: 'none' }} />
          <div style={{ textAlign: 'center', marginBottom: '2.5rem', position: 'relative', zIndex: 2 }}>
            <div style={{ fontSize: '9px', fontWeight: 800, color: '#FF7B00', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '10px' }}>WHY SOULPR?</div>
            <h3 style={{ fontSize: '22px', fontWeight: 900 }}>
              Reputation that's <span style={{ color: '#FF7B00' }}>Real.</span> Proof that's <span style={{ color: '#FF7B00' }}>Permanent.</span>
            </h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', textAlign: 'left', position: 'relative', zIndex: 2 }}>
            {WHY.map(({ icon, title, desc }) => (
              <div key={title}>
                <div style={{ marginBottom: '10px' }}>{icon}</div>
                <div style={{ fontWeight: 800, fontSize: '12px', color: '#FFF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>{title}</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', lineHeight: '1.55' }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── SECTION 3: Trusted By ── */}
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <div style={{ fontSize: '9px', fontWeight: 800, color: '#C0824E', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1.8rem' }}>
            TRUSTED BY BUILDERS, BACKED BY THE COMMUNITY
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '3rem' }}>
            {LOGOS.map(logo => (
              <span key={logo} style={{ fontWeight: 900, fontSize: '14px', color: '#1B1816', letterSpacing: '-0.01em', opacity: 0.6 }}>{logo}</span>
            ))}
          </div>
        </div>

        {/* ── SECTION 4: FAQ Accordion ── */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '34px', fontWeight: 900, marginBottom: '12px', color: '#1B1816' }}>
            How <span style={{ color: '#FF7B00' }}>It</span> Works
          </h2>
          <p style={{ fontSize: '14px', color: '#5C544F', marginBottom: '3rem' }}>
            Find answers to the most common questions about SoulPR.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '800px', margin: '0 auto', textAlign: 'left' }}>
            {FAQs.map((faq, i) => {
              const isOpen = activeFaq === i
              return (
                <div
                  key={i}
                  style={{ borderRadius: '12px', border: `1px solid ${isOpen ? 'rgba(255,123,0,0.25)' : 'rgba(192,130,78,0.2)'}`, overflow: 'hidden', background: '#FFF', transition: 'border-color 0.2s' }}
                >
                  <button
                    id={`faq-${i}`}
                    onClick={() => setActiveFaq(isOpen ? null : i)}
                    style={{
                      width: '100%', padding: '1.2rem 1.6rem',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      cursor: 'pointer', background: 'none', border: 'none', textAlign: 'left',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 700, fontSize: '14px', color: '#1B1816' }}>
                      {/* Circle +/- icon */}
                      <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#FF7B00', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ color: '#FFF', fontSize: '16px', lineHeight: 1, fontWeight: 400 }}>{isOpen ? '−' : '+'}</span>
                      </span>
                      {faq.q}
                    </span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9E9089" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s', flexShrink: 0, marginLeft: '12px' }}>
                      <polyline points="6,9 12,15 18,9"/>
                    </svg>
                  </button>
                  {isOpen && (
                    <div style={{ padding: '0 1.6rem 1.4rem 3.8rem', fontSize: '13px', color: '#5C544F', lineHeight: '1.7', borderTop: '1px solid rgba(192,130,78,0.12)', paddingTop: '1rem' }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Still have questions */}
          <div style={{ marginTop: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '13px', color: '#5C544F' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '50%', border: '1px solid rgba(192,130,78,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconHelpCircle size={16} color="#C0824E" />
            </div>
            <span>
              Still have questions?{' '}
              <a href="https://discord.gg/monad" target="_blank" rel="noopener noreferrer" style={{ color: '#FF7B00', fontWeight: 700 }}>Join our Discord</a>
              {' '}or check out the{' '}
              <button onClick={() => navigate('/install')} style={{ color: '#FF7B00', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}>Docs</button>.
            </span>
          </div>
        </div>

        {/* ── SECTION 5: Bottom CTA ── */}
        <div style={{ background: '#FFF7ED', border: '1px solid rgba(255,123,0,0.2)', borderRadius: '20px', padding: '2.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '2rem' }}>
          <div style={{ textAlign: 'left' }}>
            <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#1B1816', marginBottom: '8px' }}>
              Your work deserves more than a thank you.
            </h3>
            <p style={{ fontSize: '15px', color: '#FF7B00', fontWeight: 800, margin: 0 }}>It deserves to be proven.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexShrink: 0 }}>
            <button
              id="cta-connect-wallet"
              onClick={() => navigate('/link-wallet')}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: 'linear-gradient(135deg,#FF7B00,#E05300)', color: 'white',
                border: 'none', borderRadius: '8px', padding: '0.9rem 1.8rem',
                fontSize: '14px', fontWeight: 700, cursor: 'pointer',
                boxShadow: '0 4px 18px rgba(255,123,0,0.2)',
                transition: 'transform 0.15s, box-shadow 0.15s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(255,123,0,0.3)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 18px rgba(255,123,0,0.2)' }}
            >
              Connect Wallet to Get Started <IconArrowRight size={14} color="white" />
            </button>
            <div style={{ width: '56px', height: '56px', flexShrink: 0 }}>
              <img src="/reputation_shield.png" alt="Shield" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
          </div>
        </div>

      </main>
    </div>
  )
}

// Inline step icons (plain SVGs, no emojis)
function GitHubIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="#5C544F"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
}
function WebhookIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5C544F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 9v-6M12 21v-6M4.22 6.22l4.24 4.24M15.54 13.54l4.24 4.24M3 12H9M15 12h6M4.22 17.78l4.24-4.24M15.54 10.46l4.24-4.24"/></svg>
}
function ShieldCheckIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5C544F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9,12 11,14 15,10"/></svg>
}
function PackageIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5C544F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27,6.96 12,12.01 20.73,6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
}
function DocIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5C544F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
}
function PersonIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5C544F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
}
function IconGlobe({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
}
