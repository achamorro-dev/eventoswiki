import { v4 as uuidv4 } from 'uuid'

export class ValueObject<T> {
  constructor(public readonly value: T) {}

  static of<T>(value: T): ValueObject<T> {
    return new ValueObject(value)
  }

  equals(other: ValueObject<T>): boolean {
    return this.value === other.value
  }
}
