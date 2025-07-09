import type { GlobalConfig } from 'payload'
import { authenticated } from '../access/authenticated'
import { authenticatedOrPublished } from '../access/authenticatedOrPublished'

export const Build: GlobalConfig = {
  slug: 'build',
  access: {
    read: authenticatedOrPublished,
    update: authenticated,
  },
  fields: [
    {
      name: 'blocks',
      type: 'blocks',
      blocks: [
        {
          slug: 'buildInfo',
          imageAltText: 'Build Info Block',
          interfaceName: 'BuildInfo',
          fields: [
            {
              name: 'heading',
              type: 'text',
              defaultValue: 'Build Details'
            },
            {
              name: 'description',
              type: 'textarea',
              defaultValue: 'Detailed information about this PC build configuration.'
            },
            {
              name: 'showBuildType',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Show build type'
              }
            },
            {
              name: 'showPrice',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Show build price'
              }
            }
          ]
        },
        {
          slug: 'buildComponents',
          imageAltText: 'Build Components Block',
          interfaceName: 'BuildComponents',
          fields: [
            {
              name: 'heading',
              type: 'text',
              defaultValue: 'Components'
            },
            {
              name: 'showComponentList',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Show list of components in this build'
              }
            },
            {
              name: 'showPrices',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Show component prices'
              }
            }
          ]
        }
      ]
    }
  ],
  admin: {
    description: 'Global settings for build pages'
  }
} 