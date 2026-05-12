import type { FrameworkGenerator, FormConfig, GeneratorOutput } from './types'

export const shadcnGenerator: FrameworkGenerator = {
  framework: 'shadcn',

  generateForm(config: FormConfig): GeneratorOutput {
    const { title, fields, showSubmitButton, showLabels } = config

    const imports = [
      `import { Button } from "@/components/ui/button"`,
      `import { Input } from "@/components/ui/input"`,
      `import { Label } from "@/components/ui/label"`,
    ]

    const fieldCode = fields
      .map((field) => {
        const label = showLabels ? `<Label htmlFor="${field.name}">${field.label}</Label>` : ''
        const input = `<Input id="${field.name}" name="${field.name}" type="${field.type}" placeholder="${field.placeholder ?? ''}" />`
        return `      <div className="flex flex-col gap-1.5">\n        ${label}\n        ${input}\n      </div>`
      })
      .join('\n')

    const submitBtn = showSubmitButton ? `      <Button type="submit">Submit</Button>` : ''

    const code = `${imports.join('\n')}

export function ${title.replace(/\s+/g, '')}Form() {
  return (
    <form className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">${title}</h2>
${fieldCode}
${submitBtn}
    </form>
  )
}`

    return { code, language: 'tsx', imports }
  },
}
