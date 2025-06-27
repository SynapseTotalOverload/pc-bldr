import pyautogui
import time
import random
import platform
import threading
import sys
import signal
import subprocess

# --- Settings ---
TAB_SHORTCUTS = ['1', '2', '3']  # VSCode tab numbers (Ctrl/Cmd + 1/2/3)

# Global flag to control simulation
running = True

# --- Signal handler for graceful shutdown ---
def signal_handler(signum, frame):
    """Handle interrupt signals gracefully."""
    global running
    print("\n🛑 Interrupt signal received. Stopping simulation...")
    running = False

def setup_signal_handlers():
    """Setup signal handlers for graceful shutdown."""
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    print("💡 Press Ctrl+C to quit the simulation at any time.")

# Sample code snippets
CODE_SNIPPETS = [
    '''const useProducts = (category: string, page: number, search?: string) => {
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
};''',

    '''const ProductCard = ({ product }: { product: ProductRead }) => {
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
};''',

    '''const CategorySelector = ({ 
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
};''',

    '''const ProductSpecs = ({ attrs }: { attrs: ProductAttrs }) => {
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

  switch (attrs.type) {
    case 'cpu':
      return renderCPU(attrs);
    case 'gpu':
    case 'video_card':
      return renderGPU(attrs);
    default:
      return <div>Specifications not available</div>;
  }
};''',

    '''const ProductSearch = ({ 
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
};''',

    '''const ProductPagination = ({ 
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
};''',

    '''const ProductSkeleton = () => (
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
);''',

    '''const AmazonLink = ({ asin, children }: { asin: string; children: React.ReactNode }) => (
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
);''',

    '''const ProductRating = ({ rating }: { rating?: number }) => {
  if (!rating) return null;

  return (
    <div className="flex items-center gap-1">
      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      <span className="text-sm font-medium">{rating.toFixed(1)}</span>
    </div>
  );
};'''
]
 
# --- Helper Functions ---

def focus_ide_window():
    """Click in the terminal area of VSCode to focus there."""
    print("🎯 Clicking in VSCode terminal area...")
    
    try:
        # Get screen dimensions
        screen_width, screen_height = pyautogui.size()
        
        # Calculate position for terminal area (bottom portion of VSCode)
        # VSCode typically has terminal at the bottom
        terminal_x = screen_width // 2  # Center horizontally
        terminal_y = int(screen_height * 0.2)  # Bottom 20% of screen
        
        print(f"📍 Clicking at position: ({terminal_x}, {terminal_y})")
        
        # Move mouse to terminal area and click
        pyautogui.click(terminal_x, terminal_y)
        time.sleep(1.0)  # Longer pause to prevent dictionary trigger
        
        print("✅ Clicked in terminal area")
        return True
        
    except Exception as e:
        print(f"⚠️ Error clicking in terminal area: {e}")
        print("⚠️ Please click in the terminal area manually")
        return False

def random_pause(min_sec=0.3, max_sec=1.1):
    duration = random.uniform(min_sec, max_sec)
    print(f"⏸ Pausing for {duration:.2f} seconds")
    time.sleep(duration)

def switch_tab_and_prepare():
    """Switch VSCode tab, go to end of file, and add new line."""
    try:
        # Switch to next tab in VSCode (Cmd + Option + Right)
        print("➡️ Switching to next tab (Cmd + Option + Right)")
        pyautogui.hotkey('command', 'option', 'right')
        random_pause(0.3, 0.6)
        
        # Go to end of file using custom shortcut
        print("➡️ Moving cursor to end of file (Ctrl + Cmd + 7)")
        pyautogui.hotkey('ctrl', 'command', '7')
        random_pause(0.1, 0.3)

        print("➡️ Pressing Enter to create new line")
        pyautogui.press('enter')
        random_pause()
    except Exception as e:
        print(f"⚠️ Error in switch_tab_and_prepare: {e}")
        random_pause(0.5, 1.0)

def type_snippet():
    """Type a random code snippet and return how many lines typed."""
    try:
        snippet = random.choice(CODE_SNIPPETS)
        print("⌨️ Typing code snippet:")
        print(snippet)
        lines = snippet.split('\n')
        for line in lines:
            if not running:
                break
            # Add a small delay before typing to prevent accidental shortcuts
            time.sleep(0.1)
            pyautogui.write(line, interval=random.uniform(0.1, 0.15))
            time.sleep(0.05)  # Small delay before pressing enter
            pyautogui.press('enter')
            random_pause(0.05, 0.15)
        return len(lines)
    except Exception as e:
        print(f"⚠️ Error in type_snippet: {e}")
        return 0

def delete_lines(count):
    """Delete last typed lines, one by one."""
    try:
        print(f"🗑 Deleting {count} lines")
        for _ in range(count):
            if not running:
                break
            # Move to end of line first to ensure consistent selection
            pyautogui.press('end')
            random_pause(0.05, 0.1)
            pyautogui.hotkey('shift', 'home')  # Select line from end to start
            random_pause(0.05, 0.1)
            pyautogui.press('delete')          # Delete selected line
            random_pause(0.05, 0.1)
            pyautogui.press('up')              # Move cursor up to next line to delete
    except Exception as e:
        print(f"⚠️ Error in delete_lines: {e}")

# --- Main simulation loop ---

def simulate_dev_workflow(cycles=10):
    global running
    running = True
    
    # Setup signal handlers
    setup_signal_handlers()
    
    print("🟢 Starting simulation in 5 seconds. Please focus VSCode window now.")
    print("💡 Press Ctrl+C to quit the simulation at any time.")
    
    # Try to auto-focus on IDE window
  
    
    time.sleep(5)

    for i in range(cycles):
        if not running:
            print("🛑 Simulation stopped by user.")
            break
            
        print(f"\n🔁 Cycle {i + 1} of {cycles}")
        switch_tab_and_prepare()
        
        if not running:
            break
            
        line_count = type_snippet()
        random_pause(0.5, 1.5)

        # Randomly delete typed lines ~70% of the time
        if random.random() < 0.7:
            delete_lines(line_count)
        else:
            print("✅ Keeping typed snippet")

    print("\n✅ Simulation complete.")

# --- Run ---
if __name__ == "__main__":
    try:
        simulate_dev_workflow(cycles=15)
    except KeyboardInterrupt:
        print("\n🛑 Simulation interrupted by user.")
        running = False
