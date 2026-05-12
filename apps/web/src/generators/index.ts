import type { Framework } from '@/stores/builder.store'
import type { FrameworkGenerator, FormConfig, GeneratorOutput } from './types'
import { shadcnGenerator } from './shadcn.generator'
import { muiGenerator } from './mui.generator'
import { vuetifyGenerator } from './vuetify.generator'
import { angularMaterialGenerator } from './angular-material.generator'
import { tailwindGenerator } from './tailwind.generator'

const generators: Record<Framework, FrameworkGenerator> = {
  shadcn: shadcnGenerator,
  mui: muiGenerator,
  vuetify: vuetifyGenerator,
  'angular-material': angularMaterialGenerator,
  tailwind: tailwindGenerator,
}

export function generateForm(framework: Framework, config: FormConfig): GeneratorOutput {
  const generator = generators[framework]
  return generator.generateForm(config)
}

export type { FormConfig, GeneratorOutput, FrameworkGenerator }
