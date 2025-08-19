'use client'

import { Game } from '@/services/types'
import { useEffect } from 'react'
import { useFile } from '@/hooks/useFile'
import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

export const GamesInfo = ({ game }: { game: Game | any }) => {
  const info = Array.isArray(game?.items) ? game.items[0] : game

  const { imageUrl: coverUrl, fetch: fetchCover, loading: loadingCover } = useFile()
  const { imageUrl: iconUrl, fetch: fetchIcon, loading: loadingIcon } = useFile()

  useEffect(() => {
    if (info?.image) {
      fetchCover({ url: info.image })
    }
  }, [info?.image])

  useEffect(() => {
    if (info?.icon) {
      fetchIcon({ url: info.icon })
    }
  }, [info?.icon])

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex gap-4">
      <div className="flex-shrink-0 w-40 h-40">
        {loadingCover && <Skeleton className="w-40 h-40 rounded-lg" />}
        {!loadingCover && coverUrl && (
          <img src={coverUrl} alt={info?.name} className="rounded-lg w-40 h-40 object-cover" />
        )}
      </div>
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-2">{info?.name}</h1>
        <p className="text-gray-700 mb-4">{info?.description}</p>
      </div>
      <div className="flex-1">
        <h2 className="text-lg font-bold mb-2">Icon</h2>
        {loadingIcon && <Skeleton className="w-20 h-20" />}
        {!loadingIcon && iconUrl && (
          <img src={iconUrl} alt={info?.name + ' icon'} className="w-20 h-20 object-contain" />
        )}
      </div>
    </div>
  )
}
