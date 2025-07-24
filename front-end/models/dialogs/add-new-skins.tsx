'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SKIN_CATEGORIES, SKIN_CATEGORY_DISPLAY_NAMES } from '@/types/skins-base'
import { createSkin, updateSkin, SkinCreate, SkinRead } from '@/lib/skins-api'
import { useToast } from '@/hooks/use-toast'

const skinFormSchema = z.object({
  full_name: z.string().min(1, 'Full name is required'),
  image_file: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  category_id: z.number().min(1, 'Please select a category'),
})

type SkinFormData = z.infer<typeof skinFormSchema>

interface AddNewSkinsProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSuccess?: () => void
  skinToEdit?: SkinRead | null
}

export function AddNewSkins({ open = false, onOpenChange, onSuccess, skinToEdit }: AddNewSkinsProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const isEditing = !!skinToEdit

  const form = useForm<SkinFormData>({
    resolver: zodResolver(skinFormSchema),
    defaultValues: {
      full_name: '',
      image_file: '',
      category_id: SKIN_CATEGORIES.RIFLES,
    },
  })

  // Reset form when skinToEdit changes
  useEffect(() => {
    if (skinToEdit) {
      form.reset({
        full_name: skinToEdit.full_name,
        image_file: skinToEdit.image_file || '',
        category_id: skinToEdit.category_id,
      })
    } else {
      form.reset({
        full_name: '',
        image_file: '',
        category_id: SKIN_CATEGORIES.RIFLES,
      })
    }
  }, [skinToEdit, form])

  const onSubmit = async (data: SkinFormData) => {
    setIsSubmitting(true)
    
    try {
      if (isEditing && skinToEdit) {
        // Update existing skin
        const updateData = {
          name: data.full_name.split('|')[0]?.trim() || data.full_name,
          full_name: data.full_name,
          weapon: data.full_name.split('|')[0]?.trim() || 'Unknown',
          skin_name: data.full_name.split('|')[1]?.trim() || 'Default',
          image_file: data.image_file || undefined,
          category_id: data.category_id,
        }

        console.log('Updating skin:', updateData)
        await updateSkin(skinToEdit.id, updateData)
        
        toast({
          title: 'Success',
          description: 'Skin updated successfully!',
        })
      } else {
        // Create new skin
        const skinData: SkinCreate = {
          name: data.full_name.split('|')[0]?.trim() || data.full_name,
          full_name: data.full_name,
          weapon: data.full_name.split('|')[0]?.trim() || 'Unknown',
          skin_name: data.full_name.split('|')[1]?.trim() || 'Default',
          image_file: data.image_file || undefined,
          link: undefined,
          category_id: data.category_id,
        }

        console.log('Creating skin:', skinData)
        await createSkin(skinData)
        
        toast({
          title: 'Success',
          description: 'Skin created successfully!',
        })
      }
      
      form.reset()
      onOpenChange?.(false)
      onSuccess?.()
    } catch (error) {
        console.log(error)
      console.error('Error saving skin:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save skin',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    form.reset()
    onOpenChange?.(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Skin' : 'Add New Skin'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update the skin details below.' : 'Create a new CS:GO skin. Fill in the details below.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Skin Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Category Selection */}
                <FormField
                  control={form.control}
                  name="category_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category *</FormLabel>
                      <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={field.value?.toString()}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(SKIN_CATEGORY_DISPLAY_NAMES).map(([id, name]) => (
                            <SelectItem key={id} value={id}>
                              {name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Full Name */}
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., AK-47 | Redline" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Image URL */}
                <FormField
                  control={form.control}
                  name="image_file"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://example.com/skin-image.jpg" 
                          {...field} 
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Skin' : 'Create Skin')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}