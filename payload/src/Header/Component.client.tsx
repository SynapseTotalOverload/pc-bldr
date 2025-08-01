'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
  }, [pathname, setHeaderTheme])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
  }, [headerTheme, theme])

  // Helper function to get URL from link data
  const getLinkUrl = (link: any) => {
    if (link.type === 'custom') {
      return link.url || '#'
    }
    
    if (link.type === 'reference' && link.reference) {
      const { relationTo, value } = link.reference
      if (relationTo === 'pages') {
        return typeof value === 'string' ? `/pages/${value}` : `/${value.slug || value.id}`
      }
      if (relationTo === 'posts') {
        return typeof value === 'string' ? `/posts/${value}` : `/posts/${value.slug || value.id}`
      }
    }
    
    return '#'
  }

  return (
    <header className={`relative z-20 ${theme ? `data-theme-${theme}` : ''}`}>
      <div className="container">
        <div className="py-8 flex justify-between items-center">
          <Link href="/">
            <Logo loading="eager" priority="high" className="invert dark:invert-0" />
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            {data?.navItems?.filter(item => item.link).map((item, i) => {
              const url = getLinkUrl(item.link)
              const isActive = pathname === url
              
              return (
                <Link
                  key={item.id || i}
                  href={url}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`}
                  {...(item.link?.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  {item.link?.label}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Header Section */}
        {data?.showHero && (
          <section className="py-32">
            <div className="text-center">
              <div className="mx-auto flex max-w-5xl flex-col gap-6">
                <h1 className="text-3xl font-extrabold lg:text-6xl">
                  {data?.headerHeading || "Build Your Dream PC"}
                </h1>
                <p className="text-muted-foreground text-balance lg:text-lg">
                  {data?.headerDescription || "Configure and order your custom PC with our easy-to-use builder. Get exactly what you need for gaming, work, or creative projects."}
                </p>
              </div>
            </div>
          </section>
        )}
      </div>
    </header>
  )
}
