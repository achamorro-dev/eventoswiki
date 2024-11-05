import type { SessionAttributes } from './session-attributes'

export interface Session extends SessionAttributes {
  id: string
  userId: string
  expiresAt: Date
}
