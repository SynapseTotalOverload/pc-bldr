'use client';

import {
  type ColumnDef,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from './table';
import { useRouter } from 'next/navigation';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const router = useRouter();



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
  });

  return (
    <Card className="w-full rounded-xl">
      <div className="rounded-md ">
        <Table>
          <TableBody>
            {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
                <TableRow 
                  key={row.id} 
                  data-state={row.getIsSelected() && 'selected'}
                  onClick={() => {
                    const rowData = row.original as any;
                    if (rowData.id) {
                      router.push(`/product/${rowData.id}`);
                    }
                  }}
                  className="cursor-pointer hover:bg-muted/60"
                >
                {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{
                      flexRender(cell.column.columnDef.cell, cell.getContext())
                    }</TableCell>
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
    </Card>
  );
}
