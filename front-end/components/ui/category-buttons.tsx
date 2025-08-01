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

const categoriesAccessories = [
  { id: 'mouse', label: 'Mouse' },
  { id: 'monitor', label: 'Monitor' },
  { id: 'keyboard', label: 'Keyboard' },
  { id: 'headset', label: 'Headset' },
  { id: 'mousepad', label: 'Mousepad' },
  { id: 'chair', label: 'Chair' },
  { id: 'microphone', label: 'Microphone' },
  { id: 'camera', label: 'Camera' },
  { id: 'headphones', label: 'Headphones' },
];

const categoriesSkins = [
  { id: 'knives', label: 'Knives' },
  { id: 'gloves', label: 'Gloves' },
  { id: 'pistols', label: 'Pistols' },
  { id: 'rifles', label: 'Rifles' },
  { id: 'smg', label: 'SMG' },
  { id: 'heavy', label: 'Heavy' },
];

interface CategoryButtonsProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string) => void;
  isAccessories?: 0 | 1 | 2;
}

export function CategoryButtons({ selectedCategory, onSelectCategory, isAccessories = 0 }: CategoryButtonsProps) {
  const categoriesActive = isAccessories === 0 ? categories : isAccessories === 1 ? categoriesAccessories : categoriesSkins;
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {categoriesActive.map((category) => (
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
