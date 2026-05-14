import { Hammer } from 'lucide-react'
import { useBuilderStore } from '@/stores/builder.store'

export function PlaceholderPanel() {
  const { componentType } = useBuilderStore()
  const label = componentType.charAt(0).toUpperCase() + componentType.slice(1)

  return (
    <div className="flex w-72 flex-shrink-0 flex-col border-r border-neutral-200 bg-white">
      <div className="border-b border-neutral-200 px-4 py-3">
        <h2 className="text-sm font-semibold text-neutral-900">{label} settings</h2>
        <p className="mt-0.5 text-xs text-neutral-400">Coming soon</p>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50">
          <Hammer size={18} className="text-brand-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-neutral-700">{label} builder</p>
          <p className="mt-1 text-xs text-neutral-400">This component is being built next.</p>
        </div>
      </div>
    </div>
  )
}

export function PlaceholderPreview() {
  const { componentType } = useBuilderStore()
  const label = componentType.charAt(0).toUpperCase() + componentType.slice(1)

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-neutral-50">
      <div className="flex h-10 flex-shrink-0 items-center gap-2 border-b border-neutral-200 bg-white px-4">
        <div className="h-1.5 w-1.5 rounded-full bg-amber-400" />
        <span className="text-xs font-medium text-neutral-500">{label} — coming soon</span>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50">
            <Hammer size={20} className="text-brand-600" />
          </div>
          <p className="text-sm font-medium text-neutral-600">{label} builder coming soon</p>
          <p className="text-xs text-neutral-400">Check back after the next commit!</p>
        </div>
      </div>
    </div>
  )
}
