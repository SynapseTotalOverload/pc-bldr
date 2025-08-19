"use client"
import { useFile } from "@/hooks/useFile";
import { useEffect, useRef, useState } from "react"
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "../ui/button";
import { Eye, Edit, Trash} from "lucide-react";
import { GameBase } from "@/types/game-base";
import { useRouter } from "next/navigation";

interface GameCardProps {
    game: GameBase
    onEdit: (game: GameBase) => void
    onDelete: (game: GameBase) => void
}

function GameImage({ url, alt }: { url: string; alt: string }) {
    const { imageUrl, fetch, loading } = useFile()
    const wrapperRef = useRef<HTMLDivElement | null>(null)
    const [shouldLoad, setShouldLoad] = useState(false)
  
    useEffect(() => {
      if (!url) return
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true)
            observer.disconnect()
          }
        })
      }, { rootMargin: "150px" })
      if (wrapperRef.current) observer.observe(wrapperRef.current)
      return () => observer.disconnect()
    }, [url])
  
    useEffect(() => {
      if (shouldLoad && url) fetch({ url })
    }, [shouldLoad, url])
  
    if (!url) return null
  
    return (
      <div ref={wrapperRef} className="w-[150px] h-[150px]">
        {(loading || !imageUrl) && <Skeleton className="w-full h-full rounded-lg" />}
        {!loading && imageUrl && (
          <LazyLoadImage
            src={imageUrl}
            alt={alt}
            className="w-[150px] h-[150px] object-cover rounded-lg"
            effect="opacity"
            threshold={100}
            wrapperClassName="w-[150px] h-[150px]"
          />
        )}
      </div>
    )
  }

export const GameCard = ({ game, onEdit, onDelete }: GameCardProps) => {
    const router = useRouter()
    return (
        <div className="flex flex-col gap-4 bg-card text-card-foreground rounded-lg border shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer w-full">
        <div className="flex gap-4">
        {/* First column - Image */}
        <div className="flex-shrink-0">
                <GameImage url={game.image || ""} alt={game.name || ""} />
        </div>
        
        {/* Second column - Information */}
        <div className="flex-1">
            <h1 className="font-semibold text-lg">{game.name}</h1>
        </div>

        {/* Third column - Actions */}
        <div className="grid grid-cols-1 col-1 gap-2 justify-end">
                <Button 
                    className="w-30 h-10"
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/games/${game.id}`)}
                >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                </Button>
                <Button
                    className="w-30 h-10"
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(game)}
                >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                </Button>
                <Button 
                    className="w-30 h-10"
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(game)}
                >
                    <Trash className="h-4 w-4 mr-2" />
                    Delete
                </Button>
            </div>
        </div>
    </div>
    )
}