import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PaginationSimple } from '@/components/ui/pagination-simple'
import { PlayerWithRelations } from '../types'
import Link from 'next/link'

interface PlayersListProps {
  players: PlayerWithRelations[]
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

export const PlayersList: React.FC<PlayersListProps> = ({
  players,
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
  onPageChange
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
        <p className="mt-4 text-muted-foreground">Loading players...</p>
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

  if (players.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No players found</p>
      </div>
    )
  }

  return (
    <>
      <div className={`grid gap-6 ${getGridColumns()}`}>
        {players.map((player) => (
          <Link href={`/players/${player.id}`} key={player.id}>
          <Card key={player.id} className={getCardStyleClasses()}>
            <CardHeader className="pb-4">
              <div className="flex items-start space-x-4">
                <div className="relative">
                  <img src={player.player_img} alt={player.player_name} className="w-20 h-20 object-cover rounded-lg" />
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg font-semibold truncate">
                    {player.player_name}
                  </CardTitle>
                  {player.name && player.name !== player.player_name && (
                    <p className="text-sm text-muted-foreground truncate">
                      {player.name}
                    </p>
                  )}
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