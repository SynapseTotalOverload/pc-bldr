import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useState } from "react";

interface SearchPriceProps {
  onSearch: (from: number, to: number) => void;
}

export const SearchPrice = ({ onSearch }: SearchPriceProps) => {
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(100000);

  return (
    <div className="flex items-center gap-2">
      <Input 
        type="number"
        placeholder="From"
        min={0}
        max={1000000}
        defaultValue={0}
        onChange={(e) => setFrom(Number(e.target.value))}
      />
      <Input 
        type="number"
        placeholder="To"
        min={0}
        max={100000}
        defaultValue={100000}
        onChange={(e) => setTo(Number(e.target.value))}
      />
      <Button className="bg-primary text-white cursor-pointer" onClick={() => onSearch(from, to)}>
        <Search className="w-4 h-4" />
      </Button>
    </div>
  );  
};