import { Plus, X } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Toggle } from '@/components/ui/Toggle'
import { Button } from '@/components/ui/Button'
import { useBuilderStore, type ModalType, type ModalSize, type ModalAlertVariant } from '@/stores/builder.store'

const MODAL_TYPES: { value: ModalType; label: string; description: string }[] = [
  { value: 'default', label: 'Default', description: 'General purpose modal' },
  { value: 'confirmation', label: 'Confirmation', description: 'Confirm an action' },
  { value: 'form', label: 'Form', description: 'Modal with a form' },
  { value: 'alert', label: 'Alert', description: 'Status / info message' },
]

const SIZE_OPTIONS: { value: ModalSize; label: string }[] = [
  { value: 'sm', label: 'Small (400px)' },
  { value: 'md', label: 'Medium (520px)' },
  { value: 'lg', label: 'Large (720px)' },
  { value: 'full', label: 'Full screen' },
]

const ALERT_VARIANTS: { value: ModalAlertVariant; label: string }[] = [
  { value: 'info', label: 'Info' },
  { value: 'success', label: 'Success' },
  { value: 'warning', label: 'Warning' },
  { value: 'danger', label: 'Danger' },
]

const ACTION_VARIANTS = [
  { value: 'primary', label: 'Primary' },
  { value: 'secondary', label: 'Secondary' },
  { value: 'danger', label: 'Danger' },
  { value: 'ghost', label: 'Ghost' },
]

export function ModalConfigPanel() {
  const { modalConfig, setModalConfig, addModalAction, removeModalAction } = useBuilderStore()

  return (
    <div className="flex w-72 flex-shrink-0 flex-col border-r border-neutral-200 bg-white">
      <div className="border-b border-neutral-200 px-4 py-3">
        <h2 className="text-sm font-semibold text-neutral-900">Modal settings</h2>
        <p className="mt-0.5 text-xs text-neutral-400">Configure type, content and actions</p>
      </div>

      <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-4">

        {/* Modal type */}
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-neutral-600">Modal type</p>
          <div className="grid grid-cols-2 gap-1.5">
            {MODAL_TYPES.map((type) => (
              <button
                key={type.value}
                onClick={() => setModalConfig({ modalType: type.value })}
                className={`rounded-md border px-3 py-2 text-left transition-colors ${
                  modalConfig.modalType === type.value
                    ? 'border-brand-300 bg-brand-50 text-brand-700'
                    : 'border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50'
                }`}
              >
                <p className="text-xs font-medium">{type.label}</p>
                <p className="text-[10px] text-neutral-400">{type.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Alert variant */}
        {modalConfig.modalType === 'alert' && (
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-neutral-600">Alert variant</p>
            <div className="grid grid-cols-2 gap-1.5">
              {ALERT_VARIANTS.map((v) => (
                <button
                  key={v.value}
                  onClick={() => setModalConfig({ alertVariant: v.value })}
                  className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                    modalConfig.alertVariant === v.value
                      ? 'border-brand-300 bg-brand-50 text-brand-700'
                      : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-medium text-neutral-600">Content</p>
          <Input
            label="Title"
            value={modalConfig.title}
            onChange={(e) => setModalConfig({ title: e.target.value })}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-neutral-600">Description</label>
            <textarea
              value={modalConfig.description}
              onChange={(e) => setModalConfig({ description: e.target.value })}
              rows={3}
              className="w-full resize-none rounded-md border border-neutral-200 bg-white px-2.5 py-2 text-sm text-neutral-900 focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
            />
          </div>
        </div>

        {/* Size */}
        <Select
          label="Size"
          options={SIZE_OPTIONS}
          value={modalConfig.size}
          onChange={(e) => setModalConfig({ size: e.target.value as ModalSize })}
        />

        {/* Options */}
        <div className="flex flex-col gap-1 border-t border-neutral-100 pt-4">
          <p className="mb-2 text-xs font-medium text-neutral-600">Options</p>
          <Toggle
            label="Close button"
            checked={modalConfig.showCloseButton}
            onChange={(v) => setModalConfig({ showCloseButton: v })}
          />
          <Toggle
            label="Close on backdrop"
            checked={modalConfig.closeOnBackdrop}
            onChange={(v) => setModalConfig({ closeOnBackdrop: v })}
          />
          <Toggle
            label="Show footer"
            checked={modalConfig.showFooter}
            onChange={(v) => setModalConfig({ showFooter: v })}
          />
          {modalConfig.modalType === 'alert' && (
            <Toggle
              label="Show icon"
              checked={modalConfig.showIcon}
              onChange={(v) => setModalConfig({ showIcon: v })}
            />
          )}
        </div>

        {/* Actions */}
        {modalConfig.showFooter && (
          <div className="flex flex-col gap-2 border-t border-neutral-100 pt-4">
            <p className="text-xs font-medium text-neutral-600">Footer actions</p>
            {modalConfig.actions.map((action) => (
              <div
                key={action.id}
                className="flex items-center justify-between rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2"
              >
                <div>
                  <p className="text-xs font-medium text-neutral-800">{action.label}</p>
                  <p className="text-[11px] text-neutral-400">{action.variant}</p>
                </div>
                <button
                  onClick={() => removeModalAction(action.id)}
                  className="rounded p-0.5 text-neutral-400 hover:bg-red-50 hover:text-red-500"
                >
                  <X size={13} />
                </button>
              </div>
            ))}
            <Button
              variant="secondary"
              size="sm"
              className="w-full"
              onClick={() => addModalAction({ label: 'Action', variant: 'secondary' })}
            >
              <Plus size={13} /> Add action
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
