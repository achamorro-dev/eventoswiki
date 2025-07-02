import { Datetime } from '@/shared/domain/datetime/datetime'
import { Validator } from '@/shared/domain/validators/validator'
import type { MeetupData } from '../meetup'
import { MeetupContentValidator } from './meetup-content.validator'
import { MeetupEndDateValidator } from './meetup-end-date.validator'
import { MeetupImageValidator } from './meetup-image.validator'
import { MeetupLinkValidator } from './meetup-link.validator'
import { MeetupLocationValidator } from './meetup-location.validator'
import { MeetupShortDescriptionValidator } from './meetup-short-description.validator'
import { MeetupStartDateValidator } from './meetup-start-date.validator'
import { MeetupTitleValidator } from './meetup-title.validator'

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

export class MeetupValidator extends Validator<MeetupData> {
  validate() {
    const nameValidator = new MeetupTitleValidator(this.value.title)
    const shortDescriptionValidator = new MeetupShortDescriptionValidator(this.value.shortDescription)
    const imageValidator = new MeetupImageValidator(this.value.image)
    const locationValidator = new MeetupLocationValidator(this.value.location ?? null)
    const contentValidator = new MeetupContentValidator(this.value.content)
    const startsAtValidator = new MeetupStartDateValidator(Datetime.toDate(this.value.startsAt))
    const endsAtValidator = new MeetupEndDateValidator(Datetime.toDate(this.value.endsAt))

    const socialValidators = socialKeys
      .map(key => {
        const validator = new MeetupLinkValidator(this.value[key] ?? null)
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
      (socialValidators.length > 0 ? 'Al menos un enlace de redes sociales es erróneo' : null)
    )
  }
}
