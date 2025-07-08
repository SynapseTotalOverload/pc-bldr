export interface WhyWorkWithUsBlock {
  heading?: string
  reasons: Array<{
    title: string
    description: string
    icon: 'GitPullRequest' | 'SquareKanban' | 'RadioTower' | 'WandSparkles' | 'Layers' | 'BatteryCharging' | 'Shield' | 'Zap' | 'CheckCircle' | 'Star'
    id?: string
  }>
  columns?: '2' | '3' | '4'
  backgroundColor?: 'default' | 'muted' | 'accent' | 'secondary'
  id?: string
  blockName?: string
  blockType: 'whyWorkWithUs'
}
