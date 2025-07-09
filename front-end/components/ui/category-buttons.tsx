import { Button } from '@/components/ui/button';

const categories = [
  { id: 'cpu', label: 'CPU' },
  { id: 'cpu_cooler', label: 'CPU Cooler' },
  { id: 'gpu', label: 'GPU' },
  { id: 'motherboard', label: 'Motherboard' },
  { id: 'ram', label: 'RAM' },
  { id: 'storage', label: 'Storage' },
  { id: 'power_supply', label: 'Power Supply' },
  { id: 'case', label: 'Case' },
];

interface CategoryButtonsProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string) => void;
}

export function CategoryButtons({ selectedCategory, onSelectCategory }: CategoryButtonsProps) {
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? 'default' : 'outline'}
          onClick={() => onSelectCategory(category.id)}
          className="capitalize"
        >
          {category.label}
        </Button>
      ))}
    </div>
  );
}
