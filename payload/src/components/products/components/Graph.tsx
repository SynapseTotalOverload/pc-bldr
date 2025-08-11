'use client'

import { Card, CardContent } from '@/components/ui/card'
import Diagram from '@/components/ui/graphs/diagram'
import { useGraphById } from '@/hooks/useGraphById'
import { ProductUsageGraphResponse } from '@/services/types'
import { useEffect, useState } from 'react'

interface GraphProps {
  productId: number
}

export default function Graph({ productId }: GraphProps) {
    const [startDate, setStartDate] = useState<string>('2025-07-01');
    const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);

 const { data, loading, error, refetch } = useGraphById<ProductUsageGraphResponse>({
    start_date: startDate,
    end_date: endDate,
    product_id: productId
  })

  useEffect(() => {
    refetch()
    console.log(data)
  }, [startDate, endDate])

  if (!data) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <svg 
              className="w-16 h-16 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" 
              />
            </svg>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300`}>
      <CardContent className="p-0 relative">
        <Diagram 
          data={data} 
          onStartDateChange={(date) => setStartDate(date)} 
          onEndDateChange={(date) => setEndDate(date)} 
        />
      </CardContent>
    </Card>
  )
}