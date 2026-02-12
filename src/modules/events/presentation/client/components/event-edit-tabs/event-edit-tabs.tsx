'use client'

import { useState } from 'react'
import type { EventPrimitives } from '@/events/domain/event'
import type { Organization } from '@/organizations/domain/organization'
import type { Province } from '@/provinces/domain/province'
import type { Primitives } from '@/shared/domain/primitives/primitives'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs'
import { EventEditForm } from '../event-edit-form/event-edit-form'

interface Props {
  event?: EventPrimitives
  provinces: Array<Province>
  organization: Primitives<Organization>
}

type TabValue = 'info' | 'sponsors' | 'speakers' | 'agenda'
export const EventEditTabs = ({ event, provinces, organization }: Props) => {
  const [activeTab, setActiveTab] = useState<TabValue>('info')

  if (!event) {
    return <EventEditForm provinces={provinces} organizationId={organization.id} />
  }

  return (
    <Tabs value={activeTab} onValueChange={value => setActiveTab(value as TabValue)} className="w-full">
      <TabsList>
        <TabsTrigger value="info">Información del evento</TabsTrigger>
        <TabsTrigger value="sponsors">Call for Sponsors</TabsTrigger>
        <TabsTrigger value="speakers">Call for Speakers</TabsTrigger>
        <TabsTrigger value="agenda">Agenda</TabsTrigger>
      </TabsList>

      <TabsContent value="info">
        <EventEditForm
          event={event}
          provinces={provinces}
          organizationId={organization.id}
          organization={organization}
          tab="info"
        />
      </TabsContent>

      <TabsContent value="sponsors">
        <EventEditForm
          event={event}
          provinces={provinces}
          organizationId={organization.id}
          organization={organization}
          tab="sponsors"
        />
      </TabsContent>

      <TabsContent value="speakers">
        <EventEditForm
          event={event}
          provinces={provinces}
          organizationId={organization.id}
          organization={organization}
          tab="speakers"
        />
      </TabsContent>

      <TabsContent value="agenda">
        <EventEditForm
          event={event}
          provinces={provinces}
          organizationId={organization.id}
          organization={organization}
          tab="agenda"
        />
      </TabsContent>
    </Tabs>
  )
}
