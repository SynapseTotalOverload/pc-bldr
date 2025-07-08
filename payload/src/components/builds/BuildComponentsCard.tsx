'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/utilities/ui'
import { BuildProduct } from '@/services/types'
import { Cpu, HardDrive, MemoryStick, Monitor, Zap, Package, Fan, Shield } from 'lucide-react'

interface BuildComponentsCardProps {
  heading?: string
  components: BuildProduct[]
  showComponentList?: boolean
  showPrices?: boolean
  className?: string
}

// Component icon mapping
const getComponentIcon = (categoryName: string) => {
  const category = categoryName.toLowerCase()
  if (category.includes('cpu')) return <Cpu className="w-5 h-5 text-blue-600" />
  if (category.includes('gpu') || category.includes('video')) return <Monitor className="w-5 h-5 text-green-600" />
  if (category.includes('memory') || category.includes('ram')) return <MemoryStick className="w-5 h-5 text-purple-600" />
  if (category.includes('storage') || category.includes('drive')) return <HardDrive className="w-5 h-5 text-orange-600" />
  if (category.includes('power') || category.includes('psu')) return <Zap className="w-5 h-5 text-yellow-600" />
  if (category.includes('cooler') || category.includes('fan')) return <Fan className="w-5 h-5 text-cyan-600" />
  if (category.includes('case')) return <Shield className="w-5 h-5 text-gray-600" />
  return <Package className="w-5 h-5 text-gray-500" />
}

export const BuildComponentsCard: React.FC<BuildComponentsCardProps> = ({
  heading = 'Components',
  components,
  showComponentList = true,
  showPrices = true,
  className
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  if (!showComponentList || components.length === 0) {
    return null
  }

  return (
    <Card className={cn("mb-6 overflow-hidden bg-gradient-to-br from-white to-slate-50 border-0 shadow-xl", className)}>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-100">
          {components.map((component, index) => (
            <div 
              key={component.id}
              className="group hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mt-1">
                    {getComponentIcon(component.category.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 group-hover:text-blue-900 transition-colors duration-300 leading-tight break-words">
                      {component.title}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                        {component.category.name}
                      </span>
                    </div>
                  </div>
                </div>
                {showPrices && (
                  <div className="flex-shrink-0 text-right">
                    <p className="font-bold text-lg text-green-600 group-hover:text-green-700 transition-colors duration-300">
                      {formatPrice(component.price)}
                    </p>
                    <p className="text-xs text-gray-500">
                      Price
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 