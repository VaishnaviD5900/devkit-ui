import type { AlertConfig, AlertVariant, AlertStyle } from '@/stores/builder.store'
import type { GeneratorOutput } from './types'

// ─── Shared helpers ───────────────────────────────────────────────────────────

const LUCIDE_ICONS: Record<AlertVariant, string> = {
  info: 'Info',
  success: 'CheckCircle',
  warning: 'AlertTriangle',
  danger: 'AlertCircle',
}

const MUI_SEVERITY: Record<AlertVariant, string> = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  danger: 'error',
}

const VUETIFY_TYPE: Record<AlertVariant, string> = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  danger: 'error',
}

const VUETIFY_VARIANT: Record<AlertStyle, string> = {
  soft: 'tonal',
  outlined: 'outlined',
  filled: 'flat',
}

// ─── shadcn/ui ────────────────────────────────────────────────────────────────

export function generateShadcnAlert(config: AlertConfig): GeneratorOutput {
  const { variant, title, message, showIcon, dismissible, showAction, actionLabel } = config

  const iconName = LUCIDE_ICONS[variant]

  const imports = [
    `import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"`,
    ...(showIcon ? [`import { ${iconName} } from "lucide-react"`] : []),
    ...(dismissible ? [`import { useState } from "react"`] : []),
    ...(showAction ? [`import { Button } from "@/components/ui/button"`] : []),
  ]

  const variantProp = variant === 'danger' ? ` variant="destructive"` : ''

  const code = `${imports.join('\n')}

${dismissible ? `export function ${title.replace(/\s+/g, '')}Alert() {
  const [visible, setVisible] = useState(true)
  if (!visible) return null

  return (` : `export function ${title.replace(/\s+/g, '')}Alert() {
  return (`}
    <Alert${variantProp}>
      ${showIcon ? `<${iconName} className="h-4 w-4" />` : ''}
      <AlertTitle>${title}</AlertTitle>
      <AlertDescription>
        ${message}
        ${showAction ? `<Button variant="link" className="h-auto p-0 text-sm" onClick={() => {}}>
          ${actionLabel} →
        </Button>` : ''}
      </AlertDescription>
      ${dismissible ? `<button
        onClick={() => setVisible(false)}
        className="absolute right-3 top-3 rounded-sm opacity-70 hover:opacity-100"
      >
        ✕
      </button>` : ''}
    </Alert>
  )
}`

  return { code, language: 'tsx', imports }
}

// ─── Material UI ──────────────────────────────────────────────────────────────

export function generateMuiAlert(config: AlertConfig): GeneratorOutput {
  const { variant, style, title, message, dismissible, showAction, actionLabel } = config

  const severity = MUI_SEVERITY[variant]
  const muiVariant = style === 'filled' ? 'filled' : style === 'outlined' ? 'outlined' : 'standard'

  const imports = [
    `import Alert from "@mui/material/Alert"`,
    `import AlertTitle from "@mui/material/AlertTitle"`,
    ...(dismissible ? [`import { useState } from "react"`] : []),
    ...(showAction ? [`import Button from "@mui/material/Button"`] : []),
  ]

  const code = `${imports.join('\n')}

export function ${title.replace(/\s+/g, '')}Alert() {
  ${dismissible ? 'const [visible, setVisible] = useState(true)\n  if (!visible) return null\n' : ''}
  return (
    <Alert
      severity="${severity}"
      variant="${muiVariant}"
      ${dismissible ? `onClose={() => setVisible(false)}` : ''}
      action={${showAction ? `
        <Button color="inherit" size="small">
          ${actionLabel}
        </Button>` : 'undefined'}
      }
    >
      <AlertTitle>${title}</AlertTitle>
      ${message}
    </Alert>
  )
}`

  return { code, language: 'tsx', imports }
}

// ─── Vuetify ──────────────────────────────────────────────────────────────────

export function generateVuetifyAlert(config: AlertConfig): GeneratorOutput {
  const { variant, style, title, message, showIcon, dismissible, showAction, actionLabel } = config

  const type = VUETIFY_TYPE[variant]
  const vVariant = VUETIFY_VARIANT[style]

  const code = `<template>
  <v-alert
    v-if="visible"
    type="${type}"
    variant="${vVariant}"
    title="${title}"
    ${!showIcon ? 'icon="false"' : ''}
    ${dismissible ? ':closable="true"\n    @click:close="visible = false"' : ''}
  >
    ${message}
    ${showAction ? `<template #append>
      <v-btn variant="text" size="small" @click="handleAction">
        ${actionLabel}
      </v-btn>
    </template>` : ''}
  </v-alert>
</template>

<script setup lang="ts">
import { ref } from "vue"

const visible = ref(true)
${showAction ? `
function handleAction() {
  // Handle action click
}` : ''}
</script>`

  return { code, language: 'vue', imports: [] }
}

// ─── Angular Material (custom — no native alert) ──────────────────────────────

export function generateAngularAlert(config: AlertConfig): GeneratorOutput {
  const { variant, style, title, message, showIcon, dismissible, showAction, actionLabel } = config

  const matIconName: Record<AlertVariant, string> = {
    info: 'info',
    success: 'check_circle',
    warning: 'warning',
    danger: 'error',
  }

  const colorMap: Record<AlertVariant, { bg: string; border: string; text: string; icon: string }> = {
    info: { bg: '#eff6ff', border: '#bfdbfe', text: '#1e40af', icon: '#3b82f6' },
    success: { bg: '#f0fdf4', border: '#bbf7d0', text: '#166534', icon: '#22c55e' },
    warning: { bg: '#fffbeb', border: '#fde68a', text: '#92400e', icon: '#f59e0b' },
    danger: { bg: '#fef2f2', border: '#fecaca', text: '#991b1b', icon: '#ef4444' },
  }

  const filledMap: Record<AlertVariant, string> = {
    info: '#2563eb',
    success: '#16a34a',
    warning: '#d97706',
    danger: '#dc2626',
  }

  const c = colorMap[variant]
  const isFilled = style === 'filled'
  const bgColor = isFilled ? filledMap[variant] : c.bg
  const borderColor = style === 'outlined' ? c.border : 'transparent'
  const textColor = isFilled ? '#ffffff' : c.text
  const iconColor = isFilled ? '#ffffff' : c.icon

  const imports = [
    `import { Component } from "@angular/core"`,
    `import { CommonModule } from "@angular/common"`,
    ...(showIcon ? [`import { MatIconModule } from "@angular/material/icon"`] : []),
    ...(showAction ? [`import { MatButtonModule } from "@angular/material/button"`] : []),
  ]

  const componentName = title.replace(/\s+/g, '')

  const code = `${imports.join('\n')}

@Component({
  selector: "app-${title.toLowerCase().replace(/\s+/g, '-')}-alert",
  standalone: true,
  imports: [CommonModule${showIcon ? ', MatIconModule' : ''}${showAction ? ', MatButtonModule' : ''}],
  template: \`
    <div
      *ngIf="visible"
      role="alert"
      style="
        display: flex;
        align-items: flex-start;
        gap: 12px;
        padding: 12px 16px;
        border-radius: 8px;
        border: 1px solid ${borderColor};
        background-color: ${bgColor};
        color: ${textColor};
      "
    >
      ${showIcon ? `<mat-icon style="color: ${iconColor}; font-size: 20px; width: 20px; height: 20px; flex-shrink: 0;">${matIconName[variant]}</mat-icon>` : ''}
      <div style="flex: 1; min-width: 0;">
        <p style="margin: 0; font-weight: 600; font-size: 14px;">${title}</p>
        <p style="margin: 4px 0 0; font-size: 14px; opacity: 0.9;">${message}</p>
        ${showAction ? `<button mat-button style="margin-top: 8px; padding: 0; min-width: 0; font-size: 13px; color: inherit; text-decoration: underline;" (click)="handleAction()">${actionLabel}</button>` : ''}
      </div>
      ${dismissible ? `<button
        mat-icon-button
        style="flex-shrink: 0; color: inherit; opacity: 0.7; width: 24px; height: 24px; line-height: 24px;"
        (click)="visible = false"
      >
        <mat-icon style="font-size: 16px;">close</mat-icon>
      </button>` : ''}
    </div>
  \`,
})
export class ${componentName}AlertComponent {
  visible = true
${showAction ? `
  handleAction() {
    // Handle action click
  }` : ''}
}`

  return { code, language: 'typescript', imports }
}

// ─── Tailwind ─────────────────────────────────────────────────────────────────

export function generateTailwindAlert(config: AlertConfig): GeneratorOutput {
  const { variant, style, title, message, showIcon, dismissible, showAction, actionLabel } = config

  const softClasses: Record<AlertVariant, string> = {
    info: 'bg-blue-50 border border-blue-100 text-blue-800',
    success: 'bg-green-50 border border-green-100 text-green-800',
    warning: 'bg-amber-50 border border-amber-100 text-amber-800',
    danger: 'bg-red-50 border border-red-100 text-red-800',
  }

  const outlinedClasses: Record<AlertVariant, string> = {
    info: 'bg-white border border-blue-300 text-blue-800',
    success: 'bg-white border border-green-300 text-green-800',
    warning: 'bg-white border border-amber-300 text-amber-800',
    danger: 'bg-white border border-red-300 text-red-800',
  }

  const filledClasses: Record<AlertVariant, string> = {
    info: 'bg-blue-600 border border-blue-600 text-white',
    success: 'bg-green-600 border border-green-600 text-white',
    warning: 'bg-amber-500 border border-amber-500 text-white',
    danger: 'bg-red-500 border border-red-500 text-white',
  }

  const iconClasses: Record<AlertStyle, Record<AlertVariant, string>> = {
    soft: { info: 'text-blue-500', success: 'text-green-500', warning: 'text-amber-500', danger: 'text-red-500' },
    outlined: { info: 'text-blue-500', success: 'text-green-500', warning: 'text-amber-500', danger: 'text-red-500' },
    filled: { info: 'text-white', success: 'text-white', warning: 'text-white', danger: 'text-white' },
  }

  const actionClasses: Record<AlertStyle, string> = {
    soft: 'text-inherit underline hover:opacity-80',
    outlined: 'text-inherit underline hover:opacity-80',
    filled: 'text-white underline hover:opacity-80',
  }

  const containerClass =
    style === 'filled' ? filledClasses[variant]
    : style === 'outlined' ? outlinedClasses[variant]
    : softClasses[variant]

  const iconClass = iconClasses[style][variant]
  const iconSvg: Record<AlertVariant, string> = {
    info: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
    success: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
    warning: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    danger: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
  }

  const imports = [
    ...(dismissible ? [`import { useState } from "react"`] : []),
  ]

  const componentName = title.replace(/\s+/g, '')

  const code = `${imports.length ? imports.join('\n') + '\n\n' : ''}export function ${componentName}Alert() {
  ${dismissible ? 'const [visible, setVisible] = useState(true)\n  if (!visible) return null\n' : ''}
  return (
    <div role="alert" aria-live="polite" aria-atomic="true" className="flex items-start gap-3 rounded-lg px-4 py-3.5 ${containerClass}">
      ${showIcon ? `<span className="mt-0.5 flex-shrink-0 ${iconClass}">
        ${iconSvg[variant]}
      </span>` : ''}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold">${title}</p>
        <p className="mt-1 text-sm opacity-90">${message}</p>
        ${showAction ? `<button
          onClick={() => {/* handle action */}}
          className="mt-2 text-xs font-medium ${actionClasses[style]}"
        >
          ${actionLabel} →
        </button>` : ''}
      </div>
      ${dismissible ? `<button
        onClick={() => setVisible(false)}
        aria-label="Dismiss alert"
        className="flex-shrink-0 rounded p-0.5 opacity-60 transition-opacity hover:opacity-100"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
      </button>` : ''}
    </div>
  )
}`

  return { code, language: 'tsx', imports: imports.length ? imports : [] }
}
