'use client'

import Link from 'next/link'
import { useFile } from '@/hooks/useFile'
import { Skeleton } from '@/components/ui/skeleton'
import { useEffect, useMemo } from 'react'

interface PlayerItem {
  id: number
  player_name: string
  player_img?: string
  game_id?: number
  game?: { id: number; name?: string }
}

export const PlayersList = ({ players = [] }: { players: PlayerItem[] }) => {
  const gameNameById = useMemo(() => {
    return players.reduce<Record<number, string>>((acc, p) => {
      const gid = p.game?.id ?? p.game_id;
      if (gid && !acc[gid]) acc[gid] = p.game?.name || `Game #${gid}`;
      return acc;
    }, {});
  }, [players]);

  const grouped = useMemo(() => {
    return players.reduce<Record<string, PlayerItem[]>>((acc, p) => {
      const gid = p.game_id ?? p.game?.id
      const key = gid ? String(gid) : 'no_game'
      ;(acc[key] ??= []).push(p)
      return acc
    }, {})
  }, [players])

  if (players.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 text-center text-gray-500">
        No players found
      </div>
    )
  }

  return (
    <div className="space-y-10">
      {(Object.entries(grouped) as [string, PlayerItem[]][]).map(([gameKey, list]) => (
        <div key={gameKey} className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">
            {gameKey === 'no_game' ? 'No Game Specified' : gameNameById[Number(gameKey)] ?? `Game #${gameKey}`}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {list.map((player) => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

const PlayerCard = ({ player }: { player: PlayerItem }) => {
  const { imageUrl, fetch, loading } = useFile()

  useEffect(() => {
    if (player.player_img) fetch({ url: player.player_img })
  }, [player.player_img])

  return (
    <Link href={`/players/${player.id}`} className="block hover:scale-105 transition-transform duration-200">
      <div className="flex flex-col items-center gap-2">
        <div className="w-24 h-24 rounded-full overflow-hidden">
          {loading && <Skeleton className="w-24 h-24 rounded-full" />}
          {!loading && imageUrl && (
            <img src={imageUrl} alt={player.player_name} className="object-cover w-24 h-24" />
          )}
        </div>
        <span className="text-sm text-center font-medium truncate max-w-[6rem]">
          {player.player_name}
        </span>
      </div>
    </Link>
  )
}
