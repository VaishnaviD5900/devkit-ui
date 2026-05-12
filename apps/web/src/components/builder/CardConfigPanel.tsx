import { Plus, X } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Toggle } from '@/components/ui/Toggle'
import { Button } from '@/components/ui/Button'
import { useBuilderStore, type CardConfig, type CardType } from '@/stores/builder.store'

const CARD_TYPES: { value: CardType; label: string; description: string }[] = [
  { value: 'basic', label: 'Basic', description: 'Title, text, actions' },
  { value: 'profile', label: 'Profile', description: 'Avatar, name, bio' },
  { value: 'stats', label: 'Stats', description: 'KPI numbers + trends' },
  { value: 'product', label: 'Product', description: 'Image, price, buy' },
]

const SHADOW_OPTIONS = [
  { value: 'none', label: 'No shadow' },
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
]

const ROUNDED_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
  { value: 'xl', label: 'Extra large' },
]

export function CardConfigPanel() {
  const { cardConfig, setCardConfig, addCardAction, removeCardAction } = useBuilderStore()

  return (
    <div className="flex w-72 flex-shrink-0 flex-col border-r border-neutral-200 bg-white">
      <div className="border-b border-neutral-200 px-4 py-3">
        <h2 className="text-sm font-semibold text-neutral-900">Card settings</h2>
        <p className="mt-0.5 text-xs text-neutral-400">Configure card type and content</p>
      </div>

      <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-4">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-neutral-600">Card type</p>
          <div className="grid grid-cols-2 gap-1.5">
            {CARD_TYPES.map((type) => (
              <button
                key={type.value}
                onClick={() => setCardConfig({ cardType: type.value })}
                className={`rounded-md border px-3 py-2 text-left transition-colors ${
                  cardConfig.cardType === type.value
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

        <div className="flex flex-col gap-3">
          <p className="text-xs font-medium text-neutral-600">Content</p>
          <Input
            label="Title"
            value={cardConfig.title}
            onChange={(e) => setCardConfig({ title: e.target.value })}
          />
          {cardConfig.cardType !== 'stats' && (
            <Input
              label="Subtitle"
              value={cardConfig.subtitle}
              onChange={(e) => setCardConfig({ subtitle: e.target.value })}
            />
          )}
          {(cardConfig.cardType === 'basic' || cardConfig.cardType === 'profile') && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-neutral-600">Description</label>
              <textarea
                value={cardConfig.description}
                onChange={(e) => setCardConfig({ description: e.target.value })}
                rows={3}
                className="w-full resize-none rounded-md border border-neutral-200 bg-white px-2.5 py-2 text-sm text-neutral-900 focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
              />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1 border-t border-neutral-100 pt-4">
          <p className="mb-2 text-xs font-medium text-neutral-600">Options</p>
          {cardConfig.cardType !== 'stats' && (
            <Toggle
              label="Show image"
              checked={cardConfig.showImage}
              onChange={(v) => setCardConfig({ showImage: v })}
            />
          )}
          {(cardConfig.cardType === 'profile' || cardConfig.cardType === 'basic') && (
            <Toggle
              label="Show avatar"
              checked={cardConfig.showAvatar}
              onChange={(v) => setCardConfig({ showAvatar: v })}
            />
          )}
          <Toggle
            label="Show badge"
            checked={cardConfig.showBadge}
            onChange={(v) => setCardConfig({ showBadge: v })}
          />
          {cardConfig.showBadge && (
            <Input
              placeholder="Badge text..."
              value={cardConfig.badgeText}
              onChange={(e) => setCardConfig({ badgeText: e.target.value })}
            />
          )}
          <Toggle
            label="Show footer"
            checked={cardConfig.showFooter}
            onChange={(v) => setCardConfig({ showFooter: v })}
          />
          <Toggle
            label="Show divider"
            checked={cardConfig.showDivider}
            onChange={(v) => setCardConfig({ showDivider: v })}
          />
        </div>

        {cardConfig.cardType !== 'stats' && (
          <div className="flex flex-col gap-2 border-t border-neutral-100 pt-4">
            <p className="text-xs font-medium text-neutral-600">Action buttons</p>
            {cardConfig.actions.map((action) => (
              <div
                key={action.id}
                className="flex items-center justify-between rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2"
              >
                <div>
                  <p className="text-xs font-medium text-neutral-800">{action.label}</p>
                  <p className="text-[11px] text-neutral-400">{action.variant}</p>
                </div>
                <button
                  onClick={() => removeCardAction(action.id)}
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
              onClick={() => addCardAction({ label: 'Action', variant: 'secondary' })}
            >
              <Plus size={13} /> Add action
            </Button>
          </div>
        )}

        <div className="flex flex-col gap-3 border-t border-neutral-100 pt-4">
          <p className="text-xs font-medium text-neutral-600">Style</p>
          <Select
            label="Shadow"
            options={SHADOW_OPTIONS}
            value={cardConfig.shadow}
            onChange={(e) => setCardConfig({ shadow: e.target.value as CardConfig['shadow'] })}
          />
          <Select
            label="Border radius"
            options={ROUNDED_OPTIONS}
            value={cardConfig.rounded}
            onChange={(e) => setCardConfig({ rounded: e.target.value as CardConfig['rounded'] })}
          />
        </div>
      </div>
    </div>
  )
}
