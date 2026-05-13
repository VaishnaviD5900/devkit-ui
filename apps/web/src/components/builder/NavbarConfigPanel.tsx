import { useState } from 'react'
import { Plus, X, GripVertical } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Toggle } from '@/components/ui/Toggle'
import { Button } from '@/components/ui/Button'
import { useBuilderStore, type NavbarVariant } from '@/stores/builder.store'

const VARIANTS: { value: NavbarVariant; label: string; description: string }[] = [
  { value: 'default', label: 'Default', description: 'White background' },
  { value: 'dark', label: 'Dark', description: 'Dark background' },
  { value: 'transparent', label: 'Transparent', description: 'No background' },
]

export function NavbarConfigPanel() {
  const { navbarConfig, setNavbarConfig, addNavLink, removeNavLink, updateNavLink } =
    useBuilderStore()

  const [newLinkLabel, setNewLinkLabel] = useState('')
  const [newLinkHref, setNewLinkHref] = useState('/')

  function handleAddLink() {
    if (!newLinkLabel.trim()) return
    addNavLink({ label: newLinkLabel, href: newLinkHref, active: false })
    setNewLinkLabel('')
    setNewLinkHref('/')
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleAddLink()
  }

  return (
    <div className="flex w-72 flex-shrink-0 flex-col border-r border-neutral-200 bg-white">
      <div className="border-b border-neutral-200 px-4 py-3">
        <h2 className="text-sm font-semibold text-neutral-900">Navbar settings</h2>
        <p className="mt-0.5 text-xs text-neutral-400">Configure links and appearance</p>
      </div>

      <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-4">

        {/* Variant */}
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-neutral-600">Variant</p>
          <div className="flex flex-col gap-1.5">
            {VARIANTS.map((v) => (
              <button
                key={v.value}
                onClick={() => setNavbarConfig({ variant: v.value })}
                className={`flex items-center justify-between rounded-md border px-3 py-2 text-left transition-colors ${
                  navbarConfig.variant === v.value
                    ? 'border-brand-300 bg-brand-50 text-brand-700'
                    : 'border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50'
                }`}
              >
                <span className="text-xs font-medium">{v.label}</span>
                <span className="text-[10px] text-neutral-400">{v.description}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Brand */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-medium text-neutral-600">Brand</p>
          <Input
            label="Brand name"
            value={navbarConfig.brand}
            onChange={(e) => setNavbarConfig({ brand: e.target.value })}
            placeholder="MyApp"
          />
          <Toggle
            label="Show logo icon"
            checked={navbarConfig.showLogo}
            onChange={(v) => setNavbarConfig({ showLogo: v })}
          />
        </div>

        {/* Links */}
        <div className="flex flex-col gap-2 border-t border-neutral-100 pt-4">
          <p className="text-xs font-medium text-neutral-600">Nav links</p>

          <div className="flex flex-col gap-1.5">
            {navbarConfig.links.map((link) => (
              <div
                key={link.id}
                className="flex items-center gap-2 rounded-md border border-neutral-200 bg-neutral-50 px-2 py-1.5"
              >
                <GripVertical size={12} className="flex-shrink-0 text-neutral-300" />
                <div className="flex flex-1 flex-col gap-1">
                  <input
                    value={link.label}
                    onChange={(e) => updateNavLink(link.id, { label: e.target.value })}
                    className="w-full bg-transparent text-xs font-medium text-neutral-800 focus:outline-none"
                  />
                  <input
                    value={link.href}
                    onChange={(e) => updateNavLink(link.id, { href: e.target.value })}
                    className="w-full bg-transparent text-[11px] text-neutral-400 focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => updateNavLink(link.id, { active: !link.active })}
                  className={`rounded px-1.5 py-0.5 text-[10px] font-medium transition-colors ${
                    link.active
                      ? 'bg-brand-50 text-brand-600'
                      : 'bg-neutral-100 text-neutral-400 hover:bg-neutral-200'
                  }`}
                >
                  {link.active ? 'active' : 'inactive'}
                </button>
                <button
                  onClick={() => removeNavLink(link.id)}
                  className="rounded p-0.5 text-neutral-400 hover:bg-red-50 hover:text-red-500"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2 pt-1">
            <div className="flex gap-2">
              <Input
                placeholder="Label..."
                value={newLinkLabel}
                onChange={(e) => setNewLinkLabel(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Input
                placeholder="href..."
                value={newLinkHref}
                onChange={(e) => setNewLinkHref(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <Button variant="secondary" size="sm" className="w-full" onClick={handleAddLink}>
              <Plus size={13} /> Add link
            </Button>
          </div>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-1 border-t border-neutral-100 pt-4">
          <p className="mb-2 text-xs font-medium text-neutral-600">Options</p>
          <Toggle
            label="Auth buttons"
            checked={navbarConfig.showAuthButtons}
            onChange={(v) => setNavbarConfig({ showAuthButtons: v })}
          />
          {navbarConfig.showAuthButtons && (
            <div className="flex flex-col gap-2 pl-2 pt-1">
              <Input
                label="Login label"
                value={navbarConfig.loginLabel}
                onChange={(e) => setNavbarConfig({ loginLabel: e.target.value })}
              />
              <Input
                label="Sign up label"
                value={navbarConfig.signupLabel}
                onChange={(e) => setNavbarConfig({ signupLabel: e.target.value })}
              />
            </div>
          )}
          <Toggle
            label="Search bar"
            checked={navbarConfig.showSearch}
            onChange={(v) => setNavbarConfig({ showSearch: v })}
          />
          <Toggle
            label="Sticky"
            checked={navbarConfig.sticky}
            onChange={(v) => setNavbarConfig({ sticky: v })}
          />
          <Toggle
            label="Mobile menu"
            checked={navbarConfig.showMobileMenu}
            onChange={(v) => setNavbarConfig({ showMobileMenu: v })}
          />
        </div>

        {/* Variant-specific options */}
        {navbarConfig.variant !== 'default' && (
          <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2">
            <p className="text-[11px] text-amber-700">
              {navbarConfig.variant === 'dark'
                ? 'Dark variant uses your primary brand color as background.'
                : 'Transparent variant works best over hero images or gradients.'}
            </p>
          </div>
        )}

      </div>
    </div>
  )
}
