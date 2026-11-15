import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SignetBrandLockup from '../brand/SignetBrandLockup'

interface LandingNavProps {
  onScrollTo?: (id: string) => void
}

export const LandingNav: React.FC<LandingNavProps> = ({ onScrollTo }) => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (e: React.MouseEvent, targetId: string) => {
    e.preventDefault()
    setMobileMenuOpen(false)
    if (onScrollTo) {
      onScrollTo(targetId)
    } else {
      const el = document.getElementById(targetId)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: scrolled ? '12px 2rem' : '18px 2.5rem',
          backgroundColor: scrolled ? 'rgba(12, 11, 10, 0.88)' : 'rgba(10, 9, 8, 0.45)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: scrolled ? '1px solid rgba(237, 226, 208, 0.1)' : '1px solid rgba(237, 226, 208, 0.04)',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        role="banner"
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Left: Brand lockup */}
          <SignetBrandLockup
            color="#EDE2D0"
            markColor="#B9572B"
            markSize={26}
            wordmarkSize={17}
          />

          {/* Centre: Main protocol links (Desktop) */}
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2.2rem',
            }}
            className="landing-nav-center"
            aria-label="Primary navigation"
          >
            <a
              href="#protocol"
              onClick={(e) => handleNavClick(e, 'protocol')}
              style={{
                fontSize: '13.5px',
                fontWeight: 500,
                color: '#EDE2D0',
                opacity: 0.8,
                transition: 'opacity 0.2s',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.8')}
            >
              Protocol
            </a>
            <a
              href="#walkthrough"
              onClick={(e) => handleNavClick(e, 'walkthrough')}
              style={{
                fontSize: '13.5px',
                fontWeight: 500,
                color: '#EDE2D0',
                opacity: 0.8,
                transition: 'opacity 0.2s',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.8')}
            >
              How it works
            </a>
            <a
              href="#credentials"
              onClick={(e) => handleNavClick(e, 'credentials')}
              style={{
                fontSize: '13.5px',
                fontWeight: 500,
                color: '#EDE2D0',
                opacity: 0.8,
                transition: 'opacity 0.2s',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.8')}
            >
              Credentials
            </a>
            <a
              href="#audiences"
              onClick={(e) => handleNavClick(e, 'audiences')}
              style={{
                fontSize: '13.5px',
                fontWeight: 500,
                color: '#EDE2D0',
                opacity: 0.8,
                transition: 'opacity 0.2s',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.8')}
            >
              Developers
            </a>
          </nav>

          {/* Right: Actions */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.2rem',
            }}
            className="landing-nav-right"
          >
            <Link
              to="/install"
              style={{
                fontSize: '13.5px',
                fontWeight: 500,
                color: '#EDE2D0',
                opacity: 0.75,
                textDecoration: 'none',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.75')}
            >
              Docs
            </Link>

            <Link
              to="/auth"
              style={{
                fontSize: '13.5px',
                fontWeight: 600,
                color: '#EDE2D0',
                padding: '6px 14px',
                borderRadius: '6px',
                border: '1px solid rgba(237, 226, 208, 0.16)',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                textDecoration: 'none',
                transition: 'border-color 0.2s, background-color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(237, 226, 208, 0.35)'
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.07)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(237, 226, 208, 0.16)'
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)'
              }}
            >
              Sign in
            </Link>

            <button
              onClick={() => navigate('/auth')}
              style={{
                fontSize: '13.5px',
                fontWeight: 700,
                color: '#EDE2D0',
                backgroundColor: 'var(--signet-orange)',
                border: '1px solid rgba(185, 87, 43, 0.6)',
                borderRadius: '6px',
                padding: '7px 18px',
                cursor: 'pointer',
                letterSpacing: '0.02em',
                boxShadow: '0 4px 14px rgba(185, 87, 43, 0.28)',
                transition: 'transform 0.15s, box-shadow 0.15s, background-color 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)'
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(185, 87, 43, 0.42)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(185, 87, 43, 0.28)'
              }}
            >
              Get started
            </button>

            {/* Mobile menu hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="landing-nav-mobile-toggle"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
              style={{
                display: 'none',
                background: 'none',
                border: 'none',
                color: '#EDE2D0',
                padding: '6px',
                cursor: 'pointer',
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {mobileMenuOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <path d="M3 12h18M3 6h18M3 18h18" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99,
            backgroundColor: 'rgba(16, 16, 15, 0.98)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1.8rem',
            padding: '2rem',
          }}
          role="dialog"
          aria-modal="true"
        >
          <a
            href="#protocol"
            onClick={(e) => handleNavClick(e, 'protocol')}
            style={{ fontSize: '20px', color: '#EDE2D0', textDecoration: 'none', fontWeight: 600 }}
          >
            Protocol
          </a>
          <a
            href="#walkthrough"
            onClick={(e) => handleNavClick(e, 'walkthrough')}
            style={{ fontSize: '20px', color: '#EDE2D0', textDecoration: 'none', fontWeight: 600 }}
          >
            How it works
          </a>
          <a
            href="#credentials"
            onClick={(e) => handleNavClick(e, 'credentials')}
            style={{ fontSize: '20px', color: '#EDE2D0', textDecoration: 'none', fontWeight: 600 }}
          >
            Credentials
          </a>
          <a
            href="#audiences"
            onClick={(e) => handleNavClick(e, 'audiences')}
            style={{ fontSize: '20px', color: '#EDE2D0', textDecoration: 'none', fontWeight: 600 }}
          >
            Developers
          </a>
          <Link
            to="/install"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: '18px', color: '#EDE2D0', textDecoration: 'none', opacity: 0.8 }}
          >
            Documentation
          </Link>
          <Link
            to="/auth"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              marginTop: '1rem',
              width: '200px',
              textAlign: 'center',
              backgroundColor: 'var(--signet-orange)',
              color: '#EDE2D0',
              padding: '12px 0',
              borderRadius: '8px',
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            Get started
          </Link>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .landing-nav-center {
            display: none !important;
          }
          .landing-nav-mobile-toggle {
            display: block !important;
          }
        }
      `}</style>
    </>
  )
}

export default LandingNav
