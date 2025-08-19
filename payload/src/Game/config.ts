import type { GlobalConfig } from 'payload'
import { authenticated } from '../access/authenticated'
import { authenticatedOrPublished } from '../access/authenticatedOrPublished'
import { revalidateGame } from './hooks/revalidateGame'

export const Game: GlobalConfig = {
  slug: 'game',
  access: {
    read: authenticatedOrPublished,
    update: authenticated,
  },
  fields: [
    {
      name: 'blocks',
      type: 'blocks',
      blocks: [
        {
          slug: 'gameInfo',
          imageAltText: 'Game Info Block',
          interfaceName: 'GameInfo',
          fields: [],
        },
        {
          slug: 'gameStats',
          imageAltText: 'Game Stats Block',
          interfaceName: 'GameStats',
          fields: [],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateGame],
  },
  admin: {
    description: 'Global settings for game pages',
  },
}
