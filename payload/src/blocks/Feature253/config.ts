import type { Block } from 'payload';

export const Feature253: Block = {
  slug: 'feature253',
  labels: {
    singular: 'Feature 253 Section',
    plural: 'Feature 253 Sections',
  },
  fields: [
    {
      name: 'enabled',
      type: 'checkbox',
      label: 'Enable Block',
      defaultValue: true,
    },
    {
      name: 'title',
      type: 'text',
      label: 'Main Title',
      defaultValue: 'Your Ultimate Solution',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      defaultValue: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt Lorem ipsum dolor sit amet, consectetur',
      required: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'buttonText',
          type: 'text',
          label: 'Button Text',
          defaultValue: 'Join Today',
          required: true,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'link',
          type: 'group',
          label: 'Button Link',
          fields: [
            {
              name: 'type',
              type: 'radio',
              label: 'Link Type',
              options: [
                {
                  label: 'Internal Page',
                  value: 'reference',
                },
                {
                  label: 'Custom URL',
                  value: 'custom',
                },
              ],
              defaultValue: 'custom',
              admin: {
                layout: 'horizontal',
              },
            },
            {
              name: 'reference',
              type: 'relationship',
              relationTo: 'pages',
              label: 'Select Page',
              admin: {
                condition: (_, siblingData) => siblingData?.type === 'reference',
              },
            },
            {
              name: 'url',
              type: 'text',
              label: 'Custom URL',
              defaultValue: '#',
              admin: {
                condition: (_, siblingData) => siblingData?.type === 'custom',
              },
            },
            {
              name: 'newTab',
              type: 'checkbox',
              label: 'Open in new tab?',
              defaultValue: false,
            },
          ],
          admin: {
            width: '50%',
          },
        },
      ],
    },
  ],
}; 