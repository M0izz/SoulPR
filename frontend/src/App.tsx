import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import LinkWallet from './pages/LinkWallet'
import Install from './pages/Install'
import HowItWorks from './pages/HowItWorks'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Pages that do not share the default top nav bar layout */}
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* All other pages share the nav */}
        <Route path="/*" element={
          <div className="page">
            <Nav />
            <Routes>
              <Route path="/link-wallet" element={<LinkWallet />} />
              <Route path="/install" element={<Install />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
            </Routes>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  )
}
