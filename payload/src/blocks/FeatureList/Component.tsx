import { cn } from '@/utilities/ui'
import React from 'react'

// Temporary type until payload-types are generated
type FeatureListBlockProps = {
  title?: string
  description?: string
  layout?: 'grid' | 'list' | 'cards'
  columns?: '1' | '2' | '3' | '4'
  features?: Array<{
    icon: string
    title: string
    description: string
    link?: {
      url?: string
      text?: string
    }
  }>
  backgroundColor?: 'default' | 'primary' | 'secondary' | 'accent' | 'muted'
}

type Props = {
  className?: string
} & FeatureListBlockProps

// Extended icon components
const Icons = {
  star: () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  ),
  heart: () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
    </svg>
  ),
  check: () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  ),
  lightning: () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
    </svg>
  ),
  shield: () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  ),
  rocket: () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
    </svg>
  ),
  settings: () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
    </svg>
  ),
  users: () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  globe: () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
    </svg>
  ),
  award: () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  ),
}

const FeatureItem: React.FC<{
  feature: {
    icon: string
    title: string
    description: string
    link?: {
      url?: string
      text?: string
    }
  }
  layout: string
  backgroundColor: string
}> = ({ feature, layout, backgroundColor }) => {
  const IconComponent = Icons[feature.icon as keyof typeof Icons] || Icons.star

  const bgClasses = {
    default: 'bg-card border-border',
    primary: 'bg-primary/10 border-primary/20',
    secondary: 'bg-secondary/10 border-secondary/20',
    accent: 'bg-accent/10 border-accent/20',
    muted: 'bg-muted border-border',
  }

  const iconBgClasses = {
    default: 'bg-muted text-muted-foreground',
    primary: 'bg-primary/20 text-primary',
    secondary: 'bg-secondary/20 text-secondary',
    accent: 'bg-accent/20 text-accent',
    muted: 'bg-background text-muted-foreground',
  }

  if (layout === 'list') {
    return (
      <div className="flex items-start space-x-4 p-4 border-b border-border last:border-b-0">
        <div className={cn('p-2 rounded-full flex-shrink-0', iconBgClasses[backgroundColor as keyof typeof iconBgClasses])}>
          <IconComponent />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
          <p className="text-muted-foreground mb-3">{feature.description}</p>
          {feature.link?.url && (
            <a 
              href={feature.link.url} 
              className="text-primary hover:underline inline-flex items-center"
            >
              {feature.link.text || 'Дізнатися більше'}
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          )}
        </div>
      </div>
    )
  }

  if (layout === 'cards') {
    return (
      <div className={cn(
        'border rounded-lg p-6 transition-all duration-200 hover:shadow-lg h-full',
        bgClasses[backgroundColor as keyof typeof bgClasses]
      )}>
        <div className="flex items-center mb-4">
          <div className={cn('p-2 rounded-full', iconBgClasses[backgroundColor as keyof typeof iconBgClasses])}>
            <IconComponent />
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
        <p className="text-muted-foreground mb-4 flex-1">{feature.description}</p>
        {feature.link?.url && (
          <a 
            href={feature.link.url} 
            className="text-primary hover:underline inline-flex items-center"
          >
            {feature.link.text || 'Дізнатися більше'}
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        )}
      </div>
    )
  }

  return (
    <div className="text-center">
      <div className={cn('p-3 rounded-full inline-flex mb-4', iconBgClasses[backgroundColor as keyof typeof iconBgClasses])}>
        <IconComponent />
      </div>
      <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
      <p className="text-muted-foreground mb-3">{feature.description}</p>
      {feature.link?.url && (
        <a 
          href={feature.link.url} 
          className="text-primary hover:underline inline-flex items-center"
        >
          {feature.link.text || 'Дізнатися більше'}
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      )}
    </div>
  )
}

export const FeatureListBlock: React.FC<Props> = ({ 
  className, 
  title,
  description,
  layout = 'grid',
  columns = '3',
  features = [],
  backgroundColor = 'default'
}) => {
  const gridCols = {
    '1': 'grid-cols-1',
    '2': 'grid-cols-1 md:grid-cols-2',
    '3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    '4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }

  const bgClasses = {
    default: 'bg-background',
    primary: 'bg-primary/5',
    secondary: 'bg-secondary/5',
    accent: 'bg-accent/5',
    muted: 'bg-muted/50',
  }

  return (
    <div className={cn('mx-auto my-16 w-full', className)}>
      <div className={cn('py-12 px-4', bgClasses[backgroundColor as keyof typeof bgClasses])}>
        <div className="container mx-auto">
          {(title || description) && (
            <div className="text-center mb-12">
              {title && <h2 className="text-3xl font-bold mb-4">{title}</h2>}
              {description && <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{description}</p>}
            </div>
          )}

                     {layout === 'list' && (
             <div className="max-w-4xl mx-auto">
               <div className="bg-card border rounded-lg divide-y divide-border">
                 {features?.map((feature, index) => (
                   <FeatureItem 
                     key={index} 
                     feature={feature} 
                     layout={layout} 
                     backgroundColor={backgroundColor}
                   />
                 ))}
               </div>
             </div>
           )}

                     {layout === 'cards' && (
             <div className={cn('grid gap-6', gridCols[columns as keyof typeof gridCols])}>
               {features?.map((feature, index) => (
                 <FeatureItem 
                   key={index} 
                   feature={feature} 
                   layout={layout} 
                   backgroundColor={backgroundColor}
                 />
               ))}
             </div>
           )}

                     {layout === 'grid' && (
             <div className={cn('grid gap-8', gridCols[columns as keyof typeof gridCols])}>
               {features?.map((feature, index) => (
                 <FeatureItem 
                   key={index} 
                   feature={feature} 
                   layout={layout} 
                   backgroundColor={backgroundColor}
                 />
               ))}
             </div>
           )}
        </div>
      </div>
    </div>
  )
} 