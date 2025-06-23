import { NextRequest, NextResponse } from 'next/server';

import { ProductRead } from '@/types/prodcuts-base';

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
