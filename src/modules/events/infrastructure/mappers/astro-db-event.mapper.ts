import { Datetime } from '@/shared/domain/datetime/datetime'
import { Event } from '../../domain/event'
import type { AstroDbEventProvinceDto } from '../dtos/astro-db-event-province.dto'
import type { AstroDbEventDto } from '../dtos/astro-db-event.dto'

export class AstroEventMapper {
  static toDomainList(dtos: { Event: AstroDbEventDto; Province: AstroDbEventProvinceDto | null }[]): Event[] {
    return dtos.map(({ Event, Province }) => this.toDomain(Event, Province))
  }

  static toDomain(eventDto: AstroDbEventDto, provinceDto: AstroDbEventProvinceDto | null): Event {
    return Event.fromPrimitives({
      slug: eventDto.slug,
      title: eventDto.title,
      shortDescription: eventDto.shortDescription,
      startsAt: Datetime.toIsoString(eventDto.startsAt),
      endsAt: Datetime.toIsoString(eventDto.endsAt),
      thumbnail: eventDto.thumbnail,
      image: eventDto.image,
      location: provinceDto?.name || null,
      web: eventDto.web,
      twitter: eventDto.twitter || undefined,
      linkedin: eventDto.linkedin || undefined,
      youtube: eventDto.youtube || undefined,
      twitch: eventDto.twitch || undefined,
      facebook: eventDto.facebook || undefined,
      instagram: eventDto.instagram || undefined,
      github: eventDto.github || undefined,
      telegram: eventDto.telegram || undefined,
      whatsapp: eventDto.whatsapp || undefined,
      discord: eventDto.discord || undefined,
      tiktok: eventDto.tiktok || undefined,
      tags: eventDto.tags.split(','),
      tagColor: eventDto.tagColor,
      content: eventDto.content,
    })
  }
}
