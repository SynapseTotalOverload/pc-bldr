export interface HeroMeteorBlock {
  blockType: 'heroMeteor'
  subtitle?: string
  title?: string
  buttonText?: string
  buttonLink?: {
    type?: 'reference' | 'custom'
    newTab?: boolean
    reference?: {
      relationTo: 'pages' | 'posts'
      value: string | any
    }
    url?: string
    label?: string
    appearance?: 'default' | 'outline'
  }
  meteorsCount?: number
  showGlobe?: boolean
  globeSize?: 'small' | 'medium' | 'large'
  id?: string
} 