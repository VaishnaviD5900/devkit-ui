import type { FrameworkGenerator, FormConfig, GeneratorOutput } from './types'
import type { FormField } from '@/stores/builder.store'

function getFormFieldComponent(field: FormField, showLabels: boolean, showValidation: boolean): string {
  const required = showValidation && field.required
  const requiredAttr = required ? '\n          required\n          aria-required="true"' : ''
  const helperText = field.helperText ? `\n          description="${field.helperText}"` : ''
  const describedBy = field.helperText ? `\n          aria-describedby="${field.name}-description"` : ''

  if (field.type === 'textarea') {
    return `
      <FormField
        control={form.control}
        name="${field.name}"
        render={({ field }) => (
          <FormItem>
            ${showLabels ? `<FormLabel>${field.label ?? field.name}</FormLabel>` : ''}
            <FormControl>
              <Textarea
                placeholder="${field.placeholder ?? ''}"${requiredAttr}${describedBy}
                aria-invalid={!!form.formState.errors.${field.name}}
                {...field}
              />
            </FormControl>${helperText ? `\n            <FormDescription id="${field.name}-description">${field.helperText}</FormDescription>` : ''}
            <FormMessage role="alert" />
          </FormItem>
        )}
      />`
  }

  if (field.type === 'select' || field.type === 'autocomplete') {
    return `
      <FormField
        control={form.control}
        name="${field.name}"
        render={({ field }) => (
          <FormItem>
            ${showLabels ? `<FormLabel>${field.label ?? field.name}</FormLabel>` : ''}
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger aria-label="Select ${field.label?.toLowerCase() ?? field.name}"${required ? ' aria-required="true"' : ''}>
                  <SelectValue placeholder="Select ${field.label?.toLowerCase() ?? field.name}..." />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="option1">Option 1</SelectItem>
                <SelectItem value="option2">Option 2</SelectItem>
              </SelectContent>
            </Select>${helperText ? `\n            <FormDescription id="${field.name}-description">${field.helperText}</FormDescription>` : ''}
            <FormMessage role="alert" />
          </FormItem>
        )}
      />`
  }

  if (field.type === 'checkbox') {
    return `
      <FormField
        control={form.control}
        name="${field.name}"
        render={({ field }) => (
          <FormItem className="flex items-center gap-2 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                aria-label="${field.label ?? field.name}"
              />
            </FormControl>
            ${showLabels ? `<FormLabel className="font-normal">${field.label ?? field.name}</FormLabel>` : ''}
            <FormMessage role="alert" />
          </FormItem>
        )}
      />`
  }

  return `
      <FormField
        control={form.control}
        name="${field.name}"
        render={({ field }) => (
          <FormItem>
            ${showLabels ? `<FormLabel>${field.label ?? field.name}</FormLabel>` : ''}
            <FormControl>
              <Input
                type="${field.type}"
                placeholder="${field.placeholder ?? ''}"${requiredAttr}${describedBy}
                aria-invalid={!!form.formState.errors.${field.name}}
                {...field}
              />
            </FormControl>${helperText ? `\n            <FormDescription id="${field.name}-description">${field.helperText}</FormDescription>` : ''}
            <FormMessage role="alert" />
          </FormItem>
        )}
      />`
}

export const shadcnGenerator: FrameworkGenerator = {
  framework: 'shadcn',

  generateForm(config: FormConfig): GeneratorOutput {
    const { title, fields, showSubmitButton, showLabels, showValidation } = config
    const componentName = title.replace(/\s+/g, '')

    const hasSelect = fields.some((f) => f.type === 'select' || f.type === 'autocomplete')
    const hasCheckbox = fields.some((f) => f.type === 'checkbox')
    const hasTextarea = fields.some((f) => f.type === 'textarea')

    const zodFields = fields
      .map((f) => {
        if (f.type === 'email') return `  ${f.name}: z.string().email("Invalid email address"),`
        if (f.type === 'number') return `  ${f.name}: z.coerce.number(),`
        if (f.type === 'checkbox') return `  ${f.name}: z.boolean().default(false),`
        if (showValidation && f.required) return `  ${f.name}: z.string().min(1, "${f.label} is required"),`
        return `  ${f.name}: z.string(),`
      })
      .join('\n')

    const defaultValues = fields
      .map((f) => {
        if (f.type === 'checkbox') return `    ${f.name}: false,`
        if (f.type === 'number') return `    ${f.name}: 0,`
        return `    ${f.name}: "",`
      })
      .join('\n')

    const fieldComponents = fields
      .map((f) => getFormFieldComponent(f, showLabels, showValidation))
      .join('\n')

    const imports = [
      `import { useForm } from "react-hook-form"`,
      `import { zodResolver } from "@hookform/resolvers/zod"`,
      `import { z } from "zod"`,
      `import { Button } from "@/components/ui/button"`,
      `import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"`,
      `import { Input } from "@/components/ui/input"`,
      ...(hasTextarea ? [`import { Textarea } from "@/components/ui/textarea"`] : []),
      ...(hasSelect ? [`import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"`] : []),
      ...(hasCheckbox ? [`import { Checkbox } from "@/components/ui/checkbox"`] : []),
    ]

    const code = `${imports.join('\n')}

const formSchema = z.object({
${zodFields}
})

type ${componentName}Values = z.infer<typeof formSchema>

export function ${componentName}Form() {
  const form = useForm<${componentName}Values>({
    resolver: zodResolver(formSchema),
    defaultValues: {
${defaultValues}
    },
  })

  function onSubmit(values: ${componentName}Values) {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
        aria-label="${title} form"
        noValidate
      >
        <h2 className="text-lg font-semibold" id="${componentName.toLowerCase()}-title">${title}</h2>
${fieldComponents}
        ${showSubmitButton ? `<Button type="submit" aria-label="Submit ${title} form">Submit</Button>` : ''}
      </form>
    </Form>
  )
}`

    return { code, language: 'tsx', imports }
  },
}
