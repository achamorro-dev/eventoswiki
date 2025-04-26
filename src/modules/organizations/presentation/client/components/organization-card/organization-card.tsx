import { Organization } from '@/organizations/domain/organization'
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar'
import { Card, CardHeader, CardTitle } from '@/ui/card'
import { Urls } from '@/ui/urls/urls'

interface Props {
  organization: Organization
}

export const OrganizationCard = ({ organization }: Props) => {
  return (
    <a href={Urls.ORGANIZATION(organization.handle)}>
      <Card>
        <CardHeader className="flex flex-col items-center gap-2">
          <Avatar>
            <AvatarImage src={organization.imageUrlString()} />
            <AvatarFallback>{organization.firstNameLetter}</AvatarFallback>
          </Avatar>
          <CardTitle>{organization.name}</CardTitle>
        </CardHeader>
      </Card>
    </a>
  )
}
