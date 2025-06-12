import { cn } from '@/lib/utils';

interface LiquidGlassInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
}

export function LiquidGlassInput({
  label,
  value,
  min,
  max,
  step,
  onChange,
  formatValue = (v) => v.toLocaleString(),
  className,
  ...props
}: LiquidGlassInputProps) {
  return (
    <div className="relative w-full">
      {label && <div className="text-muted-foreground mb-2 text-sm font-medium">{label}</div>}
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={cn(
            'bg-muted/30 h-3 w-full appearance-none rounded-lg backdrop-blur-md',
            'before:from-main-accent/10 before:to-main-accent/5 before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-r',
            'after:from-main-accent/20 after:to-main-accent/10 after:absolute after:inset-0 after:rounded-lg after:bg-gradient-to-r after:opacity-0 after:transition-opacity hover:after:opacity-100',
            'focus:ring-main-accent/50 focus:ring-2 focus:outline-none',
            // Thumb styles
            '[&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:rounded-full',
            '[&::-webkit-slider-runnable-track]:bg-white/20 [&::-webkit-slider-runnable-track]:backdrop-blur-sm',
            '[&::-webkit-slider-runnable-track]:shadow-inner [&::-webkit-slider-runnable-track]:shadow-white/10',
            '[&::-webkit-slider-runnable-track]:transition-all',
            '[&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:top-[-6px]',
            '[&::-webkit-slider-runnable-track]:hover:bg-white/30',
            '[&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:appearance-none',
            '[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white/20',
            '[&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-white/30',
            '[&::-webkit-slider-thumb]:shadow [&::-webkit-slider-thumb]:shadow-black/10',
            '[&::-webkit-slider-thumb]:backdrop-blur-sm [&::-webkit-slider-thumb]:transition-all',
            '[&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:hover:bg-white/40',
            '[&::-webkit-slider-thumb]:hover:border-white/60',
            '[&::-webkit-slider-thumb]:active:scale-95',

            // Track styles – transparent with soft white glow, liquid-glass feel
            '[&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:rounded-full',
            '[&::-webkit-slider-runnable-track]:bg-white/10 [&::-webkit-slider-runnable-track]:backdrop-blur-sm',
            '[&::-webkit-slider-runnable-track]:shadow-inner [&::-webkit-slider-runnable-track]:shadow-white/10',
            '[&::-webkit-slider-runnable-track]:transition-all',

            // Track styles
            '[&::-webkit-slider-runnable-track]:h-3 [&::-webkit-slider-runnable-track]:rounded-lg',
            '[&::-webkit-slider-runnable-track]:bg-gradient-to-r',
            '[&::-webkit-slider-runnable-track]:from-main-accent/20 [&::-webkit-slider-runnable-track]:to-main-accent/10',
            '[&::-webkit-slider-runnable-track]:backdrop-blur-md',
            // Firefox styles
            '[&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:appearance-none',
            '[&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white/90',
            '[&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white/50',
            '[&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:shadow-black/20',
            '[&::-moz-range-thumb]:backdrop-blur-md [&::-moz-range-thumb]:transition-all',
            '[&::-moz-range-thumb]:hover:scale-110 [&::-moz-range-thumb]:hover:bg-white',
            '[&::-moz-range-thumb]:hover:border-main-accent/50',
            '[&::-moz-range-thumb]:active:scale-95',
            // Track progress
            '[&::-moz-range-progress]:h-3 [&::-moz-range-progress]:rounded-l-lg',
            '[&::-moz-range-progress]:bg-gradient-to-r',
            '[&::-moz-range-progress]:from-main-accent/40 [&::-moz-range-progress]:to-main-accent/30',
            className,
          )}
          style={
            {
              '--thumb-position': `${((value - min) / (max - min)) * 100}%`,
            } as React.CSSProperties
          }
          {...props}
        />
      </div>
      <div className="text-muted-foreground mt-1 flex justify-between text-xs">
        <span>{formatValue(min)}</span>
        <span>{formatValue(max)}</span>
      </div>
    </div>
  );
}
