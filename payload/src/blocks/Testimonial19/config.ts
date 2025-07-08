import type { Block } from 'payload';

export const Testimonial19: Block = {
  slug: 'testimonial19',
  labels: {
    singular: 'Testimonial Section',
    plural: 'Testimonial Sections',
  },
  fields: [
    {
      name: 'enabled',
      type: 'checkbox',
      label: 'Enable Block',
      defaultValue: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Main Title',
          defaultValue: 'Meet our happy clients',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'subtitle',
          type: 'text',
          label: 'Subtitle',
          defaultValue: 'Join a global network of thought leaders, product developers,',
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'ratingText',
          type: 'text',
          label: 'Rating Text',
          defaultValue: 'Rated 5 stars by 1000+ clients',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'linkText',
          type: 'text',
          label: 'Link Text',
          defaultValue: 'View all testimonials',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'link',
          type: 'group',
          label: 'Link',
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
    {
      name: 'testimonials',
      type: 'array',
      label: 'Testimonials',
      minRows: 1,
      maxRows: 12,
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'name',
              type: 'text',
              label: 'Name',
              required: true,
              admin: {
                width: '50%',
              },
            },
            {
              name: 'role',
              type: 'text',
              label: 'Role/Title',
              required: true,
              admin: {
                width: '50%',
              },
            },
          ],
        },
        {
          name: 'content',
          type: 'textarea',
          label: 'Testimonial Content',
          required: true,
        },
        {
          type: 'row',
          fields: [
            {
              name: 'avatar',
              type: 'upload',
              relationTo: 'media',
              label: 'Avatar Image',
              admin: {
                width: '50%',
              },
            },
            {
              name: 'rating',
              type: 'number',
              label: 'Star Rating (1-5)',
              min: 1,
              max: 5,
              defaultValue: 5,
              admin: {
                width: '50%',
                step: 1,
              },
            },
          ],
        },
      ],
      admin: {
        initCollapsed: true,
      },
    },
  ],
}; 