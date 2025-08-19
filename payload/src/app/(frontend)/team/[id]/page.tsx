import { TeamDisplay } from '@/components/team/TeamDisplay'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { cache } from 'react'
import { Metadata } from 'next'
import { teamService } from '@/services/team'

type Args = {
  params: Promise<{
    id: string
  }>
}

export const revalidate = 0

const queryTeamPageTemplate = cache(async () => {
  const global = await getCachedGlobal('team' as any)
  const teamConfig = typeof global === 'function' ? await global() : global
  return JSON.parse(JSON.stringify(teamConfig))
})

export async function generateStaticParams() {
  return []
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  try {
    const { id } = await paramsPromise
    const teamResponse = await teamService.getTeam(parseInt(id))
    const teamData: any = teamResponse
    return {
      title: (teamData?.items?.[0]?.name ?? teamData?.name) || 'Team',
      description: (teamData?.items?.[0]?.description ?? teamData?.description) || 'Team details'
    }
  } catch (error) {
    console.error('Error fetching product data:', error)
    return {
      title: 'Team Not Found',
      description: 'The requested team could not be found.'
    }
  }
}

const ProductPageComponent = async ({ params: paramsPromise }: Args) => {
  try {
    const { id } = await paramsPromise
    const [teamResponse, teamConfigRaw] = await Promise.all([
      teamService.getTeam(parseInt(id)),
      queryTeamPageTemplate()
    ])

    const teamData: any = teamResponse
    const teamConfig = JSON.parse(JSON.stringify(teamConfigRaw))
    
    return <TeamDisplay blocks={teamConfig.blocks} team={teamData}/>
  } catch (error) {
    return <div>Player not found</div>
  }
}

export default ProductPageComponent 

