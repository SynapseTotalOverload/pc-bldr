"use client";

import { ChevronRight, Plus } from "lucide-react";
import React from "react";

import { cn } from "@/utilities/ui";
import { Button } from "@/components/ui/button";
import { Feature242Block, Feature242Item } from "./types";
import type { CarouselApi } from "@/components/ui/carousel";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Feature242Props {
  className?: string;
}

export const Feature242Component: React.FC<Feature242Props & Feature242Block> = ({
  className,
  title = "Made for modern UI/UX teams",
  description = "Lorem ipsum dolor sit amet consectetur adipiasicing elit.Lorem ipsum dolor sit amet consectetur seams adipisicing elitLorem ipsum dolor sit amet asdfn asq consectetur adipisicing elit.",
  readMoreText = "Read more here",
  items = [],
}) => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  // Fallback items if none provided
  const defaultItems: Feature242Item[] = [
    {
      title: "Just Copy Paste ShadCn Blocks",
      imageUrl:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/illustrations/tokyo-exchange-between-the-user-and-the-global-network.svg",
      href: "#",
    },
    {
      title: "Build Modern UI/UX",
      imageUrl:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/illustrations/tokyo-letters-and-arrows-flying-out-of-a-black-hole.svg",
      href: "#",
    },
    {
      title: "Streamline Your Workflow",
      imageUrl: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/illustrations/tokyo-loading-the-next-page.svg",
      href: "#",
    },
    {
      title: "Collaborate Effectively",
      imageUrl:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/illustrations/tokyo-many-browser-windows-with-different-information.svg",
      href: "#",
    },
  ];

  const displayItems = items && items.length > 0 ? items : defaultItems;

  // Helper function to get image source
  const getImageSrc = (item: Feature242Item): string => {
    if (item.image && typeof item.image === 'object' && 'url' in item.image) {
      return item.image.url || item.imageUrl || '';
    }
    return item.imageUrl || '';
  };

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(displayItems.length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api, displayItems.length]);

  return (
    <section className="bg-background py-32">
      <div className="relative container flex flex-col items-center md:px-0 lg:pt-8">
        <div className="relative z-10 w-full items-center justify-between lg:flex">
          <h1 className="max-w-2xl text-5xl font-semibold tracking-tighter md:text-7xl">
            {title}
          </h1>
          <p className="mt-8 max-w-lg tracking-tight text-muted-foreground/80 md:text-xl lg:mt-0">
            {description}{" "}
            <span className="group inline-flex cursor-pointer items-center font-medium text-foreground transition-all ease-in-out">
              {readMoreText}{" "}
              <ChevronRight
                size={17}
                className="mt-px ml-1 transition-all ease-in-out group-hover:ml-2"
              />{" "}
            </span>
          </p>
        </div>
        <DottedDiv className="mt-8 flex w-full items-center justify-center px-2 py-10">
          <Carousel
            opts={{
              align: "center",
              loop: true,
            }}
            className="w-full"
            setApi={setApi}
          >
            <CarouselContent className="m-0 flex w-full">
              {displayItems.map((item, index) => (
                <CarouselItem
                  key={index}
                  className="px-2 md:basis-1/2 lg:basis-1/3"
                >
                  <div className="group relative flex h-96 w-full items-end rounded-3xl bg-muted text-ellipsis">
                    <div className="relative z-10 m-5 flex w-full justify-between">
                      <h5 className="w-1/2 text-2xl leading-7 font-medium tracking-tighter transition-all ease-in-out group-hover:ml-4">
                        {item.title}
                      </h5>
                      <a
                        href={item.href || "#"}
                        className="relative z-10 cursor-pointer"
                      >
                        <Button
                          variant="outline"
                          className="h-12 w-12 rounded-full bg-transparent transition-all ease-in-out hover:bg-muted-2"
                        >
                          <Plus className="scale-150" />
                        </Button>
                      </a>
                    </div>
                    <img
                      className="absolute w-full opacity-100 transition-all ease-in-out group-hover:scale-90 group-hover:opacity-60"
                      src={getImageSrc(item)}
                      alt={item.title}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <div className="mt-8 flex w-full items-center justify-between px-4">
              <div className="flex items-center gap-2">
                <span className="text-lg font-medium">
                  {current.toString().padStart(2, "0")}
                </span>
                <span className="text-muted-foreground">/</span>
                <span className="text-muted-foreground">
                  {count.toString().padStart(2, "0")}
                </span>
              </div>

              <div className="relative mr-10 flex gap-2">
                <CarouselPrevious className="h-10 w-10" />
                <CarouselNext variant="default" className="h-10 w-10" />
              </div>
            </div>
          </Carousel>
        </DottedDiv>
      </div>
    </section>
  );
};

const DottedDiv = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("relative", className)}>
    <div className="absolute top-4 -left-[12.5px] h-[1.5px] w-[110%] bg-muted md:-left-20" />
    <div className="absolute bottom-4 -left-[12.5px] h-[1.5px] w-[110%] bg-muted md:-left-20" />
    <div className="absolute -top-4 left-0 h-[110%] w-[1.5px] bg-muted" />
    <div className="absolute -top-4 right-0 h-[110%] w-[1.5px] bg-muted" />
    <div className="absolute top-[12.5px] left-[-3px] z-10 h-2 w-2 rounded-full bg-foreground" />
    <div className="absolute top-[12.5px] right-[-3px] z-10 h-2 w-2 rounded-full bg-foreground" />
    <div className="absolute bottom-[12.5px] left-[-3px] z-10 h-2 w-2 rounded-full bg-foreground" />
    <div className="absolute right-[-3px] bottom-[12.5px] z-10 h-2 w-2 rounded-full bg-foreground" />
    {children}
  </div>
);
