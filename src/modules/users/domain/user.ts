import type { Primitives, Properties } from '@/shared/domain/primitives/primitives'
import { InvalidUserProfileError } from './errors/invalid-user-profile.error'
import type { Profile } from './profile'
import { UserId } from './user-id'
import { UserProfileValidator } from './validators/user-profile.validator'

export interface UserProps {
  id: UserId
  name: string
  username: string
  email: string | null
  avatar: URL | null
  readonly organizations: string[]
}

export class User implements UserProps {
  id: UserId
  name: string
  username: string
  email: string | null
  avatar: URL | null
  organizations: string[]

  constructor(user: Properties<User>) {
    this.id = user.id
    this.name = user.name
    this.username = user.username
    this.email = user.email
    this.avatar = user.avatar
    this.organizations = user.organizations
  }

  static fromPrimitives(primitives: Primitives<User>): User {
    return new User({
      id: UserId.of(primitives.id),
      name: primitives.name,
      username: primitives.username,
      email: primitives.email,
      avatar: primitives.avatar ? new URL(primitives.avatar) : null,
      organizations: primitives.organizations,
    })
  }

  toPrimitives(): Primitives<User> {
    return {
      id: this.id.value,
      name: this.name,
      username: this.username,
      email: this.email,
      avatar: this.avatar?.toString() || null,
      organizations: this.organizations,
    }
  }

  getId(): string {
    return this.id.value
  }

  updateProfile(profile: Profile) {
    this.ensureIsValidProfile(profile)

    this.email = profile.email
    this.name = profile.name
    this.username = profile.username
    this.avatar = profile.avatar ? new URL(profile.avatar) : null
  }

  private ensureIsValidProfile(profile: Profile) {
    const validator = new UserProfileValidator(profile)
    const error = validator.validate()

    if (error) throw new InvalidUserProfileError(error)
  }

  getAvatarUrlString() {
    return this.avatar?.toString() || null
  }
}
