import type { FrameworkGenerator, FormConfig, GeneratorOutput } from './types'
import type { FormField } from '@/stores/builder.store'

function getAngularFieldTemplate(field: FormField, showLabels: boolean, showValidation: boolean): string {
  const required = showValidation && field.required

  if (field.type === 'textarea') {
    return `    <mat-form-field appearance="outline" class="w-full">
      ${showLabels ? `<mat-label>${field.label ?? field.name}</mat-label>` : ''}
      <textarea
        matInput
        formControlName="${field.name}"
        placeholder="${field.placeholder ?? ''}"
        rows="4"
      ></textarea>
      ${required ? `<mat-error *ngIf="form.get('${field.name}')?.hasError('required')">${field.label} is required</mat-error>` : ''}
    </mat-form-field>`
  }

  if (field.type === 'select') {
    return `    <mat-form-field appearance="outline" class="w-full">
      ${showLabels ? `<mat-label>${field.label ?? field.name}</mat-label>` : ''}
      <mat-select formControlName="${field.name}">
        <mat-option value="option1">Option 1</mat-option>
        <mat-option value="option2">Option 2</mat-option>
      </mat-select>
      ${required ? `<mat-error *ngIf="form.get('${field.name}')?.hasError('required')">${field.label} is required</mat-error>` : ''}
    </mat-form-field>`
  }

  if (field.type === 'autocomplete') {
    return `    <mat-form-field appearance="outline" class="w-full">
      ${showLabels ? `<mat-label>${field.label ?? field.name}</mat-label>` : ''}
      <input
        matInput
        formControlName="${field.name}"
        placeholder="${field.placeholder ?? ''}"
        [matAutocomplete]="${field.name}Auto"
      />
      <mat-autocomplete #${field.name}Auto="matAutocomplete">
        <mat-option *ngFor="let option of ${field.name}Options" [value]="option">
          {{ option }}
        </mat-option>
      </mat-autocomplete>
      ${required ? `<mat-error *ngIf="form.get('${field.name}')?.hasError('required')">${field.label} is required</mat-error>` : ''}
    </mat-form-field>`
  }

  if (field.type === 'checkbox') {
    return `    <mat-checkbox formControlName="${field.name}">
      ${showLabels ? field.label ?? field.name : ''}
    </mat-checkbox>`
  }

  return `    <mat-form-field appearance="outline" class="w-full">
      ${showLabels ? `<mat-label>${field.label ?? field.name}</mat-label>` : ''}
      <input
        matInput
        formControlName="${field.name}"
        type="${field.type}"
        placeholder="${field.placeholder ?? ''}"
      />
      ${required ? `<mat-error *ngIf="form.get('${field.name}')?.hasError('required')">${field.label} is required</mat-error>` : ''}
      ${field.type === 'email' ? `<mat-error *ngIf="form.get('${field.name}')?.hasError('email')">Invalid email address</mat-error>` : ''}
    </mat-form-field>`
}

export const angularMaterialGenerator: FrameworkGenerator = {
  framework: 'angular-material',

  generateForm(config: FormConfig): GeneratorOutput {
    const { title, fields, showSubmitButton, showLabels, showValidation } = config
    const componentName = title.replace(/\s+/g, '')
    const hasAutocomplete = fields.some((f) => f.type === 'autocomplete')

    const formControls = fields
      .map((f) => {
        const validators: string[] = []
        if (showValidation && f.required) validators.push('Validators.required')
        if (f.type === 'email') validators.push('Validators.email')
        const validatorStr = validators.length ? `[${validators.join(', ')}]` : '[]'
        if (f.type === 'checkbox') return `      ${f.name}: new FormControl(false, ${validatorStr}),`
        return `      ${f.name}: new FormControl("", ${validatorStr}),`
      })
      .join('\n')

    const autocompleteProps = hasAutocomplete
      ? fields
          .filter((f) => f.type === 'autocomplete')
          .map((f) => `  ${f.name}Options: string[] = ["Option 1", "Option 2", "Option 3"]`)
          .join('\n')
      : ''

    const fieldTemplates = fields
      .map((f) => getAngularFieldTemplate(f, showLabels, showValidation))
      .join('\n\n')

    const imports = [
      `import { Component } from "@angular/core"`,
      `import { ReactiveFormsModule, FormGroup, FormControl, Validators } from "@angular/forms"`,
      `import { MatFormFieldModule } from "@angular/material/form-field"`,
      `import { MatInputModule } from "@angular/material/input"`,
      `import { MatButtonModule } from "@angular/material/button"`,
      ...(fields.some((f) => f.type === 'select')
        ? [`import { MatSelectModule } from "@angular/material/select"`]
        : []),
      ...(hasAutocomplete
        ? [
            `import { MatAutocompleteModule } from "@angular/material/autocomplete"`,
            `import { NgFor } from "@angular/common"`,
          ]
        : []),
      ...(fields.some((f) => f.type === 'checkbox')
        ? [`import { MatCheckboxModule } from "@angular/material/checkbox"`]
        : []),
    ]

    const code = `${imports.join('\n')}

@Component({
  selector: "app-${title.toLowerCase().replace(/\s+/g, '-')}-form",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ${fields.some((f) => f.type === 'select') ? 'MatSelectModule,' : ''}
    ${hasAutocomplete ? 'MatAutocompleteModule,\n    NgFor,' : ''}
    ${fields.some((f) => f.type === 'checkbox') ? 'MatCheckboxModule,' : ''}
  ],
  template: \`
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
      <h2 class="text-xl font-semibold">${title}</h2>

${fieldTemplates}

      ${showSubmitButton ? `<button mat-flat-button color="primary" type="submit"${showValidation ? ' [disabled]="form.invalid"' : ''}>
        Submit
      </button>` : ''}
    </form>
  \`,
})
export class ${componentName}FormComponent {
  ${autocompleteProps}

  form = new FormGroup({
${formControls}
  })

  onSubmit() {
    if (this.form.invalid) return
    console.log(this.form.value)
  }
}`

    return { code, language: 'typescript', imports }
  },
}
