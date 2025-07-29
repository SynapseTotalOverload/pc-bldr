import type { Block } from 'payload'

export const ApiPlayerList: Block = {
  slug: 'apiPlayerList',
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
      name: 'filterBy',
      type: 'select',
      defaultValue: 'all',
      label: 'Filter players by',
      options: [
        { label: 'All players', value: 'all' },
        { label: 'Team', value: 'team' },
        { label: 'Country', value: 'country' },
        { label: 'Search query', value: 'query' },
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
      defaultValue: 12,
      label: 'Items per page',
      admin: {
        description: '0 = show all items',
      },
    },
    {
      name: 'showPagination',
      type: 'checkbox',
      defaultValue: true,
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
  interfaceName: 'ApiPlayerListBlock',
}
