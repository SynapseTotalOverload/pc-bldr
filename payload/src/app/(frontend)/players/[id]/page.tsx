import { PlayerDisplay } from '@/components/players/PlayerDispaly'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { cache } from 'react'

type Args = {
  params: Promise<{
    id: string
  }>
}

export const revalidate = 0

const queryPlayerPageTemplate = cache(async () => {
  const global = await getCachedGlobal('player')
  const playerConfig = typeof global === 'function' ? await global() : global
  return JSON.parse(JSON.stringify(playerConfig))
})

export async function generateStaticParams() {
  return []
}

// export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
//   try {
//     const { id } = await paramsPromise
//     const productResponse = await productsService.getProduct(parseInt(id))
//     const productData = productResponse.data?.[0] || productResponse as ServiceProduct
//     return {
//       title: productData.title || 'Product',
//       description: productData.description || 'Product details'
//     }
//   } catch (error) {
//     console.error('Error fetching product data:', error)
//     return {
//       title: 'Product Not Found',
//       description: 'The requested product could not be found.'
//     }
//   }
// }

const ProductPageComponent = async ({ params: paramsPromise }: Args) => {
  try {
    const { id } = await paramsPromise
    const playerConfigRaw = await queryPlayerPageTemplate()
    const playerConfig = JSON.parse(JSON.stringify(playerConfigRaw))

    console.log(playerConfig)
    
    return <PlayerDisplay blocks={playerConfig.blocks}/>
  } catch (error) {
    console.error('Error loading product page:', error)
    return <div>Product not found</div>
  }
}

export default ProductPageComponent 

