import type { Primitives, Properties } from '@/shared/domain/primitives/primitives'
import { UserId } from './user-id'

export class User {
  id: UserId
  name: string
  username: string
  email: string | null
  avatar: URL

  constructor(user: Properties<User>) {
    this.id = user.id
    this.name = user.name
    this.username = user.username
    this.email = user.email
    this.avatar = user.avatar
  }

  static fromPrimitives(primitives: Primitives<User>): User {
    return new User({
      id: UserId.of(primitives.id),
      name: primitives.name,
      username: primitives.username,
      email: primitives.email,
      avatar: new URL(primitives.avatar),
    })
  }

  toPrimitives(): Primitives<User> {
    return {
      id: this.id.value,
      name: this.name,
      username: this.username,
      email: this.email,
      avatar: this.avatar.toString(),
    }
  }
}
