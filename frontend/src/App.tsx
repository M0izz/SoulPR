import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import VerifySample from './pages/VerifySample'
import VerifyLive from './pages/VerifyLive'
import Dashboard from './pages/Dashboard'
import LinkWallet from './pages/LinkWallet'
import Install from './pages/Install'
import HowItWorks from './pages/HowItWorks'
import CredentialDetail from './pages/CredentialDetail'
import { initTheme } from './components/ThemeToggle'

export default function App() {
  // Initialize theme from localStorage before first render
  useEffect(() => {
    initTheme()
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        {/* Dedicated standalone pages without top nav */}
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/verify/sample" element={<VerifySample />} />
        <Route path="/verify/:credentialId" element={<VerifyLive />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* All other pages share the nav */}
        <Route path="/*" element={
          <div className="page">
            <Nav />
            <Routes>
              <Route path="/link-wallet" element={<LinkWallet />} />
              <Route path="/install" element={<Install />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/credential/:tokenId" element={<CredentialDetail />} />
            </Routes>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  )
}
