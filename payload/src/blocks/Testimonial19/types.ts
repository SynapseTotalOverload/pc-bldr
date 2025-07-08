import type { Media } from '@/payload-types';

export interface Testimonial {
  name?: string;
  role?: string;
  content?: string;
  avatar?: Media | string;
  rating?: number;
}

export interface Testimonial19Block {
  blockType: 'testimonial19';
  enabled?: boolean;
  title?: string;
  subtitle?: string;
  ratingText?: string;
  linkText?: string;
  linkUrl?: string;
  link?: {
    type?: 'reference' | 'custom';
    reference?: any;
    url?: string;
    newTab?: boolean;
  };
  testimonials?: Testimonial[];
} 