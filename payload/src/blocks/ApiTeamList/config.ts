import type { Block } from 'payload'

export const ApiTeamList: Block = {
  slug: 'apiTeamList',
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
      name: 'columns',
      type: 'select',
      defaultValue: '3',
      label: 'Columns',
      admin: {
        description: 'Number of columns for grid layout',
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
  ],
  interfaceName: 'ApiTeamListBlock',
}
