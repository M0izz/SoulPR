import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SignetBrandLockup from '../components/brand/SignetBrandLockup'
import HolographicCredential3D from '../components/credential/HolographicCredential3D'
import api from '../lib/api'

export default function Auth() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [activeUser, setActiveUser] = useState<string | null>(null)
  const [infoMessage, setInfoMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showForgotModal, setShowForgotModal] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')

  // Check if session already exists
  useEffect(() => {
    async function checkExistingSession() {
      try {
        const status = await api.getWalletStatus()
        if (status.authenticated && status.githubUsername) {
          setActiveUser(status.githubUsername)
        }
      } catch (err) {
        console.warn('[Auth] Session check fallback:', err)
      }
    }
    checkExistingSession()
  }, [])

  // Primary Live GitHub OAuth Action
  const handleGitHubAuth = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:3001'
    window.location.href = `${backendUrl}/auth/github`
  }

  // Staged Email / Password submission with honest product truth feedback
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setInfoMessage(null)

    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.')
      return
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.')
      return
    }

    if (mode === 'signup' && password !== confirmPassword) {
      setErrorMessage('Passwords do not match.')
      return
    }

    // Honest feedback: backend does not have email/password API implemented yet
    setInfoMessage(
      'Email and password account access is currently in private protocol invite preview. Please use "Continue with GitHub" for immediate live contributor authentication.'
    )
  }

  // Staged Google OAuth action
  const handleGoogleAuth = () => {
    setErrorMessage(null)
    setInfoMessage(
      'Google authentication provider is scheduled for protocol v1.1. Please authenticate with GitHub.'
    )
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: '1.05fr 0.95fr',
        backgroundColor: '#10100F',
        fontFamily: 'var(--font-sans)',
      }}
      className="auth-split-layout"
    >
      {/* ── LEFT PANEL: Warm Cream Form Panel (#F3E8D5) ── */}
      <section
        style={{
          backgroundColor: '#F3E8D5',
          color: '#191715',
          padding: '3.5rem 3.5rem 3rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflowY: 'auto',
        }}
        aria-labelledby="auth-heading"
      >
        <div>
          {/* Top Brand Lockup and Navigation Back */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '3rem',
            }}
          >
            <SignetBrandLockup
              color="#191715"
              markColor="#B9572B"
              markSize={28}
              wordmarkSize={18}
            />

            <Link
              to="/"
              style={{
                fontSize: '12.5px',
                fontWeight: 600,
                color: 'var(--signet-muted)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              ← Back to overview
            </Link>
          </div>

          {/* Active Session Notice if already authenticated */}
          {activeUser && (
            <div
              style={{
                backgroundColor: 'rgba(42, 125, 79, 0.1)',
                border: '1px solid rgba(42, 125, 79, 0.3)',
                borderRadius: '8px',
                padding: '12px 16px',
                marginBottom: '1.8rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ fontSize: '13px', color: '#191715' }}>
                Signed in as <strong style={{ color: '#2A7D4F' }}>@{activeUser}</strong>
              </div>
              <button
                onClick={() => navigate('/dashboard')}
                style={{
                  backgroundColor: '#2A7D4F',
                  color: '#FFF',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Go to Dashboard →
              </button>
            </div>
          )}

          {/* Header & Mode Switcher */}
          <div style={{ marginBottom: '2rem', textAlign: 'left' }}>
            <h1
              id="auth-heading"
              className="signet-headline"
              style={{
                fontSize: '34px',
                fontWeight: 600,
                color: '#191715',
                marginBottom: '8px',
              }}
            >
              {mode === 'signin' ? 'Sign in to SIGNET' : 'Create your SIGNET mark'}
            </h1>
            <p style={{ fontSize: '14.5px', color: 'var(--signet-muted)', lineHeight: 1.5 }}>
              Connect your contributor identity or inspect your verifiable records.
            </p>

            {/* Toggle Pills */}
            <div
              style={{
                display: 'inline-flex',
                backgroundColor: 'rgba(25, 23, 21, 0.06)',
                borderRadius: '8px',
                padding: '3px',
                marginTop: '1.2rem',
                border: '1px solid rgba(118, 103, 91, 0.18)',
              }}
              role="tablist"
              aria-label="Authentication mode"
            >
              <button
                role="tab"
                aria-selected={mode === 'signin'}
                onClick={() => {
                  setMode('signin')
                  setErrorMessage(null)
                  setInfoMessage(null)
                }}
                style={{
                  padding: '6px 16px',
                  fontSize: '12.5px',
                  fontWeight: mode === 'signin' ? 700 : 500,
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: mode === 'signin' ? '#191715' : 'transparent',
                  color: mode === 'signin' ? '#EDE2D0' : '#191715',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                Sign In
              </button>
              <button
                role="tab"
                aria-selected={mode === 'signup'}
                onClick={() => {
                  setMode('signup')
                  setErrorMessage(null)
                  setInfoMessage(null)
                }}
                style={{
                  padding: '6px 16px',
                  fontSize: '12.5px',
                  fontWeight: mode === 'signup' ? 700 : 500,
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: mode === 'signup' ? '#191715' : 'transparent',
                  color: mode === 'signup' ? '#EDE2D0' : '#191715',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                New Account
              </button>
            </div>
          </div>

          {/* ── Primary Authentication Provider: Continue with GitHub ── */}
          <div style={{ marginBottom: '1.8rem', textAlign: 'left' }}>
            <button
              onClick={handleGitHubAuth}
              style={{
                width: '100%',
                backgroundColor: '#191715',
                color: '#EDE2D0',
                border: '1px solid #191715',
                borderRadius: '8px',
                padding: '12px 18px',
                fontWeight: 700,
                fontSize: '14.5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
                transition: 'background-color 0.15s, transform 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#2A2624'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#191715'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Continue with GitHub
            </button>

            {/* Scope transparency note (PRD Section 6.2) */}
            <div
              style={{
                fontSize: '11px',
                color: 'var(--signet-muted)',
                lineHeight: 1.5,
                marginTop: '8px',
                textAlign: 'center',
              }}
            >
              Identity authorization only (<code style={{ fontFamily: 'var(--font-mono)' }}>read:user</code>).
              Repository contribution scopes are authorized separately.
            </div>
          </div>

          {/* Social Provider 2: Google (Staged) */}
          <div style={{ marginBottom: '1.8rem' }}>
            <button
              onClick={handleGoogleAuth}
              style={{
                width: '100%',
                backgroundColor: 'rgba(25, 23, 21, 0.04)',
                color: '#191715',
                border: '1px solid rgba(118, 103, 91, 0.25)',
                borderRadius: '8px',
                padding: '10px 18px',
                fontWeight: 600,
                fontSize: '13.5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                transition: 'background-color 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(25, 23, 21, 0.08)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(25, 23, 21, 0.04)')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              Continue with Google (Preview)
            </button>
          </div>

          {/* Divider */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              margin: '1.8rem 0',
              color: 'var(--signet-muted)',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(118, 103, 91, 0.2)' }} />
            <span>Or with email</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(118, 103, 91, 0.2)' }} />
          </div>

          {/* Feedback messages */}
          {errorMessage && (
            <div
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                padding: '10px 14px',
                fontSize: '12px',
                color: '#B91C1C',
                marginBottom: '1rem',
                textAlign: 'left',
              }}
              role="alert"
            >
              {errorMessage}
            </div>
          )}

          {infoMessage && (
            <div
              style={{
                backgroundColor: 'rgba(185, 87, 43, 0.08)',
                border: '1px solid rgba(185, 87, 43, 0.3)',
                borderRadius: '8px',
                padding: '12px 14px',
                fontSize: '12.5px',
                color: '#B9572B',
                marginBottom: '1rem',
                textAlign: 'left',
                lineHeight: 1.5,
              }}
              role="status"
            >
              <strong>Notice:</strong> {infoMessage}
            </div>
          )}

          {/* ── Email & Password Form ── */}
          <form onSubmit={handleEmailSubmit} style={{ textAlign: 'left' }}>
            <div style={{ marginBottom: '1.2rem' }}>
              <label
                htmlFor="auth-email"
                style={{
                  display: 'block',
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--signet-muted)',
                  marginBottom: '6px',
                }}
              >
                Email Address
              </label>
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="contributor@domain.com"
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '8px',
                  border: '1px solid rgba(118, 103, 91, 0.3)',
                  backgroundColor: '#FFF',
                  color: '#191715',
                  fontSize: '13.5px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: mode === 'signup' ? '1.2rem' : '1.4rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label
                  htmlFor="auth-password"
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: 'var(--signet-muted)',
                  }}
                >
                  Password
                </label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '11.5px',
                      color: '#B9572B',
                      cursor: 'pointer',
                      padding: 0,
                      fontWeight: 600,
                    }}
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Minimum 8 characters"
                  style={{
                    width: '100%',
                    padding: '11px 40px 11px 14px',
                    borderRadius: '8px',
                    border: '1px solid rgba(118, 103, 91, 0.3)',
                    backgroundColor: '#FFF',
                    color: '#191715',
                    fontSize: '13.5px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--signet-muted)',
                    cursor: 'pointer',
                    fontSize: '11px',
                    fontWeight: 700,
                  }}
                >
                  {showPassword ? 'HIDE' : 'SHOW'}
                </button>
              </div>
            </div>

            {mode === 'signup' && (
              <div style={{ marginBottom: '1.4rem' }}>
                <label
                  htmlFor="auth-confirm-password"
                  style={{
                    display: 'block',
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: 'var(--signet-muted)',
                    marginBottom: '6px',
                  }}
                >
                  Confirm Password
                </label>
                <input
                  id="auth-confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Re-enter password"
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '8px',
                    border: '1px solid rgba(118, 103, 91, 0.3)',
                    backgroundColor: '#FFF',
                    color: '#191715',
                    fontSize: '13.5px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            )}

            <button
              type="submit"
              style={{
                width: '100%',
                backgroundColor: 'var(--signet-orange)',
                color: '#EDE2D0',
                fontWeight: 700,
                fontSize: '14.5px',
                padding: '12px 0',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                letterSpacing: '0.02em',
                boxShadow: '0 4px 14px rgba(185, 87, 43, 0.28)',
                transition: 'opacity 0.15s',
              }}
            >
              {mode === 'signin' ? 'Sign in with Email' : 'Create SIGNET Account'}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <div
          style={{
            marginTop: '3rem',
            paddingTop: '1.2rem',
            borderTop: '1px solid rgba(118, 103, 91, 0.18)',
            fontSize: '11.5px',
            color: 'var(--signet-muted)',
            textAlign: 'center',
          }}
        >
          By proceeding, you agree to the SIGNET protocol terms and contributor attribution standards.
        </div>
      </section>

      {/* ── RIGHT STAGE: Charcoal Exhibition Stage (#10100F / #191715) ── */}
      <section
        style={{
          backgroundColor: '#10100F',
          color: '#EDE2D0',
          padding: '4rem 3rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
        aria-label="Credential Exhibition Stage"
      >
        {/* Ambient lighting glow */}
        <div
          style={{
            position: 'absolute',
            width: '450px',
            height: '450px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(185, 87, 43, 0.16) 0%, transparent 70%)',
            filter: 'blur(40px)',
            pointerEvents: 'none',
          }}
          aria-hidden="true"
        />

        {/* Stage Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem', position: 'relative', zIndex: 1 }}>
          <span
            style={{
              fontSize: '10px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: '#B9572B',
              backgroundColor: 'rgba(185, 87, 43, 0.1)',
              padding: '4px 10px',
              borderRadius: '99px',
              border: '1px solid rgba(185, 87, 43, 0.25)',
              display: 'inline-block',
              marginBottom: '10px',
            }}
          >
            Exhibition Display
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '26px',
              fontWeight: 600,
              color: '#EDE2D0',
              margin: '0 0 6px',
            }}
          >
            The Payoff of Your Work
          </h2>
          <p
            style={{
              fontSize: '13.5px',
              color: 'var(--signet-muted)',
              maxWidth: '380px',
              margin: '0 auto',
              lineHeight: 1.5,
            }}
          >
            Every merged pull request can be audited and minted into an inspectable cryptographic credential.
          </p>
        </div>

        {/* Floating Exhibition Card */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            cursor: 'pointer',
            transition: 'transform 0.3s ease',
          }}
          onClick={() => navigate('/verify/sample')}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && navigate('/verify/sample')}
          aria-label="Inspect illustrative sample credential"
        >
          <HolographicCredential3D
            autoRotate={true}
            showPedestal={true}
            data={{
              credentialId: 'SIG-2025-0426-001',
              contributor: 'm0izz.testnet',
              repository: 'm0izz/signet',
              contributionTitle: 'Add evidence dossier support',
              mergeDate: 'Apr 26, 2025 · 14:32 UTC',
              network: 'NEAR Blockchain',
              evidenceDigest: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
              isSample: true,
            }}
          />
        </div>

        {/* Interactive hint */}
        <div
          style={{
            marginTop: '2rem',
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--signet-muted)',
            position: 'relative',
            zIndex: 1,
          }}
        >
          Click card to inspect full verification evidence trail →
        </div>
      </section>

      {/* Forgot Password Modal (Accessible disclosure) */}
      {showForgotModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1.5rem',
          }}
          onClick={() => setShowForgotModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#F3E8D5',
              color: '#191715',
              borderRadius: '14px',
              padding: '2rem',
              maxWidth: '420px',
              width: '100%',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
              textAlign: 'left',
            }}
          >
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontWeight: 600, marginBottom: '8px' }}>
              Reset Password
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--signet-muted)', lineHeight: 1.6, marginBottom: '1.4rem' }}>
              Direct email account password reset is currently available through invitation admins.
              For instant authentication, please sign in with your GitHub account.
            </p>
            <input
              type="email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              placeholder="Enter your email address"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '6px',
                border: '1px solid rgba(118, 103, 91, 0.3)',
                marginBottom: '1rem',
                fontSize: '13px',
                boxSizing: 'border-box',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setShowForgotModal(false)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '6px',
                  border: '1px solid rgba(118, 103, 91, 0.3)',
                  background: 'none',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert('Password recovery notice recorded for protocol invite administrator.')
                  setShowForgotModal(false)
                }}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: 'var(--signet-orange)',
                  color: '#EDE2D0',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 700,
                }}
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 992px) {
          .auth-split-layout {
            grid-template-columns: 1fr !important;
          }
          .auth-split-layout > section:first-child {
            order: 1;
            padding: 2.5rem 1.5rem !important;
          }
          .auth-split-layout > section:last-child {
            order: 2;
            padding: 3rem 1.5rem !important;
          }
        }
      `}</style>
    </div>
  )
}
