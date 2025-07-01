import { useState, useEffect, useCallback } from 'react';
import { ProductRead } from '@/types/prodcuts-base';
import { getCompatibleProducts, SelectedComponents } from '@/lib/products-api';

interface UseSelectMotherboardReturn {
  motherboardSearch: string;
  setMotherboardSearch: (search: string) => void;
  motherboardPage: number;
  setMotherboardPage: (page: number) => void;
  hasMoreMotherboard: boolean;
  allMotherboardProducts: ProductRead[];
  filteredMotherboardProducts: ProductRead[];
  motherboardLoading: boolean;
  
  loadMoreMotherboards: () => void;
  resetMotherboardData: () => void;
  initializeMotherboardData: () => void; 
}

export function useSelectMotherboard(selectedComponents?: SelectedComponents): UseSelectMotherboardReturn {
  const [motherboardPage, setMotherboardPage] = useState(1);
  const [hasMoreMotherboard, setHasMoreMotherboard] = useState(true);
  const [motherboardSearch, setMotherboardSearch] = useState('');
  const [allMotherboardProducts, setAllMotherboardProducts] = useState<ProductRead[]>([]);
  const [motherboardLoading, setMotherboardLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [lastSelectedComponents, setLastSelectedComponents] = useState<SelectedComponents | undefined>(undefined);

  useEffect(() => {
    const relevantComponents = {
      cpu: selectedComponents?.cpu,
      ram: selectedComponents?.ram,
    };
    const currentKey = JSON.stringify(relevantComponents);
    const lastRelevantComponents = {
      cpu: lastSelectedComponents?.cpu,
      ram: lastSelectedComponents?.ram,
    };
    const lastKey = JSON.stringify(lastRelevantComponents);
    
    if (isInitialized && currentKey !== lastKey) {
      console.log('🔄 Motherboard: Relevant components (cpu/ram) changed, resetting for next initialization');
      setIsInitialized(false);
    }
    setLastSelectedComponents(selectedComponents);
  }, [selectedComponents, isInitialized, lastSelectedComponents]);

  const initializeMotherboardData = useCallback(() => {
    console.log('🚀 Motherboard: Fetching data with query:', motherboardSearch, 'and selectedComponents:', selectedComponents);
    setIsInitialized(true);
    setMotherboardPage(1);
    setMotherboardLoading(true);
    
    (async () => {
      try {
        const data = await getCompatibleProducts({
          selected_components: selectedComponents || {},
          category_id: 4,
          page: 1,
          page_size: 20,
          query: motherboardSearch.trim() || undefined, // Use current search value
        });

        setAllMotherboardProducts(data.items);
        setHasMoreMotherboard(data.pagination.currentPage < data.pagination.totalPages);
        console.log('✅ Motherboard: Fetch completed - received', data.items.length, 'products for query:', motherboardSearch);
      } catch (error) {
        console.error('❌ Motherboard: Error in fetch:', error);
        setAllMotherboardProducts([]);
        setHasMoreMotherboard(false);
      } finally {
        setMotherboardLoading(false);
      }
    })();
  }, [motherboardSearch, selectedComponents]); 

  const filteredMotherboardProducts = allMotherboardProducts;

  // Search handled by initializeData function with query parameter

  useEffect(() => {
    if (isInitialized && motherboardPage > 1) {
      setMotherboardLoading(true);
      
      (async () => {
        try {
          const data = await getCompatibleProducts({
            selected_components: selectedComponents || {},
            category_id: 4,
            page: motherboardPage,
            page_size: 20,
            query: motherboardSearch.trim() || undefined,
          });

          setAllMotherboardProducts((prev) => {
            const existingIds = new Set(prev.map((p) => p.id));
            const newProducts = data.items.filter((p) => !existingIds.has(p.id));
            return [...prev, ...newProducts];
          });
          setHasMoreMotherboard(data.pagination.currentPage < data.pagination.totalPages);
        } catch (error) {
          setHasMoreMotherboard(false);
        } finally {
          setMotherboardLoading(false);
        }
      })();
    }
  }, [motherboardPage, isInitialized, selectedComponents]);

  const loadMoreMotherboards = useCallback(() => {
    if (hasMoreMotherboard && !motherboardLoading && isInitialized) {
      setMotherboardPage(prev => prev + 1);
    }
  }, [hasMoreMotherboard, motherboardLoading, isInitialized]);

  const resetMotherboardData = useCallback(() => {
    setMotherboardPage(1);
    setHasMoreMotherboard(true);
    setMotherboardSearch('');
    setAllMotherboardProducts([]);
    setIsInitialized(false);
  }, []);

  return {
    motherboardSearch,
    setMotherboardSearch,
    motherboardPage,
    setMotherboardPage,
    hasMoreMotherboard,
    allMotherboardProducts,
    filteredMotherboardProducts,
    motherboardLoading,
    
    loadMoreMotherboards,
    resetMotherboardData,
    initializeMotherboardData, 
  };
}
