export interface SessionCookieAttributes {
  path?: string
  secure?: boolean
  httpOnly?: boolean
  maxAge?: number
  sameSite?: 'strict' | 'lax' | 'none'
}
