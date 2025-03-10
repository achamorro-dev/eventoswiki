import { Datetime } from '@/shared/domain/datetime/datetime'
import { Meetup } from '../../domain/meetup'
import type { AstroDbMeetupProvinceDto } from '../dtos/astro-db-meetup-province.dto'
import type { AstroDbMeetupDto } from '../dtos/astro-db-meetup.dto'

export class AstroDbMeetupMapper {
  static toDomainList(dtos: { Meetup: AstroDbMeetupDto; Province: AstroDbMeetupProvinceDto | null }[]): Meetup[] {
    return dtos.map(({ Meetup, Province }) => this.toDomain(Meetup, Province))
  }

  static toDomain(meetupDto: AstroDbMeetupDto, provinceDto: AstroDbMeetupProvinceDto | null): Meetup {
    return Meetup.fromPrimitives({
      slug: meetupDto.slug,
      title: meetupDto.title,
      shortDescription: meetupDto.shortDescription,
      startsAt: Datetime.toIsoString(meetupDto.startsAt),
      endsAt: Datetime.toIsoString(meetupDto.endsAt),
      thumbnail: meetupDto.thumbnail,
      image: meetupDto.image,
      location: provinceDto?.name || null,
      web: meetupDto.web,
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
      tags: meetupDto.tags.split(','),
      tagColor: meetupDto.tagColor,
      content: meetupDto.content,
    })
  }
}
