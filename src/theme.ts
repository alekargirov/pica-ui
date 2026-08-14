// pica-ui — runtime theme helpers (shared by ThemeSwitcher and app boot scripts)

// `lightOnly` marks a theme that ships no .dark block. Without it the mode
// toggle silently does nothing on that theme — the palette stays light while
// <html> still carries class="dark", so any app rule hung off .dark applies
// dark-mode values over a light ground.
export const THEMES = [
  { id: 'graphite', label: 'Graphite' },
  { id: 'hearth', label: 'Hearth' },
  { id: 'signal', label: 'Signal' },
  { id: 'forge', label: 'Forge' },
  { id: 'petal', label: 'Petal' },
  { id: 'void', label: 'Void' },
  { id: 'prose', label: 'Prose', lightOnly: true },
] as const

export type ThemeId = (typeof THEMES)[number]['id']
export type Mode = 'light' | 'dark'

export const THEME_KEY = 'pica:theme'
export const MODE_KEY = 'pica:mode'
export const DEFAULT_THEME: ThemeId = 'graphite'
export const DEFAULT_MODE: Mode = 'dark'

// What the SERVER already decided, if anything did. An SSR app stamps the theme
// onto <html> before the page is sent; without consulting that, the client would
// find an empty localStorage, fall back to the package default, and overwrite a
// correct server render on mount — reintroducing exactly the flash the SSR path
// exists to remove.
//
// Precedence: the visitor's stored choice, then whatever the server rendered,
// then the default.
function rendered(): { theme: string | null; dark: boolean } {
  if (typeof document === 'undefined') return { theme: null, dark: false }
  const el = document.documentElement
  return { theme: el.getAttribute('data-theme'), dark: el.classList.contains('dark') }
}

export function getTheme(): ThemeId {
  const stored = typeof localStorage === 'undefined' ? null : localStorage.getItem(THEME_KEY)
  if (THEMES.some((x) => x.id === stored)) return stored as ThemeId

  const fromServer = rendered().theme
  if (THEMES.some((x) => x.id === fromServer)) return fromServer as ThemeId

  return DEFAULT_THEME
}

export function getMode(): Mode {
  const stored = typeof localStorage === 'undefined' ? null : localStorage.getItem(MODE_KEY)
  if (stored === 'light' || stored === 'dark') return stored

  // Only trust the rendered class when the server actually rendered a theme —
  // otherwise "no dark class" is indistinguishable from "no server render".
  if (rendered().theme) return rendered().dark ? 'dark' : 'light'

  return DEFAULT_MODE
}

/** Does this theme ship a dark variant? */
export function isLightOnly(theme: ThemeId): boolean {
  return THEMES.some((t) => t.id === theme && 'lightOnly' in t && t.lightOnly)
}

/**
 * The mode a theme can actually honour.
 *
 * Asking a light-only theme for dark mode is not a preference it can meet, so
 * it resolves to light rather than leaving `class="dark"` on a light palette.
 * The user's stored preference is untouched — switch back to a theme with a
 * dark variant and it returns.
 */
export function modeFor(theme: ThemeId, mode: Mode): Mode {
  return isLightOnly(theme) ? 'light' : mode
}

export function applyTheme(theme: ThemeId, mode: Mode) {
  if (typeof document === 'undefined') return
  const el = document.documentElement
  el.setAttribute('data-theme', theme)
  el.classList.toggle('dark', modeFor(theme, mode) === 'dark')
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(THEME_KEY, theme)
    localStorage.setItem(MODE_KEY, mode)
  }
}
