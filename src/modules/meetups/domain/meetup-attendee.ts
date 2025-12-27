import type { Primitives } from '@/shared/domain/primitives/primitives'

export interface MeetupAttendeeProps {
  userId: string
  name: string
  username: string
  avatar: string | null
}

export class MeetupAttendee implements MeetupAttendeeProps {
  readonly userId: string
  readonly name: string
  readonly username: string
  readonly avatar: string | null

  private constructor(props: MeetupAttendeeProps) {
    this.userId = props.userId
    this.name = props.name
    this.username = props.username
    this.avatar = props.avatar
  }

  static fromPrimitives(primitives: Primitives<MeetupAttendee>): MeetupAttendee {
    return new MeetupAttendee({
      userId: primitives.userId,
      name: primitives.name,
      username: primitives.username,
      avatar: primitives.avatar,
    })
  }

  toPrimitives(): Primitives<MeetupAttendee> {
    return {
      userId: this.userId,
      name: this.name,
      username: this.username,
      avatar: this.avatar,
    }
  }
}
