import { GameDisplay } from '@/components/game/GameDisplay'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { cache } from 'react'
import { Metadata } from 'next'
import { gameService } from '@/services/game'

type Args = {
  params: Promise<{
    id: string
  }>
}

export const revalidate = 0

const queryGamePageTemplate = cache(async () => {
  const global = await getCachedGlobal('game' as any)
  const gameConfig = typeof global === 'function' ? await global() : global
  return JSON.parse(JSON.stringify(gameConfig))
})

export async function generateStaticParams() {
  return []
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  try {
    const { id } = await paramsPromise
    const gameData: any = await gameService.getGame(parseInt(id))
    return {
      title: (gameData?.items?.[0]?.name ?? gameData?.name) || 'Game',
      description: (gameData?.items?.[0]?.description ?? gameData?.description) || 'Game details'
    }
  } catch (error) {
    console.error('Error fetching product data:', error)
    return {
      title: 'Game Not Found',
      description: 'The requested game could not be found.'
    }
  }
}

const ProductPageComponent = async ({ params: paramsPromise }: Args) => {
  try {
    const { id } = await paramsPromise
    const [gameData, gameConfigRaw] = await Promise.all([
      gameService.getGame(parseInt(id)),
      queryGamePageTemplate()
    ])

    const gameConfig = JSON.parse(JSON.stringify(gameConfigRaw))
    
    return <GameDisplay blocks={gameConfig.blocks} game={gameData}/>
  } catch (error) {
    return <div>Game not found</div>
  }
}

export default ProductPageComponent 

