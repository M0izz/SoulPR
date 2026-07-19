import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Nav() {
  const { pathname } = useLocation()
  
  // Theme state
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'default')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  function toggleTheme() {
    setTheme(curr => curr === 'default' ? 'forge' : 'default')
  }

  return (
    <nav className="nav">
      <Link to="/" className="nav-brand">
        <span className="nav-brand-mark" />
        SoulPR
      </Link>
      <div className="nav-links">
        <Link to="/how-it-works" className={`nav-link ${pathname === '/how-it-works' ? 'text-accent' : ''}`}>
          How It Works
        </Link>
        <Link to="/dashboard" className={`nav-link ${pathname === '/dashboard' ? 'text-accent' : ''}`}>
          Verifiable Dashboard
        </Link>
        <Link to="/install" className={`nav-link ${pathname === '/install' ? 'text-accent' : ''}`}>
          GitHub App
        </Link>
        <button className="theme-toggle" onClick={toggleTheme} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          {theme === 'default' ? '☾ forge' : '☼ gold'}
        </button>
        <Link to="/link-wallet">
          <button className="btn btn-accent btn-sm" style={{ border: '1px solid rgba(255,255,255,0.4)', cursor: 'pointer' }}>Connect Wallet</button>
        </Link>
      </div>
    </nav>
  )
}
