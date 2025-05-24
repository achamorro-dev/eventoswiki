import { Validator } from '@/shared/domain/validators/validator'
import type { EventData } from '../event'
import { EventImageValidator } from './event-image.validator'
import { EventLinkValidator } from './event-link.validator'
import { EventLocationValidator } from './event-location.validator'
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
      (socialValidators.length > 0 ? 'Al menos un enlace de redes sociales es erróneo' : null)
    )
  }
}
