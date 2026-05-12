import type { FrameworkGenerator, FormConfig, GeneratorOutput } from './types'

export const muiGenerator: FrameworkGenerator = {
  framework: 'mui',

  generateForm(config: FormConfig): GeneratorOutput {
    const { title, fields, showSubmitButton } = config

    const imports = [
      `import Button from "@mui/material/Button"`,
      `import TextField from "@mui/material/TextField"`,
      `import Box from "@mui/material/Box"`,
      `import Typography from "@mui/material/Typography"`,
    ]

    const fieldCode = fields
      .map(
        (field) =>
          `      <TextField label="${field.label}" name="${field.name}" type="${field.type}" placeholder="${field.placeholder ?? ''}" fullWidth />`
      )
      .join('\n')

    const submitBtn = showSubmitButton
      ? `      <Button type="submit" variant="contained">\n        Submit\n      </Button>`
      : ''

    const code = `${imports.join('\n')}

export function ${title.replace(/\s+/g, '')}Form() {
  return (
    <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h6">${title}</Typography>
${fieldCode}
${submitBtn}
    </Box>
  )
}`

    return { code, language: 'tsx', imports }
  },
}
