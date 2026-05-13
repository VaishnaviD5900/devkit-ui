import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useBuilderStore } from '@/stores/builder.store'
import { generateForm, generateTable, generateCard, generateNavbar, generateModal } from '@/generators'

const CODE_TABS = [
  { id: 'component', label: 'Component' },
  { id: 'imports', label: 'Imports' },
]

export function CodePanel() {
  const { framework, componentType, formTitle, fields, showSubmitButton, showLabels, showValidation, tableConfig, cardConfig, navbarConfig, modalConfig } = useBuilderStore()
  const [activeTab, setActiveTab] = useState('component')
  const [copied, setCopied] = useState(false)

  const output =
    componentType === 'table' ? generateTable(framework, tableConfig)
    : componentType === 'card' ? generateCard(framework, cardConfig)
    : componentType === 'navbar' ? generateNavbar(framework, navbarConfig)
    : componentType === 'modal' ? generateModal(framework, modalConfig)
    : generateForm(framework, { title: formTitle, fields, showSubmitButton, showLabels, showValidation })

  const displayCode = activeTab === 'imports' && output.imports ? output.imports.join('\n') : output.code

  async function handleCopy() {
    await navigator.clipboard.writeText(displayCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex h-52 flex-shrink-0 flex-col border-t border-neutral-200 bg-white">
      <div className="flex items-center justify-between border-b border-neutral-200 px-3">
        <div className="flex">
          {CODE_TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={cn('border-b-2 px-3 py-2 text-xs font-medium transition-colors',
                activeTab === tab.id ? 'border-brand-600 text-brand-600' : 'border-transparent text-neutral-500 hover:text-neutral-700'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <button onClick={handleCopy} className="flex items-center gap-1.5 rounded px-2 py-1 text-xs text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700">
          {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="flex-1 overflow-auto">
        <pre className="h-full p-3 text-xs leading-relaxed text-neutral-700"><code>{displayCode}</code></pre>
      </div>
    </div>
  )
}
