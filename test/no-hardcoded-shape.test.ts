// Every component used to hard-code a radius literal — and those literals were
// exactly graphite's token values, because the components were built against
// graphite and the tokens were added afterwards without rewiring. The result:
// void declared 0px corners and drew 10px, petal declared 20px and drew 10px.
// Five of six themes never rendered the shape they asked for.
//
// A literal here is not a style choice, it is a theme silently losing an
// argument with a component.
import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const DIR = join(import.meta.dirname, '../src/components')

describe('components do not hard-code shape', () => {
  it('uses theme radius tokens, never a rounded-[Npx] literal', () => {
    const offenders: string[] = []
    for (const file of readdirSync(DIR).filter((f) => f.endsWith('.svelte'))) {
      const src = readFileSync(join(DIR, file), 'utf8')
      src.split('\n').forEach((line, i) => {
        if (/rounded-\[\d+px\]/.test(line)) offenders.push(`${file}:${i + 1}`)
      })
    }
    expect(offenders).toEqual([])
  })
})
