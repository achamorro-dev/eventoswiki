import { render } from '@react-email/render'
import type { Meetup } from '@/meetups/domain/meetup'
import type { Organization } from '@/organizations/domain/organization'
import { OrganizationMeetupUpdatedEmail } from './organization-meetup-updated-email'

interface OrganizationMeetupUpdatedEmailData {
  userName: string
  meetup: Meetup
  organization: Organization
}

export async function generateOrganizationMeetupUpdatedEmailHtml(
  data: OrganizationMeetupUpdatedEmailData,
): Promise<string> {
  const { userName, meetup, organization } = data
  const meetupUrl = `https://eventos.wiki/meetups/${meetup.slug}`

  return render(
    <OrganizationMeetupUpdatedEmail
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
