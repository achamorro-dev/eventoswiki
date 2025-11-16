import { Place } from '@/modules/places/domain/place'
import type { Primitives } from '@/shared/domain/primitives/primitives'
import { ValueObject } from '@/shared/domain/value-object'

export class MeetupPlace extends ValueObject<Place> {
  constructor(value: Place) {
    super(value)
  }

  static fromPrimitives(primitives: Primitives<Place>): MeetupPlace {
    return new MeetupPlace(
      Place.fromPrimitives({
        id: primitives.id,
        name: primitives.name,
        address: primitives.address,
      }),
    )
  }

  toPrimitives(): Primitives<Place> {
    return this.value.toPrimitives()
  }
}
