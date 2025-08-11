import type { Block } from 'payload'

export const DiagramBrand: Block = {
  slug: 'diagramBrand',
  interfaceName: 'DiagramBrandBlock',
  labels: {
    singular: 'Diagram Brand Block',
    plural: 'Diagram Brand Blocks',
  },

  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Section title',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Section description',
    },
    {
      name: 'defaultCategory',
      type: 'select',
      defaultValue: 'cpu',
      label: 'Default category',
      options: [
        { label: 'CPU', value: 'cpu' },
        { label: 'CPU Cooler', value: 'cpu_cooler' },
        { label: 'GPU', value: 'gpu' },
        { label: 'Motherboard', value: 'motherboard' },
        { label: 'RAM', value: 'ram' },
        { label: 'Storage', value: 'storage' },
        { label: 'Power Supply', value: 'power_supply' },
        { label: 'Case', value: 'case' },
        { label: 'Mouse', value: 'mouse' },
        { label: 'Monitor', value: 'monitor' },
        { label: 'Keyboard', value: 'keyboard' },
        { label: 'Headset', value: 'headset' },
        { label: 'Mousepad', value: 'mousepad' },
        { label: 'Chair', value: 'chair' },
        { label: 'Microphone', value: 'microphone' },
        { label: 'Camera', value: 'camera' },
        { label: 'Headphones', value: 'headphones' },
      ],
    },
    {
      name: 'showDateRange',
      type: 'checkbox',
      label: 'Show date range selector',
      defaultValue: true,
    },
    {
      name: 'showBrandSelector',
      type: 'checkbox',
      label: 'Show brand selector',
      defaultValue: true,
    },
    {
      name: 'styling',
      type: 'group',
      label: 'Styling options',
      fields: [
        {
          name: 'backgroundColor',
          type: 'select',
          label: 'Background color',
          defaultValue: 'default',
          options: [
            { label: 'Default', value: 'default' },
            { label: 'Primary', value: 'primary' },
            { label: 'Secondary', value: 'secondary' },
            { label: 'Accent', value: 'accent' },
            { label: 'Muted', value: 'muted' },
          ],
        },
        {
          name: 'chartHeight',
          type: 'select',
          label: 'Chart height',
          defaultValue: '300',
          options: [
            { label: 'Small (250px)', value: '250' },
            { label: 'Medium (300px)', value: '300' },
            { label: 'Large (400px)', value: '400' },
            { label: 'Extra Large (500px)', value: '500' },
          ],
        },
      ],
    },
  ],
} 