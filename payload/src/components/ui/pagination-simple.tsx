import React from 'react'
import { Button } from './button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export const PaginationSimple: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) {
    return null
  }

  return (
    <div className="flex items-center justify-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>
      
      <div className="flex items-center space-x-1">
        {(() => {
          const pages = []
          const maxVisiblePages = 5
          const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
          const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
          
          if (startPage > 1) {
            pages.push(
              <Button
                key={1}
                variant="outline"
                size="sm"
                onClick={() => onPageChange(1)}
                className="w-8 h-8 p-0"
              >
                1
              </Button>
            )
            if (startPage > 2) {
              pages.push(
                <span key="ellipsis1" className="px-2 text-sm text-muted-foreground">
                  ...
                </span>
              )
            }
          }
          
          // Add visible pages
          for (let i = startPage; i <= endPage; i++) {
            pages.push(
              <Button
                key={i}
                variant={currentPage === i ? 'default' : 'outline'}
                size="sm"
                onClick={() => onPageChange(i)}
                className="w-8 h-8 p-0"
              >
                {i}
              </Button>
            )
          }
          
          // Add last page if not visible
          if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
              pages.push(
                <span key="ellipsis2" className="px-2 text-sm text-muted-foreground">
                  ...
                </span>
              )
            }
            pages.push(
              <Button
                key={totalPages}
                variant="outline"
                size="sm"
                onClick={() => onPageChange(totalPages)}
                className="w-8 h-8 p-0"
              >
                {totalPages}
              </Button>
            )
          }
          
          return pages
        })()}
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
} 