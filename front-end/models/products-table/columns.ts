import { ProductRead, ProductTypeMapIds } from '@/types/prodcuts-base';
import { ColumnDef } from '@tanstack/react-table';

export const categoryColumnExtensions: {
  [K in keyof ProductTypeMapIds]?: ColumnDef<ProductRead>[];
} = {
  CPU: [
    {
      header: 'Core Count',
      accessorFn: (row) => row.attrs.type === 'cpu' ? row.attrs.cores : null,
    },
    {
      header: 'Base Clock',
      accessorFn: (row) => row.attrs.type === 'cpu' ? row.attrs.base_speed : null,
    },
    {
      header: 'Boost Clock',
      accessorFn: (row) => row.attrs.type === 'cpu' ? row.attrs.turbo_speed : null,
    },
  ],
  CPU_COOLER: [
    {
      header: 'Fan RPM Max',
      accessorFn: (row) => row.attrs.type === 'cpu_cooler' ? row.attrs.fan_rpm_max : null,
    },
    {
      header: 'Noise Level Max',
      accessorFn: (row) => row.attrs.type === 'cpu_cooler' ? row.attrs.noise_level_max : null,
    },
    {
      header: 'Color',
      accessorFn: (row) => row.attrs.type === 'cpu_cooler' ? row.attrs.color : null,
    },
  ],
  GPU: [
    {
      header: 'Memory',
      accessorFn: (row) => row.attrs.type === 'gpu' ? row.attrs.memory : null,
    },
    {
      header: 'Chipset',
      accessorFn: (row) => row.attrs.type === 'gpu' ? row.attrs.chipset : null,
    },
    {
      header: 'Core Clock',
      accessorFn: (row) => row.attrs.type === 'gpu' ? row.attrs.base_clock : null,
    },
  ],
  RAM: [
    {
      header: 'Total Memory',
      accessorFn: (row) => row.attrs.type === 'ram' ? row.attrs.total_memory : null,
    },
    {
      header: 'RAM Speed',
      accessorFn: (row) => row.attrs.type === 'ram' ? row.attrs.ram_speed : null,
    },
    {
      header: 'RAM Type',
      accessorFn: (row) => row.attrs.type === 'ram' ? row.attrs.ram_type : null,
    },
  ],
  MOTHERBOARD: [
    {
      header: 'Socket',
      accessorFn: (row) => row.attrs.type === 'motherboard' ? row.attrs.socket_type : null,
    },
    {
      header: 'Chipset',
      accessorFn: (row) => row.attrs.type === 'motherboard' ? row.attrs.chipset : null,
    },
    {
      header: 'Form Factor',
      accessorFn: (row) => row.attrs.type === 'motherboard' ? row.attrs.form_factor : null,
    },
    {
      header: 'Memory Slots',
      accessorFn: (row) => row.attrs.type === 'motherboard' ? row.attrs.ram_slots : null,
    },
  ],
  ROM: [
    {
      header: 'Capacity',
      accessorFn: (row) => row.attrs.type === 'storage' ? row.attrs.capacity : null,
    },
    {
      header: 'Type',
      accessorFn: (row) => row.attrs.type === 'storage' ? row.attrs.mem_type : null,
    },
    {
      header: 'Cache',
      accessorFn: (row) => row.attrs.type === 'storage' ? row.attrs.cache_mem : null,
    },
    {
      header: 'Interface',
      accessorFn: (row) => row.attrs.type === 'storage' ? row.attrs.interface : null,
    },
  ],
  PSU: [
    {
      header: 'Wattage',
      accessorFn: (row) => row.attrs.type === 'power_supply' ? row.attrs.power : null,
    },
    {
      header: 'Efficiency',
      accessorFn: (row) => row.attrs.type === 'power_supply' ? row.attrs.efficiency : null,
    },
    {
      header: 'Color',
      accessorFn: (row) => row.attrs.type === 'power_supply' ? row.attrs.color : null,
    },
  ],
  VIDEO_CARD: [
    {
      header: 'Memory',
      accessorFn: (row) => row.attrs.type === 'gpu' ? row.attrs.memory : null,
    },
    {
      header: 'Chipset',
      accessorFn: (row) => row.attrs.type === 'gpu' ? row.attrs.chipset : null,
    },
    {
      header: 'Core Clock',
      accessorFn: (row) => row.attrs.type === 'gpu' ? row.attrs.base_clock : null,
    },
  ],
};
