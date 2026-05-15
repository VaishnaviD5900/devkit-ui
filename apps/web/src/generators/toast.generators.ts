import type { ToastConfig, ToastVariant, ToastPosition } from '@/stores/builder.store'
import type { GeneratorOutput } from './types'

// ─── Shared helpers ───────────────────────────────────────────────────────────

const SONNER_TYPE: Record<ToastVariant, string> = {
  default: 'toast',
  info: 'toast.info',
  success: 'toast.success',
  warning: 'toast.warning',
  danger: 'toast.error',
}

const MUI_SEVERITY: Record<ToastVariant, string> = {
  default: 'info',
  info: 'info',
  success: 'success',
  warning: 'warning',
  danger: 'error',
}

const VUETIFY_COLOR: Record<ToastVariant, string> = {
  default: 'surface-variant',
  info: 'info',
  success: 'success',
  warning: 'warning',
  danger: 'error',
}

const SONNER_POSITION: Record<ToastPosition, string> = {
  'top-left': 'top-left',
  'top-center': 'top-center',
  'top-right': 'top-right',
  'bottom-left': 'bottom-left',
  'bottom-center': 'bottom-center',
  'bottom-right': 'bottom-right',
}

const MUI_ANCHOR: Record<ToastPosition, { vertical: string; horizontal: string }> = {
  'top-left': { vertical: 'top', horizontal: 'left' },
  'top-center': { vertical: 'top', horizontal: 'center' },
  'top-right': { vertical: 'top', horizontal: 'right' },
  'bottom-left': { vertical: 'bottom', horizontal: 'left' },
  'bottom-center': { vertical: 'bottom', horizontal: 'center' },
  'bottom-right': { vertical: 'bottom', horizontal: 'right' },
}

// ─── shadcn/ui (Sonner) ───────────────────────────────────────────────────────

export function generateShadcnToast(config: ToastConfig): GeneratorOutput {
  const { variant, position, title, message, autoDismiss, duration, showAction, actionLabel } = config

  const toastFn = SONNER_TYPE[variant]
  const sonnerPosition = SONNER_POSITION[position]

  const imports = [
    `import { toast } from "sonner"`,
    `import { Toaster } from "@/components/ui/sonner"`,
    `import { Button } from "@/components/ui/button"`,
  ]

  const actionOption = showAction
    ? `,\n    action: {\n      label: "${actionLabel}",\n      onClick: () => console.log("action clicked"),\n    }`
    : ''

  const durationOption = autoDismiss ? `,\n    duration: ${duration}` : `,\n    duration: Infinity`

  const code = `${imports.join('\n')}

// Add <Toaster /> once at the root of your app (e.g. in layout.tsx):
// <Toaster position="${sonnerPosition}" richColors />

export function showToast() {
  ${toastFn}("${title}", {
    description: "${message}"${durationOption}${actionOption}
  })
}

// Usage — call from a button or any event:
export function ToastDemo() {
  return (
    <>
      <Toaster position="${sonnerPosition}" richColors />
      <Button onClick={showToast}>Show toast</Button>
    </>
  )
}`

  return { code, language: 'tsx', imports }
}

// ─── Material UI ──────────────────────────────────────────────────────────────

export function generateMuiToast(config: ToastConfig): GeneratorOutput {
  const { variant, position, title, message, autoDismiss, duration, showAction, actionLabel, showCloseButton } = config

  const severity = MUI_SEVERITY[variant]
  const anchor = MUI_ANCHOR[position]

  const imports = [
    `import { useState } from "react"`,
    `import Snackbar from "@mui/material/Snackbar"`,
    `import Alert from "@mui/material/Alert"`,
    `import AlertTitle from "@mui/material/AlertTitle"`,
    `import Button from "@mui/material/Button"`,
    ...(showCloseButton ? [`import IconButton from "@mui/material/IconButton"`, `import CloseIcon from "@mui/icons-material/Close"`] : []),
  ]

  const code = `${imports.join('\n')}

export function ToastDemo() {
  const [open, setOpen] = useState(false)

  const handleClose = (_: unknown, reason?: string) => {
    if (reason === "clickaway") return
    setOpen(false)
  }

  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Show toast
      </Button>

      <Snackbar
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "${anchor.vertical}", horizontal: "${anchor.horizontal}" }}
        ${autoDismiss ? `autoHideDuration={${duration}}` : ''}
      >
        <Alert
          severity="${severity}"
          variant="filled"
          onClose={showCloseButton ? handleClose : undefined}
          action={${showAction ? `
            <Button color="inherit" size="small" onClick={() => console.log("action")}>
              ${actionLabel}
            </Button>` : 'undefined'}
          }
        >
          <AlertTitle>${title}</AlertTitle>
          ${message}
        </Alert>
      </Snackbar>
    </>
  )
}`

  return { code, language: 'tsx', imports }
}

