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
  EVENTS_WITH_PROVINCE: (province: string) => `${NewUrls.EVENTS}?province=${province}`,
  MEETUPS: '/meetups/',
  MEETUPS_WITH_PROVINCE: (province: string) => `${NewUrls.MEETUPS}?province=${province}`,
  EVENT: (slug: Slug) => `/eventos/${slug}`,
  MEETUP: (slug: Slug) => `/meetups/${slug}`,
  PAST_EVENTS: '/eventos/pasados/',
  PAST_EVENTS_WITH_PROVINCE: (province: string) => `${NewUrls.PAST_EVENTS}?province=${province}`,
  PAST_MEETUPS: '/meetups/pasados/',
  PAST_MEETUPS_WITH_PROVINCE: (province: string) => `${NewUrls.PAST_MEETUPS}?province=${province}`,
  PROVINCE: (slug: Slug) => `/${slug}`,
}
