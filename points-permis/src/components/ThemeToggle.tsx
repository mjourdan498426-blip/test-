import { useEffect, useState } from 'react'
import { loadTheme, saveTheme } from '../lib/storage'

type Theme = 'light' | 'dark'

const systemTheme = (): Theme =>
  typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

const THEME_COLOR: Record<Theme, string> = { light: '#eef2f7', dark: '#0c131c' }

/** Bascule clair / sombre. Sans choix explicite, le thème suit le système. */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => loadTheme() ?? systemTheme())

  useEffect(() => {
    if (loadTheme() !== null) return
    const mq = matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => setTheme(mq.matches ? 'dark' : 'light')
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    saveTheme(next)
    document.documentElement.dataset.theme = next
    document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute('content', THEME_COLOR[next]))
  }

  const dark = theme === 'dark'
  return (
    <button
      type="button"
      className="btn btn-ghost px-3"
      onClick={toggle}
      aria-label={dark ? 'Passer au thème clair' : 'Passer au thème sombre'}
    >
      {dark ? (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
          <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />
        </svg>
      )}
    </button>
  )
}
