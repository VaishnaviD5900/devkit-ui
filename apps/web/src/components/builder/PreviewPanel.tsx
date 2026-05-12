import { Monitor, Smartphone } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/cn'
import { useBuilderStore } from '@/stores/builder.store'

const FRAMEWORK_LABELS: Record<string, string> = {
  shadcn: 'shadcn/ui',
  mui: 'Material UI',
  vuetify: 'Vuetify',
  'angular-material': 'Angular Material',
  tailwind: 'Tailwind',
}

export function PreviewPanel() {
  const { framework, formTitle, fields, showSubmitButton, showLabels, showValidation } =
    useBuilderStore()
  const [isMobile, setIsMobile] = useState(false)

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-neutral-50">
      <div className="flex h-10 flex-shrink-0 items-center justify-between border-b border-neutral-200 bg-white px-4">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
          <span className="text-xs font-medium text-neutral-500">Live preview</span>
          <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-medium text-brand-600">
            {FRAMEWORK_LABELS[framework]}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMobile(false)}
            className={cn(
              'rounded p-1.5 transition-colors',
              !isMobile ? 'bg-neutral-100 text-neutral-700' : 'text-neutral-400 hover:bg-neutral-100'
            )}
            aria-label="Desktop preview"
          >
            <Monitor size={13} />
          </button>
          <button
            onClick={() => setIsMobile(true)}
            className={cn(
              'rounded p-1.5 transition-colors',
              isMobile ? 'bg-neutral-100 text-neutral-700' : 'text-neutral-400 hover:bg-neutral-100'
            )}
            aria-label="Mobile preview"
          >
            <Smartphone size={13} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 items-start justify-center overflow-y-auto p-8">
        <div
          className={cn(
            'rounded-lg border border-neutral-200 bg-white p-6 shadow-sm transition-all',
            isMobile ? 'w-[375px]' : 'w-full max-w-md'
          )}
        >
          <h3 className="mb-5 text-base font-semibold text-neutral-900">{formTitle}</h3>

          <div className="flex flex-col gap-4">
            {fields.map((field) => (
              <div key={field.id} className="flex flex-col gap-1.5">
                {showLabels && (
                  <label className="flex items-center gap-1 text-xs font-medium text-neutral-700">
                    {field.label}
                    {showValidation && field.required && (
                      <span className="text-red-500">*</span>
                    )}
                  </label>
                )}

                {field.type === 'textarea' ? (
                  <textarea
                    className="w-full resize-none rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-400 focus:outline-none"
                    placeholder={field.placeholder}
                    rows={3}
                    readOnly
                  />
                ) : field.type === 'select' || field.type === 'autocomplete' ? (
                  <select
                    className="h-9 w-full rounded-md border border-neutral-200 bg-neutral-50 px-3 text-sm text-neutral-400 focus:outline-none"
                    disabled
                  >
                    <option>Select {field.label.toLowerCase()}...</option>
                  </select>
                ) : field.type === 'checkbox' ? (
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="h-4 w-4" disabled />
                    <span className="text-sm text-neutral-400">{field.placeholder}</span>
                  </div>
                ) : (
                  <input
                    type={field.type}
                    className="h-9 w-full rounded-md border border-neutral-200 bg-neutral-50 px-3 text-sm text-neutral-400 focus:outline-none"
                    placeholder={field.placeholder}
                    readOnly
                  />
                )}
              </div>
            ))}

            {fields.length === 0 && (
              <p className="py-4 text-center text-sm text-neutral-400">
                Add fields to preview your form
              </p>
            )}

            {showSubmitButton && fields.length > 0 && (
              <button className="mt-1 rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white">
                Submit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
