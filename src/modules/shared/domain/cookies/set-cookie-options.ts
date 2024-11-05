export interface SetCookieOptions {
  path?: string
  secure?: boolean
  httpOnly?: boolean
  maxAge?: number
  sameSite?: 'strict' | 'lax' | 'none'
}
