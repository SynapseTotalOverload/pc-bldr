'use client';

import {
  type ColumnDef,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ChevronDown, Search } from 'lucide-react';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from './ui/card';
import { SearchPrice } from './ui/search-price';
import { SelectBuildType } from '@/components/ui/select-build-type';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchPrice?: (from: number, to: number) => void;
  onBuildTypeChange?: (buildType: string | null) => void;
  onSearchChange?: (value: string) => void;
  renderActions?: () => React.ReactNode;
  showFilter?: boolean;
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage?: number;
  };
  onPageChange: (page: number) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = 'Search...',
  searchValue = '',
  onSearchPrice,
  onBuildTypeChange,
  onSearchChange,
  renderActions,
  showFilter = false,
  pagination,
  onPageChange,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [localSearchValue, setLocalSearchValue] = useState(searchValue);

  // Sync localSearchValue with searchValue prop
  useEffect(() => {
    setLocalSearchValue(searchValue);
  }, [searchValue]);

  // Handle search on Enter key press
  const handleSearchKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && onSearchChange) {
      onSearchChange(localSearchValue);
    }
  };

  // Handle search button click
  const handleSearchClick = () => {
    if (onSearchChange) {
      onSearchChange(localSearchValue);
    }
  };

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
    },
    manualPagination: true,
    pageCount: pagination.totalPages,
  });

  return (
    <Card className="w-full">
      <div className="flex items-center py-4 px-4 gap-4">
        {searchKey && (
          <>
            <div className="relative max-w-sm">
              <Input
                placeholder={searchPlaceholder}
                value={localSearchValue}
                onChange={(event) => setLocalSearchValue(event.target.value)}
                onKeyPress={handleSearchKeyPress}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent focus:ring-0 focus:ring-offset-0"
                onClick={handleSearchClick}
              >
                <Search className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
              </Button>
            </div>
            {showFilter && (
              <div className="pl-6">
                <SearchPrice onSearch={onSearchPrice || (() => {})} />
              </div>
            )}
          </>
        )}
        {renderActions && renderActions()}
        {showFilter && (
          <div className="relative">
            <SelectBuildType onBuildTypeChange={onBuildTypeChange || (() => {console.log("build type changed")})} />
          </div>
        )}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border ">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
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
    </Card>
  );
}
