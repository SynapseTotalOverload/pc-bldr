import type { Block } from 'payload'

export const WhyWorkWithUs: Block = {
  slug: 'whyWorkWithUs',
  interfaceName: 'WhyWorkWithUsBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Section Heading',
      defaultValue: 'Why Work With Us?',
      admin: {
        description: 'Main heading for the section',
      },
    },
    {
      name: 'reasons',
      type: 'array',
      label: 'Reasons',
      minRows: 1,
      maxRows: 6,
      admin: {
        description: 'Add reasons why customers should work with you',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Title',
          required: true,
          admin: {
            description: 'Short title for this reason',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
          required: true,
          admin: {
            description: 'Detailed description of this reason',
            rows: 3,
          },
        },
        {
          name: 'icon',
          type: 'select',
          label: 'Icon',
          required: true,
          defaultValue: 'GitPullRequest',
          admin: {
            description: 'Choose an icon to represent this reason',
          },
          options: [
            {
              label: 'Quality (Git Pull Request)',
              value: 'GitPullRequest',
            },
            {
              label: 'Experience (Square Kanban)',
              value: 'SquareKanban',
            },
            {
              label: 'Support (Radio Tower)',
              value: 'RadioTower',
            },
            {
              label: 'Innovation (Wand Sparkles)',
              value: 'WandSparkles',
            },
            {
              label: 'Results (Layers)',
              value: 'Layers',
            },
            {
              label: 'Efficiency (Battery Charging)',
              value: 'BatteryCharging',
            },
            {
              label: 'Security (Shield)',
              value: 'Shield',
            },
            {
              label: 'Speed (Zap)',
              value: 'Zap',
            },
            {
              label: 'Reliability (Check Circle)',
              value: 'CheckCircle',
            },
            {
              label: 'Custom (Star)',
              value: 'Star',
            },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Layout Settings',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'columns',
          type: 'select',
          label: 'Grid Columns',
          defaultValue: '3',
          admin: {
            description: 'Number of columns for desktop layout',
          },
          options: [
            {
              label: '2 Columns',
              value: '2',
            },
            {
              label: '3 Columns',
              value: '3',
            },
            {
              label: '4 Columns',
              value: '4',
            },
          ],
        },
        {
          name: 'backgroundColor',
          type: 'select',
          label: 'Background Color',
          defaultValue: 'default',
          admin: {
            description: 'Background color for the section',
          },
          options: [
            {
              label: 'Default',
              value: 'default',
            },
            {
              label: 'Muted',
              value: 'muted',
            },
            {
              label: 'Accent',
              value: 'accent',
            },
            {
              label: 'Secondary',
              value: 'secondary',
            },
          ],
        },
      ],
    },
  ],
}
