import { Link } from 'react-router-dom'
import { useWorkspace } from '../../context/WorkspaceContext'
import {
  IconGitHub,
  IconWallet,
  IconShieldCheck,
  IconRefresh,
  IconArrowRight,
} from '../../components/Icons'

export default function SettingsPage() {
  const { userGithub, nearAccount, isAuthenticated, isLinked, syncState, triggerSync } = useWorkspace()

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1
          style={{
            fontSize: '26px',
            fontWeight: 700,
            margin: '0 0 6px 0',
            fontFamily: 'var(--font-serif)',
            color: 'var(--ink)',
          }}
        >
          Protocol & Workspace Settings
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--ink-muted)', margin: 0 }}>
          Manage your connected developer identity, NEAR Protocol account linkage, sync jobs, and privacy.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
        {/* ── 1. GITHUB CONNECTION ── */}
        <section
          style={{
            backgroundColor: 'var(--paper-raised)',
            border: '1px solid var(--rule)',
            borderRadius: '12px',
            padding: '1.6rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
            <IconGitHub size={18} color="#B9572B" />
            <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: 'var(--ink)' }}>
              GitHub Identity & Scopes
            </h2>
          </div>

          <div
            style={{
              padding: '12px 16px',
              backgroundColor: 'var(--paper)',
              borderRadius: '8px',
              border: '1px solid var(--rule)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
            }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: '13.5px', color: 'var(--ink)' }}>
                {isAuthenticated && userGithub ? `@${userGithub}` : 'Not connected'}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>
                Read-only profile & pull request inspection permissions
              </div>
            </div>

            {!isAuthenticated ? (
              <a
                href="/auth"
                style={{
                  padding: '7px 14px',
                  borderRadius: '6px',
                  backgroundColor: '#B9572B',
                  color: '#EDE2D0',
                  textDecoration: 'none',
                  fontSize: '12.5px',
                  fontWeight: 700,
                }}
              >
                Connect GitHub
              </a>
            ) : (
              <span style={{ fontSize: '12px', color: '#2E7D32', fontWeight: 700 }}>
                CONNECTED
              </span>
            )}
          </div>

          <p style={{ fontSize: '12px', color: 'var(--ink-faint)', margin: 0, lineHeight: 1.45 }}>
            SIGNET requests read-only access to verify PR author identities and merge commits. We never ask for
            write or administration permissions.
          </p>
        </section>

        {/* ── 2. NEAR WALLET LINK ── */}
        <section
          style={{
            backgroundColor: 'var(--paper-raised)',
            border: '1px solid var(--rule)',
            borderRadius: '12px',
            padding: '1.6rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
            <IconWallet size={18} color="#B9572B" />
            <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: 'var(--ink)' }}>
              NEAR Protocol Account Link
            </h2>
          </div>

          <div
            style={{
              padding: '12px 16px',
              backgroundColor: 'var(--paper)',
              borderRadius: '8px',
              border: '1px solid var(--rule)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
            }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: '13.5px', color: isLinked ? '#B9572B' : 'var(--ink)' }}>
                {isLinked && nearAccount ? nearAccount : 'No NEAR account linked'}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>
                Target network: <strong>NEAR Testnet</strong>
              </div>
            </div>

            <Link
              to="/link-wallet"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                borderRadius: '6px',
                border: '1px solid #B9572B',
                color: '#B9572B',
                textDecoration: 'none',
                fontSize: '12.5px',
                fontWeight: 700,
              }}
            >
              {isLinked ? 'Manage Wallet Link' : 'Link NEAR Account'} <IconArrowRight size={12} />
            </Link>
          </div>

          <p style={{ fontSize: '12px', color: 'var(--ink-faint)', margin: 0, lineHeight: 1.45 }}>
            Your NEAR account ID is the non-transferable recipient of minted credentials. Linking requires signing
            a single-use cryptographic nonce with your private key.
          </p>
        </section>

        {/* ── 3. SYNCHRONIZATION SETTINGS ── */}
        <section
          style={{
            backgroundColor: 'var(--paper-raised)',
            border: '1px solid var(--rule)',
            borderRadius: '12px',
            padding: '1.6rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
            <IconRefresh size={18} color="#B9572B" />
            <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: 'var(--ink)' }}>
              Synchronization & Rate Limits
            </h2>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>
                Last Successful Sync
              </div>
              <div style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>
                {syncState.lastSyncedAt ?? 'No sync completed yet'}
              </div>
            </div>

            <button
              onClick={triggerSync}
              disabled={syncState.isSyncing}
              style={{
                padding: '7px 14px',
                borderRadius: '6px',
                backgroundColor: 'var(--paper)',
                border: '1px solid var(--rule)',
                color: 'var(--ink)',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: syncState.isSyncing ? 'not-allowed' : 'pointer',
              }}
            >
              {syncState.isSyncing ? 'Syncing...' : 'Sync Now'}
            </button>
          </div>

          <p style={{ fontSize: '12px', color: 'var(--ink-faint)', margin: 0, lineHeight: 1.45 }}>
            Background sync jobs run idempotently with GitHub API rate-limit backoff.
          </p>
        </section>

        {/* ── 4. PRIVACY & DATA TRANSPARENCY ── */}
        <section
          style={{
            backgroundColor: 'var(--paper-raised)',
            border: '1px solid var(--rule)',
            borderRadius: '12px',
            padding: '1.6rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.8rem' }}>
            <IconShieldCheck size={18} color="#B9572B" />
            <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: 'var(--ink)' }}>
              Public Credential Disclosure Policy
            </h2>
          </div>

          <p style={{ fontSize: '12.5px', color: 'var(--ink-muted)', lineHeight: 1.5, margin: 0 }}>
            Public verification reveals only the fields committed to the credential: repository name, PR title & number,
            merge commit SHA, merge timestamp, contributor NEAR account, and the cryptographic evidence snapshot digest.
            Private repository code, comments, email addresses, and session credentials are never stored on-chain or published.
          </p>
        </section>
      </div>
    </div>
  )
}
