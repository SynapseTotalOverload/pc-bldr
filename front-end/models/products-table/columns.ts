import { CPU, CPUCooler, GPU, Motherboard, PowerSupply, ProductAttrs, ProductRead, ProductTypeMapIds, RAM, Storage } from '@/types/prodcuts-base';
import { ColumnDef } from '@tanstack/react-table';

function isCPU(attrs: ProductAttrs): attrs is CPU {
return 'cores' in attrs && 'base_speed' in attrs;
}

function isCPUCooler(attrs: ProductAttrs): attrs is CPUCooler {
  return 'fan_rpm_max' in attrs && 'noise_level_max' in attrs;
}

function isGPU(attrs: ProductAttrs): attrs is GPU {
  return 'memory' in attrs && 'chipset' in attrs && 'base_clock' in attrs;
}

function isRAM(attrs: ProductAttrs): attrs is RAM {
  return 'total_memory' in attrs && 'ram_speed' in attrs && 'ram_type' in attrs;
}

function isMotherboard(attrs: ProductAttrs): attrs is Motherboard {
  return 'socket_type' in attrs && 'chipset' in attrs && 'form_factor' in attrs;
}

function isStorage(attrs: ProductAttrs): attrs is Storage {
  return 'capacity' in attrs && 'mem_type' in attrs && 'interface' in attrs;
}

function isPSU(attrs: ProductAttrs): attrs is PowerSupply {
  return 'power' in attrs && 'efficiency' in attrs;
}



export const categoryColumnExtensions: {
  [K in keyof ProductTypeMapIds]?: ColumnDef<ProductRead>[];
} = {
  CPU: [
    {
      header: 'Brand',
      accessorFn: (row) => isCPU(row.attrs) ? row.attrs.brand : '—',
    },
    {
      header: 'Model',
      accessorFn: (row) => isCPU(row.attrs) ? row.attrs.model : '—',
    },
    {
      header: 'Core Count',
      accessorFn: (row) => isCPU(row.attrs) ? row.attrs.cores : '—',
    },
    {
      header: 'Base Clock',
      accessorFn: (row) => isCPU(row.attrs) ? row.attrs.base_speed : '—',
    },
    {
      header: 'Boost Clock',
      accessorFn: (row) => isCPU(row.attrs) ? row.attrs.turbo_speed : '—',
    },
  ],
  CPU_COOLER: [
    {
      header: 'Brand',
      accessorFn: (row) => isCPUCooler(row.attrs) ? row.attrs.brand : '—',
    },
    {
      header: 'Model',
      accessorFn: (row) => isCPUCooler(row.attrs) ? row.attrs.model : '—',
    },
    {
      header: 'Fan RPM Max',
      accessorFn: (row) => isCPUCooler(row.attrs) ? row.attrs.fan_rpm_max : '—',
    },
    {
      header: 'Noise Level Max',
      accessorFn: (row) => isCPUCooler(row.attrs) ? row.attrs.noise_level_max : '—',
    },
    {
      header: 'Color',
      accessorFn: (row) => isCPUCooler(row.attrs) ? row.attrs.color : '—',
    },
  ],
  GPU: [
    {
      header: 'Memory',
      accessorFn: (row) => isGPU(row.attrs) ? row.attrs.memory : '—',
    },
    {
      header: 'Chipset',
      accessorFn: (row) => isGPU(row.attrs) ? row.attrs.chipset : '—',
    },
    {
      header: 'Core Clock',
      accessorFn: (row) => isGPU(row.attrs) ? row.attrs.base_clock : '—',
    },
  ],
  RAM: [
    {
      header: 'Total Memory',
      accessorFn: (row) => isRAM(row.attrs) ? row.attrs.total_memory : '—',
    },
    {
      header: 'RAM Speed',
      accessorFn: (row) => isRAM(row.attrs) ? row.attrs.ram_speed : '—',
    },
    {
      header: 'RAM Type',
      accessorFn: (row) => isRAM(row.attrs) ? row.attrs.ram_type : '—',
    },
  ],
  MOTHERBOARD: [
    {
      header: 'Socket',
      accessorFn: (row) => isMotherboard(row.attrs) ? row.attrs.socket_type : '—',
    },
    {
      header: 'Chipset',
      accessorFn: (row) => isMotherboard(row.attrs) ? row.attrs.chipset : '—',
    },
    {
      header: 'Form Factor',
      accessorFn: (row) => isMotherboard(row.attrs) ? row.attrs.form_factor : '—',
    },
    {
      header: 'Memory Slots',
      accessorFn: (row) => isMotherboard(row.attrs) ? row.attrs.ram_slots : '—',
    },
  ],
  ROM: [
    {
      header: 'Capacity',
      accessorFn: (row) => isStorage(row.attrs) ? row.attrs.capacity : '—',
    },
    {
      header: 'Type',
      accessorFn: (row) => isStorage(row.attrs) ? row.attrs.mem_type : '—',
    },
    {
      header: 'Cache',
      accessorFn: (row) => isStorage(row.attrs) ? row.attrs.cache_mem : '—',
    },
    {
      header: 'Interface',
      accessorFn: (row) => isStorage(row.attrs) ? row.attrs.interface : '—',
    },
  ],
  PSU: [
    {
      header: 'Wattage',
      accessorFn: (row) => isPSU(row.attrs) ? row.attrs.power : '—',
    },
    {
      header: 'Efficiency',
      accessorFn: (row) => isPSU(row.attrs) ? row.attrs.efficiency : '—',
    },
    {
      header: 'Color',
      accessorFn: (row) => isPSU(row.attrs) ? row.attrs.color : '—',
    },
  ]
};
