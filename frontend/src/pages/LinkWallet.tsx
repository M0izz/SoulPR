import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../lib/api'

type StepState = 'done' | 'active' | 'pending'

interface Step {
  title: string
  desc: string
  state: StepState
  action?: React.ReactNode
}

export default function LinkWallet() {
  const [searchParams] = useSearchParams()
  const [githubUser, setGithubUser] = useState<string | null>(null)
  const [wallet, setWallet] = useState<string | null>(null)
  const [linking, setLinking] = useState(false)
  const [linked, setLinked] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 1. On mount: check query params from redirect, then check session status
  useEffect(() => {
    const checkStatus = async () => {
      // Prioritize query param from OAuth redirect
      const urlUser = searchParams.get('githubUsername')
      if (urlUser) {
        setGithubUser(urlUser)
      }

      const urlError = searchParams.get('error')
      if (urlError) {
        setError(urlError)
      }

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
        console.warn('[LinkWallet] Failed to load login session status:', err.message)
      }
    }
    checkStatus()
  }, [searchParams])

  // Step 1 — GitHub OAuth (redirects to backend /auth/github)
  function signInWithGithub() {
    const backendUrl = import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:3001'
    window.location.href = `${backendUrl}/auth/github`
  }

  // Step 2 — Connect MetaMask wallet
  async function connectWallet() {
    setError(null)
    try {
      const eth = (window as any).ethereum
      if (!eth) {
        setError('MetaMask is not installed. Please install it at metamask.io.')
        return
      }
      const accounts: string[] = await eth.request({ method: 'eth_requestAccounts' })
      setWallet(accounts[0])
    } catch (e: any) {
      setError(e.message ?? 'Wallet connection rejected')
    }
  }

  // Step 3 — Sign message + POST to /wallet/link
  async function signAndLink() {
    if (!wallet || !githubUser) return
    setLinking(true)
    setError(null)

    try {
      const eth = (window as any).ethereum
      const message = `Linking GitHub ${githubUser} to ${wallet} for SoulPR`
      const signature: string = await eth.request({
        method: 'personal_sign',
        params: [message, wallet],
      })

      await api.linkWallet(wallet, signature)
      setLinked(true)
    } catch (e: any) {
      setError(e.message ?? 'Signing failed')
    } finally {
      setLinking(false)
    }
  }

  // Determine step states
  const step1: StepState = githubUser ? 'done' : 'active'
  const step2: StepState = !githubUser ? 'pending' : wallet ? 'done' : 'active'
  const step3: StepState = !wallet ? 'pending' : linked ? 'done' : 'active'

  const steps: Step[] = [
    {
      title: 'Sign in with GitHub',
      desc: githubUser ? `Connected as ${githubUser}` : 'We need to verify your GitHub identity.',
      state: step1,
      action: !githubUser ? (
        <button id="github-signin-btn" className="btn btn-ghost btn-sm" onClick={signInWithGithub}>
          Sign in with GitHub
        </button>
      ) : undefined,
    },
    {
      title: 'Connect wallet',
      desc: wallet ? `Connected: ${wallet.slice(0, 6)}...${wallet.slice(-4)}` : 'No wallet connected yet',
      state: step2,
      action: step2 === 'active' ? (
        <button id="connect-wallet-btn" className="btn btn-ghost btn-sm" onClick={connectWallet}>
          Connect wallet
        </button>
      ) : undefined,
    },
    {
      title: 'Sign to confirm ownership',
      desc: linked ? 'Wallet linked ✓' : 'A free signature, no gas required',
      state: step3,
      action: step3 === 'active' ? (
        <button id="sign-link-btn" className="btn btn-accent btn-sm" onClick={signAndLink} disabled={linking}>
          {linking ? <><span className="spinner" /> Signing…</> : 'Sign & link'}
        </button>
      ) : undefined,
    },
  ]

  if (linked) {
    return (
      <div className="link-wallet-page">
        <div className="link-wallet-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
          <div className="link-wallet-title">Wallet linked!</div>
          <div className="link-wallet-sub" style={{ marginBottom: 24 }}>
            Future merged PRs on tracked repos will mint automatically to your wallet.
          </div>
          <a href="/dashboard">
            <button className="btn btn-accent btn-full">View your badges</button>
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="link-wallet-page">
      <div className="link-wallet-card">
        <div className="link-wallet-header">
          <div className="link-wallet-title">Link your wallet</div>
          <div className="link-wallet-sub">One-time setup. Future merges mint automatically.</div>
        </div>

        <div className="steps">
          {steps.map((step, i) => (
            <div key={step.title} className="step">
              {/* Step indicator circle */}
              <div className={`step-indicator step-${step.state}`}>
                {step.state === 'done' ? '✓' : i + 1}
              </div>

              {/* Step content */}
              <div className="step-body">
                <div className="step-title" style={{ color: step.state === 'pending' ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                  {step.title}
                </div>
                <div className="step-desc">{step.desc}</div>
                {step.action}
              </div>
            </div>
          ))}
        </div>

        {error && (
          <div style={{ marginTop: 16, padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-md)', fontSize: 13, color: '#f87171' }}>
            {error}
          </div>
        )}
      </div>
    </div>
  )
}
