export const Urls = {
  HOME: '/',
  EVENTS: (page: number) => `/eventos/${page}`,
  PAST_EVENTS: (page: number) => `/eventos/pasados/${page}`,
  EVENT: (slug: string) => `/evento/${slug}`,
  MEETUPS: (page: number) => `/meetups/${page}`,
  PAST_MEETUPS: (page: number) => `/meetups/pasados/${page}`,
  CALENDAR: '/calendario',
}
