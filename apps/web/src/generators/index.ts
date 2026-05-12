import type { Framework } from '@/stores/builder.store'
import type { FrameworkGenerator, FormConfig, GeneratorOutput } from './types'
import { shadcnGenerator } from './shadcn.generator'
import { muiGenerator } from './mui.generator'
import { vuetifyGenerator } from './vuetify.generator'

const generators: Record<Framework, FrameworkGenerator> = {
  shadcn: shadcnGenerator,
  mui: muiGenerator,
  vuetify: vuetifyGenerator,
  'angular-material': vuetifyGenerator, // placeholder until implemented
  tailwind: shadcnGenerator,            // placeholder until implemented
}

export function generateForm(framework: Framework, config: FormConfig): GeneratorOutput {
  const generator = generators[framework]
  return generator.generateForm(config)
}

export type { FormConfig, GeneratorOutput, FrameworkGenerator }
