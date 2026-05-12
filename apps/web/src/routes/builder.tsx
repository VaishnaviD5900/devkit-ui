import { createFileRoute } from '@tanstack/react-router'
import { Topbar } from '@/components/layout/Topbar'
import { Sidebar } from '@/components/layout/Sidebar'
import { ConfigPanel } from '@/components/builder/ConfigPanel'
import { PreviewPanel } from '@/components/builder/PreviewPanel'
import { CodePanel } from '@/components/builder/CodePanel'

export const Route = createFileRoute('/builder')({
  component: BuilderPage,
})

function BuilderPage() {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Topbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <ConfigPanel />
        <div className="flex flex-1 flex-col overflow-hidden">
          <PreviewPanel />
          <CodePanel />
        </div>
      </div>
    </div>
  )
}
