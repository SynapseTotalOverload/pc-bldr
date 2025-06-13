import { cn } from '@/lib/utils';
import { BaseProduct } from '@/types/product';
import { AnimatePresence, motion } from 'motion/react';
import { Card as CardComponent } from './card';
import { useState } from 'react';

export const HoverEffect = ({ products, className }: { products: BaseProduct[]; className?: string }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className={cn('grid grid-cols-1 py-10 md:grid-cols-2 lg:grid-cols-4', className)}>
      {products.map((product, idx) => (
        <div
          key={product?.link}
          className="group relative block h-full w-full p-2"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="bg-main-accent/10 absolute inset-0 block h-full w-full rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.6 },
                }}
              />
            )}
          </AnimatePresence>
          <Card key={product.id} className="bg-transparent">
            <div className="flex flex-row gap-2">
              <div className="relative aspect-square">
                {product.image_url && (
                  <img
                    src={product.image_url.startsWith('//') ? `https:${product.image_url}` : product.image_url}
                    alt={product.name}
                    className="rounded-lg object-cover"
                  />
                )}
              </div>
              <span className="text-foreground text-sm">{product.name}</span>
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
};

export const Card = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  return (
    <CardComponent
      className={cn('relative z-20 h-full w-full overflow-hidden rounded-2xl border border-transparent p-1', className)}
    >
      <div className="relative z-50">
        <div className="p-2">{children}</div>
      </div>
    </CardComponent>
  );
};
export const CardTitle = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  return <h4 className={cn('mt-4 font-bold tracking-wide text-zinc-100', className)}>{children}</h4>;
};
export const CardDescription = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  return <p className={cn('mt-8 text-sm leading-relaxed tracking-wide text-zinc-400', className)}>{children}</p>;
};
