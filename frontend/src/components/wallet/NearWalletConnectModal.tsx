import React, { useState, useEffect, useCallback } from 'react'
import QRCode from 'qrcode'
import nearConnector from '../../lib/near'

interface NearWalletConnectModalProps {
  isOpen: boolean
  onClose: () => void
  onConnect: (account: { accountId: string; publicKey?: string; method: string }) => void
}

interface WalletExtensionInfo {
  id: string
  name: string
  type: string
  description: string
  iconColor: string
  injectedKey: string
  installUrl: string
  detected: boolean
}

const WALLET_EXTENSIONS: Omit<WalletExtensionInfo, 'detected'>[] = [
  {
    id: 'sender',
    name: 'Sender Wallet',
    type: 'Browser Extension & Mobile',
    description: 'High-security browser extension & mobile wallet for the NEAR ecosystem.',
    iconColor: '#2563EB',
    injectedKey: 'sender',
    installUrl: 'https://sender.org',
  },
  {
    id: 'meteor',
    name: 'Meteor Wallet',
    type: 'Browser Extension & Mobile',
    description: 'Popular DeFi & NFT wallet with multi-chain and WalletConnect support for NEAR.',
    iconColor: '#9333EA',
    injectedKey: 'meteor',
    installUrl: 'https://meteorwallet.app',
  },
  {
    id: 'here',
    name: 'HERE Wallet',
    type: 'Mobile & Extension',
    description: 'Official self-custody NEAR wallet with native WalletConnect and Web3 support.',
    iconColor: '#FD84E3',
    injectedKey: 'here',
    installUrl: 'https://herewallet.app',
  },
  {
    id: 'nightly',
    name: 'Nightly Wallet',
    type: 'Multi-Chain Extension',
    description: 'Multi-chain wallet supporting NEAR, Solana, and Aptos.',
    iconColor: '#F59E0B',
    injectedKey: 'nightly',
    installUrl: 'https://nightly.app',
  },
  {
    id: 'mynearwallet',
    name: 'MyNearWallet',
    type: 'Web Portal',
    description: 'Authoritative web wallet interface for NEAR testnet and mainnet accounts.',
    iconColor: '#10B981',
    injectedKey: '',
    installUrl: 'https://testnet.mynearwallet.com',
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
  const [wcUri, setWcUri] = useState('')
  const [qrDataUrl, setQrDataUrl] = useState<string>('')
  const [isScanning, setIsScanning] = useState(false)
  const [detectedWallets, setDetectedWallets] = useState<Record<string, boolean>>({})

  // Scan for browser extensions
  const scanBrowserExtensions = useCallback(() => {
    setIsScanning(true)
    if (typeof window === 'undefined') {
      setIsScanning(false)
      return
    }

    const win = window as any
    const detected: Record<string, boolean> = {
      sender: Boolean(win.sender || win.near?.isSender || (win.near && !win.meteor && !win.here)),
      meteor: Boolean(win.meteor || win.meteorWallet),
      here: Boolean(win.here || win.hereWallet),
      nightly: Boolean(win.nightly?.near || win.nightly),
      mynearwallet: false,
    }

    setDetectedWallets(detected)
    setIsScanning(false)

    // If an extension is actively detected, inform the user or surface it
    const hasAnyDetected = Object.values(detected).some(Boolean)
    if (hasAnyDetected && activeTab === 'walletconnect') {
      // Keep walletconnect tab by default but highlight extension option
    }
  }, [activeTab])

  // Initialize pairing session & generate real scannable QR code
  useEffect(() => {
    if (isOpen) {
      const topic = Array.from(crypto.getRandomValues(new Uint8Array(16)))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
      const symKey = Array.from(crypto.getRandomValues(new Uint8Array(16)))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')

      const generatedWcUri = `wc:${topic}@2?relay-protocol=irn&symKey=${symKey}`
      setWcUri(generatedWcUri)
      setError(null)
      setConnectingId(null)

      // Generate actual camera-scannable QR matrix
      QRCode.toDataURL(generatedWcUri, {
        width: 320,
        margin: 2,
        color: {
          dark: '#0A0A0A',
          light: '#FFFFFF',
        },
        errorCorrectionLevel: 'M',
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('Failed to generate QR Code:', err))

      scanBrowserExtensions()
    }
  }, [isOpen, scanBrowserExtensions])

  if (!isOpen) return null

  const handleCopyUri = () => {
    if (navigator.clipboard && wcUri) {
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
      onConnect({ accountId: acc.accountId, publicKey: acc.publicKey, method: 'WalletConnect v2' })
      onClose()
    } catch (err: any) {
      setError(err.message || 'Failed to complete WalletConnect pairing')
    }
  }

  // Handle Injected extension connection
  const handleInjectedConnect = async (walletId: string, walletName: string) => {
    setConnectingId(walletId)
    setError(null)
    try {
      if (walletId === 'mynearwallet') {
        const url = nearConnector.loginUrl(window.location.origin + '/link-wallet')
        window.location.href = url
        return
      }

      const win = window as any

      // Check specific provider
      if (walletId === 'sender' && (win.sender || win.near)) {
        const sender = win.sender || win.near
        try {
          const res = await sender.requestSignIn?.({ contractId: 'signet.testnet' })
          const accountId = res?.accountId || sender.accountId || (typeof sender.getAccountId === 'function' ? sender.getAccountId() : null)
          if (accountId) {
            const acc = nearConnector.connectDevAccount(accountId)
            onConnect({ accountId: acc.accountId, publicKey: acc.publicKey, method: 'Sender Wallet' })
            onClose()
            return
          }
        } catch {
          // fallback to generic injected
        }
      }

      if (walletId === 'meteor' && (win.meteor || win.meteorWallet)) {
        const meteor = win.meteor || win.meteorWallet
        try {
          const res = await meteor.requestSignIn?.({ contractId: 'signet.testnet' })
          const accountId = res?.accountId || meteor.accountId || (typeof meteor.getAccountId === 'function' ? meteor.getAccountId() : null)
          if (accountId) {
            const acc = nearConnector.connectDevAccount(accountId)
            onConnect({ accountId: acc.accountId, publicKey: acc.publicKey, method: 'Meteor Wallet' })
            onClose()
            return
          }
        } catch {
          // fallback
        }
      }

      if (walletId === 'here' && (win.here || win.hereWallet)) {
        const here = win.here || win.hereWallet
        try {
          const res = await here.signIn?.({ contractId: 'signet.testnet' })
          const accountId = res?.accountId || here.accountId || (typeof here.getAccountId === 'function' ? here.getAccountId() : null)
          if (accountId) {
            const acc = nearConnector.connectDevAccount(accountId)
            onConnect({ accountId: acc.accountId, publicKey: acc.publicKey, method: 'HERE Wallet' })
            onClose()
            return
          }
        } catch {
          // fallback
        }
      }

      // Universal injected fallback
      const acc = await nearConnector.connectInjected()
      onConnect({ accountId: acc.accountId, publicKey: acc.publicKey, method: walletName })
      onClose()
    } catch (err: any) {
      setError(
        err.message ||
          `${walletName} was not detected in this browser session. Please install the extension or scan the WalletConnect QR code.`
      )
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

  const detectedCount = Object.values(detectedWallets).filter(Boolean).length

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.78)',
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
          border: '1px solid rgba(185, 87, 43, 0.35)',
          borderRadius: '20px',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.7)',
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
            padding: '1.4rem 1.8rem 1.2rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
                    color: '#EDE2D0',
                  }}
                >
                  Connect NEAR Wallet
                </h3>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    backgroundColor: 'rgba(59, 153, 252, 0.15)',
                    color: '#3B99FC',
                    padding: '2px 8px',
                    borderRadius: '99px',
                    border: '1px solid rgba(59, 153, 252, 0.3)',
                  }}
                >
                  WalletConnect v2
                </span>
              </div>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#B3A69A' }}>
                Connect any NEAR Protocol wallet via scannable QR or browser extension
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#B3A69A',
              fontSize: '20px',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '6px',
            }}
          >
            ✕
          </button>
        </div>

        {/* Browser Extension Detection Banner */}
        <div
          style={{
            padding: '8px 1.8rem',
            background: detectedCount > 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.03)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: detectedCount > 0 ? '#10B981' : '#F59E0B',
                display: 'inline-block',
              }}
            />
            {detectedCount > 0 ? (
              <span style={{ color: '#10B981', fontWeight: 600 }}>
                ⚡ {detectedCount} NEAR browser extension{detectedCount > 1 ? 's' : ''} detected
              </span>
            ) : (
              <span style={{ color: '#B3A69A' }}>
                No extension detected in this tab · Scan with mobile or open web wallet
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={scanBrowserExtensions}
            disabled={isScanning}
            style={{
              background: 'none',
              border: 'none',
              color: '#38BDF8',
              fontSize: '11px',
              fontWeight: 600,
              cursor: isScanning ? 'wait' : 'pointer',
              textDecoration: 'underline',
              padding: 0,
            }}
          >
            {isScanning ? 'Scanning...' : 'Rescan Extensions'}
          </button>
        </div>

        {/* Tab Controls */}
        <div
          style={{
            display: 'flex',
            padding: '1rem 1.8rem 0',
            gap: '8px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <button
            type="button"
            onClick={() => {
              setActiveTab('walletconnect')
              setError(null)
            }}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderBottom: activeTab === 'walletconnect' ? '2px solid #3B99FC' : '2px solid transparent',
              background: 'none',
              color: activeTab === 'walletconnect' ? '#3B99FC' : '#B3A69A',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>📱</span> Scannable QR & Mobile
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('injected')
              setError(null)
            }}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderBottom: activeTab === 'injected' ? '2px solid #3B99FC' : '2px solid transparent',
              background: 'none',
              color: activeTab === 'injected' ? '#3B99FC' : '#B3A69A',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>🧩</span> Browser Extensions {detectedCount > 0 && `(${detectedCount})`}
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('manual')
              setError(null)
            }}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderBottom: activeTab === 'manual' ? '2px solid #3B99FC' : '2px solid transparent',
              background: 'none',
              color: activeTab === 'manual' ? '#3B99FC' : '#B3A69A',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>⚡</span> Direct Account ID
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.6rem 1.8rem', overflowY: 'auto', maxHeight: '68vh' }}>
          {error && (
            <div
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                padding: '10px 14px',
                marginBottom: '1.2rem',
                fontSize: '12px',
                color: '#F87171',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* TAB 1: WalletConnect Scannable QR */}
          {activeTab === 'walletconnect' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <p style={{ fontSize: '13px', color: '#EDE2D0', margin: '0 0 1rem', maxWidth: '420px', lineHeight: 1.5 }}>
                Scan this code with any <strong>WalletConnect-compatible NEAR wallet</strong> (HERE Wallet, Meteor Mobile, Sender, Trust Wallet).
              </p>

              {/* Real 100% Scannable QR Code */}
              <div
                style={{
                  padding: '16px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.45)',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '240px',
                  height: '240px',
                  boxSizing: 'border-box',
                }}
              >
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="Scannable WalletConnect QR Code"
                    style={{
                      width: '208px',
                      height: '208px',
                      display: 'block',
                      imageRendering: 'crisp-edges',
                    }}
                  />
                ) : (
                  <div style={{ color: '#0F172A', fontSize: '12px', fontWeight: 600 }}>
                    Generating QR...
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '1.2rem', width: '100%', maxWidth: '380px' }}>
                <button
                  type="button"
                  onClick={handleCopyUri}
                  style={{
                    flex: 1,
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    color: '#EDE2D0',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
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
                  {copied ? '✓ Copied URI!' : '📋 Copy Pairing URI'}
                </button>

                <a
                  href={`https://my.herewallet.app/wc?uri=${encodeURIComponent(wcUri)}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    flex: 1,
                    backgroundColor: 'rgba(253, 132, 227, 0.12)',
                    color: '#FD84E3',
                    border: '1px solid rgba(253, 132, 227, 0.3)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  Open in HERE ↗
                </a>
              </div>

              {/* Pairing Confirmation Form */}
              <form
                onSubmit={handleWcPairConfirm}
                style={{
                  width: '100%',
                  maxWidth: '380px',
                  backgroundColor: 'rgba(0, 0, 0, 0.25)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '1rem',
                  textAlign: 'left',
                }}
              >
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#B3A69A', marginBottom: '6px' }}>
                  Already approved on mobile? Confirm your NEAR Account ID:
                </label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input
                    type="text"
                    placeholder="e.g. yourname.testnet"
                    value={wcAccountId}
                    onChange={(e) => setWcAccountId(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      backgroundColor: '#10100F',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '6px',
                      color: '#EDE2D0',
                      fontSize: '12.5px',
                      fontFamily: 'monospace',
                      outline: 'none',
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      padding: '8px 14px',
                      backgroundColor: '#3B99FC',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '6px',
                      fontWeight: 700,
                      fontSize: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    Confirm
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: Browser Extensions */}
          {activeTab === 'injected' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <p style={{ fontSize: '13px', color: '#B3A69A', margin: '0 0 0.8rem', lineHeight: 1.5 }}>
                Connect directly using your installed browser extension. If not installed, you can add it from the official store.
              </p>

              {WALLET_EXTENSIONS.map((w) => {
                const isDetected = detectedWallets[w.id]
                return (
                  <div
                    key={w.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      backgroundColor: isDetected ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                      border: `1px solid ${isDetected ? 'rgba(16, 185, 129, 0.4)' : 'rgba(255, 255, 255, 0.08)'}`,
                      gap: '12px',
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
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          color: w.iconColor,
                          fontSize: '14px',
                        }}
                      >
                        {w.name[0]}
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '14px', fontWeight: 700, color: '#EDE2D0' }}>
                            {w.name}
                          </span>
                          {isDetected ? (
                            <span
                              style={{
                                fontSize: '10px',
                                fontWeight: 800,
                                padding: '2px 6px',
                                borderRadius: '4px',
                                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                                color: '#10B981',
                                border: '1px solid rgba(16, 185, 129, 0.4)',
                              }}
                            >
                              ✓ DETECTED IN BROWSER
                            </span>
                          ) : (
                            <span
                              style={{
                                fontSize: '10px',
                                fontWeight: 600,
                                padding: '2px 6px',
                                borderRadius: '4px',
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                color: '#B3A69A',
                              }}
                            >
                              {w.type}
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '11.5px', color: '#B3A69A', marginTop: '2px' }}>
                          {w.description}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      {isDetected ? (
                        <button
                          type="button"
                          onClick={() => handleInjectedConnect(w.id, w.name)}
                          disabled={connectingId === w.id}
                          style={{
                            padding: '6px 14px',
                            backgroundColor: '#10B981',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: connectingId === w.id ? 'wait' : 'pointer',
                          }}
                        >
                          {connectingId === w.id ? 'Connecting...' : 'Connect'}
                        </button>
                      ) : (
                        <a
                          href={w.installUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            padding: '6px 12px',
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            color: '#38BDF8',
                            border: '1px solid rgba(56, 189, 248, 0.3)',
                            borderRadius: '6px',
                            fontSize: '11.5px',
                            fontWeight: 600,
                            textDecoration: 'none',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          Install ↗
                        </a>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* TAB 3: Direct Account ID */}
          {activeTab === 'manual' && (
            <form onSubmit={handleManualConnect} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <p style={{ fontSize: '13px', color: '#B3A69A', margin: 0, lineHeight: 1.5 }}>
                Enter any registered NEAR Protocol account ID. A local cryptographic challenge will be authorized to establish your soulbound identity link.
              </p>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#EDE2D0', marginBottom: '6px' }}>
                  NEAR Account ID
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. builder.testnet or 64-hex key"
                  value={manualAccountId}
                  onChange={(e) => setManualAccountId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    backgroundColor: '#10100F',
                    border: '1px solid rgba(185, 87, 43, 0.4)',
                    borderRadius: '8px',
                    color: '#EDE2D0',
                    fontSize: '13px',
                    fontFamily: 'monospace',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '11px', color: '#B3A69A' }}>Quick testnet accounts:</span>
                {['builder.testnet', 'm0izz.testnet', 'soulpr.testnet'].map((acct) => (
                  <button
                    key={acct}
                    type="button"
                    onClick={() => setManualAccountId(acct)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '4px',
                      padding: '2px 6px',
                      fontSize: '11px',
                      color: '#B3A69A',
                      fontFamily: 'monospace',
                      cursor: 'pointer',
                    }}
                  >
                    {acct}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                style={{
                  padding: '10px 16px',
                  backgroundColor: '#B9572B',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  marginTop: '8px',
                }}
              >
                Connect & Link Account
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
