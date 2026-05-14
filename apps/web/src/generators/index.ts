import type { Framework, TableConfig, CardConfig, NavbarConfig, ModalConfig, AlertConfig, ToastConfig } from '@/stores/builder.store'
import type { FormConfig, GeneratorOutput } from './types'
import { shadcnGenerator } from './shadcn.generator'
import { muiGenerator } from './mui.generator'
import { vuetifyGenerator } from './vuetify.generator'
import { angularMaterialGenerator } from './angular-material.generator'
import { tailwindGenerator } from './tailwind.generator'
import { generateShadcnTable, generateMuiTable, generateVuetifyTable, generateAngularTable, generateTailwindTable } from './table.generators'
import { generateShadcnCard, generateMuiCard, generateVuetifyCard, generateAngularCard, generateTailwindCard } from './card.generators'
import { generateShadcnNavbar, generateMuiNavbar, generateVuetifyNavbar, generateAngularNavbar, generateTailwindNavbar } from './navbar.generators'
import { generateShadcnModal, generateMuiModal, generateVuetifyModal, generateAngularModal, generateTailwindModal } from './modal.generators'
import { generateShadcnAlert, generateMuiAlert, generateVuetifyAlert, generateAngularAlert, generateTailwindAlert } from './alert.generators'
import { generateShadcnToast, generateMuiToast, generateVuetifyToast, generateAngularToast, generateTailwindToast } from './toast.generators'

export function generateForm(framework: Framework, config: FormConfig): GeneratorOutput {
  const g = { shadcn: shadcnGenerator, mui: muiGenerator, vuetify: vuetifyGenerator, 'angular-material': angularMaterialGenerator, tailwind: tailwindGenerator }
  return g[framework].generateForm(config)
}
export function generateTable(framework: Framework, config: TableConfig): GeneratorOutput {
  const g = { shadcn: generateShadcnTable, mui: generateMuiTable, vuetify: generateVuetifyTable, 'angular-material': generateAngularTable, tailwind: generateTailwindTable }
  return g[framework](config)
}
export function generateCard(framework: Framework, config: CardConfig): GeneratorOutput {
  const g = { shadcn: generateShadcnCard, mui: generateMuiCard, vuetify: generateVuetifyCard, 'angular-material': generateAngularCard, tailwind: generateTailwindCard }
  return g[framework](config)
}
export function generateNavbar(framework: Framework, config: NavbarConfig): GeneratorOutput {
  const g = { shadcn: generateShadcnNavbar, mui: generateMuiNavbar, vuetify: generateVuetifyNavbar, 'angular-material': generateAngularNavbar, tailwind: generateTailwindNavbar }
  return g[framework](config)
}
export function generateModal(framework: Framework, config: ModalConfig): GeneratorOutput {
  const g = { shadcn: generateShadcnModal, mui: generateMuiModal, vuetify: generateVuetifyModal, 'angular-material': generateAngularModal, tailwind: generateTailwindModal }
  return g[framework](config)
}
export function generateAlert(framework: Framework, config: AlertConfig): GeneratorOutput {
  const g = { shadcn: generateShadcnAlert, mui: generateMuiAlert, vuetify: generateVuetifyAlert, 'angular-material': generateAngularAlert, tailwind: generateTailwindAlert }
  return g[framework](config)
}
export function generateToast(framework: Framework, config: ToastConfig): GeneratorOutput {
  const g = { shadcn: generateShadcnToast, mui: generateMuiToast, vuetify: generateVuetifyToast, 'angular-material': generateAngularToast, tailwind: generateTailwindToast }
  return g[framework](config)
}

export type { FormConfig, GeneratorOutput }
