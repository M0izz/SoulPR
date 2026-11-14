import { useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useWorkspace } from '../../context/WorkspaceContext'
import SignetBrandLockup from '../brand/SignetBrandLockup'
import SignetInsignia from '../brand/SignetInsignia'
import CredentialSeal from '../credential/CredentialSeal'
import ThemeToggle from '../ThemeToggle'
import {
  IconHome,
  IconCode,
  IconAward,
  IconShieldCheck,
  IconSettings,
  IconGitHub,
  IconWallet,
  IconRefresh,
  IconChevronDown,
} from '../Icons'

// Navigation items matching Section 5 of the SIGNET PRD
const NAV_ITEMS = [
  {
    to: '/dashboard',
    label: 'Overview',
    description: 'Personal contribution headquarters',
    icon: (size: number) => <IconHome size={size} />,
  },
  {
    to: '/contributions',
    label: 'Contributions',
    description: 'Structured PR registry & evidence',
    icon: (size: number) => <IconCode size={size} />,
  },
  {
    to: '/credentials',
    label: 'My Credentials',
    description: 'Issued & pending credentials',
    icon: (size: number) => <IconAward size={size} />,
  },
  {
    to: '/verification',
    label: 'Verification',
    description: 'Public lookup & protocol check',
    icon: (size: number) => <IconShieldCheck size={size} />,
  },
  {
    to: '/settings',
    label: 'Settings',
    description: 'Account, wallet & sync settings',
    icon: (size: number) => <IconSettings size={size} />,
  },
]

