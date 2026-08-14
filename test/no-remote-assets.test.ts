// The fleet must render on a box with no egress, and a self-hosted design system
// should not tell every visitor's browser to call Google. notes-srv-v2 already
// made this call and vendored its faces; pica-ui was still importing six
// families from fonts.googleapis.com on every page load.
import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const SRC = join(import.meta.dirname, '../src')

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)],
  )
}

describe('no remote assets', () => {
  it('never fetches fonts from a third party', () => {
    const offenders = walk(SRC)
      .filter((f) => /\.(css|svelte|ts|js)$/.test(f))
      .filter((f) => readFileSync(f, 'utf8').includes('fonts.googleapis.com'))
      .map((f) => f.replace(SRC, 'src'))
    expect(offenders).toEqual([])
  })
})
