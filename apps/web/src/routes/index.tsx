import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5">
      <div className="flex items-center gap-2">
        <div className="h-2.5 w-2.5 rounded-full bg-brand-600" />
        <span className="text-lg font-semibold text-neutral-900">DevKit UI</span>
      </div>
      <p className="text-sm text-neutral-500">
        Build UI components visually. Pick your framework. Copy the code.
      </p>
      <Link
        to="/builder"
        className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white no-underline hover:bg-brand-800"
      >
        Open Builder →
      </Link>
    </div>
  )
}
