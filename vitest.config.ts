import { defineConfig } from 'vitest/config'

// jsdom only where a test needs a document: the client half of theme.ts has to
// be able to read what the server rendered onto <html>.
export default defineConfig({
  test: {
    environmentMatchGlobs: [['test/ssr.test.ts', 'jsdom']],
  },
})
