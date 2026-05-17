import { useEffect, useState } from 'react'
import { cn } from '#/lib/utils'

type ThemeMode = 'light' | 'dark' | 'auto'

function getInitialMode(): ThemeMode {
  if (typeof window === 'undefined') return 'auto'
  const stored = window.localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark' || stored === 'auto') return stored
  return 'auto'
}

const THEME_MODE_SYNC = 'gayatri-law-offices:theme-mode'

function applyThemeMode(mode: ThemeMode) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const resolved = mode === 'auto' ? (prefersDark ? 'dark' : 'light') : mode
  document.documentElement.classList.remove('light', 'dark')
  document.documentElement.classList.add(resolved)
  if (mode === 'auto') {
    document.documentElement.removeAttribute('data-theme')
  } else {
    document.documentElement.setAttribute('data-theme', mode)
  }
  document.documentElement.style.colorScheme = resolved
}

export function useThemeMode() {
  const [mode, setMode] = useState<ThemeMode>('auto')

  useEffect(() => {
    const initialMode = getInitialMode()
    setMode(initialMode)
    applyThemeMode(initialMode)
  }, [])

  useEffect(() => {
    const onSync = (e: Event) => {
      const detail = (e as CustomEvent<ThemeMode>).detail
      if (detail === 'light' || detail === 'dark' || detail === 'auto') {
        setMode(detail)
      }
    }
    window.addEventListener(THEME_MODE_SYNC, onSync)
    return () => window.removeEventListener(THEME_MODE_SYNC, onSync)
  }, [])

  useEffect(() => {
    if (mode !== 'auto') return
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => applyThemeMode('auto')
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [mode])

  function cycleMode() {
    const nextMode: ThemeMode =
      mode === 'light' ? 'dark' : mode === 'dark' ? 'auto' : 'light'
    setMode(nextMode)
    applyThemeMode(nextMode)
    window.localStorage.setItem('theme', nextMode)
    window.dispatchEvent(new CustomEvent(THEME_MODE_SYNC, { detail: nextMode }))
  }

  const label =
    mode === 'auto'
      ? 'Theme: system. Click to use light.'
      : mode === 'light'
        ? 'Theme: light. Click to use dark.'
        : 'Theme: dark. Click to use system.'

  return { mode, cycleMode, label }
}

type ThemeToggleProps = {
  className?: string
}

export default function ThemeToggle({ className }: ThemeToggleProps) {
  const { mode, cycleMode, label } = useThemeMode()

  return (
    <button
      type="button"
      onClick={cycleMode}
      aria-label={label}
      title={label}
      className={cn(
        'rounded-full border border-[var(--line)] bg-[var(--chip-bg)] px-2.5 py-1 text-xs font-semibold text-[var(--charcoal)] transition-colors hover:bg-[var(--link-bg-hover)]',
        className,
      )}
    >
      {mode === 'auto' ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
      ) : mode === 'dark' ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
      )}
    </button>
  )
}
