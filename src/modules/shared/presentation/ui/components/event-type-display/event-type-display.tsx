import type { FC } from 'react'
import { EventType, EventTypes } from '@/modules/events/domain/event-type'
import { MeetupType, MeetupTypes } from '@/modules/meetups/domain/meetup-type'
import { LaptopBold, MapPin, Users } from '@/ui/icons'
import { EventDataRow } from '../event-data-row/event-data-row'

interface Props {
  type: EventType | MeetupType
}

export const EventTypeDisplay: FC<Props> = ({ type }) => {
  const getTypeInfo = () => {
    const typeValue = type.value

    switch (typeValue) {
      case EventTypes.InPerson:
      case MeetupTypes.InPerson:
        return {
          title: 'Tipo',
          icon: <MapPin />,
          value: 'Presencial',
        }
      case EventTypes.Online:
      case MeetupTypes.Online:
        return {
          title: 'Tipo',
          icon: <LaptopBold />,
          value: 'Online',
        }
      case EventTypes.Hybrid:
      case MeetupTypes.Hybrid:
        return {
          title: 'Tipo',
          icon: <Users />,
          value: 'Híbrido',
        }
      default:
        return {
          title: 'Tipo',
          icon: <MapPin />,
          value: 'Presencial',
        }
    }
  }

  const { title, icon, value } = getTypeInfo()

  return <EventDataRow title={title} icon={icon} value={value} ariaLabel={`Tipo de evento ${value}`} />
}
