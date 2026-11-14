import React from 'react'
import { Link } from 'react-router-dom'
import SignetBrandLockup from '../brand/SignetBrandLockup'

export const SignetFooter: React.FC = () => {
  return (
    <footer
      style={{
        backgroundColor: '#191715',
        color: '#EDE2D0',
        padding: '5rem 2rem 3.5rem',
        borderTop: '1px solid rgba(237, 226, 208, 0.08)',
      }}
      role="contentinfo"
    >
      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr 1fr',
          gap: '3rem',
          marginBottom: '3.5rem',
          textAlign: 'left',
        }}
        className="signet-footer-grid"
      >
        {/* Brand Column */}
        <div>
          <SignetBrandLockup
            color="#EDE2D0"
            markColor="#B9572B"
            markSize={30}
            wordmarkSize={19}
            showMotto={true}
          />
          <p
            style={{
              fontSize: '13.5px',
              color: 'var(--signet-muted)',
              lineHeight: 1.7,
              maxWidth: '360px',
              marginTop: '1.2rem',
            }}
          >
            A contribution credential protocol turning meaningful open-source work into lasting,
            independently inspectable records. Built for builders who value proof.
          </p>
        </div>

        {/* Explore Links */}
        <div>
          <div
            style={{
              fontSize: '11px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: '#B9572B',
              marginBottom: '1.2rem',
            }}
          >
            Explore
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li>
              <a href="#protocol" style={{ fontSize: '13.5px', color: '#EDE2D0', opacity: 0.8, textDecoration: 'none' }}>
                Protocol
              </a>
            </li>
            <li>
              <a href="#walkthrough" style={{ fontSize: '13.5px', color: '#EDE2D0', opacity: 0.8, textDecoration: 'none' }}>
                How it works
              </a>
            </li>
            <li>
              <a href="#credentials" style={{ fontSize: '13.5px', color: '#EDE2D0', opacity: 0.8, textDecoration: 'none' }}>
                Credentials
              </a>
            </li>
            <li>
              <a href="#audiences" style={{ fontSize: '13.5px', color: '#EDE2D0', opacity: 0.8, textDecoration: 'none' }}>
                Developers & Ecosystem
              </a>
            </li>
            <li>
              <Link to="/verify/sample" style={{ fontSize: '13.5px', color: '#B9572B', fontWeight: 600, textDecoration: 'none' }}>
                Sample Credential →
              </Link>
            </li>
          </ul>
        </div>

        {/* Resources & Ecosystem Links */}
        <div>
          <div
            style={{
              fontSize: '11px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: '#B9572B',
              marginBottom: '1.2rem',
            }}
          >
            Resources
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li>
              <Link to="/install" style={{ fontSize: '13.5px', color: '#EDE2D0', opacity: 0.8, textDecoration: 'none' }}>
                Documentation
              </Link>
            </li>
            <li>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                style={{ fontSize: '13.5px', color: '#EDE2D0', opacity: 0.8, textDecoration: 'none' }}
              >
                GitHub Repository
              </a>
            </li>
            <li>
              <Link to="/how-it-works" style={{ fontSize: '13.5px', color: '#EDE2D0', opacity: 0.8, textDecoration: 'none' }}>
                Protocol Architecture FAQ
              </Link>
            </li>
            <li>
              <Link to="/dashboard" style={{ fontSize: '13.5px', color: '#EDE2D0', opacity: 0.8, textDecoration: 'none' }}>
                Contributor Workspace
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Legal / Motto Bar */}
      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          paddingTop: '2rem',
          borderTop: '1px solid rgba(237, 226, 208, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '12px',
          color: 'var(--signet-muted)',
        }}
      >
        <div>
          Built for lasting contributions.
        </div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <span>© 2026 SIGNET Protocol</span>
          <span>Open Source Infrastructure</span>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .signet-footer-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </footer>
  )
}

export default SignetFooter
