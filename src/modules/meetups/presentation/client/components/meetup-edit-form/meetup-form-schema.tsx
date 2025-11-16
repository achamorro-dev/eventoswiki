import { z } from 'astro/zod'
import { MeetupContentValidator } from '@/meetups/domain/validators/meetup-content.validator'
import { MeetupEndDateValidator } from '@/meetups/domain/validators/meetup-end-date.validator'
import { MeetupImageValidator } from '@/meetups/domain/validators/meetup-image.validator'
import { MeetupLinkValidator } from '@/meetups/domain/validators/meetup-link.validator'
import { MeetupLocationValidator } from '@/meetups/domain/validators/meetup-location.validator'
import { MeetupPeriodValidator } from '@/meetups/domain/validators/meetup-period.validator'
import { MeetupShortDescriptionValidator } from '@/meetups/domain/validators/meetup-short-description.validator'
import { MeetupSlugValidator } from '@/meetups/domain/validators/meetup-slug.validator'
import { MeetupStartDateValidator } from '@/meetups/domain/validators/meetup-start-date.validator'
import { MeetupTitleValidator } from '@/meetups/domain/validators/meetup-title.validator'
import { MeetupTypeValidator } from '@/meetups/domain/validators/meetup-type.validator'
import { DateFormField } from '@/shared/presentation/forms/date-form-field'
import { NotRequiredArrayFormField } from '@/shared/presentation/forms/not-required-array-form-field'
import { NotRequiredStringFormField } from '@/shared/presentation/forms/not-required-string-form-field'
import { StringFormField } from '@/shared/presentation/forms/string-form-field'

export const meetupFormSchema = z
  .object({
    title: StringFormField(MeetupTitleValidator),
    slug: StringFormField(MeetupSlugValidator),
    shortDescription: StringFormField(MeetupShortDescriptionValidator),
    image: StringFormField(MeetupImageValidator, { requiredError: 'Es obligatorio adjuntar una imagen al meetup' }),
    content: StringFormField(MeetupContentValidator),
    type: StringFormField(MeetupTypeValidator, {
      requiredError: 'Es obligatorio seleccionar un tipo de meetup',
    }),
    location: NotRequiredStringFormField(MeetupLocationValidator),
    startsAt: DateFormField(MeetupStartDateValidator),
    endsAt: DateFormField(MeetupEndDateValidator),
    web: NotRequiredStringFormField(MeetupLinkValidator),
    twitter: NotRequiredStringFormField(MeetupLinkValidator),
    facebook: NotRequiredStringFormField(MeetupLinkValidator),
    instagram: NotRequiredStringFormField(MeetupLinkValidator),
    youtube: NotRequiredStringFormField(MeetupLinkValidator),
    discord: NotRequiredStringFormField(MeetupLinkValidator),
    telegram: NotRequiredStringFormField(MeetupLinkValidator),
    whatsapp: NotRequiredStringFormField(MeetupLinkValidator),
    tiktok: NotRequiredStringFormField(MeetupLinkValidator),
    twitch: NotRequiredStringFormField(MeetupLinkValidator),
    github: NotRequiredStringFormField(MeetupLinkValidator),
    linkedin: NotRequiredStringFormField(MeetupLinkValidator),
    streamingUrl: NotRequiredStringFormField(MeetupLinkValidator),
    place: z
      .object({
        id: StringFormField(),
        address: StringFormField(),
        name: StringFormField(),
      })
      .optional(),
    tags: NotRequiredArrayFormField(z.string()),
    tagColor: NotRequiredStringFormField(),
  })
  .superRefine((data, ctx) => {
    const periodValidator = new MeetupPeriodValidator({ startsAt: data.startsAt, endsAt: data.endsAt })
    const periodError = periodValidator.validate()
    if (periodError) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: periodError,
        path: ['startsAt'],
      })
    }
  })

export type MeetupFormSchema = z.infer<typeof meetupFormSchema>
