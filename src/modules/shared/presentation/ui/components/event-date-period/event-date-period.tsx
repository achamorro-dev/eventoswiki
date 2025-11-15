import type { FC } from 'react'
import { DateTimeFormat, Datetime } from '@/shared/domain/datetime/datetime'
import { CalendarBlank } from '@/ui/icons'
import { EventDataRow } from '../event-data-row/event-data-row'

export const EventDatePeriod: FC<{ startDate: Date; endDate?: Date }> = ({ startDate, endDate }) => {
  const startDateHumanized = Datetime.toDateTimeString(startDate, DateTimeFormat.DDD_MMM_YYYY_HH_MM)
  const endDateHumanized = endDate && Datetime.toDateTimeString(endDate, DateTimeFormat.DDD_MMM_YYYY_HH_MM)

  return (
    <>
      <EventDataRow
        title="Empieza"
        icon={<CalendarBlank />}
        value={startDateHumanized}
        ariaLabel={`Fecha de inicio ${startDateHumanized}`}
      />
      {endDateHumanized && (
        <EventDataRow
          title="Termina"
          icon={<CalendarBlank />}
          value={endDateHumanized}
          ariaLabel={`Fecha de fin ${endDateHumanized}`}
        />
      )}
    </>
  )
}
