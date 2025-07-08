'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProductAttributes, Product } from '@/services/types'
import { useEffect } from 'react'
import { Attributes } from './components/Attributes'

interface ProductDisplayProps {
  data: Product
  template?: any // Type for template can be refined later
}

export const ProductDisplay = ({ data, template }: ProductDisplayProps) => {
  const [error, setError] = useState<string | null>(null)

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-red-500">Error loading product</h1>
          <p className="text-gray-600 mt-4">{error}</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  // If there is no template, show the basic view
  if (!template) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>{data.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium capitalize">{data.category.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="font-medium text-green-600">{formatPrice(data.price)}</p>
                </div>
                {data.rating && (
                  <div>
                    <p className="text-sm text-muted-foreground">Rating</p>
                    <p className="font-medium">{data.rating} / 5</p>
                  </div>
                )}
                {data.asin && (
                  <div>
                    <p className="text-sm text-muted-foreground">ASIN</p>
                    <p className="font-medium">{data.asin}</p>
                  </div>
                )}
              </div>
              {data.description && (
                <div className="mt-6">
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="mt-2">{data.description}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // If there is a template, render it with data
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        {template.blocks?.map((block: any, index: number) => {
          switch (block.blockType) {
            case 'productInfo':
              return (
                <Card key={index} className="mb-6">
                  <CardHeader>
                    <CardTitle>{data.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {block.showCategory && data.category && (
                        <div>
                          <p className="text-sm text-muted-foreground">Category</p>
                          <p className="font-medium capitalize">{data.category.name}</p>
                        </div>
                      )}
                      {block.showPrice && (
                        <div>
                          <p className="text-sm text-muted-foreground">Price</p>
                          <p className="font-medium text-green-600">{formatPrice(data.price)}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            case 'productReviews':
              if (!block.showReviews) return null
              return (
                <Card key={index} className="mb-6">
                  <CardHeader>
                    <CardTitle>{block.heading || 'Reviews'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {block.showRating && data.rating && (
                      <div className="mb-4">
                        <p className="text-sm text-muted-foreground">Average Rating</p>
                        <p className="font-medium">{data.rating} / 5</p>
                      </div>
                    )}
                    <div className="space-y-4">
                      {data.reviews?.map((review: any) => (
                        <div key={review.id} className="border-b pb-4 last:border-0">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">{review.author}</span>
                            <span className="text-muted-foreground">{review.rating}/5</span>
                          </div>
                          <p className="text-muted-foreground">{review.content}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )

            case 'productAttributes':
              return (
                <Card key={index} className="mb-6">
                  <CardHeader>
                    <CardTitle>Attributes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Attributes {...(data.attrs as ProductAttributes)} />
                  </CardContent>
                </Card>
              )
            default:
              return null
          }
        })}
      </div>
    </div>
  )
}
