# React Snippets for PC Building Project

## Product Fetching Hook
```typescript
const useProducts = (category: string, page: number, search?: string) => {
  const [products, setProducts] = useState<ProductRead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const backendKey = FrontendToBackendCategoryMap[category.toLowerCase()];
      const searchParams = new URLSearchParams({
        category_id: ProductConstantMapIds[backendKey].toString(),
        page: page.toString(),
        ...(search && { search }),
      });
      
      const response = await instance.get(`/products?${searchParams}`);
      setProducts(response.data.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fetch failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category, page, search]);

  return { products, loading, error, refetch: fetchProducts };
};
```

## Single Product Hook
```typescript
const useProduct = (productId: string) => {
  const [product, setProduct] = useState<ProductRead | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = async () => {
    if (!productId) return;
    
    setLoading(true);
    try {
      const response = await instance.get(`/products/${productId}`);
      setProduct(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Product not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  return { product, loading, error, refetch: fetchProduct };
};
```

## Product Card Component
```typescript
const ProductCard = ({ product }: { product: ProductRead }) => {
  const CategoryIcon = categoryIcons[product.attrs.type] || Cpu;
  const categoryName = PRODUCT_TYPE_NAMES[product.attrs.type] || product.attrs.type;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2 mb-2">
          <CategoryIcon className="h-4 w-4 text-blue-600" />
          <Badge variant="secondary" className="text-xs">
            {categoryName}
          </Badge>
        </div>
        <CardTitle className="text-lg line-clamp-2">{product.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-green-600">
            {product.price ? `$${product.price}` : 'N/A'}
          </div>
          <Link href={`/products/${product.id}`}>
            <Button size="sm" variant="outline">
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
```

## Category Selector Component
```typescript
const CategorySelector = ({ 
  selectedCategory, 
  onCategoryChange 
}: {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {Object.entries(PRODUCT_TYPE_NAMES).map(([key, name]) => (
        <Button
          key={key}
          variant={selectedCategory === key ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(key)}
          className="flex items-center gap-2"
        >
          {React.createElement(categoryIcons[key] || Cpu, { size: 16 })}
          {name}
        </Button>
      ))}
    </div>
  );
};
```

## Product Specifications Renderer
```typescript
const ProductSpecs = ({ attrs }: { attrs: ProductAttrs }) => {
  const renderCPU = (attrs: CPU) => (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Cores</span>
          <span className="font-medium">{attrs.cores}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Threads</span>
          <span className="font-medium">{attrs.threads}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Socket</span>
          <span className="font-medium">{attrs.socket_type}</span>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Base Speed</span>
          <span className="font-medium">{attrs.base_speed}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Turbo Speed</span>
          <span className="font-medium">{attrs.turbo_speed}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Architecture</span>
          <span className="font-medium">{attrs.architechture}</span>
        </div>
      </div>
    </div>
  );

  const renderGPU = (attrs: GPU) => (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Memory</span>
          <span className="font-medium">{attrs.memory} GB</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Interface</span>
          <span className="font-medium">{attrs.interface}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Chipset</span>
          <span className="font-medium">{attrs.chipset}</span>
        </div>
      </div>
      <div className="space-y-2">
        {attrs.base_clock && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Base Clock</span>
            <span className="font-medium">{attrs.base_clock} MHz</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-muted-foreground">Frame Sync</span>
          <span className="font-medium">{attrs.frame_sync}</span>
        </div>
      </div>
    </div>
  );

  switch (attrs.type) {
    case 'cpu':
      return renderCPU(attrs);
    case 'gpu':
    case 'video_card':
      return renderGPU(attrs);
    default:
      return <div>Specifications not available</div>;
  }
};
```

## Search and Filter Component
```typescript
const ProductSearch = ({ 
  search, 
  onSearchChange, 
  viewMode, 
  onViewModeChange 
}: {
  search: string;
  onSearchChange: (value: string) => void;
  viewMode: 'table' | 'card';
  onViewModeChange: (mode: 'table' | 'card') => void;
}) => {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="flex-1">
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && onViewModeChange(value as 'table' | 'card')}>
        <ToggleGroupItem value="table" aria-label="Table view">
          <Table className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="card" aria-label="Card view">
          <LayoutGrid className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};
```

## Pagination Component
```typescript
const ProductPagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
```

## Loading States
```typescript
const ProductSkeleton = () => (
  <Card className="overflow-hidden">
    <CardHeader className="pb-3">
      <div className="flex items-center gap-2 mb-2">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-5 w-16" />
      </div>
      <Skeleton className="h-6 w-full" />
    </CardHeader>
    <CardContent>
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-24" />
      </div>
    </CardContent>
  </Card>
);

const ProductGridSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: 6 }).map((_, i) => (
      <ProductSkeleton key={i} />
    ))}
  </div>
);
```

## Error Handling
```typescript
const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error('Error caught by boundary:', error);
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>
            Something went wrong. Please refresh the page and try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return children;
};
```

## Amazon Link Component
```typescript
const AmazonLink = ({ asin, children }: { asin: string; children: React.ReactNode }) => (
  <Button variant="outline" className="w-full" asChild>
    <a 
      href={`https://amazon.com/dp/${asin}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2"
    >
      <ExternalLink className="h-4 w-4" />
      {children}
    </a>
  </Button>
);
```

## Product Rating Component
```typescript
const ProductRating = ({ rating }: { rating?: number }) => {
  if (!rating) return null;

  return (
    <div className="flex items-center gap-1">
      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      <span className="text-sm font-medium">{rating.toFixed(1)}</span>
    </div>
  );
};
``` 