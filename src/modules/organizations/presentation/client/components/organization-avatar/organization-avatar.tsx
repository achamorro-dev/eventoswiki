import { Organization } from '@/organizations/domain/organization'
import type { Primitives } from '@/shared/domain/primitives/primitives'
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar'

interface Props {
  organization: Primitives<Organization>
}
export const OrganizationAvatar = (props: Props) => {
  const organization = Organization.fromPrimitives(props.organization)

  return (
    <Avatar>
      <AvatarImage src={organization.imageUrlString()} />
      <AvatarFallback>{organization.firstNameLetter()}</AvatarFallback>
    </Avatar>
  )
}
