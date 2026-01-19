import { type AnalyticsEvent } from '@/shared/domain/analytics/analytics-events'
import { AnalyticsService } from '@/shared/domain/analytics/analytics-service'

export class UmamiAnalyticsService extends AnalyticsService {
  trackEvent(name: AnalyticsEvent, data?: Record<string, string | number | boolean>): void {
    if (typeof window === 'undefined') return
    // @ts-expect-error
    const umami = window.umami
    if (!umami) return
    umami.trackEvent(name, data)
  }
}
