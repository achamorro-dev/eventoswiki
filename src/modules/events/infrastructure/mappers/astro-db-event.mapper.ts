import { Datetime } from '@/shared/domain/datetime/datetime'
import { Event } from '../../domain/event'
import type { AstroDbEventDto } from '../dtos/astro-db-event.dto'

export class AstroEventMapper {
  static toDomainList(dtos: AstroDbEventDto[]): Event[] {
    return dtos.map(this.toDomain)
  }

  static toDomain(dto: AstroDbEventDto): Event {
    return Event.fromPrimitives({
      slug: dto.slug,
      title: dto.title,
      shortDescription: dto.shortDescription,
      startsAt: Datetime.toIsoString(dto.startsAt),
      endsAt: Datetime.toIsoString(dto.endsAt),
      thumbnail: dto.thumbnail,
      image: dto.image,
      location: dto.location,
      web: dto.web,
      twitter: dto.twitter || undefined,
      linkedin: dto.linkedin || undefined,
      youtube: dto.youtube || undefined,
      twitch: dto.twitch || undefined,
      facebook: dto.facebook || undefined,
      instagram: dto.instagram || undefined,
      github: dto.github || undefined,
      telegram: dto.telegram || undefined,
      whatsapp: dto.whatsapp || undefined,
      discord: dto.discord || undefined,
      tags: dto.tags.split(','),
      tagColor: dto.tagColor,
      content: dto.content,
    })
  }
}
