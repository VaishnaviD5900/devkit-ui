import { useState } from 'react'
import { Info, CheckCircle, AlertTriangle, AlertCircle, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useBuilderStore, type AlertVariant, type AlertStyle } from '@/stores/builder.store'

const ICONS: Record<AlertVariant, React.ReactNode> = {
  info: <Info size={16} />,
  success: <CheckCircle size={16} />,
  warning: <AlertTriangle size={16} />,
  danger: <AlertCircle size={16} />,
}

type StyleMap = Record<AlertVariant, string>

const SOFT_STYLES: StyleMap = {
  info: 'bg-blue-50 border border-blue-100 text-blue-800',
  success: 'bg-green-50 border border-green-100 text-green-800',
  warning: 'bg-amber-50 border border-amber-100 text-amber-800',
  danger: 'bg-red-50 border border-red-100 text-red-800',
}

const OUTLINED_STYLES: StyleMap = {
  info: 'bg-white border border-blue-300 text-blue-800',
  success: 'bg-white border border-green-300 text-green-800',
  warning: 'bg-white border border-amber-300 text-amber-800',
  danger: 'bg-white border border-red-300 text-red-800',
}

const FILLED_STYLES: StyleMap = {
  info: 'bg-blue-600 border border-blue-600 text-white',
  success: 'bg-green-600 border border-green-600 text-white',
  warning: 'bg-amber-500 border border-amber-500 text-white',
  danger: 'bg-red-500 border border-red-500 text-white',
}

const ICON_STYLES: Record<AlertStyle, StyleMap> = {
  soft: {
    info: 'text-blue-500',
    success: 'text-green-500',
    warning: 'text-amber-500',
    danger: 'text-red-500',
  },
  outlined: {
    info: 'text-blue-500',
    success: 'text-green-500',
    warning: 'text-amber-500',
    danger: 'text-red-500',
  },
  filled: {
    info: 'text-white',
    success: 'text-white',
    warning: 'text-white',
    danger: 'text-white',
  },
}

const ACTION_STYLES: Record<AlertStyle, StyleMap> = {
  soft: {
    info: 'text-blue-700 underline hover:text-blue-900',
    success: 'text-green-700 underline hover:text-green-900',
    warning: 'text-amber-700 underline hover:text-amber-900',
    danger: 'text-red-700 underline hover:text-red-900',
  },
  outlined: {
    info: 'text-blue-700 underline hover:text-blue-900',
    success: 'text-green-700 underline hover:text-green-900',
    warning: 'text-amber-700 underline hover:text-amber-900',
    danger: 'text-red-700 underline hover:text-red-900',
  },
  filled: {
    info: 'text-white underline hover:opacity-80',
    success: 'text-white underline hover:opacity-80',
    warning: 'text-white underline hover:opacity-80',
    danger: 'text-white underline hover:opacity-80',
  },
}

function getContainerStyle(style: AlertStyle, variant: AlertVariant): string {
  if (style === 'soft') return SOFT_STYLES[variant]
  if (style === 'outlined') return OUTLINED_STYLES[variant]
  return FILLED_STYLES[variant]
}

export function AlertPreview() {
  const { alertConfig } = useBuilderStore()
  const { variant, style, title, message, showIcon, dismissible, showAction, actionLabel } = alertConfig
  const [dismissed, setDismissed] = useState(false)

  const containerStyle = getContainerStyle(style, variant)
  const iconStyle = ICON_STYLES[style][variant]
  const actionStyle = ACTION_STYLES[style][variant]

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-neutral-50">
      <div className="flex h-10 flex-shrink-0 items-center gap-2 border-b border-neutral-200 bg-white px-4">
        <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
        <span className="text-xs font-medium text-neutral-500">Live preview</span>
        <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-medium text-brand-600 capitalize">
          {variant} · {style}
        </span>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-6 overflow-y-auto p-8">

        {/* Main alert */}
        {dismissed ? (
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm text-neutral-400">Alert dismissed</p>
            <button
              onClick={() => setDismissed(false)}
              className="text-xs text-brand-600 underline hover:text-brand-800"
            >
              Show again
            </button>
          </div>
        ) : (
          <div className={cn('w-full max-w-lg rounded-lg px-4 py-3.5', containerStyle)}>
            <div className="flex items-start gap-3">
              {showIcon && (
                <span className={cn('mt-0.5 flex-shrink-0', iconStyle)}>
                  {ICONS[variant]}
                </span>
              )}
              <div className="flex-1 min-w-0">
                {title && (
                  <p className="text-sm font-semibold leading-tight">{title}</p>
                )}
                {message && (
                  <p className={cn('text-sm', title ? 'mt-1 opacity-90' : '')}>{message}</p>
                )}
                {showAction && (
                  <button className={cn('mt-2 text-xs font-medium', actionStyle)}>
                    {actionLabel} →
                  </button>
                )}
              </div>
              {dismissible && (
                <button
                  onClick={() => setDismissed(true)}
                  className={cn('flex-shrink-0 rounded p-0.5 opacity-60 transition-opacity hover:opacity-100', iconStyle)}
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* All variants preview strip */}
        <div className="w-full max-w-lg">
          <p className="mb-3 text-[11px] font-medium uppercase tracking-wide text-neutral-400">
            All variants — {style}
          </p>
          <div className="flex flex-col gap-2">
            {(['info', 'success', 'warning', 'danger'] as AlertVariant[]).map((v) => (
              <div
                key={v}
                onClick={() => setAlertConfig({ variant: v })}
                className={cn(
                  'flex cursor-pointer items-center gap-2.5 rounded-md px-3 py-2.5 transition-all',
                  getContainerStyle(style, v),
                  variant === v ? 'ring-2 ring-offset-1 ring-brand-400' : 'opacity-70 hover:opacity-100'
                )}
              >
                <span className={cn('flex-shrink-0', ICON_STYLES[style][v])}>
                  {ICONS[v]}
                </span>
                <span className="text-xs font-medium capitalize">{v}</span>
              </div>
            ))}
          </div>
          <p className="mt-2 text-[10px] text-neutral-400">Click a variant to select it</p>
        </div>

      </div>
    </div>
  )
}
