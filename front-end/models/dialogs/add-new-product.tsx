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
    { name: 'base_speed', label: 'Base Speed (GHz)', type: 'number', required: true, placeholder: '3.6' },
    { name: 'turbo_speed', label: 'Turbo Speed (GHz)', type: 'number', required: true, placeholder: '5.0' },
    { name: 'architechture', label: 'Architecture', type: 'text', required: true, placeholder: 'Alder Lake' },
    { name: 'core_family', label: 'Core Family', type: 'text', required: true, placeholder: 'Core i7' },
    { name: 'integrated_graphics', label: 'Integrated Graphics', type: 'text', placeholder: 'Intel UHD 770' },
    { name: 'memory_type', label: 'Memory Type', type: 'text', required: true, placeholder: 'DDR5' },
    { name: 'memory_speed', label: 'Memory Speed (MHz)', type: 'number', required: true, placeholder: '4800' },
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
  case: [
    { name: 'brand', label: 'Brand', type: 'text', required: true, placeholder: 'Corsair, NZXT, Fractal Design' },
    { name: 'model', label: 'Model', type: 'text', required: true, placeholder: '4000D Airflow' },
    { name: 'side_panel', label: 'Side Panel', type: 'text', required: true, placeholder: 'Tempered Glass, Steel' },
    { name: 'cabinet_type', label: 'Cabinet Type', type: 'text', required: true, placeholder: 'Mid Tower, Full Tower' },
    { name: 'color', label: 'Color', type: 'text', required: true, placeholder: 'Black, White' },
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
  const [isSubmitAttempted, setIsSubmitAttempted] = useState(false);
  const { toast } = useToast();

  // Use external open state if provided, otherwise use internal state
  const isOpen = open !== undefined ? open : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;

  // Determine if we're editing an existing product
  const isEditing = !!data && !!productId;

  const form = useForm<FormData>({
    mode: 'onChange', 
    defaultValues: {
      category: activeCategory,
      asin: '',
      title: '',
      price: '',
      rating: '',
      brand: '',
      model: '',
      ...data,
    },
  });

  // Update selected category when activeCategory prop changes
  useEffect(() => {
    if (!isEditing) {
      setSelectedCategory(activeCategory);
      form.setValue('category', activeCategory);
    }
  }, [activeCategory, form, isEditing]);

  // Reset form when dialog opens/closes or when data changes
  useEffect(() => {
    if (!isOpen) {
      setIsSubmitAttempted(false); 
      
      // Reset to default empty state
      const defaultFormData = {
        category: activeCategory,
        asin: '',
        title: '',
        price: '',
        rating: '',
        brand: '',
        model: '',
      };
      
      form.reset(defaultFormData);
      setSelectedCategory(activeCategory);
    } else {
      setIsSubmitAttempted(false); 
      
      // If opening in edit mode, populate with product data
      if (isEditing && data) {
        const convertedData = convertProductReadToFormData(data);
        const formDataWithDefaults = {
          category: activeCategory,
          asin: '',
          title: '',
          price: '',
          rating: '',
          brand: '',
          model: '',
          ...convertedData,
        };
        
        form.reset(formDataWithDefaults);
        
        // Update category if it was detected from product data
        if (convertedData.category && convertedData.category !== activeCategory) {
          setSelectedCategory(convertedData.category);
        }
      }
    }
  }, [isOpen, activeCategory, form, data, isEditing]);

  // Update form when data prop changes (for editing mode)
  useEffect(() => {
    if (data && isOpen && isEditing) {
      const convertedData = convertProductReadToFormData(data);
      const formDataWithDefaults = {
        category: activeCategory,
        asin: '',
        title: '',
        price: '',
        rating: '',
        brand: '',
        model: '',
        ...convertedData,
      };
      
      form.reset(formDataWithDefaults);
      
      // Update category if it was detected from product data
      if (convertedData.category && convertedData.category !== activeCategory) {
        setSelectedCategory(convertedData.category);
      }
      
      console.log('📝 Form updated with product data in edit mode');
    }
  }, [data, isOpen, activeCategory, form, isEditing]);

  const getCategoryId = (category: keyof ProductTypeMapNames): number => {
    const categoryMap: Record<keyof ProductTypeMapNames, number> = {
      cpu: 1,
      cpu_cooler: 2,
      gpu: 3,
      motherboard: 4,
      memory: 5,
      internal_hard_drive: 6,
      power_supply: 7,
      case: 8,
    };
    return categoryMap[category];
  };

  const getCategoryKeyById = (categoryId: number): keyof ProductTypeMapNames | null => {
    const idToCategoryMap: Record<number, keyof ProductTypeMapNames> = {
      1: 'cpu',
      2: 'cpu_cooler',
      3: 'gpu',
      4: 'motherboard',
      5: 'memory',
      6: 'internal_hard_drive',
      7: 'power_supply',
      8: 'case',
    };
    return idToCategoryMap[categoryId] || null;
  };

  const convertProductReadToFormData = (productData: any): Partial<FormData> => {
    console.log('🔄 Converting ProductRead to FormData:', productData);
    
    if (!productData) return {};

    // Determine category from category.id or fallback to activeCategory
    let categoryKey: keyof ProductTypeMapNames = activeCategory;
    if (productData.category?.id) {
      const detectedCategory = getCategoryKeyById(productData.category.id);
      if (detectedCategory) {
        categoryKey = detectedCategory;
      }
    }

    // Start with base fields
    const formData: Partial<FormData> = {
      category: categoryKey,
      asin: productData.asin || '',
      title: productData.title || '',
      price: productData.price ? productData.price.toString() : '',
      rating: productData.rating ? productData.rating.toString() : '',
    };

    // Add attributes from attrs object
    if (productData.attrs) {
      // Basic attrs that are common for all categories
      if (productData.attrs.brand) formData.brand = productData.attrs.brand;
      if (productData.attrs.model) formData.model = productData.attrs.model;

      // Add all other attrs fields
      Object.keys(productData.attrs).forEach(key => {
        if (key !== 'type' && key !== 'brand' && key !== 'model') {
          const value = productData.attrs[key];
          if (value !== undefined && value !== null) {
            // Convert numbers to strings for form inputs
            formData[key] = typeof value === 'number' ? value.toString() : value;
          }
        }
      });
    }

    return formData;
  };

  const convertAndValidateTypes = (data: FormData): FormData => {
    console.log("🔍 Converting and validating data types...");
    const convertedData = { ...data };
    const fields = CATEGORY_FIELDS[data.category];
    let hasTypeErrors = false;

    for (const field of fields) {
      const value = data[field.name];
      
      // Skip empty optional fields
      if (!field.required && (!value || value.toString().trim() === '')) {
        continue;
      }

      // If field has a value, convert and validate its type
      if (value !== undefined && value !== null && value.toString().trim() !== '') {
        const stringValue = value.toString().trim();
        
        if (field.type === 'number') {
          const numValue = parseFloat(stringValue);
          
          if (isNaN(numValue)) {
            console.error(`❌ Type mismatch for ${field.name}:`, {
              fieldLabel: field.label,
              expectedType: 'number',
              receivedValue: stringValue,
              receivedType: typeof value,
              category: data.category
            });
            hasTypeErrors = true;
            
            toast({
              title: "Type Validation Error",
              description: `${field.label} must be a valid number. Received: "${stringValue}"`,
              variant: "destructive",
            });
          } else {
            // Successfully converted to number
            convertedData[field.name] = numValue;
            console.log(`✅ Converted ${field.name}:`, {
              from: stringValue,
              to: numValue,
              type: 'number'
            });
          }
        } else if (field.type === 'text') {
          // Keep as string, but log the conversion
          convertedData[field.name] = stringValue;
          console.log(`✅ Validated ${field.name}:`, {
            value: stringValue,
            type: 'text'
          });
        }
      }
    }

    // Also validate basic fields (asin, title, price, rating)
    if (data.price && data.price.toString().trim() !== '') {
      const priceValue = parseFloat(data.price.toString());
      if (isNaN(priceValue)) {
        console.error(`❌ Type mismatch for price:`, {
          expectedType: 'number',
          receivedValue: data.price,
          receivedType: typeof data.price
        });
        hasTypeErrors = true;
        toast({
          title: "Type Validation Error",
          description: `Price must be a valid number. Received: "${data.price}"`,
          variant: "destructive",
        });
      } else {
        convertedData.price = priceValue.toString();
        console.log(`✅ Converted price:`, { from: data.price, to: priceValue });
      }
    }

    if (data.rating && data.rating.toString().trim() !== '') {
      const ratingValue = parseFloat(data.rating.toString());
      if (isNaN(ratingValue)) {
        console.error(`❌ Type mismatch for rating:`, {
          expectedType: 'number',
          receivedValue: data.rating,
          receivedType: typeof data.rating
        });
        hasTypeErrors = true;
        toast({
          title: "Type Validation Error",
          description: `Rating must be a valid number. Received: "${data.rating}"`,
          variant: "destructive",
        });
      } else if (ratingValue < 0 || ratingValue > 5) {
        console.error(`❌ Value out of range for rating:`, {
          value: ratingValue,
          validRange: '0-5'
        });
        hasTypeErrors = true;
        toast({
          title: "Validation Error",
          description: `Rating must be between 0 and 5. Received: ${ratingValue}`,
          variant: "destructive",
        });
      } else {
        convertedData.rating = ratingValue.toString();
        console.log(`✅ Converted rating:`, { from: data.rating, to: ratingValue });
      }
    }

    if (hasTypeErrors) {
      console.error("❌ Type conversion failed. Data will not be submitted.");
      throw new Error("Type validation failed");
    }

    console.log("✅ All type conversions successful:", convertedData);
    return convertedData;
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitAttempted(true);
    
    try {
      // Convert and validate data types
      const convertedData = convertAndValidateTypes(data);
      // Call the parent handler with converted data
      onHandleSubmit(convertedData);

      toast({
        title: "Success",
        description: isEditing ? "Product updated successfully!" : "Product added successfully!",
      });

      setIsOpen(false);
      setIsSubmitAttempted(false); 
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : (isEditing ? "Failed to update product" : "Failed to add product"),
        variant: "destructive",
      });
    }
  };

  const onInvalidSubmit = (errors: any) => {
    setIsSubmitAttempted(true);
    console.log("Form validation errors:", errors);
    
    // Show toast with first error
    const firstError = Object.values(errors)[0] as any;
    if (firstError?.message) {
      toast({
        title: "Validation Error",
        description: firstError.message,
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
    setIsSubmitAttempted(false); 
    form.setValue('category', category);
    
    if (!isEditing) {
      const currentBasicData = {
        asin: form.getValues('asin'),
        title: form.getValues('title'),
        price: form.getValues('price'),
        rating: form.getValues('rating'),
      };
      
      form.reset({
        category,
        ...currentBasicData,
        brand: '',
        model: '',
      });
    } else {
      console.log('📝 Category changed in edit mode, preserving existing data');
    }
  };

  const renderField = (field: FormField) => {
    return (
      <FormField
        key={field.name}
        control={form.control}
        name={field.name}
        rules={{
          required: field.required ? `${field.label} is required` : false,
          validate: (value) => {
            // Skip validation for empty optional fields
            if (!field.required && (!value || value.toString().trim() === '')) {
              return true;
            }
            
            // Validate if field has value
            if (value && value.toString().trim() !== '') {
              if (field.type === 'number') {
                const numValue = parseFloat(value.toString());
                if (isNaN(numValue)) {
                  return `${field.label} must be a valid number`;
                }
              }
            }
            
            return true;
          }
        }}
        render={({ field: formField, fieldState }) => (
          <FormItem>
            <FormLabel>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </FormLabel>
            <FormControl>
              {(field.type === 'number') ? (
                <Input
                  type="number"
                  placeholder={field.placeholder}
                  {...formField}
                  value={formField.value ?? ''}
                  onChange={(e) => formField.onChange(e.target.value)}
                  step="0.1"
                  min={0}
                  className={
                    fieldState.error || 
                    (isSubmitAttempted && field.required && (!formField.value || formField.value.toString().trim() === ''))
                    ? 'border-red-500 focus:border-red-500' : ''
                  }
                />
              ) : (
                <Input
                  placeholder={field.placeholder}
                  {...formField}
                  value={formField.value ?? ''}
                  className={
                    fieldState.error || 
                    (isSubmitAttempted && field.required && (!formField.value || formField.value.toString().trim() === ''))
                    ? 'border-red-500 focus:border-red-500' : ''
                  }
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
          <form onSubmit={form.handleSubmit(onSubmit, onInvalidSubmit)} className="space-y-6">
            {/* Category Selection - only show in create mode */}
            {!isEditing && (
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
            )}

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
                  rules={{
                    required: "Product title is required",
                    validate: (value) => {
                      if (!value || value.trim() === '') {
                        return "Product title cannot be empty";
                      }
                      return true;
                    }
                  }}
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Product Title *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter product title" 
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
                  control={form.control}
                  name="asin"
                  rules={{
                    required: "ASIN is required",
                    validate: (value) => {
                      if (!value || value.trim() === '') {
                        return "ASIN is required";
                      }
                      if (value.length < 10 || value.length > 12) {
                        return "ASIN must be between 10 and 12 characters";
                      }
                      return true;
                    }
                  }}
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>ASIN *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Amazon Standard Identification Number" 
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
                  control={form.control}
                  name="price"
                  rules={{
                    validate: (value) => {
                      if (value && value.toString().trim() !== '') {
                        const priceValue = parseFloat(value.toString());
                        if (isNaN(priceValue) || priceValue < 0) {
                          return "Price must be a valid positive number";
                        }
                      }
                      return true;
                    }
                  }}
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Price ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min={0}
                          placeholder="0.00"
                          {...field}
                          value={field.value ?? ''}
                          onChange={(e) => field.onChange(e.target.value)}
                          className={fieldState.error ? 'border-red-500 focus:border-red-500' : ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="rating"
                  rules={{
                    validate: (value) => {
                      if (value && value.toString().trim() !== '') {
                        const ratingValue = parseFloat(value.toString());
                        if (isNaN(ratingValue) || ratingValue < 0 || ratingValue > 5) {
                          return "Rating must be a number between 0 and 5";
                        }
                      }
                      return true;
                    }
                  }}
                  render={({ field, fieldState }) => (
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
                          value={field.value ?? ''}
                          onChange={(e) => field.onChange(e.target.value)}
                          className={fieldState.error ? 'border-red-500 focus:border-red-500' : ''}
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