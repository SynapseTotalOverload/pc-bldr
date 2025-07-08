import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'collapsible',
      label: 'Header Section',
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          name: 'headerHeading',
          type: 'text',
          label: 'Header Heading',
          defaultValue: 'Build Your Dream PC',
          admin: {
            description: 'Main heading text for the hero section',
          },
        },
        {
          name: 'headerDescription',
          type: 'textarea',
          label: 'Header Description',
          defaultValue: 'Configure and order your custom PC with our easy-to-use builder. Get exactly what you need for gaming, work, or creative projects.',
          admin: {
            description: 'Description text below the heading',
            rows: 3,
          },
        },
        {
          name: 'showHero',
          type: 'checkbox',
          label: 'Show Hero Section',
          defaultValue: true,
          admin: {
            description: 'Toggle visibility of the hero section',
          },
        },
      ],
    },
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
          overrides: {
            fields: [
              {
                type: 'row',
                fields: [
                  {
                    name: 'type',
                    type: 'radio',
                    admin: {
                      layout: 'horizontal',
                      width: '50%',
                    },
                    defaultValue: 'reference',
                    options: [
                      {
                        label: 'Internal link',
                        value: 'reference',
                      },
                      {
                        label: 'Custom URL',
                        value: 'custom',
                      },
                    ],
                  },
                  {
                    name: 'newTab',
                    type: 'checkbox',
                    admin: {
                      style: {
                        alignSelf: 'flex-end',
                      },
                      width: '50%',
                    },
                    label: 'Open in new tab',
                  },
                ],
              },
              {
                type: 'row',
                fields: [
                  {
                    name: 'reference',
                    type: 'relationship',
                    admin: {
                      condition: (_, siblingData) => siblingData?.type === 'reference',
                      width: '50%',
                    },
                    label: 'Document to link to',
                    relationTo: ['pages', 'posts'],
                    required: false, // Made optional
                  },
                  {
                    name: 'url',
                    type: 'text',
                    admin: {
                      condition: (_, siblingData) => siblingData?.type === 'custom',
                      width: '50%',
                    },
                    label: 'Custom URL',
                    required: false, // Made optional
                  },
                  {
                    name: 'label',
                    type: 'text',
                    admin: {
                      width: '50%',
                    },
                    label: 'Label',
                    required: false, // Made optional
                  },
                ],
              },
            ],
          },
        }),
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
