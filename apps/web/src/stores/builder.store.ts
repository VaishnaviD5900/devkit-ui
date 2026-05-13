import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export type Framework = 'shadcn' | 'mui' | 'vuetify' | 'angular-material' | 'tailwind'
export type ComponentType = 'form' | 'card' | 'table' | 'navbar' | 'modal' | 'alert'

// --- Form ---
export type FieldType = 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'autocomplete' | 'checkbox' | 'radio' | 'date'

export interface FormField {
  id: string
  name: string
  type: FieldType
  label: string
  placeholder?: string
  required: boolean
  helperText?: string
}

// --- Table ---
export type ColumnType = 'text' | 'number' | 'date' | 'badge' | 'email' | 'actions'

export interface TableColumn {
  id: string
  name: string
  label: string
  type: ColumnType
  sortable: boolean
}

export interface TableConfig {
  title: string
  columns: TableColumn[]
  showSearch: boolean
  showPagination: boolean
  rowsPerPage: number
  showRowNumbers: boolean
  striped: boolean
  showActions: boolean
}

// --- Card ---
export type CardType = 'basic' | 'profile' | 'stats' | 'product'

export interface CardAction {
  id: string
  label: string
  variant: 'primary' | 'secondary' | 'ghost'
}

export interface StatItem {
  id: string
  label: string
  value: string
  change?: string
  trend?: 'up' | 'down' | 'neutral'
}

export interface CardConfig {
  cardType: CardType
  title: string
  subtitle: string
  description: string
  showImage: boolean
  showAvatar: boolean
  showBadge: boolean
  badgeText: string
  showFooter: boolean
  showDivider: boolean
  actions: CardAction[]
  stats: StatItem[]
  shadow: 'none' | 'sm' | 'md' | 'lg'
  rounded: 'none' | 'sm' | 'md' | 'lg' | 'xl'
}

// --- Navbar ---
export type NavbarVariant = 'default' | 'dark' | 'transparent'

export interface NavLink {
  id: string
  label: string
  href: string
  active?: boolean
}

export interface NavbarConfig {
  brand: string
  showLogo: boolean
  variant: NavbarVariant
  links: NavLink[]
  showAuthButtons: boolean
  loginLabel: string
  signupLabel: string
  showSearch: boolean
  sticky: boolean
  showMobileMenu: boolean
}

// --- Store ---
export interface BuilderState {
  framework: Framework
  setFramework: (framework: Framework) => void
  componentType: ComponentType
  setComponentType: (type: ComponentType) => void

  // Form
  formTitle: string
  setFormTitle: (title: string) => void
  fields: FormField[]
  addField: (field: Omit<FormField, 'id'>) => void
  removeField: (id: string) => void
  updateField: (id: string, updates: Partial<FormField>) => void
  reorderFields: (from: number, to: number) => void
  showSubmitButton: boolean
  setShowSubmitButton: (show: boolean) => void
  showLabels: boolean
  setShowLabels: (show: boolean) => void
  showValidation: boolean
  setShowValidation: (show: boolean) => void

  // Table
  tableConfig: TableConfig
  setTableTitle: (title: string) => void
  addColumn: (column: Omit<TableColumn, 'id'>) => void
  removeColumn: (id: string) => void
  updateColumn: (id: string, updates: Partial<TableColumn>) => void
  setTableOption: <K extends keyof Omit<TableConfig, 'title' | 'columns'>>(key: K, value: TableConfig[K]) => void

  // Card
  cardConfig: CardConfig
  setCardConfig: (updates: Partial<CardConfig>) => void
  addCardAction: (action: Omit<CardAction, 'id'>) => void
  removeCardAction: (id: string) => void
  addStatItem: (stat: Omit<StatItem, 'id'>) => void
  removeStatItem: (id: string) => void

  // Navbar
  navbarConfig: NavbarConfig
  setNavbarConfig: (updates: Partial<NavbarConfig>) => void
  addNavLink: (link: Omit<NavLink, 'id'>) => void
  removeNavLink: (id: string) => void
  updateNavLink: (id: string, updates: Partial<NavLink>) => void
}

