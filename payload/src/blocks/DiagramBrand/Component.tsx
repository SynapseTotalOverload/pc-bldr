'use client'

import React, { useState, useEffect } from 'react'
import { cn } from '@/utilities/ui'
import { DiagramBrandBlockProps } from './types'
import DiagramBrands from './components/diagram-brands'
import { BrandUsageGraphResponse, ProductUsageGraphResponse } from '@/services/types'
import { useProductGraphs } from '@/collections/Pages/hooks/useProductGraphs'

type Props = {
  className?: string
} & DiagramBrandBlockProps

export const DiagramBrandBlock: React.FC<Props> = ({
  className,
  title,
  description,
  defaultCategory = 'cpu',
  showDateRange = true,
  showBrandSelector = true,
  styling
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [startDate, setStartDate] = useState<string>('2025-07-01');
    const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);  
    const [selectedCategory, setSelectedCategory] = useState<number>(1);
    const [selectedBrands, setSelectedBrands] = useState<string[]>(['Intel']);

    const { data, loading: loadingById, error: errorById, refetch } = useProductGraphs<BrandUsageGraphResponse>({
        start_date: startDate,
        end_date: endDate,
        category_ids: [selectedCategory],
        brands: selectedBrands
    });
    
    
    useEffect(() => {
        refetch();
    }, [startDate, endDate, selectedCategory, selectedBrands]);

  // Placeholder for future implementation
  const handleCategoryChange = (category: number) => {
    console.log('Category changed:', category)
  }

  const handleBrandChange = (brands: string[]) => {
    console.log('Brands changed:', brands)
  }

  const handleStartDateChange = (date: string) => {
    console.log('Start date changed:', date)
  }

  const handleEndDateChange = (date: string) => {
    console.log('End date changed:', date)
  }

  return (
    <div className={cn('w-full p-4', className)}>
      <DiagramBrands 
            data={data} 
            onStartDateChange={(date) => setStartDate(date)}
            onEndDateChange={(date) => setEndDate(date)}
            onCategoryChange={(category) => setSelectedCategory(category)}
            onBrandChange={(brands) => setSelectedBrands(brands)}
        />
    </div>
  )
} 