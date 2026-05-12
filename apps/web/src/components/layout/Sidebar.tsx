import {
  LayoutTemplate,
  Table,
  CreditCard,
  Navigation,
  Square,
  Bell,
  Palette,
  Type,
  Ruler,
} from 'lucide-react'
import { cn } from '@/lib/cn'
import { useBuilderStore, type ComponentType } from '@/stores/builder.store'

const COMPONENTS: { type: ComponentType; label: string; icon: React.ReactNode }[] = [
  { type: 'form', label: 'Form', icon: <LayoutTemplate size={15} /> },
  { type: 'table', label: 'Table', icon: <Table size={15} /> },
  { type: 'card', label: 'Card', icon: <CreditCard size={15} /> },
  { type: 'navbar', label: 'Navbar', icon: <Navigation size={15} /> },
  { type: 'modal', label: 'Modal', icon: <Square size={15} /> },
  { type: 'alert', label: 'Alert', icon: <Bell size={15} /> },
]

const THEME_ITEMS = [
  { label: 'Colors', icon: <Palette size={15} /> },
  { label: 'Typography', icon: <Type size={15} /> },
  { label: 'Spacing', icon: <Ruler size={15} /> },
]

export function Sidebar() {
  const { componentType, setComponentType } = useBuilderStore()

  return (
    <aside className="flex w-48 flex-shrink-0 flex-col border-r border-neutral-200 bg-white py-3">
      <div className="mb-1">
        <p className="px-4 pb-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
          Components
        </p>
        {COMPONENTS.map((item) => (
          <button
            key={item.type}
            onClick={() => setComponentType(item.type)}
            className={cn(
              'flex w-full items-center gap-2.5 px-4 py-2 text-left text-sm transition-colors',
              componentType === item.type
                ? 'bg-brand-50 font-medium text-brand-600'
                : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
            )}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-3">
        <p className="px-4 pb-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
          Theme
        </p>
        {THEME_ITEMS.map((item) => (
          <button
            key={item.label}
            className="flex w-full items-center gap-2.5 px-4 py-2 text-left text-sm text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-neutral-900"
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>
    </aside>
  )
}
