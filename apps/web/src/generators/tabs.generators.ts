import type { TabsConfig, TabsVariant } from '@/stores/builder.store'
import type { GeneratorOutput } from './types'

// ─── shadcn/ui ────────────────────────────────────────────────────────────────

export function generateShadcnTabs(config: TabsConfig): GeneratorOutput {
  const { variant, orientation, items, showIcons } = config
  const isVertical = orientation === 'vertical'

  const imports = [
    `import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"`,
  ]

  const triggerClass = variant === 'pills'
    ? `data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full`
    : variant === 'underline'
      ? `rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 pb-3`
      : variant === 'boxed'
        ? `rounded-t-md rounded-b-none border border-transparent data-[state=active]:border-border data-[state=active]:border-b-background`
        : ''

  const listClass = variant === 'pills'
    ? `gap-2 bg-transparent`
    : variant === 'underline'
      ? `h-auto bg-transparent border-b rounded-none gap-0 p-0`
      : variant === 'boxed'
        ? `h-auto bg-transparent border-b rounded-none gap-0 p-0`
        : ''

  const ICONS: Record<string, string> = {
    home: '🏠', chart: '📊', settings: '⚙️', lock: '🔒', file: '📄', user: '👤', star: '⭐', bell: '🔔',
  }

  const triggersCode = items
    .map((t) => `        <TabsTrigger value="${t.id}"${t.disabled ? ' disabled' : ''}${triggerClass ? ` className="${triggerClass}"` : ''}>
          ${showIcons && t.icon ? `<span className="mr-2">${ICONS[t.icon] ?? '📄'}</span>` : ''}
          ${t.label}
        </TabsTrigger>`)
    .join('\n')

  const contentsCode = items
    .map((t) => `      <TabsContent value="${t.id}">
        <div className="rounded-lg border p-5">
          <h3 className="mb-2 font-semibold">${t.label}</h3>
          <p className="text-sm text-muted-foreground">${t.content}</p>
        </div>
      </TabsContent>`)
    .join('\n')

  const code = `${imports.join('\n')}

export function TabsDemo() {
  return (
    <Tabs defaultValue="${items.find((t) => !t.disabled)?.id ?? items[0]?.id}" ${isVertical ? `orientation="vertical" className="flex gap-4"` : ''}>
      <TabsList${listClass ? ` className="${listClass}"` : ''}${isVertical ? ` className="flex-col h-auto"` : ''}>
${triggersCode}
      </TabsList>
${contentsCode}
    </Tabs>
  )
}`

  return { code, language: 'tsx', imports }
}

// ─── Material UI ──────────────────────────────────────────────────────────────

export function generateMuiTabs(config: TabsConfig): GeneratorOutput {
  const { variant, orientation, items, showIcons } = config
  const isVertical = orientation === 'vertical'

  const tabsVariant = variant === 'pills' || variant === 'boxed' ? 'scrollable' : 'standard'
  const indicatorColor = variant === 'underline' ? 'primary' : 'secondary'

  const ICONS: Record<string, string> = {
    home: 'HomeIcon', chart: 'BarChartIcon', settings: 'SettingsIcon',
    lock: 'LockIcon', file: 'ArticleIcon', user: 'PersonIcon', star: 'StarIcon', bell: 'NotificationsIcon',
  }

  const imports = [
    `import { useState } from "react"`,
    `import Box from "@mui/material/Box"`,
    `import Tabs from "@mui/material/Tabs"`,
    `import Tab from "@mui/material/Tab"`,
    `import Typography from "@mui/material/Typography"`,
    ...(variant === 'pills' || variant === 'boxed' ? [`import { styled } from "@mui/material/styles"`] : []),
  ]

  const styledCode = variant === 'pills' ? `
const PillTab = styled(Tab)(({ theme }) => ({
  borderRadius: "9999px",
  minHeight: 36,
  textTransform: "none",
  "&.Mui-selected": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
}))

const PillTabs = styled(Tabs)({
  "& .MuiTabs-indicator": { display: "none" },
  "& .MuiTabs-flexContainer": { gap: 8 },
})\n` : ''

  const tabComponent = variant === 'pills' ? 'PillTab' : 'Tab'
  const tabsComponent = variant === 'pills' ? 'PillTabs' : 'Tabs'

  const tabsCode = items
    .map((t) => `        <${tabComponent} label="${t.label}"${t.disabled ? ' disabled' : ''}${showIcons && t.icon ? ` icon={<span>${t.icon}</span>} iconPosition="start"` : ''} />`)
    .join('\n')

  const panelsCode = items
    .map((t, i) => `      {value === ${i} && (
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>${t.label}</Typography>
          <Typography variant="body2" color="text.secondary">${t.content}</Typography>
        </Box>
      )}`)
    .join('\n')

  const code = `${imports.join('\n')}
${styledCode}
export function TabsDemo() {
  const [value, setValue] = useState(0)

  return (
    <Box${isVertical ? ` sx={{ display: "flex", gap: 2 }}` : ''}>
      <${tabsComponent}
        value={value}
        onChange={(_, v: number) => setValue(v)}
        orientation="${orientation}"
        variant="${tabsVariant}"
        ${variant !== 'underline' ? `TabIndicatorProps={{ style: { display: "none" } }}` : ''}
      >
${tabsCode}
      </${tabsComponent}>
${panelsCode}
    </Box>
  )
}`

  return { code, language: 'tsx', imports }
}

