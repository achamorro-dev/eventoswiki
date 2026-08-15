import { ActionError, defineAction } from 'astro:actions'
import { z } from 'astro/zod'
import type { Event } from '@/events/domain/event'
import type { Meetup } from '@/meetups/domain/meetup'
import type { Organization } from '@/organizations/domain/organization'
import { GetProvincesQuery } from '@/provinces/application/get-provinces.query'
import { ProvincesContainer } from '@/provinces/di/provinces.container'
import { GlobalSearchQuery } from '@/search/application/global-search.query'
import { SearchContainer } from '@/search/di/search.container'
import type { GlobalSearchResultsDto, SearchItemDto } from '@/search/presentation/types/search-results.dto'
import { DateFormat, Datetime } from '@/shared/domain/datetime/datetime'
import { Urls } from '@/ui/urls/urls'

const MAX_QUERY_LENGTH = 100
const SUBTITLE_SEPARATOR = ' · '

export const searchAction = defineAction({
  accept: 'json',
  input: z.object({
    query: z.string().max(MAX_QUERY_LENGTH).default(''),
  }),
  handler: async ({ query }): Promise<GlobalSearchResultsDto> => {
    try {
      const [results, provinceNamesBySlug] = await Promise.all([
        SearchContainer.get(GlobalSearchQuery).execute({ query }),
        buildProvinceNamesBySlug(),
      ])

      return {
        events: {
          upcoming: results.events.upcoming.map(event => toEventItem(event, provinceNamesBySlug)),
          past: results.events.past.map(event => toEventItem(event, provinceNamesBySlug)),
        },
        meetups: {
          upcoming: results.meetups.upcoming.map(meetup => toMeetupItem(meetup, provinceNamesBySlug)),
          past: results.meetups.past.map(meetup => toMeetupItem(meetup, provinceNamesBySlug)),
        },
        organizations: results.organizations.map(organization => toOrganizationItem(organization, provinceNamesBySlug)),
        provinces: results.provinces.map(toProvinceItem),
      }
    } catch (error) {
      if (error instanceof ActionError) {
        throw error
      }

      throw new ActionError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error instanceof Error ? error.message : 'Error al realizar la búsqueda',
      })
    }
  },
})

const buildProvinceNamesBySlug = async (): Promise<Map<string, string>> => {
  const provinces = await ProvincesContainer.get(GetProvincesQuery).execute()
  return new Map(provinces.map(province => [province.slug, province.name]))
}

const toEventItem = (event: Event, provinceNamesBySlug: Map<string, string>): SearchItemDto => ({
  id: event.id.value,
  title: event.title,
  url: Urls.EVENT(event.slug),
  subtitle: buildDatePeriodSubtitle(event.startsAt, event.endsAt, event.location, provinceNamesBySlug),
})

const toMeetupItem = (meetup: Meetup, provinceNamesBySlug: Map<string, string>): SearchItemDto => ({
  id: meetup.id.value,
  title: meetup.title,
  url: Urls.MEETUP(meetup.slug),
  subtitle: buildDatePeriodSubtitle(meetup.startsAt, meetup.endsAt, meetup.location, provinceNamesBySlug),
})

const toOrganizationItem = (organization: Organization, provinceNamesBySlug: Map<string, string>): SearchItemDto => ({
  id: organization.id.value,
  title: organization.name,
  url: Urls.ORGANIZATION(organization.handle),
  subtitle: organization.location ? (provinceNamesBySlug.get(organization.location) ?? null) : null,
})

const toProvinceItem = (province: { slug: string; name: string }): SearchItemDto => ({
  id: province.slug,
  title: province.name,
  url: Urls.PROVINCE(province.slug),
  subtitle: null,
})

const buildDatePeriodSubtitle = (
  startsAt: Date,
  endsAt: Date,
  location: string | null,
  provinceNamesBySlug: Map<string, string>,
): string | null => {
  const formattedStartDate = Datetime.toDateString(startsAt, DateFormat.DD_MMM_YYYY)
  const shouldShowEndDate = !Datetime.isSameDay(startsAt, endsAt)
  const formattedDate = shouldShowEndDate
    ? `${formattedStartDate}${SUBTITLE_SEPARATOR}${Datetime.toDateString(endsAt, DateFormat.DD_MMM_YYYY)}`
    : formattedStartDate

  const provinceName = location ? provinceNamesBySlug.get(location) : undefined
  if (!provinceName) return formattedDate

  return `${formattedDate}${SUBTITLE_SEPARATOR}${provinceName}`
}
