// Adding a theme to pica-ui touches SIX places. Nothing enforced that they
// agreed, so a theme could exist in the CSS and be invisible in the switcher —
// or appear in the switcher with no block behind it. This helper reads the id
// list out of each place so a test can assert they match.
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const SRC = join(import.meta.dirname, '../../src')
const read = (p: string) => readFileSync(join(SRC, p), 'utf8')
const all = (re: RegExp, s: string) => [...new Set([...s.matchAll(re)].map((m) => m[1]))]

export function readRegistry(): Record<string, string[]> {
  return {
    themes: readdirSync(join(SRC, 'themes'))
      .filter((f) => f.endsWith('.css'))
      .map((f) => f.replace(/\.css$/, '')),
    all: all(/@import\s+'\.\/themes\/([a-z]+)\.css'/g, read('all.css')),
    bundle: all(/\[data-theme="([a-z]+)"\]/g, read('themes.bundle.css')),
    themeTs: all(/id:\s*'([a-z]+)'/g, read('theme.ts')),
    switcher: all(/\[\s*'([a-z]+)',\s*'/g, read('switcher.js')),
    switcherComponent: all(/\[data-swatch='([a-z]+)'\]/g, read('components/ThemeSwitcher.svelte')),
  }
}
