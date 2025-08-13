'use client'

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductRead } from "@/types/prodcuts-base";
import { ProductUsageLog } from "@/types/players-base";
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Search } from "lucide-react";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { getProducts } from "@/lib/products-api";

interface SelectListProductNewProps {
  label: string
  value: string
  onValueChange: (value: string, date?: string) => void
  category: string
  placeholder?: string
  searchPlaceholder?: string
  required?: boolean
  className?: string
  periphery_flag?: boolean
  selectedProduct: ProductRead | null
  selectedDate?: string
  createdDate?: string
  usageProductLogs?: ProductUsageLog[]
}

export function SelectListProductNew({
  label,
  value,
  onValueChange,
  category,
  placeholder = "Select product",
  searchPlaceholder = "Search products...",
  required = false,
  className = "",
  periphery_flag = false,
  selectedProduct,
  selectedDate,
  createdDate,
  usageProductLogs = [] as ProductUsageLog[]
}: SelectListProductNewProps) {
    const [searchValue, setSearchValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [allProducts, setAllProducts] = useState<ProductRead[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [isInitialized, setIsInitialized] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1
    });
    const [activeProduct, setActiveProduct] = useState<ProductRead | null>(selectedProduct);
    const [usage_start_datetime, setUsageStartDatetime] = useState<string>(selectedDate || "");
    const [isDateManuallyChanged, setIsDateManuallyChanged] = useState(false);

    const formatDateForInput = (dateString: string) => {
        if (!dateString) return "";
        try {
            const date = new Date(dateString);
            return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
        } catch (error) {
            console.error('Error formatting date for input:', error);
            return "";
        }
    };

    useEffect(() => {
        if (!selectedDate && createdDate) {
            const formattedDate = formatDateForInput(createdDate);
            setUsageStartDatetime(formattedDate);
            onValueChange(value, formattedDate);
        }
    }, [createdDate, selectedDate, value, onValueChange]);

    useEffect(() => {
        if (value !== 'none' && usageProductLogs && usageProductLogs.length > 0 && !isDateManuallyChanged) {
            const matchingLog = usageProductLogs.find(log => log.product_id.toString() === value);
            if (matchingLog) {
                const formattedDate = formatDateForInput(matchingLog.usage_start_datetime);
                setUsageStartDatetime(formattedDate);
                onValueChange(value, formattedDate);
            }
        }
    }, [value, usageProductLogs, onValueChange, isDateManuallyChanged]);

    const getProductDisplayInfo = (product: ProductRead | any) => {
        if (product && 'name' in product && !('title' in product)) {
            return {
                title: product.display_name || product.name,
            };
        }
        
        const baseInfo = {
            title: product.display_name || product.title,
        };

        return baseInfo;
    };

    const fetchProducts = async (page: number = 1, search: string = "") => {
        if (!category) return;

        setLoading(true);
        try {
            const categoryMap: { [key: string]: number } = {
                'cpu': 1,
                'cpu_cooler': 2,
                'gpu': 3,
                'motherboard': 4,
                'ram': 5,
                'storage': 6,
                'power_supply': 7,
                'case': 8,
                'mouse': 9,
                'monitor': 10,
                'keyboard': 11,
                'headset': 12,
                'mousepad': 13,
                'chair': 14,
                'microphone': 15,
                'camera': 16,
                'earphones': 17
            };

            const categoryId = categoryMap[category.toLowerCase()];
            if (!categoryId) {
                console.error('Invalid category:', category);
                return;
            }

            const data = await getProducts({
                category_id: categoryId,
                page: page,
                page_size: 20,
                query: search.trim() || undefined,
                periphery_flag: periphery_flag
            });

            if (page === 1) {
                setAllProducts(data.items);
            } else {
                setAllProducts(prev => {
                    const existingIds = new Set(prev.map(p => p.id));
                    const newProducts = data.items.filter(p => !existingIds.has(p.id));
                    return [...prev, ...newProducts];
                });
            }

            setPagination({
                currentPage: data.pagination.currentPage,
                totalPages: data.pagination.totalPages
            });

        } catch (error) {
            console.error('Error fetching products:', error);
            setAllProducts([]);
        } finally {
            setLoading(false);
        }
    };
    

    // Initialize data when user first interacts with select
    const initializeData = () => {
        if (!isInitialized) {
            setIsInitialized(true);
            fetchProducts(1, searchQuery);
        }
    };

    const handleSearch = () => {
        setCurrentPage(1);
        setAllProducts([]);
        fetchProducts(1, searchValue);
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    }

    const handleLoadMore = () => {
        if (pagination.currentPage < pagination.totalPages && !loading) {
            const nextPage = pagination.currentPage + 1;
            setCurrentPage(nextPage);
            fetchProducts(nextPage, searchQuery);
        }
    }

    const handleValueChange = (newValue: string) => {
        if (newValue === 'none') {
            setActiveProduct(null);
            setUsageStartDatetime("");
            setIsDateManuallyChanged(false);
        } else {
            const foundProduct = allProducts.find(p => p.id.toString() === newValue);
            if (foundProduct) {
                setActiveProduct(foundProduct);
            } else if (selectedProduct && selectedProduct.id.toString() === newValue) {
                setActiveProduct(selectedProduct);
            }

            if (usageProductLogs && usageProductLogs.length > 0 && !isDateManuallyChanged) {
                const matchingLog = usageProductLogs.find(log => log.product_id.toString() === newValue);
                if (matchingLog) {
                    const formattedDate = formatDateForInput(matchingLog.usage_start_datetime);
                    setUsageStartDatetime(formattedDate);
                    onValueChange(newValue, formattedDate);
                    return;
                }
            }
        }
        
        onValueChange(newValue, usage_start_datetime);
    };

    useEffect(() => {
        if (selectedProduct && value === selectedProduct.id.toString()) {
            setActiveProduct(selectedProduct);
        }
    }, [selectedProduct, value, label]);

    useEffect(() => {
        if (value !== 'none' && allProducts.length > 0) {
            const foundProduct = allProducts.find(p => p.id.toString() === value);
            if (foundProduct) {
                setActiveProduct(foundProduct);
            }
        } else if (value === 'none') {
            setActiveProduct(null);
        }
    }, [value, allProducts, label]);

    return (
        <div className={`space-y-2`}>
            <Label htmlFor={`${label.toLowerCase().replace(/\s+/g, '-')}`}>
                {label}
            </Label>
            
            <div className="space-y-2">
                {/* Search Input */}
                <div className="flex items-center gap-2">
                    <Input
                        placeholder={searchPlaceholder}
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1"
                    />
                    <Button 
                        onClick={handleSearch} 
                        size="sm" 
                        disabled={loading}
                    >
                        {loading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Search className="h-4 w-4" />
                        )}
                    </Button>
                </div>

                {/* Select Component */}
                <Select 
                    value={value} 
                    onValueChange={handleValueChange}
                    onOpenChange={(open) => {
                        if (open) {
                            initializeData();
                        }
                    }}
                >
                    <SelectTrigger className="w-full">
                        {activeProduct ? (
                            <span className="text-sm font-medium">
                                {(activeProduct as any).display_name || (activeProduct as any).name || activeProduct.title}
                            </span>
                        ) : (
                            <span className="text-muted-foreground">{placeholder}</span>
                        )}
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="none">Not selected</SelectItem>
                        
                        {/* Show selected product first if it exists and no data loaded yet */}
                        {activeProduct && activeProduct.id.toString() === value && allProducts.length === 0 && !loading && (
                            <SelectItem key={`current-${activeProduct.id}`} value={activeProduct.id.toString()}>
                                <div className="flex flex-col gap-1 py-1">
                                    <div className="text-sm leading-tight font-medium">
                                        {getProductDisplayInfo(activeProduct).title}
                                    </div>
                                </div>
                            </SelectItem>
                        )}
                        
                        {loading && allProducts.length === 0 ? (
                            <div className="text-muted-foreground p-2 text-center text-sm">Loading...</div>
                        ) : allProducts.length === 0 && !activeProduct ? (
                            <div className="text-muted-foreground p-2 text-center text-sm">Open to load products</div>
                        ) : (
                            <>
                                {(() => {
                                    const productsToShow = [];
                                    
                                    if (activeProduct && value !== 'none' && activeProduct.id.toString() === value && allProducts.length > 0) {
                                        const foundInProducts = allProducts.find(p => p.id === activeProduct.id);
                                        if (!foundInProducts) {
                                            productsToShow.push({
                                                product: activeProduct,
                                                isPreSelected: true
                                            });
                                        }
                                    }
                                    
                                    // Then, add all other products
                                    allProducts.forEach(product => {
                                        productsToShow.push({
                                            product: product,
                                            isPreSelected: false
                                        });
                                    });
                                    
                                    return productsToShow.map(({ product, isPreSelected }) => {
                                        const displayInfo = getProductDisplayInfo(product);
                                        
                                        return (
                                            <SelectItem key={product.id} value={product.id.toString()}>
                                                <div className="flex flex-col gap-1 py-1">
                                                    <div className="text-sm leading-tight font-medium">
                                                        {displayInfo.title}
                                                    </div>
                                                </div>
                                            </SelectItem>
                                        );
                                    });
                                })()}
                                {pagination.currentPage < pagination.totalPages && !loading && (
                                    <div className="p-2">
                                        <Button
                                            onClick={handleLoadMore}
                                            variant="outline"
                                            size="sm"
                                            className="w-full"
                                        >
                                            Load more
                                        </Button>
                                    </div>
                                )}
                                {loading && allProducts.length > 0 && (
                                    <div className="text-muted-foreground p-2 text-center text-sm">Loading more...</div>
                                )}
                                {pagination.currentPage >= pagination.totalPages && allProducts.length > 0 && (
                                    <div className="text-muted-foreground p-2 text-center text-xs">
                                        All products loaded ({allProducts.length} total)
                                    </div>
                                )}
                            </>
                        )}
                    </SelectContent>
                </Select>
                {activeProduct !== null && (
                <div className="space-y-1">
                    <Label htmlFor="usage_start_datetime" className="text-sm">
                        Usage Start Date
                    </Label>
                    <Input
                        id="usage_start_datetime"
                        type="date"
                        value={usage_start_datetime}
                        onChange={(e) => {
                            let newDate = e.target.value;
                            if(newDate > new Date().toISOString().split('T')[0]) {
                                newDate = new Date().toISOString().split('T')[0];
                            }
                            setUsageStartDatetime(newDate);
                            setIsDateManuallyChanged(true);
                            onValueChange(value, newDate);
                        }}
                        className="w-full"
                        required={true}
                    />
                </div>
                )}
            </div>
        </div>
    )
}