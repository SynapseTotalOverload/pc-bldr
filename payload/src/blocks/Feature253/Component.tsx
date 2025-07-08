"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { Globe } from "@/components/magicui/globe";
import { Button } from "@/components/ui/button";
import type { Feature253Block } from "./types";

interface Feature253Props {
  className?: string;
}

export const Feature253Component: React.FC<Feature253Props & Feature253Block> = ({
  className,
  enabled = true,
  title = "Your Ultimate Solution",
  description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt Lorem ipsum dolor sit amet, consectetur",
  buttonText = "Join Today",
  link,
}) => {
  const getLinkUrl = (): string => {
    if (!link) return '#';
    
    if (link.type === 'reference' && link.reference) {
      if (typeof link.reference === 'object' && 'slug' in link.reference) {
        return `/${link.reference.slug}`;
      }
    }
    
    return link.url || '#';
  };

  if (!enabled) return null;

  return (
    <section className="py-32">
      <div className="container">
        <div className="relative flex h-92 w-full flex-col justify-between overflow-hidden rounded-3xl border bg-muted p-8 md:flex-row">
          <div className="flex h-full max-w-lg flex-col justify-center gap-4">
            <h1 className="text-4xl font-medium tracking-tighter md:text-6xl">
              {title}
            </h1>
            <p className="text-muted-foreground/70">
              {description}
            </p>
            <Button
              variant="default"
              className="group relative z-99 w-fit !rounded-full border border-none bg-background px-10 tracking-tighter text-foreground !shadow-none hover:bg-background"
              asChild
            >
              <a
                href={getLinkUrl()}
                target={link?.newTab ? '_blank' : undefined}
                rel={link?.newTab ? 'noopener noreferrer' : undefined}
              >
                {buttonText}
                <ArrowRight className="ml-2 -rotate-45 rounded-full bg-foreground p-px text-background transition-all ease-in-out group-hover:rotate-0" />
              </a>
            </Button>
          </div>
          <div className="relative size-full">
            <Globe className="absolute top-0 md:top-10 md:-right-100 md:scale-150" />
          </div>
        </div>
      </div>
    </section>
  );
}; 