import { Organization } from '@/organizations/domain/organization'
import type { Primitives } from '@/shared/domain/primitives/primitives'
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar'

interface Props {
  organization: Primitives<Organization>
  className?: string
}
export const OrganizationAvatar = (props: Props) => {
  const { className, ...rest } = props
  const organization = Organization.fromPrimitives(props.organization)

  return (
    <Avatar className={className} {...rest}>
      <AvatarImage src={organization.imageUrlString()} />
      <AvatarFallback>{organization.firstNameLetter()}</AvatarFallback>
    </Avatar>
  )
}
