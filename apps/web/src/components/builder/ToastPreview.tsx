import { useState, useEffect, useRef } from 'react'
import { Info, CheckCircle, AlertTriangle, AlertCircle, Bell, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useBuilderStore, type ToastVariant, type ToastPosition } from '@/stores/builder.store'

const ICONS: Record<ToastVariant, React.ReactNode> = {
  default: <Bell size={15} />,
  info: <Info size={15} />,
  success: <CheckCircle size={15} />,
  warning: <AlertTriangle size={15} />,
  danger: <AlertCircle size={15} />,
}

const VARIANT_STYLES: Record<ToastVariant, { container: string; icon: string; progress: string; action: string }> = {
  default: {
    container: 'bg-neutral-900 border-neutral-800 text-white',
    icon: 'text-neutral-400',
    progress: 'bg-neutral-500',
    action: 'text-neutral-300 hover:text-white',
  },
  info: {
    container: 'bg-white border-neutral-200 text-neutral-900',
    icon: 'text-blue-500',
    progress: 'bg-blue-500',
    action: 'text-blue-600 hover:text-blue-800',
  },
  success: {
    container: 'bg-white border-neutral-200 text-neutral-900',
    icon: 'text-green-500',
    progress: 'bg-green-500',
    action: 'text-green-600 hover:text-green-800',
  },
  warning: {
    container: 'bg-white border-neutral-200 text-neutral-900',
    icon: 'text-amber-500',
    progress: 'bg-amber-500',
    action: 'text-amber-600 hover:text-amber-800',
  },
  danger: {
    container: 'bg-white border-neutral-200 text-neutral-900',
    icon: 'text-red-500',
    progress: 'bg-red-500',
    action: 'text-red-600 hover:text-red-800',
  },
}

const POSITION_CLASSES: Record<ToastPosition, string> = {
  'top-left': 'top-3 left-3 items-start',
  'top-center': 'top-3 left-1/2 -translate-x-1/2 items-center',
  'top-right': 'top-3 right-3 items-end',
  'bottom-left': 'bottom-3 left-3 items-start',
  'bottom-center': 'bottom-3 left-1/2 -translate-x-1/2 items-center',
  'bottom-right': 'bottom-3 right-3 items-end',
}

// Mini position grid indicator
function PositionDot({ position }: { position: ToastPosition }) {
  const dots: ToastPosition[] = [
    'top-left', 'top-center', 'top-right',
    'bottom-left', 'bottom-center', 'bottom-right',
  ]
  return (
    <div className="grid grid-cols-3 gap-1">
      {dots.map((d) => (
        <div
          key={d}
          className={cn(
            'h-1.5 w-1.5 rounded-full',
            d === position ? 'bg-brand-600' : 'bg-neutral-300'
          )}
        />
      ))}
    </div>
  )
}

export function ToastPreview() {
  const { toastConfig } = useBuilderStore()
  const { variant, position, title, message, showIcon, autoDismiss, duration, showProgress, showAction, actionLabel, showCloseButton } = toastConfig

  const [visible, setVisible] = useState(true)
  const [progress, setProgress] = useState(100)
  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null)
  const dismissTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const styles = VARIANT_STYLES[variant]

  // Reset and restart when config changes
  useEffect(() => {
    setVisible(true)
    setProgress(100)

    if (progressInterval.current) clearInterval(progressInterval.current)
    if (dismissTimeout.current) clearTimeout(dismissTimeout.current)

    if (autoDismiss && showProgress) {
      const steps = 100
      const interval = duration / steps
      progressInterval.current = setInterval(() => {
        setProgress((p) => {
          if (p <= 0) {
            clearInterval(progressInterval.current!)
            return 0
          }
          return p - 1
        })
      }, interval)
    }

    if (autoDismiss) {
      dismissTimeout.current = setTimeout(() => setVisible(false), duration)
    }

    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current)
      if (dismissTimeout.current) clearTimeout(dismissTimeout.current)
    }
  }, [toastConfig])

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-neutral-100">
      <div className="flex h-10 flex-shrink-0 items-center justify-between border-b border-neutral-200 bg-white px-4">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
          <span className="text-xs font-medium text-neutral-500">Live preview</span>
          <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-medium text-brand-600 capitalize">
            {variant} · {position}
          </span>
        </div>
        <PositionDot position={position} />
      </div>

      {/* Preview area */}
      <div className="relative flex-1 overflow-hidden">
        {/* Simulated page content */}
        <div className="flex h-full flex-col items-center justify-center gap-3 p-8 opacity-30">
          <div className="h-5 w-48 rounded bg-neutral-300" />
          <div className="h-3 w-64 rounded bg-neutral-300" />
          <div className="h-3 w-52 rounded bg-neutral-300" />
          <div className="mt-2 flex gap-2">
            <div className="h-8 w-24 rounded-md bg-neutral-300" />
            <div className="h-8 w-24 rounded-md bg-neutral-400" />
          </div>
        </div>

        {/* Toast */}
        <div className={cn('absolute flex flex-col', POSITION_CLASSES[position])}>
          {visible ? (
            <div
              className={cn(
                'w-72 overflow-hidden rounded-lg border shadow-lg',
                styles.container
              )}
            >
              <div className="flex items-start gap-3 px-4 py-3">
                {showIcon && (
                  <span className={cn('mt-0.5 flex-shrink-0', styles.icon)}>
                    {ICONS[variant]}
                  </span>
                )}
                <div className="flex-1 min-w-0">
                  {title && (
                    <p className="text-sm font-semibold leading-tight">{title}</p>
                  )}
                  {message && (
                    <p className={cn('text-xs', title ? 'mt-0.5 opacity-80' : '', variant === 'default' ? 'text-neutral-300' : 'text-neutral-600')}>
                      {message}
                    </p>
                  )}
                  {showAction && (
                    <button className={cn('mt-1.5 text-xs font-medium underline', styles.action)}>
                      {actionLabel}
                    </button>
                  )}
                </div>
                {showCloseButton && (
                  <button
                    onClick={() => setVisible(false)}
                    className={cn('flex-shrink-0 rounded p-0.5 opacity-60 hover:opacity-100', variant === 'default' ? 'text-neutral-400' : 'text-neutral-400')}
                  >
                    <X size={13} />
                  </button>
                )}
              </div>

              {/* Progress bar */}
              {autoDismiss && showProgress && (
                <div className="h-0.5 w-full bg-black/10">
                  <div
                    className={cn('h-full transition-none', styles.progress)}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-neutral-300 bg-white/80 px-4 py-3">
              <p className="text-xs text-neutral-400">Toast dismissed</p>
              <button
                onClick={() => {
                  setVisible(true)
                  setProgress(100)
                }}
                className="text-xs font-medium text-brand-600 underline"
              >
                Show again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
