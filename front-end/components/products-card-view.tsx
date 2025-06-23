import { Card } from '@/components/ui/card';
import { ProductRead } from '@/types/prodcuts-base';

export const ProductCard = ({ product }: { product: ProductRead }) => {
  return (
    <Card key={product.id} className="overflow-hidden p-[2px] hover:shadow-lg">
      <div className="p-4">
        <h3 className="line-clamp-2 font-semibold">{product.title}</h3>
        <div className="mt-2 flex items-center justify-between">
          <span className="font-bold">{product.price?.toString()}</span>
          <a
            className="text-blue-500 hover:underline"
            href={`https://amazon.com/dp/${product.asin}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View
          </a>
        </div>
      </div>
    </Card>
  );
};
