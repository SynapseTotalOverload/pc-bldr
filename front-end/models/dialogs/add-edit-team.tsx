'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useFile } from '@/hooks/useFile';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';      
import { Textarea } from '@/components/ui/textarea';


export function AddEditTeam({
  onSave, 
  open, 
  team,
  onOpenChange, 
  teamId
}: {
  onSave: (data: FormData) => void | Promise<void>,
  open?: boolean,
  team?: Partial<FormData>,
  onOpenChange?: (open: boolean) => void,
  onDelete?: (id: string | number) => void,
  teamId?: string | number,
  isAccessoriesPage?: boolean
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isSubmitAttempted, setIsSubmitAttempted] = useState(false);

  const isOpen = open !== undefined ? open : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;

  const isEditing = !!team && !!teamId;

  const originalData = team;

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUploadButtonClick = () => {
    fileInputRef.current?.click()
  }

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const urlSchema = z.object({
    discord: z.string().url('Invalid URL').optional().or(z.literal('')),
    instagram: z.string().url('Invalid URL').optional().or(z.literal('')),
    steam: z.string().url('Invalid URL').optional().or(z.literal('')),
    tiktok: z.string().url('Invalid URL').optional().or(z.literal('')),
    twitch: z.string().url('Invalid URL').optional().or(z.literal('')),
    twitter: z.string().url('Invalid URL').optional().or(z.literal('')),
    youtube: z.string().url('Invalid URL').optional().or(z.literal('')),
  });

  const formSchema = z.object({
    name: z.string().min(1, 'Team name is required'),
    description: z.string().optional(),
    socila_media_links: urlSchema,
  });

  type TeamFormData = z.infer<typeof formSchema>;

  const form = useForm<TeamFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      socila_media_links: {
        discord: '',
        instagram: '',
        steam: '',
        tiktok: '',
        twitch: '',
        twitter: '',
        youtube: '',
      },
    },
  });
  const logoInputRef = useRef<HTMLInputElement>(null);
  const jerseysInputRef = useRef<HTMLInputElement>(null);

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);

  const [jerseysFile, setJerseysFile] = useState<File | null>(null);
  const [jerseysPreviewUrl, setJerseysPreviewUrl] = useState<string | null>(null);

  const { upload, remove } = useFile();

  useEffect(() => {
    if (isEditing && isOpen && team) {
      const sm: any = (team as any).socila_media_links || {};
      form.reset({
        name: (team as any).name || '',
        description: (team as any).description || '',
        socila_media_links: {
          discord: sm.discord || '',
          instagram: sm.instagram || '',
          steam: sm.steam || '',
          tiktok: sm.tiktok || '',
          twitch: sm.twitch || '',
          twitter: sm.twitter || '',
          youtube: sm.youtube || '',
        },
      });

      if ((team as any).logo) setLogoPreviewUrl((team as any).logo);
      if ((team as any).jerseys_img) setJerseysPreviewUrl((team as any).jerseys_img);
    }
  }, [isEditing, isOpen, team]);

  const handleLogoUploadClick = () => logoInputRef.current?.click();
  const handleJerseysUploadClick = () => jerseysInputRef.current?.click();

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setLogoFile(file);
    if (file) setLogoPreviewUrl(URL.createObjectURL(file));
  };

  const handleJerseysFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setJerseysFile(file);
    if (file) setJerseysPreviewUrl(URL.createObjectURL(file));
  };

  const onSubmit = async (data: TeamFormData) => {
    const payload: any = {
      name: data.name,
      description: data.description,
      logo: (originalData as any)?.logo || '',
      jerseys_img: (originalData as any)?.jerseys_img || '',
      socila_media_links: data.socila_media_links,
    };

    if (logoFile) {
      if (isEditing && originalData && (originalData as any).logo) {
        try {
          await remove({ url: (originalData as any).logo });
        } catch (err) {
          console.error('Failed to delete previous logo', err);
        }
      }
      try {
        const record = await upload(logoFile);
        payload.logo = record.url;
      } catch (err) {
        console.error('Logo upload failed', err);
      }
    }

    if (jerseysFile) {
      if (isEditing && originalData && (originalData as any).jerseys_img) {
        try {
          await remove({ url: (originalData as any).jerseys_img });
        } catch (err) {
          console.error('Failed to delete previous jerseys image', err);
        }
      }
      try {
        const record = await upload(jerseysFile);
        payload.jerseys_img = record.url;
      } catch (err) {
        console.error('Jerseys image upload failed', err);
      }
    }
    onSave(payload);
    setIsOpen(false)
  };

  useEffect(() => {
    if (!isOpen) {
      form.reset();
      setLogoFile(null);
      setLogoPreviewUrl(null);
      setJerseysFile(null);
      setJerseysPreviewUrl(null);
    }
  }, [isOpen]);


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>{isEditing ? 'Edit Team' : 'Add New Team'}</span>
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardContent className="grid-cols-1 gap-2 p-4">
                <FormField
                  name="name"
                  rules={{
                    required: "Team name is required",
                    validate: (value) => {
                      if (!value || value.trim() === '') {
                        return "Team name cannot be empty";
                      }
                      return true;
                    }
                  }}
                  render={({ field, fieldState }) => (
                    <FormItem className="flex justify-between gap-4 items-center p-2">
                      <FormLabel className="w-1/7">Team Name *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter team name" 
                          {...field} 
                          value={field.value ?? ''} 
                          className={
                            fieldState.error || 
                            (isSubmitAttempted && (!field.value || field.value.toString().trim() === ''))
                            ? 'border-red-500 focus:border-red-500' : ''
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="description"
                  render={({ field }) => (
                    <FormItem className="flex justify-between gap-4 items-center p-2">
                      <FormLabel className="w-1/7">Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter description" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="logo"
                  render={({ field }) => (
                    <FormItem className="flex justify-between gap-4 items-center p-2">
                     <FormLabel className="w-1/7">Logo *</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2 w-full">
                            <input
                              type="file"
                              accept="image/*"
                              ref={logoInputRef}
                              className="hidden"
                              onChange={handleLogoFileChange}
                            />
                            <Button type="button" onClick={handleLogoUploadClick}>
                              Upload logo
                            </Button>
                            {logoPreviewUrl && (
                              <div className="flex items-center gap-2">
                                <img src={logoPreviewUrl} alt="logo" className="h-10 w-10 object-cover rounded" />
                                <span className="text-xs break-all max-w-[120px] line-clamp-1" title={logoFile?.name || ''}>{logoFile?.name || ''}</span>
                              </div>
                            )}
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="jerseys_img"
                  render={({ field }) => (
                    <FormItem className="flex justify-between gap-4 items-center p-2">
                     <FormLabel className="w-1/7">Jerseys</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2 w-full">
                            <input
                              type="file"
                              accept="image/*"
                              ref={jerseysInputRef}
                              className="hidden"
                              onChange={handleJerseysFileChange}
                            />
                            <Button type="button" onClick={handleJerseysUploadClick}>
                              Upload jerseys
                            </Button>
                            {jerseysPreviewUrl && (
                              <div className="flex items-center gap-2">
                                <img src={jerseysPreviewUrl} alt="jerseys" className="h-10 w-10 object-cover rounded" />
                                <span className="text-xs break-all max-w-[120px] line-clamp-1" title={jerseysFile?.name || ''}>{jerseysFile?.name || ''}</span>
                              </div>
                            )}
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Separator />

            <Card>
              <CardContent className="grid-cols-1 gap-2 p-4">
                <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="discord" className="text-left">
                Discord URL
              </Label>
              <FormField
                name="socila_media_links.discord"
                render={({ field }) => (
                  <FormItem className="col-span-3">
                    <FormControl>
                      <Input id="discord" placeholder="https://discord.gg/..." value={field.value || ''} onChange={(e) => field.onChange(e.target.value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Label htmlFor="instagram" className="text-left">
                Instagram URL
              </Label>
              <FormField
                name="socila_media_links.instagram"
                render={({ field }) => (
                  <FormItem className="col-span-3">
                    <FormControl>
                      <Input id="instagram" placeholder="https://www.instagram.com/..." value={field.value || ''} onChange={(e) => field.onChange(e.target.value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Label htmlFor="steam" className="text-left">
                Steam URL
              </Label>
              <FormField
                name="socila_media_links.steam"
                render={({ field }) => (
                  <FormItem className="col-span-3">
                    <FormControl>
                      <Input id="steam" placeholder="https://steamcommunity.com/..." value={field.value || ''} onChange={(e) => field.onChange(e.target.value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Label htmlFor="tiktok" className="text-left">
                TikTok URL
              </Label>
              <FormField
                name="socila_media_links.tiktok"
                render={({ field }) => (
                  <FormItem className="col-span-3">
                    <FormControl>
                      <Input id="tiktok" placeholder="https://www.tiktok.com/..." value={field.value || ''} onChange={(e) => field.onChange(e.target.value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Label htmlFor="twitch" className="text-left">
                Twitch URL
              </Label>
              <FormField
                name="socila_media_links.twitch"
                render={({ field }) => (
                  <FormItem className="col-span-3">
                    <FormControl>
                      <Input id="twitch" placeholder="https://www.twitch.tv/..." value={field.value || ''} onChange={(e) => field.onChange(e.target.value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Label htmlFor="twitter" className="text-left">
                Twitter URL
              </Label>
              <FormField
                name="socila_media_links.twitter"
                render={({ field }) => (
                  <FormItem className="col-span-3">
                    <FormControl>
                      <Input id="twitter" placeholder="https://x.com/..." value={field.value || ''} onChange={(e) => field.onChange(e.target.value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Label htmlFor="youtube" className="text-left">
                YouTube URL
              </Label>
              <FormField
                name="socila_media_links.youtube"
                render={({ field }) => (
                  <FormItem className="col-span-3">
                    <FormControl>
                      <Input id="youtube" placeholder="https://www.youtube.com/..." value={field.value || ''} onChange={(e) => field.onChange(e.target.value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                </div>
              </CardContent>
            </Card>
            <DialogFooter className="flex justify-between">
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {isEditing ? 'Update Team' : 'Add Team'}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}