"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CMSLink } from "@/components/Link";
import { Integration2Block } from "./types";

interface DataItem {
  key: number;
  src: string;
  alt: string;
  href: string;
  width: number;
  height: number;
}

const DATA: DataItem[] = [
  {
    key: 1,
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/astro-icon.svg",
    alt: "Astro",
    href: "https://astro.build",
    width: 64,
    height: 64,
  },
  {
    key: 2,
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/github-icon.svg",
    alt: "GitHub",
    href: "https://github.com",
    width: 64,
    height: 64,
  },
  {
    key: 3,
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/google-icon.svg",
    alt: "Google",
    href: "https://google.com",
    width: 64,
    height: 64,
  },
  {
    key: 4,
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/notion-icon.svg",
    alt: "Notion",
    href: "https://notion.so",
    width: 64,
    height: 64,
  },
  {
    key: 5,
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/slack-icon.svg",
    alt: "Slack",
    href: "https://slack.com",
    width: 64,
    height: 64,
  },
  {
    key: 6,
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/tailwind-icon.svg",
    alt: "Tailwind CSS",
    href: "https://tailwindcss.com",
    width: 64,
    height: 64,
  },
  {
    key: 8,
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/vscode-icon.svg",
    alt: "VS Code",
    href: "https://code.visualstudio.com",
    width: 64,
    height: 64,
  },
  {
    key: 12,
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/react-icon.svg",
    alt: "React",
    href: "https://reactjs.org",
    width: 64,
    height: 64,
  },
  {
    key: 13,
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/vue-icon.svg",
    alt: "Vue.js",
    href: "https://vuejs.org",
    width: 64,
    height: 64,
  },
  {
    key: 15,
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/spotify-icon.svg",
    alt: "Spotify",
    href: "https://spotify.com",
    width: 64,
    height: 64,
  },
  {
    key: 16,
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/dropbox-icon.svg",
    alt: "Dropbox",
    href: "https://dropbox.com",
    width: 64,
    height: 64,
  },
];

interface Integration2Props {
  className?: string;
}

export const Integration2Component: React.FC<Integration2Props & Integration2Block> = ({
  className,
  title = "Powering the world's best product teams",
  subtitle = "From next-gen startups to established enterprises", 
  buttonText = "Discover all tools",
  buttonLink,
}) => {

    
  return (
    <section className="py-32">
      <div className="container">
        {/* Heading Section */}
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <h4 className="text-3xl font-medium lg:text-4xl">
            {title}
          </h4>
          <p className="text-xl text-muted-foreground lg:-mt-1">
            {subtitle}
          </p>
        </div>

        {/* Marquee Section */}
        <div className="relative my-20 overflow-hidden">
          <div className="flex w-full">
            {/* First marquee group */}
            <div className="flex shrink-0 animate-marquee items-center gap-4">
              {DATA.map((logo) => (
                <a
                  href={logo.href}
                  target="_blank"
                  key={logo.key}
                  className="p-4"
                  rel="noopener noreferrer"
                >
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    width={logo.width}
                    height={logo.height}
                    className="object-contain transition-opacity hover:opacity-70"
                  />
                </a>
              ))}
            </div>
            {/* Second marquee group */}
            <div className="flex shrink-0 animate-marquee items-center gap-4">
              {DATA.map((logo) => (
                <a
                  href={logo.href}
                  target="_blank"
                  key={`${logo.key}-2`}
                  className="p-4"
                  rel="noopener noreferrer"
                >
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    width={logo.width}
                    height={logo.height}
                    className="object-contain transition-opacity hover:opacity-70"
                  />
                </a>
              ))}
            </div>
          </div>
          {/* Gradient overlays */}
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent"></div>
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent"></div>
        </div>

        {/* Explore Button */}
        <div className="mt-8 flex justify-center">
          {buttonLink ? (
            <CMSLink
              {...buttonLink}
              appearance="default"
              className="rounded-full"
            >
              <ArrowRight className="h-4 w-4 ml-2" />
            </CMSLink>
          ) : (
            <Button className="rounded-full">
              {buttonText}
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}; 