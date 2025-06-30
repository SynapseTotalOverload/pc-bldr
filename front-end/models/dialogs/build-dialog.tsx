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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BuildRead, ProductRead } from '@/types/prodcuts-base';
import { useBuild } from '@/hooks/useBuilds';
import { useToast } from '@/hooks/use-toast';
import { useProducts } from '@/hooks/useProducts';

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
    cpu_id: '',
  });

  //CPU Products
  const [cpuPage, setCpuPage] = useState(1);
  const [hasMoreCpu, setHasMoreCpu] = useState(true);

  const {
    products: currentCpuProducts,
    loading: cpuLoading,
    pagination,
  } = useProducts<ProductRead>({
    category: 'cpu',
    page: cpuPage,
    search: '',
  });

  const [allCpuProducts, setAllCpuProducts] = useState<ProductRead[]>([]);


  // Accumulate CPU products when new data arrives
  useEffect(() => {
    if (currentCpuProducts.length > 0) {
      if (cpuPage === 1) {
        // First page - replace all
        setAllCpuProducts(currentCpuProducts);
      } else {
        // Subsequent pages - append to existing
        setAllCpuProducts((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const newProducts = currentCpuProducts.filter((p) => !existingIds.has(p.id));
          return [...prev, ...newProducts];
        });
      }
    }

    // Update hasMore based on pagination
    if (pagination) {
      setHasMoreCpu(pagination.currentPage < pagination.totalPages);
    }
  }, [currentCpuProducts, cpuPage, pagination]);

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
        cpu_id: build.cpu?.id?.toString() || '',
      });
    } else {
      setFormData({
        name: '',
        build_type: '',
        build_price: '',
        cpu_id: '',
      });
    }
    setErrors({});

    // When dialog opens/closes
    if (!open) {
      setAllCpuProducts([]);
      setCpuPage(1);
      setHasMoreCpu(true);
    }
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
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
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
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="build_type" className="text-right">
                Type
              </Label>
              <div className="col-span-3">
                <Select value={formData.build_type} onValueChange={(value) => handleInputChange('build_type', value)}>
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
              <Label htmlFor="cpu_id" className="text-right">
                CPU
              </Label>
              <div className="col-span-3">
                <Select value={formData.cpu_id} onValueChange={(value) => handleInputChange('cpu_id', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select CPU" />
                  </SelectTrigger>
                  <SelectContent>
                    {cpuLoading && cpuPage === 1 ? (
                      <div className="text-muted-foreground p-2 text-center text-sm">Loading CPUs...</div>
                    ) : allCpuProducts.length === 0 ? (
                      <div className="text-muted-foreground p-2 text-center text-sm">No CPUs available</div>
                    ) : (
                      <>
                        {allCpuProducts.map((product) => (
                          <SelectItem key={product.id} value={product.id.toString()}>
                            <div className="flex flex-col gap-1 py-1">
                              <div className="text-sm leading-tight font-medium">
                                {product.attrs.brand} {product.attrs.model}
                              </div>
                              <div className="text-muted-foreground text-xs leading-tight">
                                {product.attrs.type === 'cpu' && (
                                  <>
                                    {product.attrs.cores}C/{product.attrs.threads}T • {product.attrs.base_speed} •{' '}
                                    {product.attrs.socket_type}
                                  </>
                                )}
                              </div>
                              <div className="text-xs font-medium text-green-600">
                                {product.price ? `$${product.price.toFixed(2)}` : 'Price N/A'}
                                {product.rating && <span className="ml-2 text-yellow-600">★ {product.rating}</span>}
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                        {hasMoreCpu && !cpuLoading && (
                          <div className="p-2">
                            <Button
                              onClick={() => setCpuPage(cpuPage + 1)}
                              variant="outline"
                              size="sm"
                              className="w-full"
                            >
                              Load more CPUs
                            </Button>
                          </div>
                        )}
                        {cpuLoading && cpuPage > 1 && (
                          <div className="text-muted-foreground p-2 text-center text-sm">Loading more CPUs...</div>
                        )}
                        {!hasMoreCpu && allCpuProducts.length > 0 && (
                          <div className="text-muted-foreground p-2 text-center text-xs">
                            All CPUs loaded ({allCpuProducts.length} total)
                          </div>
                        )}
                      </>
                    )}
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
                  min="0"
                  value={formData.build_price}
                  onChange={(e) => handleInputChange('build_price', e.target.value)}
                  placeholder="Enter build price"
                  className={errors.build_price ? 'border-red-500' : ''}
                />
                {errors.build_price && <p className="mt-1 text-sm text-red-500">{errors.build_price}</p>}
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
