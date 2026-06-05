<script lang="ts">
  import { cn } from '../utils.js'
  import type { HTMLAttributes } from 'svelte/elements'

  interface Props extends HTMLAttributes<HTMLDivElement> {
    class?: string
    children?: import('svelte').Snippet
  }
  let { class: className = '', children, ...rest }: Props = $props()
</script>

<div class={cn('rounded-[10px] border border-border bg-card text-card-foreground shadow-sm', className)} {...rest}>
  {@render children?.()}
</div>