// ─── Vuetify ──────────────────────────────────────────────────────────────────

export function generateVuetifyToast(config: ToastConfig): GeneratorOutput {
  const { variant, position, title, message, autoDismiss, duration, showAction, actionLabel, showCloseButton } = config

  const color = VUETIFY_COLOR[variant]

  const locationMap: Record<ToastPosition, string> = {
    'top-left': 'top start',
    'top-center': 'top center',
    'top-right': 'top end',
    'bottom-left': 'bottom start',
    'bottom-center': 'bottom center',
    'bottom-right': 'bottom end',
  }

  const location = locationMap[position]

  const code = `<template>
  <div>
    <v-btn @click="snackbar = true" variant="outlined">Show toast</v-btn>

    <v-snackbar
      v-model="snackbar"
      :color="${color}"
      :timeout="${autoDismiss ? duration : -1}"
      location="${location}"
      rounded="lg"
    >
      <div class="d-flex flex-column gap-1">
        <strong>${title}</strong>
        <span class="text-body-2">${message}</span>
      </div>

      <template #actions>
        ${showAction ? `<v-btn variant="text" @click="handleAction">${actionLabel}</v-btn>` : ''}
        ${showCloseButton ? `<v-btn icon="mdi-close" variant="text" size="small" @click="snackbar = false" />` : ''}
      </template>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"

const snackbar = ref(false)
${showAction ? `
function handleAction() {
  console.log("action clicked")
  snackbar.value = false
}` : ''}
</script>`

  return { code, language: 'vue', imports: [] }
}

// ─── Angular Material ─────────────────────────────────────────────────────────

export function generateAngularToast(config: ToastConfig): GeneratorOutput {
  const { variant, position, title, message, autoDismiss, duration, showAction, actionLabel } = config

  const panelClass: Record<ToastVariant, string> = {
    default: 'snackbar-default',
    info: 'snackbar-info',
    success: 'snackbar-success',
    warning: 'snackbar-warning',
    danger: 'snackbar-error',
  }

  const verticalPosition = position.startsWith('top') ? 'top' : 'bottom'
  const horizontalPosition = position.includes('left') ? 'start' : position.includes('right') ? 'end' : 'center'

  const imports = [
    `import { Component, inject } from "@angular/core"`,
    `import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar"`,
    `import { MatButtonModule } from "@angular/material/button"`,
  ]

  const code = `${imports.join('\n')}

@Component({
  selector: "app-toast-demo",
  standalone: true,
  imports: [MatSnackBarModule, MatButtonModule],
  template: \`
    <button mat-stroked-button (click)="showToast()">Show toast</button>
  \`,
  styles: [\`
    :host ::ng-deep .snackbar-success { --mdc-snackbar-container-color: #16a34a; }
    :host ::ng-deep .snackbar-error { --mdc-snackbar-container-color: #dc2626; }
    :host ::ng-deep .snackbar-warning { --mdc-snackbar-container-color: #d97706; }
    :host ::ng-deep .snackbar-info { --mdc-snackbar-container-color: #2563eb; }
  \`]
})
export class ToastDemoComponent {
  private snackBar = inject(MatSnackBar)

  showToast() {
    this.snackBar.open(
      "${title} — ${message}",
      ${showAction ? `"${actionLabel}"` : 'undefined'},
      {
        duration: ${autoDismiss ? duration : 0},
        horizontalPosition: "${horizontalPosition}",
        verticalPosition: "${verticalPosition}",
        panelClass: ["${panelClass[variant]}"],
      }
    )${showAction ? `.onAction().subscribe(() => {
      console.log("action clicked")
    })` : ''}
  }
}`

  return { code, language: 'typescript', imports }
}

// ─── Tailwind ─────────────────────────────────────────────────────────────────

