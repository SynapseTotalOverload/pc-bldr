'use client'

import { Team } from '@/services/types'
import { TeamInfo } from './components/team-info'
import { PlayersList } from './components/players-list'

interface TeamDisplayProps {
  blocks: any[]
  team: Team | any
}

export const TeamDisplay = ({ blocks = [], team }: TeamDisplayProps) => {
  const renderBlock = (block: any, index: number) => {
    switch (block.blockType) {
      case 'teamInfo':
        return <TeamInfo key={index} team={team} />
      case 'playersComponents':
        return <PlayersList key={index} players={team?.players || []} />
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {blocks.map((block, index) => renderBlock(block, index))}
      </div>
    </div>
  )
}
