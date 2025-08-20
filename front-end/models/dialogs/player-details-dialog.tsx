'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { PlayerWithRelations } from '@/types/players-base'
import { useFile } from '@/hooks/useFile'
import { Skeleton } from '@/components/ui/skeleton'
import { LazyLoadImage } from 'react-lazy-load-image-component'
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
  MousePointer,
  Sticker
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

const LazyImage: React.FC<{ url?: string | null; alt?: string; className?: string; skeletonClass?: string }> = ({ url, alt, className = '', skeletonClass }) => {
  const { imageUrl, fetch, loading } = useFile();
  const ref = useRef<HTMLDivElement | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (!url) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          setShouldLoad(true);
          obs.disconnect();
        }
      });
    }, { rootMargin: '150px' });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [url]);

  useEffect(() => {
    if (shouldLoad && url) {
      fetch({ url });
    }
  }, [shouldLoad, url, fetch]);

  const src = imageUrl;
  const skClass = skeletonClass || className;

  return (
    <div ref={ref} className={className}>
      {(loading || !src) && <Skeleton className={skClass} />}
      {!loading && src && <LazyLoadImage src={src} alt={alt} className={className} effect="opacity" />}
    </div>
  );
};

export function PlayerDetailsDialog({ player, open, onOpenChange }: PlayerDetailsDialogProps) {
  if (!player) return null

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
    console.log('player.skins', player.skins);

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
                {skin.skin.image_file && (
                  <img 
                    src={skin.skin.image_file} 
                    alt={skin.skin.skin_name}
                    className="w-8 h-8 rounded object-cover"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">
                    {skin.is_stat_track && 'StatTrak™ '}
                    {skin.souvenir && 'Souvenir '}
                    {skin.skin.skin_name}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  {skin.pattern && skin.pattern > 0 && (
                    <div>Pattern {skin.pattern}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderStickers = () => {
    if (!player.stickers || player.stickers.length === 0) return null
    console.log('player.stickers', player.stickers);

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sticker className="h-5 w-5" />
            Stickers Collection
          </CardTitle>
          <CardDescription>Stickers owned by the player</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {player.stickers.map((sticker) => (
              <div key={sticker.id} className="flex items-center gap-2 p-2 border rounded">
                {sticker.image_url && (
                  <LazyImage 
                    url={sticker.image_url} 
                    alt={sticker.name}
                    className="w-8 h-8 rounded object-cover"
                    skeletonClass="w-8 h-8 rounded"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">
                    {sticker.name}
                  </div>
                  {sticker.s_type && (
                    <div className="text-xs text-muted-foreground">
                      {sticker.s_type}
                    </div>
                  )}
                </div>
                {sticker.rarety && (
                  <Badge variant="outline" className="text-xs">
                    {sticker.rarety}
                  </Badge>
                )}
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
              <LazyImage url={player.player_img} alt={player.player_name} className="w-12 h-12 rounded-full object-cover" />
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
                  <Badge variant="secondary">
                    {typeof player.team === "string" ? player.team : (player.team as any)?.name}
                  </Badge>
                ) : (
                  <span className="text-muted-foreground">Not specified</span>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Country:</span>
                {player.country ? (
                  <Badge variant="outline">{player.country.name}</Badge>
                ) : (
                  <span className="text-muted-foreground">Not specified</span>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Birthday:</span>
                <span>{player.birthday}</span>
              </div>

              <div className="flex flex-col gap-2">
                <span><b>Discord:</b> <a href={player.user_urls?.discord} target="_blank" rel="noopener noreferrer">{player.user_urls?.discord}</a></span>
                <span><b>Instagram:</b> <a href={player.user_urls?.instagram} target="_blank" rel="noopener noreferrer">{player.user_urls?.instagram}</a></span>
                <span><b>Steam:</b> <a href={player.user_urls?.steam} target="_blank" rel="noopener noreferrer">{player.user_urls?.steam}</a></span>
                <span><b>TikTok:</b> <a href={player.user_urls?.tiktok} target="_blank" rel="noopener noreferrer">{player.user_urls?.tiktok}</a></span>
                <span><b>Twitch:</b> <a href={player.user_urls?.twitch} target="_blank" rel="noopener noreferrer">{player.user_urls?.twitch}</a></span>
                <span><b>Twitter:</b> <a href={player.user_urls?.twitter} target="_blank" rel="noopener noreferrer">{player.user_urls?.twitter}</a></span>
                <span><b>YouTube:</b> <a href={player.user_urls?.youtube} target="_blank" rel="noopener noreferrer">{player.user_urls?.youtube}</a></span>
              </div>
            </CardContent>
          </Card>
           {/* PC image preview */}
           <Card>
            <CardHeader>
              <CardTitle>{player.pc_image_name || 'PC image'}</CardTitle>
            </CardHeader>
            <CardContent>
              <LazyImage url={player.pc_image} alt={player.pc_image_name || 'PC image'} className="w-64 h-40 object-cover rounded-md" skeletonClass="w-64 h-40 rounded-md" />
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
          {/* Game */}
          {player.game?.name && (
            <Card>
              <CardHeader>
                <CardTitle>Game</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{player.game.name}</p>
                <LazyImage url={player.game.image} alt={player.game.name} className="w-64 h-40 object-cover rounded-md" skeletonClass="w-64 h-40 rounded-md" />
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          {player.note && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{player.note}</p>
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

          {/* Stickers */}
          {renderStickers()}
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