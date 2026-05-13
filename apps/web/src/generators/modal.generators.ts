import type { ModalConfig, ModalAlertVariant } from '@/stores/builder.store'
import type { GeneratorOutput } from './types'

// ─── Shared helpers ───────────────────────────────────────────────────────────

const SIZE_MAP = {
  shadcn: { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', full: 'max-w-full' },
  mui: { sm: 'sm', md: 'md', lg: 'lg', full: false },
  tailwind: { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', full: 'max-w-full' },
}

const ALERT_ICON: Record<ModalAlertVariant, string> = {
  info: 'Info',
  success: 'CheckCircle',
  warning: 'AlertTriangle',
  danger: 'AlertCircle',
}

const ALERT_COLOR: Record<ModalAlertVariant, string> = {
  info: 'text-blue-500',
  success: 'text-green-500',
  warning: 'text-amber-500',
  danger: 'text-red-500',
}

const MUI_ALERT_SEVERITY: Record<ModalAlertVariant, string> = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  danger: 'error',
}

// ─── shadcn/ui ────────────────────────────────────────────────────────────────

export function generateShadcnModal(config: ModalConfig): GeneratorOutput {
  const { modalType, title, description, size, showCloseButton, showFooter, actions, alertVariant, showIcon } = config

  const sizeClass = SIZE_MAP.shadcn[size]
  const iconName = ALERT_ICON[alertVariant]
  const iconColor = ALERT_COLOR[alertVariant]

  const imports = [
    `import { useState } from "react"`,
    `import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"`,
    `import { Button } from "@/components/ui/button"`,
    ...(modalType === 'form' ? [`import { Input } from "@/components/ui/input"`, `import { Label } from "@/components/ui/label"`] : []),
    ...(modalType === 'alert' && showIcon ? [`import { ${iconName} } from "lucide-react"`] : []),
  ]

  const footerCode = showFooter && actions.length
    ? `      <DialogFooter>
        ${actions.map((a) => `<Button variant="${a.variant === 'primary' ? 'default' : a.variant === 'danger' ? 'destructive' : a.variant === 'ghost' ? 'ghost' : 'outline'}" onClick={() => setOpen(false)}>${a.label}</Button>`).join('\n        ')}
      </DialogFooter>`
    : ''

  let bodyCode = ''

  if (modalType === 'form') {
    bodyCode = `      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" placeholder="John Doe" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" />
        </div>
      </div>`
  } else if (modalType === 'alert') {
    bodyCode = showIcon
      ? `      <div className="flex items-start gap-3 py-2">
        <${iconName} className="mt-0.5 flex-shrink-0 ${iconColor}" size={20} />
        <DialogDescription>${description}</DialogDescription>
      </div>`
      : `      <DialogDescription className="py-2">${description}</DialogDescription>`
  } else {
    bodyCode = `      <DialogDescription className="py-2">${description}</DialogDescription>`
  }

  const code = `${imports.join('\n')}

export function ${title.replace(/\s+/g, '')}Modal() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Open ${title}</Button>
      </DialogTrigger>
      <DialogContent className="${sizeClass}"${!showCloseButton ? ' hideCloseButton' : ''}>
        <DialogHeader>
          <DialogTitle>${title}</DialogTitle>
        </DialogHeader>
${bodyCode}
${footerCode}
      </DialogContent>
    </Dialog>
  )
}`

  return { code, language: 'tsx', imports }
}

// ─── Material UI ──────────────────────────────────────────────────────────────

export function generateMuiModal(config: ModalConfig): GeneratorOutput {
  const { modalType, title, description, size, showCloseButton, showFooter, actions, alertVariant, showIcon } = config

  const maxWidth = SIZE_MAP.mui[size]

  const imports = [
    `import { useState } from "react"`,
    `import Dialog from "@mui/material/Dialog"`,
    `import DialogTitle from "@mui/material/DialogTitle"`,
    `import DialogContent from "@mui/material/DialogContent"`,
    `import DialogContentText from "@mui/material/DialogContentText"`,
    `import DialogActions from "@mui/material/DialogActions"`,
    `import Button from "@mui/material/Button"`,
    ...(showCloseButton ? [`import IconButton from "@mui/material/IconButton"`, `import CloseIcon from "@mui/icons-material/Close"`] : []),
    ...(modalType === 'alert' && showIcon ? [`import Alert from "@mui/material/Alert"`] : []),
    ...(modalType === 'form' ? [`import TextField from "@mui/material/TextField"`, `import Box from "@mui/material/Box"`] : []),
  ]

  let bodyCode = ''

  if (modalType === 'form') {
    bodyCode = `        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
          <TextField label="Full name" placeholder="John Doe" fullWidth />
          <TextField label="Email" type="email" placeholder="you@example.com" fullWidth />
        </Box>`
  } else if (modalType === 'alert' && showIcon) {
    bodyCode = `        <Alert severity="${MUI_ALERT_SEVERITY[alertVariant]}">${description}</Alert>`
  } else {
    bodyCode = `        <DialogContentText>${description}</DialogContentText>`
  }

  const footerCode = showFooter && actions.length
    ? `      <DialogActions>
        ${actions.map((a) => `<Button onClick={handleClose} color="${a.variant === 'danger' ? 'error' : a.variant === 'primary' ? 'primary' : 'inherit'}" variant="${a.variant === 'primary' || a.variant === 'danger' ? 'contained' : 'text'}">${a.label}</Button>`).join('\n        ')}
      </DialogActions>`
    : ''

  const code = `${imports.join('\n')}

export function ${title.replace(/\s+/g, '')}Modal() {
  const [open, setOpen] = useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <>
      <Button variant="outlined" onClick={handleOpen}>Open ${title}</Button>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="${maxWidth || 'lg'}"
        fullWidth${size === 'full' ? '\n        fullScreen' : ''}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          ${title}
          ${showCloseButton ? `<IconButton size="small" onClick={handleClose}><CloseIcon fontSize="small" /></IconButton>` : ''}
        </DialogTitle>
        <DialogContent>
${bodyCode}
        </DialogContent>
${footerCode}
      </Dialog>
    </>
  )
}`

  return { code, language: 'tsx', imports }
}

// ─── Vuetify ──────────────────────────────────────────────────────────────────

export function generateVuetifyModal(config: ModalConfig): GeneratorOutput {
  const { modalType, title, description, size, showCloseButton, showFooter, actions, alertVariant, showIcon } = config

  const widthMap = { sm: '400', md: '560', lg: '720', full: '100%' }
  const width = widthMap[size]

  const alertSeverity = MUI_ALERT_SEVERITY[alertVariant]

  let bodyCode = ''

  if (modalType === 'form') {
    bodyCode = `      <v-text-field label="Full name" placeholder="John Doe" variant="outlined" class="mb-3" />
      <v-text-field label="Email" type="email" placeholder="you@example.com" variant="outlined" />`
  } else if (modalType === 'alert' && showIcon) {
    bodyCode = `      <v-alert type="${alertSeverity}" variant="tonal">${description}</v-alert>`
  } else {
    bodyCode = `      <p>${description}</p>`
  }

  const footerCode = showFooter && actions.length
    ? `    <v-card-actions class="justify-end pa-4 pt-0">
      ${actions.map((a) => `<v-btn variant="${a.variant === 'primary' ? 'flat' : a.variant === 'ghost' ? 'text' : 'outlined'}" color="${a.variant === 'danger' ? 'error' : a.variant === 'primary' ? 'primary' : 'default'}" @click="dialog = false">${a.label}</v-btn>`).join('\n      ')}
    </v-card-actions>`
    : ''

  const code = `<template>
  <v-dialog v-model="dialog" width="${width}"${size === 'full' ? ' fullscreen' : ''}>
    <template #activator="{ props }">
      <v-btn v-bind="props" variant="outlined">Open ${title}</v-btn>
    </template>

    <v-card>
      <v-card-title class="d-flex justify-space-between align-center pa-4">
        <span>${title}</span>
        ${showCloseButton ? `<v-btn icon="mdi-close" variant="text" size="small" @click="dialog = false" />` : ''}
      </v-card-title>

      <v-card-text>
${bodyCode}
      </v-card-text>

${footerCode}
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue"
const dialog = ref(false)
</script>`

  return { code, language: 'vue', imports: [] }
}

// ─── Angular Material ─────────────────────────────────────────────────────────

export function generateAngularModal(config: ModalConfig): GeneratorOutput {
  const { modalType, title, description, size, showFooter, actions, alertVariant, showIcon } = config

  const widthMap = { sm: '400px', md: '560px', lg: '720px', full: '100vw' }
  const width = widthMap[size]
  const componentName = title.replace(/\s+/g, '')
  const alertSeverity = MUI_ALERT_SEVERITY[alertVariant]

  const imports = [
    `import { Component, inject } from "@angular/core"`,
    `import { MatDialogModule, MatDialogRef, MatDialog } from "@angular/material/dialog"`,
    `import { MatButtonModule } from "@angular/material/button"`,
    ...(showCloseButton ? [`import { MatIconModule } from "@angular/material/icon"`] : []),
    ...(modalType === 'form' ? [`import { MatFormFieldModule } from "@angular/material/form-field"`, `import { MatInputModule } from "@angular/material/input"`] : []),
  ]

  const showCloseButton = config.showCloseButton

  let bodyCode = ''
  if (modalType === 'form') {
    bodyCode = `
        <mat-form-field appearance="outline" class="w-full mb-3">
          <mat-label>Full name</mat-label>
          <input matInput placeholder="John Doe" />
        </mat-form-field>
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Email</mat-label>
          <input matInput type="email" placeholder="you@example.com" />
        </mat-form-field>`
  } else if (modalType === 'alert' && showIcon) {
    bodyCode = `\n        <p class="text-${alertSeverity === 'error' ? 'red' : alertSeverity}-600">${description}</p>`
  } else {
    bodyCode = `\n        <p>${description}</p>`
  }

  const footerCode = showFooter && actions.length
    ? `\n      <mat-dialog-actions align="end">
        ${actions.map((a) => `<button mat-${a.variant === 'primary' || a.variant === 'danger' ? 'flat-button' : a.variant === 'ghost' ? 'button' : 'stroked-button'} color="${a.variant === 'danger' ? 'warn' : a.variant === 'primary' ? 'primary' : ''}" mat-dialog-close>${a.label}</button>`).join('\n        ')}
      </mat-dialog-actions>`
    : ''

  const code = `${imports.join('\n')}

// ── Dialog component ──────────────────────────────────────────────────────────
@Component({
  selector: "app-${title.toLowerCase().replace(/\s+/g, '-')}-dialog",
  standalone: true,
  imports: [MatDialogModule, MatButtonModule${showCloseButton ? ', MatIconModule' : ''}${modalType === 'form' ? ', MatFormFieldModule, MatInputModule' : ''}],
  template: \`
    <mat-dialog-content>
      <div class="flex items-center justify-between mb-4">
        <h2 mat-dialog-title class="m-0">${title}</h2>
        ${showCloseButton ? `<button mat-icon-button mat-dialog-close><mat-icon>close</mat-icon></button>` : ''}
      </div>
      ${bodyCode}
    </mat-dialog-content>
    ${footerCode}
  \`,
})
export class ${componentName}DialogComponent {}

// ── Trigger component ─────────────────────────────────────────────────────────
@Component({
  selector: "app-${title.toLowerCase().replace(/\s+/g, '-')}-trigger",
  standalone: true,
  imports: [MatButtonModule],
  template: \`
    <button mat-stroked-button (click)="openDialog()">Open ${title}</button>
  \`,
})
export class ${componentName}TriggerComponent {
  private dialog = inject(MatDialog)

  openDialog() {
    this.dialog.open(${componentName}DialogComponent, {
      width: "${width}",${size === 'full' ? '\n      maxWidth: "100vw",\n      height: "100vh",' : ''}
    })
  }
}`

  return { code, language: 'typescript', imports }
}

// ─── Tailwind ─────────────────────────────────────────────────────────────────

export function generateTailwindModal(config: ModalConfig): GeneratorOutput {
  const { modalType, title, description, size, showCloseButton, closeOnBackdrop, showFooter, actions, alertVariant, showIcon } = config

  const sizeClass = SIZE_MAP.tailwind[size]
  const iconName = ALERT_ICON[alertVariant]

  const alertBgMap: Record<ModalAlertVariant, string> = {
    info: 'bg-blue-50 border-blue-200',
    success: 'bg-green-50 border-green-200',
    warning: 'bg-amber-50 border-amber-200',
    danger: 'bg-red-50 border-red-200',
  }
  const alertTextMap: Record<ModalAlertVariant, string> = {
    info: 'text-blue-700',
    success: 'text-green-700',
    warning: 'text-amber-700',
    danger: 'text-red-700',
  }

  let bodyCode = ''

  if (modalType === 'form') {
    bodyCode = `        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Full name</label>
            <input type="text" placeholder="John Doe" className="h-9 w-full rounded-md border border-gray-300 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input type="email" placeholder="you@example.com" className="h-9 w-full rounded-md border border-gray-300 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
        </div>`
  } else if (modalType === 'alert' && showIcon) {
    bodyCode = `        <div className="flex items-start gap-3 rounded-md border p-3 ${alertBgMap[alertVariant]}">
          <span className="${alertTextMap[alertVariant]}">⚠</span>
          <p className="text-sm ${alertTextMap[alertVariant]}">${description}</p>
        </div>`
  } else {
    bodyCode = `        <p className="text-sm text-gray-600">${description}</p>`
  }

  const footerCode = showFooter && actions.length
    ? `        <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
          ${actions.map((a) => {
            const cls = a.variant === 'primary'
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : a.variant === 'danger'
                ? 'bg-red-500 text-white hover:bg-red-600'
                : a.variant === 'ghost'
                  ? 'text-gray-600 hover:bg-gray-100'
                  : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
            return `<button onClick={handleClose} className="rounded-md px-4 py-2 text-sm font-medium transition-colors ${cls}">${a.label}</button>`
          }).join('\n          ')}
        </div>`
    : ''

  const imports = [`import { useState } from "react"`]

  const code = `${imports.join('\n')}

export function ${title.replace(/\s+/g, '')}Modal() {
  const [open, setOpen] = useState(false)

  const handleClose = () => setOpen(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        Open ${title}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            ${closeOnBackdrop ? 'onClick={handleClose}' : ''}
          />

          {/* Modal */}
          <div
            className="relative z-10 w-full ${sizeClass} rounded-lg border border-gray-200 bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <h2 className="text-base font-semibold text-gray-900">${title}</h2>
              ${showCloseButton ? `<button onClick={handleClose} className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>` : ''}
            </div>

            {/* Body */}
            <div className="px-5 py-4">
${bodyCode}
            </div>

            {/* Footer */}
${footerCode}
          </div>
        </div>
      )}
    </>
  )
}`

  return { code, language: 'tsx', imports }
}
