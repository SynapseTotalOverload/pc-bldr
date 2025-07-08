'use client'

import { cn } from '@/utilities/ui'
import { Computer, Sparkles } from 'lucide-react'

interface BuildHeaderProps {
  title: string
  className?: string
}

export const BuildHeader: React.FC<BuildHeaderProps> = ({ 
  title,
  className 
}) => {
  return (
    <div className={cn("mb-8", className)}>
      <div className="relative">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 rounded-3xl blur-xl"></div>
        
        {/* Main header card */}
        <div className="relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-2xl p-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-lg opacity-70"></div>
              <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-full">
                <Computer className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-600 animate-pulse" />
              <span className="text-purple-600 font-medium text-lg">Build Configuration</span>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
            {title}
          </h1>
          
          {/* Decorative line */}
          <div className="flex items-center justify-center mt-6">
            <div className="h-1 w-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
            <div className="mx-3">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-pulse"></div>
            </div>
            <div className="h-1 w-24 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  )
} 