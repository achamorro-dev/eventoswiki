import { EventContentValidator } from '@/events/domain/validators/event-content.validator'
import { EventEndDateValidator } from '@/events/domain/validators/event-end-date.validator'
import { EventImageValidator } from '@/events/domain/validators/event-image.validator'
import { EventLinkValidator } from '@/events/domain/validators/event-link.validator'
import { EventLocationValidator } from '@/events/domain/validators/event-location.validator'
import { EventPeriodValidator } from '@/events/domain/validators/event-period.validator'
import { EventShortDescriptionValidator } from '@/events/domain/validators/event-short-description.validator'
import { EventSlugValidator } from '@/events/domain/validators/event-slug.validator'
import { EventStartDateValidator } from '@/events/domain/validators/event-start-date.validator'
import { EventTitleValidator } from '@/events/domain/validators/event-title.validator'
import { DateFormField } from '@/shared/presentation/forms/date-form-field'
import { NotRequiredArrayFormField } from '@/shared/presentation/forms/not-required-array-form-field'
import { NotRequiredStringFormField } from '@/shared/presentation/forms/not-required-string-form-field'
import { StringFormField } from '@/shared/presentation/forms/string-form-field'
import { z } from 'astro/zod'

export const eventFormSchema = z
  .object({
    title: StringFormField(EventTitleValidator),
    slug: StringFormField(EventSlugValidator),
    shortDescription: StringFormField(EventShortDescriptionValidator),
    image: StringFormField(EventImageValidator, { requiredError: 'Es obligatorio adjuntar una imagen del evento' }),
    content: StringFormField(EventContentValidator),
    location: NotRequiredStringFormField(EventLocationValidator),
    startsAt: DateFormField(EventStartDateValidator),
    endsAt: DateFormField(EventEndDateValidator),
    web: NotRequiredStringFormField(EventLinkValidator),
    twitter: NotRequiredStringFormField(EventLinkValidator),
    facebook: NotRequiredStringFormField(EventLinkValidator),
    instagram: NotRequiredStringFormField(EventLinkValidator),
    youtube: NotRequiredStringFormField(EventLinkValidator),
    discord: NotRequiredStringFormField(EventLinkValidator),
    telegram: NotRequiredStringFormField(EventLinkValidator),
    whatsapp: NotRequiredStringFormField(EventLinkValidator),
    tiktok: NotRequiredStringFormField(EventLinkValidator),
    twitch: NotRequiredStringFormField(EventLinkValidator),
    github: NotRequiredStringFormField(EventLinkValidator),
    linkedin: NotRequiredStringFormField(EventLinkValidator),
    tags: NotRequiredArrayFormField(z.string()),
    tagColor: NotRequiredStringFormField(),
  })
  .superRefine((data, ctx) => {
    const periodValidator = new EventPeriodValidator({ startsAt: data.startsAt, endsAt: data.endsAt })
    const periodError = periodValidator.validate()
    if (periodError) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: periodError,
        path: ['startsAt'],
      })
    }
  })

export type EventFormSchema = z.infer<typeof eventFormSchema>
