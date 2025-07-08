import type { Media, Page, Post } from '@/payload-types';

export interface LinkField {
  type?: 'reference' | 'custom';
  newTab?: boolean;
  reference?: {
    relationTo: 'pages' | 'posts';
    value: Page | Post | string;
  };
  url?: string;
}

export interface Feature157Card {
  title: string;
  description: string;
  link?: LinkField;
  image?: Media | string;
  imageUrl?: string;
}

export interface Feature157Block {
  blockType: 'feature157';
  blockName?: string;
  subtitle?: string;
  title?: string;
  cards?: Feature157Card[];
} 