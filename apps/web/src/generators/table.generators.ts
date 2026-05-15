import type { TableConfig, TableColumn } from '@/stores/builder.store'
import type { GeneratorOutput } from './types'

// ─── Shared helpers ───────────────────────────────────────────────────────────

function mockRowData(columns: TableColumn[]): string {
  const row = columns
    .filter((c) => c.type !== 'actions')
    .map((c) => {
      switch (c.type) {
        case 'number': return `    ${c.name}: 42,`
        case 'badge': return `    ${c.name}: "Active",`
        case 'date': return `    ${c.name}: "2025-01-12",`
        case 'email': return `    ${c.name}: "user@example.com",`
        default: return `    ${c.name}: "Sample value",`
      }
    })
    .join('\n')
  return `  {\n    id: 1,\n${row}\n  },\n  {\n    id: 2,\n${row.replace(/Sample value/g, 'Another value').replace(/user@example\.com/g, 'other@example.com')}\n  },`
}

// ─── shadcn/ui + TanStack Table ───────────────────────────────────────────────

export function generateShadcnTable(config: TableConfig): GeneratorOutput {
  const { title, columns, showSearch, showPagination, showActions, striped, rowsPerPage } = config
  const dataColumns = columns.filter((c) => c.type !== 'actions')
  const componentName = title.replace(/\s+/g, '')

  const columnDefs = dataColumns
    .map(
      (c) => `  {
    accessorKey: "${c.name}",
    header: ${c.sortable ? `({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} aria-label="Sort by ${c.label}">
        ${c.label}
        <ArrowUpDown className="ml-2 h-4 w-4" aria-hidden="true" />
      </Button>
    )` : `"${c.label}"`},
    ${c.type === 'badge' ? `cell: ({ row }) => (
      <Badge variant="outline">{row.getValue("${c.name}")}</Badge>
    ),` : ''}
  }`
    )
    .join(',\n')

  const actionsCol = showActions
    ? `,\n  {\n    id: "actions",\n    cell: ({ row }) => (\n      <div className="flex gap-2">\n        <Button variant="ghost" size="sm" onClick={() => console.log("edit", row.original)}>\n          Edit\n        </Button>\n        <Button variant="ghost" size="sm" onClick={() => console.log("delete", row.original)}>\n          Delete\n        </Button>\n      </div>\n    ),\n  }`
    : ''

  const imports = [
    `import { useState } from "react"`,
    `import { useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, getPaginationRowModel, flexRender, type ColumnDef, type SortingState } from "@tanstack/react-table"`,
    `import { ArrowUpDown } from "lucide-react"`,
    `import { Button } from "@/components/ui/button"`,
    `import { Input } from "@/components/ui/input"`,
    `import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"`,
    ...(columns.some((c) => c.type === 'badge') ? [`import { Badge } from "@/components/ui/badge"`] : []),
  ]

  const rowType = `{ id: number; ${dataColumns.map((c) => `${c.name}: ${c.type === 'number' ? 'number' : 'string'}`).join('; ')} }`

  const code = `${imports.join('\n')}

type Row = ${rowType}

const data: Row[] = [
${mockRowData(columns)}
]

const columns: ColumnDef<Row>[] = [
${columnDefs}${actionsCol}
]

export function ${componentName}Table() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState("")

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: ${rowsPerPage} } },
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">${title}</h2>
        ${showSearch ? `<Input
          placeholder="Search..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-xs"
        />` : ''}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row, i) => (
              <TableRow key={row.id} ${striped ? `className={i % 2 === 1 ? "bg-muted/50" : ""}` : ''}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      ${showPagination ? `<div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>` : ''}
    </div>
  )
}`

  return { code, language: 'tsx', imports }
}

// ─── Material UI DataGrid ─────────────────────────────────────────────────────

