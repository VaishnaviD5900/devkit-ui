import { cn } from '@/lib/cn'

interface ToggleProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  className?: string
}

export function Toggle({ label, checked, onChange, className }: ToggleProps) {
  return (
    <label
      className={cn('flex cursor-pointer items-center justify-between gap-3', className)}
    >
      <span className="text-sm text-neutral-600">{label}</span>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative h-5 w-9 rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600',
          checked
            ? 'border-brand-600 bg-brand-600'
            : 'border-neutral-300 bg-neutral-100'
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform',
            checked ? 'left-[18px]' : 'left-0.5'
          )}
        />
      </button>
    </label>
  )
}
