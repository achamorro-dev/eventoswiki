export const AnalyticsEvents = {
  authOverlayLogin: 'login:auth-overlay',
} as const

export type AnalyticsEvent = (typeof AnalyticsEvents)[keyof typeof AnalyticsEvents]