export const useBuilderStore = create<BuilderState>()(
  devtools(
    (set) => ({
      framework: 'shadcn',
      setFramework: (framework) => set({ framework }),
      componentType: 'form',
      setComponentType: (componentType) => set({ componentType }),

      // Form
      formTitle: 'User registration',
      setFormTitle: (formTitle) => set({ formTitle }),
      fields: [
        { id: '1', name: 'full_name', type: 'text', label: 'Full name', placeholder: 'John Doe', required: true },
        { id: '2', name: 'email', type: 'email', label: 'Email', placeholder: 'you@example.com', required: true },
        { id: '3', name: 'country', type: 'autocomplete', label: 'Country', required: false },
      ],
      addField: (field) => set((s) => ({ fields: [...s.fields, { ...field, id: crypto.randomUUID() }] })),
      removeField: (id) => set((s) => ({ fields: s.fields.filter((f) => f.id !== id) })),
      updateField: (id, updates) => set((s) => ({ fields: s.fields.map((f) => (f.id === id ? { ...f, ...updates } : f)) })),
      reorderFields: (from, to) => set((s) => {
        const fields = [...s.fields]
        const [moved] = fields.splice(from, 1)
        if (moved) fields.splice(to, 0, moved)
        return { fields }
      }),
      showSubmitButton: true,
      setShowSubmitButton: (showSubmitButton) => set({ showSubmitButton }),
      showLabels: true,
      setShowLabels: (showLabels) => set({ showLabels }),
      showValidation: false,
      setShowValidation: (showValidation) => set({ showValidation }),

      // Table
      tableConfig: {
        title: 'Users',
        columns: [
          { id: '1', name: 'name', label: 'Name', type: 'text', sortable: true },
          { id: '2', name: 'email', label: 'Email', type: 'email', sortable: true },
          { id: '3', name: 'role', label: 'Role', type: 'badge', sortable: false },
          { id: '4', name: 'created_at', label: 'Created', type: 'date', sortable: true },
        ],
        showSearch: true,
        showPagination: true,
        rowsPerPage: 10,
        showRowNumbers: false,
        striped: true,
        showActions: true,
      },
      setTableTitle: (title) => set((s) => ({ tableConfig: { ...s.tableConfig, title } })),
      addColumn: (column) => set((s) => ({ tableConfig: { ...s.tableConfig, columns: [...s.tableConfig.columns, { ...column, id: crypto.randomUUID() }] } })),
      removeColumn: (id) => set((s) => ({ tableConfig: { ...s.tableConfig, columns: s.tableConfig.columns.filter((c) => c.id !== id) } })),
      updateColumn: (id, updates) => set((s) => ({ tableConfig: { ...s.tableConfig, columns: s.tableConfig.columns.map((c) => (c.id === id ? { ...c, ...updates } : c)) } })),
      setTableOption: (key, value) => set((s) => ({ tableConfig: { ...s.tableConfig, [key]: value } })),

      // Card
      cardConfig: {
        cardType: 'basic',
        title: 'Card title',
        subtitle: 'Card subtitle',
        description: 'This is a description for the card. You can add any content here.',
        showImage: false,
        showAvatar: false,
        showBadge: false,
        badgeText: 'New',
        showFooter: true,
        showDivider: true,
        shadow: 'md',
        rounded: 'lg',
        actions: [
          { id: '1', label: 'Cancel', variant: 'secondary' },
          { id: '2', label: 'Confirm', variant: 'primary' },
        ],
        stats: [
          { id: '1', label: 'Total Revenue', value: '$45,231', change: '+20.1%', trend: 'up' },
          { id: '2', label: 'Active Users', value: '2,350', change: '+15.3%', trend: 'up' },
          { id: '3', label: 'Conversion', value: '3.6%', change: '-2.1%', trend: 'down' },
          { id: '4', label: 'Avg Session', value: '4m 32s', change: '+8.2%', trend: 'up' },
        ],
      },
      setCardConfig: (updates) => set((s) => ({ cardConfig: { ...s.cardConfig, ...updates } })),
      addCardAction: (action) => set((s) => ({ cardConfig: { ...s.cardConfig, actions: [...s.cardConfig.actions, { ...action, id: crypto.randomUUID() }] } })),
      removeCardAction: (id) => set((s) => ({ cardConfig: { ...s.cardConfig, actions: s.cardConfig.actions.filter((a) => a.id !== id) } })),
      addStatItem: (stat) => set((s) => ({ cardConfig: { ...s.cardConfig, stats: [...s.cardConfig.stats, { ...stat, id: crypto.randomUUID() }] } })),
      removeStatItem: (id) => set((s) => ({ cardConfig: { ...s.cardConfig, stats: s.cardConfig.stats.filter((st) => st.id !== id) } })),

      // Navbar
      navbarConfig: {
        brand: 'MyApp',
        showLogo: true,
        variant: 'default',
        links: [
          { id: '1', label: 'Home', href: '/', active: true },
          { id: '2', label: 'About', href: '/about', active: false },
          { id: '3', label: 'Features', href: '/features', active: false },
          { id: '4', label: 'Pricing', href: '/pricing', active: false },
        ],
        showAuthButtons: true,
        loginLabel: 'Log in',
        signupLabel: 'Sign up',
        showSearch: false,
        sticky: true,
        showMobileMenu: true,
      },
      setNavbarConfig: (updates) => set((s) => ({ navbarConfig: { ...s.navbarConfig, ...updates } })),
      addNavLink: (link) => set((s) => ({ navbarConfig: { ...s.navbarConfig, links: [...s.navbarConfig.links, { ...link, id: crypto.randomUUID() }] } })),
      removeNavLink: (id) => set((s) => ({ navbarConfig: { ...s.navbarConfig, links: s.navbarConfig.links.filter((l) => l.id !== id) } })),
      updateNavLink: (id, updates) => set((s) => ({ navbarConfig: { ...s.navbarConfig, links: s.navbarConfig.links.map((l) => (l.id === id ? { ...l, ...updates } : l)) } })),
    }),
    { name: 'builder-store' }
  )
)
