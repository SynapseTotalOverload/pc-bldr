export interface Integration2Block {
  blockType: 'integration2';
  blockName?: string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: {
    type?: 'reference' | 'custom';
    newTab?: boolean;
    reference?: {
      relationTo: 'pages' | 'posts';
      value: string | any;
    };
    url?: string;
    label?: string;
    appearance?: 'default' | 'outline';
  };
} 