import { ContainerBuilder } from 'diod'
import { SendMeetupAttendanceConfirmationEmailCommand } from '@/emails/application/send-meetup-attendance-confirmation-email.command'
import { SendOrganizationMeetupCreatedEmailToFollowersCommand } from '@/emails/application/send-organization-meetup-created-email-to-followers.command'
import { SendOrganizationMeetupUpdatedEmailCommand } from '@/emails/application/send-organization-meetup-updated-email.command'
import { EmailsContainer } from '@/emails/di/emails.container'
import { GetOrganizationByIdQuery } from '@/organizations/application/get-organization-by-id.query'
import { UserIsOrganizerEnsurer } from '@/organizations/application/user-is-organizer-ensurer.service'
import { OrganizationsContainer } from '@/organizations/di/organizations.container'
import { GetProvincesQuery } from '@/provinces/application/get-provinces.query'
import { ProvincesContainer } from '@/provinces/di/provinces.container'
import { AttendMeetupCommand } from '../application/attend-meetup.command'
import { CreateMeetupCommand } from '../application/create-meetup.command'
import { DeleteMeetupCommand } from '../application/delete-meetup.command'
import { ExportAttendeesCommand } from '../application/export-attendees.command'
import { FindMeetupQuery } from '../application/find-meetup.query'
import { FindMeetupAttendeesQuery } from '../application/find-meetup-attendees.query'
import { FindMeetupBySlugQuery } from '../application/find-meetup-by-slug.query'
import { FindMeetupsQuery } from '../application/find-meetups.query'
import { GetExternalMeetupsQuery } from '../application/get-external-meetups.query'
import { GetMeetupsQuery } from '../application/get-meetups.query'
import { GetMeetupsAttendedByUserQuery } from '../application/get-meetups-attended-by-user/get-meetups-attended-by-user.query'
import { GetNextMeetupsQuery } from '../application/get-next-meetups.query'
import { GetPastMeetupsQuery } from '../application/get-past-meetups.query'
import { GetPastMeetupsAttendedByUserQuery } from '../application/get-past-meetups-attended-by-user.query'
import { GetUpcomingMeetupsAttendedByUserQuery } from '../application/get-upcoming-meetups-attended-by-user.query'
import { SyncMeetupsFromMeetupCommand } from '../application/sync-meetups-from-meetup.command'
import { UnattendMeetupCommand } from '../application/unattend-meetup.command'
import { UpdateMeetupCommand } from '../application/update-meetup.command'
import { AstroDbMeetupsRepository } from '../infrastructure/astro-db-meetups.repository'
import { MeetupComEventsProvider } from '../infrastructure/meetup-com/meetup-com-events-provider'

const builder = new ContainerBuilder()

builder.register(AstroDbMeetupsRepository).use(AstroDbMeetupsRepository)

builder.register(GetNextMeetupsQuery).use(GetNextMeetupsQuery).withDependencies([AstroDbMeetupsRepository])

builder.register(GetPastMeetupsQuery).use(GetPastMeetupsQuery).withDependencies([AstroDbMeetupsRepository])

builder.register(FindMeetupBySlugQuery).use(FindMeetupBySlugQuery).withDependencies([AstroDbMeetupsRepository])

builder.register(FindMeetupQuery).use(FindMeetupQuery).withDependencies([AstroDbMeetupsRepository])

builder.register(GetMeetupsQuery).use(GetMeetupsQuery).withDependencies([AstroDbMeetupsRepository])

builder.register(FindMeetupsQuery).use(FindMeetupsQuery).withDependencies([AstroDbMeetupsRepository])

builder.register(FindMeetupAttendeesQuery).use(FindMeetupAttendeesQuery).withDependencies([AstroDbMeetupsRepository])

builder
  .register(GetUpcomingMeetupsAttendedByUserQuery)
  .use(GetUpcomingMeetupsAttendedByUserQuery)
  .withDependencies([AstroDbMeetupsRepository])

