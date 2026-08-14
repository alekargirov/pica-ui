# pica-ui

The fleet design system — themes, tokens and Svelte components shared across
pica apps. Consumed as a git dependency, no registry:

```json
"pica-ui": "github:alekargirov/pica-ui#v0.2.0"
```

**Always pin a tag.** An unpinned dependency resolves to whatever the default
branch happens to be at install time.

## How a theme works

Two layers, and one rule.

- **Raw tokens** — literal values, set per theme: `--background`, `--primary`,
  `--radius-md-t`, `--font-sans-t`.
- **Semantic layer** — `base.css`'s `@theme inline` block maps Tailwind
  utilities onto those tokens, so `bg-background` resolves through the active
  theme.

The rule: **components use the semantic layer, themes redefine the raw tokens.**
Flip `<html data-theme="x">` and the whole app reskins live, no rebuild. A
component that hard-codes a value opts itself out of theming — see
`test/no-hardcoded-shape.test.ts`, which exists because every component used to
do exactly that.

### What a theme may say

Colour (19 tokens), shape (`--radius-lg-t` / `-md-t` / `-sm-t`), type
(`--font-sans-t`, `--font-mono-t`, and optionally `--font-display-t` for a third
display role), `--shadow-flat-t`, and **character**:

| token | default | meaning |
|---|---|---|
| `--btn-case-t` | `none` | `uppercase` for a system-voice look |
| `--btn-tracking-t` | `normal` | letter-spacing on buttons |
| `--btn-weight-t` | `600` | button font-weight |
| `--btn-border-t` | `0px` | button border-width |

Character tokens are optional — `base.css` defaults every one, so a theme that
ignores them looks exactly as it did before they existed.

Also set `color-scheme` per theme. It is what makes native `<select>` popups,
scrollbars and focus rings follow the theme instead of the OS.

### Shape classes

Components name what they *are*; the theme decides what that looks like:

`.pica-btn` · `.pica-card` · `.pica-field` · `.pica-menu` · `.pica-menu-item`

## Themes

`graphite` (default) · `hearth` · `signal` · `forge` · `petal` · `void` ·
`prose`

`prose` is notes' ink-on-paper look and is **light only** — it has no `.dark`
block, so an app using it should default to light mode. `DEFAULT_MODE` is
`dark`, so a first-time visitor on prose would otherwise get `class="dark"` with
a light palette and a mode toggle that appears to do nothing.

## Adding a theme — six places

There is no single registry. A new theme must be added to **all** of these, or
it will half-exist:

1. `src/themes/<name>.css` — the block itself
2. `src/all.css` — the `@import`
3. `src/themes.bundle.css` — **generated**, run `bun run build:bundle`
4. `src/theme.ts` — the `THEMES` array
5. `src/switcher.js` — its own `THEMES` array, with a swatch colour
6. `src/components/ThemeSwitcher.svelte` — the `<style>` swatch rules

`bun run test` fails if any of them disagree.

## Two consumption paths

**Bundled (Tailwind).** Import `pica-ui/base` plus the themes you want, or
`pica-ui/all`. Use the Svelte components.

**Non-bundled (plain CSS).** Import `pica-ui/themes.bundle.css` and
`pica-ui/switcher.js`. Note the bundle's `@import './fonts/fonts.css'` is
relative **to the file** — an app that reads the bundle off disk and inlines it
as a string must also serve `src/fonts/`, or every face 404s and the themes fall
back to system fonts.

**SSR.** Import `themeFromCookie` / `themeAttrs` from `pica-ui/ssr` and render
`data-theme` into the HTML server-side. The client half reads `localStorage`,
which does not exist until hydration — relying on it flashes the wrong palette
on every load.

## Fonts

Self-hosted, no third-party requests: the fleet must render on a box with no
egress. `src/fonts/fonts.css` is **generated** — `bun run build:fonts`. Only
weights 400/500/600/700, woff2 only. Declaring all nine families costs nothing;
a browser downloads only the family the active theme names.

## Scripts

```
bun run test           # contract tests — registry, tokens, fonts, shape, bundle
bun run build:bundle   # regenerate src/themes.bundle.css
bun run build:fonts    # regenerate src/fonts/fonts.css and vendor the woff2
```
