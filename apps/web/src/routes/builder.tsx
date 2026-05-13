import { createFileRoute } from '@tanstack/react-router'
import { Topbar } from '@/components/layout/Topbar'
import { Sidebar } from '@/components/layout/Sidebar'
import { ConfigPanel } from '@/components/builder/ConfigPanel'
import { TableConfigPanel } from '@/components/builder/TableConfigPanel'
import { CardConfigPanel } from '@/components/builder/CardConfigPanel'
import { NavbarConfigPanel } from '@/components/builder/NavbarConfigPanel'
import { ModalConfigPanel } from '@/components/builder/ModalConfigPanel'
import { AlertConfigPanel } from '@/components/builder/AlertConfigPanel'
import { PreviewPanel } from '@/components/builder/PreviewPanel'
import { TablePreview } from '@/components/builder/TablePreview'
import { CardPreview } from '@/components/builder/CardPreview'
import { NavbarPreview } from '@/components/builder/NavbarPreview'
import { ModalPreview } from '@/components/builder/ModalPreview'
import { AlertPreview } from '@/components/builder/AlertPreview'
import { CodePanel } from '@/components/builder/CodePanel'
import { useBuilderStore } from '@/stores/builder.store'

export const Route = createFileRoute('/builder')({
  component: BuilderPage,
})

const CONFIG_PANELS = {
  form: ConfigPanel,
  table: TableConfigPanel,
  card: CardConfigPanel,
  navbar: NavbarConfigPanel,
  modal: ModalConfigPanel,
  alert: AlertConfigPanel,
}

const PREVIEW_PANELS = {
  form: PreviewPanel,
  table: TablePreview,
  card: CardPreview,
  navbar: NavbarPreview,
  modal: ModalPreview,
  alert: AlertPreview,
}

function BuilderPage() {
  const { componentType } = useBuilderStore()
  const ConfigComponent = CONFIG_PANELS[componentType]
  const PreviewComponent = PREVIEW_PANELS[componentType]

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
