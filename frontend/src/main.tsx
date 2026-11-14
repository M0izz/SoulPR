import { Buffer } from 'buffer'

// Polyfill Buffer on window & globalThis for browser runtime compatibility
if (typeof window !== 'undefined') {
  window.Buffer = Buffer
}
if (typeof globalThis !== 'undefined') {
  globalThis.Buffer = Buffer
}

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
