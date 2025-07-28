'use client'

import { useState } from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  ColumnFiltersState,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlayerWithRelations } from "@/types/players-base"
import { AddEditPlayerDialog } from "@/models/dialogs/add-edit-player"
import { useToast } from "@/hooks/use-toast"
import { PlayerCreate, PlayerUpdate } from "@/types/players-base"
import { Search } from "lucide-react"


interface PlayersTableProps {
  data: PlayerWithRelations[]
  columns: ColumnDef<PlayerWithRelations>[]
  onAddPlayer: (data: PlayerCreate) => Promise<void>
  onEditPlayer: (id: number, data: PlayerUpdate) => Promise<void>
  onDeletePlayer: (id: number) => Promise<void>
}

export function PlayersTable({
  data,
  columns,
  onAddPlayer,
  onEditPlayer,
  onDeletePlayer
}: PlayersTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [searchValue, setSearchValue] = useState("")
  
  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerWithRelations | null>(null)
  
  const { toast } = useToast()

  const table = useReactTable({
    data,
    columns: columns.map(col => {
      if (col.id === "actions") {
        return {
          ...col,
          cell: ({ row }: any) => {
            const player = row.original
            return (
              <div className="flex flex-col">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    // Handle view player - you can implement this later
                    console.log("View player:", player.id)
                  }}
                >
                  <span className="">View</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedPlayer(player)
                    setEditDialogOpen(true)
                  }}
                >
                  <span className="">Edit</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedPlayer(player)
                    handleConfirmDelete(player.id)
                  }}
                >
                  <span className="">Delete</span>
                </Button>
              </div>
            )
          }
        }
      }
      return col
    }),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  })

  const handleSavePlayer = async (data: PlayerCreate | PlayerUpdate, mode: 'add' | 'edit') => {
    try {
      if (mode === 'add') {
        await onAddPlayer(data as PlayerCreate)
      } else {
        if (!selectedPlayer) return
        await onEditPlayer(selectedPlayer.id, data as PlayerUpdate)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : `Failed to ${mode} player`,
        variant: "destructive",
      })
      throw error
    }
  }

  const handleDeletePlayer = async () => {
    if (!selectedPlayer) return
    try {
      await onDeletePlayer(selectedPlayer.id)
      toast({
        title: "Success",
        description: "Player deleted successfully!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete player",
        variant: "destructive",
      })
      throw error
    }
  }

  const handleConfirmDelete = async (playerId: number) => {
    try {
      await onDeletePlayer(playerId)
      toast({
        title: "Success",
        description: "Player deleted successfully!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete player",
        variant: "destructive",
      })
    }
  }

  const handleSearch = () => {
    setGlobalFilter(searchValue)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="w-full">
      <div className="flex items-center py-4 gap-4">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search players..."
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            onKeyPress={handleKeyPress}
            className="max-w-sm"
          />
          <Button onClick={handleSearch} size="sm">
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <Button onClick={() => setAddDialogOpen(true)}>
          Add Player
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
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
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>

      {/* Dialogs */}
      <AddEditPlayerDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSave={handleSavePlayer}
        mode="add"
      />
      
      <AddEditPlayerDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        player={selectedPlayer}
        onSave={handleSavePlayer}
        mode="edit"
      />
    </div>
  )
} 