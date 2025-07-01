import { useState, useEffect, useCallback } from 'react';
import { ProductRead } from '@/types/prodcuts-base';
import { getCompatibleProducts, SelectedComponents } from '@/lib/products-api';

interface UseSelectVideoCardReturn {
  videoCardSearch: string;
  setVideoCardSearch: (search: string) => void;
  videoCardPage: number;
  setVideoCardPage: (page: number) => void;
  hasMoreVideoCard: boolean;
  allVideoCardProducts: ProductRead[];
  filteredVideoCardProducts: ProductRead[];
  videoCardLoading: boolean;
  
  loadMoreVideoCards: () => void;
  resetVideoCardData: () => void;
  initializeVideoCardData: () => void; 
}

export function useSelectVideoCard(selectedComponents?: SelectedComponents): UseSelectVideoCardReturn {
  const [videoCardPage, setVideoCardPage] = useState(1);
  const [hasMoreVideoCard, setHasMoreVideoCard] = useState(true);
  const [videoCardSearch, setVideoCardSearch] = useState('');
  const [allVideoCardProducts, setAllVideoCardProducts] = useState<ProductRead[]>([]);
  const [videoCardLoading, setVideoCardLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [lastSelectedComponents, setLastSelectedComponents] = useState<SelectedComponents | undefined>(undefined);

  useEffect(() => {
    const relevantComponents = {
      case: selectedComponents?.case,
      motherboard: selectedComponents?.motherboard,
      psu: selectedComponents?.psu,
    };
    const currentKey = JSON.stringify(relevantComponents);
    const lastRelevantComponents = {
      case: lastSelectedComponents?.case,
      motherboard: lastSelectedComponents?.motherboard,
      psu: lastSelectedComponents?.psu,
    };
    const lastKey = JSON.stringify(lastRelevantComponents);
    
    if (isInitialized && currentKey !== lastKey) {
      console.log('🔄 VideoCard: Relevant components (case/motherboard/psu) changed, resetting for next initialization');
      setIsInitialized(false);
    }
    setLastSelectedComponents(selectedComponents);
  }, [selectedComponents, isInitialized, lastSelectedComponents]);

  const initializeVideoCardData = useCallback(() => {
    console.log('🚀 Video Card: Fetching data with query:', videoCardSearch, 'and selectedComponents:', selectedComponents);
    setIsInitialized(true);
    setVideoCardPage(1);
    setVideoCardLoading(true);
    
    (async () => {
      try {
        const data = await getCompatibleProducts({
          selected_components: selectedComponents || {},
          category_id: 3,
          page: 1,
          page_size: 20,
          query: videoCardSearch.trim() || undefined, // Use current search value
        });

        setAllVideoCardProducts(data.items);
        setHasMoreVideoCard(data.pagination.currentPage < data.pagination.totalPages);
        console.log('✅ Video Card: Fetch completed - received', data.items.length, 'products for query:', videoCardSearch);
      } catch (error) {
        console.error('❌ Video Card: Error in fetch:', error);
        setAllVideoCardProducts([]);
        setHasMoreVideoCard(false);
      } finally {
        setVideoCardLoading(false);
      }
    })();
  }, [videoCardSearch, selectedComponents]); 

  const filteredVideoCardProducts = allVideoCardProducts;

  // Search handled by initializeData function with query parameter

  useEffect(() => {
    if (isInitialized && videoCardPage > 1) {
      setVideoCardLoading(true);
      
      (async () => {
        try {
          const data = await getCompatibleProducts({
            selected_components: selectedComponents || {},
            category_id: 3,
            page: videoCardPage,
            page_size: 20,
            query: videoCardSearch.trim() || undefined,
          });

          setAllVideoCardProducts((prev) => {
            const existingIds = new Set(prev.map((p) => p.id));
            const newProducts = data.items.filter((p) => !existingIds.has(p.id));
            return [...prev, ...newProducts];
          });
          setHasMoreVideoCard(data.pagination.currentPage < data.pagination.totalPages);
        } catch (error) {
          setHasMoreVideoCard(false);
        } finally {
          setVideoCardLoading(false);
        }
      })();
    }
  }, [videoCardPage, isInitialized, selectedComponents]);

  const loadMoreVideoCards = useCallback(() => {
    if (hasMoreVideoCard && !videoCardLoading && isInitialized) {
      setVideoCardPage(prev => prev + 1);
    }
  }, [hasMoreVideoCard, videoCardLoading, isInitialized]);

  const resetVideoCardData = useCallback(() => {
    setVideoCardPage(1);
    setHasMoreVideoCard(true);
    setVideoCardSearch('');
    setAllVideoCardProducts([]);
    setIsInitialized(false);
  }, []);

  return {
    videoCardSearch,
    setVideoCardSearch,
    videoCardPage,
    setVideoCardPage,
    hasMoreVideoCard,
    allVideoCardProducts,
    filteredVideoCardProducts,
    videoCardLoading,
    
    loadMoreVideoCards,
    resetVideoCardData,
    initializeVideoCardData, 
  };
}
