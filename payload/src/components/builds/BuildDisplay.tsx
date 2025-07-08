'use client'

import { useEffect, useState } from 'react'
import { Build } from '@/services/types'
import { BuildHeader } from './BuildHeader'
import { BuildInfoCard } from './BuildInfoCard'
import { BuildComponentsCard } from './BuildComponentsCard'
import { AlertTriangle, CheckCircle, Sparkles } from 'lucide-react'

interface BuildDisplayProps {
  data: Build
  template?: any
}

export const BuildDisplay = ({ data, template }: BuildDisplayProps) => {
  const [error, setError] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Add entrance animation
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Helper function to filter valid components
  const getValidComponents = () => {
    const allComponents = [
      data.cpu,
      data.cpu_cooler,
      data.gpu,
      data.motherboard,
      data.ram,
      data.storage,
      data.psu,
      data.case
    ]
    
    // Filter out null, undefined, or invalid components
    return allComponents.filter(component => 
      component && 
      typeof component === 'object' && 
      component.id && 
      component.title
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-50">
        <div className="container mx-auto py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-red-100 p-8">
              <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-red-600 mb-4">Error Loading Build</h1>
              <p className="text-gray-600 text-lg">{error}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto py-16">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              <div className="animate-pulse">
                <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-1/2 mx-auto"></div>
              </div>
              <div className="grid gap-6">
                <div className="animate-pulse">
                  <div className="h-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl"></div>
                </div>
                <div className="animate-pulse">
                  <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const validComponents = getValidComponents()

  if (!template) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl"></div>
          <div className="absolute top-3/4 left-1/2 w-48 h-48 bg-pink-200/30 rounded-full blur-3xl"></div>
        </div>

        <div className="relative container mx-auto py-16">
          <div className={`max-w-4xl mx-auto transition-all duration-1000 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            {/* Header with sparkles icon */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-purple-100">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <span className="text-purple-600 font-medium">PC Build Configuration</span>
              </div>
            </div>

            <div className="space-y-6">
              <BuildHeader title={data.name} />
              
              <BuildInfoCard
                price={data.build_price}
              />
              
              {validComponents.length > 0 && (
                <div className="transform transition-all duration-500 hover:scale-[1.02]">
                  <BuildComponentsCard
                    heading="Components"
                    components={validComponents}
                  />
                </div>
              )}
              
              {validComponents.length === 0 && (
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-dashed border-amber-200 rounded-2xl p-8 text-center transform transition-all duration-500 hover:scale-[1.02]">
                  <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-8 h-8 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-bold text-amber-800 mb-3">
                    No Components Available
                  </h3>
                  <p className="text-amber-700 text-lg">
                    This build doesn&apos;t have any valid components configured yet.
                  </p>
                  <div className="mt-6">
                    <button className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200">
                      Configure Components
                    </button>
                  </div>
                </div>
              )}

              {/* Success indicator when components are present */}
              {validComponents.length > 0 && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
                  <div className="flex items-center justify-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <span className="text-green-700 font-medium">
                      Build contains {validComponents.length} valid component{validComponents.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative container mx-auto py-16">
        <div className={`max-w-4xl mx-auto transition-all duration-1000 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {template.blocks?.map((block: any, index: number) => {
            const blockDelay = index * 200 // Stagger animation for each block
            
            return (
              <div 
                key={index}
                className={`transition-all duration-700 ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${blockDelay}ms` }}
              >
                {(() => {
                  switch (block.blockType) {
                    case 'buildInfo':
                      return (
                        <div className="transform transition-all duration-500 hover:scale-[1.02]">
                          <BuildInfoCard
                            heading={block.heading}
                            description={block.description}
                            name={data.name}
                            price={data.build_price}
                            showPrice={block.showPrice}
                          />
                        </div>
                      )
                    case 'buildComponents':
                      // Only render if there are valid components or if explicitly configured to show empty state
                      if (validComponents.length === 0 && !block.showEmptyState) {
                        return null
                      }
                      
                      return (
                        <div className="transform transition-all duration-500 hover:scale-[1.02]">
                          <BuildComponentsCard
                            heading={block.heading}
                            components={validComponents}
                            showComponentList={block.showComponentList}
                            showPrices={block.showPrices}
                          />
                        </div>
                      )
                    default:
                      return null
                  }
                })()}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
} 