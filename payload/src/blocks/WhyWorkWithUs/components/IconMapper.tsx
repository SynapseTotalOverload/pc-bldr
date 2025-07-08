import React from 'react'
import {
  BatteryCharging,
  CheckCircle,
  GitPullRequest,
  Layers,
  RadioTower,
  Shield,
  SquareKanban,
  Star,
  WandSparkles,
  Zap,
} from 'lucide-react'

interface IconMapperProps {
  iconType: string
  className?: string
}

const iconMap = {
  GitPullRequest,
  SquareKanban,
  RadioTower,
  WandSparkles,
  Layers,
  BatteryCharging,
  Shield,
  Zap,
  CheckCircle,
  Star,
}

export const IconMapper: React.FC<IconMapperProps> = ({ iconType, className = "h-6 w-6" }) => {
  const IconComponent = iconMap[iconType as keyof typeof iconMap] || Star

  return <IconComponent className={className} />
} 