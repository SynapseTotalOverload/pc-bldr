import { useState, useEffect, useCallback } from 'react';
import { ProductRead } from '@/types/prodcuts-base';
import { getCompatibleProducts, SelectedComponents } from '@/lib/products-api';

interface UseSelectMemoryReturn {
  memorySearch: string;
  setMemorySearch: (search: string) => void;
  memoryPage: number;
  setMemoryPage: (page: number) => void;
  hasMoreMemory: boolean;
  allMemoryProducts: ProductRead[];
  filteredMemoryProducts: ProductRead[];
  memoryLoading: boolean;
  
  loadMoreMemories: () => void;
  resetMemoryData: () => void;
  initializeMemoryData: () => void; 
}

export function useSelectMemory(selectedComponents?: SelectedComponents): UseSelectMemoryReturn {
  const [memoryPage, setMemoryPage] = useState(1);
  const [hasMoreMemory, setHasMoreMemory] = useState(true);
  const [memorySearch, setMemorySearch] = useState('');
  const [allMemoryProducts, setAllMemoryProducts] = useState<ProductRead[]>([]);
  const [memoryLoading, setMemoryLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [lastSelectedComponents, setLastSelectedComponents] = useState<SelectedComponents | undefined>(undefined);

  useEffect(() => {
    const relevantComponents = {
      cpu: selectedComponents?.cpu,
      motherboard: selectedComponents?.motherboard,
    };
    const currentKey = JSON.stringify(relevantComponents);
    const lastRelevantComponents = {
      cpu: lastSelectedComponents?.cpu,
      motherboard: lastSelectedComponents?.motherboard,
    };
    const lastKey = JSON.stringify(lastRelevantComponents);
    
    if (isInitialized && currentKey !== lastKey) {
      console.log('🔄 Memory: Relevant components (cpu/motherboard) changed, resetting for next initialization');
      setIsInitialized(false);
    }
    setLastSelectedComponents(selectedComponents);
  }, [selectedComponents, isInitialized, lastSelectedComponents]);

  const initializeMemoryData = useCallback(() => {
    console.log('🚀 Memory: Fetching data with query:', memorySearch, 'and selectedComponents:', selectedComponents);
    setIsInitialized(true);
    setMemoryPage(1);
    setMemoryLoading(true);
    
    (async () => {
      try {
        const data = await getCompatibleProducts({
          selected_components: selectedComponents || {},
          category_id: 5,
          page: 1,
          page_size: 20,
          query: memorySearch.trim() || undefined, // Use current search value
        });

        setAllMemoryProducts(data.items);
        setHasMoreMemory(data.pagination.currentPage < data.pagination.totalPages);
        console.log('✅ Memory: Fetch completed - received', data.items.length, 'products for query:', memorySearch);
      } catch (error) {
        console.error('❌ Memory: Error in fetch:', error);
        setAllMemoryProducts([]);
        setHasMoreMemory(false);
      } finally {
        setMemoryLoading(false);
      }
    })();
  }, [memorySearch, selectedComponents]); 

  const filteredMemoryProducts = allMemoryProducts;

  // Search handled by initializeData function with query parameter

  useEffect(() => {
    if (isInitialized && memoryPage > 1) {
      setMemoryLoading(true);
      
      (async () => {
        try {
          const data = await getCompatibleProducts({
            selected_components: selectedComponents || {},
            category_id: 5,
            page: memoryPage,
            page_size: 20,
            query: memorySearch.trim() || undefined,
          });

          setAllMemoryProducts((prev) => {
            const existingIds = new Set(prev.map((p) => p.id));
            const newProducts = data.items.filter((p) => !existingIds.has(p.id));
            return [...prev, ...newProducts];
          });
          setHasMoreMemory(data.pagination.currentPage < data.pagination.totalPages);
        } catch (error) {
          setHasMoreMemory(false);
        } finally {
          setMemoryLoading(false);
        }
      })();
    }
  }, [memoryPage, isInitialized, selectedComponents]);

  const loadMoreMemories = useCallback(() => {
    if (hasMoreMemory && !memoryLoading && isInitialized) {
      setMemoryPage(prev => prev + 1);
    }
  }, [hasMoreMemory, memoryLoading, isInitialized]);

  const resetMemoryData = useCallback(() => {
    setMemoryPage(1);
    setHasMoreMemory(true);
    setMemorySearch('');
    setAllMemoryProducts([]);
    setIsInitialized(false);
  }, []);

  return {
    memorySearch,
    setMemorySearch,
    memoryPage,
    setMemoryPage,
    hasMoreMemory,
    allMemoryProducts,
    filteredMemoryProducts,
    memoryLoading,
    
    loadMoreMemories,
    resetMemoryData,
    initializeMemoryData, 
  };
}
