"use client";

import React from "react";
import { Feature157Block, Feature157Card } from "./types";

interface Feature157Props {
  className?: string;
}

export const Feature157Component: React.FC<Feature157Props & Feature157Block> = ({
  className,
  subtitle = "Services",
  title = "Our customers get results and save time",
  cards = [],
}) => {
  const defaultCards: Feature157Card[] = [
    {
      title: "First Service",
      description: "Description for your first service offering.",
      imageUrl: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/simone-hutsch-9jsQcDsxyqA-unsplash.jpg",
    },
    {
      title: "Second Service", 
      description: "Description for your second service offering.",
      imageUrl: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/simone-hutsch-uR__S5GX8Io-unsplash.jpg",
    },
  ];

  const displayCards = cards && cards.length > 0 ? cards : defaultCards;

  const getImageSrc = (card: Feature157Card): string => {
    if (card.image && typeof card.image === 'object' && 'url' in card.image) {
      return card.image.url || card.imageUrl || '';
    }
    return card.imageUrl || '';
  };

  const getLinkUrl = (card: Feature157Card): string | null => {
    if (!card.link) return null;
    
    if (card.link.type === 'custom' && card.link.url) {
      return card.link.url;
    }
    
    if (card.link.type === 'reference' && card.link.reference) {
      const { value } = card.link.reference;
      if (typeof value === 'object' && value !== null && 'slug' in value) {
        return `/${value.slug}`;
      }
    }
    
    return null;
  };

  const shouldOpenInNewTab = (card: Feature157Card): boolean => {
    return card.link?.newTab === true;
  };

  return (
    <section className="py-32">
      <div className="container">
        <h4 className="mb-4 text-center text-muted-foreground/50">{subtitle}</h4>
        <h1 className="mx-auto mb-12 max-w-3xl text-center text-4xl font-semibold sm:text-5xl lg:text-[56px]">
          {title}
        </h1>
        <div className="flex flex-col items-center justify-between gap-12 lg:flex-row">
          {displayCards.map((card, index) => {
            const linkUrl = getLinkUrl(card);
            const openInNewTab = shouldOpenInNewTab(card);
            
            const CardContent = (
              <>
                <img
                  src={getImageSrc(card)}
                  alt={card.title}
                  className="mb-6 aspect-[1.5] w-full rounded-2xl object-cover"
                />
                <div className="mb-2 text-2xl font-semibold">{card.title}</div>
                <div>{card.description}</div>
              </>
            );

            if (linkUrl) {
              return (
                <a
                  key={index}
                  className="relative flex-auto basis-1 transition-opacity delay-150 duration-300 hover:opacity-80 cursor-pointer"
                  href={linkUrl}
                  target={openInNewTab ? "_blank" : undefined}
                  rel={openInNewTab ? "noopener noreferrer" : undefined}
                >
                  {CardContent}
                </a>
              );
            } else {
              return (
                <div
                  key={index}
                  className="relative flex-auto basis-1"
                >
                  {CardContent}
                </div>
              );
            }
          })}
        </div>
      </div>
    </section>
  );
}; 