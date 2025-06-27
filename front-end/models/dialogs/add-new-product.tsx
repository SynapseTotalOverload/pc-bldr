'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';
import { 
  ProductTypeMapNames, 
  PRODUCT_TYPE_NAMES, 
  ProductCreate, 
  ProductAttrs,
  CPU,
  CPUCooler,
  Motherboard,
  RAM,
  Storage,
  GPU,
  PowerSupply,
  Case
} from '@/types/prodcuts-base';

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select';
  required?: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
}

const CATEGORY_FIELDS: Record<keyof ProductTypeMapNames, FormField[]> = {
  cpu: [
    { name: 'brand', label: 'Brand', type: 'text', required: true, placeholder: 'Intel, AMD' },
    { name: 'model', label: 'Model', type: 'text', required: true, placeholder: 'Core i7-12700K' },
    { name: 'cores', label: 'Cores', type: 'number', required: true, placeholder: '12' },
    { name: 'threads', label: 'Threads', type: 'number', required: true, placeholder: '20' },
    { name: 'socket_type', label: 'Socket Type', type: 'text', required: true, placeholder: 'LGA1700' },
    { name: 'base_speed', label: 'Base Speed', type: 'text', required: true, placeholder: '3.6GHz' },
    { name: 'turbo_speed', label: 'Turbo Speed', type: 'text', required: true, placeholder: '5.0GHz' },
    { name: 'architechture', label: 'Architecture', type: 'text', required: true, placeholder: 'Alder Lake' },
    { name: 'core_family', label: 'Core Family', type: 'text', required: true, placeholder: 'Core i7' },
    { name: 'integrated_graphics', label: 'Integrated Graphics', type: 'text', placeholder: 'Intel UHD 770' },
    { name: 'memory_type', label: 'Memory Type', type: 'text', required: true, placeholder: 'DDR5' },
    { name: 'memory_speed', label: 'Memory Speed', type: 'number', required: true, placeholder: '4800' },
    { name: 'series', label: 'Series', type: 'text', required: true, placeholder: '12700K' },
    { name: 'generation', label: 'Generation', type: 'text', required: true, placeholder: '12th Gen' },
  ],
  gpu: [
    { name: 'brand', label: 'Brand', type: 'text', required: true, placeholder: 'NVIDIA, AMD' },
    { name: 'model', label: 'Model', type: 'text', required: true, placeholder: 'RTX 3080' },
    { name: 'memory', label: 'Memory (GB)', type: 'number', required: true, placeholder: '10' },
    { name: 'mem_interface', label: 'Memory Interface', type: 'text', required: true, placeholder: '320-bit' },
    { name: 'length', label: 'Length (mm)', type: 'number', placeholder: '285' },
    { name: 'interface', label: 'Interface', type: 'text', required: true, placeholder: 'PCIe 4.0' },
    { name: 'chipset', label: 'Chipset', type: 'text', required: true, placeholder: 'Ampere' },
    { name: 'base_clock', label: 'Base Clock (MHz)', type: 'number', placeholder: '1440' },
    { name: 'clock_speed', label: 'Clock Speed (MHz)', type: 'number', placeholder: '1710' },
    { name: 'frame_sync', label: 'Frame Sync', type: 'text', required: true, placeholder: 'G-Sync, FreeSync' },
  ],
  memory: [
    { name: 'brand', label: 'Brand', type: 'text', required: true, placeholder: 'Corsair, G.Skill' },
    { name: 'model', label: 'Model', type: 'text', required: true, placeholder: 'Vengeance LPX' },
    { name: 'total_memory', label: 'Total Memory (GB)', type: 'number', required: true, placeholder: '32' },
    { name: 'one_unit_memory', label: 'One Unit Memory (GB)', type: 'number', required: true, placeholder: '16' },
    { name: 'quantity', label: 'Quantity', type: 'number', required: true, placeholder: '2' },
    { name: 'ram_type', label: 'RAM Type', type: 'text', required: true, placeholder: 'DDR4, DDR5' },
    { name: 'ram_speed', label: 'RAM Speed (MHz)', type: 'number', required: true, placeholder: '3200' },
    { name: 'cas_latency', label: 'CAS Latency', type: 'text', required: true, placeholder: 'CL16' },
  ],
  motherboard: [
    { name: 'brand', label: 'Brand', type: 'text', required: true, placeholder: 'ASUS, MSI' },
    { name: 'model', label: 'Model', type: 'text', required: true, placeholder: 'ROG STRIX Z690-E' },
    { name: 'chipset', label: 'Chipset', type: 'text', required: true, placeholder: 'Z690' },
    { name: 'form_factor', label: 'Form Factor', type: 'text', required: true, placeholder: 'ATX, mATX' },
    { name: 'socket_type', label: 'Socket Type', type: 'text', required: true, placeholder: 'LGA1700' },
    { name: 'ram_slots', label: 'RAM Slots', type: 'number', required: true, placeholder: '4' },
    { name: 'max_ram_support', label: 'Max RAM Support (GB)', type: 'number', required: true, placeholder: '128' },
  ],
  internal_hard_drive: [
    { name: 'brand', label: 'Brand', type: 'text', required: true, placeholder: 'Samsung, Western Digital' },
    { name: 'model', label: 'Model', type: 'text', required: true, placeholder: '970 EVO Plus' },
    { name: 'capacity', label: 'Capacity (GB)', type: 'number', placeholder: '1000' },
    { name: 'mem_type', label: 'Memory Type', type: 'text', required: true, placeholder: 'NVMe, SATA' },
    { name: 'interface', label: 'Interface', type: 'text', required: true, placeholder: 'PCIe 4.0, SATA III' },
    { name: 'cache_mem', label: 'Cache Memory (MB)', type: 'number', placeholder: '1024' },
    { name: 'form_factor', label: 'Form Factor', type: 'text', required: true, placeholder: 'M.2, 2.5"' },
  ],
  power_supply: [
    { name: 'brand', label: 'Brand', type: 'text', required: true, placeholder: 'Corsair, EVGA' },
    { name: 'model', label: 'Model', type: 'text', required: true, placeholder: 'RM850x' },
    { name: 'power', label: 'Power (W)', type: 'number', placeholder: '850' },
    { name: 'efficiency', label: 'Efficiency', type: 'text', required: true, placeholder: '80+ Gold' },
    { name: 'color', label: 'Color', type: 'text', required: true, placeholder: 'Black' },
  ],
  cpu_cooler: [
    { name: 'brand', label: 'Brand', type: 'text', required: true, placeholder: 'Noctua, Cooler Master' },
    { name: 'model', label: 'Model', type: 'text', required: true, placeholder: 'NH-D15' },
    { name: 'fan_rpm_base', label: 'Base Fan RPM', type: 'number', placeholder: '300' },
    { name: 'fan_rpm_max', label: 'Max Fan RPM', type: 'number', placeholder: '1500' },
    { name: 'noise_level_base', label: 'Base Noise Level (dB)', type: 'number', placeholder: '24' },
    { name: 'noise_level_max', label: 'Max Noise Level (dB)', type: 'number', placeholder: '24' },
    { name: 'color', label: 'Color', type: 'text', required: true, placeholder: 'Black, White' },
  ],
  video_card: [
    { name: 'brand', label: 'Brand', type: 'text', required: true, placeholder: 'NVIDIA, AMD' },
    { name: 'model', label: 'Model', type: 'text', required: true, placeholder: 'RTX 3080' },
    { name: 'memory', label: 'Memory (GB)', type: 'number', required: true, placeholder: '10' },
    { name: 'mem_interface', label: 'Memory Interface', type: 'text', required: true, placeholder: '320-bit' },
    { name: 'length', label: 'Length (mm)', type: 'number', placeholder: '285' },
    { name: 'interface', label: 'Interface', type: 'text', required: true, placeholder: 'PCIe 4.0' },
    { name: 'chipset', label: 'Chipset', type: 'text', required: true, placeholder: 'Ampere' },
    { name: 'base_clock', label: 'Base Clock (MHz)', type: 'number', placeholder: '1440' },
    { name: 'clock_speed', label: 'Clock Speed (MHz)', type: 'number', placeholder: '1710' },
    { name: 'frame_sync', label: 'Frame Sync', type: 'text', required: true, placeholder: 'G-Sync, FreeSync' },
  ],
} as const;

