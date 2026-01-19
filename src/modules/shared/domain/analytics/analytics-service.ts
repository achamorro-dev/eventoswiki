import { AnalyticsEvents } from './analytics-events'

export abstract class AnalyticsService {
  abstract trackEvent(
    name: (typeof AnalyticsEvents)[keyof typeof AnalyticsEvents],
    data?: Record<string, string | number | boolean>,
  ): void
}
