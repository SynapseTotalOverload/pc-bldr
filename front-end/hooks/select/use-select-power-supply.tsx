import { useState, useEffect, useCallback } from 'react';
import { ProductRead } from '@/types/prodcuts-base';
import { getCompatibleProducts, SelectedComponents } from '@/lib/products-api';

interface UseSelectPowerSupplyReturn {
  powerSupplySearch: string;
  setPowerSupplySearch: (search: string) => void;
  powerSupplyLoading: boolean;
  hasMorePowerSupply: boolean;
  filteredPowerSupplyProducts: ProductRead[];
  
  loadMorePowerSupplies: () => void;
  resetPowerSupplyData: () => void;
  initializePowerSupplyData: () => void; 
}

export function useSelectPowerSupply(selectedComponents?: SelectedComponents): UseSelectPowerSupplyReturn {
  const [powerSupplyPage, setPowerSupplyPage] = useState(1);
  const [hasMorePowerSupply, setHasMorePowerSupply] = useState(true);
  const [powerSupplySearch, setPowerSupplySearch] = useState('');
  const [allPowerSupplyProducts, setAllPowerSupplyProducts] = useState<ProductRead[]>([]);
  const [powerSupplyLoading, setPowerSupplyLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [lastSelectedComponents, setLastSelectedComponents] = useState<SelectedComponents | undefined>(undefined);

  useEffect(() => {
    const relevantComponents = {
      cpu: selectedComponents?.cpu,
      gpu: selectedComponents?.gpu,
    };
    const currentKey = JSON.stringify(relevantComponents);
    const lastRelevantComponents = {
      cpu: lastSelectedComponents?.cpu,
      gpu: lastSelectedComponents?.gpu,
    };
    const lastKey = JSON.stringify(lastRelevantComponents);
    
    if (isInitialized && currentKey !== lastKey) {
      console.log('🔄 PowerSupply: Relevant components (cpu/gpu) changed, resetting for next initialization');
      setIsInitialized(false);
    }
    setLastSelectedComponents(selectedComponents);
  }, [selectedComponents, isInitialized, lastSelectedComponents]);

  const initializePowerSupplyData = useCallback(() => {
    console.log('🚀 Power Supply: Fetching data with query:', powerSupplySearch, 'and selectedComponents:', selectedComponents);
    setIsInitialized(true);
    setPowerSupplyPage(1);
    setPowerSupplyLoading(true);
    
    (async () => {
      try {
        const data = await getCompatibleProducts({
          selected_components: selectedComponents || {},
          category_id: 7,
          page: 1,
          page_size: 20,
          query: powerSupplySearch.trim() || undefined, // Use current search value
        });

        setAllPowerSupplyProducts(data.items);
        setHasMorePowerSupply(data.pagination.currentPage < data.pagination.totalPages);
        console.log('✅ Power Supply: Fetch completed - received', data.items.length, 'products for query:', powerSupplySearch);
      } catch (error) {
        console.error('❌ Power Supply: Error in fetch:', error);
        setAllPowerSupplyProducts([]);
        setHasMorePowerSupply(false);
      } finally {
        setPowerSupplyLoading(false);
      }
    })();
  }, [powerSupplySearch, selectedComponents]); 

  const filteredPowerSupplyProducts = allPowerSupplyProducts;

  // Search handled by initializeData function with query parameter

  useEffect(() => {
    if (isInitialized && powerSupplyPage > 1) {
      setPowerSupplyLoading(true);
      
      (async () => {
        try {
          const data = await getCompatibleProducts({
            selected_components: selectedComponents || {},
            category_id: 7,
            page: powerSupplyPage,
            page_size: 20,
            query: powerSupplySearch.trim() || undefined,
          });

          setAllPowerSupplyProducts((prev) => {
            const existingIds = new Set(prev.map((p) => p.id));
            const newProducts = data.items.filter((p) => !existingIds.has(p.id));
            return [...prev, ...newProducts];
          });
          setHasMorePowerSupply(data.pagination.currentPage < data.pagination.totalPages);
        } catch (error) {
          setHasMorePowerSupply(false);
        } finally {
          setPowerSupplyLoading(false);
        }
      })();
    }
  }, [powerSupplyPage, isInitialized, selectedComponents]);

  const loadMorePowerSupplies = useCallback(() => {
    if (hasMorePowerSupply && !powerSupplyLoading && isInitialized) {
      setPowerSupplyPage(prev => prev + 1);
    }
  }, [hasMorePowerSupply, powerSupplyLoading, isInitialized]);

  const resetPowerSupplyData = useCallback(() => {
    setPowerSupplyPage(1);
    setHasMorePowerSupply(true);
    setPowerSupplySearch('');
    setAllPowerSupplyProducts([]);
    setIsInitialized(false);
  }, []);

  return {
    powerSupplySearch,
    setPowerSupplySearch,
    powerSupplyLoading,
    hasMorePowerSupply,
    filteredPowerSupplyProducts,
    
    loadMorePowerSupplies,
    resetPowerSupplyData,
    initializePowerSupplyData, 
  };
}
