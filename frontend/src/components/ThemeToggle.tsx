import { useState, useEffect } from 'react'
import { IconSun, IconMoon } from './Icons'

export type Theme = 'light' | 'dark'

function applyTheme(theme: Theme) {
  const root = document.documentElement
  if (theme === 'dark') {
    root.setAttribute('data-theme', 'forge')
  } else {
    root.removeAttribute('data-theme')
  }
}

export function initTheme() {
  const saved = (localStorage.getItem('soulpr-theme') as Theme) || 'dark'
  applyTheme(saved)
  return saved
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('soulpr-theme') as Theme) || 'dark'
  })

  useEffect(() => {
    applyTheme(theme)
    localStorage.setItem('soulpr-theme', theme)
  }, [theme])

  const isDark = theme === 'dark'

  return (
    <button
      id="theme-toggle"
      onClick={() => setTheme(t => (t === 'dark' ? 'light' : 'dark'))}
      title={isDark ? 'Switch to Orange (Light) theme' : 'Switch to Black (Dark) theme'}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        background: isDark ? 'rgba(255, 123, 0, 0.1)' : 'rgba(27, 24, 22, 0.08)',
        border: isDark ? '1px solid rgba(255, 123, 0, 0.3)' : '1px solid rgba(27, 24, 22, 0.15)',
        borderRadius: '99px',
        padding: '5px 12px',
        cursor: 'pointer',
        fontSize: '11px',
        fontWeight: 700,
        color: isDark ? '#FF7B00' : '#1B1816',
        transition: 'all 0.25s ease',
        letterSpacing: '0.03em',
        whiteSpace: 'nowrap',
      }}
    >
      {isDark ? (
        <>
          <IconSun size={12} color="#FF7B00" />
          Orange
        </>
      ) : (
        <>
          <IconMoon size={12} color="#1B1816" />
          Black
        </>
      )}
    </button>
  )
}
