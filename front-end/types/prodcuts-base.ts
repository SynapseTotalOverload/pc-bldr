import { Button } from "@/components/ui/button";
import { NextDataPathnameNormalizer } from "next/dist/server/normalizers/request/next-data";
import { ButtonHTMLAttributes } from "react";
import { PreviousMonthButton } from "react-day-picker";

export interface CategoryRead {
  id: number;
  keepa_id: number;
  name: string;
}

export interface ProductBase {
  asin: string;
  title: string;
  price?: number;
  rating?: number;
  created_at: string; // ISO string from `datetime`
}

export interface ProductCreate extends ProductBase {
  category_id?: number;
}



export interface ProductUpdate {
  title?: string;
  price?: number;
  rating?: number;
  category_id?: number;
}

export interface ProductTypeMap {
  cpu: CPU;
  cpu_cooler: CPUCooler;
  gpu: GPU;
  memory: RAM;
  motherboard: Motherboard;
  internal_hard_drive: Storage;
  power_supply: PowerSupply;
  video_card: GPU;
}
export interface ProductTypeMapNames {
  cpu: 'CPU';
  cpu_cooler: 'CPU Cooler';
  gpu: 'GPU';
  memory: 'Memory';
  motherboard: 'Motherboard';
  internal_hard_drive: 'Internal Hard Drive';
  power_supply: 'Power Supply';
  video_card: 'Video Card';
}

export const PRODUCT_TYPE_NAMES: Record<keyof ProductTypeMapNames, string> = {
  cpu: 'CPU',
  cpu_cooler: 'CPU Cooler',
  gpu: 'GPU',
  memory: 'Memory',
  motherboard: 'Motherboard',
  internal_hard_drive: 'Internal Hard Drive',
  power_supply: 'Power Supply',
  video_card: 'Video Card',
};

export interface ProductTypeMapIds {
  CPU: 1;
  CPU_COOLER: 2;
  GPU: 3;
  MOTHERBOARD: 4;
  RAM: 5;
  ROM: 6;
  PSU: 7;
  VIDEO_CARD: 8;
}
export const ProductConstantMapIds: Record<keyof ProductTypeMapIds, number> = {
  CPU: 1,
  CPU_COOLER: 2,
  GPU: 3,
  MOTHERBOARD: 4,
  RAM: 5,
  ROM: 6,
  PSU: 7,
  VIDEO_CARD: 8,
}

export const FrontendToBackendCategoryMap: Record<string, keyof ProductTypeMapIds> = {
  cpu: 'CPU',
  cpu_cooler: 'CPU_COOLER',
  motherboard: 'MOTHERBOARD',
  memory: 'RAM',
  internal_hard_drive: 'ROM',
  video_card: 'GPU',
  power_supply: 'PSU',
  case: 'VIDEO_CARD', 
};

export const FrontendToBackendCategoryIdMap: Record<string, keyof ProductTypeMapIds> = {
  1: 'CPU',
  2: 'CPU_COOLER',
  3: 'GPU',
  4: 'MOTHERBOARD',
  5: 'RAM',
  6: 'ROM',
  7: 'PSU',
  8: 'VIDEO_CARD',
}

export interface PaginatedInterface<T> {
  items: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
export interface ProductRead extends ProductBase {
  id: number;
  created_at: string; // ISO string from `datetime`
  category?: CategoryRead;
  attrs: ProductAttrs;
}
export interface ProductGenericRead<T extends ProductAttrs>{
  id: number;
  created_at: string; // ISO string from `datetime`
  category?: CategoryRead;
  attrs: T;
}
export interface BuildRead{
  name: string;
  build_type: string;
  build_price: number;
  cpu: ProductGenericRead<CPU>;
  cpu_cooler: ProductGenericRead<CPUCooler>;
  gpu: ProductGenericRead<GPU>;
  motherboard: ProductGenericRead<Motherboard>;
  ram: ProductGenericRead<RAM>;
  storage: ProductGenericRead<Storage>;
  psu: ProductGenericRead<PowerSupply>;
  case: ProductGenericRead<Case>;
  id: number;
  created_at: string; // ISO string from `datetime`
  updated_at: string; // ISO string from `datetime`
}


export type ProductAttrs = CPU | CPUCooler | Motherboard | RAM | Storage | GPU | PowerSupply | Case;

export interface BaseAttrs {
  brand: string;
  model: string;
}
export type CPU = AttributeWithLabel<CPUAttributes>;
export type CPUCooler = AttributeWithLabel<CPUCoolerAttributes>;
export type Motherboard = AttributeWithLabel<MotherboardAttributes>;
export type RAM = AttributeWithLabel<RAMAttributes>;
export type Storage = AttributeWithLabel<StorageAttributes>;
export type GPU = AttributeWithLabel<GPUAttributes>;
export type PowerSupply = AttributeWithLabel<PowerSupplyAttributes>;
export type Case = AttributeWithLabel<CaseAttributes>;

export type AttributeWithLabel<T extends { type: string }> = BaseAttrs & T;

export interface CPUAttributes {
  type: 'cpu';
  cores: number;
  threads: number;
  socket_type: string;
  base_speed: string;
  turbo_speed: string;
  architechture: string;
  core_family: string;
  integrated_graphics?: string;
  memory_type: string;
  memory_speed: number;
  series: string;
  generation: string;
}

export interface CPUCoolerAttributes {
  type: 'cpu_cooler';
  fan_rpm_base?: number;
  fan_rpm_max?: number;
  noise_level_base?: number;
  noise_level_max?: number;
  color: string;
}

export interface MotherboardAttributes {
  type: 'motherboard';
  chipset: string;
  form_factor: string;
  socket_type: string;
  ram_slots: number;
  max_ram_support: number;
}

export interface RAMAttributes {
  type: 'ram';
  total_memory: number;
  one_unit_memory: number;
  quantity: number;
  ram_type: string;
  ram_speed: number;
  cas_latency: string;
}

export interface StorageAttributes {
  type: 'storage';
  capacity?: number;
  mem_type: string;
  interface: string;
  cache_mem?: number;
  form_factor: string;
}

export interface GPUAttributes {
  type: 'gpu';
  memory: number;
  mem_interface: string;
  length?: number;
  interface: string;
  chipset: string;
  base_clock?: number;
  clock_speed?: number;
  frame_sync: string;
}

export interface PowerSupplyAttributes {
  type: 'power_supply';
  power?: number;
  efficiency: string;
  color: string;
}

export interface CaseAttributes {
  type: 'case';
  side_panel: string;
  cabinet_type: string;
  color: string;
}
