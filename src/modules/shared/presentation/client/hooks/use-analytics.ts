import { useCallback } from 'react'
import { type AnalyticsEvent } from '@/shared/domain/analytics/analytics-events'
import { UmamiAnalyticsService } from '@/shared/infrastructure/analytics/umami-analytics.service'

const analyticsService = new UmamiAnalyticsService()

export const useAnalytics = () => {
  const trackEvent = useCallback((name: AnalyticsEvent, data?: Record<string, string | number | boolean>) => {
    analyticsService.trackEvent(name, data)
  }, [])

  return { trackEvent }
}
