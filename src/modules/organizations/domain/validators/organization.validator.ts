import { Validator } from '@/shared/domain/validators/validator'
import type { OrganizationEditableData } from '../organization'
import { OrganizationBioValidator } from './organization-bio.validator'
import { OrganizationHandleValidator } from './organization-handle.validator'
import { OrganizationLinkValidator } from './organization-link.validator'
import { OrganizationLocationValidator } from './organization-location.validator'
import { OrganizationNameValidator } from './organization-name.validator'

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

export class OrganizationValidator extends Validator<OrganizationEditableData> {
  validate() {
    const nameValidator = new OrganizationNameValidator(this.value.name)
    const handleValidator = new OrganizationHandleValidator(this.value.handle)
    const bioValidator = new OrganizationBioValidator(this.value.bio)
    const locationValidator = new OrganizationLocationValidator(this.value.location)

    const socialValidators = socialKeys
      .map(key => {
        const validator = new OrganizationLinkValidator(this.value[key] ?? null)
        return validator.validate()
      })
      .filter(Boolean)

    return (
      nameValidator.validate() ||
      handleValidator.validate() ||
      bioValidator.validate() ||
      locationValidator.validate() ||
      (socialValidators.length > 0 ? 'Al menos un enlace de redes sociales es erroneo' : null)
    )
  }
}
