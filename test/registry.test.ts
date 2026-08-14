import { describe, it, expect } from 'vitest'
import { readRegistry } from './helpers/registry.js'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const SWITCHER_TS = join(import.meta.dirname, '../src/theme.ts')
const SWITCHER_JS = join(import.meta.dirname, '../src/switcher.js')

describe('theme registry', () => {
  it('lists the same themes in all six registration points', () => {
    const r = readRegistry()
    const expected = [...r.themes].sort()
    expect(expected.length).toBeGreaterThan(0)
    for (const [source, ids] of Object.entries(r)) {
      expect([...ids].sort(), `${source} disagrees`).toEqual(expected)
    }
  })
})

// theme.ts and switcher.js each keep their own copy of the theme list. The ids
// are covered above; lightOnly is a second thing they can disagree about, and a
// disagreement means the vanilla switcher renders a live toggle that the Svelte
// one disables.
describe('lightOnly flags', () => {
  it('agree between theme.ts and switcher.js', () => {
    const ts = [...readFileSync(SWITCHER_TS, 'utf8').matchAll(/id:\s*'([a-z]+)'[^}]*?lightOnly:\s*true/g)].map((m) => m[1])
    const js = [...readFileSync(SWITCHER_JS, 'utf8').matchAll(/\[\s*'([a-z]+)',\s*'[^']*',\s*'[^']*',\s*true\s*\]/g)].map((m) => m[1])
    expect(js.sort()).toEqual(ts.sort())
  })
})
