'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/utilities/ui'
import { DollarSign, Info } from 'lucide-react'

interface BuildInfoCardProps {
  heading?: string
  description?: string
  price?: number
  showPrice?: boolean
  name?: string
  showName?: boolean
  className?: string
}

export const BuildInfoCard: React.FC<BuildInfoCardProps> = ({
  heading = 'Build Details',
  description,
  price,
  showPrice = true,
  name,
  showName = true,
  className
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  return (
    <Card className={cn("mb-6 bg-gradient-to-br from-white to-blue-50/50 border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300", className)}>
      <CardHeader className="pb-4">
        {showName && name && (  
          <CardTitle className="flex items-center gap-3 text-gray-800">
            {name}
          </CardTitle>
        )}
      </CardHeader>
      <CardContent>
        {showPrice && price !== 0 && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-green-700 font-medium">Total Price</p>
                <p className="text-2xl font-bold text-green-800">{formatPrice(price || 0)}</p>
              </div>
            </div>
          </div>
        )}
        
        {description && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
            <p className="text-gray-700 leading-relaxed">{description}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 