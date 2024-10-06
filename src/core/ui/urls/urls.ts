import type { Slug } from '@/shared/domain/types/slug'

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
  EVENT: (slug: Slug) => `/eventos/${slug}`,
  MEETUP: (slug: Slug) => `/meetups/${slug}`,
  PAST_EVENTS: '/eventos/pasados/',
  PAST_MEETUPS: '/meetups/pasados/',
  PROVINCE: (slug: Slug) => `/${slug}`,
}
