import { NextRequest, NextResponse } from 'next/server';

import { ProductRead, ProductCreate, ProductAttrs } from '@/types/prodcuts-base';

const ITEMS_PER_PAGE = 20;

const productsConstants: ProductRead[] = [
  {
    id: 1,
    asin: 'B08XYZ1234',
    title: 'Intel Core i7-12700K',
    price: 349.99,
    rating: 4.8,
    created_at: new Date().toISOString(),
    category: {
      id: 1,
      keepa_id: 101,
      name: 'CPU',
    },
    attrs: {
      type: 'cpu',
      brand: 'Intel',
      model: 'Core i7-12700K',
      cores: 12,
      threads: 20,
      socket_type: 'LGA1700',
      base_speed: '3.6GHz',
      turbo_speed: '5.0GHz',
      architechture: 'Alder Lake',
      core_family: 'Core i7',
      integrated_graphics: 'Intel UHD 770',
      memory_type: 'DDR5',
      memory_speed: 4800,
      series: '12700K',
      generation: '12th Gen',
    },
  },
  {
    id: 2,
    asin: 'B09GPU5678',
    title: 'NVIDIA GeForce RTX 3080',
    price: 699.99,
    rating: 4.7,
    created_at: new Date().toISOString(),
    category: {
      id: 2,
      keepa_id: 102,
      name: 'GPU',
    },
    attrs: {
      type: 'gpu',
      brand: 'NVIDIA',
      model: 'RTX 3080',
      memory: 10,
      mem_interface: '320-bit',
      length: 285,
      interface: 'PCIe 4.0',
      chipset: 'Ampere',
      base_clock: 1440,
      clock_speed: 1710,
      frame_sync: 'G-Sync',
    },
  },
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1');

    if (!category) {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 });
    }

    // Calculate pagination
    const totalItems = productsConstants.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedProducts = productsConstants.slice(startIndex, endIndex);

    return NextResponse.json({
      items: paginatedProducts,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: ITEMS_PER_PAGE,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { category, asin, title, price, rating, brand, model, ...attributes } = body;

    // Validate required fields
    if (!title || !brand || !model) {
      return NextResponse.json(
        { error: 'Title, brand, and model are required' },
        { status: 400 }
      );
    }

    // Create new product
    const newProduct: ProductRead = {
      id: productsConstants.length + 1,
      asin: asin || `ASIN_${Date.now()}`,
      title,
      price: price ? parseFloat(price) : undefined,
      rating: rating ? parseFloat(rating) : undefined,
      created_at: new Date().toISOString(),
      category: {
        id: getCategoryId(category),
        keepa_id: getCategoryId(category) * 100,
        name: getCategoryName(category),
      },
      attrs: createAttributes(category, brand, model, attributes),
    };

    // Add to products array (in real app, this would be saved to database)
    productsConstants.push(newProduct);

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function getCategoryId(category: string): number {
  const categoryMap: Record<string, number> = {
    cpu: 1,
    cpu_cooler: 2,
    gpu: 3,
    motherboard: 4,
    memory: 5,
    internal_hard_drive: 6,
    power_supply: 7,
    video_card: 8,
  };
  return categoryMap[category] || 1;
}

function getCategoryName(category: string): string {
  const categoryMap: Record<string, string> = {
    cpu: 'CPU',
    cpu_cooler: 'CPU Cooler',
    gpu: 'GPU',
    motherboard: 'Motherboard',
    memory: 'Memory',
    internal_hard_drive: 'Internal Hard Drive',
    power_supply: 'Power Supply',
    video_card: 'Video Card',
  };
  return categoryMap[category] || 'Unknown';
}

function createAttributes(category: string, brand: string, model: string, attributes: any): ProductAttrs {
  const baseAttrs = { brand, model };

  switch (category) {
    case 'cpu':
      return {
        type: 'cpu',
        ...baseAttrs,
        cores: parseInt(attributes.cores as string),
        threads: parseInt(attributes.threads as string),
        socket_type: attributes.socket_type as string,
        base_speed: attributes.base_speed as string,
        turbo_speed: attributes.turbo_speed as string,
        architechture: attributes.architechture as string,
        core_family: attributes.core_family as string,
        integrated_graphics: attributes.integrated_graphics as string,
        memory_type: attributes.memory_type as string,
        memory_speed: parseInt(attributes.memory_speed as string),
        series: attributes.series as string,
        generation: attributes.generation as string,
      } as ProductAttrs;
    case 'gpu':
      return {
        type: 'gpu',
        ...baseAttrs,
        memory: parseInt(attributes.memory as string),
        mem_interface: attributes.mem_interface as string,
        length: attributes.length ? parseInt(attributes.length as string) : undefined,
        interface: attributes.interface as string,
        chipset: attributes.chipset as string,
        base_clock: attributes.base_clock ? parseInt(attributes.base_clock as string) : undefined,
        clock_speed: attributes.clock_speed ? parseInt(attributes.clock_speed as string) : undefined,
        frame_sync: attributes.frame_sync as string,
      } as ProductAttrs;
    case 'memory':
      return {
        type: 'ram',
        ...baseAttrs,
        total_memory: parseInt(attributes.total_memory as string),
        one_unit_memory: parseInt(attributes.one_unit_memory as string),
        quantity: parseInt(attributes.quantity as string),
        ram_type: attributes.ram_type as string,
        ram_speed: parseInt(attributes.ram_speed as string),
        cas_latency: attributes.cas_latency as string,
      } as ProductAttrs;
    case 'motherboard':
      return {
        type: 'motherboard',
        ...baseAttrs,
        chipset: attributes.chipset as string,
        form_factor: attributes.form_factor as string,
        socket_type: attributes.socket_type as string,
        ram_slots: parseInt(attributes.ram_slots as string),
        max_ram_support: parseInt(attributes.max_ram_support as string),
      } as ProductAttrs;
    case 'internal_hard_drive':
      return {
        type: 'storage',
        ...baseAttrs,
        capacity: attributes.capacity ? parseInt(attributes.capacity as string) : undefined,
        mem_type: attributes.mem_type as string,
        interface: attributes.interface as string,
        cache_mem: attributes.cache_mem ? parseInt(attributes.cache_mem as string) : undefined,
        form_factor: attributes.form_factor as string,
      } as ProductAttrs;
    case 'power_supply':
      return {
        type: 'power_supply',
        ...baseAttrs,
        power: attributes.power ? parseInt(attributes.power as string) : undefined,
        efficiency: attributes.efficiency as string,
        color: attributes.color as string,
      } as ProductAttrs;
    case 'cpu_cooler':
      return {
        type: 'cpu_cooler',
        ...baseAttrs,
        fan_rpm_base: attributes.fan_rpm_base ? parseInt(attributes.fan_rpm_base as string) : undefined,
        fan_rpm_max: attributes.fan_rpm_max ? parseInt(attributes.fan_rpm_max as string) : undefined,
        noise_level_base: attributes.noise_level_base ? parseInt(attributes.noise_level_base as string) : undefined,
        noise_level_max: attributes.noise_level_max ? parseInt(attributes.noise_level_max as string) : undefined,
        color: attributes.color as string,
      } as ProductAttrs;
    case 'video_card':
      return {
        type: 'gpu',
        ...baseAttrs,
        memory: parseInt(attributes.memory as string),
        mem_interface: attributes.mem_interface as string,
        length: attributes.length ? parseInt(attributes.length as string) : undefined,
        interface: attributes.interface as string,
        chipset: attributes.chipset as string,
        base_clock: attributes.base_clock ? parseInt(attributes.base_clock as string) : undefined,
        clock_speed: attributes.clock_speed ? parseInt(attributes.clock_speed as string) : undefined,
        frame_sync: attributes.frame_sync as string,
      } as ProductAttrs;
    default:
      throw new Error(`Unsupported category: ${category}`);
  }
}
