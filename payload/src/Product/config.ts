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
            },
            {
              name: 'showImage',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Show product image'
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
        },
        {
          slug: 'productImage',
          imageAltText: 'Product Image Block',
          interfaceName: 'ProductImage',
          fields: [
            {
              name: 'heading',
              type: 'text',
              defaultValue: 'Product Image'
            },
            {
              name: 'imageSize',
              type: 'select',
              defaultValue: 'medium',
              options: [
                {
                  label: 'Small',
                  value: 'small'
                },
                {
                  label: 'Medium',
                  value: 'medium'
                },
                {
                  label: 'Large',
                  value: 'large'
                }
              ],
              admin: {
                description: 'Choose the display size for the product image'
              }
            }
          ]
        }
      ]
    }
  ],
  admin: {
    description: 'Global settings for product pages'
  }
} 