export function generateMuiTable(config: TableConfig): GeneratorOutput {
  const { title, columns, showSearch, showPagination, showActions, rowsPerPage } = config
  const dataColumns = columns.filter((c) => c.type !== 'actions')
  const componentName = title.replace(/\s+/g, '')

  const columnDefs = [
    ...dataColumns.map(
      (c) => `  { field: "${c.name}", headerName: "${c.label}", flex: 1, sortable: ${c.sortable}${c.type === 'badge' ? `, renderCell: (params) => <Chip label={params.value} size="small" />` : ''} },`
    ),
    ...(showActions
      ? [`  { field: "actions", headerName: "Actions", flex: 0.5, sortable: false, renderCell: (params) => (\n    <>\n      <IconButton size="small" onClick={() => console.log("edit", params.row)}><EditIcon fontSize="small" /></IconButton>\n      <IconButton size="small" onClick={() => console.log("delete", params.row)}><DeleteIcon fontSize="small" /></IconButton>\n    </>\n  ) },`]
      : []),
  ].join('\n')

  const imports = [
    `import { useState } from "react"`,
    `import Box from "@mui/material/Box"`,
    `import Typography from "@mui/material/Typography"`,
    `import { DataGrid, type GridColDef } from "@mui/x-data-grid"`,
    ...(showSearch ? [`import TextField from "@mui/material/TextField"`] : []),
    ...(columns.some((c) => c.type === 'badge') ? [`import Chip from "@mui/material/Chip"`] : []),
    ...(showActions ? [
      `import IconButton from "@mui/material/IconButton"`,
      `import EditIcon from "@mui/icons-material/Edit"`,
      `import DeleteIcon from "@mui/icons-material/Delete"`,
    ] : []),
  ]

  const code = `${imports.join('\n')}

const rows = [
${mockRowData(columns)}
]

const columns: GridColDef[] = [
${columnDefs}
]

export function ${componentName}Table() {
  const [search, setSearch] = useState("")

  const filteredRows = search
    ? rows.filter((r) => Object.values(r).some((v) => String(v).toLowerCase().includes(search.toLowerCase())))
    : rows

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h6">${title}</Typography>
        ${showSearch ? `<TextField
          size="small"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />` : ''}
      </Box>
      <DataGrid
        rows={filteredRows}
        columns={columns}
        ${showPagination ? `initialState={{ pagination: { paginationModel: { pageSize: ${rowsPerPage} } } }}
        pageSizeOptions={[5, 10, 25]}` : `hideFooter`}
        disableRowSelectionOnClick
        autoHeight
      />
    </Box>
  )
}`

  return { code, language: 'tsx', imports }
}

// ─── Vuetify v-data-table ─────────────────────────────────────────────────────

export function generateVuetifyTable(config: TableConfig): GeneratorOutput {
  const { title, columns, showSearch, showPagination, showActions, striped, rowsPerPage } = config
  const dataColumns = columns.filter((c) => c.type !== 'actions')

  const headers = [
    ...dataColumns.map((c) => `  { title: "${c.label}", key: "${c.name}", sortable: ${c.sortable} },`),
    ...(showActions ? [`  { title: "Actions", key: "actions", sortable: false },`] : []),
  ].join('\n')

  const badgeColumns = dataColumns.filter((c) => c.type === 'badge')

  const code = `<template>
  <v-card>
    <v-card-title class="d-flex align-center justify-space-between">
      <span>${title}</span>
      ${showSearch ? `<v-text-field
        v-model="search"
        prepend-inner-icon="mdi-magnify"
        placeholder="Search..."
        density="compact"
        hide-details
        style="max-width: 250px"
      />` : ''}
    </v-card-title>

    <v-data-table
      :headers="headers"
      :items="filteredItems"
      :items-per-page="${rowsPerPage}"
      ${striped ? ':row-props="({ index }) => ({ class: index % 2 === 1 ? \'bg-grey-lighten-5\' : \'\' })"' : ''}
      ${!showPagination ? 'hide-default-footer' : ''}
    >
      ${badgeColumns.map((c) => `<template #item.${c.name}="{ item }">
        <v-chip :color="getChipColor(item.${c.name})" size="small">
          {{ item.${c.name} }}
        </v-chip>
      </template>`).join('\n      ')}
      ${showActions ? `<template #item.actions="{ item }">
        <v-icon size="small" class="me-2" @click="editItem(item)">mdi-pencil</v-icon>
        <v-icon size="small" color="error" @click="deleteItem(item)">mdi-delete</v-icon>
      </template>` : ''}
    </v-data-table>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"

const search = ref("")

const headers = [
${headers}
]

const items = ref([
${mockRowData(columns)}
])

const filteredItems = computed(() =>
  search.value
    ? items.value.filter((i) =>
        Object.values(i).some((v) => String(v).toLowerCase().includes(search.value.toLowerCase()))
      )
    : items.value
)

function getChipColor(value: string) {
  const map: Record<string, string> = { Active: "success", Inactive: "default", Admin: "primary", Editor: "warning", Viewer: "info" }
  return map[value] ?? "default"
}

function editItem(item: unknown) { console.log("edit", item) }
function deleteItem(item: unknown) { console.log("delete", item) }
</script>`

  return { code, language: 'vue', imports: [] }
}

