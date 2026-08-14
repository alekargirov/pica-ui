// themes.bundle.css is a second copy of every theme block, for apps that consume
// pica-ui as plain CSS with no Tailwind (tickets-srv reads it off disk and
// inlines it). Two hand-maintained copies of the same values drift, and only one
// of them gets fixed. Now it is derived — this test fails if it goes stale.
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { renderBundle } from '../scripts/build-bundle.mjs'

const ROOT = join(import.meta.dirname, '..')

describe('themes.bundle.css', () => {
  it('matches what the generator produces', () => {
    const onDisk = readFileSync(join(ROOT, 'src/themes.bundle.css'), 'utf8')
    expect(onDisk).toBe(renderBundle())
  })
})
