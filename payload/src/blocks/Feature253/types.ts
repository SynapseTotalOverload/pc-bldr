export interface Feature253Block {
  blockType: 'feature253';
  enabled?: boolean;
  title?: string;
  description?: string;
  buttonText?: string;
  link?: {
    type?: 'reference' | 'custom';
    reference?: any;
    url?: string;
    newTab?: boolean;
  };
} 