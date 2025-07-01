import { useState, useEffect, useCallback } from 'react';
import { ProductRead } from '@/types/prodcuts-base';
import { getCompatibleProducts, SelectedComponents } from '@/lib/products-api';

interface UseSelectCpuCoolerReturn {
  cpuCoolerSearch: string;
  setCpuCoolerSearch: (search: string) => void;
  cpuCoolerPage: number;
  setCpuCoolerPage: (page: number) => void;
  hasMoreCpuCooler: boolean;
  allCpuCoolerProducts: ProductRead[];
  filteredCpuCoolerProducts: ProductRead[];
  cpuCoolerLoading: boolean;
  
  loadMoreCpuCoolers: () => void;
  resetCpuCoolerData: () => void;
  initializeCpuCoolerData: () => void; 
}

export function useSelectCpuCooler(selectedComponents?: SelectedComponents): UseSelectCpuCoolerReturn {
  const [cpuCoolerPage, setCpuCoolerPage] = useState(1);
  const [hasMoreCpuCooler, setHasMoreCpuCooler] = useState(true);
  const [cpuCoolerSearch, setCpuCoolerSearch] = useState('');
  const [allCpuCoolerProducts, setAllCpuCoolerProducts] = useState<ProductRead[]>([]);
  const [cpuCoolerLoading, setCpuCoolerLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [lastSelectedComponents, setLastSelectedComponents] = useState<SelectedComponents | undefined>(undefined);

  useEffect(() => {
    const relevantComponents = {
      case: selectedComponents?.case,
    };
    const currentKey = JSON.stringify(relevantComponents);
    const lastRelevantComponents = {
      case: lastSelectedComponents?.case,
    };
    const lastKey = JSON.stringify(lastRelevantComponents);
    
    if (isInitialized && currentKey !== lastKey) {
      console.log('🔄 CpuCooler: Relevant components (case) changed, resetting for next initialization');
      setIsInitialized(false);
      setCpuCoolerSearch(''); // Clear search when components change
    }
    setLastSelectedComponents(selectedComponents);
  }, [selectedComponents, isInitialized, lastSelectedComponents]);

  const initializeCpuCoolerData = useCallback(() => {
    console.log('🚀 CPU Cooler: Fetching data with query:', cpuCoolerSearch, 'and selectedComponents:', selectedComponents);
    setIsInitialized(true);
    setCpuCoolerPage(1);
    setCpuCoolerLoading(true);
    
    (async () => {
      try {
        const data = await getCompatibleProducts({
          selected_components: selectedComponents || {},
          category_id: 2,
          page: 1,
          page_size: 20,
          query: cpuCoolerSearch.trim() || undefined, // Use current search value
        });

        setAllCpuCoolerProducts(data.items);
        setHasMoreCpuCooler(data.pagination.currentPage < data.pagination.totalPages);
        console.log('✅ CPU Cooler: Fetch completed - received', data.items.length, 'products for query:', cpuCoolerSearch);
      } catch (error) {
        console.error('❌ CPU Cooler: Error in fetch:', error);
        setAllCpuCoolerProducts([]);
        setHasMoreCpuCooler(false);
      } finally {
        setCpuCoolerLoading(false);
      }
    })();
  }, [cpuCoolerSearch, selectedComponents]); 

  const filteredCpuCoolerProducts = allCpuCoolerProducts;

  // Search handled by initializeData function with query parameter

  useEffect(() => {
    if (isInitialized && cpuCoolerPage > 1) {
      setCpuCoolerLoading(true);
      
      (async () => {
        try {
          const data = await getCompatibleProducts({
            selected_components: selectedComponents || {},
            category_id: 2,
            page: cpuCoolerPage,
            page_size: 20,
            query: cpuCoolerSearch.trim() || undefined,
          });

          setAllCpuCoolerProducts((prev) => {
            const existingIds = new Set(prev.map((p) => p.id));
            const newProducts = data.items.filter((p) => !existingIds.has(p.id));
            return [...prev, ...newProducts];
          });
          setHasMoreCpuCooler(data.pagination.currentPage < data.pagination.totalPages);
        } catch (error) {
          setHasMoreCpuCooler(false);
        } finally {
          setCpuCoolerLoading(false);
        }
      })();
    }
  }, [cpuCoolerPage, isInitialized, selectedComponents]);

  const loadMoreCpuCoolers = useCallback(() => {
    if (hasMoreCpuCooler && !cpuCoolerLoading && isInitialized) {
      setCpuCoolerPage(prev => prev + 1);
    }
  }, [hasMoreCpuCooler, cpuCoolerLoading, isInitialized]);

  const resetCpuCoolerData = useCallback(() => {
    setCpuCoolerPage(1);
    setHasMoreCpuCooler(true);
    setCpuCoolerSearch('');
    setAllCpuCoolerProducts([]);
    setIsInitialized(false);
  }, []);

  return {
    cpuCoolerSearch,
    setCpuCoolerSearch,
    cpuCoolerPage,
    setCpuCoolerPage,
    hasMoreCpuCooler,
    allCpuCoolerProducts,
    filteredCpuCoolerProducts,
    cpuCoolerLoading,
    
    loadMoreCpuCoolers,
    resetCpuCoolerData,
    initializeCpuCoolerData, 
  };
}
