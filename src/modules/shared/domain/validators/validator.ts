import type { Validable } from './validable'

export abstract class Validator<T> implements Validable {
  constructor(protected readonly value: T) {}

  abstract validate(): string | null
}

export interface ValidatorConstructor<T> {
  new (value: T): Validator<T>
}
