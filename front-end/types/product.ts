export interface BaseProduct {
  id: string;
  product_id: string;
  name: string;
  link: string;
  price: string;
  rating_count: string;
  image_url: string;
}

export interface CPUProduct extends BaseProduct {
  core_count: string;
  base_clock: string;
  boost_clock: string;
}
export interface CPUCoolerProduct extends BaseProduct {
  airflow: string;
  noise_level: string;
  rpm: string;
}
export interface GPUProduct extends BaseProduct {
  airflow: string;
  noise_level: string;
  rpm: string;
}
export interface MemoryProduct extends BaseProduct {
  speed: string;
  modules: string;
  price_per_gb: string;
  first_word_latency: string;
}
export interface MotherboardProduct extends BaseProduct {
  socket: string;
  chipset: string;
  form_factor: string;
  memory_slots: string;
}
export interface InternalHardDriveProduct extends BaseProduct {
  capacity: string;
  type: string;
  cache: string;
  interface: string;
}

export interface PowerSupplyProduct extends BaseProduct {
  wattage: string;
  efficiency: string;
  modular: string;
  form_factor: string;
}
export interface VideoCardProduct extends BaseProduct {
  chipset: string;
  memory: string;
  core_clock: string;
  boost_clock: string;
}

export const CATEGORIES = {
  cpu: 'CPU',
  cpu_cooler: 'CPU Cooler',
  gpu: 'GPU',
  memory: 'Memory',
  motherboard: 'Motherboard',
  internal_hard_drive: 'Internal Hard Drive',
  power_supply: 'Power Supply',
  video_card: 'Video Card',
} as const;

export type ProductTypeMap = {
  cpu: CPUProduct;
  cpu_cooler: CPUCoolerProduct;
  gpu: GPUProduct;
  memory: MemoryProduct;
  motherboard: MotherboardProduct;
  internal_hard_drive: InternalHardDriveProduct;
  power_supply: PowerSupplyProduct;
  video_card: VideoCardProduct;
};

export type ProductTypeMapArray = ProductTypeMap[keyof ProductTypeMap][];
