import { Link } from '@tanstack/react-router'
import { Copy, Download } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useBuilderStore } from '@/stores/builder.store'
import { generateForm } from '@/generators'

const FRAMEWORKS = [
  { value: 'shadcn', label: 'shadcn/ui' },
  { value: 'mui', label: 'Material UI' },
  { value: 'vuetify', label: 'Vuetify' },
  { value: 'angular-material', label: 'Angular Material' },
  { value: 'tailwind', label: 'Tailwind' },
] as const

export function Topbar() {
  const { framework, setFramework, fields, formTitle, showSubmitButton, showLabels, showValidation } =
    useBuilderStore()

  function handleCopy() {
    const output = generateForm(framework, {
      title: formTitle,
      fields,
      showSubmitButton,
      showLabels,
      showValidation,
    })
    void navigator.clipboard.writeText(output.code)
  }

  function handleExport() {
    const output = generateForm(framework, {
      title: formTitle,
      fields,
      showSubmitButton,
      showLabels,
      showValidation,
    })
    const ext = output.language === 'vue' ? 'vue' : 'tsx'
    const blob = new Blob([output.code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${formTitle.replace(/\s+/g, '')}Form.${ext}`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <header className="flex h-12 flex-shrink-0 items-center justify-between border-b border-neutral-200 bg-white px-4">
      <div className="flex items-center gap-6">
        <Link to="/" className="flex items-center gap-2 no-underline">
          <div className="h-2 w-2 rounded-full bg-brand-600" />
          <span className="text-sm font-semibold text-neutral-900">DevKit UI</span>
        </Link>

        <nav className="flex items-center gap-0.5">
          {FRAMEWORKS.map((fw) => (
            <button
              key={fw.value}
              onClick={() => setFramework(fw.value)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                framework === fw.value
                  ? 'bg-brand-50 text-brand-600'
                  : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700'
              }`}
            >
              {fw.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="secondary" size="sm" onClick={handleCopy}>
          <Copy size={13} />
          Copy
        </Button>
        <Button variant="primary" size="sm" onClick={handleExport}>
          <Download size={13} />
          Export
        </Button>
      </div>
    </header>
  )
}
