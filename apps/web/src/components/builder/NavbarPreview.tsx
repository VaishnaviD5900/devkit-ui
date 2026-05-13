import { useState } from 'react'
import { Menu, X, Search, Zap } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useBuilderStore } from '@/stores/builder.store'

export function NavbarPreview() {
  const { navbarConfig } = useBuilderStore()
  const { brand, showLogo, variant, links, showAuthButtons, loginLabel, signupLabel, showSearch, showMobileMenu } = navbarConfig
  const [mobileOpen, setMobileOpen] = useState(false)

  const isDark = variant === 'dark'
  const isTransparent = variant === 'transparent'

  const navBg = isDark
    ? 'bg-neutral-900 border-neutral-800'
    : isTransparent
      ? 'bg-transparent border-transparent'
      : 'bg-white border-neutral-200'

  const textColor = isDark ? 'text-neutral-100' : 'text-neutral-700'
  const textMuted = isDark ? 'text-neutral-400' : 'text-neutral-500'
  const activeColor = isDark ? 'text-white font-medium' : 'text-neutral-900 font-medium'
  const hoverBg = isDark ? 'hover:bg-neutral-800' : 'hover:bg-neutral-50'
  const mobileBg = isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200'

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-neutral-100">
      <div className="flex h-10 flex-shrink-0 items-center gap-2 border-b border-neutral-200 bg-white px-4">
        <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
        <span className="text-xs font-medium text-neutral-500">Live preview</span>
        <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-medium text-brand-600 capitalize">
          {variant} navbar
        </span>
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto">
        {/* Navbar */}
        <div className={cn('border-b', navBg, isTransparent && 'bg-gradient-to-r from-brand-600 to-brand-800')}>
          <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">

            {/* Brand */}
            <div className="flex items-center gap-2">
              {showLogo && (
                <div className={cn('flex h-7 w-7 items-center justify-center rounded-md', isDark || isTransparent ? 'bg-brand-400' : 'bg-brand-600')}>
                  <Zap size={14} className="text-white" />
                </div>
              )}
              <span className={cn('text-sm font-semibold', isDark || isTransparent ? 'text-white' : 'text-neutral-900')}>
                {brand}
              </span>
            </div>

            {/* Desktop links */}
            <nav className="hidden items-center gap-1 md:flex">
              {links.map((link) => (
                <a
                  key={link.id}
                  href="#"
                  className={cn(
                    'rounded-md px-3 py-1.5 text-xs transition-colors',
                    link.active
                      ? isDark || isTransparent ? 'text-white font-medium' : activeColor
                      : isDark || isTransparent ? 'text-neutral-300 hover:text-white hover:bg-white/10' : `${textMuted} ${hoverBg}`
                  )}
                  onClick={(e) => e.preventDefault()}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {showSearch && (
                <button className={cn('rounded-md p-1.5 transition-colors', isDark || isTransparent ? 'text-neutral-300 hover:text-white hover:bg-white/10' : `${textMuted} ${hoverBg}`)}>
                  <Search size={15} />
                </button>
              )}
              {showAuthButtons && (
                <div className="hidden items-center gap-2 md:flex">
                  <button className={cn('rounded-md px-3 py-1.5 text-xs font-medium transition-colors', isDark || isTransparent ? 'text-neutral-300 hover:text-white' : `${textColor} hover:bg-neutral-100`)}>
                    {loginLabel}
                  </button>
                  <button className={cn('rounded-md px-3 py-1.5 text-xs font-medium', isDark || isTransparent ? 'bg-white text-neutral-900 hover:bg-neutral-100' : 'bg-brand-600 text-white hover:bg-brand-800')}>
                    {signupLabel}
                  </button>
                </div>
              )}
              {showMobileMenu && (
                <button
                  className={cn('rounded-md p-1.5 md:hidden', isDark || isTransparent ? 'text-neutral-300 hover:text-white' : textMuted)}
                  onClick={() => setMobileOpen(!mobileOpen)}
                >
                  {mobileOpen ? <X size={16} /> : <Menu size={16} />}
                </button>
              )}
            </div>
          </div>

          {/* Mobile menu */}
          {showMobileMenu && mobileOpen && (
            <div className={cn('border-t px-4 py-2 md:hidden', mobileBg)}>
              {links.map((link) => (
                <a
                  key={link.id}
                  href="#"
                  className={cn(
                    'block rounded-md px-3 py-2 text-xs transition-colors',
                    link.active
                      ? isDark ? 'text-white font-medium' : activeColor
                      : isDark ? `text-neutral-400 hover:text-white hover:bg-neutral-800` : `${textMuted} ${hoverBg}`
                  )}
                  onClick={(e) => e.preventDefault()}
                >
                  {link.label}
                </a>
              ))}
              {showAuthButtons && (
                <div className="mt-2 flex flex-col gap-1 border-t border-neutral-200 pt-2">
                  <button className={cn('rounded-md px-3 py-2 text-xs font-medium text-left', isDark ? 'text-neutral-300' : textColor)}>
                    {loginLabel}
                  </button>
                  <button className={cn('rounded-md px-3 py-2 text-xs font-medium text-left', isDark ? 'bg-white text-neutral-900' : 'bg-brand-600 text-white')}>
                    {signupLabel}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Page content placeholder */}
        <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
          <div className="h-8 w-48 rounded-md bg-neutral-200" />
          <div className="h-4 w-64 rounded-md bg-neutral-200" />
          <div className="h-4 w-56 rounded-md bg-neutral-200" />
          <div className="mt-2 flex gap-2">
            <div className="h-8 w-24 rounded-md bg-neutral-200" />
            <div className="h-8 w-24 rounded-md bg-neutral-300" />
          </div>
          <p className="mt-4 text-xs text-neutral-400">
            Click the ☰ menu icon above to preview mobile nav
          </p>
        </div>
      </div>
    </div>
  )
}
