'use client'

import React, { useState, useEffect } from 'react'
import { SearchInput } from '@/components/ui/SearchInput'
import { TeamsList } from './components/TeamsList'
import { useTeam } from '@/hooks/useTeam'

interface ApiTeamListProps {
  title?: string
  description?: string
  itemsPerPage?: number
  columns?: '1' | '2' | '3' | '4'
  showPagination?: boolean
  styling?: {
    backgroundColor?: 'default' | 'primary' | 'secondary' | 'accent' | 'muted'
    cardStyle?: 'default' | 'elevated' | 'bordered' | 'minimal'
  }
}

export const ApiTeamList: React.FC<ApiTeamListProps> = ({
  title,
  description,
  itemsPerPage = 12,
  columns = '3',
  showPagination = true,
  styling = {
    backgroundColor: 'default',
    cardStyle: 'default',
  },
}) => {
  const { teams, loading, error, fetchTeams } = useTeam()
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const params: any = {
      skip: (currentPage - 1) * itemsPerPage,
      limit: itemsPerPage,
    }
    if (searchQuery) params.query = searchQuery
    fetchTeams(params)
  }, [currentPage, itemsPerPage, searchQuery])

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

  const totalItems = (teams as any)?.length || 0
  const totalPages = itemsPerPage > 0 ? Math.ceil(totalItems / itemsPerPage) : 1

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  return (
    <section className={`py-12 ${getBackgroundColorClasses()}`}>
      <div className="container mx-auto px-4">
        {title && (
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">{title}</h2>
            {description && <p className="text-muted-foreground max-w-2xl mx-auto">{description}</p>}
          </div>
        )}
        <SearchInput onSearch={handleSearch} />

        <TeamsList
          teams={teams as any}
          loading={loading}
          error={error?.message || null}
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          showPagination={showPagination}
          columns={columns}
          cardStyle={styling.cardStyle || 'default'}
          onPageChange={setCurrentPage}
        />
      </div>
    </section>
  )
}
