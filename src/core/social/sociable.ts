import type { SocialNetwork } from './social-network'

export type Sociable = Partial<{ [key in SocialNetwork]: string }>
