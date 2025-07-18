import type { Block } from 'payload'
import { link } from '@/fields/link'

export const HeroMeteor: Block = {
  slug: 'heroMeteor',
  labels: {
    singular: 'Hero with Meteors',
    plural: 'Hero with Meteors Blocks',
  },
  interfaceName: 'HeroMeteorBlock',
  fields: [
    {
      name: 'subtitle',
      type: 'text',
      label: 'Subtitle',
      defaultValue: 'Bridging Developers, Building the Future',
    },
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      required: true,
      defaultValue: 'Connecting Developers Worldwide',
    },
    {
      name: 'buttonText',
      type: 'text',
      label: 'Button Text',
      defaultValue: 'Get Started',
    },
    {
      name: 'showButton',
      type: 'checkbox',
      label: 'Show Button',
      defaultValue: true,
      admin: {
        description: 'Toggle to show or hide the button link',
      },
    },
    link({
      overrides: {
        name: 'buttonLink',
        label: 'Button Link',
        admin: {
          condition: (_, data) => data.showButton === true,
        },
      },
    }),
    {
      name: 'meteorsCount',
      type: 'number',
      label: 'Number of Meteors',
      defaultValue: 30,
      min: 0,
      max: 100,
      admin: {
        description: 'Number of animated meteors (0 to disable)',
      },
    },
    {
      name: 'showGlobe',
      type: 'checkbox',
      label: 'Show Globe Animation',
      defaultValue: true,
    },
    {
      name: 'globeSize',
      type: 'select',
      label: 'Globe Size',
      defaultValue: 'large',
      options: [
        { label: 'Small', value: 'small' },
        { label: 'Medium', value: 'medium' },
        { label: 'Large', value: 'large' },
      ],
      admin: {
        condition: (data, siblingData) => siblingData.showGlobe,
      },
    },
  ],
} 