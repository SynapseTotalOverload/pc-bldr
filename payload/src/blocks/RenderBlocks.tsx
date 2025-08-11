import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { FeatureCardBlock } from '@/blocks/FeatureCard/Component'
import { FeatureListBlock } from '@/blocks/FeatureList/Component'
import { ApiCardListBlock } from '@/blocks/ApiCardList/Component'
import { ApiPlayerList } from '@/blocks/ApiPlayerList/Component'
import { WhyWorkWithUs } from '@/blocks/WhyWorkWithUs/Component'
import { HeroMeteorComponent } from '@/blocks/HeroMeteor/Component'
import { Integration2Component } from '@/blocks/Integration2/Component'
import { Feature242Component } from '@/blocks/Feature242/Component'
import { Feature157Component } from '@/blocks/Feature157/Component'
import { Feature251Component } from '@/blocks/Feature251/Component'
import { Testimonial19Component } from '@/blocks/Testimonial19/Component'
import { Feature253Component } from '@/blocks/Feature253/Component'
import { ApiPlayerListComponent } from './ApiPlayerList'
import { DiagramBrandBlock } from './DiagramBrand/Component'

const blockComponents = {
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  featureCard: FeatureCardBlock,
  featureList: FeatureListBlock,
  apiCardList: ApiCardListBlock,
  apiPlayerList: ApiPlayerListComponent,
  whyWorkWithUs: WhyWorkWithUs,
  heroMeteor: HeroMeteorComponent,
  integration2: Integration2Component,
  feature242: Feature242Component,
  feature157: Feature157Component,
  feature251: Feature251Component,
  testimonial19: Testimonial19Component,
  feature253: Feature253Component,
  diagramBrand: DiagramBrandBlock,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <div className="my-16" key={index}>
                  {/* @ts-expect-error there may be some mismatch between the expected types here */}
                  <Block {...block} disableInnerContainer />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
