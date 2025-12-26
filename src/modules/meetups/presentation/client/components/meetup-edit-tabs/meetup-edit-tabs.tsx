'use client'

import { useState } from 'react'
import type { Meetup } from '@/meetups/domain/meetup'
import type { Organization } from '@/organizations/domain/organization'
import type { Province } from '@/provinces/domain/province'
import type { Primitives } from '@/shared/domain/primitives/primitives'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs'
import { MeetupAttendeesList } from '../meetup-attendees-list/meetup-attendees-list'
import { MeetupEditForm } from '../meetup-edit-form/meetup-edit-form'

interface Props {
  meetup?: Primitives<Meetup>
  provinces: Array<Province>
  organization: Primitives<Organization>
}

export const MeetupEditTabs = ({ meetup, provinces, organization }: Props) => {
  const [attendeesCount, setAttendeesCount] = useState(meetup?.attendees?.length ?? 0)

  if (!meetup) {
    return <MeetupEditForm organization={organization} provinces={provinces} />
  }

  return (
    <Tabs defaultValue="info" className="w-full">
      <TabsList>
        <TabsTrigger value="info">Información del Meetup</TabsTrigger>
        <TabsTrigger value="attendees">Asistentes ({attendeesCount})</TabsTrigger>
      </TabsList>

      <TabsContent value="info">
        <MeetupEditForm meetup={meetup} organization={organization} provinces={provinces} />
      </TabsContent>

      <TabsContent value="attendees">
        <MeetupAttendeesList meetupId={meetup.id} onAttendeesChange={a => setAttendeesCount(a.length)} />
      </TabsContent>
    </Tabs>
  )
}
