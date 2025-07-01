import { useState, useEffect, useCallback } from 'react';
import { ProductRead } from '@/types/prodcuts-base';
import { getCompatibleProducts, SelectedComponents } from '@/lib/products-api';

interface UseSelectStorageReturn {
  storageSearch: string;
  setStorageSearch: (search: string) => void;
  storageLoading: boolean;
  hasMoreStorage: boolean;
  filteredStorageProducts: ProductRead[];
  
  loadMoreStorages: () => void;
  resetStorageData: () => void;
  initializeStorageData: () => void; 
}

export function useSelectStorage(selectedComponents?: SelectedComponents): UseSelectStorageReturn {
  const [storagePage, setStoragePage] = useState(1);
  const [hasMoreStorage, setHasMoreStorage] = useState(true);
  const [storageSearch, setStorageSearch] = useState('');
  const [allStorageProducts, setAllStorageProducts] = useState<ProductRead[]>([]);
  const [storageLoading, setStorageLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [lastSelectedComponents, setLastSelectedComponents] = useState<SelectedComponents | undefined>(undefined);

  useEffect(() => {
    const relevantComponents = {
      motherboard: selectedComponents?.motherboard,
    };
    const currentKey = JSON.stringify(relevantComponents);
    const lastRelevantComponents = {
      motherboard: lastSelectedComponents?.motherboard,
    };
    const lastKey = JSON.stringify(lastRelevantComponents);
    
    if (isInitialized && currentKey !== lastKey) {
      console.log('🔄 Storage: Relevant components (motherboard) changed, resetting for next initialization');
      setIsInitialized(false);
    }
    setLastSelectedComponents(selectedComponents);
  }, [selectedComponents, isInitialized, lastSelectedComponents]);

  const initializeStorageData = useCallback(() => {
    console.log('🚀 Storage: Fetching data with query:', storageSearch, 'and selectedComponents:', selectedComponents);
    setIsInitialized(true);
    setStoragePage(1);
    setStorageLoading(true);
    
    (async () => {
      try {
        const data = await getCompatibleProducts({
          selected_components: selectedComponents || {},
          category_id: 6,
          page: 1,
          page_size: 20,
          query: storageSearch.trim() || undefined, // Use current search value
        });

        setAllStorageProducts(data.items);
        setHasMoreStorage(data.pagination.currentPage < data.pagination.totalPages);
        console.log('✅ Storage: Fetch completed - received', data.items.length, 'products for query:', storageSearch);
      } catch (error) {
        console.error('❌ Storage: Error in fetch:', error);
        setAllStorageProducts([]);
        setHasMoreStorage(false);
      } finally {
        setStorageLoading(false);
      }
    })();
  }, [storageSearch, selectedComponents]); 

  const filteredStorageProducts = allStorageProducts;

  // Search handled by initializeData function with query parameter

  useEffect(() => {
    if (isInitialized && storagePage > 1) {
      setStorageLoading(true);
      
      (async () => {
        try {
          const data = await getCompatibleProducts({
            selected_components: selectedComponents || {},
            category_id: 6,
            page: storagePage,
            page_size: 20,
            query: storageSearch.trim() || undefined,
          });

          setAllStorageProducts((prev) => {
            const existingIds = new Set(prev.map((p) => p.id));
            const newProducts = data.items.filter((p) => !existingIds.has(p.id));
            return [...prev, ...newProducts];
          });
          setHasMoreStorage(data.pagination.currentPage < data.pagination.totalPages);
        } catch (error) {
          setHasMoreStorage(false);
        } finally {
          setStorageLoading(false);
        }
      })();
    }
  }, [storagePage, isInitialized, selectedComponents]);

  const loadMoreStorages = useCallback(() => {
    if (hasMoreStorage && !storageLoading && isInitialized) {
      setStoragePage(prev => prev + 1);
    }
  }, [hasMoreStorage, storageLoading, isInitialized]);

  const resetStorageData = useCallback(() => {
    setStoragePage(1);
    setHasMoreStorage(true);
    setStorageSearch('');
    setAllStorageProducts([]);
    setIsInitialized(false);
  }, []);

  return {
    storageSearch,
    setStorageSearch,
    storageLoading,
    hasMoreStorage,
    filteredStorageProducts,
    
    loadMoreStorages,
    resetStorageData,
    initializeStorageData, 
  };
}
