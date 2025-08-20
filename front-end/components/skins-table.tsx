'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
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
import { Search } from 'lucide-react'

interface SkinsTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchKey?: string
  searchPlaceholder?: string
  searchValue?: string
  onSearchChange?: (value: string) => void
  loading?: boolean
  pagination: {
    total: number
    totalPages: number
    currentPage: number
    itemsPerPage?: number
  }
  onPageChange: (page: number) => void
  renderActions?: () => React.ReactNode
  /** Custom column ids mapping to card sections */
  imageColumnId?: string
  primaryInfoColumnIds?: string[]
  secondaryInfoColumnIds?: string[]
  actionsColumnId?: string
}

export function SkinsTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = "Search...",
  searchValue = "",
  onSearchChange,
  loading = false,
  pagination,
  onPageChange,
  renderActions,
  imageColumnId = "image_file",
  primaryInfoColumnIds = ["name"],
  secondaryInfoColumnIds = [],
  actionsColumnId = "actions",
}: SkinsTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [localSearchValue, setLocalSearchValue] = useState(searchValue)
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  const debouncedSearch = useCallback((value: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      if (onSearchChange) {
        onSearchChange(value)
      }
    }, 300)
  }, [onSearchChange])

  useEffect(() => {
    setLocalSearchValue(searchValue)
  }, [searchValue])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

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
            <div className="relative">
              <Input
                placeholder={searchPlaceholder}
                value={localSearchValue}
                onChange={(event) => {
                  const value = event.target.value
                  setLocalSearchValue(value)
                  debouncedSearch(value)
                }}
                disabled={loading}
                className="h-8 w-[150px] lg:w-[250px] pr-10"
              />
              <div className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent focus:ring-0 focus:ring-offset-0">
                <Search className="h-4 w-4 text-muted-foreground transition-colors" />
              </div>
            </div>
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
                {/* Image section */}
                <div className="flex-shrink-0">
                  {row
                    .getVisibleCells()
                    .filter((cell) => cell.column.id === imageColumnId)
                    .map((cell) => (
                      <div key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </div>
                    ))}
                </div>

                {/* Info section */}
                <div className="flex-1 space-y-0.5">
                  {/* primary lines */}
                  {row
                    .getVisibleCells()
                    .filter((cell) => primaryInfoColumnIds.includes(cell.column.id as string))
                    .map((cell) => (
                      <div key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </div>
                    ))}

                  {/* secondary lines */}
                  {secondaryInfoColumnIds.length > 0 && (
                    <div className="text-sm text-muted-foreground space-y-0.5">
                      {row
                        .getVisibleCells()
                        .filter((cell) => secondaryInfoColumnIds.includes(cell.column.id as string))
                        .map((cell) => (
                          <div key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                {/* Actions section */}
                <div className="flex-shrink-0">
                  {row
                    .getVisibleCells()
                    .filter((cell) => cell.column.id === actionsColumnId)
                    .map((cell) => (
                      <div key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </div>
                    ))}
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