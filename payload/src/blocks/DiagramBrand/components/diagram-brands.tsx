'use client'
import React, { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts'
import { ProductTypeMapNames } from '@/services/types';
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button'
import { CategoryFilter } from './category-filter';
import { MinusIcon, PlusIcon, RefreshCcwIcon } from 'lucide-react';
import { useBrandsGraphs } from '@/collections/Pages/hooks/useProductGraphs';

interface DiagramBrandsProps {
    data: any;
    onStartDateChange?: (date: string) => void;
    onEndDateChange?: (date: string) => void;
    onCategoryChange?: (category: number) => void;
    onBrandChange?: (brands: string[]) => void;
}

const transformData = (serverData: any) => {
    if (!serverData?.data) return [];
    
    return serverData.data.map((item: any) => {
        const transformedItem: any = {
            date: new Date(item.date).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
            }),
            fullDate: item.date
        };
        
        // Add each brand's data to the transformed item
        if (item.products) {
            Object.entries(item.products).forEach(([brandName, userCount]) => {
                transformedItem[brandName] = userCount;
            });
        }
        
        return transformedItem;
    });
};

const DiagramBrands = ({ data, onStartDateChange, onEndDateChange, onCategoryChange, onBrandChange }: DiagramBrandsProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const [startDate, setStartDate] = useState<string>('2025-07-01');
    const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [chartData, setChartData] = useState(transformData(data));
    const [selectedCategory, setSelectedCategory] = useState<keyof ProductTypeMapNames>('cpu');
    const [selectedBrand, setSelectedBrand] = useState<string>('');
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

    // Generate colors for brands
    const brandColors = [
        '#3b82f6', // blue
        '#ef4444', // red
        '#10b981', // green
        '#f59e0b', // amber
        '#8b5cf6', // violet
        '#06b6d4', // cyan
        '#f97316', // orange
        '#84cc16', // lime
        '#ec4899', // pink
        '#6366f1', // indigo
    ];

    const getBrandColor = (brandIndex: number) => {
        return brandColors[brandIndex % brandColors.length];
    };

    const categoryIdToString = (id: string): number => {
        const map: Record<string, number> = {
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
            'headphones': 17,   
        };
        return map[id] || 1;
    };

    
    const { dataBrands, loading: brandsLoading, error: brandsError, refetch: brandsRefetch } = useBrandsGraphs([categoryIdToString(selectedCategory as string)]);
    
    
    useEffect(() => {
        setChartData(transformData(data));
        brandsRefetch();
    }, [data]);

    // Handle category change - clear brands and reset selected brand
    useEffect(() => {
        if (dataBrands?.brands && dataBrands.brands.length > 0) {
            const firstBrand = dataBrands.brands[0].name;
            setSelectedBrand(firstBrand);
            // Don't automatically add to selectedBrands - let user choose
        } else {
            setSelectedBrand('');
        }
    }, [dataBrands]);

    const addBrandToList = () => {
        if (selectedBrand && !selectedBrands.includes(selectedBrand)) {
            const newBrandsList = [...selectedBrands, selectedBrand];
            setSelectedBrands(newBrandsList);
            onBrandChange?.(newBrandsList);
        }
    };

    const removeBrandFromList = (brandToRemove: string) => {
        const newBrandsList = selectedBrands.filter(brand => brand !== brandToRemove);
        setSelectedBrands(newBrandsList);
        onBrandChange?.(newBrandsList);
    };

    const clearAllBrands = () => {
        setSelectedBrands([]);
        onBrandChange?.([]);
    };

    const handleStartDateChange = (date: string) => {
        if(date > endDate) {
            setStartDate(endDate);
            onStartDateChange?.(endDate);
            return;
        }
        if(date > new Date().toISOString().split('T')[0]) {
            setStartDate(new Date().toISOString().split('T')[0]);
            onStartDateChange?.(new Date().toISOString().split('T')[0]);
            return;
        }
        setStartDate(date);
        onStartDateChange?.(date);
    };
    const handleEndDateChange = (date: string) => {
        if(date < startDate) {
            setEndDate(startDate);
            onEndDateChange?.(startDate);
            return;
        }
        if(date > new Date().toISOString().split('T')[0]) {
            setEndDate(new Date().toISOString().split('T')[0]);
            onEndDateChange?.(new Date().toISOString().split('T')[0]);
            return;
        }
        setEndDate(date);
        onEndDateChange?.(date);
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                    <p className="text-sm text-gray-600 mb-2">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <p key={index} className="text-sm font-semibold" style={{ color: entry.color }}>
                            {entry.dataKey}: {entry.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    if (!data || !data.data || data.data.length === 0) {
        return (
            <div className="flex items-center justify-center h-[300px] bg-gray-50 rounded-lg">
                <p className="text-gray-500">No data to display</p>
            </div>
        );
    }

    return (
        <div className="w-full">
                <CategoryFilter
                    activeCategory={selectedCategory}
                    onCategoryChange={(category) => {
                        onCategoryChange?.(categoryIdToString(category as string));
                        setSelectedCategory(category as keyof ProductTypeMapNames); 
                        setSelectedBrands([]);
                        setSelectedBrand('');
                        onBrandChange?.([]);
                    }}
                    cardType='product'
                />
                <CategoryFilter
                    activeCategory={selectedCategory}
                    onCategoryChange={(category) => {
                        onCategoryChange?.(categoryIdToString(category as string));
                        setSelectedCategory(category as keyof ProductTypeMapNames); 
                        setSelectedBrands([]);
                        setSelectedBrand('');
                        onBrandChange?.([]);
                    }}
                    cardType='accessories'
                />

                <div className='flex items-center gap-2'>
                    <Select onValueChange={(value) => {
                        setSelectedBrand(value);
                    }} value={selectedBrand}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a brand" />
                        </SelectTrigger>
                        <SelectContent>
                            {dataBrands?.brands?.map((brand: any) => (
                                <SelectItem key={brand.name} value={brand.name}>{brand.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={addBrandToList}
                        disabled={!selectedBrand || selectedBrands.includes(selectedBrand)}
                    >
                        <PlusIcon className='w-4 h-4' />
                    </Button>
                    {selectedBrands.length > 0 && (
                        <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={clearAllBrands}
                            title="Clear all brands"
                        >
                            <RefreshCcwIcon className='w-4 h-4' />
                        </Button>
                    )}
                </div>

                {/* Brand Legend */}
                {selectedBrands.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-3">
                        {selectedBrands.map((brand, index) => (
                            <div key={brand} className="flex items-center gap-2">
                                <div 
                                    className="w-3 h-3 rounded-full" 
                                    style={{ backgroundColor: getBrandColor(index) }}
                                ></div>
                                <span className="text-sm text-gray-700">{brand}</span>
                            </div>
                        ))}
                    </div>
                )}
                
                {/* Display selected brands */}
                {selectedBrands.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                        {selectedBrands.map((brand) => (
                            <div 
                                key={brand} 
                                className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm"
                            >
                                <span>{brand}</span>
                                <button
                                    onClick={() => removeBrandFromList(brand)}
                                    className="text-blue-600 hover:text-blue-800 ml-1"
                                    title="Remove brand"
                                >
                                    <MinusIcon className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                    <Tooltip content={<CustomTooltip />} />
                    <CartesianGrid stroke="#e6e6e6" strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                        dataKey="date"
                        stroke="#999"
                        tick={{ fill: '#555', fontSize: 12 }}
                        axisLine={{ stroke: '#ddd' }}
                        tickLine={{ stroke: '#ddd' }}
                    />
                    <YAxis 
                        tick={{ fill: '#555', fontSize: 12 }}
                        axisLine={{ stroke: '#ddd' }}
                        tickLine={{ stroke: '#ddd' }}
                        label={{ value: 'Users', angle: -90, position: 'insideLeft' }}
                    />
                    {selectedBrands.map((brand) => (
                        <Line 
                            key={brand}
                            type="monotone"
                            dataKey={brand} 
                            stroke={getBrandColor(selectedBrands.indexOf(brand))} // Use consistent color for each brand
                            strokeWidth={2}
                            dot={{ fill: getBrandColor(selectedBrands.indexOf(brand)), strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, stroke: getBrandColor(selectedBrands.indexOf(brand)), strokeWidth: 2 }}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>

            <div className="mt-4 p-4 bg-gray-50 rounded-lg flex gap-4">
                <div className=''>
                    <label className="pr-2" htmlFor="start_date">Start date</label>
                    <input type="date" className='border border-gray-300 rounded-md p-2' value={startDate} onChange={(e) => {
                        handleStartDateChange(e.target.value);
                    }} />
                </div>
                <div className=''>
                    <label className="pr-2" htmlFor="end_date">End date</label>
                    <input type="date" className='border border-gray-300 rounded-md p-2' value={endDate} onChange={(e) => {
                        handleEndDateChange(e.target.value);
                    }} />
                </div>
            </div>
            
            {data.brands && selectedBrands.length > 0 && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Selected Brands Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        {selectedBrands.map((brand, index) => {
                            const brandInfo = data.brands[brand];
                            return (
                                <div key={brand} className="border-l-4 pl-3" style={{ borderColor: getBrandColor(index) }}>
                                    <div className="font-medium text-gray-800">{brand}</div>
                                    {brandInfo && (
                                        <div className="mt-1">
                                            <div>Products: {brandInfo.count}</div>
                                            <div>Total users: {data.total_users}</div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                        <div className="col-span-full">
                            <div className="font-medium text-gray-800">Period:</div>
                            <div>{data.date_range?.start_date} - {data.date_range?.end_date}</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DiagramBrands;