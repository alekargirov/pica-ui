<script lang="ts">
  import { onMount } from 'svelte'
  import { Palette, Check, Sun, Moon, ChevronDown } from '@lucide/svelte'
  import { THEMES, getTheme, getMode, applyTheme, isLightOnly, type ThemeId, type Mode } from '../theme.js'

  interface Props {
    /** Render compact (icon only) — useful in tight sidebars. */
    compact?: boolean
    /** Which way the menu opens. 'up' suits a bottom sidebar; 'down' a top nav. */
    placement?: 'up' | 'down'
    class?: string
  }
  let { compact = false, placement = 'up', class: className = '' }: Props = $props()

  let theme = $state<ThemeId>('graphite')
  let mode = $state<Mode>('dark')
  let open = $state(false)
  let root = $state<HTMLDivElement | null>(null)

  onMount(() => {
    theme = getTheme()
    mode = getMode()
    applyTheme(theme, mode)
    const onDoc = (e: MouseEvent) => {
      if (root && !root.contains(e.target as Node)) open = false
    }
    document.addEventListener('click', onDoc)
    return () => document.removeEventListener('click', onDoc)
  })

  function pickTheme(id: ThemeId) {
    theme = id
    applyTheme(theme, mode)
    open = false
  }
  function toggleMode() {
    mode = mode === 'dark' ? 'light' : 'dark'
    applyTheme(theme, mode)
  }

  const currentLabel = $derived(THEMES.find((t) => t.id === theme)?.label ?? 'Theme')
  // A light-only theme cannot honour dark mode, so the toggle is disabled
  // rather than left looking functional and doing nothing.
  const modeLocked = $derived(isLightOnly(theme))
</script>

<div class="relative {className}" bind:this={root}>
  <div class="flex items-center gap-1">
    <button
      type="button"
      onclick={() => (open = !open)}
      class="flex items-center gap-2 pica-field px-2.5 py-1.5 text-[13px] font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
      aria-haspopup="listbox"
      aria-expanded={open}
    >
      <Palette class="h-4 w-4 shrink-0" />
      {#if !compact}<span>{currentLabel}</span>{/if}
      <ChevronDown class="h-3.5 w-3.5 opacity-60" />
    </button>
    <button
      type="button"
      onclick={toggleMode}
      disabled={modeLocked}
      title={modeLocked ? 'This theme is light only' : undefined}
      class="flex items-center justify-center h-[30px] w-[30px] pica-field text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
      aria-label={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {#if mode === 'dark'}<Sun class="h-4 w-4" />{:else}<Moon class="h-4 w-4" />{/if}
    </button>
  </div>

  {#if open}
    <ul
      class="absolute z-50 left-0 min-w-[160px] pica-menu border border-border bg-popover p-1 shadow-lg {placement === 'up' ? 'bottom-full mb-2' : 'top-full mt-2'}"
      role="listbox"
    >
      {#each THEMES as t (t.id)}
        <li>
          <button
            type="button"
            onclick={() => pickTheme(t.id)}
            class="w-full flex items-center justify-between gap-2 pica-menu-item px-2.5 py-1.5 text-[13px] text-left transition-colors
                   {theme === t.id ? 'bg-secondary text-foreground font-medium' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}"
            role="option"
            aria-selected={theme === t.id}
          >
            <span class="flex items-center gap-2">
              <span class="h-3.5 w-3.5 rounded-full border border-border" data-swatch={t.id}></span>
              {t.label}
            </span>
            {#if theme === t.id}<Check class="h-3.5 w-3.5 text-primary" />{/if}
          </button>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  /* Live preview swatches — primary colour of each theme (dark-mode values) */
  [data-swatch='graphite'] { background: hsl(43 96% 56%); }
  [data-swatch='hearth']   { background: hsl(17 78% 62%); }
  [data-swatch='signal']   { background: hsl(182 72% 48%); }
  [data-swatch='forge']    { background: hsl(22 96% 58%); }
  [data-swatch='petal']    { background: hsl(340 62% 66%); }
  [data-swatch='void']     { background: hsl(265 100% 68%); }
  /* prose is light-only, so its swatch is the light palette's vermillion */
  [data-swatch='prose']    { background: hsl(6 88% 45%); }
</style>
