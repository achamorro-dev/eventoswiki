import { render } from '@react-email/render'
import type { Event } from '@/events/domain/event'
import type { Organization } from '@/organizations/domain/organization'
import { OrganizationEventCreatedEmail } from './organization-event-created-email'

interface OrganizationEventCreatedEmailData {
  userName: string
  event: Event
  organization: Organization
}

export async function generateOrganizationEventCreatedEmailHtml(
  data: OrganizationEventCreatedEmailData,
): Promise<string> {
  const { userName, event, organization } = data
  const eventUrl = `https://eventos.wiki/events/${event.slug}`

  return render(
    <OrganizationEventCreatedEmail userName={userName} event={event} organization={organization} eventUrl={eventUrl} />,
    {
      pretty: true,
    },
  )
}
