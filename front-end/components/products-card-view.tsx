import { Card } from '@/components/ui/card';
import { BaseProduct } from '@/types/product';

export const ProductCard = ({ product }: { product: BaseProduct }) => {
  return (
    <Card key={product.id} className="overflow-hidden p-[2px] hover:shadow-lg">
      <div className="relative aspect-square">
        {product.image_url && (
          <img
            src={product.image_url.startsWith('//') ? `https:${product.image_url}` : product.image_url}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        )}
      </div>
      <div className="p-4">
        <h3 className="line-clamp-2 font-semibold">{product.name}</h3>
        <div className="mt-2 flex items-center justify-between">
          <span className="font-bold">{product.price.replace('Add', '')}</span>
          <a className="text-blue-500 hover:underline" href={product.link} target="_blank" rel="noopener noreferrer">
            View
          </a>
        </div>
      </div>
    </Card>
  );
};
