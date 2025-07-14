'use client'

import { useState, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'

interface ImgProductProps {
  src: string | undefined
  alt?: string
  className?: string
}

export default function ImgProduct({ src, alt = "Product", className = "" }: ImgProductProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  
  console.log('src', src)

  const handleImageLoadStart = () => {
    setIsLoading(true)
    setHasError(false)
  }

  const handleImageLoad = () => {
    setIsLoading(false)
  }

  const handleImageError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  if (!src || src.trim() === '') {
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
    <Card className={`overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ${className}`}>
      <CardContent className="p-0 relative">
        {isLoading && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse flex items-center justify-center z-10">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        )}
        
        {hasError ? (
          <div className="aspect-square bg-gradient-to-br from-red-50 to-red-100 flex flex-col items-center justify-center">
            <svg 
              className="w-16 h-16 text-red-400 mb-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" 
              />
            </svg>
            <p className="text-red-500 text-sm font-medium">Failed to load image</p>
          </div>
        ) : (
          <div className="relative group">
            <img 
              ref={imgRef}
              src={src} 
              alt={alt}
              className="w-full h-auto object-contain max-h-96 transition-transform duration-300 group-hover:scale-105"
              onLoadStart={handleImageLoadStart}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
            
            {/* Overlay gradient for better text readability if needed */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Optional zoom indicator */}
            <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <svg 
                className="w-4 h-4 text-gray-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" 
                />
              </svg>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}