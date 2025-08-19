'use client'

import { useState, useEffect, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CustomProductReletion, CustomProductReletionSimple } from '@/types/players-base'
import { ProductRead } from '@/types/prodcuts-base'
import { useProducts } from '@/hooks/useProductT'

const categoryIdToName: Record<number, string> = {
    1: 'cpu',
    2: 'cpu_cooler',
    3: 'gpu',
    4: 'motherboard',
    5: 'ram',
    6: 'storage',
    7: 'power_supply',
    8: 'case'
};

interface SelectCustProductsProps {
  placeholder?: string
  searchPlaceholder?: string
  categoryPlaceholder?: string
  onCustProductsChange?: (custProductsData: CustomProductReletion) => void
  selectedCustProducts?: CustomProductReletionSimple[]
}

export function SelectCustProducts({
    placeholder = "Select custom products",
    searchPlaceholder = "Search custom products...",
    categoryPlaceholder = "All categories",
    onCustProductsChange,
    selectedCustProducts
  }: SelectCustProductsProps) {
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<number | null>(1);
    const [selectedProductsList, setSelectedProductsList] = useState<CustomProductReletionSimple[]>(selectedCustProducts || []);
    const [isInitialized, setIsInitialized] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [allProducts, setAllProducts] = useState<ProductRead[]>([]);
    const [finaliCustProducts, setFinaliCustProducts] = useState<CustomProductReletion>({
        create_list: [],
        update_list: [],
        delete_list: []
    });

    const { products, pagination, loading, error, refetch } = useProducts<ProductRead>({
        page: currentPage,
        search: search,
        category: selectedCategory ? categoryIdToName[selectedCategory] : "",
    });  
  
    const initializeData = useCallback(() => {
        if (!isInitialized) {
            setIsInitialized(true);
        }
    }, [isInitialized]);
  
    const handleCategoryChange = useCallback((categoryId: string) => {
        const newCategoryId = categoryId !== 'all' ? parseInt(categoryId) : null;
        setSelectedCategory(newCategoryId);
        setCurrentPage(1);
        setAllProducts([]);
    }, []);

    const getProductDisplayInfo = useCallback((product: ProductRead) => {
        return {
            product_id: product.id,
            title: product.title,
            high_image_url: product.high_image_url,
            low_image_url: product.low_image_url,
            category: product.category?.name
        };
    }, []);

    const hasMore = pagination.currentPage < pagination.totalPages;

    const handleLoadMore = useCallback(async () => {
        if (hasMore && !loading) {
            const nextPage = currentPage + 1;
            setCurrentPage(nextPage);
        }
    }, [hasMore, loading, currentPage]);

    const handleProductsSelect = useCallback((productId: string) => {
        const selectedProduct = allProducts.find(p => p.id === parseInt(productId));
        if (selectedProduct) {
            const newCustProduct: CustomProductReletionSimple = {
                id: selectedProduct.id,
                product_id: selectedProduct.id,
                original_name: selectedProduct.title,
                custom_name: "",
                high_image_url: selectedProduct.high_image_url,
                low_image_url: selectedProduct.low_image_url,
                pozition: selectedCategory ? categoryIdToName[selectedCategory] : ""
            };
            const newSelectedList = [...selectedProductsList, newCustProduct];
            setSelectedProductsList(newSelectedList);
            
            const updatedFinaliCustProducts = {
                ...finaliCustProducts,
                create_list: [...(finaliCustProducts.create_list || []), {
                    product_id: selectedProduct.id,
                    user_id: 0,
                    custom_name: "",
                    original_name: selectedProduct.title,
                    data: new Date().toISOString().split('T')[0],
                    high_image_url: selectedProduct.high_image_url,
                    low_image_url: selectedProduct.low_image_url,
                    pozition: selectedCategory ? categoryIdToName[selectedCategory] : ""
                }]
            };
            
            setFinaliCustProducts(updatedFinaliCustProducts);
            onCustProductsChange?.(updatedFinaliCustProducts);
        }
    }, [allProducts, selectedProductsList, onCustProductsChange, selectedCategory, finaliCustProducts]);
  
    const handleProductRemove = useCallback((productId: number) => {
        const newSelectedProducts = selectedProductsList.filter(p => (p.id ?? p.product_id) !== productId);
        setSelectedProductsList(newSelectedProducts);

        const updatedCreateList = (finaliCustProducts.create_list || []).filter(item => item.product_id !== productId);

        const wasInCreateList = selectedProductsList.some(item => (item.id === productId));
        
        const updatedDeleteList = !wasInCreateList 
            ? finaliCustProducts.delete_list
            : [...(finaliCustProducts.delete_list || []), productId.toString()];

        const updatedFinaliCustProducts = {
            ...finaliCustProducts,
            create_list: updatedCreateList,
            delete_list: updatedDeleteList
        };

        setFinaliCustProducts(updatedFinaliCustProducts);
        onCustProductsChange?.(updatedFinaliCustProducts);
    }, [selectedProductsList, onCustProductsChange, finaliCustProducts]);

    const handleProductCustomNameChange = useCallback((productId: number, customName: string) => {
        const newSelectedProducts = selectedProductsList.map(p => (p.id ?? p.product_id) === productId ? { ...p, custom_name: customName } : p);
        setSelectedProductsList(newSelectedProducts);

        const createList = finaliCustProducts.create_list || [];
        const updateList = finaliCustProducts.update_list || [];

        const isInCreateList = createList.some(item => item.product_id === productId);

        let newCreateList = createList;
        let newUpdateList = updateList;

        if (isInCreateList) {
            newCreateList = createList.map(item => item.product_id === productId ? { ...item, custom_name: customName } : item);
        } else {
            const idx = updateList.findIndex(item => item.id === productId);
            if (idx >= 0) {
                newUpdateList = updateList.map(item => item.id === productId ? { ...item, custom_name: customName } : item);
            } else {
                newUpdateList = [...updateList, { id: productId, custom_name: customName }];
            }
        }

        const updatedFinaliCustProducts = {
            ...finaliCustProducts,
            create_list: newCreateList,
            update_list: newUpdateList,
        };

        setFinaliCustProducts(updatedFinaliCustProducts);
        onCustProductsChange?.(updatedFinaliCustProducts);
    }, [selectedProductsList, onCustProductsChange, finaliCustProducts]);

    useEffect(() => {
        if (selectedCustProducts && selectedCustProducts.length > 0) {
            const transformedCustProducts: CustomProductReletionSimple[] = selectedCustProducts.map(custProduct => ({
                ...custProduct,
            }));
            setSelectedProductsList(prev => {
                if (prev.length === 0) return transformedCustProducts;
                return prev;
            });
        } else {
            setSelectedProductsList(prev => (prev.length === 0 ? [] : prev));
        }
    }, [selectedCustProducts]);
  
    useEffect(() => {
        if (products.length > 0) {
            if (currentPage === 1) {
                setAllProducts(products);
            } else {
                setAllProducts(prev => {
                    const existingIds = new Set(prev.map(p => p.id));
                    const newProducts = products.filter(p => !existingIds.has(p.id));
                    return [...prev, ...newProducts];
                });
            }
        }
    }, [products, currentPage]);

    useEffect(() => {
        if (!isInitialized && selectedCategory) {
            setIsInitialized(true);
        }
    }, [isInitialized, selectedCategory]);

    useEffect(() => {
        if (selectedCategory && !isInitialized) {
            setIsInitialized(true);
        }
    }, [selectedCategory, isInitialized]);
  
      return (
          <div className={`space-y-4`}>
              
              <div className="space-y-2">
                  <div className="space-y-2">
                      <Select 
                          value={selectedCategory?.toString() || 'all'} 
                          onValueChange={handleCategoryChange}
                          onOpenChange={(open) => {
                              if (open) {
                                  initializeData();
                              }
                          }}
                      >
                          <SelectTrigger className="w-full">
                              <SelectValue placeholder={categoryPlaceholder} />
                          </SelectTrigger>
                          <SelectContent>
                              <SelectItem value="1">CPU</SelectItem>
                              <SelectItem value="2">CPU Cooler</SelectItem>
                              <SelectItem value="3">GPU</SelectItem>
                              <SelectItem value="4">Motherboard</SelectItem>
                              <SelectItem value="5">RAM</SelectItem>
                              <SelectItem value="6">Storage</SelectItem>
                              <SelectItem value="7">Power Supply</SelectItem>
                              <SelectItem value="8">Case</SelectItem>
                          </SelectContent>
                      </Select>
                  </div>
  
                  <div className="flex items-center gap-2">
                      <Input
                          placeholder={searchPlaceholder}
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          className="flex-1"
                      />
                  </div>
  
                  <Select 
                      onValueChange={handleProductsSelect}
                      onOpenChange={(open) => {
                          if (open) {
                              initializeData();
                          }
                      }}
                  >
                      <SelectTrigger className="w-full">
                          <SelectValue placeholder={placeholder} />
                      </SelectTrigger>
                      <SelectContent className="max-h-96">
                          <SelectItem value="none" disabled>Select a product to add</SelectItem>
                          
                          {loading && allProducts.length === 0 ? (
                              <div className="text-muted-foreground p-2 text-center text-sm">Loading...</div>
                          ) : allProducts.length === 0 && !loading && isInitialized ? (
                              <div className="text-muted-foreground p-2 text-center text-sm">No products found</div>
                          ) : !isInitialized ? (
                              <div className="text-muted-foreground p-2 text-center text-sm">Open to load products</div>
                          ) : (
                              <>
                                  {allProducts.map((product, index) => {
                                        const displayInfo = getProductDisplayInfo(product);
                                        const isSelected = selectedProductsList.some(s => s.product_id === product.id);
                                        
                                      return (
                                          <SelectItem 
                                              key={`${product.id}-${index}`} 
                                              value={product.id.toString()}
                                              disabled={!!isSelected}
                                          >
                                              <div className="flex flex-col gap-1 py-1">
                                                  <div className="text-sm leading-tight font-medium">
                                                      {displayInfo.title}
                                                  </div>
                                                  {isSelected && (
                                                      <div className="text-xs text-green-600">
                                                          ✓ Already selected
                                                      </div>
                                                  )}
                                              </div>
                                          </SelectItem>
                                      );
                                  })}
                                  
                                  {hasMore && !loading && (
                                      <div className="p-2">
                                          <Button
                                              type="button" // prevent form submission
                                              variant="outline"
                                              size="sm"
                                              onClick={handleLoadMore}
                                              className="w-full"
                                          >
                                              Load More Products
                                          </Button>
                                      </div>
                                  )}
                                  
                                  {loading && allProducts.length > 0 && (
                                      <div className="text-muted-foreground p-2 text-center text-sm">Loading more...</div>
                                  )}
                              </>
                          )}
                      </SelectContent>
                  </Select>
              </div>
  
              {selectedProductsList.length > 0 && (
                  <div className="space-y-2">
                      <Label className="text-sm font-medium">Selected Products ({selectedProductsList.length})</Label>
                      <div className="space-y-2">
                          {selectedProductsList.map((product, index) => {
                              return (
                                  <div key={`${product.id}-${index}`} className="space-y-3 p-3 border rounded-lg">
                                      <div className="flex items-center justify-between">
                                          <div className="flex-1">
                                              <div className="text-sm font-medium">{product.original_name}</div>
                                          </div>
                                          <Button
                                              type="button" // prevent form submission on click
                                              variant="outline"
                                              size="sm"
                                              onClick={() => handleProductRemove((product.id ?? product.product_id) || 0)}
                                              className="ml-2"
                                          >
                                              Remove
                                          </Button>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                          <Label htmlFor={`custom_name-${product.id}`} className="text-sm sr-only">
                                              Custom Name
                                          </Label>
                                          <Input
                                              id={`custom_name-${product.id}`}
                                              type="text"
                                              value={product.custom_name || ""}
                                              onChange={(e) => handleProductCustomNameChange(product.id || 0, e.target.value)}
                                              placeholder="Enter custom name"
                                          />
                                      </div>
                                  </div>
                              );
                          })}
                      </div>
                  </div>
              )}
          </div>
      );
  }