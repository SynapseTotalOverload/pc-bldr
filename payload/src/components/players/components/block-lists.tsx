'use client'

import { CardBox } from "./card-box"
import Link from 'next/link'
import { useEffect } from "react"

interface BlockListsProps {
  title: string;
  info: any;
}

export const BlockLists = ({ title, info }: BlockListsProps) => { 
  
  const getItemsFromSection = () => {
    const items: any[] = []
    
    if (!info) return items
    
    if (title === 'PC Specs') {
      if (info.cpu) items.push({ ...info.cpu, category: 'CPU', type: 'pc_specs' })
      if (info.cpu_cooler) items.push({ ...info.cpu_cooler, category: 'CPU Cooler', type: 'pc_specs' })
      if (info.gpu) items.push({ ...info.gpu, category: 'GPU', type: 'pc_specs' })
      if (info.motherboard) items.push({ ...info.motherboard, category: 'Motherboard', type: 'pc_specs' })
      if (info.ram) items.push({ ...info.ram, category: 'RAM', type: 'pc_specs' })
      if (info.storage) items.push({ ...info.storage, category: 'Storage', type: 'pc_specs' })
      if (info.power_supply) items.push({ ...info.power_supply, category: 'Power Supply', type: 'pc_specs' })
      if (info.case) items.push({ ...info.case, category: 'Case', type: 'pc_specs' })
    }
    
    if (title === 'Gear') {
      if (info.monitor) items.push({ ...info.monitor, category: 'Monitor', type: 'gear' })
      if (info.mouse) items.push({ ...info.mouse, category: 'Mouse', type: 'gear' })
      if (info.keyboard) items.push({ ...info.keyboard, category: 'Keyboard', type: 'gear' })
      if (info.headset) items.push({ ...info.headset, category: 'Headset', type: 'gear' })
      if (info.mousepad) items.push({ ...info.mousepad, category: 'Mousepad', type: 'gear' })
      if (info.earphones) items.push({ ...info.earphones, category: 'Earphones', type: 'gear' })
    }
    
    if (title === 'Setup Streaming') {
      if (info.chair) items.push({ ...info.chair, category: 'Chair', type: 'setup' })
      if (info.microphone) items.push({ ...info.microphone, category: 'Microphone', type: 'setup' })
      if (info.camera) items.push({ ...info.camera, category: 'Camera', type: 'setup' })
    }
    
    if (title === 'Skins' && Array.isArray(info)) {
      info.forEach(skin => {
        if (skin) items.push({ ...skin, category: 'Skin', type: 'skins' })
      })
    }
    
    return items
  }

  const items = getItemsFromSection()

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-bold mb-4">{title}</h2>
      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
          {items.map((item, index) => (
            <Link 
              href={title === 'Skins' ? `#` : `/product/${item.id}`} 
              key={`${item.type}-${item.id}-${index}`}
              className="block hover:scale-105 transition-transform duration-200"
            >
              <CardBox
                item={{
                  id: item.id,
                  title: item.display_name || item.name,
                  category: { id: item.id, name: item.category },
                  low_image_url: item.high_image_url || item.low_image_url || item.image_file,
                  price: 0,
                  rating: 0,
                  asin: '',
                  attrs: { brand: '', model: '' },
                  architechture: '',
                  base_speed: 0,
                  brand: '',
                  core_family: '',
                  cores: 0,
                  generation: '',
                  integrated_graphics: '',
                  memory_speed: 0,
                  memory_type: '',
                  model: '',
                  series: '',
                  socket_type: '',
                  threads: 0,
                  turbo_speed: 0,
                  created_at: new Date().toISOString()
                }}
              />
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>No items found</p>
        </div>
      )}
    </div>
  )
}