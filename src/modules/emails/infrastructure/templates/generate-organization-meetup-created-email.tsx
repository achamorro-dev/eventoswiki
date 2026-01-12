import { render } from '@react-email/render'
import type { Meetup } from '@/meetups/domain/meetup'
import type { Organization } from '@/organizations/domain/organization'
import { OrganizationMeetupCreatedEmail } from './organization-meetup-created-email'

interface OrganizationMeetupCreatedEmailData {
  userName: string
  meetup: Meetup
  organization: Organization
}

export async function generateOrganizationMeetupCreatedEmailHtml(
  data: OrganizationMeetupCreatedEmailData,
): Promise<string> {
  const { userName, meetup, organization } = data
  const meetupUrl = `https://eventos.wiki/meetups/${meetup.slug}`

  return render(
    <OrganizationMeetupCreatedEmail
      userName={userName}
      meetup={meetup}
      organization={organization}
      meetupUrl={meetupUrl}
    />,
    {
      pretty: true,
    },
  )
}
