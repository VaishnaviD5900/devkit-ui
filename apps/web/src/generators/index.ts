import type { Framework, TableConfig, CardConfig, NavbarConfig, ModalConfig, AlertConfig, ToastConfig, TabsConfig } from '@/stores/builder.store'
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
import { generateShadcnTabs, generateMuiTabs, generateVuetifyTabs, generateAngularTabs, generateTailwindTabs } from './tabs.generators'

type Gen<T> = (config: T) => GeneratorOutput
function byFramework<T>(g: Record<Framework, Gen<T>>, framework: Framework, config: T) { return g[framework](config) }

export const generateForm = (f: Framework, c: FormConfig) => ({ shadcn: shadcnGenerator, mui: muiGenerator, vuetify: vuetifyGenerator, 'angular-material': angularMaterialGenerator, tailwind: tailwindGenerator }[f].generateForm(c))
export const generateTable = (f: Framework, c: TableConfig) => byFramework({ shadcn: generateShadcnTable, mui: generateMuiTable, vuetify: generateVuetifyTable, 'angular-material': generateAngularTable, tailwind: generateTailwindTable }, f, c)
export const generateCard = (f: Framework, c: CardConfig) => byFramework({ shadcn: generateShadcnCard, mui: generateMuiCard, vuetify: generateVuetifyCard, 'angular-material': generateAngularCard, tailwind: generateTailwindCard }, f, c)
export const generateNavbar = (f: Framework, c: NavbarConfig) => byFramework({ shadcn: generateShadcnNavbar, mui: generateMuiNavbar, vuetify: generateVuetifyNavbar, 'angular-material': generateAngularNavbar, tailwind: generateTailwindNavbar }, f, c)
export const generateModal = (f: Framework, c: ModalConfig) => byFramework({ shadcn: generateShadcnModal, mui: generateMuiModal, vuetify: generateVuetifyModal, 'angular-material': generateAngularModal, tailwind: generateTailwindModal }, f, c)
export const generateAlert = (f: Framework, c: AlertConfig) => byFramework({ shadcn: generateShadcnAlert, mui: generateMuiAlert, vuetify: generateVuetifyAlert, 'angular-material': generateAngularAlert, tailwind: generateTailwindAlert }, f, c)
export const generateToast = (f: Framework, c: ToastConfig) => byFramework({ shadcn: generateShadcnToast, mui: generateMuiToast, vuetify: generateVuetifyToast, 'angular-material': generateAngularToast, tailwind: generateTailwindToast }, f, c)
export const generateTabs = (f: Framework, c: TabsConfig) => byFramework({ shadcn: generateShadcnTabs, mui: generateMuiTabs, vuetify: generateVuetifyTabs, 'angular-material': generateAngularTabs, tailwind: generateTailwindTabs }, f, c)

export type { FormConfig, GeneratorOutput }
