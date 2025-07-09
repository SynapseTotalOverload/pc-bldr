import type { Block } from 'payload'

export const FeatureList: Block = {
  slug: 'featureList',
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Name of section',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description of section',
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'grid',
      options: [
        { label: 'Grid', value: 'grid' },
        { label: 'List', value: 'list' },
        { label: 'Cards', value: 'cards' },
      ],
    },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '3',
      options: [
        { label: '1 column', value: '1' },
        { label: '2 columns', value: '2' },
        { label: '3 columns', value: '3' },
        { label: '4 columns', value: '4' },
      ],
      admin: {
        condition: (data) => data?.layout === 'grid',
      },
    },
    {
      name: 'features',
      type: 'array',
      label: 'List items',
      required: true,
      minRows: 1,
      maxRows: 12,
      fields: [
        {
          name: 'icon',
          type: 'select',
          defaultValue: 'star',
          options: [
            { label: 'Star', value: 'star' },
            { label: 'Heart', value: 'heart' },
            { label: 'Check', value: 'check' },
            { label: 'Lightning', value: 'lightning' },
            { label: 'Shield', value: 'shield' },
            { label: 'Rocket', value: 'rocket' },
            { label: 'Settings', value: 'settings' },
            { label: 'Users', value: 'users' },
            { label: 'Globe', value: 'globe' },
            { label: 'Award', value: 'award' },
          ],
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
        {
          name: 'link',
          type: 'group',
          fields: [
            {
              name: 'url',
              type: 'text',
              label: 'URL link',
            },
            {
              name: 'text',
              type: 'text',
              label: 'Text link',
            },
          ],
        },
      ],
    },
    {
      name: 'backgroundColor',
      type: 'select',
      defaultValue: 'default',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Primary', value: 'primary' },
        { label: 'Secondary', value: 'secondary' },
        { label: 'Accent', value: 'accent' },
        { label: 'Muted', value: 'muted' },
      ],
    },
  ],
  interfaceName: 'FeatureListBlock',
} 