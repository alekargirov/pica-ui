// pica-ui — runtime theme helpers (shared by ThemeSwitcher and app boot scripts)

export const THEMES = [
  { id: 'graphite', label: 'Graphite' },
  { id: 'hearth', label: 'Hearth' },
  { id: 'signal', label: 'Signal' },
  { id: 'forge', label: 'Forge' },
  { id: 'petal', label: 'Petal' },
  { id: 'void', label: 'Void' },
  { id: 'prose', label: 'Prose' },
] as const

export type ThemeId = (typeof THEMES)[number]['id']
export type Mode = 'light' | 'dark'

export const THEME_KEY = 'pica:theme'
export const MODE_KEY = 'pica:mode'
export const DEFAULT_THEME: ThemeId = 'graphite'
export const DEFAULT_MODE: Mode = 'dark'

export function getTheme(): ThemeId {
  if (typeof localStorage === 'undefined') return DEFAULT_THEME
  const t = localStorage.getItem(THEME_KEY)
  return (THEMES.some((x) => x.id === t) ? t : DEFAULT_THEME) as ThemeId
}

export function getMode(): Mode {
  if (typeof localStorage === 'undefined') return DEFAULT_MODE
  const m = localStorage.getItem(MODE_KEY)
  return m === 'light' || m === 'dark' ? m : DEFAULT_MODE
}

export function applyTheme(theme: ThemeId, mode: Mode) {
  if (typeof document === 'undefined') return
  const el = document.documentElement
  el.setAttribute('data-theme', theme)
  el.classList.toggle('dark', mode === 'dark')
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(THEME_KEY, theme)
    localStorage.setItem(MODE_KEY, mode)
  }
}
