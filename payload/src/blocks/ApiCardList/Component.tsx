'use client'

import { cn } from '@/utilities/ui'
import React, { useEffect, useState } from 'react'
import { productsService } from '@/services/products'
import { ApiCardListBlockProps, ApiResponse } from './types'
import { CategoryFilter } from '@/blocks/ApiCardList/components/CategoryFilter'
import { SearchInput } from '@/components/ui/SearchInput'
import { ProductCard } from './components/ProductCard'
import { PriceFilter } from './components/PriceFilter'
import { buildsService } from '@/services/builds'

type Props = {
  className?: string
} & ApiCardListBlockProps

export const ApiCardListBlock: React.FC<Props> = ({
  className,
  title,
  description,
  cardType = 'product',
  category_id,
  build_type,
  accessory_category,
  layout = 'grid',
  columns = '3',
  itemsPerPage = 2,
  showPagination = false,
  styling
}) => {
  const [data, setData] = useState<ApiResponse>({
    items: [],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 6
    }
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [price_min, setPriceMin] = useState<number>(0)
  const [price_max, setPriceMax] = useState<number>(1000000)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)


        let result: ApiResponse | null = null

        if (cardType === 'product' || cardType === 'accessories') {
          const searchParams = new URLSearchParams()

          if(cardType === 'accessories') {
            searchParams.append("periphery_flag", "true")
          }
          if(activeCategory || category_id || accessory_category) {
            searchParams.append("category_id", activeCategory || category_id || accessory_category || '')
          }
          if(searchQuery) {
            searchParams.append("query", searchQuery)
          }
          searchParams.append("page", page.toString())
          searchParams.append("page_size", itemsPerPage.toString())
          if(price_min && price_max) {
            searchParams.append("price_min", price_min.toString())
            searchParams.append("price_max", price_max.toString())
          }
          console.log(searchParams.toString())
          const productResult = await productsService.getProducts(searchParams.toString())

          result = productResult as ApiResponse
        } else if (cardType === 'builds') {

          const searchParams = new URLSearchParams()
          if(build_type || activeCategory) {
            const buildTypeValue = build_type || activeCategory;
            if (buildTypeValue && buildTypeValue !== 'all') {
              const skip = ((page - 1) * itemsPerPage)
              searchParams.append("skip", skip.toString())
              searchParams.append("limit",itemsPerPage.toString())
              searchParams.append("return_models","true")
              searchParams.append("build_type",buildTypeValue)
              searchParams.append("show_in_site_only","true")
            }
          }else{
            const skip = ((page - 1) * itemsPerPage)
            searchParams.append("skip", skip.toString())
            searchParams.append("limit",itemsPerPage.toString())
            searchParams.append("return_models","false")
            searchParams.append("show_in_site_only","true")
          }
          if (searchQuery) {
            searchParams.append('query', searchQuery);
          }
          if (price_min && price_max) {
            searchParams.append("price_min",price_min.toString())
            searchParams.append("price_max",price_max.toString())
          }

          const buildsResult = await buildsService.getBuilds(searchParams.toString())

          if (buildsResult.items && buildsResult.pagination) {
            result = {
              items: buildsResult.items,
              pagination: {
                currentPage: buildsResult.pagination.currentPage,
                totalPages: buildsResult.pagination.totalPages,
                totalItems: buildsResult.pagination.totalItems,
                itemsPerPage: buildsResult.pagination.itemsPerPage
              }
            }
          } else {
            result = {
              items: buildsResult.items || [],
              pagination: {
                currentPage: page,
                totalPages: 1,
                totalItems: buildsResult.items?.length || 0,
                itemsPerPage: itemsPerPage
              }
            }
          }
        }
        if (result) {
          setData(result)
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data'
        setError(errorMessage)
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [cardType, category_id, build_type, itemsPerPage, accessory_category, activeCategory, page, searchQuery, price_min, price_max])

  const handleCategoryChange = (category: string | null) => {
    setActiveCategory(category)
    setPage(1)

  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const onPriceChange = (min: number, max: number) => {
    setPriceMin(min)
    setPriceMax(max)
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const shouldShowFilter = (cardType === 'product' && !category_id) || 
                         (cardType === 'builds' && !build_type) ||
                         (cardType === 'accessories' && !accessory_category)

  const gridCols = {
    '1': 'grid-cols-1',
    '2': 'grid-cols-1 md:grid-cols-2',
    '3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    '4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }

  const bgClasses = {
    default: 'bg-background',
    primary: 'bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/20 dark:to-indigo-950/30',
    secondary: 'bg-gradient-to-r from-slate-50 to-gray-100 dark:from-slate-900/30 dark:to-gray-900/40 border-t border-slate-200/50 dark:border-slate-700/50',
    accent: 'bg-gradient-to-bl from-purple-50 via-pink-50 to-orange-50 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-orange-950/20',
    muted: 'bg-gradient-to-t from-neutral-100 to-stone-50 dark:from-neutral-900/40 dark:to-stone-900/30 shadow-inner',
  }

  let stylingClasses = ''
    if(styling?.backgroundColor == 'default') {
      stylingClasses = bgClasses[styling?.backgroundColor as keyof typeof bgClasses] || bgClasses.default
    } else if(styling?.backgroundColor == 'primary') {
      stylingClasses = bgClasses[styling?.backgroundColor as keyof typeof bgClasses] || bgClasses.primary
    } else if(styling?.backgroundColor == 'secondary') {
      stylingClasses = bgClasses[styling?.backgroundColor as keyof typeof bgClasses] || bgClasses.secondary
    } else if(styling?.backgroundColor == 'accent') {
      stylingClasses = bgClasses[styling?.backgroundColor as keyof typeof bgClasses] || bgClasses.accent
    } else if(styling?.backgroundColor == 'muted') {
      stylingClasses = bgClasses[styling?.backgroundColor as keyof typeof bgClasses] || bgClasses.muted
    }

  return (
    <div className={cn('mx-auto my-16 w-full', className)}>
      <div className={cn('py-12 px-4', stylingClasses)}>
        <div className="container mx-auto">
          {title && <h2 className="text-3xl font-bold text-center mb-4">{title}</h2>}
          {description && <p className="text-muted-foreground text-center mb-8">{description}</p>}
          
          <div className="space-y-6">
            <SearchInput onSearch={handleSearch} />

            <PriceFilter onPriceChange={onPriceChange} />
            
            
            {shouldShowFilter && (
              <CategoryFilter
                activeCategory={activeCategory}
                onCategoryChange={handleCategoryChange}
                cardType={cardType}
              />
            )}
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading data...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-destructive mb-4">
                <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-lg font-semibold">Loading error</p>
                <p className="text-muted-foreground">{error}</p>
              </div>
            </div>
          ) : (
            <>
              {data.items.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No data to display</p>
                </div>
              ) : (
                <>
                  <div className={cn(
                    'grid gap-6 mt-6',
                    layout === 'grid' && gridCols[columns as keyof typeof gridCols],
                    layout === 'list' && 'grid-cols-1',
                    layout === 'carousel' && 'flex overflow-x-auto space-x-6'
                  )}>
                    {data.items.map((item, index) => (
                      <ProductCard
                        key={item.id || index}
                        item={item}
                        cardType={cardType}
                        styling={styling}
                      />
                    ))}
                  </div>

                  {showPagination && data.pagination.totalItems > itemsPerPage && (
                    <div className="relative mt-12">
                      <div className="absolute inset-0 from-gray-50/50 via-blue-50/30 to-gray-50/50 rounded-2xl" />
                      
                      <div className="relative z-10 p-6">
                        <div className="flex items-center justify-center gap-4">
                          <button
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1}
                            className={cn(
                              'group relative overflow-hidden px-5 py-3 rounded-xl transition-all duration-300 flex items-center gap-2',
                              page === 1
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl hover:scale-105'
                            )}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <span className="relative z-10 text-lg">←</span>
                          </button>
                          
                          <div className="flex items-center gap-2">
                            {page > 3 && (
                              <>
                                <button
                                  onClick={() => handlePageChange(1)}
                                  className="px-4 py-2 rounded-lg bg-white/80 backdrop-blur-sm border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 font-medium text-gray-700 hover:text-blue-700"
                                >
                                  1
                                </button>
                                {page > 4 && <span className="px-2 text-gray-400">...</span>}
                              </>
                            )}
                            
                            {Array.from({ length: Math.min(5, data.pagination.totalPages) }, (_, i) => {
                              const startPage = Math.max(1, page - 2)
                              const pageNum = startPage + i
                              
                              if (pageNum > data.pagination.totalPages) return null
                              
                              const isCurrentPage = pageNum === page
                              
                              return (
                                <button
                                  key={pageNum}
                                  onClick={() => handlePageChange(pageNum)}
                                  className={cn(
                                    'px-4 py-2 rounded-lg transition-all duration-200 font-medium',
                                    isCurrentPage
                                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg scale-110'
                                      : 'bg-white/80 backdrop-blur-sm border border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700 hover:text-blue-700 hover:scale-105'
                                  )}
                                >
                                  {pageNum}
                                </button>
                              )
                            })}
                            
                            {page < data.pagination.totalPages - 2 && (
                              <>
                                {page < data.pagination.totalPages - 3 && <span className="px-2 text-gray-400">...</span>}
                                <button
                                  onClick={() => handlePageChange(data.pagination.totalPages)}
                                  className="px-4 py-2 rounded-lg bg-white/80 backdrop-blur-sm border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 font-medium text-gray-700 hover:text-blue-700"
                                >
                                  {data.pagination.totalPages}
                                </button>
                              </>
                            )}
                          </div>
                          
                          <button
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page === data.pagination.totalPages}
                            className={cn(
                              'group relative overflow-hidden px-5 py-3 rounded-xl transition-all duration-300 flex items-center gap-2',
                              page === data.pagination.totalPages
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl hover:scale-105'
                            )}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <span className="relative z-10 text-lg">→</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
} 