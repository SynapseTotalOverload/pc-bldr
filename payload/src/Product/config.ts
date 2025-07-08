import type { GlobalConfig } from 'payload'
import { authenticated } from '../access/authenticated'
import { authenticatedOrPublished } from '../access/authenticatedOrPublished'

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
            }
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
          ]
        }
      ]
    }
  ],
  admin: {
    description: 'Global settings for product pages'
  }
} 