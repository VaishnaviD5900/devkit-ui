import { createFileRoute } from '@tanstack/react-router'
import { Topbar } from '@/components/layout/Topbar'
import { Sidebar } from '@/components/layout/Sidebar'
import { ConfigPanel } from '@/components/builder/ConfigPanel'
import { TableConfigPanel } from '@/components/builder/TableConfigPanel'
import { CardConfigPanel } from '@/components/builder/CardConfigPanel'
import { PreviewPanel } from '@/components/builder/PreviewPanel'
import { TablePreview } from '@/components/builder/TablePreview'
import { CardPreview } from '@/components/builder/CardPreview'
import { CodePanel } from '@/components/builder/CodePanel'
import { useBuilderStore } from '@/stores/builder.store'

export const Route = createFileRoute('/builder')({
  component: BuilderPage,
})

function BuilderPage() {
  const { componentType } = useBuilderStore()

  const ConfigComponent = componentType === 'table' ? TableConfigPanel : componentType === 'card' ? CardConfigPanel : ConfigPanel
  const PreviewComponent = componentType === 'table' ? TablePreview : componentType === 'card' ? CardPreview : PreviewPanel

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Topbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <ConfigComponent />
        <div className="flex flex-1 flex-col overflow-hidden">
          <PreviewComponent />
          <CodePanel />
        </div>
      </div>
    </div>
  )
}
