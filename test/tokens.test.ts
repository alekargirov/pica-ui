// A theme's contract: what it is allowed to say. Colour and radius were always
// in it; display type, the flat shadow and button character were not, which is
// why the notes look could not be expressed as a theme without forking a
// component. These tests pin the contract so a new theme cannot half-fill it.
import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const SRC = join(import.meta.dirname, '../src')

const REQUIRED = [
  '--background', '--foreground', '--card', '--card-foreground',
  '--popover', '--popover-foreground', '--primary', '--primary-foreground',
  '--secondary', '--secondary-foreground', '--muted', '--muted-foreground',
  '--accent', '--accent-foreground', '--destructive', '--destructive-foreground',
  '--border', '--input', '--ring',
  '--radius-lg-t', '--radius-md-t', '--radius-sm-t',
  '--font-sans-t', '--font-mono-t',
]

// Optional in a theme, but base.css must default every one of them — that is
// what keeps the widening additive for the six themes that predate it.
const CHARACTER_DEFAULTS = [
  '--btn-case-t', '--btn-tracking-t', '--btn-weight-t', '--btn-border-t', '--btn-font-t',
  '--btn-size-t', '--btn-pad-t', '--btn-border-color-t',
  '--btn-hover-bg-t', '--btn-hover-fg-t', '--btn-shadow-t', '--btn-press-t',
]

describe('token contract', () => {
  it('every theme defines the full required set in its light block', () => {
    for (const file of readdirSync(join(SRC, 'themes')).filter((f) => f.endsWith('.css'))) {
      const css = readFileSync(join(SRC, 'themes', file), 'utf8')
      const light = css.split(/\[data-theme="[a-z]+"\]\.dark/)[0]
      for (const token of REQUIRED) {
        expect(light, `${file} is missing ${token}`).toContain(`${token}:`)
      }
    }
  })

  it('defaults.css gives every character token a default', () => {
    const defaults = readFileSync(join(SRC, 'defaults.css'), 'utf8')
    for (const token of CHARACTER_DEFAULTS) {
      expect(defaults, `defaults.css is missing a default for ${token}`).toContain(`${token}:`)
    }
  })

  it('base.css pulls those defaults in, so the Tailwind path gets them too', () => {
    const base = readFileSync(join(SRC, 'base.css'), 'utf8')
    expect(base).toContain("@import './defaults.css'")
  })

  it('exposes display font and flat shadow through the theme layer', () => {
    const base = readFileSync(join(SRC, 'base.css'), 'utf8')
    expect(base).toContain('--font-display:')
    expect(base).toContain('--shadow-flat:')
  })

  it('defines a shape class for every radius token', () => {
    const base = readFileSync(join(SRC, 'base.css'), 'utf8')
    for (const cls of ['.pica-btn', '.pica-card', '.pica-field', '.pica-menu', '.pica-menu-item']) {
      expect(base, `base.css is missing ${cls}`).toContain(cls)
    }
  })
})

// The plain-CSS path never loads base.css, so the bundle has to carry the
// defaults itself or `var(--btn-case-t)` resolves to nothing on every theme
// that does not set it — which is every theme except prose.
describe('themes.bundle.css is self-sufficient', () => {
  it('carries the character defaults for non-Tailwind apps', () => {
    const bundle = readFileSync(join(SRC, 'themes.bundle.css'), 'utf8')
    for (const token of CHARACTER_DEFAULTS) {
      expect(bundle, `bundle is missing a default for ${token}`).toContain(`${token}: `)
    }
  })
})
