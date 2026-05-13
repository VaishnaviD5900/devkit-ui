import { useState } from 'react'
import { X, AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useBuilderStore, type ModalAlertVariant } from '@/stores/builder.store'

const SIZE_CLASSES = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  full: 'max-w-full mx-4',
}

const ALERT_STYLES: Record<ModalAlertVariant, { icon: React.ReactNode; bg: string; iconColor: string; border: string }> = {
  info: {
    icon: <Info size={22} />,
    bg: 'bg-blue-50',
    iconColor: 'text-blue-500',
    border: 'border-blue-100',
  },
  success: {
    icon: <CheckCircle size={22} />,
    bg: 'bg-green-50',
    iconColor: 'text-green-500',
    border: 'border-green-100',
  },
  warning: {
    icon: <AlertTriangle size={22} />,
    bg: 'bg-amber-50',
    iconColor: 'text-amber-500',
    border: 'border-amber-100',
  },
  danger: {
    icon: <AlertCircle size={22} />,
    bg: 'bg-red-50',
    iconColor: 'text-red-500',
    border: 'border-red-100',
  },
}

function ActionButton({ label, variant }: { label: string; variant: string }) {
  const base = 'rounded-md px-4 py-2 text-xs font-medium transition-colors'
  if (variant === 'primary') return <button className={`${base} bg-brand-600 text-white hover:bg-brand-800`}>{label}</button>
  if (variant === 'danger') return <button className={`${base} bg-red-500 text-white hover:bg-red-600`}>{label}</button>
  if (variant === 'ghost') return <button className={`${base} text-neutral-600 hover:bg-neutral-100`}>{label}</button>
  return <button className={`${base} border border-neutral-200 text-neutral-700 hover:bg-neutral-50`}>{label}</button>
}

export function ModalPreview() {
  const { modalConfig } = useBuilderStore()
  const { modalType, title, description, size, showCloseButton, showFooter, actions, alertVariant, showIcon } = modalConfig
  const [open, setOpen] = useState(true)

  const alertStyle = ALERT_STYLES[alertVariant]

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-neutral-50">
      <div className="flex h-10 flex-shrink-0 items-center gap-2 border-b border-neutral-200 bg-white px-4">
        <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
        <span className="text-xs font-medium text-neutral-500">Live preview</span>
        <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-medium text-brand-600 capitalize">
          {modalType} modal
        </span>
      </div>

      <div className="relative flex flex-1 items-center justify-center overflow-hidden p-6">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-neutral-900/40 backdrop-blur-[1px]"
          onClick={() => modalConfig.closeOnBackdrop && setOpen(false)}
        />

        {/* Page content hint behind modal */}
        <div className="absolute inset-0 flex flex-col gap-3 p-8 opacity-20">
          <div className="h-4 w-48 rounded bg-neutral-300" />
          <div className="h-3 w-64 rounded bg-neutral-300" />
          <div className="h-3 w-56 rounded bg-neutral-300" />
        </div>

        {/* Modal */}
        {open ? (
          <div
            className={cn(
              'relative z-10 w-full rounded-lg border border-neutral-200 bg-white shadow-xl',
              SIZE_CLASSES[size]
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Alert type header */}
            {modalType === 'alert' && showIcon && (
              <div className={cn('flex items-center gap-3 rounded-t-lg border-b px-5 py-4', alertStyle.bg, alertStyle.border)}>
                <span className={alertStyle.iconColor}>{alertStyle.icon}</span>
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900">{title}</h3>
                  <p className="text-xs text-neutral-600">{description}</p>
                </div>
                {showCloseButton && (
                  <button
                    onClick={() => setOpen(false)}
                    className="ml-auto rounded p-1 text-neutral-400 hover:bg-black/5 hover:text-neutral-600"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            )}

            {/* Default / Confirmation / Custom header */}
            {modalType !== 'alert' && (
              <div className="flex items-start justify-between border-b border-neutral-100 px-5 py-4">
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900">{title}</h3>
                  {modalType === 'confirmation' && (
                    <p className="mt-0.5 text-xs text-neutral-500">This action cannot be undone.</p>
                  )}
                </div>
                {showCloseButton && (
                  <button
                    onClick={() => setOpen(false)}
                    className="rounded p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            )}

            {/* Body */}
            {(modalType !== 'alert' || !showIcon) && (
              <div className="px-5 py-4">
                {modalType === 'custom' ? (
                  <div className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-neutral-200 bg-neutral-50 py-8 text-center">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-neutral-400"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-neutral-600">Your content slot</p>
                      <p className="mt-0.5 text-[11px] text-neutral-400">
                        Pass any component as <code className="rounded bg-neutral-100 px-1 font-mono">children</code>
                      </p>
                    </div>
                    <div className="mt-1 rounded-md bg-neutral-100 px-3 py-1.5 font-mono text-[10px] text-neutral-500">
                      {'<Modal><YourComponent /></Modal>'}
                    </div>
                  </div>
                ) : modalType === 'confirmation' ? (
                  <p className="text-sm text-neutral-600">{description}</p>
                ) : modalType === 'alert' ? (
                  <p className="text-sm text-neutral-600">{description}</p>
                ) : (
                  <p className="text-sm text-neutral-600">{description}</p>
                )}
              </div>
            )}

            {/* Footer */}
            {showFooter && actions.length > 0 && (
              <div className="flex items-center justify-end gap-2 rounded-b-lg border-t border-neutral-100 bg-neutral-50 px-5 py-3">
                {actions.map((a) => (
                  <ActionButton key={a.id} label={a.label} variant={a.variant} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="relative z-10 flex flex-col items-center gap-3">
            <p className="text-sm text-neutral-500">Modal closed</p>
            <button
              onClick={() => setOpen(true)}
              className="rounded-md bg-brand-600 px-4 py-2 text-xs font-medium text-white hover:bg-brand-800"
            >
              Reopen modal
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
