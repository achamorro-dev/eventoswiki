import type { Primitives } from '@/shared/domain/primitives/primitives'

export class Place {
  constructor(
    public id: string,
    public name: string,
    public address: string,
  ) {}

  static fromPrimitives(primitives: Primitives<Place>): Place {
    return new Place(primitives.id, primitives.name, primitives.address)
  }

  toPrimitives(): Primitives<Place> {
    return {
      id: this.id,
      name: this.name,
      address: this.address,
    }
  }
}
