'use client'

import { PlayerInfo } from './components/player-info'
import { BlockLists } from './components/block-lists'

interface PlayerDisplayProps {
  blocks: any[]
}


export const PlayerDisplay = ({ blocks = [] }: PlayerDisplayProps) => {
  const renderBlock = (block: any, index: number) => {
    switch (block.blockType) {
      case 'playerInfo':
        return <PlayerInfo key={index} />
      case 'skinsComponents':
        return <BlockLists key={index} title="Skins" info={block.info} />
      case 'gearComponents':
        return <BlockLists key={index} title="Gear" info={block.info} />
      case 'pcSpecs':
        return <BlockLists key={index} title="PC Specs" info={block.info} />
      case 'setupStreaming':
        return <BlockLists key={index} title="Setup Streaming" info={block.info} />
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