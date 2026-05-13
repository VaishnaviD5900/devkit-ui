import type { NavbarConfig } from '@/stores/builder.store'
import type { GeneratorOutput } from './types'

// ─── shadcn/ui ────────────────────────────────────────────────────────────────

export function generateShadcnNavbar(config: NavbarConfig): GeneratorOutput {
  const { brand, showLogo, variant, links, showAuthButtons, loginLabel, signupLabel, showSearch, sticky, showMobileMenu } = config

  const isDark = variant === 'dark'
  const navClass = isDark
    ? 'bg-neutral-900 border-neutral-800'
    : variant === 'transparent'
      ? 'bg-transparent'
      : 'bg-white border-b'

  const imports = [
    `import { useState } from "react"`,
    `import { Menu, X, Search${showLogo ? ', Zap' : ''} } from "lucide-react"`,
    `import { Button } from "@/components/ui/button"`,
    ...(showMobileMenu ? [`import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"`] : []),
    `import { cn } from "@/lib/utils"`,
  ]

  const linksJSX = links
    .map((l) => `          <a href="${l.href}" className={cn("text-sm transition-colors hover:text-foreground/80", "${l.active ? 'text-foreground font-medium' : 'text-foreground/60'}")}>${l.label}</a>`)
    .join('\n')

  const mobileLinksJSX = links
    .map((l) => `            <a href="${l.href}" className="block py-2 text-sm ${l.active ? 'font-medium text-foreground' : 'text-foreground/60'}">${l.label}</a>`)
    .join('\n')

  const code = `${imports.join('\n')}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className={cn("${navClass}", "${sticky ? 'sticky top-0 z-50' : ''}", "w-full")}>
      <div className="container mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        {/* Brand */}
        <a href="/" className="flex items-center gap-2 font-semibold">
          ${showLogo ? `<div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
            <Zap size={14} className="text-primary-foreground" />
          </div>` : ''}
          <span${isDark ? ' className="text-white"' : ''}>${brand}</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
${linksJSX}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          ${showSearch ? `<Button variant="ghost" size="icon">
            <Search className="h-4 w-4" />
          </Button>` : ''}
          ${showAuthButtons ? `<div className="hidden items-center gap-2 md:flex">
            <Button variant="ghost" size="sm">${loginLabel}</Button>
            <Button size="sm">${signupLabel}</Button>
          </div>` : ''}
          ${showMobileMenu ? `<Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <nav className="mt-6 flex flex-col gap-1">
${mobileLinksJSX}
              </nav>
              ${showAuthButtons ? `<div className="mt-6 flex flex-col gap-2 border-t pt-4">
                <Button variant="ghost" className="w-full justify-start">${loginLabel}</Button>
                <Button className="w-full">${signupLabel}</Button>
              </div>` : ''}
            </SheetContent>
          </Sheet>` : ''}
        </div>
      </div>
    </header>
  )
}`

  return { code, language: 'tsx', imports }
}

// ─── Material UI ──────────────────────────────────────────────────────────────

