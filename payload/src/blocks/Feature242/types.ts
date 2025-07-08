import type { Media } from '@/payload-types';

export interface Feature242Item {
  title: string;
  href?: string;
  image?: Media | string;
  imageUrl?: string;
}

export interface Feature242Block {
  blockType: 'feature242';
  blockName?: string;
  title?: string;
  description?: string;
  readMoreText?: string;
  items?: Feature242Item[];
} 