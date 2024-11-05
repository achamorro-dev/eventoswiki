import type { UserId } from 'lucia'

export interface User {
  id: UserId
  name: string
  username: string
  email: string | null
  avatar: string
}
