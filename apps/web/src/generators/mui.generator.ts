import type { FrameworkGenerator, FormConfig, GeneratorOutput } from './types'
import type { FormField } from '@/stores/builder.store'

function getMuiFieldComponent(field: FormField, showLabels: boolean, showValidation: boolean): string {
  const required = showValidation && field.required
  const requiredProp = required ? '\n          required' : ''
  const helperProp = field.helperText ? `\n          helperText="${field.helperText}"` : ''
  const labelProp = showLabels ? `label="${field.label ?? field.name}"` : ''

  if (field.type === 'textarea') {
    return `        <TextField
          ${labelProp}
          name="${field.name}"
          multiline
          rows={4}
          placeholder="${field.placeholder ?? ''}"
          fullWidth
          variant="outlined"${requiredProp}${helperProp}
          value={formData.${field.name}}
          onChange={handleChange}${showValidation && required ? `\n          error={!!errors.${field.name}}\n          helperText={errors.${field.name}}` : ''}
        />`
  }

  if (field.type === 'select' || field.type === 'autocomplete') {
    return `        <FormControl fullWidth${required ? ' required' : ''}>
          ${showLabels ? `<InputLabel>${field.label ?? field.name}</InputLabel>` : ''}
          <MuiSelect
            name="${field.name}"
            ${showLabels ? `label="${field.label ?? field.name}"` : ''}
            value={formData.${field.name}}
            onChange={handleSelectChange}${showValidation && required ? `\n            error={!!errors.${field.name}}` : ''}
          >
            <MenuItem value="option1">Option 1</MenuItem>
            <MenuItem value="option2">Option 2</MenuItem>
          </MuiSelect>
          ${showValidation && required ? `{errors.${field.name} && <FormHelperText error>{errors.${field.name}}</FormHelperText>}` : ''}
        </FormControl>`
  }

  if (field.type === 'checkbox') {
    return `        <FormControlLabel
          control={
            <Checkbox
              name="${field.name}"
              checked={formData.${field.name} as boolean}
              onChange={handleChange}
            />
          }
          ${showLabels ? `label="${field.label ?? field.name}"` : 'label=""'}
        />`
  }

  return `        <TextField
          ${labelProp}
          name="${field.name}"
          type="${field.type}"
          placeholder="${field.placeholder ?? ''}"
          fullWidth
          variant="outlined"${requiredProp}${helperProp}
          value={formData.${field.name}}
          onChange={handleChange}${showValidation && required ? `\n          error={!!errors.${field.name}}\n          helperText={errors.${field.name}}` : ''}
        />`
}

export const muiGenerator: FrameworkGenerator = {
  framework: 'mui',

  generateForm(config: FormConfig): GeneratorOutput {
    const { title, fields, showSubmitButton, showLabels, showValidation } = config
    const componentName = title.replace(/\s+/g, '')

    const hasSelect = fields.some((f) => f.type === 'select' || f.type === 'autocomplete')
    const hasCheckbox = fields.some((f) => f.type === 'checkbox')

    const imports = [
      `import { useState } from "react"`,
      `import Box from "@mui/material/Box"`,
      `import TextField from "@mui/material/TextField"`,
      `import Typography from "@mui/material/Typography"`,
      ...(hasSelect ? [
        `import FormControl from "@mui/material/FormControl"`,
        `import InputLabel from "@mui/material/InputLabel"`,
        `import Select as MuiSelect from "@mui/material/Select"`,
        `import MenuItem from "@mui/material/MenuItem"`,
        `import FormHelperText from "@mui/material/FormHelperText"`,
        `import { type SelectChangeEvent } from "@mui/material/Select"`,
      ] : []),
      ...(hasCheckbox ? [
        `import FormControlLabel from "@mui/material/FormControlLabel"`,
        `import Checkbox from "@mui/material/Checkbox"`,
      ] : []),
      ...(showSubmitButton ? [`import Button from "@mui/material/Button"`] : []),
    ]

    const initialState = fields
      .map((f) => {
        if (f.type === 'checkbox') return `    ${f.name}: false,`
        if (f.type === 'number') return `    ${f.name}: "",`
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
      return `    if (!formData.${f.name}) newErrors.${f.name} = "${f.label} is required"
    else if (!/\\S+@\\S+\\.\\S+/.test(formData.${f.name} as string)) newErrors.${f.name} = "Invalid email address"`
    }
    return `    if (!formData.${f.name}) newErrors.${f.name} = "${f.label} is required"`
  })
  .join('\n')}
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }`
      : ''

    const fieldComponents = fields
      .map((f) => getMuiFieldComponent(f, showLabels, showValidation))
      .join('\n\n')

    const code = `${imports.join('\n')}

export function ${componentName}Form() {
  const [formData, setFormData] = useState<Record<string, string | boolean>>({
${initialState}
  })${showValidation ? `\n  const [errors, setErrors] = useState<Record<string, string>>({})` : ''}
${validationLogic}
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))${showValidation ? `\n    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }))` : ''}
  }
${hasSelect ? `
  function handleSelectChange(e: SelectChangeEvent) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }` : ''}
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()${showValidation ? '\n    if (!validate()) return' : ''}
    console.log(formData)
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      aria-label="${title} form"
      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
    >
      <Typography variant="h6">${title}</Typography>

${fieldComponents}

      ${showSubmitButton ? `<Button type="submit" variant="contained" size="large">
        Submit
      </Button>` : ''}
    </Box>
  )
}`

    return { code, language: 'tsx', imports }
  },
}
