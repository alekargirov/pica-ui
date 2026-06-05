<script lang="ts">
  import { cn } from '../utils.js'
  import type { HTMLInputAttributes } from 'svelte/elements'

  interface Props extends HTMLInputAttributes {
    class?: string
    value?: string | number | null | undefined
  }
  let { class: className = '', value = $bindable(), ...rest }: Props = $props()
</script>

<input
  bind:value
  class={cn(
    'flex h-[38px] w-full rounded-[6px] border border-input bg-card px-3 py-1 text-[13px] transition-[border-color,box-shadow] duration-150 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50',
    className,
  )}
  {...rest}
/>
