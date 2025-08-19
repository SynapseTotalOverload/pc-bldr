'use client'

import React, { useState, useEffect } from 'react'
import { PlayerWithRelations } from './types'
import { playersService } from '@/services/players'
import { SearchInput } from '@/components/ui/SearchInput'
import { PlayersList } from './components/PlayersList'

interface ApiPlayerListProps {
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

export const ApiPlayerList: React.FC<ApiPlayerListProps> = ({
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
  const [players, setPlayers] = useState<PlayerWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')

  const fetchPlayers = async (page: number = 1) => {
    setLoading(true)
    try {
      const params: any = {
        skip: (page - 1) * itemsPerPage,
        limit: itemsPerPage,
      }

      if (searchQuery) {
        params.query = searchQuery
      }


      const response = await playersService.getPlayers(params)
      setPlayers(response.items || [])
      setTotalItems(response.total || 0)
      setTotalPages(Math.ceil((response.total || 0) / itemsPerPage))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch players')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPlayers(currentPage)
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

        <PlayersList
          players={players}
          loading={loading}
          error={error}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          showPagination={showPagination}
          columns={columns}
          cardStyle={styling.cardStyle || 'default'}
          onRetry={() => fetchPlayers(currentPage)}
          onPageChange={setCurrentPage}
        />
      </div>
    </section>
  )
} 