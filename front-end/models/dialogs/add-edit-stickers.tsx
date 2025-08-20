'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useFile } from '@/hooks/useFile'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { DialogDescription } from '@/components/ui/dialog'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'

export const STICKER_CLASS_NAMES = [
  'Base Grade',
  'Medium Grade',
  'High Grade',
  'Remarkable',
  'Exotic',
  'Extraordinary',
  'Contraband',
] as const

export const STICKER_TYPE_OPTIONS = ['player', 'team'] as const

interface StickersFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  isEditing?: boolean
  onSave: (data: FormData) => void | Promise<void>
  game?: Partial<{ id: number; name: string; tournire: string; class_name: string; s_type: string; image: string; image_url: string }>
}

export function AddEditStickers({ open, onOpenChange, isEditing = false, onSave, game }: StickersFormProps) {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  const { upload, remove } = useFile()

  const form = useForm({
    defaultValues: {
      name: game?.name || '',
      tournire: game?.tournire || '',
      class_name: game?.class_name || '',
      s_type: game?.s_type || 'player',
    },
  })

  useEffect(() => {
    if (isEditing && game) {
      form.reset({
        name: game.name || '',
        tournire: game.tournire || '',
        class_name: game.class_name || '',
        s_type: game.s_type || 'player',
      })
      const prevUrl = game.image_url || game.image || ""
      if (prevUrl) {
          setImagePreviewUrl(prevUrl)
      }
    }
  }, [isEditing, game])

  useEffect(() => {
    if (!open) {
      form.reset({ name: '', tournire: '', class_name: '', s_type: 'player' })
      setImageFile(null)
      setImagePreviewUrl(null)
    }
  }, [open])

  const handleImageFileChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    const file = e.target.files?.[0] || null
    setImageFile(file)

    if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl)

    if (file) setImagePreviewUrl(URL.createObjectURL(file))
  }

  const handleImageUploadClick = () => imageInputRef.current?.click()

  const handleSubmit = async (data: { name: string; tournire: string; class_name: string; s_type: string }) => {
    const fd = new FormData()
    fd.append('name', data.name)
    if (data.tournire) fd.append('tournire', data.tournire)
    if (data.class_name) fd.append('class_name', data.class_name)
    if (data.s_type) fd.append('s_type', data.s_type)

    const existingImageUrl = game?.image_url || game?.image || ''
    let imageUrl = existingImageUrl

    if (imageFile) {
      try {
        const rec = await upload(imageFile)
        if (rec?.url) {
          imageUrl = rec.url as string
          if (isEditing && existingImageUrl && existingImageUrl !== imageUrl) {
            try { await remove({ url: existingImageUrl }) } catch {}
          }
        }
      } catch { /* silently ignore */ }
    }
    fd.append('image_url', imageUrl)

    if (isEditing && game?.id !== undefined) fd.append('id', game.id.toString())
    await onSave(fd)
    onOpenChange(false)
    form.reset()
    setImageFile(null)
    setImagePreviewUrl(null)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Sticker' : 'Add Sticker'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update the sticker information and images.' : 'Fill in the fields to create a new sticker.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <Card>
              <CardContent className="p-4 space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sticker Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter sticker name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="class_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Class *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select sticker class" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {STICKER_CLASS_NAMES.map((cls) => (
                            <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="s_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {STICKER_TYPE_OPTIONS.map((opt) => (
                            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tournire"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tournire</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter tournire" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <Label>Image {isEditing ? '' : '*'} </Label>
                  <div className="flex items-center gap-2">
                    <input type="file" accept="image/*" ref={imageInputRef} className="hidden" onChange={handleImageFileChange} />
                    <Button type="button" onClick={handleImageUploadClick}>Upload image</Button>
                    {imagePreviewUrl && (<img src={imagePreviewUrl} alt="preview" className="h-12 w-12 object-cover rounded" />)}
                  </div>
                </div>
              </CardContent>
            </Card>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">{isEditing ? 'Update' : 'Create'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}