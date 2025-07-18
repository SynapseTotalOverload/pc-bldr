'use client';

import { useState, useEffect, useMemo } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { useSelectCpu } from '@/hooks/select/use-select-cpu';
import { useSelectCpuCooler } from '@/hooks/select/use-select-cpu-cooler';
import { useSelectMotherboard } from '@/hooks/select/use-select-motherboard';
import { useSelectMemory } from '@/hooks/select/use-select-memory';
import { useSelectStorage } from '@/hooks/select/use-select-storage';
import { useSelectVideoCard } from '@/hooks/select/use-select-video-card';
import { SelectProductBuilds } from '@/components/ui/select-product-builds';
import { useSelectPowerSupply } from '@/hooks/select/use-select-power-supply';
import { useSelectCase } from '@/hooks/select/use-select-case';
import { BUDGET_STEP, MAX_BUDGET, MIN_BUDGET } from '../configurator/constants';
import { LiquidGlassInput } from '../configurator/components/LiquidGlassInput';

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
    cpu_cooler_id: '',
    motherboard_id: '',
    memory_id: '',
    storage_id: '',
    power_supply_id: '',
    case_id: '',
    video_card_id: '',
    show_in_site: true,
  });

  // Create selected components object for compatibility filtering
  const selectedComponents = useMemo(() => ({
    ...(formData.cpu_id && formData.cpu_id !== '' && formData.cpu_id !== 'none' && { cpu: parseInt(formData.cpu_id) }),
    ...(formData.cpu_cooler_id && formData.cpu_cooler_id !== '' && formData.cpu_cooler_id !== 'none' && { cpu_cooler: parseInt(formData.cpu_cooler_id) }),
    ...(formData.motherboard_id && formData.motherboard_id !== '' && formData.motherboard_id !== 'none' && { motherboard: parseInt(formData.motherboard_id) }),
    ...(formData.memory_id && formData.memory_id !== '' && formData.memory_id !== 'none' && { ram: parseInt(formData.memory_id) }),
    ...(formData.storage_id && formData.storage_id !== '' && formData.storage_id !== 'none' && { storage: parseInt(formData.storage_id) }),
    ...(formData.video_card_id && formData.video_card_id !== '' && formData.video_card_id !== 'none' && { gpu: parseInt(formData.video_card_id) }),
    ...(formData.power_supply_id && formData.power_supply_id !== '' && formData.power_supply_id !== 'none' && { psu: parseInt(formData.power_supply_id) }),
    ...(formData.case_id && formData.case_id !== '' && formData.case_id !== 'none' && { case: parseInt(formData.case_id) }),
  }), [formData.cpu_id, formData.cpu_cooler_id, formData.motherboard_id, formData.memory_id, formData.storage_id, formData.video_card_id, formData.power_supply_id, formData.case_id]);
  
  const {
    cpuSearch,
    setCpuSearch,
    hasMoreCpu,
    filteredCpuProducts,
    cpuLoading,
    loadMoreCpus,
    initializeCpuData,
  } = useSelectCpu(selectedComponents);

  const {
    cpuCoolerSearch,
    setCpuCoolerSearch,
    hasMoreCpuCooler,
    filteredCpuCoolerProducts,
    cpuCoolerLoading,
    loadMoreCpuCoolers,
    resetCpuCoolerData,
    initializeCpuCoolerData,
  } = useSelectCpuCooler(selectedComponents);

  const {
    motherboardSearch,
    setMotherboardSearch,
    hasMoreMotherboard,
    filteredMotherboardProducts,
    motherboardLoading,
    loadMoreMotherboards,
    resetMotherboardData,
    initializeMotherboardData,
  } = useSelectMotherboard(selectedComponents);

  const {
    memorySearch,
    setMemorySearch,
    hasMoreMemory,
    filteredMemoryProducts,
    memoryLoading,
    loadMoreMemories,
    resetMemoryData,
    initializeMemoryData,
  } = useSelectMemory(selectedComponents);

  const {
    storageSearch,
    setStorageSearch,
    hasMoreStorage,
    filteredStorageProducts,
    storageLoading,
    loadMoreStorages,
    resetStorageData,
    initializeStorageData,
  } = useSelectStorage(selectedComponents);

  const {
    videoCardSearch,
    setVideoCardSearch,
    hasMoreVideoCard,
    filteredVideoCardProducts,
    videoCardLoading,
    loadMoreVideoCards,
    resetVideoCardData,
    initializeVideoCardData,
  } = useSelectVideoCard(selectedComponents);

  const {
    powerSupplySearch,
    setPowerSupplySearch,
    hasMorePowerSupply,
    filteredPowerSupplyProducts,
    powerSupplyLoading,
    loadMorePowerSupplies,
    resetPowerSupplyData,
    initializePowerSupplyData,
  } = useSelectPowerSupply(selectedComponents);

  const {
    caseSearch,
    setCaseSearch,
    hasMoreCase,
    filteredCaseProducts,
    caseLoading,
    loadMoreCases,
    resetCaseData,
    initializeCaseData,
  } = useSelectCase(selectedComponents);

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
        cpu_id: build.cpu?.id?.toString() || 'none',
        cpu_cooler_id: build.cpu_cooler?.id?.toString() || 'none',
        motherboard_id: build.motherboard?.id?.toString() || 'none',
        memory_id: build.ram?.id?.toString() || 'none',
        storage_id: build.storage?.id?.toString() || 'none',
        power_supply_id: build.psu?.id?.toString() || 'none',
        case_id: build.case?.id?.toString() || 'none',
        video_card_id: build.gpu?.id?.toString() || 'none',
        show_in_site: build.show_in_site ?? true,
      });
    } else {
      setFormData({
        name: '',
        build_type: '',
        build_price: '',
        cpu_id: 'none',
        cpu_cooler_id: 'none',
        motherboard_id: 'none',
        memory_id: 'none',
        storage_id: 'none',
        power_supply_id: 'none',
        case_id: 'none',
        video_card_id: 'none',
        show_in_site: true,
      });
    }
    setErrors({});
  }, [build, open]);

  // No automatic initialization for edit mode - keep lazy loading
  // Data will be loaded only when user opens specific select (onInitializeData)
  // Selected products will be shown at the top using selectedProduct prop

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
        "name": formData.name.trim(),
        "build_type": formData.build_type || undefined,
        "build_price": formData.build_price ? parseFloat(formData.build_price) : undefined,
        "cpu_id": (formData.cpu_id && formData.cpu_id !== 'none') ? parseInt(formData.cpu_id) : null,
        "cpu_cooler_id": (formData.cpu_cooler_id && formData.cpu_cooler_id !== 'none') ? parseInt(formData.cpu_cooler_id) : null,
        "gpu_id": (formData.video_card_id && formData.video_card_id !== 'none') ? parseInt(formData.video_card_id) : null,
        "motherboard_id": (formData.motherboard_id && formData.motherboard_id !== 'none') ? parseInt(formData.motherboard_id) : null,
        "ram_id": (formData.memory_id && formData.memory_id !== 'none') ? parseInt(formData.memory_id) : null,
        "storage_id": (formData.storage_id && formData.storage_id !== 'none') ? parseInt(formData.storage_id) : null,
        "psu_id": (formData.power_supply_id && formData.power_supply_id !== 'none') ? parseInt(formData.power_supply_id) : null,
        "case_id": (formData.case_id && formData.case_id !== 'none') ? parseInt(formData.case_id) : null,
        ...(isEditing && { "show_in_site": formData.show_in_site })
      };

      console.log("submitData", submitData);

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
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Build' : 'Create New Build'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Make changes to your build here.' : 'Fill in the details to create a new build.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-4">
              <Label htmlFor="name" className="text-left">
                Name
              </Label>
              <div className="w-full">
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
            <div className="flex items-center gap-4">
              <Label htmlFor="build_type" className="text-left">
                Type
              </Label>
              <div className="w-full">
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

            {/* Product Selection Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* CPU */}
              <SelectProductBuilds
                label="CPU"
                fieldId="cpu_id"
                value={formData.cpu_id}
                onValueChange={(value) => handleInputChange('cpu_id', value)}
                search={cpuSearch}
                onSearchChange={setCpuSearch}
                products={filteredCpuProducts}
                loading={cpuLoading}
                hasMore={hasMoreCpu}
                onLoadMore={loadMoreCpus}
                placeholder="Select CPU"
                searchPlaceholder="Search CPUs"
                onInitializeData={initializeCpuData}
                selectedProduct={build?.cpu || null}
              />

              {/* CPU Cooler */}
              <SelectProductBuilds
                label="CPU Cooler"
                fieldId="cpu_cooler_id"
                value={formData.cpu_cooler_id}
                onValueChange={(value) => handleInputChange('cpu_cooler_id', value)}
                search={cpuCoolerSearch}
                onSearchChange={setCpuCoolerSearch}
                products={filteredCpuCoolerProducts}
                loading={cpuCoolerLoading}
                hasMore={hasMoreCpuCooler}
                onLoadMore={loadMoreCpuCoolers}
                placeholder="Select CPU Cooler"
                searchPlaceholder="Search CPU Coolers"
                onInitializeData={initializeCpuCoolerData}
                selectedProduct={build?.cpu_cooler || null}
              />

              {/* Motherboard */}
              <SelectProductBuilds
                label="Motherboard"
                fieldId="motherboard_id"
                value={formData.motherboard_id}
                onValueChange={(value) => handleInputChange('motherboard_id', value)}
                search={motherboardSearch}
                onSearchChange={setMotherboardSearch}
                products={filteredMotherboardProducts}
                loading={motherboardLoading}
                hasMore={hasMoreMotherboard}
                onLoadMore={loadMoreMotherboards}
                placeholder="Select Motherboard"
                searchPlaceholder="Search Motherboards"
                onInitializeData={initializeMotherboardData}
                selectedProduct={build?.motherboard || null}
              />

              {/* Memory */}
              <SelectProductBuilds
                label="Memory"
                fieldId="memory_id"
                value={formData.memory_id}
                onValueChange={(value) => handleInputChange('memory_id', value)}
                search={memorySearch}
                onSearchChange={setMemorySearch}
                products={filteredMemoryProducts}
                loading={memoryLoading}
                hasMore={hasMoreMemory}
                onLoadMore={loadMoreMemories}
                placeholder="Select Memory"
                searchPlaceholder="Search Memory"
                onInitializeData={initializeMemoryData}
                selectedProduct={build?.ram || null}
              />

              {/* Storage */}
              <SelectProductBuilds
                label="Storage"
                fieldId="storage_id"
                value={formData.storage_id}
                onValueChange={(value) => handleInputChange('storage_id', value)}
                search={storageSearch}
                onSearchChange={setStorageSearch}
                products={filteredStorageProducts}
                loading={storageLoading}
                hasMore={hasMoreStorage}
                onLoadMore={loadMoreStorages}
                placeholder="Select Storage"
                searchPlaceholder="Search Storage"
                onInitializeData={initializeStorageData}
                selectedProduct={build?.storage || null}
              />

              {/* Video Card */}
              <SelectProductBuilds
                label="Video Card"
                fieldId="video_card_id"
                value={formData.video_card_id}
                onValueChange={(value) => handleInputChange('video_card_id', value)}
                search={videoCardSearch}
                onSearchChange={setVideoCardSearch}
                products={filteredVideoCardProducts}
                loading={videoCardLoading}
                hasMore={hasMoreVideoCard}
                onLoadMore={loadMoreVideoCards}
                placeholder="Select Video Card"
                searchPlaceholder="Search Video Cards"
                onInitializeData={initializeVideoCardData}
                selectedProduct={build?.gpu || null}
              />

              {/* Power Supply */}
              <SelectProductBuilds
                label="Power Supply"
                fieldId="power_supply_id"
                value={formData.power_supply_id}
                onValueChange={(value) => handleInputChange('power_supply_id', value)}
                search={powerSupplySearch}
                onSearchChange={setPowerSupplySearch}
                products={filteredPowerSupplyProducts}
                loading={powerSupplyLoading}
                hasMore={hasMorePowerSupply}
                onLoadMore={loadMorePowerSupplies}
                placeholder="Select Power Supply"
                searchPlaceholder="Search Power Supplies"
                onInitializeData={initializePowerSupplyData}
                selectedProduct={build?.psu || null}
              />

              {/* Case */}
              <SelectProductBuilds
                label="Case"
                fieldId="case_id"
                value={formData.case_id}
                onValueChange={(value) => handleInputChange('case_id', value)}
                search={caseSearch}
                onSearchChange={setCaseSearch}
                products={filteredCaseProducts}
                loading={caseLoading}
                hasMore={hasMoreCase}
                onLoadMore={loadMoreCases}
                placeholder="Select Case"
                searchPlaceholder="Search Cases"
                onInitializeData={initializeCaseData}
                selectedProduct={build?.case || null}
              />
            </div>

            <div className="grid grid-cols-2 items-center gap-4">
              <Label htmlFor="build_price" className="text-left">
                Build Price
              </Label>
              <div className="col-span-3">
                <LiquidGlassInput
                  value={Number(formData.build_price)}
                  min={MIN_BUDGET}
                  max={MAX_BUDGET}
                  step={BUDGET_STEP}
                    onChange={(v) => handleInputChange('build_price', v.toString())}
                  formatValue={(v) => `$${v.toLocaleString()}`}
                  className="mt-4"
                />
                <Input
                  id="build_price"
                  type="number"
                  step="1"
                  min="0"
                  value={formData.build_price}
                  onChange={(e) => handleInputChange('build_price', e.target.value)}
                  placeholder="Enter total price"
                  className={errors.build_price ? 'border-red-500' : ''}
                />
                {errors.build_price && <p className="mt-1 text-sm text-red-500">{errors.build_price}</p>}
              </div>
            </div>

            {/* Show in Site checkbox - only visible during edit mode */}
            {isEditing && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="show_in_site" className="text-right">
                  Show on Site
                </Label>
                <div className="col-span-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="show_in_site"
                      checked={formData.show_in_site}
                      onCheckedChange={(checked) => {
                        setFormData((prev) => ({ ...prev, show_in_site: checked as boolean }));
                      }}
                    />
                    <Label htmlFor="show_in_site" className="text-sm font-normal">
                      Display this build on the public website
                    </Label>
                  </div>
                </div>
              </div>
            )}
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
