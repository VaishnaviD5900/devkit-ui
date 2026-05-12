import type { FrameworkGenerator, FormConfig, GeneratorOutput } from './types'

export const vuetifyGenerator: FrameworkGenerator = {
  framework: 'vuetify',

  generateForm(config: FormConfig): GeneratorOutput {
    const { title, fields, showSubmitButton } = config

    const fieldCode = fields
      .map(
        (field) =>
          `      <v-text-field label="${field.label}" name="${field.name}" type="${field.type}" placeholder="${field.placeholder ?? ''}" variant="outlined" />`
      )
      .join('\n')

    const submitBtn = showSubmitButton
      ? `      <v-btn type="submit" color="primary">\n        Submit\n      </v-btn>`
      : ''

    const code = `<template>
  <v-form>
    <v-container>
      <h2 class="text-h6 mb-4">${title}</h2>
${fieldCode}
${submitBtn}
    </v-container>
  </v-form>
</template>

<script setup lang="ts">
// ${title} form component
</script>`

    return { code, language: 'vue', imports: [] }
  },
}
