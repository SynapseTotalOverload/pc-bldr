import { useState, useEffect, useCallback } from 'react';
import { ProductRead, CPU } from '@/types/prodcuts-base';
import { getCompatibleProducts, SelectedComponents } from '@/lib/products-api';

interface UseSelectCpuReturn {
  // State
  cpuSearch: string;
  setCpuSearch: (search: string) => void;
  cpuPage: number;
  setCpuPage: (page: number) => void;
  hasMoreCpu: boolean;
  allCpuProducts: ProductRead[];
  filteredCpuProducts: ProductRead[];
  cpuLoading: boolean;
  
  // Actions
  loadMoreCpus: () => void;
  resetCpuData: () => void;
  initializeCpuData: () => void; // Manual initialization for lazy loading
}

export function useSelectCpu(selectedComponents?: SelectedComponents): UseSelectCpuReturn {
  // CPU Products state
  const [cpuPage, setCpuPage] = useState(1);
  const [hasMoreCpu, setHasMoreCpu] = useState(true);
  const [cpuSearch, setCpuSearch] = useState('');
  const [allCpuProducts, setAllCpuProducts] = useState<ProductRead[]>([]);
  const [cpuLoading, setCpuLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [lastSelectedComponents, setLastSelectedComponents] = useState<SelectedComponents | undefined>(undefined);

  // Reset when selectedComponents change significantly (but only if initialized)
  useEffect(() => {
    // Only track changes in components that affect CPU: motherboard and ram
    const relevantComponents = {
      motherboard: selectedComponents?.motherboard,
      ram: selectedComponents?.ram,
    };
    const currentKey = JSON.stringify(relevantComponents);
    const lastRelevantComponents = {
      motherboard: lastSelectedComponents?.motherboard,
      ram: lastSelectedComponents?.ram,
    };
    const lastKey = JSON.stringify(lastRelevantComponents);
    
    if (isInitialized && currentKey !== lastKey) {
      console.log('🔄 CPU: Relevant components (motherboard/ram) changed, resetting for next initialization');
      setIsInitialized(false);
      setCpuSearch(''); // Clear search when components change
      // Don't reset the products data - keep selected CPU visible
      // setAllCpuProducts([]);
      // setCpuPage(1);
      // setHasMoreCpu(true);
    }
    setLastSelectedComponents(selectedComponents);
  }, [selectedComponents, isInitialized, lastSelectedComponents]);
    
  // Manual initialization function for lazy loading
  const initializeCpuData = useCallback(() => {
    console.log('🚀 CPU: Fetching data with query:', cpuSearch, 'and selectedComponents:', selectedComponents);
    setIsInitialized(true);
    setCpuPage(1);
    setCpuLoading(true);
    
    (async () => {
      try {
        const data = await getCompatibleProducts({
          selected_components: selectedComponents || {},
          category_id: 1, // CPU category
          page: 1,
          page_size: 20,
          query: cpuSearch.trim() || undefined, // Use current search value
        });

        setAllCpuProducts(data.items);
        setHasMoreCpu(data.pagination.currentPage < data.pagination.totalPages);
        console.log('✅ CPU: Fetch completed - received', data.items.length, 'products for query:', cpuSearch);
      } catch (error) {
        console.error('❌ CPU: Error in fetch:', error);
        setAllCpuProducts([]);
        setHasMoreCpu(false);
      } finally {
        setCpuLoading(false);
      }
    })();
  }, [cpuSearch, selectedComponents]); // Empty dependencies to prevent recreation

  // Since backend now handles all filtering, filteredCpuProducts is same as allCpuProducts
  const filteredCpuProducts = allCpuProducts;

  // Search will be handled by initializeData function with query parameter
  // No automatic refetch on search change - user will trigger manually

  // Load more pages when page changes
  useEffect(() => {
    if (isInitialized && cpuPage > 1) {
      setCpuLoading(true);
      
      (async () => {
        try {
          const data = await getCompatibleProducts({
            selected_components: selectedComponents || {},
            category_id: 1, // CPU category
            page: cpuPage,
            page_size: 20,
            query: cpuSearch.trim() || undefined,
          });

          // Append to existing products
        setAllCpuProducts((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
            const newProducts = data.items.filter((p) => !existingIds.has(p.id));
          return [...prev, ...newProducts];
        });
          setHasMoreCpu(data.pagination.currentPage < data.pagination.totalPages);
          console.log('✅ CPU: Load more - received', data.items.length, 'products, page', data.pagination.currentPage);
        } catch (error) {
          console.error('❌ CPU: Error loading more:', error);
          setHasMoreCpu(false);
        } finally {
          setCpuLoading(false);
        }
      })();
    }
  }, [cpuPage, isInitialized, selectedComponents]);

  // Actions
  const loadMoreCpus = useCallback(() => {
    if (hasMoreCpu && !cpuLoading && isInitialized) {
      setCpuPage(prev => prev + 1);
    }
  }, [hasMoreCpu, cpuLoading, isInitialized]);

  const resetCpuData = useCallback(() => {
    setCpuPage(1);
    setHasMoreCpu(true);
    setCpuSearch('');
    setAllCpuProducts([]);
    setIsInitialized(false);
  }, []);

  return {
    // State
    cpuSearch,
    setCpuSearch,
    cpuPage,
    setCpuPage,
    hasMoreCpu,
    allCpuProducts,
    filteredCpuProducts,
    cpuLoading,
    
    // Actions
    loadMoreCpus,
    resetCpuData,
    initializeCpuData, // New function for manual initialization
  };
}
