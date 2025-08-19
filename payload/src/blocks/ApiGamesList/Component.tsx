'use client'

import React, { useState, useEffect } from 'react'
import { Game } from '@/services/types'
import { gameService } from '@/services/game'
import { SearchInput } from '@/components/ui/SearchInput'
import { GamesList } from './components/GamesList'

interface ApiGamesListProps {
  title?: string
  description?: string
  filterBy?: 'all' | 'team' | 'country' | 'query'
  teamFilter?: string
  countryFilter?: string
  searchQuery?: string
  layout?: 'grid' | 'list' | 'carousel'
  columns?: '1' | '2' | '3' | '4'
  itemsPerPage?: number
  showPagination?: boolean
  showPlayerInfo?: {
    showTeam?: boolean
    showCountry?: boolean
    showBirthday?: boolean
    showInfo?: boolean
    showGearList?: boolean
    showPcSpecs?: boolean
    showSkins?: boolean
  }
  styling?: {
    backgroundColor?: 'default' | 'primary' | 'secondary' | 'accent' | 'muted'
    cardStyle?: 'default' | 'elevated' | 'bordered' | 'minimal'
    imageStyle?: 'rounded' | 'square' | 'circle'
  }
}

export const ApiGamesList: React.FC<ApiGamesListProps> = ({
  title,
  description,
  filterBy = 'all',
  layout = 'grid',
  columns = '3',
  itemsPerPage = 12,
  showPagination = true,
  showPlayerInfo = {
    showTeam: true,
    showCountry: true,
    showBirthday: false,
    showInfo: false,
    showGearList: true,
    showPcSpecs: true,
    showSkins: true,
  },
  styling = {
    backgroundColor: 'default',
    cardStyle: 'default',
    imageStyle: 'rounded',
  },
}) => {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')

  const fetchGames = async (page: number = 1) => {
    setLoading(true)
    try {
      const params: any = {
        skip: (page - 1) * itemsPerPage,
        limit: itemsPerPage,
      }

      if (searchQuery) {
        params.query = searchQuery
      }

      const response = await gameService.getGames(params)
      const list: Game[] = (response as any).items ?? (response as any).data?.items ?? (response as any).data ?? []
      const total: number = (response as any).total ?? (response as any).pagination?.totalItems ?? list.length
      setGames(list)
      setTotalItems(total)
      setTotalPages(itemsPerPage > 0 ? Math.ceil(total / itemsPerPage) : 1)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch games')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGames(currentPage)
  }, [currentPage, filterBy, searchQuery, itemsPerPage])

  const getBackgroundColorClasses = () => {
    switch (styling.backgroundColor) {
      case 'primary':
        return 'bg-primary/5'
      case 'secondary':
        return 'bg-secondary/5'
      case 'accent':
        return 'bg-accent/5'
      case 'muted':
        return 'bg-muted/50'
      default:
        return 'bg-background'
    }
  }

  
  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }



  return (
    <section className={`py-12 ${getBackgroundColorClasses()}`}>
      <div className="container mx-auto px-4">
        {title && (
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">{title}</h2>
            {description && (
              <p className="text-muted-foreground max-w-2xl mx-auto">{description}</p>
            )}
          </div>
        )}
        <SearchInput onSearch={handleSearch} />

        <GamesList
          games={games}
          loading={loading}
          error={error}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          showPagination={showPagination}
          columns={columns}
          cardStyle={styling.cardStyle || 'default'}
          onRetry={() => fetchGames(currentPage)}
          onPageChange={setCurrentPage}
        />
      </div>
    </section>
  )
} 