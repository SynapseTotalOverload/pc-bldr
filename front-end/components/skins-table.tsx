'use client'

import { useState } from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
} from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface SkinsTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchKey?: string
  searchPlaceholder?: string
  searchValue?: string
  onSearchChange?: (value: string) => void
  pagination: {
    total: number
    totalPages: number
    currentPage: number
    itemsPerPage?: number
  }
  onPageChange: (page: number) => void
  renderActions?: () => React.ReactNode
}

export function SkinsTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = "Search...",
  searchValue = "",
  onSearchChange,
  pagination,
  onPageChange,
  renderActions,
}: SkinsTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
    },
    manualPagination: true,
    pageCount: pagination.totalPages,
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {searchKey && onSearchChange && (
            <Input
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              className="h-8 w-[150px] lg:w-[250px]"
            />
          )}
        </div>
        {renderActions && renderActions()}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <div
              key={row.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex gap-4">
                {/* First column - Image */}
                <div className="flex-shrink-0">
                  {row.getVisibleCells().map((cell) => {
                    if (cell.column.id === 'image_file') {
                      return (
                        <div key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </div>
                      )
                    }
                    return null
                  })}
                </div>
                
                {/* Second column - Information */}
                <div className="flex-1">
                  {row.getVisibleCells().map((cell) => {
                    if (cell.column.id === 'name') {
                      return (
                        <div key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </div>
                      )
                    }
                    return null
                  })}
                </div>

                {/* Third column - Actions */}
                <div className="flex-shrink-0">
                  {row.getVisibleCells().map((cell) => {
                    if (cell.column.id === 'actions') {
                      return (
                        <div key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </div>
                      )
                    }
                    return null
                  })}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-8 text-gray-500">
            No results.
          </div>
        )}
      </div>
      
      {pagination && onPageChange && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="text-muted-foreground flex-1 text-sm">
            {(() => {
              if (pagination.total === 0) return 'Showing 0 results';
              
              const itemsPerPage = pagination.itemsPerPage || data.length;
              const skip = (pagination.currentPage - 1) * itemsPerPage;
              const start = skip + 1;
              const end = Math.min(skip + data.length, pagination.total);
              
              return `Showing ${end} of ${pagination.total} results`;
            })()}
          </div>
            {pagination.totalPages > 1 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                >
                  Previous
                </Button>
                <div className="flex items-center space-x-1">
                  {(() => {
                    const pages = [];
                    const totalPages = pagination.totalPages;
                    const currentPage = pagination.currentPage;

                    if (totalPages <= 1) {
                      return null;
                    }

                    pages.push(
                      <Button
                        key={1}
                        variant={currentPage === 1 ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => onPageChange(1)}
                      >
                        1
                      </Button>,
                    );

                    const start = Math.max(2, currentPage - 1);
                    const end = Math.min(totalPages - 1, currentPage + 1);

                    if (start > 2) {
                      pages.push(<span key="ellipsis1">...</span>);
                    }

                    for (let i = start; i <= end; i++) {
                      pages.push(
                        <Button
                          key={i}
                          variant={currentPage === i ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => onPageChange(i)}
                        >
                          {i}
                        </Button>,
                      );
                    }

                    if (end < totalPages - 1) {
                      pages.push(<span key="ellipsis2">...</span>);
                    }

                    if (totalPages > 1) {
                      pages.push(
                        <Button
                          key={totalPages}
                          variant={currentPage === totalPages ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => onPageChange(totalPages)}
                        >
                          {totalPages}
                        </Button>,
                      );
                    }

                    return pages;
                  })()}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                >
                  Next
                </Button>
              </>
            )}
        </div>
      )}
    </div>
  )
} 