// ─── Angular Material mat-table ───────────────────────────────────────────────

export function generateAngularTable(config: TableConfig): GeneratorOutput {
  const { title, columns, showSearch, showPagination, showActions, rowsPerPage } = config
  const dataColumns = columns.filter((c) => c.type !== 'actions')
  const componentName = title.replace(/\s+/g, '')

  const displayedColumns = [
    ...dataColumns.map((c) => `"${c.name}"`),
    ...(showActions ? [`"actions"`] : []),
  ].join(', ')

  const columnTemplates = dataColumns
    .map(
      (c) => `      <ng-container matColumnDef="${c.name}">
        <th mat-header-cell *matHeaderCellDef ${c.sortable ? 'mat-sort-header' : ''}>${c.label}</th>
        <td mat-cell *matCellDef="let row">
          ${c.type === 'badge' ? `<mat-chip>{{ row.${c.name} }}</mat-chip>` : `{{ row.${c.name} }}`}
        </td>
      </ng-container>`
    )
    .join('\n\n')

  const actionsTemplate = showActions
    ? `\n      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef>Actions</th>
        <td mat-cell *matCellDef="let row">
          <button mat-icon-button (click)="edit(row)"><mat-icon>edit</mat-icon></button>
          <button mat-icon-button color="warn" (click)="delete(row)"><mat-icon>delete</mat-icon></button>
        </td>
      </ng-container>`
    : ''

  const imports = [
    `import { Component, ViewChild, OnInit } from "@angular/core"`,
    `import { MatTableModule, MatTableDataSource } from "@angular/material/table"`,
    `import { MatSortModule, MatSort } from "@angular/material/sort"`,
    ...(showPagination ? [`import { MatPaginatorModule, MatPaginator } from "@angular/material/paginator"`] : []),
    ...(showSearch ? [`import { MatFormFieldModule } from "@angular/material/form-field"`, `import { MatInputModule } from "@angular/material/input"`] : []),
    ...(showActions ? [`import { MatIconModule } from "@angular/material/icon"`, `import { MatButtonModule } from "@angular/material/button"`] : []),
    ...(columns.some((c) => c.type === 'badge') ? [`import { MatChipsModule } from "@angular/material/chips"`] : []),
  ]

  const code = `${imports.join('\n')}

@Component({
  selector: "app-${title.toLowerCase().replace(/\s+/g, '-')}-table",
  standalone: true,
  imports: [
    MatTableModule, MatSortModule,
    ${showPagination ? 'MatPaginatorModule,' : ''}
    ${showSearch ? 'MatFormFieldModule, MatInputModule,' : ''}
    ${showActions ? 'MatIconModule, MatButtonModule,' : ''}
    ${columns.some((c) => c.type === 'badge') ? 'MatChipsModule,' : ''}
  ],
  template: \`
    <div class="flex flex-col gap-4">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold">${title}</h2>
        ${showSearch ? `<mat-form-field appearance="outline" class="max-w-xs">
          <input matInput (keyup)="applyFilter($event)" placeholder="Search..." />
        </mat-form-field>` : ''}
      </div>

      <table mat-table [dataSource]="dataSource" matSort class="w-full">
${columnTemplates}${actionsTemplate}

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>

      ${showPagination ? `<mat-paginator [pageSize]="${rowsPerPage}" [pageSizeOptions]="[5, 10, 25]" showFirstLastButtons />` : ''}
    </div>
  \`,
})
export class ${componentName}TableComponent implements OnInit {
  displayedColumns = [${displayedColumns}]

  dataSource = new MatTableDataSource([
${mockRowData(columns)}
  ])

  @ViewChild(MatSort) sort!: MatSort
  ${showPagination ? `@ViewChild(MatPaginator) paginator!: MatPaginator` : ''}

  ngOnInit() {
    this.dataSource.sort = this.sort
    ${showPagination ? `this.dataSource.paginator = this.paginator` : ''}
  }

  applyFilter(event: Event) {
    this.dataSource.filter = (event.target as HTMLInputElement).value.trim().toLowerCase()
  }

  edit(row: unknown) { console.log("edit", row) }
  delete(row: unknown) { console.log("delete", row) }
}`

  return { code, language: 'typescript', imports }
}

