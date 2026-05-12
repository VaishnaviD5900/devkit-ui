import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/cn'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'secondary', size = 'md', className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-1.5 rounded-md border font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 disabled:pointer-events-none disabled:opacity-50',
          {
            'bg-brand-600 border-brand-600 text-white hover:bg-brand-800':
              variant === 'primary',
            'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50':
              variant === 'secondary',
            'bg-transparent border-transparent text-neutral-600 hover:bg-neutral-100':
              variant === 'ghost',
          },
          {
            'h-7 px-2.5 text-xs': size === 'sm',
            'h-8 px-3 text-sm': size === 'md',
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
