'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PaginationSimple } from '@/components/ui/pagination-simple'
import { Game } from '@/services/types'
import Link from 'next/link'
import { useFile } from '@/hooks/useFile'
import { Skeleton } from '@/components/ui/skeleton'

function GameImage({ url, alt }: { url: string; alt: string }) {
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
      { rootMargin: '150px' }
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
    <div ref={wrapperRef} className="w-20 h-20">
      {(loading || !imageUrl) && <Skeleton className="w-20 h-20 rounded-lg" />}
      {!loading && imageUrl && (
        <img src={imageUrl} alt={alt} className="w-20 h-20 object-cover rounded-lg" />
      )}
    </div>
  )
}

interface GamesListProps {
  games: Game[]
  loading: boolean
  error: string | null
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  showPagination: boolean
  columns: string
  cardStyle: string
  onRetry: () => void
  onPageChange: (page: number) => void
}

export const GamesList: React.FC<GamesListProps> = ({
  games,
  loading,
  error,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  showPagination,
  columns,
  cardStyle,
  onRetry,
  onPageChange,
}) => {
  const getCardStyleClasses = () => {
    const baseClasses = 'transition-all duration-200'

    switch (cardStyle) {
      case 'elevated':
        return `${baseClasses} shadow-lg hover:shadow-xl`
      case 'bordered':
        return `${baseClasses} border-2 hover:border-primary`
      case 'minimal':
        return `${baseClasses} bg-transparent border border-border/50`
      default:
        return `${baseClasses} shadow-md hover:shadow-lg`
    }
  }

  const getGridColumns = () => {
    switch (columns) {
      case '1':
        return 'grid-cols-1'
      case '2':
        return 'grid-cols-1 md:grid-cols-2'
      case '3':
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      case '4':
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
      default:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
    }
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading games...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Error: {error}</p>
        <Button onClick={onRetry} className="mt-4">
          Try Again
        </Button>
      </div>
    )
  }

  if (games.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No games found</p>
      </div>
    )
  }

  return (
    <>
      <div className={`grid gap-6 ${getGridColumns()}`}>
        {games.map((game) => (
          <Link href={`/game/${game.id}`} key={game.id}>
            <Card className={getCardStyleClasses()}>
              <CardHeader className="pb-4">
                <div className="flex items-start space-x-4">
                  {game.image && <GameImage url={game.image} alt={game.name} />}
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg font-semibold truncate">
                      {game.name}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      {showPagination && totalPages > 1 && totalItems > 0 && (
        <div className="mt-8 flex justify-center">
          <PaginationSimple
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </>
  )
}
