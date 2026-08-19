import type { FC } from 'react'

interface Props {
  title: string
  icon: React.ReactNode
  value: string | React.ReactNode
  ariaLabel?: string
}

export const EventDataRow: FC<Props> = ({ title, icon, value, ariaLabel }) => {
  return (
    <dl className="my-4" aria-label={ariaLabel}>
      <div className="flex flex-row items-center gap-4">
        <span
          aria-hidden="true"
          className="flex size-10 shrink-0 items-center justify-center rounded-md border border-border text-foreground"
        >
          {icon}
        </span>
        <div className="flex flex-col gap-1">
          <dt className="font-medium text-[0.6875rem] text-muted-foreground uppercase tracking-[0.12em]">{title}</dt>
          <dd className="font-medium text-foreground text-sm">{value}</dd>
        </div>
      </div>
    </dl>
  )
}
