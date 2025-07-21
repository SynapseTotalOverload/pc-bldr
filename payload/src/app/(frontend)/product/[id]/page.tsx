import { cache } from 'react'
import { Metadata } from 'next'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { Product as ServiceProduct } from '@/services/types'
import { Product as GlobalProduct } from '@/payload-types'
import { ProductDisplay } from '@/components/products/ProductDisplay'
import { productsService } from '@/services/products'
import { getCachedGlobal } from '@/utilities/getGlobals'

type Args = {
  params: Promise<{
    id: string
  }>
}

export const revalidate = 0

const queryProductPageTemplate = cache(async () => {
  const global = await getCachedGlobal('product')
  const productConfig = typeof global === 'function' ? await global() : global
  return JSON.parse(JSON.stringify(productConfig))
})

export async function generateStaticParams() {
  return []
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  try {
    const { id } = await paramsPromise
    const productResponse = await productsService.getProduct(parseInt(id))
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
    const [productResponse, productConfigRaw] = await Promise.all([
      productsService.getProduct(parseInt(id)),
      queryProductPageTemplate()
    ])
    
    const productData = productResponse.data?.[0] || productResponse as ServiceProduct
    const productConfig = JSON.parse(JSON.stringify(productConfigRaw))
    
    return <ProductDisplay data={productData} template={productConfig} />
  } catch (error) {
    console.error('Error loading product page:', error)
    return <div>Product not found</div>
  }
}

export default ProductPageComponent 

