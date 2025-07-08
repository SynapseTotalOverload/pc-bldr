"use client";

import React, { useRef } from "react";
import { Feature251Block } from "./types";
import { cn } from "@/utilities/ui";
import { AnimatedBeam } from "@/components/magicui/animated-beam";
import { Globe } from "@/components/magicui/globe";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { 
  Cpu, 
  Fan, 
  Monitor, 
  CircuitBoard, 
  HardDrive, 
  Zap, 
  Package, 
  Chrome,
  Figma,
  FileText,
  Star,
  Square,
  LucideIcon
} from 'lucide-react';

interface Feature251Props {
  className?: string;
}

export const Feature251Component: React.FC<Feature251Props & Feature251Block> = ({
  className,
  card1,
  card2,
  card3,
  card4,
}) => {
  const containerRef1 = useRef<HTMLDivElement>(null);
  const containerRef2 = useRef<HTMLDivElement>(null);
  const div1Ref = useRef<HTMLDivElement>(null);
  const div2Ref = useRef<HTMLDivElement>(null);
  const div3Ref = useRef<HTMLDivElement>(null);
  const div4Ref = useRef<HTMLDivElement>(null);
  const div5Ref = useRef<HTMLDivElement>(null);
  const div6Ref = useRef<HTMLDivElement>(null);
  const div7Ref = useRef<HTMLDivElement>(null);

  // Icon mapping function
  const getIconComponent = (iconType?: string): LucideIcon => {
    const iconMap: Record<string, LucideIcon> = {
      'google': Chrome,
      'figma': Figma,
      'notion': FileText,
      'g2': Star,
      'block': Square,
      'cpu': Cpu,
      'gpu': Monitor,
      'motherboard': CircuitBoard,
      'memory': HardDrive,
      'storage': HardDrive,
      'power-supply': Zap,
      'case': Package,
      'cpu-cooler': Fan,
    };
    
    return iconMap[iconType || 'block'] || Square;
  };

  // Default values
  const defaultCard1 = {
    title: "Customizable Workflows",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt Lorem ipsum dolor sit amet, consectetur",
    enabled: true,
    icons: {
      icon1: 'cpu' as const,
      icon2: 'gpu' as const,
      icon3: 'motherboard' as const,
      icon4: 'memory' as const,
    }
  };

  const defaultCard2 = {
    title: "Smart Task Tracking",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
    enabled: true,
    icons: {
      topIcon: 'storage' as const,
      bottomIcon: 'power-supply' as const,
    }
  };

  const defaultCard3 = {
    title: "Seamless Integration & Real-Time Collaboration",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
    enabled: true,
    image: 'case' as const,
  };

  const defaultCard4 = {
    title: "Trusted by 100k Users",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt Lorem ipsum dolor sit amet, consectetur",
    enabled: true,
  };

  // Merge with defaults
  const finalCard1 = { ...defaultCard1, ...card1, icons: { ...defaultCard1.icons, ...card1?.icons } };
  const finalCard2 = { ...defaultCard2, ...card2, icons: { ...defaultCard2.icons, ...card2?.icons } };
  const finalCard3 = { ...defaultCard3, ...card3 };
  const finalCard4 = { ...defaultCard4, ...card4 };

  return (
    <section className="py-32">
      <div className="container">
        <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-2 lg:grid-cols-3">
          {/* 1st Card  */}
          {finalCard1.enabled && (
            <Card className="relative h-96 lg:col-span-2 rounded-3xl border">
              <CardHeader>
                <h3 className="text-2xl font-semibold tracking-tight">
                  {finalCard1.title}
                </h3>
                <p className="mt-2 text-muted-foreground/70">
                  {finalCard1.description}
                </p>
              </CardHeader>
              <CardContent ref={containerRef1} className="relative ml-5">
                <IconCard
                  ref={div1Ref as React.RefObject<HTMLDivElement>}
                  icon={getIconComponent(finalCard1.icons?.icon1)}
                  className="mb-3"
                />
                <IconCard
                  ref={div2Ref as React.RefObject<HTMLDivElement>}
                  icon={getIconComponent(finalCard1.icons?.icon2)}
                  className="translate-x-32"
                />
                <IconCard
                  ref={div3Ref as React.RefObject<HTMLDivElement>}
                  icon={getIconComponent(finalCard1.icons?.icon3)}
                  className="mt-3"
                />
                <IconCard
                  ref={div5Ref as React.RefObject<HTMLDivElement>}
                  icon={getIconComponent(finalCard1.icons?.icon4)}
                  className="absolute top-1/2 right-12 -translate-y-1/2"
                />
                <div
                  ref={div4Ref as React.RefObject<HTMLDivElement>}
                  className="absolute top-1/2 left-1/2 z-99 h-4 w-4 -translate-y-1/2 rounded-full border "
                />
                <AnimatedBeam
                  duration={3}
                  containerRef={containerRef1}
                  fromRef={div1Ref}
                  curvature={40}
                  toRef={div4Ref}
                />
                <AnimatedBeam
                  duration={3}
                  containerRef={containerRef1}
                  fromRef={div2Ref}
                  toRef={div4Ref}
                />
                <AnimatedBeam
                  duration={3}
                  containerRef={containerRef1}
                  fromRef={div3Ref}
                  curvature={-40}
                  toRef={div4Ref}
                />
                <AnimatedBeam
                  duration={3}
                  containerRef={containerRef1}
                  fromRef={div4Ref}
                  toRef={div5Ref}
                />
              </CardContent>
            </Card>
          )}

          {/* 2nd Card */}
          {finalCard2.enabled && (
            <Card className="h-96 rounded-3xl border">
              <CardHeader>
                <h3 className="text-2xl font-semibold tracking-tight">
                  {finalCard2.title}
                </h3>
                <p className="text-muted-foreground/70">
                  {finalCard2.description}
                </p>
              </CardHeader>
              <CardContent
                ref={containerRef2}
                className="relative flex flex-col items-center justify-between"
              >
                <IconCard
                  ref={div6Ref as React.RefObject<HTMLDivElement>}
                  icon={getIconComponent(finalCard2.icons?.topIcon)}
                  className="mb-12"
                />

                <IconCard
                  ref={div7Ref as React.RefObject<HTMLDivElement>}
                  icon={getIconComponent(finalCard2.icons?.bottomIcon)}
                  className="mt-12"
                />

                <AnimatedBeam
                  duration={3}
                  containerRef={containerRef2}
                  fromRef={div6Ref as React.RefObject<HTMLDivElement>}
                  curvature={0}
                  toRef={div7Ref as React.RefObject<HTMLDivElement>}
                />
              </CardContent>
            </Card>
          )}

          {/* 3rd card */}
          {finalCard3.enabled && (
            <Card className="relative flex h-96 flex-col rounded-3xl border">
              <CardContent>
                <div className="mt-5 size-32 flex items-center justify-center text-gray-600">
                  {React.createElement(getIconComponent(finalCard3.image), { size: 128 })}
                </div>
              </CardContent>
              <CardHeader className="mt-auto">
                <h3 className="text-2xl font-semibold tracking-tight">
                  {finalCard3.title}
                </h3>
                <p className="text-muted-foreground/70">
                  {finalCard3.description}
                </p>
              </CardHeader>
            </Card>
          )}
          
          {/* 4th card */}
          {finalCard4.enabled && (
            <Card className="h-96 lg:col-span-2 overflow-hidden rounded-3xl border">
              <CardHeader>
                <h3 className="text-2xl font-semibold tracking-tight">
                  {finalCard4.title}
                </h3>
                <p className="text-muted-foreground/70">
                  {finalCard4.description}
                </p>
              </CardHeader>

              <CardContent className="relative">
                <Globe className="-top-4" />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
};

const IconCard = ({
  icon,
  className,
  ref,
}: {
  icon: LucideIcon;
  className?: string;
  ref: React.RefObject<HTMLDivElement>;
}) => {
  return (
    <div
      ref={ref}
      className={cn(
        "relative z-10 flex size-14 items-center justify-center rounded-xl bg-muted",
        className,
      )}
    >
      {React.createElement(icon, { className: "size-5 text-gray-600" })}
      <HandleIcon className="absolute -top-3 left-1/2 size-6 -translate-x-1/2" />
      <HandleIcon className="absolute -bottom-3 left-1/2 size-6 -translate-x-1/2" />
      <HandleIcon className="absolute top-1/2 -left-3 size-6 -translate-y-1/2 rotate-90" />
      <HandleIcon className="absolute top-1/2 -right-3 size-6 -translate-y-1/2 rotate-90" />
    </div>
  );
};

const HandleIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      width="14"
      height="5"
      viewBox="0 0 14 5"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        x1="0.543457"
        y1="0.972656"
        x2="0.543457"
        y2="4.625"
        stroke="black"
        strokeOpacity="0.2"
      />
      <line
        x1="4.54346"
        y1="0.972656"
        x2="4.54346"
        y2="4.625"
        stroke="black"
        strokeOpacity="0.2"
      />
      <line
        x1="8.54346"
        y1="0.972656"
        x2="8.54346"
        y2="4.625"
        stroke="black"
        strokeOpacity="0.2"
      />
      <line
        x1="12.5435"
        y1="0.972656"
        x2="12.5435"
        y2="4.625"
        stroke="black"
        strokeOpacity="0.2"
      />
    </svg>
  );
}; 