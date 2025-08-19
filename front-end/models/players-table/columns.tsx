import { ColumnDef } from "@tanstack/react-table"
import { PlayerWithRelations } from "@/types/players-base"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Eye, Copy } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { LazyLoadImage } from "react-lazy-load-image-component"
import { useEffect, useRef, useState } from "react"
import { useFile } from "@/hooks/useFile"
import { Skeleton } from "@/components/ui/skeleton"

function PlayerImage({ url, alt }: { url: string; alt: string }) {
  const { imageUrl, fetch, loading } = useFile()
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    if (!url) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true)
            observer.disconnect()
          }
        })
      },
      { rootMargin: "150px" }
    )
    if (wrapperRef.current) observer.observe(wrapperRef.current)
    return () => observer.disconnect()
  }, [url])

  useEffect(() => {
    if (shouldLoad && url) {
      fetch({ url })
    }
  }, [shouldLoad, url])

  if (!url) return null

  return (
    <div ref={wrapperRef} className="w-10 h-10">
      {(loading || !imageUrl) && <Skeleton className="w-10 h-10 rounded-full" />}
      {!loading && imageUrl && (
        <LazyLoadImage
          src={imageUrl}
          alt={alt}
          className="w-10 h-10 rounded-full object-cover"
          effect="opacity"
          threshold={100}
          wrapperClassName="w-10 h-10"
        />
      )}
    </div>
  )
}

export const playersColumns: ColumnDef<PlayerWithRelations>[] = [
  {
    accessorKey: "player_name",
    header: "Player Name",
    cell: ({ row }) => {
      const player = row.original
      return (
        <div className="flex items-center gap-3">
          {player.player_img && <PlayerImage url={player.player_img} alt={player.player_name} />}
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
      const teamObj = row.getValue("team") as any;
      const teamName = typeof teamObj === "string" ? teamObj : teamObj?.name;
      return teamName ? (
        <Badge variant="secondary">{teamName}</Badge>
      ) : (
        <span className="text-muted-foreground">-</span>
      );
    },
  },
  {
    accessorKey: "country",
    header: "Country",
    cell: ({ row }) => {
      const countryObj = row.getValue("country") as any
      const countryName = typeof countryObj === "string" ? countryObj : countryObj?.name
      return countryName ? (
        <Badge variant="outline">{countryName}</Badge>
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