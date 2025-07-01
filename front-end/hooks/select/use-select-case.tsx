import { useState, useEffect, useCallback } from 'react';
import { ProductRead } from '@/types/prodcuts-base';
import { getCompatibleProducts, SelectedComponents } from '@/lib/products-api';

interface UseSelectCaseReturn {
  caseSearch: string;
  setCaseSearch: (search: string) => void;
  casePage: number;
  setCasePage: (page: number) => void;
  hasMoreCase: boolean;
  allCaseProducts: ProductRead[];
  filteredCaseProducts: ProductRead[];
  caseLoading: boolean;
  
  loadMoreCases: () => void;
  resetCaseData: () => void;
  initializeCaseData: () => void; 
}

export function useSelectCase(selectedComponents?: SelectedComponents): UseSelectCaseReturn {
  const [casePage, setCasePage] = useState(1);
  const [hasMoreCase, setHasMoreCase] = useState(true);
  const [caseSearch, setCaseSearch] = useState('');
  const [allCaseProducts, setAllCaseProducts] = useState<ProductRead[]>([]);
  const [caseLoading, setCaseLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [lastSelectedComponents, setLastSelectedComponents] = useState<SelectedComponents | undefined>(undefined);

  useEffect(() => {
    const relevantComponents = {
      motherboard: selectedComponents?.motherboard,
      gpu: selectedComponents?.gpu,
      cpu_cooler: selectedComponents?.cpu_cooler,
    };
    const currentKey = JSON.stringify(relevantComponents);
    const lastRelevantComponents = {
      motherboard: lastSelectedComponents?.motherboard,
      gpu: lastSelectedComponents?.gpu,
      cpu_cooler: lastSelectedComponents?.cpu_cooler,
    };
    const lastKey = JSON.stringify(lastRelevantComponents);
    
    if (isInitialized && currentKey !== lastKey) {
      console.log('🔄 Case: Relevant components (motherboard/gpu/cpu_cooler) changed, resetting for next initialization');
      setIsInitialized(false);
    }
    setLastSelectedComponents(selectedComponents);
  }, [selectedComponents, isInitialized, lastSelectedComponents]);

  const initializeCaseData = useCallback(() => {
    console.log('🚀 Case: Fetching data with query:', caseSearch, 'and selectedComponents:', selectedComponents);
    setIsInitialized(true);
    setCasePage(1);
    setCaseLoading(true);
    
    (async () => {
      try {
        const data = await getCompatibleProducts({
          selected_components: selectedComponents || {},
          category_id: 8,
          page: 1,
          page_size: 20,
          query: caseSearch.trim() || undefined, // Use current search value
        });

        setAllCaseProducts(data.items);
        setHasMoreCase(data.pagination.currentPage < data.pagination.totalPages);
        console.log('✅ Case: Fetch completed - received', data.items.length, 'products for query:', caseSearch);
      } catch (error) {
        console.error('❌ Case: Error in fetch:', error);
        setAllCaseProducts([]);
        setHasMoreCase(false);
      } finally {
        setCaseLoading(false);
      }
    })();
  }, [caseSearch, selectedComponents]); 

  const filteredCaseProducts = allCaseProducts;

  // Search handled by initializeData function with query parameter

  useEffect(() => {
    if (isInitialized && casePage > 1) {
      setCaseLoading(true);
      
      (async () => {
        try {
          const data = await getCompatibleProducts({
            selected_components: selectedComponents || {},
            category_id: 8,
            page: casePage,
            page_size: 20,
            query: caseSearch.trim() || undefined,
          });

          setAllCaseProducts((prev) => {
            const existingIds = new Set(prev.map((p) => p.id));
            const newProducts = data.items.filter((p) => !existingIds.has(p.id));
            return [...prev, ...newProducts];
          });
          setHasMoreCase(data.pagination.currentPage < data.pagination.totalPages);
        } catch (error) {
          setHasMoreCase(false);
        } finally {
          setCaseLoading(false);
        }
      })();
    }
  }, [casePage, isInitialized, selectedComponents]);

  const loadMoreCases = useCallback(() => {
    if (hasMoreCase && !caseLoading && isInitialized) {
      setCasePage(prev => prev + 1);
    }
  }, [hasMoreCase, caseLoading, isInitialized]);

  const resetCaseData = useCallback(() => {
    setCasePage(1);
    setHasMoreCase(true);
    setCaseSearch('');
    setAllCaseProducts([]);
    setIsInitialized(false);
  }, []);

  return {
    caseSearch,
    setCaseSearch,
    casePage,
    setCasePage,
    hasMoreCase,
    allCaseProducts,
    filteredCaseProducts,
    caseLoading,
    
    loadMoreCases,
    resetCaseData,
    initializeCaseData, 
  };
}