export function generateTailwindToast(config: ToastConfig): GeneratorOutput {
  const { variant, position, title, message, autoDismiss, duration, showProgress, showAction, actionLabel, showCloseButton, showIcon } = config

  const variantStyles: Record<ToastVariant, { container: string; icon: string; progress: string; action: string }> = {
    default: { container: 'bg-gray-900 border-gray-800 text-white', icon: 'text-gray-400', progress: 'bg-gray-500', action: 'text-gray-300 hover:text-white' },
    info: { container: 'bg-white border-gray-200 text-gray-900', icon: 'text-blue-500', progress: 'bg-blue-500', action: 'text-blue-600 hover:text-blue-800' },
    success: { container: 'bg-white border-gray-200 text-gray-900', icon: 'text-green-500', progress: 'bg-green-500', action: 'text-green-600 hover:text-green-800' },
    warning: { container: 'bg-white border-gray-200 text-gray-900', icon: 'text-amber-500', progress: 'bg-amber-500', action: 'text-amber-600 hover:text-amber-800' },
    danger: { container: 'bg-white border-gray-200 text-gray-900', icon: 'text-red-500', progress: 'bg-red-500', action: 'text-red-600 hover:text-red-800' },
  }

  const positionStyles: Record<ToastPosition, string> = {
    'top-left': 'top-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
    'bottom-right': 'bottom-4 right-4',
  }

  const iconSvg: Record<ToastVariant, string> = {
    default: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
    info: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
    success: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
    warning: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    danger: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
  }

  const s = variantStyles[variant]
  const posClass = positionStyles[position]

  const imports = [`import { useState, useEffect, useRef } from "react"`]

  const code = `${imports.join('\n')}

// Add <ToastContainer /> once at the root of your app
// Then call showToast() from anywhere

interface Toast {
  id: number
  title: string
  message: string
}

let toastId = 0
const listeners: Set<(t: Toast) => void> = new Set()

export function showToast() {
  const toast = { id: ++toastId, title: "${title}", message: "${message}" }
  listeners.forEach((fn) => fn(toast))
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    const handler = (toast: Toast) => {
      setToasts((prev) => [...prev, toast])
      ${autoDismiss ? `setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id))
      }, ${duration})` : ''}
    }
    listeners.add(handler)
    return () => { listeners.delete(handler) }
  }, [])

  if (!toasts.length) return null

  return (
    <div className="fixed ${posClass} z-50 flex flex-col gap-2" aria-live="polite" aria-atomic="false" aria-label="Notifications">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onDismiss={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
        />
      ))}
    </div>
  )
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  ${autoDismiss && showProgress ? `const [progress, setProgress] = useState(100)

  useEffect(() => {
    const interval = setInterval(() => setProgress((p) => Math.max(0, p - (100 / (${duration} / 50)))), 50)
    return () => clearInterval(interval)
  }, [])` : ''}

  return (
    <div className="w-72 overflow-hidden rounded-lg border shadow-lg ${s.container}" role="status" aria-live="polite">
      <div className="flex items-start gap-3 px-4 py-3">
        ${showIcon ? `<span className="mt-0.5 flex-shrink-0 ${s.icon}" aria-hidden="true">
          ${iconSvg[variant]}
        </span>` : ''}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold">{toast.title}</p>
          <p className="mt-0.5 text-xs opacity-80">{toast.message}</p>
          ${showAction ? `<button
            onClick={() => { console.log("action clicked"); onDismiss() }}
            className="mt-1.5 text-xs font-medium underline ${s.action}"
          >
            ${actionLabel}
          </button>` : ''}
        </div>
        ${showCloseButton ? `<button onClick={onDismiss} aria-label="Dismiss notification" className="flex-shrink-0 rounded p-0.5 opacity-60 hover:opacity-100">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>` : ''}
      </div>
      ${autoDismiss && showProgress ? `<div className="h-0.5 bg-black/10">
        <div className="h-full ${s.progress} transition-none" style={{ width: \`\${progress}%\` }} />
      </div>` : ''}
    </div>
  )
}

// Usage example:
// 1. Add <ToastContainer /> to your app root
// 2. Call showToast() from any event handler:
// <button onClick={showToast}>Show toast</button>`

  return { code, language: 'tsx', imports }
}
