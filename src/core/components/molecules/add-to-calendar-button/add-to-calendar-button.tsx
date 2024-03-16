import { type FC } from 'react'
import { AddToCalendarButton as AddToCalendar } from 'add-to-calendar-button-react'
import './add-to-calendar-button.css'

type AddToCalendarButtonProps = {
  title: string
  description?: string
  location?: string
  startDate: string
  endDate: string
  startTime: string
  endTime: string
}

export const AddToCalendarButton: FC<AddToCalendarButtonProps> = props => {
  const { title, ...restOfProps } = props

  return (
    <AddToCalendar
      name={title}
      listStyle="dropdown"
      trigger="click"
      iCalFileName={title}
      label="Añadir a calendario"
      options={['Apple', 'Google', 'iCal', 'Microsoft365', 'Outlook.com']}
      timeZone="Europe/Madrid"
      buttonStyle="round"
      size="4"
      {...restOfProps}
    />
  )
}
