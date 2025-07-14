'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/utilities/ui';
import './price-filter.css';
import { Button } from '@/components/ui/button';

interface PriceFilterProps {
  min?: number;
  max?: number;
  step?: number;
  defaultMin?: number;
  defaultMax?: number;
  onPriceChange?: (min: number, max: number) => void;
  className?: string;
}

export const PriceFilter: React.FC<PriceFilterProps> = ({
  min = 0,
  max = 1000000,
  step = 1,
  defaultMin = 0,
  defaultMax = 1000000,
  onPriceChange,
  className,
}) => {
  const [minPrice, setMinPrice] = useState(defaultMin);
  const [maxPrice, setMaxPrice] = useState(defaultMax);

  // Notify parent component when prices change
  useEffect(() => {
    if (onPriceChange) {
      onPriceChange(minPrice, maxPrice);
    }
  }, [minPrice, maxPrice, onPriceChange]);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value <= maxPrice) {
      setMinPrice(value);
    }
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value >= minPrice) {
      setMaxPrice(value);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className={cn('w-full space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Price Range</h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{formatPrice(minPrice)}</span>
          <span>-</span>
          <span>{formatPrice(maxPrice)}</span>
        </div>
      </div>

      <div className="relative px-3">
        <div className="h-2 bg-slate-200 rounded-full relative">
          <div
            className="absolute h-2 bg-blue-500 rounded-full"
            style={{
              left: `${((minPrice - min) / (max - min)) * 100}%`,
              width: `${((maxPrice - minPrice) / (max - min)) * 100}%`,
            }}
          />
        </div>

        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={minPrice}
          onChange={handleMinChange}
          className="absolute top-0 left-0 w-full h-2 range-input"
        />

        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxPrice}
          onChange={handleMaxChange}
          className="absolute top-0 left-0 w-full h-2 range-input"
        />
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1">
          <label className="block text-xs font-medium text-muted-foreground mb-1">
            Min Price
          </label>
          <input
            type="number"
            min={min}
            max={maxPrice}
            step={step}
            value={minPrice}
            onChange={(e) => handleMinChange(e)}
            className="w-full px-3 py-2 text-sm border border-border rounded bg-background focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none"
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs font-medium text-muted-foreground mb-1">
            Max Price
          </label>
          <input
            type="number"
            min={minPrice}
            max={max}
            step={step}
            value={maxPrice}
            onChange={(e) => handleMaxChange(e)}
            className="w-full px-3 py-2 text-sm border border-border rounded bg-background focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};