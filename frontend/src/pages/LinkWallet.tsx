import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import nearConnector from '../lib/near'
import NearWalletConnectModal from '../components/wallet/NearWalletConnectModal'
import {
  IconCheck,
  IconLock,
  IconGitHub,
  IconWallet,
  IconShieldCheck,
  IconZap,
  IconExternalLink,
  IconArrowRight,
} from '../components/Icons'

type StepState = 'done' | 'active' | 'pending'

export default function LinkWallet() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [githubUser, setGithubUser] = useState<string | null>(null)
  const [wallet, setWallet] = useState<string | null>(null)
  const [nearPubKey, setNearPubKey] = useState<string | null>(null)
  const [linking, setLinking] = useState(false)
  const [checkingStatus, setCheckingStatus] = useState(true)
  const [linked, setLinked] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showDevInput, setShowDevInput] = useState(false)
  const [devAccountId, setDevAccountId] = useState('')
  const [showWcModal, setShowWcModal] = useState(false)

  // NEAR mode is default for SIGNET (NEAR-first), opt-out via VITE_NEAR_ENABLED=false
  const useNear = (import.meta.env.VITE_NEAR_ENABLED ?? 'true') !== 'false'

  useEffect(() => {
    const checkStatus = async () => {
      const urlUser = searchParams.get('githubUsername')
      if (urlUser) {
        setGithubUser(urlUser)
        localStorage.setItem('signet_github_user', urlUser)
      }

      const urlError = searchParams.get('error')
      if (urlError) setError(urlError)

      // Handle return from MyNearWallet login redirect
      const urlAccountId = searchParams.get('account_id')
      const urlPublicKey = searchParams.get('public_key')
      if (urlAccountId) {
        try {
          const acc = nearConnector.completeLogin(urlAccountId, urlPublicKey ?? undefined)
          setWallet(acc.accountId)
          setNearPubKey(acc.publicKey)
        } catch (e: any) {
          console.warn('[LinkWallet] Failed to complete NEAR redirect login:', e)
        }
      }

      try {
        const status = await api.getWalletStatus()
        if (status.authenticated) {
          setGithubUser(status.githubUsername ?? null)
          if (status.githubUsername) {
            localStorage.setItem('signet_github_user', status.githubUsername)
          }
          if (status.linked && status.walletAddress) {
            setWallet(status.walletAddress)
            setLinked(true)
          }
        }
      } catch (err: any) {
        console.warn('[LinkWallet] Session status check:', err.message)
        setError('Unable to check your current wallet link. You can continue with the setup below.')
      } finally {
        setCheckingStatus(false)
      }
    }
    checkStatus()
  }, [searchParams])

  function signInWithGithub() {
    const backendUrl = import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:3001'
    const origin = window.location.origin
    window.location.href = `${backendUrl}/auth/github?origin=${encodeURIComponent(origin)}&return_to=/link-wallet`
  }

  // NEAR Connection Methods
  async function connectMyNearWallet() {
    setError(null)
    try {
      const loginUrl = nearConnector.loginUrl(window.location.origin + '/link-wallet')
      window.location.href = loginUrl
    } catch (e: any) {
      setError(`Failed to build MyNearWallet login URL: ${e.message}`)
    }
  }

  async function connectInjectedNear() {
    setError(null)
    try {
      const acc = await nearConnector.connectInjected()
      setWallet(acc.accountId)
      setNearPubKey(acc.publicKey)
    } catch (e: any) {
      setError(
        e.message.includes('No injected NEAR')
          ? 'No injected NEAR extension (Sender/Meteor) detected. Please use MyNearWallet or enter a testnet account below.'
          : e.message
      )
    }
  }

  function handleDevAccountLink() {
    if (!devAccountId.trim()) return
    setError(null)
    try {
      let accId = devAccountId.trim().toLowerCase()
      if (!accId.includes('.')) {
        accId = `${accId}.testnet`
      }
      const acc = nearConnector.connectDevAccount(accId)
      setWallet(acc.accountId)
      setNearPubKey(acc.publicKey)
      setShowDevInput(false)
    } catch (e: any) {
      setError(`Failed to initialize account: ${e.message}`)
    }
  }

  // Fallback EVM Wallet Connection (if NEAR explicitly disabled)
  async function connectEvmWallet() {
    setError(null)
    try {
      const eth = (window as any).ethereum
      if (!eth) {
        setError('MetaMask or EVM browser extension not detected.')
        return
      }
      const accounts: string[] = await eth.request({ method: 'eth_requestAccounts' })
      if (accounts && accounts.length > 0) {
        setWallet(accounts[0])
      }
    } catch (e: any) {
      setError(e.message ?? 'Wallet connection request failed.')
    }
  }

  async function signAndLink() {
    if (!wallet || !githubUser) return
    setLinking(true)
    setError(null)

    try {
      if (useNear) {
        const challenge = await api.getWalletChallenge()
        const message = `SoulPR wallet link\nGitHub: ${githubUser}\nWallet: ${wallet}\nNonce: ${challenge.nonce}`
        const signature = await nearConnector.signMessage(message)
        await api.linkWallet(wallet, signature, nearPubKey ?? nearConnector.pubKey ?? undefined)
      } else {
        const challenge = await api.getWalletChallenge()
        const message = `SoulPR wallet link\nGitHub: ${githubUser}\nWallet: ${wallet}\nNonce: ${challenge.nonce}`
        const eth = (window as any).ethereum
        if (!eth) {
          setError('Web3 provider disconnected. Please reconnect your wallet.')
          return
        }
        const signature: string = await eth.request({
          method: 'personal_sign',
          params: [message, wallet],
        })
        await api.linkWallet(wallet, signature)
      }
      setLinked(true)
    } catch (e: any) {
      if (e.code === 4001) {
        setError('Signature request was declined in your wallet.')
      } else if (useNear) {
        setError(`NEAR signing failed: ${e.message ?? 'Check browser console.'}`)
      } else {
        setError(e.message ?? 'Signing failed')
      }
    } finally {
      setLinking(false)
    }
  }

  const step1: StepState = githubUser ? 'done' : 'active'
  const step2: StepState = linked || wallet ? 'done' : githubUser ? 'active' : 'pending'
  const step3: StepState = linked ? 'done' : wallet && githubUser ? 'active' : 'pending'

  if (linked && !checkingStatus) {
    return (
      <main
        className="wallet-page signet-enter-fade"
        style={{
          minHeight: 'calc(100vh - 90px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '3rem 1.5rem',
          background: 'var(--paper)',
        }}
      >
        <div
          className="signet-glass-card"
          style={{
            maxWidth: '520px',
            width: '100%',
            padding: '2.5rem',
            textAlign: 'center',
            border: '1px solid var(--rule-strong)',
            background: 'var(--paper-raised)',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(42, 125, 79, 0.12)',
              border: '1px solid rgba(42, 125, 79, 0.3)',
              color: '#2A7D4F',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.2rem',
            }}
          >
            <IconCheck size={28} color="#2A7D4F" strokeWidth={3} />
          </div>

          <h2
            className="signet-headline"
            style={{ fontSize: '28px', color: 'var(--ink)', marginBottom: '8px' }}
          >
            Account Successfully Linked
          </h2>

          <p style={{ fontSize: '14px', color: 'var(--ink-muted)', marginBottom: '1.8rem' }}>
            Your GitHub contributor identity <strong style={{ color: 'var(--ink)' }}>@{githubUser}</strong> is
            cryptographically linked to NEAR account{' '}
            <strong className="signet-mono" style={{ color: 'var(--signet-orange)' }}>
              {wallet}
            </strong>
            .
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-signet-primary"
              style={{ padding: '10px 22px' }}
            >
              Go to Workspace Dashboard <IconArrowRight size={14} color="#EDE2D0" />
            </button>
            <button
              onClick={() => {
                setLinked(false)
                setWallet(null)
              }}
              className="btn-signet-secondary"
              style={{ fontSize: '13px' }}
            >
              Relink / Change Account
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main
      className="wallet-page signet-enter-fade"
      style={{
        minHeight: 'calc(100vh - 90px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        background: 'var(--paper)',
      }}
    >
      <div style={{ maxWidth: '560px', width: '100%' }}>
        {/* Card Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '10px',
              fontWeight: 800,
              color: 'var(--signet-orange)',
              background: 'var(--signet-orange-subtle)',
              border: '1px solid var(--signet-orange-border)',
              borderRadius: '99px',
              padding: '4px 14px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '1rem',
            }}
          >
            <IconZap size={11} color="var(--signet-orange)" />
            ONE-TIME CRYPTOGRAPHIC SETUP
          </span>
          <h1
            className="signet-headline"
            style={{ fontSize: '34px', color: 'var(--ink)', marginBottom: '8px' }}
          >
            Link Your NEAR Account
          </h1>
          <p
            style={{
              fontSize: '14.5px',
              color: 'var(--ink-muted)',
              lineHeight: '1.6',
              maxWidth: '460px',
              margin: '0 auto',
            }}
          >
            Connect your GitHub and NEAR account once. All contribution dossiers and verifiable credentials
            will be minted to this identity.
          </p>
        </div>

        {/* Card Body */}
        <div
          className="signet-glass-card"
          style={{
            background: 'var(--paper-raised)',
            border: '1px solid var(--rule-strong)',
            borderRadius: '20px',
            padding: '2.2rem',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
            {checkingStatus && (
              <div
                role="status"
                aria-live="polite"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'var(--ink-muted)',
                  fontSize: '13px',
                }}
              >
                <span className="spinner" aria-hidden="true" style={{ width: '14px', height: '14px' }} />
                Checking your current link state...
              </div>
            )}

            {/* Step 1: GitHub */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <StepBadge step={1} state={step1} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--ink)', marginBottom: '4px' }}>
                  Sign in with GitHub
                </div>
                <div
                  style={{
                    fontSize: '13px',
                    color: 'var(--ink-muted)',
                    lineHeight: '1.5',
                    marginBottom: step1 === 'active' ? '12px' : '0',
                  }}
                >
                  {githubUser
                    ? `Connected as @${githubUser}`
                    : 'Authenticate your GitHub identity to associate merged pull requests.'}
                </div>
                {step1 === 'active' && (
                  <button
                    onClick={signInWithGithub}
                    className="btn-signet-primary"
                    style={{ fontSize: '13px', padding: '8px 16px' }}
                  >
                    <IconGitHub size={15} color="#EDE2D0" />
                    Sign in with GitHub
                  </button>
                )}
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: '1px', background: 'var(--rule)', marginLeft: '42px' }} />

            {/* Step 2: Wallet */}
            <div
              style={{
                display: 'flex',
                gap: '1rem',
                alignItems: 'flex-start',
                opacity: step2 === 'pending' ? 0.45 : 1,
              }}
            >
              <StepBadge step={2} state={step2} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--ink)', marginBottom: '4px' }}>
                  {useNear ? 'Connect NEAR Account' : 'Connect Web3 Wallet'}
                </div>
                <div
                  style={{
                    fontSize: '13px',
                    color: 'var(--ink-muted)',
                    lineHeight: '1.5',
                    marginBottom: step2 === 'active' ? '12px' : '0',
                  }}
                >
                  {wallet
                    ? `Connected: ${wallet}`
                    : useNear
                    ? 'Connect your NEAR testnet account (e.g. builder.testnet).'
                    : 'Connect your wallet for receiving attestations.'}
                </div>

                {step2 === 'active' && useNear && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                    {/* Primary Universal WalletConnect Action */}
                    <button
                      type="button"
                      onClick={() => setShowWcModal(true)}
                      className="btn-signet-primary"
                      style={{
                        width: '100%',
                        fontSize: '13px',
                        padding: '11px 18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 50%, #B9572B 100%)',
                        boxShadow: '0 4px 16px rgba(37, 99, 235, 0.25)',
                        border: 'none',
                        cursor: 'pointer',
                        borderRadius: '8px',
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M6.3 8.7a8.2 8.2 0 0 1 11.4 0l.4.4a.5.5 0 0 1 0 .7l-1.3 1.3a.5.5 0 0 1-.7 0l-.6-.6a5.8 5.8 0 0 0-8 0l-.6.6a.5.5 0 0 1-.7 0L5.9 9.8a.5.5 0 0 1 0-.7l.4-.4zm13.7 2.3l1.8 1.8a.5.5 0 0 1 0 .7l-8 8a.5.5 0 0 1-.7 0l-5.6-5.6a.5.5 0 0 1 0-.7l1.8-1.8a.5.5 0 0 1 .7 0l4.3 4.3 6.7-6.7a.5.5 0 0 1 .7 0z"
                          fill="#FFFFFF"
                        />
                      </svg>
                      Connect with WalletConnect (Any NEAR Wallet)
                    </button>

                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <button
                        onClick={connectMyNearWallet}
                        className="btn-signet-secondary"
                        style={{ fontSize: '12px', padding: '6px 12px' }}
                      >
                        <IconExternalLink size={12} color="currentColor" />
                        MyNearWallet Web
                      </button>
                      <button
                        onClick={connectInjectedNear}
                        className="btn-signet-secondary"
                        style={{ fontSize: '12px', padding: '6px 12px' }}
                      >
                        <IconWallet size={12} color="currentColor" />
                        Sender / Meteor
                      </button>
                      <button
                        onClick={() => setShowDevInput(!showDevInput)}
                        className="btn-signet-secondary"
                        style={{ fontSize: '12px', padding: '6px 12px' }}
                      >
                        Testnet Direct ID
                      </button>
                    </div>

                    {showDevInput && (
                      <div
                        className="signet-enter-fade"
                        style={{
                          marginTop: '6px',
                          padding: '12px',
                          background: 'var(--paper)',
                          border: '1px solid var(--rule)',
                          borderRadius: '10px',
                          display: 'flex',
                          gap: '8px',
                        }}
                      >
                        <input
                          type="text"
                          placeholder="e.g. builder.testnet"
                          value={devAccountId}
                          onChange={(e) => setDevAccountId(e.target.value)}
                          className="signet-mono"
                          style={{
                            flex: 1,
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: '1px solid var(--rule)',
                            background: 'var(--paper-raised)',
                            color: 'var(--ink)',
                            fontSize: '12.5px',
                            outline: 'none',
                          }}
                        />
                        <button
                          onClick={handleDevAccountLink}
                          className="btn-signet-primary"
                          style={{ fontSize: '12px', padding: '6px 14px' }}
                        >
                          Use ID
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {step2 === 'active' && !useNear && (
                  <button onClick={connectEvmWallet} className="btn-signet-primary" style={{ fontSize: '13px' }}>
                    <IconWallet size={15} color="#EDE2D0" /> Connect EVM Wallet
                  </button>
                )}
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: '1px', background: 'var(--rule)', marginLeft: '42px' }} />

            {/* Step 3: Sign */}
            <div
              style={{
                display: 'flex',
                gap: '1rem',
                alignItems: 'flex-start',
                opacity: step3 === 'pending' ? 0.45 : 1,
              }}
            >
              <StepBadge step={3} state={step3} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--ink)', marginBottom: '4px' }}>
                  Sign Cryptographic Handshake
                </div>
                <div
                  style={{
                    fontSize: '13px',
                    color: 'var(--ink-muted)',
                    lineHeight: '1.5',
                    marginBottom: step3 === 'active' ? '12px' : '0',
                  }}
                >
                  {linked ? 'Wallet linked ✓' : 'A free, off-chain ed25519 signature proving key ownership.'}
                </div>
                {step3 === 'active' && (
                  <button
                    onClick={signAndLink}
                    disabled={linking}
                    aria-busy={linking}
                    className="btn-signet-primary"
                    style={{ fontSize: '13px', padding: '9px 18px' }}
                  >
                    <IconShieldCheck size={15} color="#EDE2D0" />
                    {linking ? 'Signing Challenge...' : 'Sign & Link Account'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div
              className="status-message signet-enter-fade"
              role="alert"
              aria-live="assertive"
              style={{
                marginTop: '1.5rem',
                padding: '12px 16px',
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                borderRadius: '12px',
                fontSize: '12.5px',
                color: '#EF4444',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <IconLock size={15} color="#EF4444" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>

      {/* Universal NEAR WalletConnect Modal */}
      <NearWalletConnectModal
        isOpen={showWcModal}
        onClose={() => setShowWcModal(false)}
        onConnect={(acc) => {
          setWallet(acc.accountId)
          if (acc.publicKey) {
            setNearPubKey(acc.publicKey)
          }
        }}
      />
    </main>
  )
}

function StepBadge({ step, state }: { step: number; state: StepState }) {
  if (state === 'done') {
    return (
      <div
        style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          background: '#2A7D4F',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          marginTop: '2px',
        }}
      >
        <IconCheck size={14} color="#FFF" strokeWidth={3} />
      </div>
    )
  }

  if (state === 'active') {
    return (
      <div
        style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          background: 'var(--signet-orange-subtle)',
          border: '2px solid var(--signet-orange)',
          color: 'var(--signet-orange)',
          fontWeight: 800,
          fontSize: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          marginTop: '2px',
        }}
      >
        {step}
      </div>
    )
  }

  return (
    <div
      style={{
        width: '28px',
        height: '28px',
        borderRadius: '50%',
        background: 'var(--rule)',
        color: 'var(--ink-faint)',
        fontWeight: 700,
        fontSize: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        marginTop: '2px',
      }}
    >
      {step}
    </div>
  )
}
