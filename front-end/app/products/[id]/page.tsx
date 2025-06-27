'use client';

import { use } from 'react';
import { useProduct } from '@/hooks/useProduct';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Star, 
  ExternalLink, 
  Cpu, 
  HardDrive, 
  Monitor, 
  Power, 
  Fan,
  ArrowLeft,
  Database,
  Box
} from 'lucide-react';
import Link from 'next/link';
import { PRODUCT_TYPE_NAMES } from '@/types/prodcuts-base';
import { Input } from '@/components/ui/input';

const categoryIcons = {
  cpu: Cpu,
  cpu_cooler: Fan,
  gpu: Monitor,
  memory: Database,
  motherboard: Box,
  internal_hard_drive: HardDrive,
  power_supply: Power,
  video_card: Monitor,
  case: Box,
};

const formatPrice = (price?: number) => {
  if (!price) return 'Price not available';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

const formatRating = (rating?: number) => {
  if (!rating) return null;
  return (
    <div className="flex items-center gap-1">
      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      <span className="text-sm font-medium">{rating.toFixed(1)}</span>
    </div>
  );
};

const renderCPUAttributes = (attrs: any) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Cores</span>
        <span className="font-medium">{attrs.cores}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Threads</span>
        <span className="font-medium">{attrs.threads}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Socket Type</span>
        <span className="font-medium">{attrs.socket_type}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Base Speed</span>
        <span className="font-medium">{attrs.base_speed}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Turbo Speed</span>
        <span className="font-medium">{attrs.turbo_speed}</span>
      </div>
    </div>
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Architecture</span>
        <span className="font-medium">{attrs.architechture}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Core Family</span>
        <span className="font-medium">{attrs.core_family}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Memory Type</span>
        <span className="font-medium">{attrs.memory_type}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Memory Speed</span>
        <span className="font-medium">{attrs.memory_speed} MHz</span>
      </div>
      {attrs.integrated_graphics && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">Integrated Graphics</span>
          <span className="font-medium">{attrs.integrated_graphics}</span>
        </div>
      )}
    </div>
  </div>
);

const renderGPUAttributes = (attrs: any) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Memory</span>
        <span className="font-medium">{attrs.memory} GB</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Memory Interface</span>
        <span className="font-medium">{attrs.mem_interface}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Interface</span>
        <span className="font-medium">{attrs.interface}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Chipset</span>
        <span className="font-medium">{attrs.chipset}</span>
      </div>
      {attrs.length && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">Length</span>
          <span className="font-medium">{attrs.length} mm</span>
        </div>
      )}
    </div>
    <div className="space-y-3">
      {attrs.base_clock && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">Base Clock</span>
          <span className="font-medium">{attrs.base_clock} MHz</span>
        </div>
      )}
      {attrs.clock_speed && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">Clock Speed</span>
          <span className="font-medium">{attrs.clock_speed} MHz</span>
        </div>
      )}
      <div className="flex justify-between">
        <span className="text-muted-foreground">Frame Sync</span>
        <span className="font-medium">{attrs.frame_sync}</span>
      </div>
    </div>
  </div>
);

const renderRAMAttributes = (attrs: any) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Total Memory</span>
        <span className="font-medium">{attrs.total_memory} GB</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Unit Memory</span>
        <span className="font-medium">{attrs.one_unit_memory} GB</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Quantity</span>
        <span className="font-medium">{attrs.quantity}</span>
      </div>
    </div>
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-muted-foreground">RAM Type</span>
        <span className="font-medium">{attrs.ram_type}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">RAM Speed</span>
        <span className="font-medium">{attrs.ram_speed} MHz</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">CAS Latency</span>
        <span className="font-medium">{attrs.cas_latency}</span>
      </div>
    </div>
  </div>
);

const renderStorageAttributes = (attrs: any) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="space-y-3">
      {attrs.capacity && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">Capacity</span>
          <span className="font-medium">{attrs.capacity} GB</span>
        </div>
      )}
      <div className="flex justify-between">
        <span className="text-muted-foreground">Memory Type</span>
        <span className="font-medium">{attrs.mem_type}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Interface</span>
        <span className="font-medium">{attrs.interface}</span>
      </div>
    </div>
    <div className="space-y-3">
      {attrs.cache_mem && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">Cache Memory</span>
          <span className="font-medium">{attrs.cache_mem} MB</span>
        </div>
      )}
      <div className="flex justify-between">
        <span className="text-muted-foreground">Form Factor</span>
        <span className="font-medium">{attrs.form_factor}</span>
      </div>
    </div>
  </div>
);

const renderMotherboardAttributes = (attrs: any) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Chipset</span>
        <span className="font-medium">{attrs.chipset}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Form Factor</span>
        <span className="font-medium">{attrs.form_factor}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Socket Type</span>
        <span className="font-medium">{attrs.socket_type}</span>
      </div>
    </div>
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-muted-foreground">RAM Slots</span>
        <span className="font-medium">{attrs.ram_slots}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Max RAM Support</span>
        <span className="font-medium">{attrs.max_ram_support} GB</span>
      </div>
    </div>
  </div>
);

