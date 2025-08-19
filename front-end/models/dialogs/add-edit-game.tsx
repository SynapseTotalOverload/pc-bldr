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

interface GameFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  isEditing?: boolean
  onSave: (data: FormData) => void | Promise<void>
  game?: Partial<{ id: number; name: string; description: string; image: string; icon: string }>
}

export function AddEditGame({ open, onOpenChange, isEditing = false, onSave, game }: GameFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const iconInputRef = useRef<HTMLInputElement>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null)
  const [iconFile, setIconFile] = useState<File | null>(null)
  const [iconPreviewUrl, setIconPreviewUrl] = useState<string | null>(null)

  // file helpers
  const { upload, remove } = useFile()

  // Init form
  const form = useForm({
    defaultValues: {
      name: game?.name || '',
      description: game?.description || '',
    },
  })

  // Prefill preview when editing and image exists
  useEffect(() => {
    if (isEditing && game) {
      form.reset({
        name: game.name || '',
        description: game.description || '',
      })
    }
    if (isEditing && game?.image) {
      setImagePreviewUrl(game.image)
    }
    if (isEditing && game?.icon) {
      setIconPreviewUrl(game.icon)
    }
  }, [isEditing, game])

  // cleanup when dialog closes
  useEffect(() => {
    if (!open) {
      form.reset({ name: '', description: '' })
      setImageFile(null)
      setIconFile(null)
      setImagePreviewUrl(null)
      setIconPreviewUrl(null)
    }
  }, [open])

  const handleImageUploadClick = () => imageInputRef.current?.click()
  const handleIconUploadClick = () => iconInputRef.current?.click()

  const handleImageFileChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    const file = e.target.files?.[0] || null
    setImageFile(file)
    if (file) setImagePreviewUrl(URL.createObjectURL(file))
  }

  const handleIconFileChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    const file = e.target.files?.[0] || null
    setIconFile(file)
    if (file) setIconPreviewUrl(URL.createObjectURL(file))
  }

  const handleSubmit = async (data: { name: string; description: string }) => {
    const fd = new FormData()
    fd.append('name', data.name)
    if (data.description) fd.append('description', data.description)
    let imageUrl = game?.image || ''
    let iconUrl = game?.icon || ''

    // handle image
    if (imageFile) {
      if (isEditing && game?.image) {
        try { await remove({ url: game.image }) } catch {/**/}
      }
      try {
        const rec = await upload(imageFile)
        imageUrl = rec.url
      } catch { /* handle silently */ }
    }

    // handle icon
    if (iconFile) {
      if (isEditing && game?.icon) {
        try { await remove({ url: game.icon }) } catch {/**/}
      }
      try {
        const rec = await upload(iconFile)
        iconUrl = rec.url
      } catch { }
    }

    fd.append('image', imageUrl)
    fd.append('icon', iconUrl)
    if (isEditing && game?.id !== undefined) fd.append('id', game.id.toString())
    await onSave(fd)
    onOpenChange(false)
    form.reset()
    setImageFile(null)
    setImagePreviewUrl(null)
    setIconFile(null)
    setIconPreviewUrl(null)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Game' : 'Add Game'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update the game information and images.' : 'Fill in the fields to create a new game.'}
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
                      <FormLabel>Game Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter game name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter description" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <Label>Image {isEditing ? '' : '*'} </Label>
                  <div className="flex items-center gap-2">
                    <input type="file" accept="image/*" ref={imageInputRef} className="hidden" onChange={handleImageFileChange} />
                    <Button type="button" onClick={handleImageUploadClick}>Upload image</Button>
                    {imagePreviewUrl && (<img src={imagePreviewUrl} alt="image" className="h-12 w-12 object-cover rounded" />)}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Icon {isEditing ? '' : '*'} </Label>
                  <div className="flex items-center gap-2">
                    <input type="file" accept="image/*" ref={iconInputRef} className="hidden" onChange={handleIconFileChange} />
                    <Button type="button" onClick={handleIconUploadClick}>Upload icon</Button>
                    {iconPreviewUrl && (<img src={iconPreviewUrl} alt="icon" className="h-12 w-12 object-cover rounded" />)}
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