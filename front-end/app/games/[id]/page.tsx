"use client"
import { useGames } from "@/hooks/useGames"
import { GameBase } from "@/types/game-base"
import { useEffect, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeftIcon } from "lucide-react"
import { ThemeToggle } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useFile } from "@/hooks/useFile"
import { LazyLoadImage } from "react-lazy-load-image-component"

export default function GamePage() {
    const router = useRouter()
    const { fetchGameById } = useGames()
    const params = useParams<{ id: string }>()
    const [game, setGame] = useState<GameBase | null>(null)
    const [loading, setLoading] = useState(true)
    const [shouldLoad, setShouldLoad] = useState(false)

    const [shouldLoadIcon, setShouldLoadIcon] = useState(false)

    const wrapperRef = useRef<HTMLDivElement | null>(null)
    const iconWrapperRef = useRef<HTMLDivElement | null>(null)
    const { imageUrl, fetch } = useFile()
    const { imageUrl: iconUrl, fetch: fetchIcon } = useFile()

    useEffect(() => {
        if (!params?.id) return
        const fetchGame = async () => {
            try {
                const data = await fetchGameById(Number(params.id))
                setGame(data)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchGame()
    }, [params?.id, fetchGameById])

    useEffect(() => {
        if (!game?.image) return
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setShouldLoad(true)
              observer.disconnect()
            }
          })
        }, { rootMargin: "350px" })
        if (wrapperRef.current) observer.observe(wrapperRef.current)
        return () => observer.disconnect()
      }, [game?.image])

      useEffect(() => {
        if (shouldLoad && game?.image) fetch({ url: game.image })
      }, [shouldLoad, game?.image])

      // Observe jerseys image
      useEffect(() => {
        if (!game?.icon) return
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setShouldLoadIcon(true)
              observer.disconnect()
            }
          })
        }, { rootMargin: "150px" })
        if (iconWrapperRef.current) observer.observe(iconWrapperRef.current)
        return () => observer.disconnect()
      }, [game?.icon])

      useEffect(() => {
        if (shouldLoadIcon && game?.icon) fetchIcon({ url: game.icon })
      }, [shouldLoadIcon, game?.icon])

    useEffect(() => {
        const isAdmin = localStorage.getItem('isAdmin')
        if (!isAdmin) {
          router.push('/auth');
        }
      }, [router]);

    if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>

    return (
        <main className="bg-background flex flex-col items-center justify-between p-4">
            <div className="flex gap-4 justify-start w-full pb-4">
                <Button className="cursor-pointer" onClick={() => router.back()}>
                    <ArrowLeftIcon className="h-4 w-4" />
                </Button>
                <ThemeToggle />
            </div>
            <div className="w-full">
                <div className="flex items-center p gap-4 justify-between">
                    <h1 className="text-2xl font-bold">Game Page {game?.name}</h1>
                </div>
                {game && (
                    <div className="mt-6 flex flex-col md:flex-row gap-8">
                        {/* Game logo */}
                        {game.image && (
                            <div ref={wrapperRef} className="w-[300px] h-[300px]">
                                {(!imageUrl) && <Skeleton className="w-full h-full rounded-lg" />}
                                {imageUrl && (
                                    <LazyLoadImage
                                        src={imageUrl}
                                        alt={game.name}
                                        className="w-[300px] h-[300px] object-cover rounded-lg border"
                                    />
                                )}
                            </div>
                        )}

                        <div className="flex-1 space-y-4">
                            {/* Description */}
                            {game.description && (
                                <div className="flex flex-col gap-2">
                                    <h1 className="text-2xl font-bold">Description</h1>
                                    <p className="text-muted-foreground whitespace-pre-line">{game.description}</p>
                                </div>
                            )}

                            {/* Icon image */}
                            {game.icon && (
                                <div>
                                <h1 className="text-2xl font-bold">Icon</h1>
                                <div ref={iconWrapperRef} className="w-64 h-auto">
                                    {(!iconUrl) && <Skeleton className="w-full h-full rounded-lg" />}
                                    {iconUrl && (
                                        <LazyLoadImage
                                            src={iconUrl}
                                            alt={game.name + " icon"}
                                            className="w-64 h-auto rounded-lg border"
                                            />
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
    </main>
    )
}