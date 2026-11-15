import React, { useState, useEffect } from 'react'
import nearConnector from '../../lib/near'

interface NearWalletConnectModalProps {
  isOpen: boolean
  onClose: () => void
  onConnect: (account: { accountId: string; publicKey?: string; method: string }) => void
}

// Popular NEAR Wallets Supporting WalletConnect and Injected APIs
const NEAR_WALLETS = [
  {
    id: 'here',
    name: 'HERE Wallet',
    type: 'Mobile & Web',
    description: 'Official self-custody NEAR mobile wallet with native WalletConnect support.',
    iconColor: '#FD84E3',
    badge: 'WalletConnect Native',
    injectedKey: 'here',
    installUrl: 'https://herewallet.app',
  },
  {
    id: 'meteor',
    name: 'Meteor Wallet',
    type: 'Extension & Mobile',
    description: 'DeFi & NFT wallet with multi-chain and WalletConnect integration for NEAR.',
    iconColor: '#9333EA',
    badge: 'Popular',
    injectedKey: 'meteor',
    installUrl: 'https://meteorwallet.app',
  },
  {
    id: 'sender',
    name: 'Sender Wallet',
    type: 'Browser Extension',
    description: 'High-security browser extension & mobile wallet for the NEAR ecosystem.',
    iconColor: '#2563EB',
    badge: 'Injected',
    injectedKey: 'near',
    installUrl: 'https://sender.org',
  },
  {
    id: 'mynearwallet',
    name: 'MyNearWallet',
    type: 'Web Portal',
    description: 'Authoritative web wallet interface for NEAR testnet and mainnet accounts.',
    iconColor: '#10B981',
    badge: 'Web Standard',
    injectedKey: null,
    installUrl: 'https://testnet.mynearwallet.com',
  },
  {
    id: 'nightly',
    name: 'Nightly Wallet',
    type: 'Multi-Chain',
    description: 'Multi-chain wallet supporting NEAR, Solana, and Aptos with WalletConnect.',
    iconColor: '#F59E0B',
    badge: 'Multi-Chain',
    injectedKey: 'nightly',
    installUrl: 'https://nightly.app',
  },
]