// ─── Vuetify ──────────────────────────────────────────────────────────────────

export function generateVuetifyTabs(config: TabsConfig): GeneratorOutput {
  const { variant, orientation, items, showIcons } = config
  const isVertical = orientation === 'vertical'

  const ICONS: Record<string, string> = {
    home: 'mdi-home', chart: 'mdi-chart-bar', settings: 'mdi-cog',
    lock: 'mdi-lock', file: 'mdi-file', user: 'mdi-account', star: 'mdi-star', bell: 'mdi-bell',
  }

  const tabsClass = variant === 'pills' ? 'v-tabs--pill' : ''

  const tabsCode = items
    .map((t) => `      <v-tab value="${t.id}"${t.disabled ? ' disabled' : ''}${showIcons && t.icon ? ` prepend-icon="${ICONS[t.icon] ?? 'mdi-file'}"` : ''}>
        ${t.label}
      </v-tab>`)
    .join('\n')

  const windowsCode = items
    .map((t) => `      <v-window-item value="${t.id}">
        <v-card flat>
          <v-card-text>
            <p class="text-h6">${t.label}</p>
            <p>${t.content}</p>
          </v-card-text>
        </v-card>
      </v-window-item>`)
    .join('\n')

  const code = `<template>
  <v-tabs
    v-model="tab"
    ${isVertical ? 'direction="vertical"' : ''}
    ${variant === 'underline' ? 'color="primary"' : variant === 'pills' ? 'color="primary" selected-class="bg-primary text-white" hide-slider' : 'color="primary"'}
    ${tabsClass ? `class="${tabsClass}"` : ''}
  >
${tabsCode}
  </v-tabs>

  <v-window v-model="tab">
${windowsCode}
  </v-window>
</template>

<script setup lang="ts">
import { ref } from "vue"
const tab = ref("${items.find((t) => !t.disabled)?.id ?? items[0]?.id}")
</script>`

  return { code, language: 'vue', imports: [] }
}

// ─── Angular Material ─────────────────────────────────────────────────────────

export function generateAngularTabs(config: TabsConfig): GeneratorOutput {
  const { orientation, items, showIcons } = config
  const isVertical = orientation === 'vertical'

  const ICONS: Record<string, string> = {
    home: 'home', chart: 'bar_chart', settings: 'settings',
    lock: 'lock', file: 'article', user: 'person', star: 'star', bell: 'notifications',
  }

  const imports = [
    `import { Component } from "@angular/core"`,
    `import { MatTabsModule } from "@angular/material/tabs"`,
    ...(showIcons ? [`import { MatIconModule } from "@angular/material/icon"`] : []),
  ]

  const tabsCode = items
    .map((t) => `      <mat-tab${t.disabled ? ' disabled' : ''}>
        <ng-template mat-tab-label>
          ${showIcons && t.icon ? `<mat-icon class="mr-2">${ICONS[t.icon] ?? 'article'}</mat-icon>` : ''}
          ${t.label}
        </ng-template>
        <div class="p-4">
          <h3 class="text-xl font-semibold mb-2">${t.label}</h3>
          <p class="text-gray-600">${t.content}</p>
        </div>
      </mat-tab>`)
    .join('\n')

  const code = `${imports.join('\n')}

@Component({
  selector: "app-tabs-demo",
  standalone: true,
  imports: [MatTabsModule${showIcons ? ', MatIconModule' : ''}],
  template: \`
    <mat-tab-group ${isVertical ? 'mat-stretch-tabs="false" mat-align-tabs="start"' : ''}>
${tabsCode}
    </mat-tab-group>
  \`,
})
export class TabsDemoComponent {}`

  return { code, language: 'typescript', imports }
}

