import type { Primitives } from '@/shared/domain/primitives/primitives'

export class Province {
  constructor(
    public slug: string,
    public name: string,
  ) {}

  static fromPrimitives(primitives: Primitives<Province>): Province {
    return new Province(primitives.slug, primitives.name)
  }

  toPrimitives(): Primitives<Province> {
    return {
      slug: this.slug,
      name: this.name,
    }
  }
}
