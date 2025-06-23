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

export interface ProductRead extends ProductBase {
  id: number;
  created_at: string; // ISO string from `datetime`
  category?: CategoryRead;
}
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

export interface AttributeWithLabel<T> extends BaseAttrs, T {}

export interface CPUAttributes {
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
  fan_rpm_base?: number;
  fan_rpm_max?: number;
  noise_level_base?: number;
  noise_level_max?: number;
  color: string;
}

export interface MotherboardAttributes {
  chipset: string;
  form_factor: string;
  socket_type: string;
  ram_slots: number;
  max_ram_support: number;
}

export interface RAMAttributes {
  total_memory: number;
  one_unit_memory: number;
  quantity: number;
  ram_type: string;
  ram_speed: number;
  cas_latency: string;
}

export interface StorageAttributes {
  capacity?: number;
  mem_type: string;
  interface: string;
  cache_mem?: number;
  form_factor: string;
}

export interface GPUAttributes {
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
  power?: number;
  efficiency: string;
  color: string;
}

export interface CaseAttributes {
  side_panel: string;
  cabinet_type: string;
  color: string;
}
