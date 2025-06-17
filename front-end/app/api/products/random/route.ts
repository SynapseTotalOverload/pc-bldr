import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CATEGORIES = [
  'cpu',
  'cpu_cooler',
  'gpu',
  'memory',
  'motherboard',
  'internal_hard_drive',
  'power_supply',
  'video_card',
];

export async function GET() {
  try {
    const randomProducts = [];

    for (const category of CATEGORIES) {
      const filePath = path.join(process.cwd(), 'py-output', category.replace(/_/g, '-'), 'products.json');

      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const products = JSON.parse(fileContent);

        if (products.length > 0) {
          // Get a random product from this category
          const randomIndex = Math.floor(Math.random() * products.length);
          const randomProduct = products[randomIndex];

          randomProducts.push({
            ...randomProduct,
            category,
          });
        }
      }
    }

    return NextResponse.json({ products: randomProducts });
  } catch (error) {
    console.error('Error fetching random products:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