const renderPowerSupplyAttributes = (attrs: any) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="space-y-3">
      {attrs.power && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">Power</span>
          <span className="font-medium">{attrs.power} W</span>
        </div>
      )}
      <div className="flex justify-between">
        <span className="text-muted-foreground">Efficiency</span>
        <span className="font-medium">{attrs.efficiency}</span>
      </div>
    </div>
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Color</span>
        <span className="font-medium">{attrs.color}</span>
      </div>
    </div>
  </div>
);

const renderCPUCoolerAttributes = (attrs: any) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="space-y-3">
      {attrs.fan_rpm_base && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">Base Fan RPM</span>
          <span className="font-medium">{attrs.fan_rpm_base}</span>
        </div>
      )}
      {attrs.fan_rpm_max && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">Max Fan RPM</span>
          <span className="font-medium">{attrs.fan_rpm_max}</span>
        </div>
      )}
    </div>
    <div className="space-y-3">
      {attrs.noise_level_base && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">Base Noise Level</span>
          <span className="font-medium">{attrs.noise_level_base} dB</span>
        </div>
      )}
      {attrs.noise_level_max && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">Max Noise Level</span>
          <span className="font-medium">{attrs.noise_level_max} dB</span>
        </div>
      )}
      <div className="flex justify-between">
        <span className="text-muted-foreground">Color</span>
        <span className="font-medium">{attrs.color}</span>
      </div>
    </div>
  </div>
);

const renderCaseAttributes = (attrs: any) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Side Panel</span>
        <span className="font-medium">{attrs.side_panel}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Cabinet Type</span>
        <span className="font-medium">{attrs.cabinet_type}</span>
      </div>
    </div>
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Color</span>
        <span className="font-medium">{attrs.color}</span>
      </div>
    </div>
  </div>
);

const renderAttributes = (attrs: any) => {
  switch (attrs.type) {
    case 'cpu':
      return renderCPUAttributes(attrs);
    case 'gpu':
    case 'video_card':
      return renderGPUAttributes(attrs);
    case 'memory':
      return renderRAMAttributes(attrs);
    case 'internal_hard_drive':
      return renderStorageAttributes(attrs);
    case 'motherboard':
      return renderMotherboardAttributes(attrs);
    case 'power_supply':
      return renderPowerSupplyAttributes(attrs);
    case 'cpu_cooler':
      return renderCPUCoolerAttributes(attrs);
    case 'case':
      return renderCaseAttributes(attrs);
    default:
      return (
        <div className="text-muted-foreground">
          <pre className="whitespace-pre-wrap">{JSON.stringify(attrs, null, 2)}</pre>
        </div>
      );
  }
};

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { product, loading, error } = useProduct(id);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6">
          <Skeleton className="h-8 w-32" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Alert>
          <AlertDescription>Product not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  const CategoryIcon = categoryIcons[product.attrs.type as keyof typeof categoryIcons] || Cpu;
  const categoryName = PRODUCT_TYPE_NAMES[product.attrs.type as keyof typeof PRODUCT_TYPE_NAMES] || product.attrs.type;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Header */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CategoryIcon className="h-5 w-5 text-blue-600" />
                    <Badge variant="secondary">{categoryName}</Badge>
                  </div>
                  <CardTitle className="text-2xl font-bold">{product.title}</CardTitle>
                  <div className="flex items-center gap-4 mt-2">
                    {formatRating(product.rating)}
                    <span className="text-sm text-muted-foreground">ASIN: {product.asin}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Product Specifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CategoryIcon className="h-5 w-5" />
                Specifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Brand & Model */}
                <div>
                  <h4 className="font-semibold mb-3">Basic Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Brand</span>
                      <span className="font-medium">{product.attrs.brand}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Model</span>
                      <span className="font-medium">{product.attrs.model}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Technical Specifications */}
                <div>
                  <h4 className="font-semibold mb-3">Technical Specifications</h4>
                  {renderAttributes(product.attrs)}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Price Card */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {formatPrice(product.price)}
                  </div>
                  {product.rating && (
                    <div className="flex items-center justify-center gap-1 mt-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{product.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
                <Button className="w-full" size="lg">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on Amazon
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Product Details */}
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <span className="font-medium">{categoryName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ASIN</span>
                  <span className="font-medium font-mono text-sm">{product.asin}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Added</span>
                  <span className="font-medium">
                    {new Date(product.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Amazon Link */}
          <Card>
            <CardContent className="pt-6">
              <Button 
                variant="outline" 
                className="w-full" 
                asChild
              >
                <a 
                  href={`https://amazon.com/dp/${product.asin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on Amazon
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
