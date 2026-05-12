import type { FormField, Framework } from '@/stores/builder.store'

export interface FormConfig {
  title: string
  fields: FormField[]
  showSubmitButton: boolean
  showLabels: boolean
  showValidation: boolean
}

export interface GeneratorOutput {
  code: string
  language: 'tsx' | 'vue' | 'html' | 'typescript'
  imports?: string[]
}

export interface FrameworkGenerator {
  framework: Framework
  generateForm(config: FormConfig): GeneratorOutput
}
