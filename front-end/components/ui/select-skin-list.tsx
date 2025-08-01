'use client'

import { useState, useEffect, useCallback } from 'react'
import { SkinRead } from '@/lib/skins-api'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Loader2, Search, ChevronDown } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useSkins } from '@/hooks/useSkins'

interface SelectSkinListProps {
  label?: string
  placeholder?: string
  searchPlaceholder?: string
  onSkinsChange?: (skins: SkinRead[]) => void
  selectedSkins?: SkinRead[]
}

export function SelectSkinList({
  label = "Skins",
  placeholder = "Select skins",
  searchPlaceholder = "Search skins...",
  onSkinsChange,
  selectedSkins = []
}: SelectSkinListProps) {
    const [search, setSearch] = useState("");
    const [selectedSkinsList, setSelectedSkinsList] = useState<SkinRead[]>(selectedSkins);
    const [isInitialized, setIsInitialized] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [allSkins, setAllSkins] = useState<SkinRead[]>([]);

    const { skins, pagination, loading, error, refetch, searchSkins } = useSkins({
        page: currentPage,
        pageSize: 40,
        search: isInitialized ? search : "",
    });

    // Function to get skin display info
    const getSkinDisplayInfo = useCallback((skin: SkinRead) => {
        return {
            title: skin.full_name || skin.name,
            weapon: skin.weapon,
            skinName: skin.skin_name
        };
    }, []);

    // Initialize data when user first interacts with select
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
            const newSelectedSkins = [...selectedSkinsList, skin];
            setSelectedSkinsList(newSelectedSkins);
            onSkinsChange?.(newSelectedSkins);
        }
    }, [allSkins, selectedSkinsList, onSkinsChange]);

    const handleSkinRemove = useCallback((skinId: number) => {
        const newSelectedSkins = selectedSkinsList.filter(s => s.id !== skinId);
        setSelectedSkinsList(newSelectedSkins);
        onSkinsChange?.(newSelectedSkins);
    }, [selectedSkinsList, onSkinsChange]);

    // Update selected skins when prop changes
    useEffect(() => {
        setSelectedSkinsList(selectedSkins);
    }, [selectedSkins]);

    // Update allSkins when new skins are loaded
    useEffect(() => {
        if (skins.length > 0) {
            if (currentPage === 1) {
                // Reset skins on first page or new search
                setAllSkins(skins);
            } else {
                // Append new skins to existing list
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
                {/* Search Input */}
                <div className="flex items-center gap-2">
                    <Input
                        placeholder={searchPlaceholder}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1"
                    />
                    <Button 
                        onClick={handleSearch} 
                        size="sm" 
                        disabled={loading || !isInitialized}
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
                                {allSkins.map((skin) => {
                                    const displayInfo = getSkinDisplayInfo(skin);
                                    const isSelected = selectedSkinsList.find(s => s.id === skin.id);
                                    
                                    return (
                                        <SelectItem 
                                            key={skin.id} 
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
                                
                                {/* Load More Button */}
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

            {/* Selected Skins List */}
            {selectedSkinsList.length > 0 && (
                <div className="space-y-2">
                    <Label className="text-sm font-medium">Selected Skins ({selectedSkinsList.length})</Label>
                    <div className="space-y-2">
                        {selectedSkinsList.map((skin) => {
                            const displayInfo = getSkinDisplayInfo(skin);
                            return (
                                <div key={skin.id} className="flex items-center justify-between p-3 border rounded-lg">
                                    <div className="flex-1">
                                        <div className="text-sm font-medium">{displayInfo.title}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {displayInfo.weapon} • {displayInfo.skinName}
                                        </div>
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
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}