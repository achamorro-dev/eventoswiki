import type { SessionCookieAttributes } from './session-cookie-attributes'

export class SessionCookie {
  name: string
  value: string
  attributes: SessionCookieAttributes

  constructor(name: string, value: string, attributes: SessionCookieAttributes) {
    this.name = name
    this.value = value
    this.attributes = attributes
  }
}
