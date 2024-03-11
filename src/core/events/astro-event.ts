import type { Event } from './event'

export interface AstroEvent {
  frontmatter: Event
  url: string
}

export type FilterEvent = {
  location?: string;
}