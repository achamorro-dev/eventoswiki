export const Urls = {
  HOME: '/',
  EVENTS: (page: number) => `/eventos/${page}`,
  PAST_EVENTS: (page: number) => `/eventos/pasados/${page}`,
  EVENT: (slug: string) => `/evento/${slug}`,
  MEETUPS: (page: number) => `/meetups/${page}`,
  PAST_MEETUPS: (page: number) => `/meetups/pasados/${page}`,
  CALENDAR: '/calendario',
}

export const NewUrls = {
  HOME: '/',
  EVENTS: '/eventos/',
  MEETUPS: '/meetups/',
  EVENT: (slug: string) => `/eventos/v2/${slug}`,
  MEETUP: (slug: string) => `/meetups/v2/${slug}`,
  PAST_EVENTS: '/eventos/pasados/',
  PAST_MEETUPS: '/meetups/pasados/',
}
