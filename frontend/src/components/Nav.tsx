import { Link, useLocation, useNavigate } from 'react-router-dom'

export default function Nav() {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  return (
    <nav className="nav" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(11, 10, 9, 0.75)', border: '1px solid rgba(78, 66, 56, 0.4)', borderRadius: '99px', padding: '0.65rem 2rem', maxWidth: '1000px', margin: '1.2rem auto 0' }}>
      
      {/* Brand logo matching the screenshot */}
      <Link to="/" className="nav-brand" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '18px', color: '#FFF' }}>
        <div style={{ width: '22px', height: '22px', border: '2px solid #FF7B00', borderRadius: '6px', transform: 'rotate(45deg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '10px', color: '#FF7B00', fontWeight: 'bold', transform: 'rotate(-45deg)' }}>S</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.1 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '16px' }}>SoulPR</span>
          <span style={{ fontSize: '7px', textTransform: 'uppercase', color: '#E05300', letterSpacing: '0.05em', fontWeight: 700 }}>proof that builds you</span>
        </div>
      </Link>

      {/* Nav links matching the screenshot */}
      <div className="nav-links" style={{ display: 'flex', gap: '1.8rem', alignItems: 'center' }}>
        <Link to="/" className={`nav-link ${pathname === '/' ? 'active-orange' : ''}`} style={{ fontSize: '13px', color: pathname === '/' ? '#FF7B00' : 'rgba(255,255,255,0.7)', transition: 'all 0.2s' }}>
          Home
        </Link>
        <Link to="/how-it-works" className={`nav-link ${pathname === '/features' ? 'active-orange' : ''}`} style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>
          Features
        </Link>
        <Link to="/how-it-works" className={`nav-link ${pathname === '/how-it-works' ? 'active-orange' : ''}`} style={{ fontSize: '13px', color: pathname === '/how-it-works' ? '#FF7B00' : 'rgba(255,255,255,0.7)' }}>
          How It Works
        </Link>
        <Link to="/install" className="nav-link" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>
          Docs
        </Link>
        <Link to="/how-it-works" className="nav-link" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>
          About
        </Link>
      </div>

      {/* Right network selector and Link Wallet action */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        
        {/* Monad network selector badge dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: '99px', padding: '5px 12px', color: '#C084FC', fontSize: '11px', fontWeight: 600 }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#A855F7', display: 'inline-block' }} />
          MONAD TESTNET
          <span style={{ fontSize: '8px', opacity: 0.7 }}>▼</span>
        </div>

        {/* Link Wallet Action Button */}
        <button 
          className="btn btn-accent btn-sm" 
          onClick={() => navigate('/link-wallet')}
          style={{ background: 'linear-gradient(135deg, #FF7B00 0%, #E05300 100%)', color: 'white', border: 'none', borderRadius: '99px', padding: '7px 16px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          💳 Link Wallet
        </button>
      </div>

    </nav>
  )
}
