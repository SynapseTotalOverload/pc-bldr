"use client";

import React from "react";

import { Globe } from "@/components/magicui/globe";
import { Meteors } from "@/components/magicui/meteors";
import { cn } from "@/utilities/ui";
import { HeroMeteorBlock } from "./types";
import { Button } from "@/components/ui/button";
import { CMSLink } from "@/components/Link";
import { ArrowRight } from "lucide-react";
import Configurator from "@/components/configurator";

interface HeroMeteorProps {
  className?: string;
  showConfigurator?: boolean;
}

export const HeroMeteorComponent: React.FC<HeroMeteorProps & HeroMeteorBlock> = ({
  className,
  subtitle = "Bridging Developers, Building the Future",
  title = "Connecting Developers Worldwide",
  buttonText = "Get Started",
  buttonLink,
  showButton = true,
  meteorsCount = 30,
  showGlobe = true,
  globeSize = 'large',
  showConfigurator = true,
}) => {
  const globeSizeClasses = {
    small: "scale-100 h-[300px]",
    medium: "scale-125 h-[350px]", 
    large: "scale-175 h-[400px]"
  };

  return (
    <section className="py-2 relative overflow-hidden">
      {/* Meteors container */}
      {meteorsCount > 0 && (
        <div className="absolute inset-0 pointer-events-none">
          <Meteors 
            number={meteorsCount} 
            minDelay={0.2}
            maxDelay={1.2}
            minDuration={2}
            maxDuration={10}
            angle={70}
          />
        </div>
      )}

      <div className="container flex flex-col items-center justify-center gap-4 relative z-10">
        {subtitle && (
          <p className="text-muted-foreground text-center">
            {subtitle}
          </p>
        )}
        
        <h1 className="max-w-3xl text-center font-bold text-6xl md:text-7xl">
          {title}
        </h1>

        {showButton && buttonText && buttonLink && (
          <CMSLink
            {...buttonLink}
            className="group text-md mt-10 flex w-fit items-center justify-center gap-2 rounded-full px-4 py-1 tracking-tight bg-secondary text-secondary-foreground hover:bg-secondary/80"
          >
          <ArrowRight className="h-4 w-4" />

          </CMSLink>
        )}
        
        {showGlobe && (
          <div className={cn(
            "relative w-full overflow-hidden mt-8",
            globeSizeClasses[globeSize]
          )}>
            <div className="absolute inset-0 flex items-center justify-center">
              <Globe 
                className={cn("opacity-80", globeSize === 'large' ? 'translate-y-10' : '')}
              />
            </div>
          </div>
        )}

        {!showGlobe && <Configurator />}
        
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-indigo-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
    </section>
  );
}; 