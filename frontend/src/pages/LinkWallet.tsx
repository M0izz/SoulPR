import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import api from '../lib/api'
import {
  IconGitHub, IconWallet, IconCheck, IconShieldCheck,
  IconArrowRight, IconZap, IconLock,
} from '../components/Icons'

type StepState = 'done' | 'active' | 'pending'

export default function LinkWallet() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [githubUser, setGithubUser] = useState<string | null>(null)
  const [wallet, setWallet] = useState<string | null>(null)
  const [linking, setLinking] = useState(false)
  const [linked, setLinked] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkStatus = async () => {
      const urlUser = searchParams.get('githubUsername')
      if (urlUser) setGithubUser(urlUser)

      const urlError = searchParams.get('error')
      if (urlError) setError(urlError)

      try {
        const status = await api.getWalletStatus()
        if (status.authenticated) {
          setGithubUser(status.githubUsername ?? null)
          if (status.linked && status.walletAddress) {
            setWallet(status.walletAddress)
            setLinked(true)
          }
        }
      } catch (err: any) {
        console.warn('[LinkWallet] Session status check:', err.message)
      }
    }
    checkStatus()
  }, [searchParams])

  function signInWithGithub() {
    const backendUrl = import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:3001'
    window.location.href = `${backendUrl}/auth/github`
  }

  async function connectWallet() {
    setError(null)
    try {
      const eth = (window as any).ethereum
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

      if (!eth) {
        // Universal Deep Link format for official MetaMask Mobile App
        const cleanUrl = window.location.href.replace(/^https?:\/\//, '')
        const deepLink = `https://metamask.app.link/dapp/${cleanUrl}`

        if (isMobile) {
          // On mobile, directly launch official MetaMask App & connection request
          window.location.href = deepLink
          return
        } else {
          // On desktop, open official MetaMask extension download portal in new tab
          window.open('https://metamask.io/download/', '_blank')
          setError('MetaMask extension not detected. Click below to install or open in official MetaMask App.')
          return
        }
      }

      // Injected Web3 provider present — trigger official connection prompt popup
      const accounts: string[] = await eth.request({ method: 'eth_requestAccounts' })
      if (accounts && accounts.length > 0) {
        setWallet(accounts[0])
      }
    } catch (e: any) {
      if (e.code === 4001) {
        setError('Wallet connection request was declined in MetaMask.')
      } else {
        setError(e.message ?? 'Wallet connection request failed.')
      }
    }
  }

  async function signAndLink() {
    if (!wallet || !githubUser) return
    setLinking(true)
    setError(null)

    try {
      const eth = (window as any).ethereum
      if (!eth) {
        setError('Web3 provider disconnected. Please reconnect your wallet.')
        return
      }
      const message = `Linking GitHub ${githubUser} to ${wallet} for SoulPR`
      const signature: string = await eth.request({
        method: 'personal_sign',
        params: [message, wallet],
      })

      await api.linkWallet(wallet, signature)
      setLinked(true)
    } catch (e: any) {
      if (e.code === 4001) {
        setError('Signature request was declined in MetaMask.')
      } else {
        setError(e.message ?? 'Signing failed')
      }
    } finally {
      setLinking(false)
    }
  }

  const step1: StepState = githubUser ? 'done' : 'active'
  const step2: StepState = !githubUser ? 'pending' : wallet ? 'done' : 'active'
  const step3: StepState = !wallet ? 'pending' : linked ? 'done' : 'active'

  // Success view
  if (linked) {
    return (
      <main style={{ minHeight: 'calc(100vh - 90px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,123,0,0.25)',
          borderRadius: '20px', padding: '3rem 2.5rem',
          maxWidth: '480px', width: '100%', textAlign: 'center',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
        }}>
          <div style={{
            width: '72px', height: '72px', borderRadius: '50%',
            background: 'rgba(22,163,74,0.12)', border: '2px solid rgba(22,163,74,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.4rem',
          }}>
            <IconShieldCheck size={36} color="#16A34A" />
          </div>

          <h2 style={{ fontSize: '24px', fontWeight: 900, color: 'var(--ink)', marginBottom: '8px' }}>
            Wallet Linked Successfully!
          </h2>

          <p style={{ fontSize: '13px', color: 'var(--ink-muted)', lineHeight: '1.65', marginBottom: '2rem' }}>
            Future merged pull requests on tracked repositories will automatically mint Soulbound Tokens to your connected address.
          </p>

          <button
            onClick={() => navigate('/dashboard')}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              background: 'linear-gradient(135deg, #FF7B00 0%, #E05300 100%)',
              color: '#FFF', border: 'none', borderRadius: '10px',
              padding: '12px 0', fontSize: '14px', fontWeight: 800, cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(255,123,0,0.25)', transition: 'transform 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-1px)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            Go to Dashboard <IconArrowRight size={15} color="#FFF" />
          </button>
        </div>
      </main>
    )
  }

  return (
    <main style={{ minHeight: 'calc(100vh - 90px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem' }}>
      <div style={{ maxWidth: '520px', width: '100%' }}>

        {/* Card Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.2rem' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            fontSize: '10px', fontWeight: 800, color: '#FF7B00',
            background: 'rgba(255,123,0,0.08)', border: '1px solid rgba(255,123,0,0.2)',
            borderRadius: '99px', padding: '4px 14px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem',
          }}>
            <IconZap size={11} color="#FF7B00" /> ONE-TIME SETUP
          </span>
          <h1 style={{ fontSize: '32px', fontWeight: 900, color: 'var(--ink)', marginBottom: '8px' }}>
            Link Your Wallet
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--ink-muted)', lineHeight: '1.6' }}>
            Connect your GitHub and wallet once. Future PR merges mint automatically to your address.
          </p>
        </div>

        {/* Card Body */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(78,66,56,0.25)',
          borderRadius: '20px', padding: '2rem 2.2rem',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
        }}>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>

            {/* Step 1: GitHub */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <StepBadge step={1} state={step1} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: '14px', color: 'var(--ink)', marginBottom: '4px' }}>
                  Sign in with GitHub
                </div>
                <div style={{ fontSize: '12px', color: 'var(--ink-muted)', lineHeight: '1.5', marginBottom: step1 === 'active' ? '12px' : '0' }}>
                  {githubUser ? `Connected as @${githubUser}` : 'Verify your GitHub contributor identity.'}
                </div>
                {step1 === 'active' && (
                  <button
                    onClick={signInWithGithub}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '8px',
                      background: '#1B1816', color: '#FFF', border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '8px', padding: '8px 16px', fontSize: '12px', fontWeight: 700,
                      cursor: 'pointer', transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#2D2825')}
                    onMouseLeave={e => (e.currentTarget.style.background = '#1B1816')}
                  >
                    <IconGitHub size={15} color="#FFF" />
                    Sign in with GitHub
                  </button>
                )}
              </div>
            </div>

            {/* Divider line */}
            <div style={{ height: '1px', background: 'rgba(78,66,56,0.15)', marginLeft: '42px' }} />

            {/* Step 2: Wallet */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', opacity: step2 === 'pending' ? 0.45 : 1 }}>
              <StepBadge step={2} state={step2} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: '14px', color: 'var(--ink)', marginBottom: '4px' }}>
                  Connect Web3 Wallet
                </div>
                <div style={{ fontSize: '12px', color: 'var(--ink-muted)', lineHeight: '1.5', marginBottom: step2 === 'active' ? '12px' : '0' }}>
                  {wallet ? `Connected: ${wallet.slice(0, 6)}...${wallet.slice(-4)}` : 'Select your EVM wallet for receiving SBTs.'}
                </div>
                {step2 === 'active' && (
                  <button
                    onClick={connectWallet}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '8px',
                      background: '#FF7B00', color: '#FFF', border: 'none',
                      borderRadius: '8px', padding: '8px 16px', fontSize: '12px', fontWeight: 700,
                      cursor: 'pointer', transition: 'opacity 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
                    onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                  >
                    <IconWallet size={15} color="#FFF" />
                    Connect Wallet
                  </button>
                )}
              </div>
            </div>

            {/* Divider line */}
            <div style={{ height: '1px', background: 'rgba(78,66,56,0.15)', marginLeft: '42px' }} />

            {/* Step 3: Sign */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', opacity: step3 === 'pending' ? 0.45 : 1 }}>
              <StepBadge step={3} state={step3} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: '14px', color: 'var(--ink)', marginBottom: '4px' }}>
                  Sign Confirmation Message
                </div>
                <div style={{ fontSize: '12px', color: 'var(--ink-muted)', lineHeight: '1.5', marginBottom: step3 === 'active' ? '12px' : '0' }}>
                  {linked ? 'Wallet linked ✓' : 'A free, off-chain signature proving address control.'}
                </div>
                {step3 === 'active' && (
                  <button
                    onClick={signAndLink}
                    disabled={linking}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '8px',
                      background: 'linear-gradient(135deg, #FF7B00 0%, #E05300 100%)',
                      color: '#FFF', border: 'none',
                      borderRadius: '8px', padding: '9px 18px', fontSize: '12px', fontWeight: 700,
                      cursor: linking ? 'wait' : 'pointer', boxShadow: '0 4px 14px rgba(255,123,0,0.22)',
                    }}
                  >
                    <IconShieldCheck size={15} color="#FFF" />
                    {linking ? 'Signing...' : 'Sign & Link Wallet'}
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* Error Message & Interactive Actions */}
          {error && (
            <div style={{
              marginTop: '1.5rem', padding: '12px 16px',
              background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
              borderRadius: '12px', fontSize: '12px', color: '#EF4444', fontWeight: 600,
              display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <IconLock size={14} color="#EF4444" />
                <span>{error}</span>
              </div>

              {error.toLowerCase().includes('metamask') && (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '2px' }}>
                  <a
                    href={`https://metamask.app.link/dapp/${window.location.href.replace(/^https?:\/\//, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      background: '#FF7B00', color: '#FFF', padding: '6px 14px',
                      borderRadius: '6px', fontSize: '11px', fontWeight: 700,
                      textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px',
                    }}
                  >
                    Open in MetaMask App
                  </a>
                  <a
                    href="https://metamask.io/download/"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      background: 'rgba(255,255,255,0.08)', color: 'var(--ink)', padding: '6px 14px',
                      borderRadius: '6px', fontSize: '11px', fontWeight: 700,
                      textDecoration: 'none', border: '1px solid var(--rule)',
                    }}
                  >
                    Install MetaMask Extension
                  </a>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </main>
  )
}

function StepBadge({ step, state }: { step: number; state: StepState }) {
  if (state === 'done') {
    return (
      <div style={{
        width: '28px', height: '28px', borderRadius: '50%',
        background: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, marginTop: '2px',
      }}>
        <IconCheck size={14} color="#FFF" strokeWidth={3} />
      </div>
    )
  }

  if (state === 'active') {
    return (
      <div style={{
        width: '28px', height: '28px', borderRadius: '50%',
        background: 'rgba(255,123,0,0.15)', border: '2px solid #FF7B00',
        color: '#FF7B00', fontWeight: 800, fontSize: '12px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, marginTop: '2px',
      }}>
        {step}
      </div>
    )
  }

  return (
    <div style={{
      width: '28px', height: '28px', borderRadius: '50%',
      background: 'rgba(78,66,56,0.1)', border: '1px solid rgba(78,66,56,0.2)',
      color: 'var(--ink-faint)', fontWeight: 700, fontSize: '12px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0, marginTop: '2px',
    }}>
      {step}
    </div>
  )
}
