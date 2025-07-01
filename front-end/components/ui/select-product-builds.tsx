import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProductRead, CPU, CPUCooler, Motherboard, RAM, Storage, GPU, PowerSupply, Case } from '@/types/prodcuts-base';

interface SelectProductBuildsProps {
  label: string;
  fieldId: string;
  value: string;
  onValueChange: (value: string) => void;
  search: string;
  onSearchChange: (search: string) => void;
  products: ProductRead[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  placeholder: string;
  searchPlaceholder: string;
  onInitializeData?: () => void;
  selectedProduct?: ProductRead | null;
}

export function SelectProductBuilds({
  label,
  fieldId,
  value,
  onValueChange,
  search,
  onSearchChange,
  products,
  loading,
  hasMore,
  onLoadMore,
  placeholder,
  searchPlaceholder,
  onInitializeData,
  selectedProduct,
}: SelectProductBuildsProps) {
  const getProductDisplayInfo = (product: ProductRead) => {
    const baseInfo = {
      title: `${product.attrs.brand} ${product.attrs.model}`,
      subtitle: '',
      price: product.price ? `$${product.price.toFixed(2)}` : 'Price N/A',
      rating: product.rating,
    };

    switch (product.attrs.type) {
      case 'cpu':
        const cpuAttrs = product.attrs as CPU;
        return {
          ...baseInfo,
          subtitle: `${cpuAttrs.cores}C/${cpuAttrs.threads}T • ${cpuAttrs.base_speed} • ${cpuAttrs.socket_type}`,
        };

      case 'cpu_cooler':
        const cpuCoolerAttrs = product.attrs as CPUCooler;
        const rpmInfo = cpuCoolerAttrs.fan_rpm_max 
          ? `${cpuCoolerAttrs.fan_rpm_max} RPM`
          : '';
        const noiseInfo = cpuCoolerAttrs.noise_level_max 
          ? `${cpuCoolerAttrs.noise_level_max} dB`
          : '';
        return {
          ...baseInfo,
          subtitle: `${cpuCoolerAttrs.color} • ${rpmInfo} • ${noiseInfo}`.replace(/^[^•]* • /, '').replace(/ • $/, ''),
        };

      case 'motherboard':
        const motherboardAttrs = product.attrs as Motherboard;
        return {
          ...baseInfo,
          subtitle: `${motherboardAttrs.chipset} • ${motherboardAttrs.form_factor} • ${motherboardAttrs.socket_type}`,
        };

      case 'ram':
        const ramAttrs = product.attrs as RAM;
        return {
          ...baseInfo,
          subtitle: `${ramAttrs.total_memory}GB ${ramAttrs.ram_type} • ${ramAttrs.ram_speed}MHz • CL${ramAttrs.cas_latency}`,
        };

      case 'storage':
        const storageAttrs = product.attrs as Storage;
        const capacity = storageAttrs.capacity 
          ? `${storageAttrs.capacity}GB`
          : '';
        return {
          ...baseInfo,
          subtitle: `${capacity} • ${storageAttrs.mem_type} • ${storageAttrs.interface}`,
        };

      case 'gpu':
        const gpuAttrs = product.attrs as GPU;
        const memory = gpuAttrs.memory 
          ? `${gpuAttrs.memory}GB`
          : '';
        const clockSpeed = gpuAttrs.clock_speed 
          ? `${gpuAttrs.clock_speed}MHz`
          : '';
        return {
          ...baseInfo,
          subtitle: `${gpuAttrs.chipset} • ${memory} • ${clockSpeed}`,
        };

      case 'power_supply':
        const powerSupplyAttrs = product.attrs as PowerSupply;
        const power = powerSupplyAttrs.power 
          ? `${powerSupplyAttrs.power}W`
          : '';
        return {
          ...baseInfo,
          subtitle: `${power} • ${powerSupplyAttrs.efficiency} • ${powerSupplyAttrs.color}`,
        };

      case 'case':
        const caseAttrs = product.attrs as Case;
        return {
          ...baseInfo,
          subtitle: `${caseAttrs.cabinet_type} • ${caseAttrs.side_panel} • ${caseAttrs.color}`,
        };

      default:
        return baseInfo;
    }
  };

  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor={fieldId} className="text-right">
        {label}
      </Label>
      <div className="col-span-3">
        <Input
          id={`${fieldId}_search`}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
        />
        <Select 
          value={value} 
          onValueChange={onValueChange}
          onOpenChange={(open) => {
            if (open && onInitializeData) {
              console.log('🔽 SelectProductBuilds: Select opened, calling onInitializeData');
              onInitializeData();
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Not selected</SelectItem>
            
            {/* Show selected product first if it exists and no data loaded yet */}
            {selectedProduct && value !== 'none' && selectedProduct.id.toString() === value && products.length === 0 && !loading && (
              <SelectItem key={`current-${selectedProduct.id}`} value={selectedProduct.id.toString()}>
                <div className="flex flex-col gap-1 py-1">
                  <div className="text-sm leading-tight font-medium">
                    {getProductDisplayInfo(selectedProduct).title}
                  </div>
                  {getProductDisplayInfo(selectedProduct).subtitle && (
                    <div className="text-muted-foreground text-xs leading-tight">
                      {getProductDisplayInfo(selectedProduct).subtitle}
                    </div>
                  )}
                  <div className="text-xs font-medium text-green-600">
                    {getProductDisplayInfo(selectedProduct).price}
                    {getProductDisplayInfo(selectedProduct).rating && (
                      <span className="ml-2 text-yellow-600">★ {getProductDisplayInfo(selectedProduct).rating}</span>
                    )}
                  </div>
                </div>
              </SelectItem>
            )}
            
            {loading && products.length === 0 ? (
              <div className="text-muted-foreground p-2 text-center text-sm">Loading...</div>
            ) : products.length === 0 && !selectedProduct ? (
              <div className="text-muted-foreground p-2 text-center text-sm">Open to load products</div>
            ) : (
              <>
                {(() => {
                  const allProducts = [];
                  
                  // First, add the selected product if it exists and matches the current value (only if products are loaded)
                  if (selectedProduct && value !== 'none' && selectedProduct.id.toString() === value && products.length > 0) {
                    // Check if selected product is already in products list
                    const foundInProducts = products.find(p => p.id === selectedProduct.id);
                    if (!foundInProducts) {
                      allProducts.push({
                        product: selectedProduct,
                        isPreSelected: true
                      });
                    }
                  }
                  
                  // Then, add all other products
                  products.forEach(product => {
                    allProducts.push({
                      product: product,
                      isPreSelected: false
                    });
                  });
                  
                  return allProducts.map(({ product, isPreSelected }) => {
                    const displayInfo = getProductDisplayInfo(product);
                    
                    return (
                      <SelectItem key={product.id} value={product.id.toString()}>
                        <div className="flex flex-col gap-1 py-1">
                          <div className="text-sm leading-tight font-medium">
                            {displayInfo.title}
                          </div>
                          {displayInfo.subtitle && (
                            <div className="text-muted-foreground text-xs leading-tight">
                              {displayInfo.subtitle}
                            </div>
                          )}
                          <div className="text-xs font-medium text-green-600">
                            {displayInfo.price}
                            {displayInfo.rating && (
                              <span className="ml-2 text-yellow-600">★ {displayInfo.rating}</span>
                            )}
                          </div>
                        </div>
                      </SelectItem>
                    );
                  });
                })()}
                {hasMore && !loading && (
                  <div className="p-2">
                    <Button
                      onClick={onLoadMore}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      Load more
                    </Button>
                  </div>
                )}
                {loading && products.length > 0 && (
                  <div className="text-muted-foreground p-2 text-center text-sm">Loading more...</div>
                )}
                {!hasMore && products.length > 0 && (
                  <div className="text-muted-foreground p-2 text-center text-xs">
                    All products loaded ({products.length} total)
                  </div>
                )}
              </>
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
