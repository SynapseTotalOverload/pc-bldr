import { Card } from '@/components/ui/card';

interface ExtrasPanelProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function ExtrasPanel({ isOpen, onToggle }: ExtrasPanelProps) {
  return (
    <Card className="w-full max-w-xl p-6">
      <div className="flex cursor-pointer items-center justify-between" onClick={onToggle}>
        <div className="text-lg font-semibold">Extras</div>
        <span>{isOpen ? '▲' : '▼'}</span>
      </div>
      {isOpen && <div className="text-muted-foreground mt-4">(Extras content goes here...)</div>}
    </Card>
  );
}