builder
  .register(GetPastMeetupsAttendedByUserQuery)
  .use(GetPastMeetupsAttendedByUserQuery)
  .withDependencies([AstroDbMeetupsRepository])

builder
  .register(GetMeetupsAttendedByUserQuery)
  .use(GetMeetupsAttendedByUserQuery)
  .withDependencies([AstroDbMeetupsRepository])

// biome-ignore lint/correctness/useHookAtTopLevel: It's not a hook
builder.register(UserIsOrganizerEnsurer).useFactory(_ => OrganizationsContainer.get(UserIsOrganizerEnsurer))

// biome-ignore lint/correctness/useHookAtTopLevel: It's not a hook
builder.register(GetOrganizationByIdQuery).useFactory(_ => OrganizationsContainer.get(GetOrganizationByIdQuery))

// biome-ignore lint/correctness/useHookAtTopLevel: It's not a hook
builder.register(GetProvincesQuery).useFactory(_ => ProvincesContainer.get(GetProvincesQuery))

builder.register(MeetupComEventsProvider).use(MeetupComEventsProvider)

builder
  .register(GetExternalMeetupsQuery)
  .use(GetExternalMeetupsQuery)
  .withDependencies([
    AstroDbMeetupsRepository,
    UserIsOrganizerEnsurer,
    GetOrganizationByIdQuery,
    MeetupComEventsProvider,
  ])

builder
  .register(SyncMeetupsFromMeetupCommand)
  .use(SyncMeetupsFromMeetupCommand)
  .withDependencies([
    AstroDbMeetupsRepository,
    UserIsOrganizerEnsurer,
    GetOrganizationByIdQuery,
    MeetupComEventsProvider,
    GetProvincesQuery,
  ])

// biome-ignore lint/correctness/useHookAtTopLevel: It's not a hook
builder
  .register(SendMeetupAttendanceConfirmationEmailCommand)
  .useFactory(_ => EmailsContainer.get(SendMeetupAttendanceConfirmationEmailCommand))

// biome-ignore lint/correctness/useHookAtTopLevel: It's not a hook
builder
  .register(SendOrganizationMeetupCreatedEmailToFollowersCommand)
  .useFactory(_ => EmailsContainer.get(SendOrganizationMeetupCreatedEmailToFollowersCommand))

// biome-ignore lint/correctness/useHookAtTopLevel: It's not a hook
builder
  .register(SendOrganizationMeetupUpdatedEmailCommand)
  .useFactory(_ => EmailsContainer.get(SendOrganizationMeetupUpdatedEmailCommand))

builder
  .register(UpdateMeetupCommand)
  .use(UpdateMeetupCommand)
  .withDependencies([AstroDbMeetupsRepository, UserIsOrganizerEnsurer, SendOrganizationMeetupUpdatedEmailCommand])

builder
  .register(CreateMeetupCommand)
  .use(CreateMeetupCommand)
  .withDependencies([
    AstroDbMeetupsRepository,
    UserIsOrganizerEnsurer,
    SendOrganizationMeetupCreatedEmailToFollowersCommand,
  ])

builder
  .register(DeleteMeetupCommand)
  .use(DeleteMeetupCommand)
  .withDependencies([AstroDbMeetupsRepository, UserIsOrganizerEnsurer])

builder
  .register(AttendMeetupCommand)
  .use(AttendMeetupCommand)
  .withDependencies([AstroDbMeetupsRepository, SendMeetupAttendanceConfirmationEmailCommand])

builder.register(UnattendMeetupCommand).use(UnattendMeetupCommand).withDependencies([AstroDbMeetupsRepository])

builder
  .register(ExportAttendeesCommand)
  .use(ExportAttendeesCommand)
  .withDependencies([AstroDbMeetupsRepository, UserIsOrganizerEnsurer])

export const MeetupsContainer = builder.build({ autowire: false })
