import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Toggle } from '@/components/ui/Toggle'
import { Button } from '@/components/ui/Button'
import { useBuilderStore, type TabsVariant, type TabsOrientation } from '@/stores/builder.store'

const VARIANTS: { value: TabsVariant; label: string; description: string }[] = [
  { value: 'default', label: 'Default', description: 'Background highlight' },
  { value: 'underline', label: 'Underline', description: 'Bottom border' },
  { value: 'pills', label: 'Pills', description: 'Rounded buttons' },
  { value: 'boxed', label: 'Boxed', description: 'Card-style tabs' },
]

const ORIENTATIONS: { value: TabsOrientation; label: string }[] = [
  { value: 'horizontal', label: 'Horizontal' },
  { value: 'vertical', label: 'Vertical' },
]

export function TabsConfigPanel() {
  const { tabsConfig, setTabsConfig, addTab, removeTab, updateTab } = useBuilderStore()
  const [newTabLabel, setNewTabLabel] = useState('')

  function handleAddTab() {
    if (!newTabLabel.trim()) return
    addTab({
      label: newTabLabel,
      content: `${newTabLabel} content goes here.`,
      icon: 'file',
      disabled: false,
    })
    setNewTabLabel('')
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleAddTab()
  }

  return (
    <div className="flex w-72 flex-shrink-0 flex-col border-r border-neutral-200 bg-white">
      <div className="border-b border-neutral-200 px-4 py-3">
        <h2 className="text-sm font-semibold text-neutral-900">Tabs settings</h2>
        <p className="mt-0.5 text-xs text-neutral-400">Configure variant, orientation and items</p>
      </div>

      <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-4">

        {/* Variant */}
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-neutral-600">Variant</p>
          <div className="grid grid-cols-2 gap-1.5">
            {VARIANTS.map((v) => (
              <button
                key={v.value}
                onClick={() => setTabsConfig({ variant: v.value })}
                className={`rounded-md border px-3 py-2 text-left transition-colors ${
                  tabsConfig.variant === v.value
                    ? 'border-brand-300 bg-brand-50 text-brand-700'
                    : 'border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50'
                }`}
              >
                <p className="text-xs font-medium">{v.label}</p>
                <p className="text-[10px] text-neutral-400">{v.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Orientation */}
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-neutral-600">Orientation</p>
          <div className="flex gap-1.5">
            {ORIENTATIONS.map((o) => (
              <button
                key={o.value}
                onClick={() => setTabsConfig({ orientation: o.value })}
                className={`flex-1 rounded-md border px-3 py-2 text-xs font-medium transition-colors ${
                  tabsConfig.orientation === o.value
                    ? 'border-brand-300 bg-brand-50 text-brand-700'
                    : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-1 border-t border-neutral-100 pt-2">
          <Toggle
            label="Show icons"
            checked={tabsConfig.showIcons}
            onChange={(v) => setTabsConfig({ showIcons: v })}
          />
        </div>

        {/* Tab items */}
        <div className="flex flex-col gap-2 border-t border-neutral-100 pt-2">
          <p className="text-xs font-medium text-neutral-600">Tab items</p>

          <div className="flex flex-col gap-1.5">
            {tabsConfig.items.map((tab) => (
              <div
                key={tab.id}
                className="flex items-center gap-2 rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2"
              >
                <div className="flex flex-1 flex-col gap-1 min-w-0">
                  <input
                    value={tab.label}
                    onChange={(e) => updateTab(tab.id, { label: e.target.value })}
                    className="w-full bg-transparent text-xs font-medium text-neutral-800 focus:outline-none"
                    placeholder="Tab label..."
                  />
                  <input
                    value={tab.content}
                    onChange={(e) => updateTab(tab.id, { content: e.target.value })}
                    className="w-full truncate bg-transparent text-[11px] text-neutral-400 focus:outline-none"
                    placeholder="Tab content..."
                  />
                </div>
                <button
                  onClick={() => updateTab(tab.id, { disabled: !tab.disabled })}
                  className={`rounded px-1.5 py-0.5 text-[10px] font-medium transition-colors flex-shrink-0 ${
                    tab.disabled
                      ? 'bg-neutral-200 text-neutral-500'
                      : 'bg-green-50 text-green-600 hover:bg-neutral-100'
                  }`}
                >
                  {tab.disabled ? 'off' : 'on'}
                </button>
                <button
                  onClick={() => removeTab(tab.id)}
                  className="flex-shrink-0 rounded p-0.5 text-neutral-400 hover:bg-red-50 hover:text-red-500"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="New tab label..."
              value={newTabLabel}
              onChange={(e) => setNewTabLabel(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button variant="secondary" size="sm" onClick={handleAddTab}>
              <Plus size={13} />
            </Button>
          </div>
        </div>

      </div>
    </div>
  )
}
