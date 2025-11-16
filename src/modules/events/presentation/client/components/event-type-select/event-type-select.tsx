import type { FC } from 'react'
import { EventTypes } from '@/events/domain/event-type'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select'

interface Props {
  id?: string
  placeholder?: string
  value?: string
  className?: string
  onChange?: (value: string | null) => void
}

export const EventTypeSelect: FC<Props> = props => {
  const { id, placeholder, value, className, onChange } = props

  const handleChange = (value: string) => {
    const newValue = Object.values(EventTypes).includes(value) ? value : null
    onChange?.(newValue)
  }

  return (
    <Select value={value} onValueChange={handleChange}>
      <SelectTrigger id={id} className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {Object.values(EventTypes).map(type => (
          <SelectItem value={type} key={type}>
            {EventTypeLabels[type]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

const EventTypeLabels = {
  [EventTypes.InPerson]: 'Presencial',
  [EventTypes.Online]: 'Online',
  [EventTypes.Hybrid]: 'Presencial + Online',
}
