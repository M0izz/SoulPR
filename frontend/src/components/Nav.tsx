import { Link, useLocation, useNavigate } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import { IconWallet, IconSoulPRLogo } from './Icons'

export default function Nav() {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const linkStyle = (active: boolean): React.CSSProperties => ({
    fontSize: '13px',
    fontWeight: active ? 700 : 500,
    color: active ? '#FF7B00' : 'rgba(255,255,255,0.7)',
    transition: 'color 0.2s',
    textDecoration: 'none',
    position: 'relative',
    paddingBottom: '2px',
    borderBottom: active ? '2px solid #FF7B00' : '2px solid transparent',
  })

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: 'rgba(11, 10, 9, 0.85)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(78, 66, 56, 0.4)',
      borderRadius: '99px',
      padding: '0.6rem 1.6rem',
      maxWidth: '1100px',
      margin: '1.2rem auto 0',
    }}>

      {/* Brand */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
        <IconSoulPRLogo size={28} />
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '15px', color: '#FFF' }}>SoulPR</span>
          <span style={{ fontSize: '7px', textTransform: 'uppercase', color: '#E05300', letterSpacing: '0.06em', fontWeight: 700 }}>proof that builds you</span>
        </div>
      </Link>

      {/* Nav Links */}
      <div style={{ display: 'flex', gap: '1.6rem', alignItems: 'center' }}>
        <Link to="/" style={linkStyle(pathname === '/')}>Home</Link>
        <Link to="/how-it-works" style={linkStyle(false)}>Features</Link>
        <Link to="/how-it-works" style={linkStyle(pathname === '/how-it-works')}>How It Works</Link>
        <Link to="/install" style={linkStyle(pathname === '/install')}>Docs</Link>
        <Link to="/" style={linkStyle(false)}>About</Link>
      </div>

      {/* Right: Network + Theme Toggle + Link Wallet */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>

        {/* Monad Testnet badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          background: 'rgba(168, 85, 247, 0.08)',
          border: '1px solid rgba(168, 85, 247, 0.25)',
          borderRadius: '99px', padding: '5px 12px',
          color: '#C084FC', fontSize: '11px', fontWeight: 600,
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#A855F7', display: 'inline-block', flexShrink: 0 }} />
          MONAD TESTNET
          <span style={{ fontSize: '7px', opacity: 0.6 }}>▼</span>
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Link Wallet */}
        <button
          id="nav-link-wallet"
          onClick={() => navigate('/link-wallet')}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'linear-gradient(135deg, #FF7B00 0%, #E05300 100%)',
            color: 'white', border: 'none', borderRadius: '99px',
            padding: '7px 16px', fontSize: '12px', fontWeight: 700,
            cursor: 'pointer', boxShadow: '0 4px 12px rgba(255,123,0,0.25)',
            transition: 'transform 0.15s, box-shadow 0.15s',
          }}
          onMouseEnter={e => { (e.target as HTMLElement).style.transform = 'scale(1.03)' }}
          onMouseLeave={e => { (e.target as HTMLElement).style.transform = 'scale(1)' }}
        >
          <IconWallet size={13} color="white" />
          Link Wallet
        </button>
      </div>
    </nav>
  )
}
