export class Cookie {
  value: string

  constructor(value: string) {
    this.value = value
  }

  json() {
    return JSON.stringify(this)
  }

  number() {
    return Number(this.value)
  }

  boolean() {
    return Boolean(this.value)
  }
}
