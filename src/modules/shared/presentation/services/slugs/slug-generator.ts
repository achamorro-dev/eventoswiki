import slugify from 'slugify'

export class SlugGenerator {
  constructor(private readonly value: string) {}

  generate(): string {
    return slugify(this.value, { lower: true, remove: /[:,#/\\[\]]/g })
  }
}
