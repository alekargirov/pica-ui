<script lang="ts">
  import type { Snippet } from 'svelte'

  interface Props {
    title: string
    badge?: number | string
    actions?: Snippet
  }
  let { title, badge, actions }: Props = $props()
</script>

<header class="h-[60px] px-7 border-b border-border flex items-center justify-between shrink-0 bg-background">
  <div class="flex items-center gap-2.5">
    <h1 class="text-[17px] font-semibold tracking-tight">{title}</h1>
    {#if badge !== undefined}
      <span class="text-xs font-medium bg-secondary text-muted-foreground px-2 py-0.5 rounded-full tabular-nums">{badge}</span>
    {/if}
  </div>
  {#if actions}
    <div class="flex items-center gap-2">{@render actions()}</div>
  {/if}
</header>