interface FormData {
  category: keyof ProductTypeMapNames;
  asin: string;
  title: string;
  price: string;
  rating: string;
  brand: string;
  model: string;
  [key: string]: string | number;
}

export function AddNewProduct({
  activeCategory, 
  onHandleSubmit, 
  open, 
  data,
  onOpenChange, 
  onDelete,
  productId
}: {
  activeCategory: keyof ProductTypeMapNames, 
  onHandleSubmit: (data: FormData) => void,
  open?: boolean,
  data?: Partial<FormData>,
  onOpenChange?: (open: boolean) => void,
  onDelete?: (id: string | number) => void,
  productId?: string | number
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<keyof ProductTypeMapNames>(activeCategory);
  const { toast } = useToast();

  // Use external open state if provided, otherwise use internal state
  const isOpen = open !== undefined ? open : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;

  // Determine if we're editing an existing product
  const isEditing = !!data && !!productId;

  const form = useForm<FormData>({
    defaultValues: {
      category: activeCategory,
      asin: '',
      title: '',
      price: '',
      rating: '',
      brand: '',
      model: '',
      ...data, // Pre-populate with existing data if editing
    },
  });

  // Update selected category when activeCategory prop changes
  useEffect(() => {
    setSelectedCategory(activeCategory);
    form.setValue('category', activeCategory);
  }, [activeCategory, form]);

  // Reset form when dialog opens/closes or when data changes
  useEffect(() => {
    if (!isOpen) {
      form.reset({
        category: activeCategory,
        asin: '',
        title: '',
        price: '',
        rating: '',
        brand: '',
        model: '',
        ...data, // Pre-populate with existing data if editing
      });
    }
  }, [isOpen, activeCategory, form, data]);

  // Update form when data prop changes (for editing mode)
  useEffect(() => {
    if (data && isOpen) {
      form.reset({
        category: activeCategory,
        asin: '',
        title: '',
        price: '',
        rating: '',
        brand: '',
        model: '',
        ...data,
      });
    }
  }, [data, isOpen, activeCategory, form]);

  const getCategoryId = (category: keyof ProductTypeMapNames): number => {
    const categoryMap: Record<keyof ProductTypeMapNames, number> = {
      cpu: 1,
      cpu_cooler: 2,
      gpu: 3,
      motherboard: 4,
      memory: 5,
      internal_hard_drive: 6,
      power_supply: 7,
      video_card: 8,
    };
    return categoryMap[category];
  };

  const validateForm = (data: FormData) => {
    if (!data.title) {
      toast({
        title: "Validation Error",
        description: "Product title is required",
        variant: "destructive",
      });
      return false;
    }

    const fields = CATEGORY_FIELDS[data.category];
    const requiredFields = fields.filter(field => field.required);
    
    for (const field of requiredFields) {
      if (!data[field.name]) {
        toast({
          title: "Validation Error",
          description: `${field.label} is required`,
          variant: "destructive",
        });
        return false;
      }
    }

    return true;
  };

  const onSubmit = async (data: FormData) => {
    if (!validateForm(data)) return;

    try {
      // Call the parent handler
      onHandleSubmit(data);

      toast({
        title: "Success",
        description: isEditing ? "Product updated successfully!" : "Product added successfully!",
      });

      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: isEditing ? "Failed to update product" : "Failed to add product",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!productId || !onDelete) {
      toast({
        title: "Error",
        description: "Delete functionality not available",
        variant: "destructive",
      });
      return;
    }

    try {
      onDelete(productId);
      toast({
        title: "Success",
        description: "Product deleted successfully!",
      });
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  const handleCategoryChange = (category: keyof ProductTypeMapNames) => {
    setSelectedCategory(category);
    form.setValue('category', category);
    // Reset form fields when category changes
    form.reset({
      category,
      asin: form.getValues('asin'),
      title: form.getValues('title'),
      price: form.getValues('price'),
      rating: form.getValues('rating'),
    });
  };

  const renderField = (field: FormField) => {
    return (
      <FormField
        key={field.name}
        control={form.control}
        name={field.name}
        render={({ field: formField }) => (
          <FormItem>
            <FormLabel>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </FormLabel>
            <FormControl>
              {field.type === 'number' ? (
                <Input
                  type="number"
                  placeholder={field.placeholder}
                  {...formField}
                  onChange={(e) => formField.onChange(e.target.value)}
                />
              ) : (
                <Input
                  placeholder={field.placeholder}
                  {...formField}
                />
              )}
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>{isEditing ? 'Edit Product' : 'Add New Product'}</span>
            <Badge variant="secondary">{PRODUCT_TYPE_NAMES[selectedCategory]}</Badge>
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Update the product information below. All required fields are marked with an asterisk (*).'
              : 'Fill in the product information below. All required fields are marked with an asterisk (*).'
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Category Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Product Category</CardTitle>
                <CardDescription>Select the type of product you want to add</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={selectedCategory} onValueChange={(value) => handleCategoryChange(value as keyof ProductTypeMapNames)}>
                  <TabsList className="grid w-full grid-cols-4">
                    {Object.entries(PRODUCT_TYPE_NAMES).map(([key, name]) => (
                      <TabsTrigger key={key} value={key} className="text-xs">
                        {name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {Object.entries(PRODUCT_TYPE_NAMES).map(([key, name]) => (
                    <TabsContent key={key} value={key} className="mt-4">
                      <div className="text-sm text-muted-foreground">
                        {isEditing 
                          ? `Editing ${name.toLowerCase()} in the catalog`
                          : `Adding a new ${name.toLowerCase()} to the catalog`
                        }
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>

            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>General product details</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Title *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter product title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="asin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ASIN</FormLabel>
                      <FormControl>
                        <Input placeholder="Amazon Standard Identification Number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rating</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          min="0"
                          max="5"
                          placeholder="4.5"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Product Specific Attributes */}
            <Card>
              <CardHeader>
                <CardTitle>{PRODUCT_TYPE_NAMES[selectedCategory]} Specifications</CardTitle>
                <CardDescription>Technical specifications for this {PRODUCT_TYPE_NAMES[selectedCategory]?.toLowerCase()}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {CATEGORY_FIELDS[selectedCategory]?.map((field) => renderField(field))}
                </div>
              </CardContent>
            </Card>

            <Separator />

            <DialogFooter className="flex justify-between">
              <div className="flex gap-2">
                {productId && onDelete && (
                  <Button 
                    type="button" 
                    variant="destructive" 
                    onClick={handleDelete}
                  >
                    Delete Product
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {isEditing ? 'Update Product' : 'Add Product'}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}