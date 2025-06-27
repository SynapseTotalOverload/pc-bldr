'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BuildRead } from '@/types/prodcuts-base';
import { useBuild } from '@/hooks/useBuilds';
import { useToast } from '@/hooks/use-toast';

interface BuildDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  build?: BuildRead | null;
  onSuccess?: () => void;
}

export function BuildDialog({ open, onOpenChange, build, onSuccess }: BuildDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    build_type: '',
    build_price: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { createBuild, updateBuild, loading } = useBuild();
  const { toast } = useToast();

  const isEditing = !!build;

  useEffect(() => {
    if (build) {
      setFormData({
        name: build.name,
        build_type: build.build_type || '',
        build_price: build.build_price?.toString() || '',
      });
    } else {
      setFormData({
        name: '',
        build_type: '',
        build_price: '',
      });
    }
    setErrors({});
  }, [build, open]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (formData.build_price && isNaN(Number(formData.build_price))) {
      newErrors.build_price = 'Price must be a valid number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const submitData = {
        name: formData.name.trim(),
        build_type: formData.build_type || undefined,
        build_price: formData.build_price ? parseFloat(formData.build_price) : undefined,
      };

      if (isEditing && build) {
        await updateBuild(build.id, submitData);
        toast({
          title: 'Success',
          description: 'Build updated successfully',
        });
      } else {
        await createBuild(submitData);
        toast({
          title: 'Success',
          description: 'Build created successfully',
        });
      }

      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Build' : 'Create New Build'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Make changes to your build here.' : 'Fill in the details to create a new build.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <div className="col-span-3">
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter build name"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="build_type" className="text-right">
                Type
              </Label>
              <div className="col-span-3">
                <Select
                  value={formData.build_type}
                  onValueChange={(value) => handleInputChange('build_type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select build type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gaming">Gaming</SelectItem>
                    <SelectItem value="office">Office</SelectItem>
                    <SelectItem value="workstation">Workstation</SelectItem>
                    <SelectItem value="budget">Budget</SelectItem>
                    <SelectItem value="high-end">High-End</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="build_price" className="text-right">
                Price
              </Label>
              <div className="col-span-3">
                <Input
                  id="build_price"
                  type="number"
                  step="0.01"
                  value={formData.build_price}
                  onChange={(e) => handleInputChange('build_price', e.target.value)}
                  placeholder="Enter build price"
                  className={errors.build_price ? 'border-red-500' : ''}
                />
                {errors.build_price && (
                  <p className="text-sm text-red-500 mt-1">{errors.build_price}</p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : isEditing ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 