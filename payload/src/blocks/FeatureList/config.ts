import type { Block } from 'payload'

export const FeatureList: Block = {
  slug: 'featureList',
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Заголовок секції',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Опис секції',
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'grid',
      options: [
        { label: 'Сітка (Grid)', value: 'grid' },
        { label: 'Список (List)', value: 'list' },
        { label: 'Карточки (Cards)', value: 'cards' },
      ],
    },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '3',
      options: [
        { label: '1 колонка', value: '1' },
        { label: '2 колонки', value: '2' },
        { label: '3 колонки', value: '3' },
        { label: '4 колонки', value: '4' },
      ],
      admin: {
        condition: (data) => data?.layout === 'grid',
      },
    },
    {
      name: 'features',
      type: 'array',
      label: 'Елементи списку',
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
              label: 'URL посилання',
            },
            {
              name: 'text',
              type: 'text',
              label: 'Текст посилання',
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