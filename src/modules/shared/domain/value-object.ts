export class ValueObject<T> {
  constructor(public readonly value: T) {}

  static of<T>(value: T): ValueObject<T> {
    return new ValueObject(value)
  }

  equals(other: ValueObject<T>): boolean {
    return this.value === other.value
  }
}
