import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Toggle } from '@/components/ui/Toggle'
import { useBuilderStore, type ToastVariant, type ToastPosition } from '@/stores/builder.store'

const VARIANTS: { value: ToastVariant; label: string; emoji: string }[] = [
  { value: 'default', label: 'Default', emoji: '🔔' },
  { value: 'info', label: 'Info', emoji: 'ℹ️' },
  { value: 'success', label: 'Success', emoji: '✅' },
  { value: 'warning', label: 'Warning', emoji: '⚠️' },
  { value: 'danger', label: 'Danger', emoji: '🚨' },
]

const POSITIONS: { value: ToastPosition; label: string }[] = [
  { value: 'top-left', label: 'Top left' },
  { value: 'top-center', label: 'Top center' },
  { value: 'top-right', label: 'Top right' },
  { value: 'bottom-left', label: 'Bottom left' },
  { value: 'bottom-center', label: 'Bottom center' },
  { value: 'bottom-right', label: 'Bottom right' },
]

const DURATION_OPTIONS = [
  { value: '2000', label: '2 seconds' },
  { value: '3000', label: '3 seconds' },
  { value: '4000', label: '4 seconds' },
  { value: '5000', label: '5 seconds' },
  { value: '8000', label: '8 seconds' },
]

export function ToastConfigPanel() {
  const { toastConfig, setToastConfig } = useBuilderStore()

  return (
    <div className="flex w-72 flex-shrink-0 flex-col border-r border-neutral-200 bg-white">
      <div className="border-b border-neutral-200 px-4 py-3">
        <h2 className="text-sm font-semibold text-neutral-900">Toast settings</h2>
        <p className="mt-0.5 text-xs text-neutral-400">Configure position, variant and behavior</p>
      </div>

      <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-4">

        {/* Variant */}
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-neutral-600">Variant</p>
          <div className="grid grid-cols-2 gap-1.5">
            {VARIANTS.map((v) => (
              <button
                key={v.value}
                onClick={() => setToastConfig({ variant: v.value })}
                className={`flex items-center gap-2 rounded-md border px-3 py-2 text-left transition-colors ${
                  toastConfig.variant === v.value
                    ? 'border-brand-300 bg-brand-50 text-brand-700'
                    : 'border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50'
                }`}
              >
                <span>{v.emoji}</span>
                <span className="text-xs font-medium">{v.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Position */}
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-neutral-600">Position</p>
          {/* Visual position picker */}
          <div className="grid grid-cols-3 gap-1.5 rounded-lg border border-neutral-200 bg-neutral-50 p-3">
            {POSITIONS.map((p) => {
              const isSelected = toastConfig.position === p.value
              return (
                <button
                  key={p.value}
                  onClick={() => setToastConfig({ position: p.value })}
                  title={p.label}
                  className={`flex h-8 items-center justify-center rounded-md border text-[10px] font-medium transition-colors ${
                    isSelected
                      ? 'border-brand-400 bg-brand-600 text-white'
                      : 'border-neutral-200 bg-white text-neutral-500 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-600'
                  }`}
                >
                  {p.value.includes('left') ? '←' : p.value.includes('right') ? '→' : '↕'}
                  {p.value.includes('top') ? '↑' : '↓'}
                </button>
              )
            })}
          </div>
          <p className="text-[11px] text-neutral-400">
            Selected: <span className="font-medium text-neutral-600">{toastConfig.position}</span>
          </p>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-3 border-t border-neutral-100 pt-4">
          <p className="text-xs font-medium text-neutral-600">Content</p>
          <Input
            label="Title"
            value={toastConfig.title}
            onChange={(e) => setToastConfig({ title: e.target.value })}
            placeholder="e.g. Changes saved!"
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-neutral-600">Message</label>
            <textarea
              value={toastConfig.message}
              onChange={(e) => setToastConfig({ message: e.target.value })}
              rows={2}
              className="w-full resize-none rounded-md border border-neutral-200 bg-white px-2.5 py-2 text-sm text-neutral-900 focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
            />
          </div>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-1 border-t border-neutral-100 pt-4">
          <p className="mb-2 text-xs font-medium text-neutral-600">Options</p>
          <Toggle
            label="Show icon"
            checked={toastConfig.showIcon}
            onChange={(v) => setToastConfig({ showIcon: v })}
          />
          <Toggle
            label="Close button"
            checked={toastConfig.showCloseButton}
            onChange={(v) => setToastConfig({ showCloseButton: v })}
          />
          <Toggle
            label="Auto dismiss"
            checked={toastConfig.autoDismiss}
            onChange={(v) => setToastConfig({ autoDismiss: v })}
          />
          {toastConfig.autoDismiss && (
            <div className="pl-2 pt-1">
              <Select
                label="Duration"
                options={DURATION_OPTIONS}
                value={String(toastConfig.duration)}
                onChange={(e) => setToastConfig({ duration: Number(e.target.value) })}
              />
              <div className="mt-2">
                <Toggle
                  label="Progress bar"
                  checked={toastConfig.showProgress}
                  onChange={(v) => setToastConfig({ showProgress: v })}
                />
              </div>
            </div>
          )}
          <Toggle
            label="Action button"
            checked={toastConfig.showAction}
            onChange={(v) => setToastConfig({ showAction: v })}
          />
          {toastConfig.showAction && (
            <div className="pl-2 pt-1">
              <Input
                label="Action label"
                value={toastConfig.actionLabel}
                onChange={(e) => setToastConfig({ actionLabel: e.target.value })}
                placeholder="e.g. Undo"
              />
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
