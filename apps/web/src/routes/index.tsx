import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4">
      <div className="flex items-center gap-2">
        <div className="h-2.5 w-2.5 rounded-full bg-brand-600" />
        <span className="text-lg font-medium text-neutral-900">DevKit UI</span>
      </div>
      <p className="text-sm text-neutral-500">
        Build UI components visually. Pick your framework. Copy the code.
      </p>
    </div>
  )
}
