import type { Slug } from '@/shared/domain/types/slug'

export const Urls = {
  HOME: '/',
  EVENTS: '/eventos/',
  EVENTS_WITH_PROVINCE: (province: string) => `${Urls.EVENTS}?province=${province}`,
  MEETUPS: '/meetups/',
  MEETUPS_WITH_PROVINCE: (province: string) => `${Urls.MEETUPS}?province=${province}`,
  EVENT: (slug: Slug) => `/eventos/${slug}`,
  MEETUP: (slug: Slug) => `/meetups/${slug}`,
  PAST_EVENTS: '/eventos/pasados/',
  PAST_EVENTS_WITH_PROVINCE: (province: string) => `${Urls.PAST_EVENTS}?province=${province}`,
  PAST_MEETUPS: '/meetups/pasados/',
  PAST_MEETUPS_WITH_PROVINCE: (province: string) => `${Urls.PAST_MEETUPS}?province=${province}`,
  PROVINCE: (slug: Slug) => `/${slug}`,
  CALENDAR: '/calendario',
  LOGIN: '/login',
  LOGIN_GITHUB: '/login/github',
  LOGIN_GOOGLE: '/login/google',
  LOGIN_TWITTER: '/login/twitter',
  LOGOUT: '/logout',
  PRIVACY: '/privacidad',
  TERMS: '/terminos',
}
