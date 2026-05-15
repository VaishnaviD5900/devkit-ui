import type { FrameworkGenerator, FormConfig, GeneratorOutput } from './types'
import type { FormField } from '@/stores/builder.store'

function getTailwindFieldComponent(field: FormField, showLabels: boolean, showValidation: boolean): string {
  const required = showValidation && field.required
  const requiredAttr = required ? ' required aria-required="true"' : ''
  const baseInput = `w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50`
  const errorClass = required ? ` aria-invalid={!!errors.${field.name}}` : ''
  const describedBy = required ? ` aria-describedby="${field.name}-error"` : ''

  if (field.type === 'textarea') {
    return `      <div className="flex flex-col gap-1.5">
        ${showLabels ? `<label htmlFor="${field.name}" className="text-sm font-medium text-gray-700">
          ${field.label ?? field.name}${required ? ' <span className="text-red-500" aria-hidden="true">*</span>' : ''}
        </label>` : ''}
        <textarea
          id="${field.name}"
          name="${field.name}"
          placeholder="${field.placeholder ?? ''}"
          rows={4}
          className="${baseInput} resize-none"${requiredAttr}${errorClass}${describedBy}
          value={formData.${field.name} as string}
          onChange={handleChange}
        />
        ${showValidation && required ? `{errors.${field.name} && <p id="${field.name}-error" role="alert" className="text-xs text-red-500">{errors.${field.name}}</p>}` : ''}
      </div>`
  }

  if (field.type === 'select' || field.type === 'autocomplete') {
    return `      <div className="flex flex-col gap-1.5">
        ${showLabels ? `<label htmlFor="${field.name}" className="text-sm font-medium text-gray-700">
          ${field.label ?? field.name}${required ? ' <span className="text-red-500" aria-hidden="true">*</span>' : ''}
        </label>` : ''}
        <select
          id="${field.name}"
          name="${field.name}"
          className="${baseInput} bg-white"${requiredAttr}${errorClass}${describedBy}
          value={formData.${field.name} as string}
          onChange={handleChange}
        >
          <option value="">Select ${field.label?.toLowerCase() ?? field.name}...</option>
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
        </select>
        ${showValidation && required ? `{errors.${field.name} && <p id="${field.name}-error" role="alert" className="text-xs text-red-500">{errors.${field.name}}</p>}` : ''}
      </div>`
  }

  if (field.type === 'checkbox') {
    return `      <div className="flex items-center gap-2">
        <input
          id="${field.name}"
          name="${field.name}"
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          checked={formData.${field.name} as boolean}
          onChange={handleChange}
        />
        ${showLabels ? `<label htmlFor="${field.name}" className="text-sm text-gray-700">
          ${field.label ?? field.name}
        </label>` : ''}
      </div>`
  }

  return `      <div className="flex flex-col gap-1.5">
        ${showLabels ? `<label htmlFor="${field.name}" className="text-sm font-medium text-gray-700">
          ${field.label ?? field.name}${required ? ' <span className="text-red-500" aria-hidden="true">*</span>' : ''}
        </label>` : ''}
        <input
          id="${field.name}"
          name="${field.name}"
          type="${field.type}"
          placeholder="${field.placeholder ?? ''}"
          className="${baseInput}"${requiredAttr}${errorClass}${describedBy}
          value={formData.${field.name} as string}
          onChange={handleChange}
          ${field.type === 'password' ? 'autoComplete="current-password"' : ''}
          ${field.type === 'email' ? 'autoComplete="email"' : ''}
        />
        ${showValidation && required ? `{errors.${field.name} && <p id="${field.name}-error" role="alert" className="text-xs text-red-500">{errors.${field.name}}</p>}` : ''}
      </div>`
}

export const tailwindGenerator: FrameworkGenerator = {
  framework: 'tailwind',

  generateForm(config: FormConfig): GeneratorOutput {
    const { title, fields, showSubmitButton, showLabels, showValidation } = config
    const componentName = title.replace(/\s+/g, '')

    const initialState = fields
      .map((f) => {
        if (f.type === 'checkbox') return `    ${f.name}: false,`
        return `    ${f.name}: "",`
      })
      .join('\n')

    const validationLogic = showValidation
      ? `
  function validate() {
    const newErrors: Record<string, string> = {}
${fields
  .filter((f) => f.required)
  .map((f) => {
    if (f.type === 'email') {
      return `    if (!formData.${f.name}) {
      newErrors.${f.name} = "${f.label} is required"
    } else if (!/\\S+@\\S+\\.\\S+/.test(formData.${f.name} as string)) {
      newErrors.${f.name} = "Invalid email address"
    }`
    }
    return `    if (!formData.${f.name}) newErrors.${f.name} = "${f.label} is required"`
  })
  .join('\n')}
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }`
      : ''

    const fieldComponents = fields
      .map((f) => getTailwindFieldComponent(f, showLabels, showValidation))
      .join('\n\n')

    const imports = [`import { useState } from "react"`]

    const code = `${imports.join('\n')}

export function ${componentName}Form() {
  const [formData, setFormData] = useState<Record<string, string | boolean>>({
${initialState}
  })${showValidation ? `\n  const [errors, setErrors] = useState<Record<string, string>>({})` : ''}
${validationLogic}
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))${showValidation ? `\n    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }))` : ''}
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()${showValidation ? '\n    if (!validate()) return' : ''}
    console.log(formData)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
      aria-label="${title} form"
      noValidate
    >
      <h2 className="text-lg font-semibold text-gray-900" id="${componentName.toLowerCase()}-title">
        ${title}
      </h2>

${fieldComponents}

      ${showSubmitButton ? `<button
        type="submit"
        className="mt-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
      >
        Submit
      </button>` : ''}
    </form>
  )
}`

    return { code, language: 'tsx', imports }
  },
}
