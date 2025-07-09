'use client'

import { Card } from '@/components/ui/card'
import { cn } from '@/utilities/ui'
import { CardProps } from '../types'
import Link from 'next/link'
import { Star, Tag, Cpu, Zap, Package, ShoppingCart } from 'lucide-react'

export const ProductCard: React.FC<CardProps> = ({ item, cardType, styling }) => {
  const cardStyles = {
    default: 'bg-gradient-to-br from-white to-gray-50/80 hover:shadow-lg transition-all duration-300 border border-gray-200/60',
    elevated: 'bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-200/40',
    bordered: 'bg-gradient-to-br from-white to-purple-50/30 border-2 border-purple-200/50 hover:border-purple-400/60 hover:shadow-lg transition-all duration-300',
    minimal: 'bg-white/60 backdrop-blur-sm border border-gray-200/50 hover:border-gray-300/70 hover:shadow-md transition-all duration-300',
  }

  const formatPrice = (price: number | string | undefined) => {
    if (!price) return 'Price not available'
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(numericPrice)
  }

  if (cardType === 'product') {
    const product = item as any
    return (
      <Link href={`/product/${product.id}`} className="group">
        <Card className={cn(
          'overflow-hidden transition-all duration-300 relative',
          cardStyles[styling?.cardStyle || 'default'],
          'hover:scale-[1.02] group-hover:shadow-xl'
        )}>
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {product.rating && product.rating >= 4.5 && (
            <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs px-2 py-1 rounded-full shadow-md">
              <Star className="w-3 h-3 inline mr-1" />
              Premium
            </div>
          )}
          
          <div className="p-6 relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
            </div>

            <h3 className="font-bold text-lg line-clamp-2 group-hover:text-blue-700 transition-colors duration-200 mb-3">
              {product.title}
            </h3>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-green-600" />
                <span className="font-bold text-xl text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                  {formatPrice(product.price)}
                </span>
              </div>
              {product.rating && (
                <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="font-semibold text-yellow-700">{product.rating.toFixed(1)}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-sm text-blue-600 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
              <span className="font-medium">View Details</span>
              <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center">
                →
              </div>
            </div>
          </div>
        </Card>
      </Link>
    )
  }

  if (cardType === 'builds') {
    const build = item as any
    return (
      <Link href={`/build/${build.id}`} className="group">
        <Card className={cn(
          'overflow-hidden transition-all duration-300 relative',
          cardStyles[styling?.cardStyle || 'default'],
          'hover:scale-[1.02] group-hover:shadow-xl'
        )}>
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="p-6 relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg">
                <Cpu className="w-5 h-5 text-green-600" />
              </div>
            </div>

            <h3 className="font-bold text-lg line-clamp-2 group-hover:text-green-700 transition-colors duration-200 mb-4">
              {build.name}
            </h3>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-green-600" />
                <span className="font-bold text-xl text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                  {formatPrice(build.build_price)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-green-600 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
              <span className="font-medium">View Build</span>
              <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">
                →
              </div>
            </div>
          </div>
        </Card>
      </Link>
    )
  }

  return null
}