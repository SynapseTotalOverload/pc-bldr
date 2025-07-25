import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { FrontendToBackendCategoryIdMap, ProductRead } from '../types';
import { DataTable } from '@/components/ui/configurator/data-table';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/configurator/tooltip';
import { Info } from 'lucide-react';

export function PartsList({ parts, loading, error }: { parts: ProductRead[]; loading: boolean; error: string | null }) {

   // Function to generate tooltip content based on component attributes
   const generateTooltipContent = (part: ProductRead) => {
    const attrs = part.attrs;
    const categoryId = part.category?.id;
    
    if (!attrs) return 'No additional information available';
    
    const details: string[] = [];
    
    // CPU attributes
    if (categoryId === 1) {
      const cpuAttrs = attrs as any;
      details.push(`Cores: ${cpuAttrs.cores}`);
      if (cpuAttrs.threads) details.push(`Threads: ${cpuAttrs.threads}`);
      if (cpuAttrs.socket_type) details.push(`Socket: ${cpuAttrs.socket_type}`);
      if (cpuAttrs.base_speed) details.push(`Base Speed: ${cpuAttrs.base_speed}`);
      if (cpuAttrs.turbo_speed) details.push(`Turbo Speed: ${cpuAttrs.turbo_speed}`);
      if (cpuAttrs.architechture) details.push(`Architecture: ${cpuAttrs.architechture}`);
      if (cpuAttrs.tdp) details.push(`TDP: ${cpuAttrs.tdp}`);
      if (cpuAttrs.core_family) details.push(`Core Family: ${cpuAttrs.core_family}`);
      if (cpuAttrs.generation) details.push(`Generation: ${cpuAttrs.generation}`);
      if (cpuAttrs.integrated_graphics) details.push(`Integrated Graphics: ${cpuAttrs.integrated_graphics}`);
      if (cpuAttrs.memory_speed) details.push(`Memory Speed: ${cpuAttrs.memory_speed}`);
      if (cpuAttrs.memory_type) details.push(`Memory Type: ${cpuAttrs.memory_type}`);
      if (cpuAttrs.series) details.push(`Series: ${cpuAttrs.series}`);
    }
    
    // GPU attributes
    else if (categoryId === 3) {
      const gpuAttrs = attrs as any;
      details.push(`Memory: ${gpuAttrs.memory}`);
      if (gpuAttrs.boost_clock) details.push(`Boost Clock: ${gpuAttrs.boost_clock}`);
      if (gpuAttrs.base_clock) details.push(`Base Clock: ${gpuAttrs.base_clock}`);
      if (gpuAttrs.chipset) details.push(`Chipset: ${gpuAttrs.chipset}`);
      if (gpuAttrs.clock_speed) details.push(`Clock Speed: ${gpuAttrs.clock_speed}`);
      if (gpuAttrs.frame_sync) details.push(`Frame Sync: ${gpuAttrs.frame_sync}`);
      if (gpuAttrs.interface) details.push(`Interface: ${gpuAttrs.interface}`);
      if (gpuAttrs.length) details.push(`Length: ${gpuAttrs.length}`);
      if (gpuAttrs.mem_interface) details.push(`Memory Interface: ${gpuAttrs.mem_interface}`);
    }
    
    // RAM attributes
    else if (categoryId === 5) {
      const ramAttrs = attrs as any;
      if (ramAttrs.total_memory) details.push(`Total Memory: ${ramAttrs.total_memory}`);
      if (ramAttrs.one_unit_memory) details.push(`Unit Memory: ${ramAttrs.one_unit_memory}`);
      if (ramAttrs.quantity) details.push(`Quantity: ${ramAttrs.quantity}`);
      if (ramAttrs.ram_speed) details.push(`RAM Speed: ${ramAttrs.ram_speed}`);
      if (ramAttrs.ram_type) details.push(`RAM Type: ${ramAttrs.ram_type}`);
      if (ramAttrs.cas_latency) details.push(`CAS Latency: ${ramAttrs.cas_latency}`);
    }
    
    // Motherboard attributes
    else if (categoryId === 4) {
      const mbAttrs = attrs as any;
      details.push(`Socket: ${mbAttrs.socket_type}`);
      if (mbAttrs.chipset) details.push(`Chipset: ${mbAttrs.chipset}`);
      if (mbAttrs.form_factor) details.push(`Form Factor: ${mbAttrs.form_factor}`);
      if (mbAttrs.ram_slots) details.push(`RAM Slots: ${mbAttrs.ram_slots}`);
      if (mbAttrs.socket_type) details.push(`Max RAM Support: ${mbAttrs.max_ram_support}`);
    }
    
    // Storage attributes
    else if (categoryId === 6) {
      const storageAttrs = attrs as any;
      details.push(`Capacity: ${storageAttrs.capacity}`);
      if (storageAttrs.interface) details.push(`Interface: ${storageAttrs.interface}`);
      if (storageAttrs.mem_type) details.push(`Memory Type: ${storageAttrs.mem_type}`);
      if (storageAttrs.cache_mem) details.push(`Cache Memory: ${storageAttrs.cache_mem}`);
      if (storageAttrs.form_factor) details.push(`Form Factor: ${storageAttrs.form_factor}`);
    }
    
    // PSU attributes
    else if (categoryId === 7) {
      const psuAttrs = attrs as any;
      if (psuAttrs.efficiency) details.push(`Efficiency: ${psuAttrs.efficiency}`);
      if (psuAttrs.color) details.push(`Color: ${psuAttrs.color}`);
      if (psuAttrs.power) details.push(`Power: ${psuAttrs.power}`);
    }
    
    // Case attributes
    else if (categoryId === 8) {
      const caseAttrs = attrs as any;
      if (caseAttrs.side_panel) details.push(`Side Panel: ${caseAttrs.side_panel}`);
      if (caseAttrs.cabinet_type) details.push(`Cabinet Type: ${caseAttrs.cabinet_type}`);
      if (caseAttrs.color) details.push(`Color: ${caseAttrs.color}`);
    }
    
    // CPU Cooler attributes
    else if (categoryId === 2) {
      const coolerAttrs = attrs as any;
      if (coolerAttrs.color) details.push(`Color: ${coolerAttrs.color}`);
      if (coolerAttrs.fan_rpm_base) details.push(`Fan RPM Base: ${coolerAttrs.fan_rpm_base}`);
      if (coolerAttrs.fan_rpm_max) details.push(`Fan RPM Max: ${coolerAttrs.fan_rpm_max}`);
      if (coolerAttrs.noise_level_base) details.push(`Noise Level Base: ${coolerAttrs.noise_level_base}`);
      if (coolerAttrs.noise_level_max) details.push(`Noise Level Max: ${coolerAttrs.noise_level_max}`);
    }
    
    return details.length > 0 ? details.join('\n') : 'No additional information available';
  };


  const columns: ColumnDef<ProductRead>[] = [
    {
      header: 'Component',
      accessorKey: 'title',
      cell: ({ row }) => {
        const part = row.original;
        const imageUrl = part?.low_image_url || part?.high_image_url;
        
        return (
          <div className="flex items-center gap-3">
            {imageUrl && (
              <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0">
                <img 
                  src={imageUrl} 
                  alt={part.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
            <div className="flex items-center gap-2">
              <div className="">
                {part.attrs.brand} | {part.attrs.model}
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs whitespace-pre-line">
                  <p>{generateTooltipContent(part)}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        );
      },
    },
    {
      header: 'Category',
      accessorKey: 'category',
      cell: ({ row }) => {
        return <span className="text-foreground">{FrontendToBackendCategoryIdMap[row.original.category?.id as unknown as keyof typeof FrontendToBackendCategoryIdMap]}</span>;
      },
    },
    {
      header: 'Price',
      accessorKey: 'price',
      cell: ({ row }) => {
        return <span className="text-foreground font-medium">${row.original.price?.toString() || '0'}</span>;
      },
    },
  ];
 
  if (loading) {
    return (
      <Card className="h-fit w-fullmin-w-xl max-w-xl p-6 rounded-xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-lg font-semibold">PC Parts</div>
        </div>
        <div className="flex flex-col gap-2">
          {[...Array(parts.length || 5)].map((_, index) => (
            <Skeleton key={index} className="h-[72px] w-full rounded-xl" />
          ))}
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-fit w-full min-w-xl max-w-xl p-6 rounded-xl">
        <div className="text-red-500">Error: {error}</div>
      </Card>
    );
  }
 
  return (
    <TooltipProvider>
      <Card className="h-fit w-full p-6 rounded-xl min-w-xl max-w-xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-lg font-semibold">PC Parts</div>
        </div>
        <DataTable
          columns={columns}
          data={parts}
        />
      </Card>
    </TooltipProvider>
  );
}
