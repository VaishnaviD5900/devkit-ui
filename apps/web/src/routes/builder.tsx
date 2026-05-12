import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/builder')({
  component: BuilderPage,
})

function BuilderPage() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <p className="text-sm text-neutral-400">Builder coming soon...</p>
    </div>
  )
}
