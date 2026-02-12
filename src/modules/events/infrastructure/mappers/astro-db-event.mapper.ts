import { Datetime } from '@/shared/domain/datetime/datetime'
import type { Agenda } from '../../domain/agenda/agenda'
import { Event } from '../../domain/event'
import { EventTypes } from '../../domain/event-type'
import type { AstroDbEventDto } from '../dtos/astro-db-event.dto'
import type { AstroDbEventProvinceDto } from '../dtos/astro-db-event-province.dto'

export class AstroEventMapper {
  static toDomainList(
    dtos: { Event: AstroDbEventDto; Province: AstroDbEventProvinceDto | null }[],
    agendas?: (Agenda | undefined)[],
  ): Event[] {
    return dtos.map(({ Event, Province }, index) => {
      const agenda = agendas?.[index]
      return AstroEventMapper.toDomain(Event, Province, agenda)
    })
  }

  static toDomain(eventDto: AstroDbEventDto, provinceDto: AstroDbEventProvinceDto | null, agenda?: Agenda): Event {
    return Event.fromPrimitives({
      id: eventDto.id ?? '',
      slug: eventDto.slug,
      title: eventDto.title,
      shortDescription: eventDto.shortDescription,
      startsAt: Datetime.toIsoString(eventDto.startsAt),
      endsAt: Datetime.toIsoString(eventDto.endsAt),
      image: eventDto.image,
      type: eventDto.type ?? EventTypes.InPerson,
      location: provinceDto?.name || null,
      web: eventDto.web || undefined,
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
      streamingUrl: eventDto.streamingUrl || undefined,
      tags: eventDto.tags.length > 0 ? eventDto.tags.split(',') : [],
      tagColor: eventDto.tagColor,
      content: eventDto.content,
      organizationId: eventDto.organizationId || undefined,
      place: eventDto.place || undefined,
      tickets: [],
      callForSponsorsEnabled: eventDto.callForSponsorsEnabled,
      callForSponsorsContent: eventDto.callForSponsorsContent ?? undefined,
      callForSpeakersEnabled: eventDto.callForSpeakersEnabled,
      callForSpeakersStartsAt: eventDto.callForSpeakersStartsAt?.toISOString() ?? undefined,
      callForSpeakersEndsAt: eventDto.callForSpeakersEndsAt?.toISOString() ?? undefined,
      callForSpeakersContent: eventDto.callForSpeakersContent ?? undefined,
      agenda: agenda ? agenda.toPrimitives() : undefined,
    })
  }
}