// ─── Tailwind ─────────────────────────────────────────────────────────────────

export function generateTailwindTabs(config: TabsConfig): GeneratorOutput {
  const { variant, orientation, items, showIcons } = config
  const isVertical = orientation === 'vertical'

  const ICONS: Record<string, string> = {
    home: '🏠', chart: '📊', settings: '⚙️', lock: '🔒', file: '📄', user: '👤', star: '⭐', bell: '🔔',
  }

  const getActiveClass = (v: TabsVariant) => {
    if (v === 'underline') return 'border-b-2 border-blue-600 text-blue-600'
    if (v === 'pills') return 'bg-blue-600 text-white rounded-full'
    if (v === 'boxed') return 'border border-b-white bg-white text-gray-900 rounded-t-md -mb-px'
    return 'bg-white text-gray-900 shadow-sm rounded-md'
  }

  const getInactiveClass = (v: TabsVariant) => {
    if (v === 'underline') return 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    if (v === 'pills') return 'text-gray-600 hover:bg-gray-100 rounded-full'
    if (v === 'boxed') return 'border border-transparent text-gray-500 hover:text-gray-700'
    return 'text-gray-500 hover:text-gray-700'
  }

  const getListClass = (v: TabsVariant) => {
    if (v === 'default') return `flex ${isVertical ? 'flex-col' : ''} gap-1 rounded-lg bg-gray-100 p-1`
    if (v === 'underline') return `flex ${isVertical ? 'flex-col border-r border-b-0' : 'border-b'} border-gray-200`
    if (v === 'pills') return `flex ${isVertical ? 'flex-col' : ''} gap-2`
    if (v === 'boxed') return `flex ${isVertical ? 'flex-col border-r border-b-0' : 'border-b'} border-gray-200`
    return 'flex'
  }

  const imports = [`import { useState } from "react"`]

  const tabButtonsCode = items
    .map((t) => `          <button
            onClick={() => ${t.disabled ? '' : `setActive("${t.id}")`}}
            className={\`px-4 py-2 text-sm font-medium transition-colors ${t.disabled ? 'opacity-40 cursor-not-allowed ' : ''}\${active === "${t.id}" ? "${getActiveClass(variant)}" : "${getInactiveClass(variant)}"}\`}
            ${t.disabled ? 'disabled' : ''}
          >
            ${showIcons && t.icon ? `<span className="mr-2">${ICONS[t.icon] ?? '📄'}</span>` : ''}{/* ${t.label} */}
            ${t.label}
          </button>`)
    .join('\n')

  const tabPanelsCode = items
    .map((t) => `        {active === "${t.id}" && (
          <div role="tabpanel" id="panel-${t.id}" aria-labelledby="tab-${t.id}" tabIndex={0}>
            <h3 className="mb-2 font-semibold text-gray-900">${t.label}</h3>
            <p className="text-sm text-gray-600">${t.content}</p>
          </div>
        )}`)
    .join('\n')

  const code = `${imports.join('\n')}

export function TabsDemo() {
  const [active, setActive] = useState("${items.find((t) => !t.disabled)?.id ?? items[0]?.id}")

  return (
    <div className="${isVertical ? 'flex gap-0' : 'flex flex-col'}">
      <div role="tablist" aria-orientation="${orientation}" className="${getListClass(variant)}${isVertical ? ' w-40' : ''}">
${tabButtonsCode}
      </div>
      <div className="flex-1 rounded-lg border border-gray-200 bg-white p-5${variant === 'boxed' && !isVertical ? ' rounded-tl-none border-t-0' : ''}${isVertical ? ' rounded-tl-none' : ''}">
${tabPanelsCode}
      </div>
    </div>
  )
}`

  return { code, language: 'tsx', imports }
}
