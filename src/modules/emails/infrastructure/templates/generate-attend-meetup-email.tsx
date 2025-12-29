import { render } from '@react-email/render'
import type { Meetup } from '@/meetups/domain/meetup'
import type { Organization } from '@/organizations/domain/organization'
import { AttendMeetupEmail } from './attend-meetup-email'

interface AttendMeetupEmailData {
  userName: string
  meetup: Meetup
  organization?: Organization
}

export async function generateAttendMeetupEmailHtml(data: AttendMeetupEmailData): Promise<string> {
  const { userName, meetup, organization } = data
  const meetupUrl = `https://eventos.wiki/meetups/${meetup.slug}`

  return render(
    <AttendMeetupEmail userName={userName} meetup={meetup} organization={organization} meetupUrl={meetupUrl} />,
    {
      pretty: true,
    },
  )
}