export default function WorkspaceLayout() {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false)
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false)
  const { userGithub, nearAccount, isAuthenticated, isLinked, syncState, triggerSync } = useWorkspace()
  const location = useLocation()
  const navigate = useNavigate()

  const currentNav = NAV_ITEMS.find((item) =>
    location.pathname === item.to || (item.to !== '/dashboard' && location.pathname.startsWith(item.to))
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--paper)', color: 'var(--ink)' }}>
      {/* ── DESKTOP PERSISTENT SIDEBAR ── */}
      <aside
        className="workspace-sidebar"
        style={{
          width: isCollapsed ? '76px' : '260px',
          transition: 'width 0.2s ease-in-out',
          backgroundColor: 'var(--paper-raised)',
          borderRight: '1px solid var(--rule)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: isCollapsed ? '1.5rem 0.6rem' : '1.5rem 1.2rem',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 40,
          boxSizing: 'border-box',
          overflowX: 'hidden',
        }}
      >
        {/* Top: Brand & Collapse Toggle */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: isCollapsed ? 'center' : 'space-between',
              marginBottom: '2rem',
              paddingBottom: '1rem',
              borderBottom: '1px solid var(--rule)',
            }}
          >
            {isCollapsed ? (
              <div
                onClick={() => navigate('/')}
                style={{ cursor: 'pointer' }}
                title="SIGNET · Your work is your mark."
              >
                <SignetInsignia size={32} />
              </div>
            ) : (
              <div onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                <SignetBrandLockup markSize={28} wordmarkSize={18} />
              </div>
            )}

            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--ink-faint)',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(90deg)',
                transition: 'transform 0.2s ease',
              }}
            >
              <IconChevronDown size={16} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {NAV_ITEMS.map((item) => {
              const isActive =
                location.pathname === item.to ||
                (item.to !== '/dashboard' && location.pathname.startsWith(item.to))

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  title={isCollapsed ? `${item.label} — ${item.description}` : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: isCollapsed ? '0' : '12px',
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    padding: isCollapsed ? '12px 0' : '10px 14px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontSize: '13.5px',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#B9572B' : 'var(--ink-muted)',
                    backgroundColor: isActive ? 'rgba(185, 87, 43, 0.1)' : 'transparent',
                    borderLeft: isActive ? '3px solid #B9572B' : '3px solid transparent',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span
                    style={{
                      color: isActive ? '#B9572B' : 'var(--ink-faint)',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {item.icon(18)}
                  </span>
                  {!isCollapsed && <span>{item.label}</span>}
                </NavLink>
              )
            })}
          </nav>
        </div>

        {/* Bottom Section: Connection Pill & Seal Note */}
        <div>
          {/* Identity state indicator */}
          {!isCollapsed && (
            <div
              style={{
                padding: '10px 12px',
                backgroundColor: 'var(--paper)',
                border: '1px solid var(--rule)',
                borderRadius: '8px',
                marginBottom: '1rem',
                fontSize: '11.5px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <IconGitHub size={13} color="var(--ink-muted)" />
                <span style={{ fontWeight: 600, color: 'var(--ink)' }}>
                  {isAuthenticated && userGithub ? `@${userGithub}` : 'GitHub: Not signed in'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <IconWallet size={13} color="var(--ink-muted)" />
                <span style={{ color: isLinked && nearAccount ? '#B9572B' : 'var(--ink-faint)', fontWeight: 600 }}>
                  {isLinked && nearAccount ? nearAccount : 'NEAR: Unlinked'}
                </span>
              </div>
            </div>
          )}

          {/* Archival seal stamp */}
          {!isCollapsed && (
            <div
              style={{
                padding: '1rem',
                borderRadius: '8px',
                backgroundColor: 'rgba(185, 87, 43, 0.05)',
                border: '1px solid rgba(185, 87, 43, 0.2)',
                textAlign: 'center',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '6px' }}>
                <CredentialSeal size={28} />
              </div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ink)', marginBottom: '2px' }}>
                Your work is your mark.
              </div>
              <div style={{ fontSize: '10px', color: 'var(--ink-muted)' }}>
                Evidence-first protocol archive.
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Header Strip */}
        <header
          style={{
            height: '64px',
            backgroundColor: 'var(--paper-raised)',
            borderBottom: '1px solid var(--rule)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 2rem',
            position: 'sticky',
            top: 0,
            zIndex: 30,
          }}
        >
          {/* Section title & breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Mobile menu hamburger button */}
            <button
              onClick={() => setIsMobileOpen(true)}
              className="workspace-mobile-toggle"
              aria-label="Open navigation menu"
              style={{
                display: 'none',
                background: 'transparent',
                border: '1px solid var(--rule)',
                borderRadius: '6px',
                padding: '6px',
                color: 'var(--ink)',
                cursor: 'pointer',
              }}
            >
              <IconCode size={18} />
            </button>

            <div>
              <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--ink)' }}>
                {currentNav?.label ?? 'Workspace'}
              </span>
              <span
                style={{
                  fontSize: '12px',
                  color: 'var(--ink-muted)',
                  marginLeft: '8px',
                  display: 'inline-block',
                }}
              >
                / {currentNav?.description}
              </span>
            </div>
          </div>

          {/* Right Header Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Sync control & status */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '5px 10px',
                borderRadius: '6px',
                backgroundColor: 'var(--paper)',
                border: '1px solid var(--rule)',
                fontSize: '11.5px',
              }}
            >
              <span style={{ color: 'var(--ink-muted)' }}>
                {syncState.isSyncing ? 'Syncing...' : `Last sync: ${syncState.lastSyncedAt ?? 'None'}`}
              </span>
              <button
                onClick={triggerSync}
                disabled={syncState.isSyncing}
                title="Synchronize GitHub contributions"
                style={{
                  background: 'none',
                  border: 'none',
                  color: syncState.isSyncing ? '#B9572B' : 'var(--ink)',
                  cursor: syncState.isSyncing ? 'not-allowed' : 'pointer',
                  padding: '2px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <IconRefresh size={13} className={syncState.isSyncing ? 'spin' : ''} />
              </button>
            </div>

            {/* Protocol Network Badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'rgba(185, 87, 43, 0.08)',
                border: '1px solid rgba(185, 87, 43, 0.25)',
                borderRadius: '6px',
                padding: '5px 10px',
                fontSize: '11px',
                fontWeight: 700,
                color: '#B9572B',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#B9572B',
                  display: 'inline-block',
                }}
              />
              NEAR TESTNET
            </div>

            <ThemeToggle />
          </div>
        </header>

        {/* Nested Active View Page */}
        <main className="signet-enter-fade" style={{ flex: 1, padding: '2rem 2.5rem', overflowY: 'auto', boxSizing: 'border-box' }}>
          <Outlet />
        </main>
      </div>

      {/* ── MOBILE SLIDE-OUT DRAWER ── */}
      {isMobileOpen && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            display: 'flex',
          }}
        >
          {/* Backdrop */}
          <div
            onClick={() => setIsMobileOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(3px)',
            }}
          />

          {/* Drawer Panel */}
          <div
            style={{
              position: 'relative',
              width: '280px',
              backgroundColor: 'var(--paper-raised)',
              borderRight: '1px solid var(--rule)',
              height: '100%',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxSizing: 'border-box',
            }}
          >
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1.5rem',
                }}
              >
                <SignetBrandLockup markSize={24} wordmarkSize={16} />
                <button
                  onClick={() => setIsMobileOpen(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '18px',
                    color: 'var(--ink-muted)',
                    cursor: 'pointer',
                  }}
                >
                  ✕
                </button>
              </div>

              <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {NAV_ITEMS.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsMobileOpen(false)}
                    style={({ isActive }) => ({
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? '#B9572B' : 'var(--ink-muted)',
                      backgroundColor: isActive ? 'rgba(185, 87, 43, 0.1)' : 'transparent',
                    })}
                  >
                    {item.icon(18)}
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </nav>
            </div>

            <div style={{ fontSize: '11px', color: 'var(--ink-muted)', textAlign: 'center' }}>
              SIGNET Protocol · v1.0
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
