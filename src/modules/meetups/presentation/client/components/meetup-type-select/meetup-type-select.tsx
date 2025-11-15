import type { FC } from 'react'
import { MeetupTypes } from '@/meetups/domain/meetup-type'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select'

interface Props {
  id?: string
  placeholder?: string
  value?: string
  className?: string
  onChange?: (value: string | null) => void
}

export const MeetupTypeSelect: FC<Props> = props => {
  const { id, placeholder, value, className, onChange } = props

  const handleChange = (value: string) => {
    const newValue = Object.values(MeetupTypes).includes(value) ? value : null
    onChange?.(newValue)
  }

  return (
    <Select value={value} onValueChange={handleChange}>
      <SelectTrigger id={id} className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {Object.values(MeetupTypes).map(type => (
          <SelectItem value={type} key={type}>
            {MeetupTypeLabels[type]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

const MeetupTypeLabels = {
  [MeetupTypes.InPerson]: 'Presencial',
  [MeetupTypes.Online]: 'Online',
  [MeetupTypes.Hybrid]: 'Presencial + Online',
}
