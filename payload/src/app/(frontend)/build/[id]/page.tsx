import { cache } from 'react'
import { Metadata } from 'next'

import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { Build } from '@/services/types'
import { BuildDisplay } from '@/components/builds/BuildDisplay'
import { buildsService } from '@/services/builds'

type Args = {
  params: Promise<{
    id: string
  }>
}

const queryBuildConfig = cache(async () => {
  const payload = await getPayloadHMR({ config: configPromise })
  const buildConfig = await payload.findGlobal({
    slug: 'build',
  })
  return buildConfig
})

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  try {
    const { id } = await paramsPromise
    const buildResponse = await buildsService.getBuild(parseInt(id))
    // Handle ApiResponse structure - extract build from response
    const buildData = buildResponse.data?.[0] || buildResponse as Build

    return {
      title: buildData.name || 'Build',
      description: `Build configuration: ${buildData.build_type || 'Custom build'}`
    }
  } catch (error) {
    console.error('Error fetching build data:', error)
    return {
      title: 'Build Not Found',
      description: 'The requested build could not be found.'
    }
  }
}

const BuildPageComponent = async ({ params: paramsPromise }: Args) => {
  try {
    const { id } = await paramsPromise
    const [buildResponse, buildConfig] = await Promise.all([
      buildsService.getBuild(parseInt(id)),
      queryBuildConfig()
    ])

    // Handle ApiResponse structure - extract build from response
    const buildData = buildResponse.data?.[0] || buildResponse as Build

    return <BuildDisplay data={buildData} template={buildConfig} />
  } catch (error) {
    console.error('Error loading build page:', error)
    return <div>Build not found</div>
  }
}

export default BuildPageComponent 