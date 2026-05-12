import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export type Framework = 'shadcn' | 'mui' | 'vuetify' | 'angular-material' | 'tailwind'

export type FieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'textarea'
  | 'select'
  | 'autocomplete'
  | 'checkbox'
  | 'radio'
  | 'date'

export type ComponentType = 'form' | 'card' | 'table' | 'navbar' | 'modal' | 'alert'

export interface FormField {
  id: string
  name: string
  type: FieldType
  label: string
  placeholder?: string
  required: boolean
  helperText?: string
}

export interface BuilderState {
  // Selected framework
  framework: Framework
  setFramework: (framework: Framework) => void

  // Selected component
  componentType: ComponentType
  setComponentType: (type: ComponentType) => void

  // Form config
  formTitle: string
  setFormTitle: (title: string) => void
  fields: FormField[]
  addField: (field: Omit<FormField, 'id'>) => void
  removeField: (id: string) => void
  updateField: (id: string, updates: Partial<FormField>) => void
  reorderFields: (from: number, to: number) => void

  // Form options
  showSubmitButton: boolean
  setShowSubmitButton: (show: boolean) => void
  showLabels: boolean
  setShowLabels: (show: boolean) => void
  showValidation: boolean
  setShowValidation: (show: boolean) => void
}

export const useBuilderStore = create<BuilderState>()(
  devtools(
    (set) => ({
      framework: 'shadcn',
      setFramework: (framework) => set({ framework }),

      componentType: 'form',
      setComponentType: (componentType) => set({ componentType }),

      formTitle: 'User registration',
      setFormTitle: (formTitle) => set({ formTitle }),

      fields: [
        { id: '1', name: 'full_name', type: 'text', label: 'Full name', placeholder: 'John Doe', required: true },
        { id: '2', name: 'email', type: 'email', label: 'Email', placeholder: 'you@example.com', required: true },
        { id: '3', name: 'country', type: 'autocomplete', label: 'Country', required: false },
      ],

      addField: (field) =>
        set((state) => ({
          fields: [...state.fields, { ...field, id: crypto.randomUUID() }],
        })),

      removeField: (id) =>
        set((state) => ({
          fields: state.fields.filter((f) => f.id !== id),
        })),

      updateField: (id, updates) =>
        set((state) => ({
          fields: state.fields.map((f) => (f.id === id ? { ...f, ...updates } : f)),
        })),

      reorderFields: (from, to) =>
        set((state) => {
          const fields = [...state.fields]
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
    }),
    { name: 'builder-store' }
  )
)
