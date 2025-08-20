"use client"
import { useTeam } from "@/hooks/useTeam"
import { useGames } from "@/hooks/useGames"
import { TeamRead } from "@/types/team"
import { useEffect, useRef, useState, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useFile } from "@/hooks/useFile"
import { LazyLoadImage } from "react-lazy-load-image-component"
import { PlayerBase } from "@/types/players-base"

function PlayerImage({ url, alt }: { url?: string | null; alt: string }) {
  const { imageUrl, fetch, loading } = useFile();
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (!url) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: "150px" }
    );
    if (wrapperRef.current) observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, [url]);

  useEffect(() => {
    if (shouldLoad && url) fetch({ url });
  }, [shouldLoad, url]);

  if (!url) return null;

  return (
    <div ref={wrapperRef} className="w-20 h-20">
      {(loading || !imageUrl) && (
        <Skeleton className="w-full h-full rounded-md" />
      )}
      {!loading && imageUrl && (
        <LazyLoadImage
          src={imageUrl}
          alt={alt}
          className="w-20 h-20 object-cover rounded-md border"
          effect="opacity"
          threshold={100}
        />
      )}
    </div>
  );
}

export default function TeamPage() {
    const router = useRouter()
    const { fetchTeamById } = useTeam()
    const params = useParams<{ id: string }>()
    const [team, setTeam] = useState<TeamRead | null>(null)
    const [loading, setLoading] = useState(true)
    const [shouldLoad, setShouldLoad] = useState(false)

    const [shouldLoadJerseys, setShouldLoadJerseys] = useState(false)

    const wrapperRef = useRef<HTMLDivElement | null>(null)
    const jerseysWrapperRef = useRef<HTMLDivElement | null>(null)
    const { imageUrl, fetch } = useFile()
    const { imageUrl: jerseysUrl, fetch: fetchJerseys } = useFile()

    const { games, fetchGames } = useGames()

    useEffect(() => {
        fetchGames({ limit: 1000 })
    }, [])

    const gameNameById = useMemo(() => {
        return (games ?? []).reduce<Record<number,string>>((acc, g) => {
            acc[g.id as number] = g.name as string
            return acc
        }, {})
    }, [games])

    const groupedPlayers = useMemo(() => {
        const groups: Record<string, PlayerBase[]> = {}
        if (!team?.players) return {} as Record<string, PlayerBase[]>
        (team!.players as any[]).forEach((p: any) => {
            const player = p as PlayerBase
            const gid = player.game?.id ?? player.game?.id
            const key = gid ? String(gid) : "no_game"
            if (!groups[key]) groups[key] = []
            groups[key].push(player)
        })
        return groups
    }, [team?.players])

    useEffect(() => {
        if (!params?.id) return
        const fetchTeam = async () => {
            try {
                const data = await fetchTeamById(Number(params.id))
                setTeam(data)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchTeam()
    }, [params?.id, fetchTeamById])

    useEffect(() => {
        if (!team?.logo) return
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
      }, [team?.logo])

    useEffect(() => {
    if (shouldLoad && team?.logo) fetch({ url: team.logo })
    }, [shouldLoad, team?.logo])

    useEffect(() => {
    if (!team?.jerseys_img) return
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
        if (entry.isIntersecting) {
            setShouldLoadJerseys(true)
            observer.disconnect()
        }
        })
    }, { rootMargin: "150px" })
    if (jerseysWrapperRef.current) observer.observe(jerseysWrapperRef.current)
    return () => observer.disconnect()
    }, [team?.jerseys_img])

    useEffect(() => {
        if (shouldLoadJerseys && team?.jerseys_img) fetchJerseys({ url: team.jerseys_img })
    }, [shouldLoadJerseys, team?.jerseys_img])

    useEffect(() => {
        console.log('Team data:', team)
        if (team?.stickers) {
            console.log('Team stickers:', team.stickers)
            console.log('Stickers count:', team.stickers.length)
        }
    },[team])

    if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>

    return (
        <>
            <div className="w-full">
                <div className="flex items-center p gap-4 justify-between">
                    <h1 className="text-2xl font-bold">Team Page {team?.name}</h1>
                </div>
                {team && (
                    <div className="mt-6 flex flex-col md:flex-row gap-8">
                        {/* Team logo */}
                        {team.logo && (
                            <div ref={wrapperRef} className="w-[300px] h-[300px]">
                                {(!imageUrl) && <Skeleton className="w-full h-full rounded-lg" />}
                                {imageUrl && (
                                    <LazyLoadImage
                                        src={imageUrl}
                                        alt={team.name}
                                        className="w-[300px] h-[300px] object-cover rounded-lg border"
                                    />
                                )}
                            </div>
                        )}

                        <div className="flex-1 space-y-4">
                            {/* Description */}
                            {team.description && (
                                <div className="flex flex-col gap-2">
                                    <h1 className="text-2xl font-bold">Description</h1>
                                    <p className="text-muted-foreground whitespace-pre-line">{team.description}</p>
                                </div>
                            )}

                            {/* Social media links */}
                            {team.socila_media_links && (
                                <div className="flex flex-col gap-2 pt-2">
                                    <h1 className="text-2xl font-bold">Social Media</h1>
                                    {Object.entries(team.socila_media_links as unknown as Record<string, string>).map(([platform, url]) => (
                                        url ? (
                                            <div key={platform} className="flex gap-2 justify-between">
                                                <a
                                                    href={url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-500 hover:underline capitalize"
                                                >
                                                    {platform}
                                                </a>
                                                <p className="text-muted-foreground text-sm text-wrap">{url}</p>
                                            </div>
                                        ) : (
                                            <p key={platform} className="text-muted-foreground text-sm text-wrap">No {platform} link</p>
                                        )
                                    ))}
                                </div>
                            )}

                            {/* Jerseys image */}
                            {team.jerseys_img && (
                                <div>
                                <h1 className="text-2xl font-bold">Jerseys</h1>
                                <div ref={jerseysWrapperRef} className="w-64 h-auto">
                                    {(!jerseysUrl) && <Skeleton className="w-full h-full rounded-lg" />}
                                    {jerseysUrl && (
                                        <LazyLoadImage
                                            src={jerseysUrl}
                                            alt={team.name + " jerseys"}
                                            className="w-64 h-auto rounded-lg border"
                                            />
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Team Stickers */}
                            <div>
                                <div className="flex items-center justify-between">
                                    <h1 className="text-2xl font-bold">
                                        Team Stickers 
                                        {team.stickers && team.stickers.length > 0 && (
                                            <span className="text-sm font-normal text-muted-foreground ml-2">
                                                ({team.stickers.length})
                                            </span>
                                        )}
                                    </h1>
                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => {
                                            // TODO: Implement sticker editing modal
                                            console.log('Edit team stickers clicked')
                                        }}
                                    >
                                        Edit Stickers
                                    </Button>
                                </div>
                                {team.stickers && team.stickers.length > 0 ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-3">
                                        {team.stickers.map((sticker) => (
                                            <div key={sticker.id} className="flex flex-col items-center gap-2 p-3 border rounded-lg hover:shadow-md transition-shadow">
                                                {sticker.image_url && (
                                                    <div className="w-16 h-16">
                                                        <LazyLoadImage
                                                            src={sticker.image_url}
                                                            alt={sticker.name}
                                                            className="w-16 h-16 object-cover rounded-md border"
                                                            effect="opacity"
                                                            threshold={100}
                                                        />
                                                    </div>
                                                )}
                                                <div className="text-center">
                                                    <div className="font-medium text-sm truncate max-w-[120px]">
                                                        {sticker.name}
                                                    </div>
                                                    {sticker.s_type && (
                                                        <div className="text-xs text-muted-foreground">
                                                            {sticker.s_type}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground text-sm mt-3">No stickers assigned to this team yet.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
                <div className="flex flex-col gap-4">
                    <h1 className="text-2xl font-bold">Players by Game</h1>
                    {Object.keys(groupedPlayers).length === 0 && (
                        <p className="text-muted-foreground text-sm">No players in this team yet.</p>
                    )}
                    {(Object.entries(groupedPlayers) as [string, PlayerBase[]][]).map(([gameKey, players]) => (
                        <div key={gameKey} className="mt-4">
                            <h2 className="text-xl font-semibold mb-2">
                                {gameKey === "no_game" ? "No Game Specified" : gameNameById[Number(gameKey)] ?? `Game #${gameKey}`}
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {players.map((player) => (
                                    <div
                                        key={player.id}
                                        className="flex items-center gap-4 p-4 rounded-lg border hover:shadow-md transition-shadow cursor-pointer"
                                        // onClick={() => router.push(`/players/${player.id}`)}
                                    >
                                        <PlayerImage url={player.player_img} alt={String(player.player_name || player.name || "")} />
                                        <div className="flex-1">
                                            <p className="font-semibold text-lg leading-none">
                                                {player.player_name || player.name}
                                            </p>
                                            {player.name && player.player_name && (
                                                <p className="text-muted-foreground text-sm">{player.name}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}