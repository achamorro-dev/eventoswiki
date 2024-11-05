import type { Cookie } from './cookie'
import type { SetCookieOptions } from './set-cookie-options'

export interface CookiesManager {
  get(key: string): Cookie | undefined
  set(key: string, value: string | Record<string, any>, options?: SetCookieOptions): void
  delete(key: string): void
  has(key: string): boolean
}
