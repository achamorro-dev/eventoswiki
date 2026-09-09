import { render } from '@react-email/render'
import { CommunityAnnouncementEmail } from './community-announcement-email'

export async function generateCommunityAnnouncementEmailHtml(): Promise<string> {
  return render(<CommunityAnnouncementEmail />, {
    pretty: true,
  })
}
