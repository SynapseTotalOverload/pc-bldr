'use client'

import React, { useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { PlayerWithRelations } from '@/types/players-base'
import { format } from 'date-fns'
import { 
  Calendar, 
  MapPin, 
  Users, 
  Monitor, 
  Headphones, 
  Mouse, 
  Keyboard, 
  HardDrive, 
  Cpu, 
  MemoryStick,
  Power,
  Fan,
  Gamepad2,
  Camera,
  Mic,
  MousePointer
} from 'lucide-react'

interface PlayerDetailsDialogProps {
  player: PlayerWithRelations | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const categoryIcons = {
  cpu: Cpu,
  gpu: Gamepad2,
  motherboard: MemoryStick,
  ram: MemoryStick,
  storage: HardDrive,
  power_supply: Power,
  case: Power,
  cpu_cooler: Fan,
  monitor: Monitor,
  mouse: Mouse,
  keyboard: Keyboard,
  headset: Headphones,
  mousepad: MousePointer,
  chair: Power,
  microphone: Mic,
  camera: Camera,
  headphones: Headphones
}

interface Item {
  id: number
  display_name: string
  high_image_url: string
  low_image_url: string
  name: string
}

export function PlayerDetailsDialog({ player, open, onOpenChange }: PlayerDetailsDialogProps) {
  if (!player) return null

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not specified'
    try {
      return format(new Date(dateString), 'MMMM dd, yyyy')
    } catch {
      return 'Invalid date'
    }
  }

  const renderGearItem = (item: Item, category: string) => {
    if (!item) return null
    
    const Icon = categoryIcons[category as keyof typeof categoryIcons] || Gamepad2
    
    return (
      <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
        <Icon className="h-5 w-5 text-muted-foreground" />
        <div className="flex-1">
          <div className="text-sm text-muted-foreground">
            {item.name}
          </div>
        </div>
        <Badge variant="outline">{category.replace('_', ' ').toUpperCase()}</Badge>
      </div>
    )
  }

  const renderPCSpecs = () => {
    if (!player.pc_specs_list) return null

    const specs = player.pc_specs_list
    const components = [
      { key: 'cpu', item: specs.cpu, label: 'CPU' },
      { key: 'gpu', item: specs.gpu, label: 'GPU' },
      { key: 'motherboard', item: specs.motherboard, label: 'Motherboard' },
      { key: 'ram', item: specs.ram, label: 'RAM' },
      { key: 'storage', item: specs.storage, label: 'Storage' },
      { key: 'power_supply', item: specs.power_supply, label: 'Power Supply' },
      { key: 'case', item: specs.case, label: 'Case' },
      { key: 'cpu_cooler', item: specs.cpu_cooler, label: 'CPU Cooler' },
    ]

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="h-5 w-5" />
            PC Specifications
          </CardTitle>
          <CardDescription>Hardware configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {components.map(({ key, item, label }) => 
            item ? renderGearItem(item, key) : null
          )}
        </CardContent>
      </Card>
    )
  }

  const renderGearList = () => {
    if (!player.gear_list) return null

    const gear = player.gear_list
    const items = [
      { key: 'monitor', item: gear.monitor, label: 'Monitor' },
      { key: 'mouse', item: gear.mouse, label: 'Mouse' },
      { key: 'keyboard', item: gear.keyboard, label: 'Keyboard' },
      { key: 'headset', item: gear.headset, label: 'Headset' },
      { key: 'mousepad', item: gear.mousepad, label: 'Mousepad' },
    ]

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gamepad2 className="h-5 w-5" />
            Gaming Gear
          </CardTitle>
          <CardDescription>Peripherals and accessories</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {items.map(({ key, item, label }) => 
            item ? renderGearItem(item, key) : null
          )}
        </CardContent>
      </Card>
    )
  }

  const renderStreamingSetup = () => {
    if (!player.setup_streaming_list) return null

    const setup = player.setup_streaming_list
    const items = [
      { key: 'chair', item: setup.chair, label: 'Chair' },
      { key: 'microphone', item: setup.microphone, label: 'Microphone' },
      { key: 'camera', item: setup.camera, label: 'Camera' },
    ]

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Streaming Setup
          </CardTitle>
          <CardDescription>Streaming and content creation equipment</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {items.map(({ key, item, label }) => 
            item ? renderGearItem(item, key) : null
          )}
        </CardContent>
      </Card>
    )
  }

  const renderSkins = () => {
    if (!player.skins || player.skins.length === 0) return null

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gamepad2 className="h-5 w-5" />
            Skins Collection
          </CardTitle>
          <CardDescription>CS:GO skins owned by the player</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {player.skins.map((skin) => (
              <div key={skin.id} className="flex items-center gap-2 p-2 border rounded">
                {skin.image_file && (
                  <img 
                    src={skin.image_file} 
                    alt={skin.skin_name}
                    className="w-8 h-8 rounded object-cover"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{skin.skin_name}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {player.player_img && (
              <img 
                src={player.player_img} 
                alt={player.player_name}
                className="w-12 h-12 rounded-full object-cover"
              />
            )}
            <div>
              <div className="text-xl font-bold">{player.player_name}</div>
              {player.name && (
                <div className="text-sm text-muted-foreground">{player.name}</div>
              )}
            </div>
          </DialogTitle>
          <DialogDescription>
            Detailed information about {player.player_name}'s setup and preferences
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Team:</span>
                {player.team ? (
                  <Badge variant="secondary">{player.team}</Badge>
                ) : (
                  <span className="text-muted-foreground">Not specified</span>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Country:</span>
                {player.country ? (
                  <Badge variant="outline">{player.country}</Badge>
                ) : (
                  <span className="text-muted-foreground">Not specified</span>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Birthday:</span>
                <span>{player.birthday}</span>
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          {player.info && (
            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{player.info}</p>
              </CardContent>
            </Card>
          )}

          <Separator />

          {/* PC Specifications */}
          {renderPCSpecs()}

          {/* Gaming Gear */}
          {renderGearList()}

          {/* Streaming Setup */}
          {renderStreamingSetup()}

          {/* Skins */}
          {renderSkins()}
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 