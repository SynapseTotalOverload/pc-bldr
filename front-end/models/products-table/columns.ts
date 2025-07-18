import { CPU, CPUCooler, GPU, Motherboard, PowerSupply, ProductAttrs, ProductRead, ProductTypeMapIds, RAM, Storage, Case } from '@/types/prodcuts-base';
import { ColumnDef } from '@tanstack/react-table';

function isCPU(attrs: ProductAttrs | null | undefined, categoryId?: number): attrs is CPU {
  return categoryId === 1;
}

function isCPUCooler(attrs: ProductAttrs | null | undefined, categoryId?: number): attrs is CPUCooler {
  return categoryId === 2;
}

function isGPU(attrs: ProductAttrs | null | undefined, categoryId?: number): attrs is GPU {
  return categoryId === 3;
}

function isRAM(attrs: ProductAttrs | null | undefined, categoryId?: number): attrs is RAM {
  return categoryId === 5;
}

function isMotherboard(attrs: ProductAttrs | null | undefined, categoryId?: number): attrs is Motherboard {
  return categoryId === 4;
}

function isStorage(attrs: ProductAttrs | null | undefined, categoryId?: number): attrs is Storage {
  return categoryId === 6;
}

function isPSU(attrs: ProductAttrs | null | undefined, categoryId?: number): attrs is PowerSupply {
  return categoryId === 7;
}

function isCase(attrs: ProductAttrs | null | undefined, categoryId?: number): attrs is Case {
  return categoryId === 8;
}



