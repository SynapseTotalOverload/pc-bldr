import React from 'react'
import { IconMapper } from './components/IconMapper'
import type { WhyWorkWithUsBlock } from './types'

export const WhyWorkWithUs: React.FC<WhyWorkWithUsBlock> = (props) => {
  const {
    heading = 'Why Work With Us?',
    reasons = [],
    columns = '3',
    backgroundColor = 'default',
  } = props

  // Background color classes mapping
  const bgClasses = {
    default: '',
    muted: 'bg-muted',
    accent: 'bg-accent',
    secondary: 'bg-secondary',
  }

  // Grid columns classes mapping
  const gridClasses = {
    '2': 'md:grid-cols-2',
    '3': 'md:grid-cols-2 lg:grid-cols-3',
    '4': 'md:grid-cols-2 lg:grid-cols-4',
  }

  if (!reasons.length) {
    return null
  }

  return (
    <section className={`py-32 ${bgClasses[backgroundColor]}`}>
      <div className="container">
        <div className="mb-10 md:mb-20">
          <h2 className="mb-2 text-center text-3xl font-semibold lg:text-5xl">
            {heading}
          </h2>
        </div>
        <div className={`grid gap-10 ${gridClasses[columns]}`}>
          {reasons.map((reason, i) => (
            <div key={reason.id || i} className="flex flex-col">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-accent">
                <IconMapper iconType={reason.icon} className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">{reason.title}</h3>
              <p className="text-muted-foreground">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
