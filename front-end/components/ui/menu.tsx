"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from '@/components/theme-provider';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Table, LayoutGrid } from "lucide-react";
import { useState } from "react";
import { useMemo } from "react";
import { Button } from '@/components/ui/button';


type MenuItem = {
  label: string;
  href: string;
};

const MENU_ITEMS: MenuItem[] = [
  { label: "Products", href: "/" },
  { label: "Accessories", href: "/accessories" },
  { label: "Skins", href: "/skins" },
  { label: "Builds", href: "/builds" },
  { label: "Players", href: "/players" },
  { label: "Team", href: "/team" },
  { label: "Games", href: "/games" },
  { label: "Configurator", href: "/configurator" },
];

export function MainMenu({ className }: { className?: string }) {
  const pathname = usePathname();
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const currentLabel = useMemo(() => {
    if (pathname === '/') return 'Products';
    const match = MENU_ITEMS.find((m) => pathname === m.href || pathname.startsWith(`${m.href}/`));
    return match ? match.label : 'Page';
  }, [pathname]);
  const isCurrent = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <div className="flex items-center justify-between">
          <h1 className="mb-8 text-4xl font-bold">PC {currentLabel}</h1>
            <div className="flex items-center gap-4">
            <ThemeToggle />
            {MENU_ITEMS.filter((item) => !isCurrent(item.href)).map((item) => (
                <Link href={item.href}>
                    <Button>{item.label}</Button>
                </Link>
            ))}
        </div>
    </div>
  );
}