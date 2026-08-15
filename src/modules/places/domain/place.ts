import type { Primitives } from '@/shared/domain/primitives/primitives'

export class Place {
  constructor(
    public id: string,
    public name: string,
    public address: string,
    // Opcionales: los sitios guardados antes de pedir `places.location` a Google
    // no tienen coordenadas y solo las reciben si alguien vuelve a guardarlos.
    public latitude?: number,
    public longitude?: number,
  ) {}

  static fromPrimitives(primitives: Primitives<Place>): Place {
    return new Place(primitives.id, primitives.name, primitives.address, primitives.latitude, primitives.longitude)
  }

  toPrimitives(): Primitives<Place> {
    return {
      id: this.id,
      name: this.name,
      address: this.address,
      latitude: this.latitude,
      longitude: this.longitude,
    }
  }

  hasCoordinates(): this is Place & { latitude: number; longitude: number } {
    return this.latitude !== undefined && this.longitude !== undefined
  }
}
