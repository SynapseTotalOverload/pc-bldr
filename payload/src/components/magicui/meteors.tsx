"use client";

import { cn } from "@/utilities/ui";
import React, { useEffect, useState } from "react";

interface MeteorsProps {
  number?: number;
  minDelay?: number;
  maxDelay?: number;
  minDuration?: number;
  maxDuration?: number;
  angle?: number;
  className?: string;
}

export const Meteors = ({
  number = 20,
  minDelay = 0.2,
  maxDelay = 1.2,
  minDuration = 2,
  maxDuration = 10,
  angle = 215,
  className,
}: MeteorsProps) => {
  const [meteorStyles, setMeteorStyles] = useState<Array<React.CSSProperties>>(
    [],
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const styles = [...new Array(number)].map(() => ({
      "--angle": angle + "deg",
      "--tail-angle": "45deg", // Fixed 45 degree rotation for the tail
      top: `${Math.random() * -500 - 100}px`, // Start much higher above screen (-600px to -100px)
      left: `${Math.random() * (window.innerWidth + 600)}px`, // Wider horizontal range
      animationDelay: Math.random() * (maxDelay - minDelay) + minDelay + "s",
      animationDuration:
        Math.floor(Math.random() * (maxDuration - minDuration) + minDuration) +
        "s",
    }));
    
    setMeteorStyles(styles);
  }, [number, minDelay, maxDelay, minDuration, maxDuration, angle]);

  return (
    <>
      {[...meteorStyles].map((style, idx) => (
        // Meteor container
        <span
          key={idx}
          style={{ ...style }}
          className={cn(
            "pointer-events-none absolute rotate-[var(--angle)] animate-meteor",
            className,
          )}
        >
          {/* Meteor Tail with head */}
          <div 
            className="pointer-events-none absolute top-1/2 -z-10 h-px w-[50px] -translate-y-1/2 bg-gradient-to-r from-transparent to-zinc-500 relative"
            style={{ transform: `rotate(var(--tail-angle))` }}
          >
            {/* Meteor Head positioned at the end of tail */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 size-0.5 rounded-full shadow-[0_0_0_1px_#ffffff10] bg-zinc-500" />
          </div>
        </span>
      ))}
    </>
  );
};
