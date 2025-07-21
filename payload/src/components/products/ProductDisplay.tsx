'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProductAttributes, Product } from '@/services/types'
import { Attributes } from './components/Attributes'
import ImgProduct from './components/ImgProdut'
import { Button } from '@payloadcms/ui'
import Link from 'next/link'

interface ProductDisplayProps {
  data: Product
  template?: any 
}

export const ProductDisplay = ({ data, template }: ProductDisplayProps) => {
  const [error, setError] = useState<string | null>(null)
  
  const safeTemplate = typeof template === 'function' ? undefined : template

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
  if (!safeTemplate) {
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

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        {safeTemplate.blocks?.map((block: any, index: number) => {
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
                      {block.showButtonAmazon && (
                          <Link className='flex bg-blue-500 text-white p-2 rounded-md items-center justify-center' href={`https://www.amazon.com/dp/${data.asin}?tag=dennyschoenme-21`}>
                            View on Amazon
                          </Link>
                      )}
                    </div>
                    {block.showImage && (data.high_image_url || data.low_image_url) && (
                      <div className="mt-4">
                        <ImgProduct src={data.high_image_url || data.low_image_url} />
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            case 'productImage':
              if (!data.high_image_url && !data.low_image_url) return null
              const imageSizeClass = {
                small: 'max-w-sm',
                medium: 'max-w-md',
                large: 'max-w-2xl'
              }[(block.imageSize as 'small' | 'medium' | 'large') || 'medium']
              
              return (
                <Card key={index} className="mb-6">
                  <CardHeader>
                    <CardTitle>{block.heading || 'Product Image'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={`mx-auto ${imageSizeClass}`}>
                      <ImgProduct 
                        src={data.high_image_url || data.low_image_url} 
                        alt={data.title}
                      />
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
                    <Attributes data={data.attrs as ProductAttributes} template={safeTemplate.blocks[1]}/>
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
