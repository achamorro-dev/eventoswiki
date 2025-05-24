import type { Organization } from '@/organizations/domain/organization'
import type { Primitives } from '@/shared/domain/primitives/primitives'
import { EmptyMessage } from '@/ui/components/empty-message/empty-message'
import { Link } from '@/ui/components/link'
import { ChalkboardTeacher, Microphone } from '@/ui/icons'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs'
import { Urls } from '@/ui/urls/urls'

interface Props {
  organization: Primitives<Organization>
}

export const OrganizationTabs = ({ organization }: Props) => {
  return (
    <Tabs defaultValue="events">
      <TabsList>
        <TabsTrigger value="events">Eventos</TabsTrigger>
        <TabsTrigger value="meetups">Meetups</TabsTrigger>
      </TabsList>
      <TabsContent value="events">
        <EmptyMessage
          icon={ChalkboardTeacher}
          title="No hay eventos"
          description="Cuando haya eventos, podrás verlos aquí."
        >
          <Link href={Urls.CREATE_EVENT(organization.handle)} variant="outline" className="mt-4">
            Crear evento
          </Link>
        </EmptyMessage>
      </TabsContent>
      <TabsContent value="meetups">
        <EmptyMessage icon={Microphone} title="No hay meetups" description="Cuando haya meetups, podrás verlos aquí." />
      </TabsContent>
    </Tabs>
  )
}
