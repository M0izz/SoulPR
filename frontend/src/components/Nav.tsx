import { Link, useLocation, useNavigate } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import SignetBrandLockup from './brand/SignetBrandLockup'

export default function Nav() {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const linkStyle = (active: boolean): React.CSSProperties => ({
    fontSize: '14px',
    fontWeight: active ? 700 : 500,
    color: active ? '#B9572B' : 'var(--ink-muted)',
    transition: 'color 0.2s',
    textDecoration: 'none',
    position: 'relative',
    paddingBottom: '2px',
    borderBottom: active ? '2px solid #B9572B' : '2px solid transparent',
  })

  return (
    <nav
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'var(--paper-overlay)',
        backdropFilter: 'blur(16px)',
        border: '1px solid var(--rule)',
        borderRadius: '99px',
        padding: '0.75rem 2rem',
        maxWidth: '1240px',
        margin: '1.2rem auto 0',
        transition: 'background 0.3s, border-color 0.3s',
      }}
    >
      {/* Brand Lockup */}
      <SignetBrandLockup
        color="var(--ink)"
        markColor="#B9572B"
        markSize={26}
        wordmarkSize={17}
      />

      {/* Nav Links */}
      <div style={{ display: 'flex', gap: '1.8rem', alignItems: 'center' }}>
        <Link to="/" style={linkStyle(pathname === '/')}>Home</Link>
        <Link to="/dashboard" style={linkStyle(pathname === '/dashboard')}>Dashboard</Link>
        <Link to="/install" style={linkStyle(pathname === '/install')}>Track Repos</Link>
        <Link to="/how-it-works" style={linkStyle(pathname === '/how-it-works')}>Architecture FAQ</Link>
        <Link to="/verify/sample" style={{ ...linkStyle(pathname === '/verify/sample'), color: '#B9572B', fontWeight: 600 }}>
          Sample Credential
        </Link>
      </div>

      {/* Right: Protocol Indicator + Theme Toggle + Auth Button */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        {/* NEAR Protocol Indicator */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(185, 87, 43, 0.08)',
            border: '1px solid rgba(185, 87, 43, 0.25)',
            borderRadius: '99px',
            padding: '5px 12px',
            color: '#B9572B',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.04em',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#B9572B',
              display: 'inline-block',
              flexShrink: 0,
            }}
          />
          NEAR PROTOCOL
        </div>

        <ThemeToggle />

        <button
          onClick={() => navigate('/auth')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'var(--signet-orange)',
            color: '#EDE2D0',
            border: 'none',
            borderRadius: '99px',
            padding: '7px 18px',
            fontSize: '12.5px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(185, 87, 43, 0.25)',
            transition: 'transform 0.15s',
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.transform = 'scale(1.02)')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = 'scale(1)')}
        >
          Sign In
        </button>
      </div>
    </nav>
  )
}
