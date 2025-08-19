import React from 'react'
import { Game } from '@/services/types'
import { GamesInfo } from './components/games-info'

interface GameDisplayProps {
  blocks: any[]
  game: Game | any
}

export const GameDisplay = ({ blocks = [], game }: GameDisplayProps) => {
  const renderBlock = (block: any, index: number) => {
    switch (block.blockType) {
      case 'gameInfo':
        return <GamesInfo game={game} />
      default:
        return null
    }
  }

  if (!blocks.length) {
    return (
      <div className="container mx-auto px-4 py-8">
        {renderBlock({ blockType: 'gameInfo' }, 0)}
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {blocks.map((block, index) => renderBlock(block, index))}
      </div>
    </div>
  )
}
