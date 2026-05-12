import type { CardConfig } from '@/stores/builder.store'
import type { GeneratorOutput } from './types'

function reactActions(actions: CardConfig['actions']): string {
  return actions.map((a) =>
    `<button className="${a.variant === 'primary' ? 'rounded-md bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-700' : a.variant === 'ghost' ? 'px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-md' : 'rounded-md border border-gray-200 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50'}">${a.label}</button>`
  ).join('\n          ')
}

export function generateShadcnCard(config: CardConfig): GeneratorOutput {
  const { cardType, title, subtitle, description, showImage, showAvatar, showBadge, badgeText, showFooter, actions, stats } = config
  const name = title.replace(/\s+/g, '')

  const imports = [
    `import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"`,
    `import { Button } from "@/components/ui/button"`,
    `import { Badge } from "@/components/ui/badge"`,
    ...(cardType === 'stats' ? [`import { TrendingUp, TrendingDown, Minus } from "lucide-react"`] : []),
    ...(cardType === 'product' ? [`import { ShoppingCart, Star } from "lucide-react"`] : []),
  ]

  const btnVariant = (v: string) => v === 'primary' ? 'default' : v === 'ghost' ? 'ghost' : 'outline'

  let body = ''

  if (cardType === 'basic') {
    body = `
    <Card className="max-w-sm">
      ${showImage ? `<img src="/placeholder.jpg" alt="card" className="h-48 w-full rounded-t-lg object-cover" />` : ''}
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            ${showAvatar ? `<div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted font-semibold">${title.charAt(0)}</div>` : ''}
            <div><CardTitle className="text-base">${title}</CardTitle><CardDescription>${subtitle}</CardDescription></div>
          </div>
          ${showBadge ? `<Badge>${badgeText}</Badge>` : ''}
        </div>
      </CardHeader>
      <CardContent><p className="text-sm text-muted-foreground">${description}</p></CardContent>
      ${showFooter && actions.length ? `<CardFooter className="justify-end gap-2">${actions.map((a) => `<Button variant="${btnVariant(a.variant)}">${a.label}</Button>`).join('')}</CardFooter>` : ''}
    </Card>`
  }

  if (cardType === 'profile') {
    body = `
    <Card className="max-w-sm overflow-hidden">
      <div className="h-20 bg-gradient-to-r from-primary/60 to-primary" />
      <CardHeader className="-mt-8">
        <div className="flex items-end justify-between">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-background bg-muted text-xl font-bold">${title.charAt(0)}</div>
          ${showBadge ? `<Badge variant="secondary">${badgeText}</Badge>` : ''}
        </div>
        <CardTitle>${title}</CardTitle>
        <CardDescription>${subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">${description}</p>
        <div className="mt-4 flex gap-4 border-t pt-3 text-center text-sm">
          <div><p className="font-semibold">128</p><p className="text-muted-foreground text-xs">Posts</p></div>
          <div><p className="font-semibold">4.2k</p><p className="text-muted-foreground text-xs">Followers</p></div>
          <div><p className="font-semibold">312</p><p className="text-muted-foreground text-xs">Following</p></div>
        </div>
      </CardContent>
      ${showFooter && actions.length ? `<CardFooter className="gap-2">${actions.map((a) => `<Button variant="${btnVariant(a.variant)}">${a.label}</Button>`).join('')}</CardFooter>` : ''}
    </Card>`
  }

  if (cardType === 'stats') {
    body = `
    <div>
      <h2 className="mb-4 text-lg font-semibold">${title}</h2>
      <div className="grid grid-cols-2 gap-4">
        ${stats.map((s) => `<Card>
          <CardHeader className="pb-2">
            <CardDescription>${s.label}</CardDescription>
            <CardTitle className="text-2xl">${s.value}</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="flex items-center gap-1 text-xs ${s.trend === 'up' ? 'text-green-600' : s.trend === 'down' ? 'text-destructive' : 'text-muted-foreground'}">
              ${s.trend === 'up' ? '<TrendingUp size={12} />' : s.trend === 'down' ? '<TrendingDown size={12} />' : '<Minus size={12} />'}
              ${s.change} from last month
            </span>
          </CardContent>
        </Card>`).join('\n        ')}
      </div>
    </div>`
  }

  if (cardType === 'product') {
    body = `
    <Card className="max-w-xs overflow-hidden">
      <div className="relative">
        <img src="/placeholder.jpg" alt="${title}" className="h-48 w-full object-cover" />
        ${showBadge ? `<Badge className="absolute left-3 top-3 bg-destructive">${badgeText}</Badge>` : ''}
      </div>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div><CardTitle className="text-base">${title}</CardTitle><CardDescription>${subtitle}</CardDescription></div>
          <div className="flex items-center gap-1 text-amber-400"><Star size={14} fill="currentColor" /><span className="text-xs font-medium text-foreground">4.8</span></div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">${description}</p>
        <div className="mt-3 flex items-center gap-3"><span className="text-xl font-bold">$49.99</span><span className="text-sm text-muted-foreground line-through">$79.99</span></div>
      </CardContent>
      <CardFooter className="gap-2">
        ${actions.length ? actions.map((a) => `<Button variant="${btnVariant(a.variant)}">${a.label}</Button>`).join('') : `<Button className="w-full"><ShoppingCart size={16} className="mr-2" />Add to cart</Button>`}
      </CardFooter>
    </Card>`
  }

  const code = `${imports.join('\n')}

export function ${name}Card() {
  return (${body}
  )
}`
  return { code, language: 'tsx', imports }
}

export function generateMuiCard(config: CardConfig): GeneratorOutput {
  const { cardType, title, subtitle, description, showBadge, badgeText, showFooter, actions, stats } = config
  const name = title.replace(/\s+/g, '')

  const imports = [
    `import Card from "@mui/material/Card"`,
    `import CardContent from "@mui/material/CardContent"`,
    `import CardHeader from "@mui/material/CardHeader"`,
    `import CardActions from "@mui/material/CardActions"`,
    `import Typography from "@mui/material/Typography"`,
    `import Button from "@mui/material/Button"`,
    ...(showBadge ? [`import Chip from "@mui/material/Chip"`] : []),
    ...(cardType === 'stats' ? [`import Box from "@mui/material/Box"`, `import Grid from "@mui/material/Grid2"`] : []),
    ...(cardType === 'product' ? [`import CardMedia from "@mui/material/CardMedia"`] : []),
  ]

  const muiBtn = (a: CardConfig['actions'][0]) =>
    `<Button variant="${a.variant === 'primary' ? 'contained' : a.variant === 'ghost' ? 'text' : 'outlined'}">${a.label}</Button>`

  let body = ''

  if (cardType === 'basic' || cardType === 'profile') {
    body = `
    <Card sx={{ maxWidth: 400 }}>
      <CardHeader
        title="${title}"
        subheader="${subtitle}"
        action={${showBadge ? `<Chip label="${badgeText}" size="small" />` : 'undefined'}}
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">${description}</Typography>
      </CardContent>
      ${showFooter && actions.length ? `<CardActions sx={{ justifyContent: "flex-end" }}>${actions.map(muiBtn).join('')}</CardActions>` : ''}
    </Card>`
  }

  if (cardType === 'stats') {
    body = `
    <Box>
      <Typography variant="h6" gutterBottom>${title}</Typography>
      <Grid container spacing={2}>
        ${stats.map((s) => `<Grid size={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="caption" color="text.secondary">${s.label}</Typography>
              <Typography variant="h4" fontWeight="bold">${s.value}</Typography>
              <Typography variant="caption" color="${s.trend === 'up' ? 'success.main' : s.trend === 'down' ? 'error.main' : 'text.secondary'}">${s.change} from last month</Typography>
            </CardContent>
          </Card>
        </Grid>`).join('\n        ')}
      </Grid>
    </Box>`
  }

  if (cardType === 'product') {
    body = `
    <Card sx={{ maxWidth: 320 }}>
      <CardMedia component="img" height="200" image="/placeholder.jpg" alt="${title}" />
      <CardHeader title="${title}" subheader="${subtitle}" action={${showBadge ? `<Chip label="${badgeText}" color="error" size="small" />` : 'undefined'}} />
      <CardContent>
        <Typography variant="body2" color="text.secondary">${description}</Typography>
        <Box sx={{ display: "flex", gap: 1, mt: 1, alignItems: "center" }}>
          <Typography variant="h6" fontWeight="bold">$49.99</Typography>
          <Typography sx={{ textDecoration: "line-through" }} color="text.secondary">$79.99</Typography>
        </Box>
      </CardContent>
      <CardActions>${actions.length ? actions.map(muiBtn).join('') : `<Button variant="contained" fullWidth>Add to cart</Button>`}</CardActions>
    </Card>`
  }

  const code = `${imports.join('\n')}

export function ${name}Card() {
  return (${body}
  )
}`
  return { code, language: 'tsx', imports }
}

export function generateVuetifyCard(config: CardConfig): GeneratorOutput {
  const { cardType, title, subtitle, description, showImage, showBadge, badgeText, showFooter, actions, stats } = config

  const vBtn = (a: CardConfig['actions'][0]) =>
    `<v-btn variant="${a.variant === 'primary' ? 'flat' : a.variant === 'ghost' ? 'text' : 'outlined'}" color="${a.variant === 'primary' ? 'primary' : 'default'}">${a.label}</v-btn>`

  let template = ''

  if (cardType === 'basic' || cardType === 'profile') {
    template = `
  <v-card max-width="400">
    ${showImage ? `<v-img src="/placeholder.jpg" height="200" cover />` : ''}
    <v-card-title>${title}</v-card-title>
    <v-card-subtitle>${subtitle}</v-card-subtitle>
    ${showBadge ? `<div class="px-4 pb-2"><v-chip size="small">${badgeText}</v-chip></div>` : ''}
    <v-card-text>${description}</v-card-text>
    ${showFooter && actions.length ? `<v-card-actions><v-spacer />${actions.map(vBtn).join('')}</v-card-actions>` : ''}
  </v-card>`
  }

  if (cardType === 'stats') {
    template = `
  <div>
    <p class="text-h6 mb-4">${title}</p>
    <v-row>
      ${stats.map((s) => `<v-col cols="6"><v-card variant="outlined"><v-card-text>
        <div class="text-caption text-medium-emphasis">${s.label}</div>
        <div class="text-h4 font-weight-bold">${s.value}</div>
        <div class="text-caption ${s.trend === 'up' ? 'text-success' : s.trend === 'down' ? 'text-error' : ''}">${s.change} from last month</div>
      </v-card-text></v-card></v-col>`).join('\n      ')}
    </v-row>
  </div>`
  }

  if (cardType === 'product') {
    template = `
  <v-card max-width="320">
    <v-img src="/placeholder.jpg" height="200" cover>
      ${showBadge ? `<div class="pa-2"><v-chip color="error" size="small">${badgeText}</v-chip></div>` : ''}
    </v-img>
    <v-card-title>${title}</v-card-title>
    <v-card-subtitle>${subtitle}</v-card-subtitle>
    <v-card-text>
      <p>${description}</p>
      <div class="d-flex align-center gap-2 mt-2">
        <span class="text-h6 font-weight-bold">$49.99</span>
        <span class="text-decoration-line-through text-medium-emphasis">$79.99</span>
      </div>
    </v-card-text>
    <v-card-actions>${actions.length ? actions.map(vBtn).join('') : `<v-btn variant="flat" color="primary" block>Add to cart</v-btn>`}</v-card-actions>
  </v-card>`
  }

  const code = `<template>${template}
</template>

<script setup lang="ts">
// ${title} ${cardType} card
</script>`
  return { code, language: 'vue', imports: [] }
}

export function generateAngularCard(config: CardConfig): GeneratorOutput {
  const { cardType, title, subtitle, description, showBadge, badgeText, showFooter, actions, stats } = config
  const name = title.replace(/\s+/g, '')

  const imports = [
    `import { Component } from "@angular/core"`,
    `import { MatCardModule } from "@angular/material/card"`,
    `import { MatButtonModule } from "@angular/material/button"`,
    ...(showBadge || cardType === 'stats' ? [] : []),
    ...(cardType === 'stats' ? [`import { MatGridListModule } from "@angular/material/grid-list"`] : []),
  ]

  const angBtn = (a: CardConfig['actions'][0]) =>
    `<button mat-${a.variant === 'primary' ? 'flat-button color="primary"' : a.variant === 'ghost' ? 'button' : 'stroked-button'}>${a.label}</button>`

  let template = ''

  if (cardType === 'basic' || cardType === 'profile') {
    template = `
    <mat-card style="max-width: 400px">
      <mat-card-header>
        <mat-card-title>${title}</mat-card-title>
        <mat-card-subtitle>${subtitle}</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content><p>${description}</p></mat-card-content>
      ${showFooter && actions.length ? `<mat-card-actions align="end">${actions.map(angBtn).join('')}</mat-card-actions>` : ''}
    </mat-card>`
  }

  if (cardType === 'stats') {
    template = `
    <div>
      <h2 class="mat-headline-6">${title}</h2>
      <mat-grid-list cols="2" rowHeight="160px" gutterSize="16">
        ${stats.map((s) => `<mat-grid-tile><mat-card class="w-full h-full"><mat-card-content>
          <p class="mat-body-2 text-secondary">${s.label}</p>
          <p class="mat-headline-4">${s.value}</p>
          <p class="mat-caption">${s.change} from last month</p>
        </mat-card-content></mat-card></mat-grid-tile>`).join('\n        ')}
      </mat-grid-list>
    </div>`
  }

  if (cardType === 'product') {
    template = `
    <mat-card style="max-width: 320px">
      <img mat-card-image src="/placeholder.jpg" alt="${title}" />
      <mat-card-header>
        <mat-card-title>${title}</mat-card-title>
        <mat-card-subtitle>${subtitle}</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <p>${description}</p>
        <p><strong>$49.99</strong> <s style="color: gray">$79.99</s></p>
      </mat-card-content>
      <mat-card-actions>${actions.length ? actions.map(angBtn).join('') : `<button mat-flat-button color="primary" style="width:100%">Add to cart</button>`}</mat-card-actions>
    </mat-card>`
  }

  const code = `${imports.join('\n')}

@Component({
  selector: "app-${title.toLowerCase().replace(/\s+/g, '-')}-card",
  standalone: true,
  imports: [MatCardModule, MatButtonModule${cardType === 'stats' ? ', MatGridListModule' : ''}],
  template: \`${template}
  \`,
})
export class ${name}CardComponent {}`
  return { code, language: 'typescript', imports }
}

export function generateTailwindCard(config: CardConfig): GeneratorOutput {
  const { cardType, title, subtitle, description, showImage, showBadge, badgeText, showFooter, actions, stats, shadow, rounded } = config
  const name = title.replace(/\s+/g, '')

  const shadowCls = { none: '', sm: 'shadow-sm', md: 'shadow-md', lg: 'shadow-lg' }[shadow]
  const roundedCls = { none: '', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', xl: 'rounded-xl' }[rounded]
  const base = `border border-gray-200 bg-white ${shadowCls} ${roundedCls}`.trim()

  const twBtn = (a: CardConfig['actions'][0]) =>
    `<button className="${a.variant === 'primary' ? 'rounded-md bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-700' : a.variant === 'ghost' ? 'rounded-md px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100' : 'rounded-md border border-gray-200 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50'}">${a.label}</button>`

  let body = ''

  if (cardType === 'basic') {
    body = `
    <div className="${base} max-w-sm">
      ${showImage ? `<img src="/placeholder.jpg" alt="${title}" className="h-48 w-full object-cover" />` : ''}
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div><h3 className="text-sm font-semibold text-gray-900">${title}</h3><p className="text-xs text-gray-500">${subtitle}</p></div>
          ${showBadge ? `<span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-600">${badgeText}</span>` : ''}
        </div>
        <p className="mt-3 text-xs leading-relaxed text-gray-600">${description}</p>
      </div>
      ${showFooter && actions.length ? `<div className="flex justify-end gap-2 border-t border-gray-100 px-5 py-3">${actions.map(twBtn).join('')}</div>` : ''}
    </div>`
  }

  if (cardType === 'profile') {
    body = `
    <div className="${base} max-w-sm overflow-hidden">
      <div className="h-20 bg-gradient-to-r from-blue-400 to-blue-600" />
      <div className="px-5 pb-5">
        <div className="-mt-8 flex items-end justify-between">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-blue-100 text-xl font-bold text-blue-600">${title.charAt(0)}</div>
          ${showBadge ? `<span className="rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-medium text-green-600">${badgeText}</span>` : ''}
        </div>
        <h3 className="mt-3 text-sm font-semibold text-gray-900">${title}</h3>
        <p className="text-xs text-gray-500">${subtitle}</p>
        <p className="mt-2 text-xs leading-relaxed text-gray-600">${description}</p>
        <div className="mt-4 flex gap-4 border-t border-gray-100 pt-3 text-center text-xs">
          <div><p className="font-semibold text-gray-800">128</p><p className="text-gray-400">Posts</p></div>
          <div><p className="font-semibold text-gray-800">4.2k</p><p className="text-gray-400">Followers</p></div>
          <div><p className="font-semibold text-gray-800">312</p><p className="text-gray-400">Following</p></div>
        </div>
      </div>
      ${showFooter && actions.length ? `<div className="flex gap-2 border-t border-gray-100 px-5 py-3">${actions.map(twBtn).join('')}</div>` : ''}
    </div>`
  }

  if (cardType === 'stats') {
    body = `
    <div>
      <h2 className="mb-4 text-lg font-semibold text-gray-900">${title}</h2>
      <div className="grid grid-cols-2 gap-4">
        ${stats.map((s) => `<div className="${base} p-5">
          <p className="text-xs text-gray-500">${s.label}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">${s.value}</p>
          <p className="mt-1 text-[11px] font-medium ${s.trend === 'up' ? 'text-green-600' : s.trend === 'down' ? 'text-red-500' : 'text-gray-400'}">${s.change} from last month</p>
        </div>`).join('\n        ')}
      </div>
    </div>`
  }

  if (cardType === 'product') {
    body = `
    <div className="${base} max-w-xs overflow-hidden">
      <div className="relative">
        <img src="/placeholder.jpg" alt="${title}" className="h-48 w-full object-cover" />
        ${showBadge ? `<span className="absolute left-3 top-3 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-medium text-white">${badgeText}</span>` : ''}
      </div>
      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-900">${title}</h3>
        <p className="text-xs text-gray-500">${subtitle}</p>
        <p className="mt-2 text-xs leading-relaxed text-gray-500">${description}</p>
        <div className="mt-3 flex items-center gap-3">
          <span className="text-lg font-bold text-gray-900">$49.99</span>
          <span className="text-xs text-gray-400 line-through">$79.99</span>
        </div>
      </div>
      <div className="flex gap-2 border-t border-gray-100 p-4">
        ${actions.length ? actions.map(twBtn).join('') : `<button className="w-full rounded-md bg-blue-600 py-2 text-xs font-medium text-white hover:bg-blue-700">Add to cart</button>`}
      </div>
    </div>`
  }

  const code = `export function ${name}Card() {
  return (${body}
  )
}`
  return { code, language: 'tsx', imports: [] }
}
