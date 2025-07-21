import type { GlobalConfig } from 'payload'
import { authenticated } from '../access/authenticated'
import { authenticatedOrPublished } from '../access/authenticatedOrPublished'
import { revalidateProduct } from './hooks/revalidateProduct'

export const Product: GlobalConfig = {
  slug: 'product',
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
          slug: 'productInfo',
          imageAltText: 'Product Info Block',
          interfaceName: 'ProductInfo',
          fields: [
            {
              name: 'heading',
              type: 'text',
              defaultValue: 'Product Details'
            },
            {
              name: 'description',
              type: 'textarea',
              defaultValue: 'Detailed information about this product.'
            },
            {
              name: 'showCategory',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Show product category'
              }
            },
            {
              name: 'showPrice',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Show product price'
              }
            },
            {
              name: 'showStock',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Show stock status'
              }
            },
            {
              name: 'showImage',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Show product image'
              }
            },
            {
              name: 'showButtonAmazon',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Show Amazon button'
              }
            },
          ]
        },
        {
          slug: 'productReviews',
          imageAltText: 'Product Reviews Block',
          interfaceName: 'ProductReviews',
          fields: [
            {
              name: 'heading',
              type: 'text',
              defaultValue: 'Reviews'
            },
            {
              name: 'showReviews',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Show product reviews'
              }
            },
            {
              name: 'showRating',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Show average rating'
              }
            }
          ]
        },
        {
          slug: 'productAttributes',
          imageAltText: 'Product Attributes Block',
          interfaceName: 'ProductAttributes',
          fields: [
            {
              name: 'heading',
              type: 'text',
              defaultValue: 'Attributes'
            },
            {
              name: 'showBrand',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Show brand'
              }
            },
            {
              name: 'showModel',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Show model'
              }
            },
            {
              name: 'showColor',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Show color'
              }
            },
            {
              name: 'showCores',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Show cores'
              }
            },
            {
              name: 'showThreads',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Show threads'
              }
            },
            {
              name: 'showSocketType',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Show socket type'
              }
            },
            {
              name: 'showBaseSpeed',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Show base speed'
              }
            },
            {
              name: 'showTurboSpeed',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Show turbo speed'
              }
            },
            {
              name: 'showArchitecture',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Show architecture'
              }
            },
            {
              name: 'showCoreFamily',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Show core family'
              }
            },
            {
              name: 'showGeneration',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Show generation'
              }
            },
            {
              name: 'showIntegratedGraphics',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Show integrated graphics'
              }
            },
            {
              name: 'showMemorySpeed',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Show memory speed'
              }
            },
            {
              name: 'showSeries',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Show series'
              }
            },
            {
              name: 'showBaseFanRPM',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Show base fan RPM'
              }
            },
            {
              name: 'showMaxFanRPM',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Show max fan RPM'
              }
            },
            {
              name: 'showBaseNoiseLevel',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Show base noise level'
              }
            },
            {
              name: 'showMaxNoiseLevel',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Show max noise level'
              }
            },
            {
              name: 'showBaseClock',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Show base clock'
              }
            },
            {
              name: 'showChipset',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Show chipset'
              }
            },
            {
              name: 'showClockSpeed',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Show clock speed'
              }
            },
            {
              name: 'showFrameSync',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Show frame sync'
              }
            },
            {
              name: 'showInterface',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Show interface'
              }
            },
            {
              name: 'showLength',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Show length'
              }
            },
            {
              name: 'showMemoryInterface',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Show memory interface'
              }
            },
            {
              name: 'showMemory',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Show memory'
              }
            },
            {
              name: 'showFormFactor',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Show form factor'
              }
            },
            {
              name: 'showMaxRAMSupport',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Show max RAM support'
              }
            },
            {
              name: 'showRAMSlots',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Show RAM slots'
              }
            },
            {
              name: 'showCASLatency',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Show CAS latency'
              }
            },
            {
              name: 'showOneUnitMemory',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Show one unit memory'
              }
            },
            {
              name: 'showQuantity',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Show quantity'
              }
            },
            {
              name: 'showRAMSpeed',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Show RAM speed'
              }
            },
            {
              name: 'showRAMType',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Show RAM type'
              }
            },
            {
              name: 'showTotalMemory',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Show total memory'
              }
            },
            {
              name: 'showCacheMemory',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Show cache memory'
              }
            },
            {
              name: 'showCapacity',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Show capacity'
              }
            },
            {
              name: 'showMemoryType',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Show memory type'
              }
            },
            {
              name: 'showEfficiency',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Show efficiency'
              }
            },
            {
              name: 'showPower',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Show power'
              }
            },
            {
              name: 'showCabinetType',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Show cabinet type'
              }
            },
            {
              name: 'showSidePanel',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Show side panel'
              }
            }
          ]
        },
      ]
    }
  ],
  hooks: {
    afterChange: [revalidateProduct],
  },
  admin: {
    description: 'Global settings for product pages'
  }
} 