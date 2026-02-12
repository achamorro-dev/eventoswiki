import { ValueObject } from '@/shared/domain/value-object'

export interface SpeakerProps {
  id: string
  name: string
  image?: string
  bio?: string
  position?: string
  socialLinks?: SocialLinks
}

export interface SocialLinks {
  twitter?: string
  linkedin?: string
  github?: string
  web?: string
}

export type SpeakerPrimitives = {
  id: string
  name: string
  image?: string
  bio?: string
  position?: string
  socialLinks?: SocialLinks
}

export class Speaker extends ValueObject<SpeakerProps> {
  constructor(value: SpeakerProps) {
    Speaker.ensureIsValid(value)
    super(value)
  }

  static fromPrimitives(primitives: SpeakerPrimitives): Speaker {
    return new Speaker({
      id: primitives.id,
      name: primitives.name,
      image: primitives.image,
      bio: primitives.bio,
      position: primitives.position,
      socialLinks: primitives.socialLinks,
    })
  }

  toPrimitives(): SpeakerPrimitives {
    return {
      id: this.value.id,
      name: this.value.name,
      image: this.value.image,
      bio: this.value.bio,
      position: this.value.position,
      socialLinks: this.value.socialLinks,
    }
  }

  static create(data: {
    id: string
    name: string
    image?: string
    bio?: string
    position?: string
    socialLinks?: SocialLinks
  }): Speaker {
    return new Speaker({
      id: data.id,
      name: data.name,
      image: data.image,
      bio: data.bio,
      position: data.position,
      socialLinks: data.socialLinks,
    })
  }

  private static ensureIsValid(data: SpeakerProps): void {
    const { name } = data

    if (typeof name !== 'string' || name.trim().length < 1) {
      throw new Error('El nombre del speaker es obligatorio')
    }
  }

  getId(): string {
    return this.value.id
  }

  getName(): string {
    return this.value.name
  }

  getImage(): string | undefined {
    return this.value.image
  }

  getBio(): string | undefined {
    return this.value.bio
  }

  getPosition(): string | undefined {
    return this.value.position
  }

  getSocialLinks(): SocialLinks | undefined {
    return this.value.socialLinks
  }

  hasImage(): boolean {
    return !!this.value.image
  }

  hasBio(): boolean {
    return !!this.value.bio
  }
}
