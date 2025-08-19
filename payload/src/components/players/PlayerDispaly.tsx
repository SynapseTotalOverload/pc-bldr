'use client'

import { PlayerInfo } from './components/player-info'
import { BlockLists } from './components/block-lists'
import { PlayerWithRelations } from '@/blocks/ApiPlayerList/types'

interface PlayerDisplayProps {
  blocks: any[]
  player: PlayerWithRelations
}


export const PlayerDisplay = ({ blocks = [], player }: PlayerDisplayProps) => {
  const renderBlock = (block: any, index: number) => {
    switch (block.blockType) {
      case 'playerInfo':
        return <PlayerInfo key={index} player={player} />
      case 'skinsComponents':
        return <BlockLists key={index} title="Skins" info={player.skins} />
      case 'gearComponents':
        return <BlockLists key={index} title="Gear" info={player.gear_list} />
      case 'pcSpecs':
        return <BlockLists key={index} title="PC Specs" info={player.pc_specs_list} custProducts={player.custom_product_reletion} />
      case 'setupStreaming':
        return <BlockLists key={index} title="Setup Streaming" info={player.setup_streaming_list} />
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