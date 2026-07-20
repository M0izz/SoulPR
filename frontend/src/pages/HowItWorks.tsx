import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
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

const LOGOS = ['GitHub', 'MONAD', 'Thirdweb', 'Alchemy', 'Viem', 'wagmi', 'RainbowKit']

export default function HowItWorks() {
  const navigate = useNavigate()
  const [activeFaq, setActiveFaq] = useState<number | null>(0)

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: '#FAF6F0', color: '#1B1816', overflowY: 'auto' }}>

      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '4rem 1.5rem 5rem' }}>



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
