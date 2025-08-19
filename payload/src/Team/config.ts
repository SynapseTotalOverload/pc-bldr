import type { GlobalConfig } from 'payload'
import { authenticated } from '../access/authenticated'
import { authenticatedOrPublished } from '../access/authenticatedOrPublished'
import { revalidateTeam } from './hooks/revalidateTeam'

export const Team: GlobalConfig = {
  slug: 'team',
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
          slug: 'teamInfo',
          imageAltText: 'Team Info Block',
          interfaceName: 'TeamInfo',
          fields: [],
        },
        {
          slug: 'playersComponents',
          imageAltText: 'Players Components Block',
          interfaceName: 'PlayersComponents',
          fields: [],
        },
        {
          slug: 'achievements',
          imageAltText: 'Achievements Block',
          interfaceName: 'TeamAchievements',
          fields: [],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateTeam],
  },
  admin: {
    description: 'Global settings for team pages',
  },
}
