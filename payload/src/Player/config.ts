import type { GlobalConfig } from 'payload'
import { authenticated } from '../access/authenticated'
import { authenticatedOrPublished } from '../access/authenticatedOrPublished'
import { revalidatePlayer } from './hooks/revalidatePlayer'

export const Player: GlobalConfig = {
  slug: 'player',
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
          slug: 'playerInfo',
          imageAltText: 'Player Info Block',
          interfaceName: 'PlayerInfo',
          fields: [
            
          ]
        },
        {
          slug: 'skinsComponents',
          imageAltText: 'Skins Components Block',
          interfaceName: 'SkinsComponents',
          fields: [
            
          ]
        },
        {
            slug: 'gearComponents',
            imageAltText: 'Gear Components Block',
            interfaceName: 'GearComponents',
            fields: [
                
            ]
        },
        {
            slug: 'pcSpecs',
            imageAltText: 'PC Specs Block',
            interfaceName: 'PCSpecs',
            fields: [
                
            ]
        },
        {
            slug: 'setupStreaming',
            imageAltText: 'Setup & Streaming Block',
            interfaceName: 'SetupStreaming',
            fields: [
                
            ]
        },
      ]
    }
  ],
  hooks: {
    afterChange: [revalidatePlayer],
  },
  admin: {
    description: 'Global settings for player pages'
  }
} 