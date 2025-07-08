import { cache } from 'react'
import { Metadata } from 'next'

import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { Product as ServiceProduct } from '@/services/types'
import { Product as GlobalProduct } from '@/payload-types'
import { ProductDisplay } from '@/components/products/ProductDisplay'
import { productsService } from '@/services/products'

type Args = {
  params: Promise<{
    id: string
  }>
}

export async function generateStaticParams() {
  return []
}

const queryProductPageTemplate = cache(async (): Promise<GlobalProduct> => {
  const payload = await getPayloadHMR({ config: configPromise })
  const productConfig = await payload.findGlobal({
    slug: 'product',
  })
  return productConfig
})

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  try {
    const { id } = await paramsPromise
    const productResponse = await productsService.getProduct(parseInt(id))
    // Handle ApiResponse structure - extract product from response
    const productData = productResponse.data?.[0] || productResponse as ServiceProduct
    
    return {
      title: productData.title || 'Product',
      description: productData.description || 'Product details'
    }
  } catch (error) {
    console.error('Error fetching product data:', error)
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.'
    }
  }
}

const ProductPageComponent = async ({ params: paramsPromise }: Args) => {
  try {
    const { id } = await paramsPromise
    const [productResponse, productConfig] = await Promise.all([
      productsService.getProduct(parseInt(id)),
      queryProductPageTemplate()
    ])
    
    // Handle ApiResponse structure - extract product from response
    const productData = productResponse.data?.[0] || productResponse as ServiceProduct
    
    console.log('productData', productData)
    return <ProductDisplay data={productData} template={productConfig} />
  } catch (error) {
    console.error('Error loading product page:', error)
    return <div>Product not found</div>
  }
}

export default ProductPageComponent 

