import type { Block } from 'payload'

export const ApiCardList: Block = {
  slug: 'apiCardList',
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
      name: 'cardType',
      type: 'select',
      defaultValue: 'product',
      label: 'Card type',
      options: [
        { label: 'Products', value: 'product' },
        { label: 'Accessories', value: 'accessories' },
        { label: 'Builds', value: 'builds' },
      ],
      required: true,
    },
    {
      name: 'category_id',
      type: 'select',
      label: 'Product category',
      admin: {
        condition: (_, data) => data?.cardType === 'product',
      },
      options: [
        { label: 'All categories (show filter)', value: '' },
        { label: 'CPU', value: '1' },
        { label: 'CPU Cooler', value: '2' },
        { label: 'GPU', value: '3' },
        { label: 'Motherboard', value: '4' },
        { label: 'RAM', value: '5' },
        { label: 'Storage', value: '6' },
        { label: 'Power Supply', value: '7' },
        { label: 'Case', value: '8' },
      ],
    },
    {
      name: 'accessory_category',
      type: 'select',
      label: 'Accessory category',
      admin: {
        condition: (_, data) => data?.cardType === 'accessories',
      },
      options: [
        { label: 'All accessories (show filter)', value: '' },
        { label: 'Mouse', value: '9' },
        { label: 'Monitor', value: '10' },
        { label: 'Keyboard', value: '11' },
        { label: 'Headset', value: '12' },
        { label: 'Mousepad', value: '13' },
        { label: 'Chair', value: '14' },
      ],
    },
    {
      name: 'build_type',
      type: 'select',
      label: 'Build type',
      admin: {
        condition: (_, data) => data?.cardType === 'builds',
      },
      options: [
        { label: 'All categories (show filter)', value: '' },
        { label: 'Gaming', value: 'gaming' },
        { label: 'Office', value: 'office' },
        { label: 'Workstation', value: 'workstation' },
        { label: 'Budget', value: 'budget' },
        { label: 'High-end', value: 'high-end' },
        { label: 'Other', value: '--' },
      ],
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'grid',
      options: [
        { label: 'Grid', value: 'grid' },
        { label: 'List', value: 'list' },
        { label: 'Carousel', value: 'carousel' },
      ],
    },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '3',
      label: 'Columns',
      admin: {
        description: 'Number of columns for grid layout',
        condition: (_, data) => data?.layout === 'grid',
      },
      options: [
        { label: '1 column', value: '1' },
        { label: '2 columns', value: '2' },
        { label: '3 columns', value: '3' },
        { label: '4 columns', value: '4' },
      ],
    },
    {
      name: 'itemsPerPage',
      type: 'number',
      defaultValue: 10,
      label: 'Items per page',
      admin: {
        description: '0 = show all items',
      },
    },
    {
      name: 'showPagination',
      type: 'checkbox',
      defaultValue: false,
      label: 'Show pagination',
    },
    {
      name: 'styling',
      type: 'group',
      label: 'Styling',
      fields: [
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
        {
          name: 'cardStyle',
          type: 'select',
          defaultValue: 'default',
          options: [
            { label: 'Default', value: 'default' },
            { label: 'Elevated', value: 'elevated' },
            { label: 'Bordered', value: 'bordered' },
            { label: 'Minimal', value: 'minimal' },
          ],
        },
      ],
    },
  ],
  interfaceName: 'ApiCardListBlock',
} 