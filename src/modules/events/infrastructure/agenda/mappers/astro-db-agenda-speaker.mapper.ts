import { Speaker } from '../../../domain/agenda/speaker'
import type { AstroDbAgendaSpeakerDto } from './astro-db-agenda-speaker.dto'

export class AstroDbAgendaSpeakerMapper {
  static toDomain(dto: AstroDbAgendaSpeakerDto): Speaker {
    return Speaker.fromPrimitives({
      id: dto.id,
      name: dto.name,
      image: dto.image ?? undefined,
      bio: dto.bio ?? undefined,
      position: dto.position ?? undefined,
      socialLinks: {
        twitter: dto.twitter ?? undefined,
        linkedin: dto.linkedin ?? undefined,
        github: dto.github ?? undefined,
        web: dto.web ?? undefined,
      },
    })
  }

  static toDto(speaker: Speaker): AstroDbAgendaSpeakerDto {
    return {
      id: speaker.getId(),
      name: speaker.getName(),
      image: speaker.getImage() ?? null,
      bio: speaker.getBio() ?? null,
      position: speaker.getPosition() ?? null,
      twitter: speaker.getSocialLinks()?.twitter ?? null,
      linkedin: speaker.getSocialLinks()?.linkedin ?? null,
      github: speaker.getSocialLinks()?.github ?? null,
      web: speaker.getSocialLinks()?.web ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }
}
