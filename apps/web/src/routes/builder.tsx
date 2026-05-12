import { createFileRoute } from '@tanstack/react-router'
import { Topbar } from '@/components/layout/Topbar'
import { Sidebar } from '@/components/layout/Sidebar'
import { ConfigPanel } from '@/components/builder/ConfigPanel'
import { TableConfigPanel } from '@/components/builder/TableConfigPanel'
import { PreviewPanel } from '@/components/builder/PreviewPanel'
import { TablePreview } from '@/components/builder/TablePreview'
import { CodePanel } from '@/components/builder/CodePanel'
import { useBuilderStore } from '@/stores/builder.store'

export const Route = createFileRoute('/builder')({
  component: BuilderPage,
})

function BuilderPage() {
  const { componentType } = useBuilderStore()
  const isTable = componentType === 'table'

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Topbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        {isTable ? <TableConfigPanel /> : <ConfigPanel />}
        <div className="flex flex-1 flex-col overflow-hidden">
          {isTable ? <TablePreview /> : <PreviewPanel />}
          <CodePanel />
        </div>
      </div>
    </div>
  )
}
