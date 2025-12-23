import { MeetupType } from '@/meetups/domain/meetup-type'
import { Datetime } from '@/shared/domain/datetime/datetime'
import { Meetup } from '../../domain/meetup'
import type { AstroDbMeetupDto } from '../dtos/astro-db-meetup.dto'
import type { AstroDbMeetupAttendeeId } from '../dtos/astro-db-meetup-attendee-id'
import type { AstroDbMeetupProvinceDto } from '../dtos/astro-db-meetup-province.dto'

export class AstroDbMeetupMapper {
  static toDomainList(dtos: { Meetup: AstroDbMeetupDto; Province: AstroDbMeetupProvinceDto | null }[]): Meetup[] {
    return dtos.map(({ Meetup, Province }) =>
      AstroDbMeetupMapper.toDomain({ meetupDto: Meetup, provinceDto: Province, attendeesIds: [] }),
    )
  }

  static toDomain(dto: {
    meetupDto: AstroDbMeetupDto
    provinceDto: AstroDbMeetupProvinceDto | null
    attendeesIds: AstroDbMeetupAttendeeId[]
  }): Meetup {
    const { meetupDto, provinceDto, attendeesIds = [] } = dto

    return Meetup.fromPrimitives({
      id: meetupDto.id ?? '',
      slug: meetupDto.slug,
      title: meetupDto.title,
      shortDescription: meetupDto.shortDescription,
      startsAt: Datetime.toIsoString(meetupDto.startsAt),
      endsAt: Datetime.toIsoString(meetupDto.endsAt),
      image: meetupDto.image,
      location: provinceDto?.name || null,
      web: meetupDto.web || undefined,
      twitter: meetupDto.twitter || undefined,
      linkedin: meetupDto.linkedin || undefined,
      youtube: meetupDto.youtube || undefined,
      twitch: meetupDto.twitch || undefined,
      facebook: meetupDto.facebook || undefined,
      instagram: meetupDto.instagram || undefined,
      github: meetupDto.github || undefined,
      telegram: meetupDto.telegram || undefined,
      whatsapp: meetupDto.whatsapp || undefined,
      discord: meetupDto.discord || undefined,
      tiktok: meetupDto.tiktok || undefined,
      streamingUrl: meetupDto.streamingUrl || undefined,
      tags: meetupDto.tags.length > 0 ? meetupDto.tags.split(',') : [],
      tagColor: meetupDto.tagColor,
      content: meetupDto.content,
      organizationId: meetupDto.organizationId || undefined,
      type: MeetupType.of(meetupDto.type).value,
      attendees: attendeesIds.map(attendee => attendee.userId),
      place: meetupDto.place || undefined,
      allowsAttendees: meetupDto.allowsAttendees,
      registrationEndsAt: meetupDto.registrationEndsAt ? Datetime.toIsoString(meetupDto.registrationEndsAt) : undefined,
      maxAttendees: meetupDto.maxAttendees || undefined,
    })
  }
}
