import { Input } from '@/components/ui/Input'
import { Toggle } from '@/components/ui/Toggle'
import { useBuilderStore, type AlertVariant, type AlertStyle } from '@/stores/builder.store'

const VARIANTS: { value: AlertVariant; label: string; emoji: string }[] = [
  { value: 'info', label: 'Info', emoji: 'ℹ️' },
  { value: 'success', label: 'Success', emoji: '✅' },
  { value: 'warning', label: 'Warning', emoji: '⚠️' },
  { value: 'danger', label: 'Danger', emoji: '🚨' },
]

const STYLES: { value: AlertStyle; label: string; description: string }[] = [
  { value: 'soft', label: 'Soft', description: 'Tinted background' },
  { value: 'outlined', label: 'Outlined', description: 'Border only' },
  { value: 'filled', label: 'Filled', description: 'Solid background' },
]

export function AlertConfigPanel() {
  const { alertConfig, setAlertConfig } = useBuilderStore()

  return (
    <div className="flex w-72 flex-shrink-0 flex-col border-r border-neutral-200 bg-white">
      <div className="border-b border-neutral-200 px-4 py-3">
        <h2 className="text-sm font-semibold text-neutral-900">Alert settings</h2>
        <p className="mt-0.5 text-xs text-neutral-400">Configure variant, style and content</p>
      </div>

      <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-4">

        {/* Variant */}
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-neutral-600">Variant</p>
          <div className="grid grid-cols-2 gap-1.5">
            {VARIANTS.map((v) => (
              <button
                key={v.value}
                onClick={() => setAlertConfig({ variant: v.value })}
                className={`flex items-center gap-2 rounded-md border px-3 py-2 text-left transition-colors ${
                  alertConfig.variant === v.value
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

        {/* Style */}
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-neutral-600">Style</p>
          <div className="flex flex-col gap-1.5">
            {STYLES.map((s) => (
              <button
                key={s.value}
                onClick={() => setAlertConfig({ style: s.value })}
                className={`flex items-center justify-between rounded-md border px-3 py-2 text-left transition-colors ${
                  alertConfig.style === s.value
                    ? 'border-brand-300 bg-brand-50 text-brand-700'
                    : 'border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50'
                }`}
              >
                <span className="text-xs font-medium">{s.label}</span>
                <span className="text-[10px] text-neutral-400">{s.description}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-3 border-t border-neutral-100 pt-4">
          <p className="text-xs font-medium text-neutral-600">Content</p>
          <Input
            label="Title"
            value={alertConfig.title}
            onChange={(e) => setAlertConfig({ title: e.target.value })}
            placeholder="e.g. Heads up!"
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-neutral-600">Message</label>
            <textarea
              value={alertConfig.message}
              onChange={(e) => setAlertConfig({ message: e.target.value })}
              rows={3}
              className="w-full resize-none rounded-md border border-neutral-200 bg-white px-2.5 py-2 text-sm text-neutral-900 focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
            />
          </div>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-1 border-t border-neutral-100 pt-4">
          <p className="mb-2 text-xs font-medium text-neutral-600">Options</p>
          <Toggle
            label="Show icon"
            checked={alertConfig.showIcon}
            onChange={(v) => setAlertConfig({ showIcon: v })}
          />
          <Toggle
            label="Dismissible"
            checked={alertConfig.dismissible}
            onChange={(v) => setAlertConfig({ dismissible: v })}
          />
          <Toggle
            label="Show action"
            checked={alertConfig.showAction}
            onChange={(v) => setAlertConfig({ showAction: v })}
          />
          {alertConfig.showAction && (
            <div className="pl-2 pt-1">
              <Input
                label="Action label"
                value={alertConfig.actionLabel}
                onChange={(e) => setAlertConfig({ actionLabel: e.target.value })}
                placeholder="e.g. Learn more"
              />
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
