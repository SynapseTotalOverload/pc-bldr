import { ProductTypeMap } from '@/types/product';
import { ColumnDef } from '@tanstack/react-table';

export const categoryColumnExtensions: {
  [K in keyof ProductTypeMap]?: ColumnDef<ProductTypeMap[K]>[];
} = {
  cpu: [
    {
      header: 'Core Count',
      accessorKey: 'core_count',
    },
    {
      header: 'Base Clock',
      accessorKey: 'base_clock',
    },
    {
      header: 'Boost Clock',
      accessorKey: 'boost_clock',
    },
  ],
  cpu_cooler: [
    {
      header: 'Airflow',
      accessorKey: 'airflow',
    },
    {
      header: 'Noise Level',
      accessorKey: 'noise_level',
    },
    {
      header: 'RPM',
      accessorKey: 'rpm',
    },
  ],
  gpu: [
    {
      header: 'Airflow',
      accessorKey: 'airflow',
    },
    {
      header: 'Noise Level',
      accessorKey: 'noise_level',
    },
    {
      header: 'RPM',
      accessorKey: 'rpm',
    },
  ],
  memory: [
    {
      header: 'Speed',
      accessorKey: 'speed',
    },
    {
      header: 'Modules',
      accessorKey: 'modules',
    },
    {
      header: 'Price per GB',
      accessorKey: 'price_per_gb',
    },
    {
      header: 'First Word Latency',
      accessorKey: 'first_word_latency',
    },
  ],
  motherboard: [
    {
      header: 'Socket',
      accessorKey: 'socket',
    },
    {
      header: 'Chipset',
      accessorKey: 'chipset',
    },
    {
      header: 'Form Factor',
      accessorKey: 'form_factor',
    },
    {
      header: 'Memory Slots',
      accessorKey: 'memory_slots',
    },
  ],
  internal_hard_drive: [
    {
      header: 'Capacity',
      accessorKey: 'capacity',
    },
    {
      header: 'Type',
      accessorKey: 'type',
    },
    {
      header: 'Cache',
      accessorKey: 'cache',
    },
    {
      header: 'Interface',
      accessorKey: 'interface',
    },
  ],
  power_supply: [
    {
      header: 'Wattage',
      accessorKey: 'wattage',
    },
    {
      header: 'Efficiency',
      accessorKey: 'efficiency',
    },
    {
      header: 'Modular',
      accessorKey: 'modular',
    },
    {
      header: 'Form Factor',
      accessorKey: 'form_factor',
    },
  ],
  video_card: [
    {
      header: 'Chipset',
      accessorKey: 'chipset',
    },
    {
      header: 'Memory',
      accessorKey: 'memory',
    },
    {
      header: 'Core Clock',
      accessorKey: 'core_clock',
    },
    {
      header: 'Boost Clock',
      accessorKey: 'boost_clock',
    },
  ],
};