export function generateMuiNavbar(config: NavbarConfig): GeneratorOutput {
  const { brand, showLogo, variant, links, showAuthButtons, loginLabel, signupLabel, showSearch, sticky, showMobileMenu } = config

  const isDark = variant === 'dark'
  const color = isDark ? 'inherit' : variant === 'transparent' ? 'transparent' : 'default'

  const imports = [
    `import { useState } from "react"`,
    `import AppBar from "@mui/material/AppBar"`,
    `import Toolbar from "@mui/material/Toolbar"`,
    `import Typography from "@mui/material/Typography"`,
    `import Button from "@mui/material/Button"`,
    `import IconButton from "@mui/material/IconButton"`,
    ...(showMobileMenu ? [
      `import Drawer from "@mui/material/Drawer"`,
      `import List from "@mui/material/List"`,
      `import ListItem from "@mui/material/ListItem"`,
      `import ListItemButton from "@mui/material/ListItemButton"`,
      `import ListItemText from "@mui/material/ListItemText"`,
      `import MenuIcon from "@mui/icons-material/Menu"`,
    ] : []),
    ...(showSearch ? [`import SearchIcon from "@mui/icons-material/Search"`] : []),
    ...(showLogo ? [`import BoltIcon from "@mui/icons-material/Bolt"`] : []),
    `import Box from "@mui/material/Box"`,
  ]

  const code = `${imports.join('\n')}

export function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <>
      <AppBar position="${sticky ? 'sticky' : 'static'}" color="${color}"${isDark ? '' : ' elevation={0} sx={{ borderBottom: 1, borderColor: "divider" }}'}>
        <Toolbar sx={{ justifyContent: "space-between", maxWidth: "lg", width: "100%", mx: "auto", px: 2 }}>
          {/* Brand */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            ${showLogo ? `<BoltIcon color="primary" />` : ''}
            <Typography variant="h6" fontWeight="bold" component="a" href="/" sx={{ textDecoration: "none", color: "inherit" }}>
              ${brand}
            </Typography>
          </Box>

          {/* Desktop links */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 0.5 }}>
            ${links.map((l) => `<Button color="inherit" href="${l.href}" sx={{ fontWeight: ${l.active ? '"bold"' : '"normal"'}, opacity: ${l.active ? 1 : 0.7} }}>${l.label}</Button>`).join('\n            ')}
          </Box>

          {/* Right side */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            ${showSearch ? `<IconButton color="inherit"><SearchIcon /></IconButton>` : ''}
            ${showAuthButtons ? `<Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
              <Button color="inherit" variant="text">${loginLabel}</Button>
              <Button color="primary" variant="contained" size="small">${signupLabel}</Button>
            </Box>` : ''}
            ${showMobileMenu ? `<IconButton color="inherit" sx={{ display: { md: "none" } }} onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>` : ''}
          </Box>
        </Toolbar>
      </AppBar>

      ${showMobileMenu ? `<Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 250 }} role="presentation">
          <List>
            ${links.map((l) => `<ListItem disablePadding>
              <ListItemButton component="a" href="${l.href}" selected={${l.active}}>
                <ListItemText primary="${l.label}" />
              </ListItemButton>
            </ListItem>`).join('\n            ')}
          </List>
          ${showAuthButtons ? `<Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1 }}>
            <Button variant="outlined" fullWidth>${loginLabel}</Button>
            <Button variant="contained" fullWidth>${signupLabel}</Button>
          </Box>` : ''}
        </Box>
      </Drawer>` : ''}
    </>
  )
}`

  return { code, language: 'tsx', imports }
}

// ─── Vuetify ──────────────────────────────────────────────────────────────────

