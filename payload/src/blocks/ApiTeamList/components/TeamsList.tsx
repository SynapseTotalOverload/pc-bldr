'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { PaginationSimple } from '@/components/ui/pagination-simple'
import Link from 'next/link'
import { useFile } from '@/hooks/useFile'
import { Skeleton } from '@/components/ui/skeleton'

interface TeamItem {
  id: number
  name: string
  logo?: string
}

function TeamLogo({ url, alt }: { url?: string; alt: string }) {
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
    if (shouldLoad && url) fetch({ url })
  }, [shouldLoad, url])

  if (!url) return null

  return (
    <div ref={wrapperRef} className="w-20 h-20">
      {(loading || !imageUrl) && <Skeleton className="w-20 h-20 rounded-lg" />}
      {!loading && imageUrl && <img src={imageUrl} alt={alt} className="w-20 h-20 object-cover rounded-lg" />}
    </div>
  )
}

interface TeamsListProps {
  teams: TeamItem[]
  loading: boolean
  error: string | null
  currentPage: number
  totalPages: number
  itemsPerPage: number
  showPagination: boolean
  columns: string
  cardStyle: string
  onPageChange: (page: number) => void
}

export const TeamsList: React.FC<TeamsListProps> = ({
  teams = [],
  loading,
  error,
  currentPage,
  totalPages,
  itemsPerPage,
  showPagination,
  columns,
  cardStyle,
  onPageChange,
}) => {
  const getCardStyleClasses = () => {
    const base = 'transition-all duration-200'
    switch (cardStyle) {
      case 'elevated':
        return `${base} shadow-lg hover:shadow-xl`
      case 'bordered':
        return `${base} border-2 hover:border-primary`
      case 'minimal':
        return `${base} bg-transparent border border-border/50`
      default:
        return `${base} shadow-md hover:shadow-lg`
    }
  }

  const getGridCols = () => {
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

  // Loading state
  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading teams...</p>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-8 text-destructive">Error: {error}</div>
    )
  }

  if (!teams || teams.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">No teams found</div>
    )
  }

  const paginatedTeams = itemsPerPage > 0 ? teams.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) : teams

  return (
    <>
      <div className={`grid gap-6 ${getGridCols()}`}>
        {paginatedTeams.map((team) => (
          <Link href={`/team/${team.id}`} key={team.id}>
            <Card className={getCardStyleClasses()}>
              <CardHeader className="pb-4">
                <div className="flex items-start space-x-4">
                  <TeamLogo url={team.logo} alt={team.name} />
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg font-semibold truncate">{team.name}</CardTitle>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      {showPagination && totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <PaginationSimple currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
        </div>
      )}
    </>
  )
}
