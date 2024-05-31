import { Datetime } from '@/core/datetime/datetime'
import { Event } from '../../domain/event'
import type { AstroEventDto } from '../dtos/astro-event-dto'

export class AstroEventMapper {
  static toDomain(astroEvents: AstroEventDto[]): Event[] {
    return astroEvents.map(astroEvent => {
      const { id, slug, data } = astroEvent
      const { startsAt: startDate, endsAt: endDate, ...restOfData } = data

      return Event.fromPrimitives({
        id,
        slug,
        ...restOfData,
        startsAt: Datetime.toIsoString(data.startsAt),
        endsAt: Datetime.toIsoString(data.endsAt),
      })
    })
  }
}
