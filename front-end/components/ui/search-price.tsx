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

  const handleSearch = (from: number, to: number) => {
    setFrom(from);
    setTo(to);
    onSearch(from, to);
  };

  return (
    <div className="flex items-center gap-2">
      <Input 
        type="number"
        placeholder="From"
        min={0}
        max={1000000}
        defaultValue={0}
        onChange={(e) => handleSearch(Number(e.target.value), to)}
      />
      <Input 
        type="number"
        placeholder="To"
        min={0}
        max={100000}
        defaultValue={100000}
        onChange={(e) => handleSearch(from, Number(e.target.value))}
      />
      {/* <Button className="bg-primary text-white cursor-pointer" onClick={handleSearch}>
        <Search className="w-4 h-4" />
      </Button> */}
    </div>
  );  
};