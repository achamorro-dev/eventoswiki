import { render } from '@react-email/render'
import type { Event } from '@/events/domain/event'
import type { Organization } from '@/organizations/domain/organization'
import { OrganizationEventUpdatedEmail } from './organization-event-updated-email'

interface OrganizationEventUpdatedEmailData {
  userName: string
  event: Event
  organization: Organization
}

export async function generateOrganizationEventUpdatedEmailHtml(
  data: OrganizationEventUpdatedEmailData,
): Promise<string> {
  const { userName, event, organization } = data
  const eventUrl = `https://eventos.wiki/events/${event.slug}`

  return render(
    <OrganizationEventUpdatedEmail userName={userName} event={event} organization={organization} eventUrl={eventUrl} />,
    {
      pretty: true,
    },
  )
}