export const categoryColumnExtensions: {
  [K in keyof ProductTypeMapIds]?: ColumnDef<ProductRead>[];
} = {
  CPU: [
    {
      header: 'Brand',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isCPU(attrs, categoryId) && attrs ? attrs.brand : '—';
      },
    },
    {
      header: 'Model',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isCPU(attrs, categoryId) && attrs ? attrs.model : '—';
      },
    },
    {
      header: 'Core Count',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isCPU(attrs, categoryId) && attrs ? attrs.cores : '—';
      },
    },
    {
      header: 'Thread Count',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isCPU(attrs, categoryId) && attrs ? attrs.threads : '—';
      },
    },
    {
      header: 'Socket Type',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isCPU(attrs, categoryId) && attrs ? attrs.socket_type : '—';
      },
    },
    {
      header: 'Base Clock',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isCPU(attrs, categoryId) && attrs ? attrs.base_speed : '—';
      },
    },
    {
      header: 'Boost Clock',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isCPU(attrs, categoryId) && attrs ? attrs.turbo_speed : '—';
      },
    },
    {
      header: 'Architecture',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isCPU(attrs, categoryId) && attrs ? attrs.architechture : '—';
      },
    },
    {
      header: 'Core Family',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isCPU(attrs, categoryId) && attrs ? attrs.core_family : '—';
      },
    },
    {
      header: 'Generation',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isCPU(attrs, categoryId) && attrs ? attrs.generation : '—';
      },
    },
    {
      header: 'Series',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isCPU(attrs, categoryId) && attrs ? attrs.series : '—';
      },
    },
    {
      header: 'Integrated Graphics',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isCPU(attrs, categoryId) && attrs ? attrs.integrated_graphics : '—';
      },
    },
    {
      header: 'Memory Type',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isCPU(attrs, categoryId) && attrs ? attrs.memory_type : '—';
      },
    },
    {
      header: 'Memory Speed',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isCPU(attrs, categoryId) && attrs ? attrs.memory_speed : '—';
      },
    },
  ],
  CPU_COOLER: [
    {
      header: 'Brand',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isCPUCooler(attrs, categoryId) && attrs ? attrs.brand : '—';
      },
    },
    {
      header: 'Model',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isCPUCooler(attrs, categoryId) && attrs ? attrs.model : '—';
      },
    },
    {
      header: 'Fan RPM Base',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isCPUCooler(attrs, categoryId) && attrs ? attrs.fan_rpm_base : '—';
      },
    },
    {
      header: 'Fan RPM Max',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isCPUCooler(attrs, categoryId) && attrs ? attrs.fan_rpm_max : '—';
      },
    },
    {
      header: 'Noise Level Base',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isCPUCooler(attrs, categoryId) && attrs ? attrs.noise_level_base : '—';
      },
    },
    {
      header: 'Noise Level Max',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isCPUCooler(attrs, categoryId) && attrs ? attrs.noise_level_max : '—';
      },
    },
    {
      header: 'Color',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isCPUCooler(attrs, categoryId) && attrs ? attrs.color : '—';
      },
    },
  ],
  GPU: [
    {
      header: 'Brand',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isGPU(attrs, categoryId) && attrs ? attrs.brand : '—';
      },
    },
    {
      header: 'Model',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isGPU(attrs, categoryId) && attrs ? attrs.model : '—';
      },
    },
    {
      header: 'Memory',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isGPU(attrs, categoryId) && attrs ? attrs.memory : '—';
      },
    },
    {
      header: 'Memory Interface',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isGPU(attrs, categoryId) && attrs ? attrs.mem_interface : '—';
      },
    },
    {
      header: 'Length',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isGPU(attrs, categoryId) && attrs ? attrs.length : '—';
      },
    },
    {
      header: 'Interface',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isGPU(attrs, categoryId) && attrs ? attrs.interface : '—';
      },
    },
    {
      header: 'Chipset',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isGPU(attrs, categoryId) && attrs ? attrs.chipset : '—';
      },
    },
    {
      header: 'Base Clock',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isGPU(attrs, categoryId) && attrs ? attrs.base_clock : '—';
      },
    },
    {
      header: 'Clock Speed',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isGPU(attrs, categoryId) && attrs ? attrs.clock_speed : '—';
      },
    },
    {
      header: 'Frame Sync',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isGPU(attrs, categoryId) && attrs ? attrs.frame_sync : '—';
      },
    },
  ],
  RAM: [
    {
      header: 'Brand',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isRAM(attrs, categoryId) && attrs ? attrs.brand : '—';
      },
    },
    {
      header: 'Model',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isRAM(attrs, categoryId) && attrs ? attrs.model : '—';
      },
    },
    {
      header: 'Total Memory',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isRAM(attrs, categoryId) && attrs ? attrs.total_memory : '—';
      },
    },
    {
      header: 'One Unit Memory',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isRAM(attrs, categoryId) && attrs ? attrs.one_unit_memory : '—';
      },
    },
    {
      header: 'Quantity',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isRAM(attrs, categoryId) && attrs ? attrs.quantity : '—';
      },
    },
    {
      header: 'RAM Speed',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isRAM(attrs, categoryId) && attrs ? attrs.ram_speed : '—';
      },
    },
    {
      header: 'RAM Type',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isRAM(attrs, categoryId) && attrs ? attrs.ram_type : '—';
      },
    },
    {
      header: 'CAS Latency',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isRAM(attrs, categoryId) && attrs ? attrs.cas_latency : '—';
      },
    },
  ],
  MOTHERBOARD: [
    {
      header: 'Brand',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isMotherboard(attrs, categoryId) && attrs ? attrs.brand : '—';
      },
    },
    {
      header: 'Model',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isMotherboard(attrs, categoryId) && attrs ? attrs.model : '—';
      },
    },
    {
      header: 'Socket Type',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isMotherboard(attrs, categoryId) && attrs ? attrs.socket_type : '—';
      },
    },
    {
      header: 'Chipset',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isMotherboard(attrs, categoryId) && attrs ? attrs.chipset : '—';
      },
    },
    {
      header: 'Form Factor',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isMotherboard(attrs, categoryId) && attrs ? attrs.form_factor : '—';
      },
    },
    {
      header: 'RAM Slots',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isMotherboard(attrs, categoryId) && attrs ? attrs.ram_slots : '—';
      },
    },
    {
      header: 'Max RAM Support',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isMotherboard(attrs, categoryId) && attrs ? attrs.max_ram_support : '—';
      },
    },
  ],
  ROM: [
    {
      header: 'Brand',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isStorage(attrs, categoryId) && attrs ? attrs.brand : '—';
      },
    },
    {
      header: 'Model',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isStorage(attrs, categoryId) && attrs ? attrs.model : '—';
      },
    },
    {
      header: 'Capacity',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isStorage(attrs, categoryId) && attrs ? attrs.capacity : '—';
      },
    },
    {
      header: 'Memory Type',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isStorage(attrs, categoryId) && attrs ? attrs.mem_type : '—';
      },
    },
    {
      header: 'Form Factor',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isStorage(attrs, categoryId) && attrs ? attrs.form_factor : '—';
      },
    },
    {
      header: 'Interface',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isStorage(attrs, categoryId) && attrs ? attrs.interface : '—';
      },
    },
    {
      header: 'Cache Memory',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isStorage(attrs, categoryId) && attrs ? attrs.cache_mem : '—';
      },
    },
  ],
  PSU: [
    {
      header: 'Brand',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isPSU(attrs, categoryId) && attrs ? attrs.brand : '—';
      },
    },
    {
      header: 'Model',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isPSU(attrs, categoryId) && attrs ? attrs.model : '—';
      },
    },
    {
      header: 'Wattage',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isPSU(attrs, categoryId) && attrs ? attrs.power : '—';
      },
    },
    {
      header: 'Efficiency',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isPSU(attrs, categoryId) && attrs ? attrs.efficiency : '—';
      },
    },
    {
      header: 'Color',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isPSU(attrs, categoryId) && attrs ? attrs.color : '—';
      },
    },
  ],
  CASE: [
    {
      header: 'Brand',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isCase(attrs, categoryId) && attrs ? attrs.brand : '—';
      },
    },
    {
      header: 'Model',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isCase(attrs, categoryId) && attrs ? attrs.model : '—';
      },
    },
    {
      header: 'Side Panel',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isCase(attrs, categoryId) && attrs ? attrs.side_panel : '—';
      },
    },
    {
      header: 'Cabinet Type',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isCase(attrs, categoryId) && attrs ? attrs.cabinet_type : '—';
      },
    },
    {
      header: 'Color',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isCase(attrs, categoryId) && attrs ? attrs.color : '—';
      },
    },
  ]
};
