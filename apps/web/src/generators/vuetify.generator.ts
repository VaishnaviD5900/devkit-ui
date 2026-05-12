import type { FrameworkGenerator, FormConfig, GeneratorOutput } from './types'
import type { FormField } from '@/stores/builder.store'

function getVuetifyFieldComponent(field: FormField, showLabels: boolean, showValidation: boolean): string {
  const label = showLabels ? `label="${field.label ?? field.name}"` : ''
  const required = showValidation && field.required
  const rules = required ? `\n          :rules="[(v) => !!v || '${field.label} is required']"` : ''

  if (field.type === 'textarea') {
    return `        <v-textarea
          ${label}
          v-model="form.${field.name}"
          placeholder="${field.placeholder ?? ''}"
          variant="outlined"
          auto-grow
          rows="3"${rules}
        />`
  }

  if (field.type === 'select' || field.type === 'autocomplete') {
    const component = field.type === 'autocomplete' ? 'v-autocomplete' : 'v-select'
    return `        <${component}
          ${label}
          v-model="form.${field.name}"
          :items="['Option 1', 'Option 2', 'Option 3']"
          placeholder="Select ${field.label?.toLowerCase() ?? field.name}..."
          variant="outlined"${rules}
        />`
  }

  if (field.type === 'checkbox') {
    return `        <v-checkbox
          ${label}
          v-model="form.${field.name}"${rules}
        />`
  }

  return `        <v-text-field
          ${label}
          v-model="form.${field.name}"
          type="${field.type}"
          placeholder="${field.placeholder ?? ''}"
          variant="outlined"${rules}
        />`
}

export const vuetifyGenerator: FrameworkGenerator = {
  framework: 'vuetify',

  generateForm(config: FormConfig): GeneratorOutput {
    const { title, fields, showSubmitButton, showLabels, showValidation } = config

    const formFields = fields
      .map((f) => {
        if (f.type === 'checkbox') return `  ${f.name}: false,`
        return `  ${f.name}: "",`
      })
      .join('\n')

    const fieldComponents = fields
      .map((f) => getVuetifyFieldComponent(f, showLabels, showValidation))
      .join('\n\n')

    const code = `<template>
  <v-form ref="formRef" @submit.prevent="handleSubmit">
    <v-container>
      <v-row>
        <v-col cols="12">
          <h2 class="text-h6 mb-4">${title}</h2>
        </v-col>
      </v-row>

      <v-row>
${fieldComponents
  .split('\n')
  .map((line) => `        ${line}`)
  .join('\n')
  .replace(/^(\s+)<v/gm, (_, spaces) => `${spaces}<v-col cols="12">\n${spaces}  <v`)
  .replace(/(\s+)\/>(\s*)$/gm, (_, spaces, after) => `${spaces}/>\n${spaces.slice(2)}</v-col>${after}`)}
      </v-row>

      ${showSubmitButton ? `<v-row>
        <v-col cols="12">
          <v-btn type="submit" color="primary" variant="flat" size="large">
            Submit
          </v-btn>
        </v-col>
      </v-row>` : ''}
    </v-container>
  </v-form>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue"
import type { VForm } from "vuetify/components"

const formRef = ref<VForm>()

const form = reactive({
${formFields}
})

async function handleSubmit() {
  const { valid } = await formRef.value!.validate()
  if (!valid) return
  console.log(form)
}
</script>`

    return { code, language: 'vue', imports: [] }
  },
}
