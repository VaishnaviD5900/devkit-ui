import type { Framework, TableConfig, CardConfig } from '@/stores/builder.store'
import type { FormConfig, GeneratorOutput } from './types'
import { shadcnGenerator } from './shadcn.generator'
import { muiGenerator } from './mui.generator'
import { vuetifyGenerator } from './vuetify.generator'
import { angularMaterialGenerator } from './angular-material.generator'
import { tailwindGenerator } from './tailwind.generator'
import { generateShadcnTable, generateMuiTable, generateVuetifyTable, generateAngularTable, generateTailwindTable } from './table.generators'
import { generateShadcnCard, generateMuiCard, generateVuetifyCard, generateAngularCard, generateTailwindCard } from './card.generators'

export function generateForm(framework: Framework, config: FormConfig): GeneratorOutput {
  const generators = { shadcn: shadcnGenerator, mui: muiGenerator, vuetify: vuetifyGenerator, 'angular-material': angularMaterialGenerator, tailwind: tailwindGenerator }
  return generators[framework].generateForm(config)
}

export function generateTable(framework: Framework, config: TableConfig): GeneratorOutput {
  const generators = { shadcn: generateShadcnTable, mui: generateMuiTable, vuetify: generateVuetifyTable, 'angular-material': generateAngularTable, tailwind: generateTailwindTable }
  return generators[framework](config)
}

export function generateCard(framework: Framework, config: CardConfig): GeneratorOutput {
  const generators = { shadcn: generateShadcnCard, mui: generateMuiCard, vuetify: generateVuetifyCard, 'angular-material': generateAngularCard, tailwind: generateTailwindCard }
  return generators[framework](config)
}

export type { FormConfig, GeneratorOutput }
