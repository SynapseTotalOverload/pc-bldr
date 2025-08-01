import { PlayerWithRelations } from '@/blocks/ApiPlayerList/types'
import { PlayerDisplay } from '@/components/players/PlayerDispaly'
import { playersService } from '@/services/players'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { cache } from 'react'
import { Metadata } from 'next'

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

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  try {
    const { id } = await paramsPromise
    const playerResponse = await playersService.getPlayer(parseInt(id))
    const playerData = playerResponse as PlayerWithRelations
    return {
      title: playerData.player_name || 'Player',
      description: playerData.info || 'Player details'
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
    const [playerResponse, playerConfigRaw] = await Promise.all([
      playersService.getPlayer(parseInt(id)),
      queryPlayerPageTemplate()
    ])

    const playerData = playerResponse as PlayerWithRelations
    const playerConfig = JSON.parse(JSON.stringify(playerConfigRaw))
    
    return <PlayerDisplay blocks={playerConfig.blocks} player={playerData}/>
  } catch (error) {
    console.error('Error loading product page:', error)
    return <div>Product not found</div>
  }
}

export default ProductPageComponent 

