import { OrganizationBioValidator } from '@/organizations/domain/validators/organization-bio.validator'
import { OrganizationHandleValidator } from '@/organizations/domain/validators/organization-handle.validator'
import { OrganizationImageValidator } from '@/organizations/domain/validators/organization-image.validator'
import { OrganizationLinkValidator } from '@/organizations/domain/validators/organization-link.validator'
import { OrganizationLocationValidator } from '@/organizations/domain/validators/organization-location.validator'
import { OrganizationNameValidator } from '@/organizations/domain/validators/organization-name.validator'
import { NotRequiredStringFormField } from '@/shared/presentation/forms/not-required-string-form-field'
import { StringFormField } from '@/shared/presentation/forms/string-form-field'
import { z } from 'astro/zod'

export const organizationFormSchema = z.object({
  name: StringFormField(OrganizationNameValidator),
  bio: StringFormField(OrganizationBioValidator),
  handle: StringFormField(OrganizationHandleValidator),
  image: NotRequiredStringFormField(OrganizationImageValidator),
  location: NotRequiredStringFormField(OrganizationLocationValidator),
  web: NotRequiredStringFormField(OrganizationLinkValidator),
  twitter: NotRequiredStringFormField(OrganizationLinkValidator),
  facebook: NotRequiredStringFormField(OrganizationLinkValidator),
  instagram: NotRequiredStringFormField(OrganizationLinkValidator),
  youtube: NotRequiredStringFormField(OrganizationLinkValidator),
  discord: NotRequiredStringFormField(OrganizationLinkValidator),
  telegram: NotRequiredStringFormField(OrganizationLinkValidator),
  whatsapp: NotRequiredStringFormField(OrganizationLinkValidator),
  tiktok: NotRequiredStringFormField(OrganizationLinkValidator),
  twitch: NotRequiredStringFormField(OrganizationLinkValidator),
  github: NotRequiredStringFormField(OrganizationLinkValidator),
  linkedin: NotRequiredStringFormField(OrganizationLinkValidator),
})

export type OrganizationFormSchema = z.infer<typeof organizationFormSchema>
