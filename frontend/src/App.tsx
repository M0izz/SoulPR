import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Nav from './components/Nav'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import VerifySample from './pages/VerifySample'
import VerifyLive from './pages/VerifyLive'
import LinkWallet from './pages/LinkWallet'
import Install from './pages/Install'
import HowItWorks from './pages/HowItWorks'
import CredentialDetail from './pages/CredentialDetail'
import { initTheme } from './components/ThemeToggle'
import { WorkspaceProvider } from './context/WorkspaceContext'
import WorkspaceLayout from './components/layout/WorkspaceLayout'
import OverviewPage from './pages/workspace/OverviewPage'
import ContributionsPage from './pages/workspace/ContributionsPage'
import ContributionDossierPage from './pages/workspace/ContributionDossierPage'
import CredentialsPage from './pages/workspace/CredentialsPage'
import VerificationLookupPage from './pages/workspace/VerificationLookupPage'
import SettingsPage from './pages/workspace/SettingsPage'

export default function App() {
  // Initialize theme from localStorage before first render
  useEffect(() => {
    initTheme()
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        {/* Dedicated standalone landing & auth pages */}
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />

        {/* Public verification routes (no workspace shell) */}
        <Route path="/verify/sample" element={<VerifySample />} />
        <Route path="/verify/:credentialId" element={<VerifyLive />} />

        {/* ── AUTHENTICATED WORKSPACE SHELL ── */}
        <Route
          element={
            <WorkspaceProvider>
              <WorkspaceLayout />
            </WorkspaceProvider>
          }
        >
          <Route path="/dashboard" element={<OverviewPage />} />
          <Route path="/contributions" element={<ContributionsPage />} />
          <Route path="/contributions/:id" element={<ContributionDossierPage />} />
          <Route path="/credentials" element={<CredentialsPage />} />
          <Route path="/verification" element={<VerificationLookupPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* Secondary utilities with top nav */}
        <Route
          path="/*"
          element={
            <div className="page">
              <Nav />
              <Routes>
                <Route path="/link-wallet" element={<LinkWallet />} />
                <Route path="/install" element={<Install />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/credential/:tokenId" element={<CredentialDetail />} />
                {/* Fallback redirect */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
