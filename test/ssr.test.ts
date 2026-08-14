import { describe, it, expect } from 'vitest'
import { themeFromCookie, themeAttrs } from '../src/ssr.js'
import { modeFor, isLightOnly } from '../src/theme.js'

describe('themeFromCookie', () => {
  it('reads theme and mode from a cookie header', () => {
    expect(themeFromCookie('pica:theme=prose; pica:mode=light'))
      .toEqual({ theme: 'prose', mode: 'light' })
  })

  it('tolerates other cookies around it', () => {
    expect(themeFromCookie('session=abc; pica:theme=void; other=1; pica:mode=dark'))
      .toEqual({ theme: 'void', mode: 'dark' })
  })

  it('falls back to the defaults when the header is absent', () => {
    expect(themeFromCookie(null)).toEqual({ theme: 'graphite', mode: 'dark' })
    expect(themeFromCookie(undefined)).toEqual({ theme: 'graphite', mode: 'dark' })
    expect(themeFromCookie('')).toEqual({ theme: 'graphite', mode: 'dark' })
  })

  // The cookie is attacker-controlled and its value is rendered into an HTML
  // attribute. Anything not on the known list is not a theme.
  it('rejects an unknown theme rather than trusting the cookie', () => {
    expect(themeFromCookie('pica:theme=../evil').theme).toBe('graphite')
    expect(themeFromCookie('pica:theme="><script>').theme).toBe('graphite')
  })

  it('rejects an unknown mode', () => {
    expect(themeFromCookie('pica:mode=neon').mode).toBe('dark')
  })
})

describe('themeAttrs', () => {
  it('produces the html attributes', () => {
    expect(themeAttrs('graphite', 'light')).toEqual({ 'data-theme': 'graphite', class: '' })
    expect(themeAttrs('graphite', 'dark')).toEqual({ 'data-theme': 'graphite', class: 'dark' })
  })
})

// A light-only theme has no .dark block. Serving it with class="dark" leaves a
// light palette under dark-mode rules, and a mode toggle that does nothing.
describe('light-only themes', () => {
  it('never renders class="dark" for a theme with no dark variant', () => {
    expect(themeAttrs('prose', 'dark')).toEqual({ 'data-theme': 'prose', class: '' })
  })

  it('still honours dark for themes that have a dark block', () => {
    expect(themeAttrs('graphite', 'dark')).toEqual({ 'data-theme': 'graphite', class: 'dark' })
  })

  it('resolves the cookie the same way, so SSR and client agree', () => {
    const { theme, mode } = themeFromCookie('pica:theme=prose; pica:mode=dark')
    expect(theme).toBe('prose')
    expect(modeFor(theme, mode)).toBe('light')
  })
})
