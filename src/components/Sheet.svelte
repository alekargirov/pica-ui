<script lang="ts">
  import type { Snippet } from 'svelte'
  import { fly, fade } from 'svelte/transition'
  import { onMount } from 'svelte'

  interface Props {
    open: boolean
    onclose: () => void
    title?: string
    maxWidth?: string
    actions?: Snippet
    children?: Snippet
  }
  let { open, onclose, title, maxWidth = 'max-w-2xl', actions, children }: Props = $props()

  function onKey(e: KeyboardEvent) {
    if (e.key === 'Escape' && open) onclose()
  }
  onMount(() => {
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })
</script>

{#if open}
  <div
    transition:fade={{ duration: 150 }}
    class="fixed inset-0 bg-background/60 backdrop-blur-sm z-40"
    onclick={onclose} role="button" tabindex="-1" aria-label="Close"
  ></div>
  <aside
    transition:fly={{ x: 400, duration: 220, opacity: 1 }}
    class="fixed right-0 top-0 bottom-0 w-full {maxWidth} bg-card border-l border-border shadow-2xl z-50 flex flex-col"
  >
    <div class="h-[60px] px-6 flex items-center justify-between border-b border-border shrink-0">
      <div class="text-[13px] font-semibold">{title ?? ''}</div>
      <div class="flex items-center gap-2">
        {#if actions}{@render actions()}{/if}
        <button
          onclick={onclose}
          class="text-muted-foreground hover:text-foreground h-[34px] w-[34px] pica-field flex items-center justify-center hover:bg-secondary transition-colors"
          aria-label="Close"
        >✕</button>
      </div>
    </div>
    <div class="flex-1 overflow-y-auto">{@render children?.()}</div>
  </aside>
{/if}
