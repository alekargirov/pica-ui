// Server-side theme resolution.
//
// theme.ts is the CLIENT half: it reads localStorage, which does not exist until
// hydration. An SSR app relying on it paints the default palette, hydrates, then
// repaints — a visible flash of the wrong theme on every page load. Neither of
// pica-ui's original consumers was SSR, so this path never existed.
//
// The server reads the same cookie the client writes, so the two halves agree on
// the first paint.
import {
  THEMES,
  DEFAULT_THEME,
  DEFAULT_MODE,
  THEME_KEY,
  MODE_KEY,
  type ThemeId,
  type Mode,
} from './theme.js'

function cookie(header: string | null | undefined, name: string): string | undefined {
  if (!header) return undefined
  for (const part of header.split(';')) {
    const eq = part.indexOf('=')
    if (eq < 0) continue
    if (part.slice(0, eq).trim() === name) return part.slice(eq + 1).trim()
  }
  return undefined
}

/**
 * Resolve theme and mode from a Cookie header.
 *
 * The value is attacker-controlled and ends up in an HTML attribute, so an
 * unrecognised theme falls back to the default rather than being echoed.
 */
export function themeFromCookie(
  header: string | null | undefined,
): { theme: ThemeId; mode: Mode } {
  const t = cookie(header, THEME_KEY)
  const m = cookie(header, MODE_KEY)
  return {
    theme: THEMES.some((x) => x.id === t) ? (t as ThemeId) : DEFAULT_THEME,
    mode: m === 'light' || m === 'dark' ? m : DEFAULT_MODE,
  }
}

/** The attributes to render onto <html> so the first paint is already correct. */
export function themeAttrs(theme: ThemeId, mode: Mode): { 'data-theme': string; class: string } {
  return { 'data-theme': theme, class: mode === 'dark' ? 'dark' : '' }
}
