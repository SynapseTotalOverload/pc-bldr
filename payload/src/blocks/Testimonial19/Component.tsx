"use client";

import React, { useRef } from "react";
import AutoScroll from "embla-carousel-auto-scroll";
import { ChevronRight, Star, Zap } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import type { Testimonial19Block } from "./types";

interface Testimonial19Props {
  className?: string;
}

const defaultTestimonials = [
  {
    name: "Alice Johnson",
    role: "CEO & Founder",
    avatar: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-1.webp",
    content: "This platform has revolutionized the way we manage projects. It is incredibly user-friendly and efficient.",
    rating: 5,
  },
  {
    name: "David Lee",
    role: "CTO",
    avatar: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-2.webp",
    content: "I have been impressed with the seamless integration and functionality. It has made our tech operations much smoother.",
    rating: 5,
  },
  {
    name: "Mark Thompson",
    role: "COO",
    avatar: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-3.webp",
    content: "Managing our day-to-day tasks has never been easier. The interface is intuitive and saves us a lot of time.",
    rating: 5,
  },
];

export const Testimonial19Component: React.FC<Testimonial19Props & Testimonial19Block> = ({
  className,
  enabled = true,
  title = "Meet our happy clients",
  subtitle = "Join a global network of thought leaders, product developers,",
  ratingText = "Rated 5 stars by 1000+ clients",
  linkText = "View all testimonials",
  link,
  testimonials = defaultTestimonials,
}) => {
  const plugin = useRef(
    AutoScroll({
      startDelay: 500,
      speed: 0.7,
    }),
  );

  const getImageSrc = (media?: any): string | undefined => {
    if (media && typeof media === 'object' && 'url' in media) {
      return media.url || undefined;
    }
    if (typeof media === 'string' && media.trim() !== '') {
      return media;
    }
    return undefined;
  };

  const getLinkUrl = (): string => {
    if (!link) return '#';
    
    if (link.type === 'reference' && link.reference) {
      if (typeof link.reference === 'object' && 'slug' in link.reference) {
        return `/${link.reference.slug}`;
      }
    }
    
    return link.url || '#';
  };

  const renderStars = (rating: number = 5) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star 
        key={index}
        className={`size-5 ${
          index < rating 
            ? 'fill-amber-500 text-amber-500' 
            : 'fill-gray-300 text-gray-300'
        }`} 
      />
    ));
  };

  if (!enabled) return null;

  return (
    <section className="py-32">
      <div className="container flex flex-col items-center gap-4">
        <div className="flex items-center gap-1 text-sm font-semibold">
          <Zap className="h-6 w-auto fill-primary" />
          {ratingText}
        </div>
        <h2 className="text-center text-3xl font-semibold lg:text-4xl">
          {title}
        </h2>
        <p className="text-center text-muted-foreground lg:text-lg">
          {subtitle}
        </p>
        <a 
          href={getLinkUrl()} 
          target={link?.newTab ? '_blank' : undefined}
          rel={link?.newTab ? 'noopener noreferrer' : undefined}
          className="flex items-center gap-1 font-semibold"
        >
          {linkText}
          <ChevronRight className="mt-0.5 h-4 w-auto" />
        </a>
      </div>
      <div className="lg:container">
        <div className="mt-16 space-y-4">
          <Carousel
            opts={{
              loop: true,
            }}
            plugins={[plugin.current]}
            onMouseLeave={() => plugin.current.play()}
            className="relative before:absolute before:top-0 before:bottom-0 before:left-0 before:z-10 before:w-36 before:bg-gradient-to-r before:from-background before:to-transparent after:absolute after:top-0 after:right-0 after:bottom-0 after:z-10 after:w-36 after:bg-gradient-to-l after:from-background after:to-transparent"
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="basis-auto">
                  <Card className="max-w-96 p-6 select-none">
                    <div className="flex justify-between">
                      <div className="mb-4 flex gap-4">
                        <Avatar className="size-14 rounded-full ring-1 ring-input">
                          <AvatarImage
                            src={getImageSrc(testimonial.avatar)}
                            alt={testimonial.name || ''}
                          />
                        </Avatar>
                        <div>
                          <p className="font-medium">{testimonial.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {testimonial.role}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {renderStars(testimonial.rating)}
                      </div>
                    </div>
                    <q className="leading-7 text-muted-foreground">
                      {testimonial.content}
                    </q>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  );
}; 