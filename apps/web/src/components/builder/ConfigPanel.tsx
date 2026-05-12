import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Toggle } from '@/components/ui/Toggle'
import { Button } from '@/components/ui/Button'
import { useBuilderStore, type FieldType } from '@/stores/builder.store'

const FIELD_TYPES: { value: FieldType; label: string }[] = [
  { value: 'text', label: 'Text' },
  { value: 'email', label: 'Email' },
  { value: 'password', label: 'Password' },
  { value: 'number', label: 'Number' },
  { value: 'textarea', label: 'Textarea' },
  { value: 'select', label: 'Select' },
  { value: 'autocomplete', label: 'Autocomplete' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'date', label: 'Date' },
]

export function ConfigPanel() {
  const {
    formTitle,
    setFormTitle,
    fields,
    addField,
    removeField,
    showSubmitButton,
    setShowSubmitButton,
    showLabels,
    setShowLabels,
    showValidation,
    setShowValidation,
  } = useBuilderStore()

  const [newFieldName, setNewFieldName] = useState('')
  const [newFieldType, setNewFieldType] = useState<FieldType>('text')

  function handleAddField() {
    if (!newFieldName.trim()) return
    addField({
      name: newFieldName.toLowerCase().replace(/\s+/g, '_'),
      type: newFieldType,
      label: newFieldName,
      placeholder: `Enter ${newFieldName.toLowerCase()}...`,
      required: false,
    })
    setNewFieldName('')
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleAddField()
  }

  return (
    <div className="flex w-72 flex-shrink-0 flex-col border-r border-neutral-200 bg-white">
      <div className="border-b border-neutral-200 px-4 py-3">
        <h2 className="text-sm font-semibold text-neutral-900">Form settings</h2>
        <p className="mt-0.5 text-xs text-neutral-400">Configure fields and options</p>
      </div>

      <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-4">
        <Input
          id="form-title"
          label="Form title"
          value={formTitle}
          onChange={(e) => setFormTitle(e.target.value)}
          placeholder="e.g. User registration"
        />

        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-neutral-600">Fields</p>

          {fields.length === 0 && (
            <p className="text-xs text-neutral-400">No fields yet. Add one below.</p>
          )}

          <div className="flex flex-col gap-1.5">
            {fields.map((field) => (
              <div
                key={field.id}
                className="flex items-center justify-between rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2"
              >
                <div>
                  <p className="text-xs font-medium text-neutral-800">{field.label}</p>
                  <p className="text-[11px] text-neutral-400">{field.type}</p>
                </div>
                <button
                  onClick={() => removeField(field.id)}
                  className="rounded p-0.5 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-500"
                  aria-label={`Remove ${field.label}`}
                >
                  <X size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-neutral-600">Add field</p>
          <Input
            placeholder="Field name..."
            value={newFieldName}
            onChange={(e) => setNewFieldName(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Select
            options={FIELD_TYPES}
            value={newFieldType}
            onChange={(e) => setNewFieldType(e.target.value as FieldType)}
          />
          <Button variant="secondary" size="sm" onClick={handleAddField} className="w-full">
            <Plus size={13} />
            Add field
          </Button>
        </div>

        <div className="flex flex-col gap-1 border-t border-neutral-100 pt-4">
          <p className="mb-2 text-xs font-medium text-neutral-600">Options</p>
          <Toggle label="Submit button" checked={showSubmitButton} onChange={setShowSubmitButton} />
          <Toggle label="Show labels" checked={showLabels} onChange={setShowLabels} />
          <Toggle label="Required validation" checked={showValidation} onChange={setShowValidation} />
        </div>
      </div>
    </div>
  )
}
