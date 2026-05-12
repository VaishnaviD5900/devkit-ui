import { useState } from 'react'
import { Search, ChevronUp, ChevronDown, ChevronsUpDown, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useBuilderStore, type ColumnType } from '@/stores/builder.store'

const DUMMY_DATA = {
  text: ['Alice Johnson', 'Bob Smith', 'Carol White', 'David Brown', 'Eva Martinez', 'Frank Lee', 'Grace Kim', 'Henry Wang'],
  email: ['alice@example.com', 'bob@example.com', 'carol@example.com', 'david@example.com', 'eva@example.com', 'frank@example.com', 'grace@example.com', 'henry@example.com'],
  number: [42, 128, 7, 256, 93, 15, 374, 61],
  date: ['Jan 12, 2025', 'Mar 3, 2025', 'Apr 18, 2025', 'Jun 7, 2025', 'Jul 22, 2025', 'Aug 5, 2025', 'Sep 14, 2025', 'Oct 30, 2025'],
  badge: ['Admin', 'Editor', 'Viewer', 'Admin', 'Editor', 'Viewer', 'Admin', 'Editor'],
}

const BADGE_COLORS: Record<string, string> = {
  Admin: 'bg-brand-50 text-brand-600',
  Editor: 'bg-amber-50 text-amber-600',
  Viewer: 'bg-green-50 text-green-700',
  Active: 'bg-green-50 text-green-700',
  Inactive: 'bg-neutral-100 text-neutral-500',
  Pending: 'bg-amber-50 text-amber-600',
}

function getDummyValue(type: ColumnType, rowIndex: number): string | number {
  const i = rowIndex % 8
  switch (type) {
    case 'text': return DUMMY_DATA.text[i] ?? ''
    case 'email': return DUMMY_DATA.email[i] ?? ''
    case 'number': return DUMMY_DATA.number[i] ?? 0
    case 'date': return DUMMY_DATA.date[i] ?? ''
    case 'badge': return DUMMY_DATA.badge[i] ?? ''
    case 'actions': return ''
  }
}

function CellValue({ type, value }: { type: ColumnType; value: string | number }) {
  if (type === 'badge') {
    const colorClass = BADGE_COLORS[String(value)] ?? 'bg-neutral-100 text-neutral-600'
    return (
      <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-medium', colorClass)}>
        {value}
      </span>
    )
  }
  if (type === 'email') {
    return <span className="text-brand-600">{value}</span>
  }
  return <span>{value}</span>
}

export function TablePreview() {
  const { tableConfig } = useBuilderStore()
  const { columns, showSearch, showPagination, showRowNumbers, striped, showActions, rowsPerPage, title } = tableConfig

  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortCol, setSortCol] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const PREVIEW_ROWS = 5
  const displayRows = Math.min(PREVIEW_ROWS, rowsPerPage)

  function handleSort(colId: string) {
    if (sortCol === colId) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortCol(colId)
      setSortDir('asc')
    }
  }

  const visibleColumns = columns.filter((c) => c.type !== 'actions')

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-neutral-50">
      <div className="flex h-10 flex-shrink-0 items-center gap-2 border-b border-neutral-200 bg-white px-4">
        <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
        <span className="text-xs font-medium text-neutral-500">Live preview</span>
      </div>

      <div className="flex flex-1 items-start justify-center overflow-y-auto p-6">
        <div className="w-full max-w-4xl rounded-lg border border-neutral-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
            <h3 className="text-sm font-semibold text-neutral-900">{title}</h3>
            {showSearch && (
              <div className="relative">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-7 rounded-md border border-neutral-200 bg-neutral-50 pl-7 pr-3 text-xs focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
                />
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50">
                  {showRowNumbers && (
                    <th className="px-4 py-2.5 text-left text-[11px] font-medium uppercase tracking-wide text-neutral-400">
                      #
                    </th>
                  )}
                  {visibleColumns.map((col) => (
                    <th
                      key={col.id}
                      className="px-4 py-2.5 text-left text-[11px] font-medium uppercase tracking-wide text-neutral-400"
                    >
                      {col.sortable ? (
                        <button
                          onClick={() => handleSort(col.id)}
                          className="flex items-center gap-1 hover:text-neutral-700"
                        >
                          {col.label}
                          {sortCol === col.id ? (
                            sortDir === 'asc' ? <ChevronUp size={11} /> : <ChevronDown size={11} />
                          ) : (
                            <ChevronsUpDown size={11} className="opacity-40" />
                          )}
                        </button>
                      ) : (
                        col.label
                      )}
                    </th>
                  ))}
                  {showActions && (
                    <th className="px-4 py-2.5 text-left text-[11px] font-medium uppercase tracking-wide text-neutral-400">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: displayRows }).map((_, rowIdx) => (
                  <tr
                    key={rowIdx}
                    className={cn(
                      'border-b border-neutral-100 last:border-0',
                      striped && rowIdx % 2 === 1 && 'bg-neutral-50/60'
                    )}
                  >
                    {showRowNumbers && (
                      <td className="px-4 py-3 text-xs text-neutral-400">
                        {(currentPage - 1) * rowsPerPage + rowIdx + 1}
                      </td>
                    )}
                    {visibleColumns.map((col) => (
                      <td key={col.id} className="px-4 py-3 text-xs text-neutral-700">
                        <CellValue type={col.type} value={getDummyValue(col.type, rowIdx)} />
                      </td>
                    ))}
                    {showActions && (
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <button className="rounded p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600">
                            <Pencil size={12} />
                          </button>
                          <button className="rounded p-1 text-neutral-400 hover:bg-red-50 hover:text-red-500">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {showPagination && (
            <div className="flex items-center justify-between border-t border-neutral-200 px-4 py-2.5">
              <p className="text-xs text-neutral-400">
                Showing {displayRows} of {rowsPerPage} rows
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="rounded p-1 text-neutral-400 hover:bg-neutral-100 disabled:opacity-30"
                >
                  <ChevronLeft size={13} />
                </button>
                <span className="min-w-[20px] text-center text-xs font-medium text-neutral-600">
                  {currentPage}
                </span>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="rounded p-1 text-neutral-400 hover:bg-neutral-100"
                >
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
