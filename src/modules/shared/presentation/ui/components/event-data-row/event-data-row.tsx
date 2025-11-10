import { Button } from '@/ui/button'
import type { FC } from 'react'

interface Props {
  title: string
  icon: React.ReactNode
  value: string | React.ReactNode
  ariaLabel?: string
}

export const EventDataRow: FC<Props> = ({ title, icon, value, ariaLabel }) => {
  return (
    <div className="my-4 flex flex-row items-center gap-4" aria-label={ariaLabel}>
      <Button variant="outline" size="icon" className="pointer-events-none">
        {icon}
      </Button>
      <div className="flex flex-col gap-1">
        <span className="text-muted-foreground text-xs font-medium">{title}</span>
        {typeof value === 'string' ? <span className="text-foreground text-sm font-medium">{value}</span> : value}
      </div>
    </div>
  )
}