export function generateVuetifyNavbar(config: NavbarConfig): GeneratorOutput {
  const { brand, showLogo, variant, links, showAuthButtons, loginLabel, signupLabel, showSearch, sticky, showMobileMenu } = config

  const isDark = variant === 'dark'
  const color = isDark ? 'primary' : variant === 'transparent' ? 'transparent' : 'surface'

  const code = `<template>
  <v-app-bar ${sticky ? 'scroll-behavior="elevate"' : ''} color="${color}"${isDark ? ' theme="dark"' : ''}>
    <template #prepend>
      ${showLogo ? `<v-icon color="primary" class="ml-2">mdi-lightning-bolt</v-icon>` : ''}
    </template>

    <v-app-bar-title>
      <a href="/" class="text-decoration-none font-weight-bold" style="color: inherit">${brand}</a>
    </v-app-bar-title>

    <!-- Desktop links -->
    <div class="d-none d-md-flex align-center gap-1">
      ${links.map((l) => `<v-btn variant="text" href="${l.href}"${l.active ? ' color="primary"' : ' class="text-medium-emphasis"'}>${l.label}</v-btn>`).join('\n      ')}
    </div>

    <template #append>
      ${showSearch ? `<v-btn icon="mdi-magnify" variant="text" />` : ''}
      ${showAuthButtons ? `<div class="d-none d-md-flex align-center gap-2 mr-2">
        <v-btn variant="text">${loginLabel}</v-btn>
        <v-btn color="primary" variant="flat" size="small">${signupLabel}</v-btn>
      </div>` : ''}
      ${showMobileMenu ? `<v-app-bar-nav-icon class="d-md-none" @click="drawer = !drawer" />` : ''}
    </template>
  </v-app-bar>

  ${showMobileMenu ? `<v-navigation-drawer v-model="drawer" location="right" temporary>
    <v-list>
      ${links.map((l) => `<v-list-item href="${l.href}" title="${l.label}"${l.active ? ' color="primary"' : ''} />`).join('\n      ')}
    </v-list>
    ${showAuthButtons ? `<template #append>
      <div class="pa-3 d-flex flex-column gap-2">
        <v-btn variant="outlined" block>${loginLabel}</v-btn>
        <v-btn color="primary" variant="flat" block>${signupLabel}</v-btn>
      </div>
    </template>` : ''}
  </v-navigation-drawer>` : ''}
</template>

<script setup lang="ts">
import { ref } from "vue"
${showMobileMenu ? `const drawer = ref(false)` : ''}
</script>`

  return { code, language: 'vue', imports: [] }
}

// ─── Angular Material ─────────────────────────────────────────────────────────

export function generateAngularNavbar(config: NavbarConfig): GeneratorOutput {
  const { brand, showLogo, variant, links, showAuthButtons, loginLabel, signupLabel, showSearch, showMobileMenu } = config

  const isDark = variant === 'dark'
  const color = isDark ? 'primary' : variant === 'transparent' ? undefined : undefined

  const imports = [
    `import { Component } from "@angular/core"`,
    `import { MatToolbarModule } from "@angular/material/toolbar"`,
    `import { MatButtonModule } from "@angular/material/button"`,
    `import { MatIconModule } from "@angular/material/icon"`,
    ...(showMobileMenu ? [
      `import { MatSidenavModule } from "@angular/material/sidenav"`,
      `import { MatListModule } from "@angular/material/list"`,
    ] : []),
  ]

  const code = `${imports.join('\n')}

@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule${showMobileMenu ? ', MatSidenavModule, MatListModule' : ''}],
  template: \`
    ${showMobileMenu ? `<mat-sidenav-container>
      <mat-sidenav #sidenav mode="over" position="end">
        <mat-nav-list>
          ${links.map((l) => `<a mat-list-item href="${l.href}"${l.active ? ' activated' : ''}>${l.label}</a>`).join('\n          ')}
        </mat-nav-list>
        ${showAuthButtons ? `<div class="p-4 flex flex-col gap-2">
          <button mat-stroked-button class="w-full">${loginLabel}</button>
          <button mat-flat-button color="primary" class="w-full">${signupLabel}</button>
        </div>` : ''}
      </mat-sidenav>
      <mat-sidenav-content>` : ''}
        <mat-toolbar${color ? ` color="${color}"` : ''}${!isDark ? ' class="border-b border-gray-200 bg-white"' : ''}>
          <div class="flex w-full max-w-6xl mx-auto items-center justify-between">
            <div class="flex items-center gap-2">
              ${showLogo ? `<mat-icon color="primary">bolt</mat-icon>` : ''}
              <a href="/" class="font-bold text-lg no-underline" style="color: inherit">${brand}</a>
            </div>

            <nav class="hidden md:flex items-center gap-1">
              ${links.map((l) => `<a mat-button href="${l.href}"${l.active ? ' color="primary"' : ''}>${l.label}</a>`).join('\n              ')}
            </nav>

            <div class="flex items-center gap-2">
              ${showSearch ? `<button mat-icon-button><mat-icon>search</mat-icon></button>` : ''}
              ${showAuthButtons ? `<div class="hidden md:flex items-center gap-2">
                <button mat-button>${loginLabel}</button>
                <button mat-flat-button color="primary">${signupLabel}</button>
              </div>` : ''}
              ${showMobileMenu ? `<button mat-icon-button class="md:hidden" (click)="sidenav.toggle()">
                <mat-icon>menu</mat-icon>
              </button>` : ''}
            </div>
          </div>
        </mat-toolbar>
      ${showMobileMenu ? `</mat-sidenav-content>
    </mat-sidenav-container>` : ''}
  \`,
})
export class NavbarComponent {}`

  return { code, language: 'typescript', imports }
}

