import { ProductRead, ProductTypeMapNames } from '@/types/prodcuts-base';
import { ColumnDef } from '@tanstack/react-table';

export const categoryColumnExtensions: {
  [K in keyof ProductTypeMapNames]?: ColumnDef<ProductRead>[];
} = {
  cpu: [
    {
      header: 'Core Count',
      accessorFn: (row) => row.attrs.cores,
    },
    {
      header: 'Base Clock',
      accessorFn: (row) => row.attrs.base_speed,
    },
    {
      header: 'Boost Clock',
      accessorFn: (row) => row.attrs.turbo_speed,
    },
  ],
  cpu_cooler: [
    {
      header: 'Fan RPM Max',
      accessorFn: (row) => row.attrs.fan_rpm_max,
    },
    {
      header: 'Noise Level Max',
      accessorFn: (row) => row.attrs.noise_level_max,
    },
    {
      header: 'Color',
      accessorFn: (row) => row.attrs.color,
    },
  ],
  gpu: [
    {
      header: 'Memory',
      accessorFn: (row) => row.attrs.memory,
    },
    {
      header: 'Chipset',
      accessorFn: (row) => row.attrs.chipset,
    },
    {
      header: 'Core Clock',
      accessorFn: (row) => row.attrs.base_clock,
    },
  ],
  memory: [
    {
      header: 'Total Memory',
      accessorFn: (row) => row.attrs.total_memory,
    },
    {
      header: 'RAM Speed',
      accessorFn: (row) => row.attrs.ram_speed,
    },
    {
      header: 'RAM Type',
      accessorFn: (row) => row.attrs.ram_type,
    },
  ],
  motherboard: [
    {
      header: 'Socket',
      accessorFn: (row) => row.attrs.socket_type,
    },
    {
      header: 'Chipset',
      accessorFn: (row) => row.attrs.chipset,
    },
    {
      header: 'Form Factor',
      accessorFn: (row) => row.attrs.form_factor,
    },
    {
      header: 'Memory Slots',
      accessorFn: (row) => row.attrs.ram_slots,
    },
  ],
  internal_hard_drive: [
    {
      header: 'Capacity',
      accessorFn: (row) => row.attrs.capacity,
    },
    {
      header: 'Type',
      accessorFn: (row) => row.attrs.mem_type,
    },
    {
      header: 'Cache',
      accessorFn: (row) => row.attrs.cache_mem,
    },
    {
      header: 'Interface',
      accessorFn: (row) => row.attrs.interface,
    },
  ],
  power_supply: [
    {
      header: 'Wattage',
      accessorFn: (row) => row.attrs.power,
    },
    {
      header: 'Efficiency',
      accessorFn: (row) => row.attrs.efficiency,
    },
    {
      header: 'Color',
      accessorFn: (row) => row.attrs.color,
    },
  ],
  video_card: [
    {
      header: 'Memory',
      accessorFn: (row) => row.attrs.memory,
    },
    {
      header: 'Chipset',
      accessorFn: (row) => row.attrs.chipset,
    },
    {
      header: 'Core Clock',
      accessorFn: (row) => row.attrs.base_clock,
    },
  ],
};