// ─── Tailwind plain table ─────────────────────────────────────────────────────

export function generateTailwindTable(config: TableConfig): GeneratorOutput {
  const { title, columns, showSearch, showPagination, showActions, striped, rowsPerPage } = config
  const dataColumns = columns.filter((c) => c.type !== 'actions')
  const componentName = title.replace(/\s+/g, '')

  const badgeStyle = `const badgeColors: Record<string, string> = {
  Active: "bg-green-100 text-green-700",
  Inactive: "bg-gray-100 text-gray-600",
  Admin: "bg-blue-100 text-blue-700",
  Editor: "bg-amber-100 text-amber-700",
  Viewer: "bg-teal-100 text-teal-700",
}`

  const hasBadge = columns.some((c) => c.type === 'badge')

  const code = `import { useState, useMemo } from "react"

${hasBadge ? badgeStyle : ''}

type Row = { id: number; ${dataColumns.map((c) => `${c.name}: ${c.type === 'number' ? 'number' : 'string'}`).join('; ')} }

const data: Row[] = [
${mockRowData(columns)}
]

export function ${componentName}Table() {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const pageSize = ${rowsPerPage}

  const filtered = useMemo(
    () =>
      search
        ? data.filter((r) => Object.values(r).some((v) => String(v).toLowerCase().includes(search.toLowerCase())))
        : data,
    [search]
  )

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize)
  const totalPages = Math.ceil(filtered.length / pageSize)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">${title}</h2>
        ${showSearch ? `<input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search table"
          className="h-8 rounded-md border border-gray-300 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
        />` : ''}
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full text-sm" role="grid" aria-label="${title}">
          <thead className="bg-gray-50">
            <tr>
              ${dataColumns.map((c) => `<th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">${c.label}</th>`).join('\n              ')}
              ${showActions ? `<th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">Actions</th>` : ''}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {paginated.map((row, i) => (
              <tr key={row.id} className={${striped ? '`${i % 2 === 1 ? "bg-gray-50/50" : ""}`' : '"hover:bg-gray-50"'}}>
                ${dataColumns
                  .map(
                    (c) =>
                      `<td className="px-4 py-3 text-gray-700">
                  ${c.type === 'badge' ? `<span className={\`rounded-full px-2 py-0.5 text-xs font-medium \${badgeColors[row.${c.name}] ?? "bg-gray-100 text-gray-600"}\`}>{row.${c.name}}</span>` : `{row.${c.name}}`}
                </td>`
                  )
                  .join('\n                ')}
                ${showActions ? `<td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => console.log("edit", row)} aria-label="Edit row" className="text-xs text-blue-600 hover:underline">Edit</button>
                    <button onClick={() => console.log("delete", row)} aria-label="Delete row" className="text-xs text-red-500 hover:underline">Delete</button>
                  </div>
                </td>` : ''}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      ${showPagination ? `<div className="flex items-center justify-between text-sm text-gray-500">
        <span>Page {page} of {totalPages}</span>
        <div className="flex gap-2">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} aria-label="Previous page" className="rounded border px-3 py-1 disabled:opacity-40 hover:bg-gray-50">Previous</button>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} aria-label="Next page" className="rounded border px-3 py-1 disabled:opacity-40 hover:bg-gray-50">Next</button>
        </div>
      </div>` : ''}
    </div>
  )
}`

  return { code, language: 'tsx', imports: [`import { useState, useMemo } from "react"`] }
}
