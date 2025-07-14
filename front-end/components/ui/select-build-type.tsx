'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const buildTypes = [
  { value: 'gaming', label: 'Gaming' },
  { value: 'workstation', label: 'Workstation' },
  { value: 'office', label: 'Office' },
  { value: 'high-end', label: 'High-End' },
  { value: 'budget', label: 'Budget' },
];

interface SelectBuildTypeProps {
  onBuildTypeChange: (buildType: string | null) => void;
  value?: string | null;
}

export function SelectBuildType({ onBuildTypeChange, value }: SelectBuildTypeProps) {
  const [selectedValue, setSelectedValue] = useState<string | null>(value || null);

  const handleValueChange = (newValue: string) => {
    setSelectedValue(newValue);
    onBuildTypeChange(newValue);
  };

  const handleClear = () => {
    setSelectedValue(null);
    onBuildTypeChange(null);
  };

  return (
    <div className="flex items-center gap-2">
      <Select value={selectedValue || ''} onValueChange={handleValueChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select build type..." />
        </SelectTrigger>
        <SelectContent>
          {buildTypes.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedValue && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-muted-foreground hover:text-foreground"
          onClick={handleClear}
        >
          Clear
        </Button>
      )}
    </div>
  );
} 