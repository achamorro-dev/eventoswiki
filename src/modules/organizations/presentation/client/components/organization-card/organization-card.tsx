import { Organization } from '@/organizations/domain/organization'
import type { Primitives } from '@/shared/domain/primitives/primitives'
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar'
import { Card, CardDescription, CardHeader, CardTitle } from '@/ui/card'
import { Urls } from '@/ui/urls/urls'

interface Props {
  organization: Primitives<Organization>
}

export const OrganizationCard = (props: Props) => {
  const organization = Organization.fromPrimitives(props.organization)
  return (
    <a href={Urls.ORGANIZATION(organization.handle)}>
      <Card>
        <CardHeader className="flex flex-col items-center gap-2">
          <Avatar>
            <AvatarImage src={organization.imageUrlString()} />
            <AvatarFallback>{organization.firstNameLetter()}</AvatarFallback>
          </Avatar>
          <CardTitle>{organization.name}</CardTitle>
          <CardDescription>
            {organization.location && `${organization.location} · `}
            {organization.followersCount()} seguidores
          </CardDescription>
        </CardHeader>
      </Card>
    </a>
  )
}
