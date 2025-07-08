import { LucideIcon } from 'lucide-react';

export type IconType = 'google' | 'figma' | 'notion' | 'g2' | 'block' | 'cpu' | 'gpu' | 'motherboard' | 'memory' | 'storage' | 'power-supply' | 'case' | 'cpu-cooler';

export interface Card1Icons {
  icon1?: IconType;
  icon2?: IconType;
  icon3?: IconType;
  icon4?: IconType;
}

export interface Card2Icons {
  topIcon?: IconType;
  bottomIcon?: IconType;
}

export interface Card1 {
  title?: string;
  description?: string;
  enabled?: boolean;
  icons?: Card1Icons;
}

export interface Card2 {
  title?: string;
  description?: string;
  enabled?: boolean;
  icons?: Card2Icons;
}

export interface Card3 {
  title?: string;
  description?: string;
  enabled?: boolean;
  image?: IconType;
}

export interface Card4 {
  title?: string;
  description?: string;
  enabled?: boolean;
}

export interface Feature251Block {
  blockType: 'feature251';
  blockName?: string;
  card1?: Card1;
  card2?: Card2;
  card3?: Card3;
  card4?: Card4;
} 