// ─── Tailwind ─────────────────────────────────────────────────────────────────

export function generateTailwindNavbar(config: NavbarConfig): GeneratorOutput {
  const { brand, showLogo, variant, links, showAuthButtons, loginLabel, signupLabel, showSearch, sticky, showMobileMenu } = config

  const isDark = variant === 'dark'
  const isTransparent = variant === 'transparent'

  const navBg = isDark ? 'bg-gray-900' : isTransparent ? 'bg-transparent' : 'bg-white border-b border-gray-200'
  const textBase = isDark || isTransparent ? 'text-gray-300' : 'text-gray-600'
  const textActive = isDark || isTransparent ? 'text-white font-medium' : 'text-gray-900 font-medium'
  const brandText = isDark || isTransparent ? 'text-white' : 'text-gray-900'

  const imports = [`import { useState } from "react"`]

  const code = `${imports.join('\n')}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="${navBg}${sticky ? ' sticky top-0 z-50' : ''}">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        {/* Brand */}
        <a href="/" className="flex items-center gap-2 no-underline">
          ${showLogo ? `<div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
          </div>` : ''}
          <span className="text-sm font-bold ${brandText}">${brand}</span>
        </a>

        {/* Desktop links */}
        <nav className="hidden items-center gap-1 md:flex">
          ${links.map((l) => `<a href="${l.href}" className="rounded-md px-3 py-1.5 text-sm transition-colors ${l.active ? textActive : `${textBase} hover:${isDark ? 'text-white bg-white/10' : 'text-gray-900 bg-gray-100'}`}">${l.label}</a>`).join('\n          ')}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          ${showSearch ? `<button className="rounded-md p-1.5 ${textBase} hover:bg-gray-100">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          </button>` : ''}
          ${showAuthButtons ? `<div className="hidden items-center gap-2 md:flex">
            <button className="rounded-md px-3 py-1.5 text-sm font-medium ${isDark || isTransparent ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:bg-gray-100'}">${loginLabel}</button>
            <button className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700">${signupLabel}</button>
          </div>` : ''}
          ${showMobileMenu ? `<button
            className="rounded-md p-1.5 md:hidden ${textBase}"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            )}
          </button>` : ''}
        </div>
      </div>

      {/* Mobile menu */}
      ${showMobileMenu ? `{mobileOpen && (
        <div className="${isDark ? 'bg-gray-900 border-t border-gray-800' : 'border-t border-gray-200 bg-white'} px-4 py-2 md:hidden">
          ${links.map((l) => `<a href="${l.href}" className="block rounded-md px-3 py-2 text-sm ${l.active ? textActive : textBase}">${l.label}</a>`).join('\n          ')}
          ${showAuthButtons ? `<div className="mt-2 flex flex-col gap-1 border-t ${isDark ? 'border-gray-800' : 'border-gray-100'} pt-2">
            <button className="rounded-md px-3 py-2 text-left text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}">${loginLabel}</button>
            <button className="rounded-md bg-blue-600 px-3 py-2 text-left text-sm font-medium text-white">${signupLabel}</button>
          </div>` : ''}
        </div>
      )}` : ''}
    </header>
  )
}`

  return { code, language: 'tsx', imports }
}
