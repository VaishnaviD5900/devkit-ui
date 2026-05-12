import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Toggle } from '@/components/ui/Toggle'
import { Button } from '@/components/ui/Button'
import { useBuilderStore, type ColumnType } from '@/stores/builder.store'

const COLUMN_TYPES: { value: ColumnType; label: string }[] = [
  { value: 'text', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'email', label: 'Email' },
  { value: 'date', label: 'Date' },
  { value: 'badge', label: 'Badge / Status' },
]

const ROWS_PER_PAGE_OPTIONS = [
  { value: '5', label: '5 rows' },
  { value: '10', label: '10 rows' },
  { value: '25', label: '25 rows' },
  { value: '50', label: '50 rows' },
]

export function TableConfigPanel() {
  const { tableConfig, setTableTitle, addColumn, removeColumn, setTableOption } =
    useBuilderStore()

  const [newColName, setNewColName] = useState('')
  const [newColType, setNewColType] = useState<ColumnType>('text')

  function handleAddColumn() {
    if (!newColName.trim()) return
    addColumn({
      name: newColName.toLowerCase().replace(/\s+/g, '_'),
      label: newColName,
      type: newColType,
      sortable: true,
    })
    setNewColName('')
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleAddColumn()
  }

  return (
    <div className="flex w-72 flex-shrink-0 flex-col border-r border-neutral-200 bg-white">
      <div className="border-b border-neutral-200 px-4 py-3">
        <h2 className="text-sm font-semibold text-neutral-900">Table settings</h2>
        <p className="mt-0.5 text-xs text-neutral-400">Configure columns and options</p>
      </div>

      <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-4">
        <Input
          id="table-title"
          label="Table title"
          value={tableConfig.title}
          onChange={(e) => setTableTitle(e.target.value)}
          placeholder="e.g. Users"
        />

        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-neutral-600">Columns</p>

          {tableConfig.columns.length === 0 && (
            <p className="text-xs text-neutral-400">No columns yet. Add one below.</p>
          )}

          <div className="flex flex-col gap-1.5">
            {tableConfig.columns.map((col) => (
              <div
                key={col.id}
                className="flex items-center justify-between rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2"
              >
                <div>
                  <p className="text-xs font-medium text-neutral-800">{col.label}</p>
                  <p className="text-[11px] text-neutral-400">
                    {col.type} {col.sortable ? '· sortable' : ''}
                  </p>
                </div>
                <button
                  onClick={() => removeColumn(col.id)}
                  className="rounded p-0.5 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-500"
                  aria-label={`Remove ${col.label}`}
                >
                  <X size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-neutral-600">Add column</p>
          <Input
            placeholder="Column name..."
            value={newColName}
            onChange={(e) => setNewColName(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Select
            options={COLUMN_TYPES}
            value={newColType}
            onChange={(e) => setNewColType(e.target.value as ColumnType)}
          />
          <Button variant="secondary" size="sm" onClick={handleAddColumn} className="w-full">
            <Plus size={13} />
            Add column
          </Button>
        </div>

        <div className="flex flex-col gap-1 border-t border-neutral-100 pt-4">
          <p className="mb-2 text-xs font-medium text-neutral-600">Options</p>
          <Toggle
            label="Search bar"
            checked={tableConfig.showSearch}
            onChange={(v) => setTableOption('showSearch', v)}
          />
          <Toggle
            label="Pagination"
            checked={tableConfig.showPagination}
            onChange={(v) => setTableOption('showPagination', v)}
          />
          <Toggle
            label="Row numbers"
            checked={tableConfig.showRowNumbers}
            onChange={(v) => setTableOption('showRowNumbers', v)}
          />
          <Toggle
            label="Striped rows"
            checked={tableConfig.striped}
            onChange={(v) => setTableOption('striped', v)}
          />
          <Toggle
            label="Action buttons"
            checked={tableConfig.showActions}
            onChange={(v) => setTableOption('showActions', v)}
          />
        </div>

        {tableConfig.showPagination && (
          <div className="flex flex-col gap-2">
            <Select
              label="Rows per page"
              options={ROWS_PER_PAGE_OPTIONS}
              value={String(tableConfig.rowsPerPage)}
              onChange={(e) => setTableOption('rowsPerPage', Number(e.target.value))}
            />
          </div>
        )}
      </div>
    </div>
  )
}
