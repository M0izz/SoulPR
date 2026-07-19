import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const FAQs = [
  {
    q: 'What is SoulPR?',
    a: 'SoulPR turns your real contributions (like merged pull requests) into soulbound attestations on Monad. These proofs are non-transferable, verifiable by anyone, and permanently tied to your identity.',
  },
  {
    q: 'How does SoulPR work?',
    a: 'We monitor GitHub pull requests. The moment a PR is merged in a tracked repository, a webhook triggers. If your GitHub identity is linked to a wallet, a Soulbound Token is automatically minted to your address, completely covering gas fees on the backend.',
  },
  {
    q: 'What is a Soulbound Token (SBT)?',
    a: 'Soulbound Tokens (SBTs) are non-fungible tokens that represent traits, features, or achievements on-chain. Once minted to a wallet, they cannot be transferred or sold, ensuring the credentials stay with the builder.',
  },
  {
    q: 'Is my data and reputation safe?',
    a: 'Yes, only your contribution parameters (repository name, PR number, title, and timestamp) are stored. We do not store repository code or private GitHub configurations, and you only ever sign free messages to confirm wallet ownership.',
  },
  {
    q: 'Where are the attestations stored?',
    a: 'Attestations are stored as smart contract state variables in the SoulPR contract on the Monad testnet, with full base64 SVG rendering generated natively on-chain.',
  },
  {
    q: 'Do I need to pay any fees?',
    a: 'No. The gas fees for minting the on-chain SBT are covered entirely by our backend minter wallet, making the entire experience 100% free for open-source contributors.',
  },
  {
    q: 'Can I verify someone else\'s proof?',
    a: 'Yes. Every badge includes its Monad Explorer transaction link, allowing anyone to verify ownership and PR validity on the blockchain ledger instantly.',
  },
  {
    q: 'Which networks does SoulPR support?',
    a: 'SoulPR currently operates natively on the Monad testnet to guarantee scale, high speeds, and low transaction operations.',
  }
]

