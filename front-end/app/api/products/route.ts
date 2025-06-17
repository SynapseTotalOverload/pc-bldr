import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const ITEMS_PER_PAGE = 20;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1');
    const search = searchParams.get('search') || '';

    if (!category) {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 });
    }

    // Read the JSON file for the specified category
    const filePath = path.join(process.cwd(), 'py-output', category.replace(/_/g, '-'), 'products.json');

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    let products = JSON.parse(fileContent);

    // Apply search filter if provided
    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter((product: any) => product.name.toLowerCase().includes(searchLower));
    }

    // Calculate pagination
    const totalItems = products.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedProducts = products.slice(startIndex, endIndex);

    return NextResponse.json({
      products: paginatedProducts,
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
