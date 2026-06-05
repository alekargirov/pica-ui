<script lang="ts">
  import { cn } from '../utils.js'
  import type { HTMLLabelAttributes } from 'svelte/elements'

  interface Props extends HTMLLabelAttributes {
    class?: string
    children?: import('svelte').Snippet
  }
  let { class: className = '', children, ...rest }: Props = $props()
</script>

<label class={cn('text-[13px] font-medium leading-none', className)} {...rest}>
  {@render children?.()}
</label>
