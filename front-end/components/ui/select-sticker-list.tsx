import React, { useState, useEffect, useCallback } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { useStickers } from '@/hooks/useStickers'
import { StickersBase } from '@/types/stickers-base'

interface SelectStickerListProps {
  label?: string
  placeholder?: string
  searchPlaceholder?: string
  onChange?: (ids: number[]) => void
  selectedIds?: number[]
  s_type?: 'player' | 'team'
}

export function SelectStickerList({
  label = 'Stickers',
  placeholder = 'Select stickers',
  searchPlaceholder = 'Search stickers...',
  onChange,
  selectedIds = [],
  s_type = 'team',
}: SelectStickerListProps) {
  console.log("SelectStickerList props:", { label, s_type, selectedIds })
  const [page, setPage] = useState(1)
  const [stickersAcc, setStickersAcc] = useState<StickersBase[]>([])
  const [selected, setSelected] = useState<number[]>(selectedIds)
  const pageSize = 40

  const { stickers, pagination, loading, error, fetchStickers } = useStickers()

  const loadStickers = useCallback(async () => {
    console.log("Loading stickers with s_type:", s_type)
    try {
      await fetchStickers({ 
        skip: (page - 1) * pageSize, 
        limit: pageSize,
        s_type: s_type
      } as any)
    } catch (err) {
      console.error("Error loading stickers:", err)
    }
  }, [page, s_type, fetchStickers])

  useEffect(() => {
    loadStickers()
  }, [loadStickers])

  useEffect(() => {
    console.log("s_type changed to:", s_type, "resetting stickersAcc and page")
    setStickersAcc([])
    setPage(1)
  }, [s_type])

  useEffect(() => {
    if (stickers.length > 0) {
      console.log("Updating stickersAcc with stickers:", stickers, "page:", page)
      if (page === 1) {
        console.log("Setting stickersAcc to new stickers:", stickers)
        setStickersAcc(stickers)
      } else {
        console.log("Appending new stickers to existing stickersAcc")
        setStickersAcc(prev => [...prev, ...stickers.filter(s => !prev.find(p => p.id === s.id))])
      }
    }
  }, [stickers, page])

  useEffect(() => {
    console.log("Updating selected state with selectedIds:", selectedIds)
    if (JSON.stringify(selected) !== JSON.stringify(selectedIds)) {
      setSelected(selectedIds)
    }
  }, [selectedIds, selected])

  const handleSelect = (value: string) => {
    if (value === 'none') return
    const id = Number(value)
    if (!selected.includes(id)) {
      const newSel = [...selected, id]
      console.log("Adding sticker with id:", id, "new selection:", newSel)
      setSelected(newSel)
      onChange?.(newSel)
    }
  }

  const handleRemove = (id: number) => {
    const newSel = selected.filter(s => s !== id)
    console.log("Removing sticker with id:", id, "new selection:", newSel)
    setSelected(newSel)
    onChange?.(newSel)
  }

  if (error) {
    console.error("Stickers error:", error)
  }

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      {error && (
        <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
          Error loading stickers: {error}
        </div>
      )}
      <Select onValueChange={handleSelect}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="max-h-96">
          <SelectItem value="none" disabled>
            Select a sticker to add
          </SelectItem>
          {stickersAcc.map(st => {
            console.log(`Rendering SelectItem for sticker:`, st)
            return (
              <SelectItem
                key={st.id}
                value={st.id!.toString()}
                disabled={selected.includes(st.id!)}
              >
                {st.name}
              </SelectItem>
            )
          })}
          {pagination?.has_more && (
            <div className="p-2 flex justify-center">
              {loading ? (
                <Skeleton className="h-6 w-24" />
              ) : (
                <Button variant="outline" size="sm" onClick={() => setPage(prev => prev + 1)}>
                  Load more
                </Button>
              )}
            </div>
          )}
        </SelectContent>
      </Select>

      {selected.length > 0 && (
        <div className="space-y-1">
          <Label className="text-sm">Selected ({selected.length})</Label>
          <div className="flex flex-wrap gap-2">
            {selected.map(id => {
              const st = stickersAcc.find(s => s.id === id)
              console.log(`Rendering selected sticker ${id}:`, st)
              return (
                <Button key={id} variant="secondary" size="sm" onClick={() => handleRemove(id)} className="flex items-center gap-1">
                  {st?.image_url && <img src={st.image_url} alt="img" className="h-4 w-4 object-cover rounded" />}
                  <span className="truncate max-w-[120px]">{st?.name || `Sticker ${id}`}</span> ✕
                </Button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
