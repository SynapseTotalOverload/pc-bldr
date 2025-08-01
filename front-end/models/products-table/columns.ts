import { 
  CPU,
  CPUCooler,
  GPU,
  Motherboard,
  PowerSupply,
  ProductAttrs,
  ProductRead,
  ProductTypeMapIds,
  RAM,
  Storage,
  Case
} from '@/types/prodcuts-base';
import { ColumnDef } from '@tanstack/react-table';
import { 
  ProductAttrs as ProductAttrsAccessories, 
  Mouse, 
  Mousepad, 
  Headset, 
  Chair, 
  ProductTypeMapIds as ProductTypeMapIdsAccessories,
  ProductRead as ProductReadAccessories,
  Monitor,
  Keyboard,
  Microphone,
  Camera,
  Headphones,
} from '@/types/product-accessories-type';

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

function isMouse(attrs: ProductAttrsAccessories | null | undefined, categoryId?: number): attrs is Mouse {
  return categoryId === 9;
}

function isMonitor(attrs: ProductAttrsAccessories | null | undefined, categoryId?: number): attrs is Monitor {
  return categoryId === 10;
}

function isKeyboard(attrs: ProductAttrsAccessories | null | undefined, categoryId?: number): attrs is Keyboard {
  return categoryId === 11;
}

function isHeadset(attrs: ProductAttrsAccessories | null | undefined, categoryId?: number): attrs is Headset {
  return categoryId === 12;
}

function isMousepad(attrs: ProductAttrsAccessories | null | undefined, categoryId?: number): attrs is Mousepad {
  return categoryId === 13;
}

function isChair(attrs: ProductAttrsAccessories | null | undefined, categoryId?: number): attrs is Chair {
  return categoryId === 14;
}

function isMicrophone(attrs: ProductAttrsAccessories | null | undefined, categoryId?: number): attrs is Microphone {
  return categoryId === 15;
}

function isCamera(attrs: ProductAttrsAccessories | null | undefined, categoryId?: number): attrs is Camera {
  return categoryId === 16;
}

