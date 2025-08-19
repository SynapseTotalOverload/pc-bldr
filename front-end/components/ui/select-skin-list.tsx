'use client'

import { useState, useEffect, useCallback } from 'react'
import { SkinRead } from '@/lib/skins-api'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Loader2, Search, ChevronDown } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { useSkins } from '@/hooks/useSkins'

interface SkinAttributesData {
  skin_id: number;
  is_stat_track: boolean;
  wear_level: string;
  pattern?: number;
  souvenir?: boolean;
}

interface SkinWithAttributes extends SkinRead {
    is_stat_track?: boolean;
    wear_level?: string;
    skin?: SkinRead;
    pattern?: number;
    souvenir?: boolean;
}

interface SelectSkinListProps {
  label?: string
  placeholder?: string
  searchPlaceholder?: string
  categoryPlaceholder?: string
  onSkinsChange?: (skinsData: SkinAttributesData[]) => void
  selectedSkins?: SkinWithAttributes[]
}

const WEAR_LEVELS = [
  "None",
  "Factory New", 
  "Minimal Wear", 
  "Field-Tested", 
  "Well-Worn", 
  "Battle-Scarred"
] as const;

export function SelectSkinList({
  label = "Skins",
  placeholder = "Select skins",
  searchPlaceholder = "Search skins...",
  categoryPlaceholder = "All categories",
  onSkinsChange,
  selectedSkins = []
}: SelectSkinListProps) {
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [selectedSkinsList, setSelectedSkinsList] = useState<SkinWithAttributes[]>(selectedSkins);
    const [isInitialized, setIsInitialized] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [allSkins, setAllSkins] = useState<SkinRead[]>([]);

    const { skins, pagination, loading, error, refetch, searchSkins } = useSkins({
        page: currentPage,
        pageSize: 40,
        search: isInitialized ? search : "",
        category_id: selectedCategory || undefined,
        include_category: true,
    });

    const getSkinDisplayInfo = useCallback((skin: SkinWithAttributes) => {
        return {
            title: skin.full_name,
            weapon: skin.weapon,
            skinName: skin.skin_name,
            category: skin.category?.name
        };
    }, []);

    const initializeData = useCallback(() => {
        if (!isInitialized) {
            setIsInitialized(true);
        }
    }, [isInitialized]);

    const handleSearch = useCallback(async () => {
        if (isInitialized) {
            setCurrentPage(1);
            setAllSkins([]);
            await searchSkins(search);
        }
    }, [search, searchSkins, isInitialized]);

    const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    }, [handleSearch]);

    const handleCategoryChange = useCallback((categoryId: string) => {
        const newCategoryId = categoryId !== 'all' ? parseInt(categoryId) : null;
        setSelectedCategory(newCategoryId);
        setCurrentPage(1);
        setAllSkins([]);
    }, []);

    const handleLoadMore = useCallback(async () => {
        if (pagination.hasMore && !loading) {
            const nextPage = currentPage + 1;
            setCurrentPage(nextPage);
        }
    }, [pagination.hasMore, loading, currentPage]);

    const handleSkinSelect = useCallback((skinId: string) => {
        if (skinId === 'none') return;
        
        const skin = allSkins.find(s => s.id.toString() === skinId);
        if (skin && !selectedSkinsList.find(s => s.id === skin.id)) {
            const newSkin: SkinWithAttributes = {
                ...skin,
                is_stat_track: false,
                wear_level: "None",
                pattern: 0,
                souvenir: false
            };
            const newSelectedSkins = [...selectedSkinsList, newSkin];
            setSelectedSkinsList(newSelectedSkins);
            
            const skinsData: SkinAttributesData[] = newSelectedSkins.map(skin => ({
                skin_id: skin.id,
                is_stat_track: skin?.is_stat_track || false,
                wear_level: skin?.wear_level || "None",
                pattern: skin?.pattern || 0,
                souvenir: skin?.souvenir || false
            }));
            onSkinsChange?.(skinsData);
        }
    }, [allSkins, selectedSkinsList, onSkinsChange]);

    const handleSkinRemove = useCallback((skinId: number) => {
        const newSelectedSkins = selectedSkinsList.filter(s => s.id !== skinId);
        setSelectedSkinsList(newSelectedSkins);
        
        const skinsData: SkinAttributesData[] = newSelectedSkins.map(skin => ({
            skin_id: skin.id,
            is_stat_track: skin?.is_stat_track || false,
            wear_level: skin?.wear_level || "None",
            pattern: skin?.pattern || 0,
            souvenir: skin?.souvenir || false
        }));
        onSkinsChange?.(skinsData);
    }, [selectedSkinsList, onSkinsChange]);

    const handleAttributeChange = useCallback((skinId: number, attribute: keyof SkinAttributesData, value: boolean | string | number) => {
        const newSelectedSkins = selectedSkinsList.map(skin => {
            if (skin.id === skinId) {
                return {
                    ...skin,
                    is_stat_track: attribute === 'is_stat_track' ? value as boolean : (skin?.is_stat_track || false),
                    wear_level: attribute === 'wear_level' ? value as string : (skin?.wear_level || "None"),
                    pattern: attribute === 'pattern' ? value as number : (skin?.pattern || 0),
                    souvenir: attribute === 'souvenir' ? value as boolean : (skin?.souvenir || false),
                };
            }
            return skin;
        });
        console.log("newSelectedSkins", newSelectedSkins);
        setSelectedSkinsList(newSelectedSkins);
        
        const skinsData: SkinAttributesData[] = newSelectedSkins.map(skin => ({
            skin_id: skin.id,
            is_stat_track: skin?.is_stat_track || false,
            wear_level: skin?.wear_level || "None",
            pattern: skin?.pattern || 0,
            souvenir: skin?.souvenir || false
        }));
        console.log("skinsData", skinsData);
        onSkinsChange?.(skinsData);
    }, [selectedSkinsList, onSkinsChange]);

    useEffect(() => {
        if (selectedSkins && selectedSkins.length > 0) {
            const transformedSkins: SkinWithAttributes[] = selectedSkins.map(skin => {
                const actualAttributes = skin as any || {};
                const actualSkin = skin.skin || skin;
                
                return {
                    ...actualSkin,
                    is_stat_track: actualAttributes.is_stat_track || false,
                    wear_level: actualAttributes.wear_level || "None",
                    pattern: actualAttributes.pattern || 0,
                    souvenir: actualAttributes.souvenir || false
                };
            });
            console.log("transformedSkins", transformedSkins);
            setSelectedSkinsList(transformedSkins);
        } else {
            setSelectedSkinsList([]);
        }
    }, [selectedSkins]);

    useEffect(() => {
        if (skins.length > 0) {
            if (currentPage === 1) {
                setAllSkins(skins);
            } else {
                setAllSkins(prev => {
                    const existingIds = new Set(prev.map(s => s.id));
                    const newSkins = skins.filter(s => !existingIds.has(s.id));
                    return [...prev, ...newSkins];
                });
            }
        }
    }, [skins, currentPage]);

    return (
        <div className={`space-y-4`}>
            
            <div className="space-y-2">
                <div className="space-y-2">
                    <Label className="text-sm font-medium">Category</Label>
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
                            <SelectItem value="all">All Categories</SelectItem>
                            <SelectItem value="1">Knives</SelectItem>
                            <SelectItem value="2">Gloves</SelectItem>
                            <SelectItem value="3">Pistols</SelectItem>
                            <SelectItem value="4">Rifles</SelectItem>
                            <SelectItem value="5">Smg</SelectItem>
                            <SelectItem value="6">Heavy</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-2">
                    <Input
                        placeholder={searchPlaceholder}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1"
                    />
                </div>

                <Select 
                    onValueChange={handleSkinSelect}
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
                        <SelectItem value="none" disabled>Select a skin to add</SelectItem>
                        
                        {loading && allSkins.length === 0 ? (
                            <div className="text-muted-foreground p-2 text-center text-sm">Loading...</div>
                        ) : allSkins.length === 0 && !loading && isInitialized ? (
                            <div className="text-muted-foreground p-2 text-center text-sm">No skins found</div>
                        ) : !isInitialized ? (
                            <div className="text-muted-foreground p-2 text-center text-sm">Open to load skins</div>
                        ) : (
                            <>
                                {allSkins.map((skin, index) => {
                                    const displayInfo = getSkinDisplayInfo(skin as SkinWithAttributes);
                                    const isSelected = selectedSkinsList.find(s => s.id === skin.id);
                                    
                                    return (
                                        <SelectItem 
                                            key={`${skin.id}-${index}`} 
                                            value={skin.id.toString()}
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
                                
                                {pagination.hasMore && !loading && (
                                    <div className="p-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleLoadMore}
                                            className="w-full"
                                        >
                                            Load More Skins
                                        </Button>
                                    </div>
                                )}
                                
                                {loading && allSkins.length > 0 && (
                                    <div className="text-muted-foreground p-2 text-center text-sm">Loading more...</div>
                                )}
                                
                                {pagination.total > allSkins.length && !loading && !pagination.hasMore && (
                                    <div className="text-muted-foreground p-2 text-center text-xs">
                                        Showing {allSkins.length} of {pagination.total} skins
                                    </div>
                                )}
                            </>
                        )}
                    </SelectContent>
                </Select>
            </div>

            {selectedSkinsList.length > 0 && (
                <div className="space-y-2">
                    <Label className="text-sm font-medium">Selected Skins ({selectedSkinsList.length})</Label>
                    <div className="space-y-2">
                        {selectedSkinsList.map((skin, index) => {
                            return (
                                <div key={`${skin.id}-${index}`} className="space-y-3 p-3 border rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="text-sm font-medium">{skin.full_name}</div>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleSkinRemove(skin.id)}
                                            className="ml-2"
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                    
                                    <div className="space-y-3 pt-2 border-t">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            {skin.category_id !== 1 && skin.category_id !== 2 && (
                                                <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`stat-track-${skin.id}`}
                                                    checked={skin?.is_stat_track || false}
                                                    onCheckedChange={(checked) => 
                                                        handleAttributeChange(skin.id, 'is_stat_track', checked as boolean)
                                                    }
                                                />
                                                <Label htmlFor={`stat-track-${skin.id}`} className="text-sm">
                                                    Stat Track
                                                </Label>
                                            </div>
                                            )}
                                            <div className="space-y-1">
                                                <Label className="text-sm">Wear Level</Label>
                                                <Select
                                                    value={skin?.wear_level || "None"}
                                                    onValueChange={(value) => 
                                                        handleAttributeChange(skin.id, 'wear_level', value)
                                                    }
                                                >
                                                    <SelectTrigger className="h-8">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {WEAR_LEVELS.map((level) => (
                                                            <SelectItem key={level} value={level}>
                                                                {level}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Label htmlFor={`pattern-${skin.id}`} className="text-sm">
                                                    Pattern ID
                                                </Label>
                                                <Input
                                                    type="number"
                                                    min={0}
                                                    max={999}
                                                    value={skin?.pattern || 0}
                                                    onChange={(e) => handleAttributeChange(skin.id, 'pattern', parseInt(e.target.value) || 0)}
                                                />
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`souvenir-${skin.id}`}
                                                    checked={skin?.souvenir || false}
                                                    onCheckedChange={(checked) => 
                                                        handleAttributeChange(skin.id, 'souvenir', checked as boolean)
                                                    }
                                                />
                                                <Label htmlFor={`souvenir-${skin.id}`} className="text-sm">
                                                    Souvenir
                                                </Label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}