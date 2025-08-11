import { ColumnDef } from "@tanstack/react-table"
import { PlayerWithRelations } from "@/types/players-base"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Eye, Copy } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { LazyLoadImage } from "react-lazy-load-image-component"

export const playersColumns: ColumnDef<PlayerWithRelations>[] = [
  {
    accessorKey: "player_name",
    header: "Player Name",
    cell: ({ row }) => {
      const player = row.original
      return (
        <div className="flex items-center gap-3">
          {player.player_img && (
            <div className="w-10 h-10">
              <LazyLoadImage 
                src={player.player_img} 
                alt={player.player_name}
                className="w-10 h-10 rounded-full object-cover"
                effect="opacity"
                placeholderSrc="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNlNWU3ZWYiLz4KPC9zdmc+"
                threshold={100}
                wrapperClassName="w-10 h-10"
              />
            </div>
          )}
          <div className="flex items-center gap-2 space-between">
            <div className="font-medium">{player.player_name}</div>
            {player.name && (
              <div className="text-sm text-muted-foreground">{player.name}</div>
            )}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={async () => {
                try {
                  await navigator.clipboard.writeText(player.player_name)
                } catch (err) {
                  console.error('Failed to copy:', err)
                }
              }}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "team",
    header: "Team",
    cell: ({ row }) => {
      const team = row.getValue("team") as string
      return team ? (
        <Badge variant="secondary">{team}</Badge>
      ) : (
        <span className="text-muted-foreground">-</span>
      )
    },
  },
  {
    accessorKey: "country",
    header: "Country",
    cell: ({ row }) => {
      const country = row.getValue("country") as string
      return country ? (
        <Badge variant="outline">{country}</Badge>
      ) : (
        <span className="text-muted-foreground">-</span>
      )
    },
  },
  {
    accessorKey: "birthday",
    header: "Birthday",
    cell: ({ row }) => {
      const birthday = row.getValue("birthday") as string
      return birthday ? (
        <div className="text-sm">
          {format(new Date(birthday), "MMM dd, yyyy")}
        </div>
      ) : (
        <span className="text-muted-foreground">-</span>
      )
    },
  },
  {
    accessorKey: "note",
    header: "Notes",
    cell: ({ row }) => {
      const note = row.getValue("note") as string
      return note ? (
        <div className="text-sm max-w-[200px] truncate" title={note}>
          {note}
        </div>
      ) : (
        <span className="text-muted-foreground">-</span>
      )
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const player = row.original
      
      return (
        <div className="flex flex-col">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              // Handle view player
              console.log("View player:", player.id)
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              // Handle edit player
              console.log("Edit player:", player.id)
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              console.log("Delete player:", player.id)
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    },
  },
] 