function isHeadphones(attrs: ProductAttrsAccessories | null | undefined, categoryId?: number): attrs is Headphones {
  return categoryId === 17;
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

export const categoryColumnExtensionsAccessories: {
  [K in keyof ProductTypeMapIdsAccessories]?: ColumnDef<ProductReadAccessories>[];
} = {
  MOUSE: [
    {
      header: 'Brand',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isMouse(attrs, categoryId) && attrs ? attrs.brand : '—';
      },
    },
    {
      header: 'Color',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isMouse(attrs, categoryId) && attrs ? attrs.color : '—';
      },
    },
    {
      header: 'Connectivity Technology',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isMouse(attrs, categoryId) && attrs ? attrs.connectivity_technology : '—';
      },
    },
    {
      header: 'Special Features',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isMouse(attrs, categoryId) && attrs ? attrs.special_feature : '—';
      },
    },
    {
      header: 'Movement Detection Technology',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isMouse(attrs, categoryId) && attrs ? attrs.movement_detection_technology : '—';
      },
    },
    {
      header: 'Number of Buttons',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isMouse(attrs, categoryId) && attrs ? attrs.number_of_buttons : '—';
      },
    },
  ],
  MONITOR: [
    {
      header: 'Brand',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isMonitor(attrs, categoryId) && attrs ? attrs.brand : '—';
      },
    },
    {
      header: 'Screen Size',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isMonitor(attrs, categoryId) && attrs ? attrs.screen_size : '—';
      },
    },
    {
      header: 'Resolution',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isMonitor(attrs, categoryId) && attrs ? attrs.resolution : '—';
      },
    },
    {
      header: 'Aspect Ratio',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isMonitor(attrs, categoryId) && attrs ? attrs.aspect_ratio : '—';
      },
    },
    {
      header: 'Screen Surface',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isMonitor(attrs, categoryId) && attrs ? attrs.screen_surface_description : '—';
      },
    },
    {
      header: 'Style',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isMonitor(attrs, categoryId) && attrs ? attrs.style : '—';
      },
    }
  ],
  KEYBOARD: [
    {
      header: 'Brand',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isKeyboard(attrs, categoryId) && attrs ? attrs.brand : '—';
      },
    },
    {
      header: 'Pattern',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isKeyboard(attrs, categoryId) && attrs ? attrs.pattern : '—';
      },
    },
    {
      header: 'Compatible Devices',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isKeyboard(attrs, categoryId) && attrs ? attrs.compatible_devices : '—';
      },
    },
    {
      header: 'Connectivity Technology',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isKeyboard(attrs, categoryId) && attrs ? attrs.connectivity_technology : '—';
      },
    },
    {
      header: 'Keyboard Description',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isKeyboard(attrs, categoryId) && attrs ? attrs.keyboard_description : '—';
      },
    },
    {
      header: 'Recommended Uses for Product',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isKeyboard(attrs, categoryId) && attrs ? attrs.recommended_uses_for_product : '—';
      },
    },
    {
      header: 'Special Feature',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isKeyboard(attrs, categoryId) && attrs ? attrs.special_feature : '—';
      },
    },
    {
      header: 'Number of Keys',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isKeyboard(attrs, categoryId) && attrs ? attrs.number_of_keys : '—';
      },
    },
    {
      header: 'Keyboard Backlighting Color Support',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isKeyboard(attrs, categoryId) && attrs ? attrs.keyboard_backlighting_color_support : '—';
      },
    },
    {
      header: 'Color',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isKeyboard(attrs, categoryId) && attrs ? attrs.color : '—';
      },
    },
    {
      header: 'Size',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isKeyboard(attrs, categoryId) && attrs ? attrs.size : '—';
      },
    },
    {
      header: 'Style',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isKeyboard(attrs, categoryId) && attrs ? attrs.style : '—';
      },
    },
  ],
  HEADSET: [
    {
      header: 'Brand',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isHeadset(attrs, categoryId) && attrs ? attrs.brand : '—';
      },
    },
    {
      header: 'Color',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isHeadset(attrs, categoryId) && attrs ? attrs.color : '—';
      },
    },
    {
      header: 'Par Placement',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isHeadset(attrs, categoryId) && attrs ? attrs.par_placement : '—';
      },
    },
    {
      header: 'Form Factor',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isHeadset(attrs, categoryId) && attrs ? attrs.form_factor : '—';
      },
    },
    {
      header: 'Impedance',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isHeadset(attrs, categoryId) && attrs ? attrs.impedance : '—';
      },
    },
    {
      header: 'Size',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isHeadset(attrs, categoryId) && attrs ? attrs.size : '—';
      },
    },
  ],
  MOUSEPAD: [
    {
      header: 'Brand',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isMousepad(attrs, categoryId) && attrs ? attrs.brand : '—';
      },
    },
    {
      header: 'Color',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isMousepad(attrs, categoryId) && attrs ? attrs.color : '—';
      },
    },
    {
      header: 'Special Feature',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isMousepad(attrs, categoryId) && attrs ? attrs.special_feature : '—';
      },
    },
    {
      header: 'Recommended Uses for Product',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isMousepad(attrs, categoryId) && attrs ? attrs.recommended_uses_for_product : '—';
      },
    },
    {
      header: 'Material',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isMousepad(attrs, categoryId) && attrs ? attrs.material : '—';
      },
    },
    {
      header: 'Size',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isMousepad(attrs, categoryId) && attrs ? attrs.size : '—';
      },
    },
    {
      header: 'Style',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isMousepad(attrs, categoryId) && attrs ? attrs.style : '—';
      },
    },
  ],
  CHAIR: [
    {
      header: 'Brand',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isChair(attrs, categoryId) && attrs ? attrs.brand : '—';
      },
    },
    {
      header: 'Color',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isChair(attrs, categoryId) && attrs ? attrs.color : '—';
      },
    },
    {
      header: 'Product Dimensions',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isChair(attrs, categoryId) && attrs ? attrs.product_dimensions : '—';
      },
    },
    {
      header: 'Size',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isChair(attrs, categoryId) && attrs ? attrs.size : '—';
      },
    },
    {
      header: 'Back Style',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isChair(attrs, categoryId) && attrs ? attrs.back_style : '—';
      },
    }
  ],
  MICROPHONE: [
    {
      header: 'Brand',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isMicrophone(attrs, categoryId) && attrs ? attrs.brand : '—';
      },
    },
    {
      header: 'Color',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isMicrophone(attrs, categoryId) && attrs ? attrs.color : '—';
      },
    },
    {
      header: 'Connectivity Technology',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isMicrophone(attrs, categoryId) && attrs ? attrs.connectivity_technology : '—';
      },
    },
    {
      header: 'Connector Type',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isMicrophone(attrs, categoryId) && attrs ? attrs.connector_type : '—';
      },
    },
    {
      header: 'Special Feature',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isMicrophone(attrs, categoryId) && attrs ? attrs.special_feature : '—';
      },
    },
    {
      header: 'Compatible Devices',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isMicrophone(attrs, categoryId) && attrs ? attrs.compatible_devices : '—';
      },
    },
    {
      header: 'Included Components',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isMicrophone(attrs, categoryId) && attrs ? attrs.included_components : '—';
      },
    },
    {
      header: 'Polar Pattern',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isMicrophone(attrs, categoryId) && attrs ? attrs.polar_pattern : '—';
      },
    },
  ],
  CAMERA: [
    {
      header: 'Brand',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isCamera(attrs, categoryId) && attrs ? attrs.brand : '—';
      },
    },
    {
      header: 'Model',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isCamera(attrs, categoryId) && attrs ? attrs.model : '—';
      },
    },
    {
      header: 'Photo Sensor Technology',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isCamera(attrs, categoryId) && attrs ? attrs.photo_sensor_technology : '—';
      },
    },
    {
      header: 'Video Capture Resolution',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isCamera(attrs, categoryId) && attrs ? attrs.video_capture_resolution : '—';
      },
    },
    {
      header: 'Maximum Aperture',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isCamera(attrs, categoryId) && attrs ? attrs.maximum_aperture : '—';
      },
    },
    {
      header: 'Flash Memory Type',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isCamera(attrs, categoryId) && attrs ? attrs.flash_memory_type : '—';
      },
    },
    {
      header: 'Supported Audio Format',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isCamera(attrs, categoryId) && attrs ? attrs.supported_audio_format : '—';
      },
    },
    {
      header: 'Screen Size',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isCamera(attrs, categoryId) && attrs ? attrs.screen_size : '—';
      },
    },
    {
      header: 'Connectivity Technology',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isCamera(attrs, categoryId) && attrs ? attrs.connectivity_technology : '—';
      },
    },
    {
      header: 'Color',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isCamera(attrs, categoryId) && attrs ? attrs.color : '—';
      },
    },
  ],
  HEADPHONES: [
    {
      header: 'Brand',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isHeadphones(attrs, categoryId) && attrs ? attrs.brand : '—';
      },
    },
    {
      header: 'Model',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isHeadphones(attrs, categoryId) && attrs ? attrs.model : '—';
      },
    },
    {
      header: 'Color',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isHeadphones(attrs, categoryId) && attrs ? attrs.color : '—';
      },
    },
    {
      header: 'Impedance',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isHeadphones(attrs, categoryId) && attrs ? attrs.impedance : '—';
      },
    },
    {
      header: 'Form Factor',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isHeadphones(attrs, categoryId) && attrs ? attrs.form_factor : '—';
      },
    },
    {
      header: 'Ear Placement',
      accessorFn: (row) => {
        const attrs = row.attrs;
        const categoryId = row.category?.id;
        return isHeadphones(attrs, categoryId) && attrs ? attrs.ear_placement : '—';
      },
    },
  ],
}