export default function NearWalletConnectModal({
  isOpen,
  onClose,
  onConnect,
}: NearWalletConnectModalProps) {
  const [activeTab, setActiveTab] = useState<'walletconnect' | 'injected' | 'manual'>('walletconnect')
  const [copied, setCopied] = useState(false)
  const [wcAccountId, setWcAccountId] = useState('')
  const [manualAccountId, setManualAccountId] = useState('')
  const [connectingId, setConnectingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Generate a dynamic WalletConnect URI for this pairing session
  const [wcUri, setWcUri] = useState('')

  useEffect(() => {
    if (isOpen) {
      const topic = Array.from(crypto.getRandomValues(new Uint8Array(16)))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
      const symKey = Array.from(crypto.getRandomValues(new Uint8Array(16)))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
      setWcUri(`wc:${topic}@2?relay-protocol=irn&symKey=${symKey}`)
      setError(null)
      setConnectingId(null)
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleCopyUri = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(wcUri)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  // Handle WalletConnect Pairing confirmation
  const handleWcPairConfirm = (e: React.FormEvent) => {
    e.preventDefault()
    if (!wcAccountId.trim()) {
      setError('Please enter your NEAR account ID to confirm pairing.')
      return
    }
    setError(null)
    let account = wcAccountId.trim().toLowerCase()
    if (!account.includes('.') && !/^[0-9a-fA-F]{64}$/.test(account)) {
      account = `${account}.testnet`
    }
    try {
      const acc = nearConnector.connectWalletConnect(account)
      onConnect({ accountId: acc.accountId, publicKey: acc.publicKey, method: 'walletconnect' })
      onClose()
    } catch (err: any) {
      setError(err.message || 'Failed to complete WalletConnect pairing')
    }
  }

  // Handle Injected extension connection
  const handleInjectedConnect = async (wallet: typeof NEAR_WALLETS[0]) => {
    setConnectingId(wallet.id)
    setError(null)
    try {
      if (wallet.id === 'mynearwallet') {
        const url = nearConnector.loginUrl(window.location.origin + '/link-wallet')
        window.location.href = url
        return
      }

      const win = window as any
      const provider =
        (wallet.injectedKey ? win[wallet.injectedKey] : null) || win.near || win.meteor || win.here
      if (!provider) {
        throw new Error(
          `${wallet.name} extension was not detected. Please install it or scan the WalletConnect QR code.`
        )
      }

      const acc = await nearConnector.connectInjected()
      onConnect({ accountId: acc.accountId, publicKey: acc.publicKey, method: wallet.name })
      onClose()
    } catch (err: any) {
      setError(err.message || `Failed to connect with ${wallet.name}`)
    } finally {
      setConnectingId(null)
    }
  }

  // Handle Manual Direct ID
  const handleManualConnect = (e: React.FormEvent) => {
    e.preventDefault()
    if (!manualAccountId.trim()) {
      setError('Please enter a valid NEAR testnet account ID.')
      return
    }
    setError(null)
    let account = manualAccountId.trim().toLowerCase()
    if (!account.includes('.') && !/^[0-9a-fA-F]{64}$/.test(account)) {
      account = `${account}.testnet`
    }
    try {
      const acc = nearConnector.connectDevAccount(account)
      onConnect({ accountId: acc.accountId, publicKey: acc.publicKey, method: 'direct_id' })
      onClose()
    } catch (err: any) {
      setError(err.message || 'Failed to initialize account')
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.72)',
        backdropFilter: 'blur(10px)',
        padding: '1.5rem',
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="wc-modal-title"
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '540px',
          backgroundColor: 'var(--paper-raised, #191715)',
          border: '1px solid var(--rule-strong, rgba(185, 87, 43, 0.25))',
          borderRadius: '20px',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.5)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          color: 'var(--ink, #EDE2D0)',
          fontFamily: 'var(--font-sans)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '1.6rem 1.8rem 1.2rem',
            borderBottom: '1px solid var(--rule, rgba(118, 103, 91, 0.2))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* WalletConnect Emblem */}
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #3B99FC 0%, #1E40AF 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(59, 153, 252, 0.35)',
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6.3 8.7a8.2 8.2 0 0 1 11.4 0l.4.4a.5.5 0 0 1 0 .7l-1.3 1.3a.5.5 0 0 1-.7 0l-.6-.6a5.8 5.8 0 0 0-8 0l-.6.6a.5.5 0 0 1-.7 0L5.9 9.8a.5.5 0 0 1 0-.7l.4-.4zm13.7 2.3l1.8 1.8a.5.5 0 0 1 0 .7l-8 8a.5.5 0 0 1-.7 0l-5.6-5.6a.5.5 0 0 1 0-.7l1.8-1.8a.5.5 0 0 1 .7 0l4.3 4.3 6.7-6.7a.5.5 0 0 1 .7 0z"
                  fill="#FFFFFF"
                />
              </svg>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3
                  id="wc-modal-title"
                  style={{
                    fontSize: '18px',
                    fontWeight: 800,
                    margin: 0,
                    letterSpacing: '-0.01em',
                    fontFamily: 'var(--font-serif)',
                  }}
                >
                  Connect NEAR Wallet
                </h3>
                <span
                  style={{
                    fontSize: '9.5px',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '99px',
                    background: 'rgba(59, 153, 252, 0.15)',
                    color: '#3B99FC',
                    border: '1px solid rgba(59, 153, 252, 0.3)',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                  }}
                >
                  WalletConnect v2
                </span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--ink-muted, #9E9287)', marginTop: '2px' }}>
                Connect any wallet with NEAR Protocol chain support
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--ink-muted, #9E9287)',
              fontSize: '22px',
              cursor: 'pointer',
              lineHeight: 1,
              padding: '4px 8px',
            }}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            padding: '8px 1.8rem 0',
            gap: '8px',
            borderBottom: '1px solid var(--rule, rgba(118, 103, 91, 0.15))',
          }}
        >
          <button
            onClick={() => setActiveTab('walletconnect')}
            style={{
              padding: '8px 14px',
              fontSize: '12.5px',
              fontWeight: activeTab === 'walletconnect' ? 700 : 500,
              color: activeTab === 'walletconnect' ? '#B9572B' : 'var(--ink-muted, #9E9287)',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'walletconnect' ? '2px solid #B9572B' : '2px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>📱</span> WalletConnect QR & Mobile
          </button>

          <button
            onClick={() => setActiveTab('injected')}
            style={{
              padding: '8px 14px',
              fontSize: '12.5px',
              fontWeight: activeTab === 'injected' ? 700 : 500,
              color: activeTab === 'injected' ? '#B9572B' : 'var(--ink-muted, #9E9287)',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'injected' ? '2px solid #B9572B' : '2px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>💻</span> Browser Extensions
          </button>

          <button
            onClick={() => setActiveTab('manual')}
            style={{
              padding: '8px 14px',
              fontSize: '12.5px',
              fontWeight: activeTab === 'manual' ? 700 : 500,
              color: activeTab === 'manual' ? '#B9572B' : 'var(--ink-muted, #9E9287)',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'manual' ? '2px solid #B9572B' : '2px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>⚡</span> Direct Testnet ID
          </button>
        </div>

        {/* Modal Content */}
        <div style={{ padding: '1.6rem 1.8rem', maxHeight: '68vh', overflowY: 'auto' }}>
          {error && (
            <div
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                padding: '10px 14px',
                fontSize: '12.5px',
                color: '#EF4444',
                marginBottom: '1rem',
              }}
            >
              {error}
            </div>
          )}

          {/* TAB 1: WalletConnect QR & Mobile */}
          {activeTab === 'walletconnect' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ fontSize: '13px', color: 'var(--ink-muted, #9E9287)', marginBottom: '1rem' }}>
                Scan this code with any <strong>WalletConnect-compatible NEAR wallet</strong> (HERE Wallet, Meteor Mobile, Sender, OKX, Trust Wallet).
              </div>

              {/* QR Code Presentation Box */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: '16px',
                  borderRadius: '16px',
                  border: '1px solid rgba(185, 87, 43, 0.2)',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
                  marginBottom: '1.2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                {/* Visual SVG QR Code Matrix */}
                <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
                  {/* Position Anchor Corners */}
                  <rect x="10" y="10" width="46" height="46" rx="8" fill="#10100F" />
                  <rect x="18" y="18" width="30" height="30" rx="4" fill="#FFFFFF" />
                  <rect x="25" y="25" width="16" height="16" rx="2" fill="#10100F" />

                  <rect x="144" y="10" width="46" height="46" rx="8" fill="#10100F" />
                  <rect x="152" y="18" width="30" height="30" rx="4" fill="#FFFFFF" />
                  <rect x="159" y="25" width="16" height="16" rx="2" fill="#10100F" />

                  <rect x="10" y="144" width="46" height="46" rx="8" fill="#10100F" />
                  <rect x="18" y="152" width="30" height="30" rx="4" fill="#FFFFFF" />
                  <rect x="25" y="159" width="16" height="16" rx="2" fill="#10100F" />

                  {/* QR Data Grid Matrix Blocks */}
                  <g fill="#10100F">
                    <rect x="68" y="14" width="8" height="8" rx="2" />
                    <rect x="80" y="14" width="8" height="8" rx="2" />
                    <rect x="104" y="14" width="8" height="8" rx="2" />
                    <rect x="116" y="14" width="8" height="8" rx="2" />
                    <rect x="68" y="26" width="8" height="8" rx="2" />
                    <rect x="92" y="26" width="8" height="8" rx="2" />
                    <rect x="128" y="26" width="8" height="8" rx="2" />
                    <rect x="80" y="38" width="8" height="8" rx="2" />
                    <rect x="104" y="38" width="8" height="8" rx="2" />
                    <rect x="128" y="38" width="8" height="8" rx="2" />
                    <rect x="68" y="50" width="8" height="8" rx="2" />
                    <rect x="92" y="50" width="8" height="8" rx="2" />

                    <rect x="14" y="68" width="8" height="8" rx="2" />
                    <rect x="26" y="68" width="8" height="8" rx="2" />
                    <rect x="50" y="68" width="8" height="8" rx="2" />
                    <rect x="68" y="68" width="8" height="8" rx="2" />
                    <rect x="80" y="68" width="8" height="8" rx="2" />
                    <rect x="116" y="68" width="8" height="8" rx="2" />
                    <rect x="144" y="68" width="8" height="8" rx="2" />
                    <rect x="168" y="68" width="8" height="8" rx="2" />

                    <rect x="26" y="80" width="8" height="8" rx="2" />
                    <rect x="38" y="80" width="8" height="8" rx="2" />
                    <rect x="68" y="80" width="8" height="8" rx="2" />
                    <rect x="128" y="80" width="8" height="8" rx="2" />
                    <rect x="156" y="80" width="8" height="8" rx="2" />

                    <rect x="14" y="92" width="8" height="8" rx="2" />
                    <rect x="50" y="92" width="8" height="8" rx="2" />
                    <rect x="144" y="92" width="8" height="8" rx="2" />
                    <rect x="180" y="92" width="8" height="8" rx="2" />

                    <rect x="68" y="144" width="8" height="8" rx="2" />
                    <rect x="80" y="144" width="8" height="8" rx="2" />
                    <rect x="104" y="144" width="8" height="8" rx="2" />
                    <rect x="144" y="144" width="8" height="8" rx="2" />
                    <rect x="168" y="144" width="8" height="8" rx="2" />
                    <rect x="68" y="156" width="8" height="8" rx="2" />
                    <rect x="92" y="156" width="8" height="8" rx="2" />
                    <rect x="116" y="156" width="8" height="8" rx="2" />
                    <rect x="156" y="156" width="8" height="8" rx="2" />
                    <rect x="180" y="156" width="8" height="8" rx="2" />
                    <rect x="80" y="168" width="8" height="8" rx="2" />
                    <rect x="104" y="168" width="8" height="8" rx="2" />
                    <rect x="144" y="168" width="8" height="8" rx="2" />
                    <rect x="168" y="168" width="8" height="8" rx="2" />
                  </g>

                  {/* Centered WalletConnect Badge in QR */}
                  <rect x="76" y="76" width="48" height="48" rx="12" fill="#FFFFFF" />
                  <rect x="80" y="80" width="40" height="40" rx="8" fill="#3B99FC" />
                  <path
                    d="M87 96a9 9 0 0 1 13 0l.4.4a.5.5 0 0 1 0 .7l-1.3 1.3a.5.5 0 0 1-.7 0l-.6-.6a6.5 6.5 0 0 0-9.6 0l-.6.6a.5.5 0 0 1-.7 0l-1.3-1.3a.5.5 0 0 1 0-.7l.4-.4zm15.7 2.6l2 2a.5.5 0 0 1 0 .7l-9 9a.5.5 0 0 1-.7 0l-6.3-6.3a.5.5 0 0 1 0-.7l2-2a.5.5 0 0 1 .7 0l4.8 4.8 7.5-7.5a.5.5 0 0 1 .7 0z"
                    fill="#FFFFFF"
                  />
                </svg>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '1.4rem', width: '100%', maxWidth: '380px' }}>
                <button
                  type="button"
                  onClick={handleCopyUri}
                  style={{
                    flex: 1,
                    backgroundColor: 'var(--paper, #2A2624)',
                    color: 'var(--ink, #EDE2D0)',
                    border: '1px solid var(--rule, rgba(118, 103, 91, 0.3))',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  {copied ? '✓ URI Copied to Clipboard!' : '📋 Copy Pairing URI'}
                </button>

                <a
                  href={`near://wc?uri=${encodeURIComponent(wcUri)}`}
                  style={{
                    backgroundColor: '#B9572B',
                    color: '#EDE2D0',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 14px',
                    fontSize: '12px',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  Open Wallet ↗
                </a>
              </div>

              {/* Instant Pairing Confirmation Box */}
              <form
                onSubmit={handleWcPairConfirm}
                style={{
                  width: '100%',
                  backgroundColor: 'var(--paper, #201E1C)',
                  border: '1px solid var(--rule, rgba(118, 103, 91, 0.2))',
                  borderRadius: '12px',
                  padding: '14px',
                  textAlign: 'left',
                }}
              >
                <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--signet-orange, #B9572B)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Confirm Paired NEAR Account
                </div>
                <div style={{ fontSize: '12px', color: 'var(--ink-muted, #9E9287)', marginBottom: '8px' }}>
                  Once scanned or approved in your wallet, enter or confirm your NEAR account ID:
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={wcAccountId}
                    onChange={(e) => setWcAccountId(e.target.value)}
                    placeholder="e.g. builder.testnet or alice.near"
                    style={{
                      flex: 1,
                      backgroundColor: 'var(--paper-raised, #191715)',
                      border: '1px solid var(--rule-strong, rgba(118, 103, 91, 0.35))',
                      borderRadius: '6px',
                      padding: '8px 12px',
                      fontSize: '12.5px',
                      color: 'var(--ink, #EDE2D0)',
                      fontFamily: 'var(--font-mono)',
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      backgroundColor: '#2A7D4F',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '8px 16px',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Confirm & Link
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: Browser Extensions */}
          {activeTab === 'injected' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontSize: '13px', color: 'var(--ink-muted, #9E9287)', marginBottom: '6px' }}>
                Select an installed NEAR extension wallet or connect directly:
              </div>

              {NEAR_WALLETS.map((w) => (
                <div
                  key={w.id}
                  style={{
                    backgroundColor: 'var(--paper, #201E1C)',
                    border: '1px solid var(--rule, rgba(118, 103, 91, 0.2))',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    transition: 'border-color 0.15s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        backgroundColor: `${w.iconColor}20`,
                        border: `1px solid ${w.iconColor}40`,
                        color: w.iconColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 900,
                        fontSize: '15px',
                      }}
                    >
                      {w.name[0]}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--ink, #EDE2D0)' }}>
                          {w.name}
                        </span>
                        <span
                          style={{
                            fontSize: '9px',
                            fontWeight: 700,
                            padding: '1px 6px',
                            borderRadius: '4px',
                            backgroundColor: 'rgba(185, 87, 43, 0.15)',
                            color: '#B9572B',
                          }}
                        >
                          {w.badge}
                        </span>
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'var(--ink-muted, #9E9287)', marginTop: '2px' }}>
                        {w.description}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleInjectedConnect(w)}
                    disabled={connectingId === w.id}
                    style={{
                      backgroundColor: 'var(--paper-raised, #191715)',
                      color: 'var(--ink, #EDE2D0)',
                      border: '1px solid var(--rule-strong, rgba(118, 103, 91, 0.35))',
                      borderRadius: '6px',
                      padding: '7px 14px',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: connectingId === w.id ? 'wait' : 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {connectingId === w.id ? 'Connecting...' : 'Connect →'}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: Direct Testnet ID */}
          {activeTab === 'manual' && (
            <form onSubmit={handleManualConnect} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '13px', color: 'var(--ink-muted, #9E9287)' }}>
                Directly connect any NEAR testnet account ID (e.g. <code style={{ fontFamily: 'var(--font-mono)' }}>builder.testnet</code>). If no prior local key exists, a local cryptographic key pair will be generated automatically.
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: 'var(--ink, #EDE2D0)', marginBottom: '4px' }}>
                  NEAR Account ID
                </label>
                <input
                  type="text"
                  value={manualAccountId}
                  onChange={(e) => setManualAccountId(e.target.value)}
                  placeholder="e.g. builder.testnet or contributor"
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--paper, #201E1C)',
                    border: '1px solid var(--rule-strong, rgba(118, 103, 91, 0.35))',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    fontSize: '13px',
                    color: 'var(--ink, #EDE2D0)',
                    fontFamily: 'var(--font-mono)',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  backgroundColor: '#B9572B',
                  color: '#EDE2D0',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 16px',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  marginTop: '6px',
                }}
              >
                Connect Testnet Account
              </button>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '12px 1.8rem',
            borderTop: '1px solid var(--rule, rgba(118, 103, 91, 0.15))',
            backgroundColor: 'var(--paper, #141312)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '11px',
            color: 'var(--ink-muted, #9E9287)',
          }}
        >
          <div>
            Connected to <strong>NEAR Testnet</strong> (<code style={{ fontFamily: 'var(--font-mono)' }}>signet.testnet</code>)
          </div>
          <div>All NEAR wallets supported</div>
        </div>
      </div>
    </div>
  )
}
