import { useState } from 'react'
import { cn } from '@/lib/cn'
import { useBuilderStore, type TabsVariant } from '@/stores/builder.store'

const ICONS: Record<string, string> = {
  home: '🏠',
  chart: '📊',
  settings: '⚙️',
  lock: '🔒',
  file: '📄',
  user: '👤',
  star: '⭐',
  bell: '🔔',
}

function getTriggerClass(variant: TabsVariant, active: boolean, disabled: boolean): string {
  const base = 'px-4 py-2 text-sm font-medium transition-colors focus:outline-none whitespace-nowrap'

  if (disabled) return `${base} cursor-not-allowed opacity-40`

  if (variant === 'default') {
    return cn(base, active
      ? 'bg-white text-neutral-900 shadow-sm rounded-md'
      : 'text-neutral-500 hover:text-neutral-700'
    )
  }

  if (variant === 'underline') {
    return cn(base, 'border-b-2 rounded-none pb-3',
      active
        ? 'border-brand-600 text-brand-600'
        : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
    )
  }

  if (variant === 'pills') {
    return cn(base, 'rounded-full',
      active
        ? 'bg-brand-600 text-white'
        : 'text-neutral-600 hover:bg-neutral-100'
    )
  }

  if (variant === 'boxed') {
    return cn(base, 'border rounded-t-md -mb-px',
      active
        ? 'border-neutral-200 border-b-white bg-white text-neutral-900'
        : 'border-transparent text-neutral-500 hover:text-neutral-700'
    )
  }

  return base
}

function getListClass(variant: TabsVariant, orientation: string): string {
  const isVertical = orientation === 'vertical'

  if (variant === 'default') {
    return cn(
      'flex gap-1 rounded-lg bg-neutral-100 p-1',
      isVertical ? 'flex-col w-40' : 'flex-row'
    )
  }
  if (variant === 'underline') {
    return cn(
      'flex border-b border-neutral-200',
      isVertical ? 'flex-col border-b-0 border-r w-40 gap-0' : 'flex-row gap-0'
    )
  }
  if (variant === 'pills') {
    return cn('flex gap-2', isVertical ? 'flex-col w-40' : 'flex-row')
  }
  if (variant === 'boxed') {
    return cn('flex border-b border-neutral-200', isVertical ? 'flex-col border-b-0 border-r w-40' : 'flex-row')
  }
  return 'flex'
}

export function TabsPreview() {
  const { tabsConfig } = useBuilderStore()
  const { variant, orientation, items, showIcons } = tabsConfig
  const [activeId, setActiveId] = useState(items[0]?.id ?? '')

  const isVertical = orientation === 'vertical'
  const activeItem = items.find((t) => t.id === activeId)

  // Make sure activeId is valid
  const validActiveId = items.find((t) => t.id === activeId && !t.disabled)
    ? activeId
    : items.find((t) => !t.disabled)?.id ?? ''

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-neutral-50">
      <div className="flex h-10 flex-shrink-0 items-center gap-2 border-b border-neutral-200 bg-white px-4">
        <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
        <span className="text-xs font-medium text-neutral-500">Live preview</span>
        <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-medium text-brand-600 capitalize">
          {variant} · {orientation}
        </span>
      </div>

      <div className="flex flex-1 items-start justify-center overflow-y-auto p-8">
        <div className="w-full max-w-2xl">
          <div className={cn('flex', isVertical ? 'flex-row gap-0' : 'flex-col gap-0')}>
            {/* Tab list */}
            <div className={getListClass(variant, orientation)}>
              {items.map((tab) => (
                <button
                  key={tab.id}
                  disabled={tab.disabled}
                  onClick={() => !tab.disabled && setActiveId(tab.id)}
                  className={getTriggerClass(variant, (validActiveId === tab.id), tab.disabled ?? false)}
                >
                  <span className="flex items-center gap-2">
                    {showIcons && tab.icon && (
                      <span className="text-sm">{ICONS[tab.icon] ?? '📄'}</span>
                    )}
                    {tab.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className={cn(
              'rounded-lg border border-neutral-200 bg-white p-5',
              variant === 'boxed' && !isVertical ? 'rounded-tl-none border-t-0 rounded-t-none' : '',
              isVertical ? 'flex-1 ml-0 rounded-tl-none' : 'mt-0',
              variant === 'underline' && !isVertical ? 'border-t-0 rounded-t-none' : '',
            )}>
              {activeItem && !activeItem.disabled ? (
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-neutral-900">
                    {showIcons && activeItem.icon && ICONS[activeItem.icon]} {activeItem.label}
                  </h3>
                  <p className="text-sm text-neutral-500">{activeItem.content}</p>
                </div>
              ) : (
                <p className="text-sm text-neutral-400">Select a tab to view content</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