export default function HowItWorks() {
  const navigate = useNavigate()
  const [activeFaq, setActiveFaq] = useState<number | null>(0)

  return (
    <div style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', background: '#FAF6F0', color: '#1B1816', paddingBottom: '5rem' }}>
      
      {/* Moving Background Coin Animation (Subtle watermark) */}
      <div className="bg-animation-container" aria-hidden="true" style={{ opacity: 0.12 }}>
        <div className="bg-anim-coin coin-main" />
      </div>

      <main className="landing-outer animate-fade-in" style={{ padding: '3.5rem 1.5rem 0', maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* SECTION 1: Progress Steps (From Code to On-Chain Proof) */}
        <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
          <div style={{ fontSize: '10px', fontWeight: 800, color: '#FF7B00', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
            HOW IT WORKS
          </div>
          <h2 style={{ fontSize: '38px', fontWeight: 900, marginBottom: '12px', color: '#1B1816' }}>
            From Code to On-Chain Proof
          </h2>
          <p style={{ fontSize: '15px', color: '#5C544F', maxWidth: '520px', margin: '0 auto 3rem', lineHeight: '1.6' }}>
            SoulPR captures your real contributions and turns them into verifiable, soulbound attestations on Monad.
          </p>

          {/* 6 Steps Row Layout */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '1rem', textAlign: 'left' }}>
            
            <div className="glass-panel" style={{ padding: '1.2rem 1rem', borderRadius: '10px', background: 'rgba(255,255,255,0.65)', border: '1px solid rgba(192, 130, 78, 0.25)', boxShadow: '0 4px 12px rgba(192,130,78,0.03)' }}>
              <div style={{ fontSize: '9px', fontWeight: 800, color: '#FF7B00', marginBottom: '8px' }}>01</div>
              <div style={{ fontWeight: 800, fontSize: '11px', color: '#1B1816', textTransform: 'uppercase', marginBottom: '6px' }}>MERGE HAPPENS</div>
              <div style={{ fontSize: '10px', color: '#5C544F', lineHeight: '1.4' }}>You merge a pull request on GitHub.</div>
            </div>

            <div className="glass-panel" style={{ padding: '1.2rem 1rem', borderRadius: '10px', background: 'rgba(255,255,255,0.65)', border: '1px solid rgba(192, 130, 78, 0.25)', boxShadow: '0 4px 12px rgba(192,130,78,0.03)' }}>
              <div style={{ fontSize: '9px', fontWeight: 800, color: '#FF7B00', marginBottom: '8px' }}>02</div>
              <div style={{ fontWeight: 800, fontSize: '11px', color: '#1B1816', textTransform: 'uppercase', marginBottom: '6px' }}>WEBHOOK TRIGGERED</div>
              <div style={{ fontSize: '10px', color: '#5C544F', lineHeight: '1.4' }}>GitHub sends real-time event to SoulPR.</div>
            </div>

            <div className="glass-panel" style={{ padding: '1.2rem 1rem', borderRadius: '10px', background: 'rgba(255,255,255,0.65)', border: '1px solid rgba(192, 130, 78, 0.25)', boxShadow: '0 4px 12px rgba(192,130,78,0.03)' }}>
              <div style={{ fontSize: '9px', fontWeight: 800, color: '#FF7B00', marginBottom: '8px' }}>03</div>
              <div style={{ fontWeight: 800, fontSize: '11px', color: '#1B1816', textTransform: 'uppercase', marginBottom: '6px' }}>VERIFY &amp; VALIDATE</div>
              <div style={{ fontSize: '10px', color: '#5C544F', lineHeight: '1.4' }}>We verify the merge, repo, and contributor.</div>
            </div>

            <div className="glass-panel" style={{ padding: '1.2rem 1rem', borderRadius: '10px', background: 'rgba(255,255,255,0.65)', border: '1px solid rgba(192, 130, 78, 0.25)', boxShadow: '0 4px 12px rgba(192,130,78,0.03)' }}>
              <div style={{ fontSize: '9px', fontWeight: 800, color: '#FF7B00', marginBottom: '8px' }}>04</div>
              <div style={{ fontWeight: 800, fontSize: '11px', color: '#1B1816', textTransform: 'uppercase', marginBottom: '6px' }}>MINT SBT</div>
              <div style={{ fontSize: '10px', color: '#5C544F', lineHeight: '1.4' }}>A soulbound token is minted on Monad Testnet.</div>
            </div>

            <div className="glass-panel" style={{ padding: '1.2rem 1rem', borderRadius: '10px', background: 'rgba(255,255,255,0.65)', border: '1px solid rgba(192, 130, 78, 0.25)', boxShadow: '0 4px 12px rgba(192,130,78,0.03)' }}>
              <div style={{ fontSize: '9px', fontWeight: 800, color: '#FF7B00', marginBottom: '8px' }}>05</div>
              <div style={{ fontWeight: 800, fontSize: '11px', color: '#1B1816', textTransform: 'uppercase', marginBottom: '6px' }}>ATTESTED FOREVER</div>
              <div style={{ fontSize: '10px', color: '#5C544F', lineHeight: '1.4' }}>Your contribution is recorded on-chain.</div>
            </div>

            <div className="glass-panel" style={{ padding: '1.2rem 1rem', borderRadius: '10px', background: 'rgba(255,255,255,0.65)', border: '1px solid rgba(192, 130, 78, 0.25)', boxShadow: '0 4px 12px rgba(192,130,78,0.03)' }}>
              <div style={{ fontSize: '9px', fontWeight: 800, color: '#FF7B00', marginBottom: '8px' }}>06</div>
              <div style={{ fontWeight: 800, fontSize: '11px', color: '#1B1816', textTransform: 'uppercase', marginBottom: '6px' }}>SHOWCASE PROOF</div>
              <div style={{ fontSize: '10px', color: '#5C544F', lineHeight: '1.4' }}>View and share your on-chain proof.</div>
            </div>

          </div>
        </div>

        {/* SECTION 2: Why SoulPR Box */}
        <div style={{ background: '#110F0E', color: 'white', borderRadius: '16px', padding: '2.5rem', marginBottom: '4.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 10% 20%, rgba(255, 123, 0, 0.05) 0%, rgba(0,0,0,0) 60%)' }} />
          
          <div style={{ fontSize: '9px', fontWeight: 800, color: '#FF7B00', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px', position: 'relative', zIndex: 2 }}>
            WHY SOULPR?
          </div>
          <h3 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '2.5rem', position: 'relative', zIndex: 2 }}>
            Reputation that's <span style={{ color: '#FF7B00' }}>Real.</span> Proof that's <span style={{ color: '#FF7B00' }}>Permanent.</span>
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.8rem', textAlign: 'left', position: 'relative', zIndex: 2 }}>
            
            <div>
              <div style={{ fontSize: '18px', marginBottom: '8px' }}>🛡️</div>
              <div style={{ fontWeight: 800, fontSize: '12px', color: '#FFF', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>TAMPER-PROOF</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.5' }}>On-chain attestations that cannot be changed or faked.</div>
            </div>

            <div>
              <div style={{ fontSize: '18px', marginBottom: '8px' }}>⛓️</div>
              <div style={{ fontWeight: 800, fontSize: '12px', color: '#FFF', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>TRANSFER-PROOF</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.5' }}>Soulbound by design. Yours forever. Bound to your wallet.</div>
            </div>

            <div>
              <div style={{ fontSize: '18px', marginBottom: '8px' }}>🌐</div>
              <div style={{ fontWeight: 800, fontSize: '12px', color: '#FFF', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>OPEN &amp; PORTABLE</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.5' }}>Public, permissionless and easy to verify anywhere.</div>
            </div>

            <div>
              <div style={{ fontSize: '18px', marginBottom: '8px' }}>⚡</div>
              <div style={{ fontWeight: 800, fontSize: '12px', color: '#FFF', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>BUILT ON MONAD</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.5' }}>High performance chain for the next generation of builders.</div>
            </div>

          </div>
        </div>

        {/* SECTION 3: Trusted By Logos */}
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <div style={{ fontSize: '9px', fontWeight: 800, color: '#C0824E', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
            TRUSTED BY BUILDERS, BACKED BY THE COMMUNITY
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '3rem', opacity: 0.7 }}>
            <span style={{ fontWeight: 900, fontSize: '15px', color: '#1B1816', letterSpacing: '-0.02em' }}>🐙 GitHub</span>
            <span style={{ fontWeight: 950, fontSize: '15px', color: '#1B1816', letterSpacing: '0.15em' }}>MONAD</span>
            <span style={{ fontWeight: 900, fontSize: '15px', color: '#1B1816' }}>⛓️ Thirdweb</span>
            <span style={{ fontWeight: 900, fontSize: '15px', color: '#1B1816' }}>⚗️ Alchemy</span>
            <span style={{ fontWeight: 900, fontSize: '15px', color: '#1B1816' }}>◆ Viem</span>
            <span style={{ fontWeight: 900, fontSize: '15px', color: '#1B1816' }}>wagmi</span>
            <span style={{ fontWeight: 900, fontSize: '15px', color: '#1B1816' }}>🌈 RainbowKit</span>
          </div>
        </div>

        {/* SECTION 4: Accordion Card FAQ */}
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 900, marginBottom: '12px' }}>How It Works</h2>
          <p style={{ fontSize: '14px', color: '#5C544F', marginBottom: '3rem' }}>
            Find answers to the most common questions about SoulPR.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '800px', margin: '0 auto', textAlign: 'left' }}>
            {FAQs.map((faq, i) => {
              const active = activeFaq === i
              return (
                <div 
                  key={i} 
                  className="glass-panel" 
                  style={{ borderRadius: '12px', border: '1px solid rgba(192, 130, 78, 0.25)', overflow: 'hidden', background: '#FFF' }}
                >
                  {/* Header Row */}
                  <div 
                    onClick={() => setActiveFaq(active ? null : i)}
                    style={{ padding: '1.2rem 1.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', userSelect: 'none' }}
                  >
                    <span style={{ fontWeight: 800, fontSize: '14px', color: '#1B1816' }}>{faq.q}</span>
                    <span style={{ fontSize: '18px', color: '#FF7B00', fontWeight: 'bold' }}>{active ? '−' : '+'}</span>
                  </div>

                  {/* Expand Answer */}
                  {active && (
                    <div style={{ padding: '0 1.8rem 1.5rem', fontSize: '13px', color: '#5C544F', lineHeight: '1.6', borderTop: '1px solid rgba(192, 130, 78, 0.1)' }}>
                      <p style={{ marginTop: '1rem' }}>{faq.a}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* SECTION 5: Bottom CTA Banner Card */}
        <div style={{ background: '#FFF7ED', border: '1px solid rgba(255, 123, 0, 0.25)', borderRadius: '20px', padding: '3rem', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h3 style={{ fontSize: '24px', fontWeight: 900, color: '#1B1816', marginBottom: '8px' }}>
              Your work deserves more than a thank you.
            </h3>
            <p style={{ fontSize: '16px', color: '#FF7B00', fontWeight: 800, margin: 0 }}>
              It deserves to be proven.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <button 
              className="btn"
              onClick={() => navigate('/link-wallet')}
              style={{ background: 'linear-gradient(135deg, #FF7B00 0%, #E05300 100%)', color: 'white', border: 'none', borderRadius: '8px', padding: '0.9rem 1.8rem', fontSize: '14px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(255,123,0,0.15)' }}
            >
              Connect Wallet to Get Started
            </button>
            <div style={{ width: '60px', height: '60px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img 
                src="/reputation_shield.png" 
                alt="Reputation Shield" 
                style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} 
              />
            </div>
          </div>
        </div>

      </main>
    </div>
  )
}
