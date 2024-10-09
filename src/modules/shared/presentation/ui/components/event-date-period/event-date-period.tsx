import { Datetime } from '@/shared/domain/datetime/datetime'
import { Calendar } from '@/ui/icons'
import type { FC } from 'react'

export const EventDatePeriod: FC<{ startDate: Date; endDate?: Date }> = ({ startDate, endDate }) => {
  const startDateHumanized = Datetime.toDateTimeString(startDate)
  const endDateHumanized = endDate && Datetime.toDateTimeString(endDate)

  return (
    <div className="flex text-black dark:text-white">
      {startDate && (
        <div className="flex shrink-0 items-center gap-1">
          <Calendar size="1.2rem" />
          <p className="py-2 text-sm" aria-label={`Fecha de inicio ${startDateHumanized}`} tabIndex={0}>
            {startDateHumanized}
          </p>
        </div>
      )}
      {endDate && (
        <div className="flex shrink-0 items-center">
          <p className="py-2 text-sm" tabIndex={0} aria-label={`Fecha de fin ${endDateHumanized}`}>
            &nbsp;· {endDateHumanized}
          </p>
        </div>
      )}
    </div>
  )
}
