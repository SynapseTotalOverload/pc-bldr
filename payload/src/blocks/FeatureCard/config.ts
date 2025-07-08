import type { Block } from 'payload'

export const FeatureCard: Block = {
  slug: 'featureCard',
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
      name: 'backgroundColor',
      type: 'select',
      defaultValue: 'default',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Primary', value: 'primary' },
        { label: 'Secondary', value: 'secondary' },
        { label: 'Accent', value: 'accent' },
      ],
    },
    {
      name: 'textAlignment',
      type: 'select',
      defaultValue: 'left',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
    },
  ],
  interfaceName: 'FeatureCardBlock',
} 