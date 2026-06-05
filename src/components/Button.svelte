<script lang="ts" module>
  export type Variant = 'default' | 'secondary' | 'ghost' | 'outline' | 'destructive' | 'link'
  export type Size = 'sm' | 'md' | 'lg' | 'icon'
</script>

<script lang="ts">
  import { cn } from '../utils.js'
  import type { HTMLButtonAttributes, HTMLAnchorAttributes } from 'svelte/elements'

  type Props =
    | (HTMLButtonAttributes & { href?: undefined; variant?: Variant; size?: Size; class?: string; children?: import('svelte').Snippet })
    | (HTMLAnchorAttributes & { href: string; variant?: Variant; size?: Size; class?: string; children?: import('svelte').Snippet })

  let { variant = 'default', size = 'md', class: className = '', href, children, ...rest }: Props = $props()

  const variants: Record<Variant, string> = {
    default: 'bg-primary text-primary-foreground hover:brightness-110 shadow-sm active:translate-y-px active:scale-[0.99]',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    ghost: 'hover:bg-secondary hover:text-foreground text-muted-foreground',
    outline: 'border border-border bg-transparent hover:bg-secondary hover:text-foreground text-foreground',
    destructive: 'bg-destructive text-destructive-foreground hover:brightness-110 shadow-sm',
    link: 'text-primary underline-offset-4 hover:underline',
  }
  const sizes: Record<Size, string> = {
    sm: 'h-8 px-3 text-xs gap-1.5',
    md: 'h-[38px] px-4 text-[13px] gap-2',
    lg: 'h-11 px-6 text-sm gap-2',
    icon: 'h-[34px] w-[34px]',
  }
  let classes = $derived(cn(
    'inline-flex items-center justify-center rounded-[6px] font-semibold transition-[background-color,filter,transform] duration-150 disabled:pointer-events-none disabled:opacity-50',
    variants[variant], sizes[size], className,
  ))
</script>

{#if href}
  <a {href} class={classes} {...rest as HTMLAnchorAttributes}>{@render children?.()}</a>
{:else}
  <button class={classes} type={(rest as HTMLButtonAttributes).type ?? 'button'} {...rest as HTMLButtonAttributes}>
    {@render children?.()}
  </button>
{/if}
