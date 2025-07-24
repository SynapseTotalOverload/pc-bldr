'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/utilities/ui'
import React from 'react'
import { Cpu, Fan, Monitor, CircuitBoard, HardDrive, Zap, Package, Gamepad2, Briefcase, Wrench, DollarSign, Crown, MoreHorizontal, Keyboard, Headset, Mouse } from 'lucide-react'

export const PRODUCT_CATEGORIES = [
  { id: '1', name: 'CPU', slug: 'cpu', icon: Cpu },
  { id: '2', name: 'CPU Cooler', slug: 'cpu-cooler', icon: Fan },
  { id: '3', name: 'GPU', slug: 'gpu', icon: Monitor },
  { id: '4', name: 'Motherboard', slug: 'motherboard', icon: CircuitBoard },
  { id: '5', name: 'RAM', slug: 'ram', icon: HardDrive },
  { id: '6', name: 'Storage', slug: 'storage', icon: HardDrive },
  { id: '7', name: 'Power Supply', slug: 'power-supply', icon: Zap },
  { id: '8', name: 'Case', slug: 'case', icon: Package }
]

export const BUILD_TYPES = [
  { id: 'gaming', name: 'Gaming', slug: 'gaming', icon: Gamepad2 },
  { id: 'office', name: 'Office', slug: 'office', icon: Briefcase },
  { id: 'workstation', name: 'Workstation', slug: 'workstation', icon: Wrench },
  { id: 'budget', name: 'Budget', slug: 'budget', icon: DollarSign },
  { id: 'high-end', name: 'High-end', slug: 'high-end', icon: Crown },
]

export const ACCESSORY_CATEGORIES = [
  { id: '9', name: 'Mouse', slug: 'mouse', icon: Mouse },
  { id: '10', name: 'Monitor', slug: 'monitor', icon: Monitor },
  { id: '11', name: 'Keyboard', slug: 'keyboard', icon: Keyboard },
  { id: '12', name: 'Headset', slug: 'headset', icon: Headset },
  { id: '13', name: 'Mousepad', slug: 'mousepad', icon: Mouse },
  { id: '14', name: 'Chair', slug: 'chair', icon: Headset },
]

type CategoryFilterProps = {
  activeCategory: string | null
  onCategoryChange: (category: string | null) => void
  cardType: 'product' | 'builds' | 'accessories'
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  activeCategory, 
  onCategoryChange,
  cardType
}) => {
  const categories = cardType === 'product' ? PRODUCT_CATEGORIES : cardType === 'accessories' ? ACCESSORY_CATEGORIES : BUILD_TYPES

  return (
    <div className="relative mb-8">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-purple-50/20 to-indigo-50/30 rounded-2xl " />
        <div className="relative z-10">

        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => onCategoryChange(null)}
            variant={activeCategory === null ? 'default' : 'secondary'}
            className={cn(
              'group relative overflow-hidden transition-all duration-300 hover:scale-105',
              activeCategory === null 
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg' 
                : 'bg-white/80 backdrop-blur-sm border border-gray-200/60 hover:border-gray-300 hover:shadow-md text-gray-700 hover:text-gray-900'
            )}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 font-medium">All</span>
          </Button>

          {categories.map((category) => {
            const IconComponent = category.icon
            const isActive = activeCategory === category.id
            
            return (
              <Button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                variant={isActive ? 'default' : 'secondary'}
                className={cn(
                  'group relative overflow-hidden transition-all duration-300 hover:scale-105 flex items-center gap-2',
                  isActive 
                    ? cardType === 'product'
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg'
                      : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg'
                    : 'bg-white/80 backdrop-blur-sm border border-gray-200/60 hover:border-gray-300 hover:shadow-md text-gray-700 hover:text-gray-900'
                )}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <IconComponent className={cn(
                  'w-4 h-4 relative z-10 transition-transform duration-300 group-hover:scale-110',
                  isActive ? 'text-white' : 'text-gray-600 group-hover:text-gray-800'
                )} />
                
                <span className="relative z-10 font-medium">{category.name}</span>
                
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-white rounded-full" />
                )}
              </Button>
            )
          })}
        </div>
      </div>
    </div>
  )
} 