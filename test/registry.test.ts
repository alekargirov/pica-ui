import { describe, it, expect } from 'vitest'
import { readRegistry } from './helpers/registry.js'

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
