import { EventContentValidator } from '@/events/domain/validators/event-content.validator'
import { EventEndDateValidator } from '@/events/domain/validators/event-end-date.validator'
import { EventStartDateValidator } from '@/events/domain/validators/event-start-date.validator'
import { Datetime } from '@/shared/domain/datetime/datetime'
import { Validator } from '@/shared/domain/validators/validator'
import type { EventData } from '../event'
import { EventImageValidator } from './event-image.validator'
import { EventLinkValidator } from './event-link.validator'
import { EventLocationValidator } from './event-location.validator'
import { EventPeriodValidator } from './event-period.validator'
import { EventShortDescriptionValidator } from './event-short-description.validator'
import { EventTitleValidator } from './event-title.validator'

const socialKeys = [
  'twitter',
  'facebook',
  'instagram',
  'youtube',
  'twitch',
  'linkedin',
  'github',
  'telegram',
  'whatsapp',
  'discord',
  'tiktok',
] as const

export class EventValidator extends Validator<EventData> {
  validate() {
    const nameValidator = new EventTitleValidator(this.value.title)
    const shortDescriptionValidator = new EventShortDescriptionValidator(this.value.shortDescription)
    const imageValidator = new EventImageValidator(this.value.image)
    const locationValidator = new EventLocationValidator(this.value.location ?? null)
    const contentValidator = new EventContentValidator(this.value.content)
    const startsAtValidator = new EventStartDateValidator(Datetime.toDate(this.value.startsAt))
    const endsAtValidator = new EventEndDateValidator(Datetime.toDate(this.value.endsAt))
    const periodValidator = new EventPeriodValidator({
      startsAt: Datetime.toDate(this.value.startsAt),
      endsAt: Datetime.toDate(this.value.endsAt),
    })

    const socialValidators = socialKeys
      .map(key => {
        const validator = new EventLinkValidator(this.value[key] ?? null)
        return validator.validate()
      })
      .filter(Boolean)

    return (
      nameValidator.validate() ||
      shortDescriptionValidator.validate() ||
      locationValidator.validate() ||
      imageValidator.validate() ||
      contentValidator.validate() ||
      startsAtValidator.validate() ||
      endsAtValidator.validate() ||
      periodValidator.validate() ||
      (socialValidators.length > 0 ? 'Al menos un enlace de redes sociales es erróneo' : null)
    )
  }
}
