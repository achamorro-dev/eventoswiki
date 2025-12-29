import { ContainerBuilder } from 'diod'
import { SendEmailCommand } from '@/emails/application/send-email.command'
import { EmailsContainer } from '@/emails/di/emails.container'
import { UserIsOrganizerEnsurer } from '@/organizations/application/user-is-organizer-ensurer.service'
import { OrganizationsContainer } from '@/organizations/di/organizations.container'
import { AttendMeetupCommand } from '../application/attend-meetup.command'
import { CreateMeetupCommand } from '../application/create-meetup.command'
import { DeleteMeetupCommand } from '../application/delete-meetup.command'
import { ExportAttendeesCommand } from '../application/export-attendees.command'
import { FindMeetupQuery } from '../application/find-meetup.query'
import { FindMeetupAttendeesQuery } from '../application/find-meetup-attendees.query'
import { FindMeetupBySlugQuery } from '../application/find-meetup-by-slug.query'
import { FindMeetupsQuery } from '../application/find-meetups.query'
import { GetMeetupsQuery } from '../application/get-meetups.query'
import { GetNextMeetupsQuery } from '../application/get-next-meetups.query'
import { GetPastMeetupsQuery } from '../application/get-past-meetups.query'
import { UnattendMeetupCommand } from '../application/unattend-meetup.command'
import { UpdateMeetupCommand } from '../application/update-meetup.command'
import { AstroDbMeetupsRepository } from '../infrastructure/astro-db-meetups.repository'

const builder = new ContainerBuilder()

builder.register(AstroDbMeetupsRepository).use(AstroDbMeetupsRepository)

builder.register(GetNextMeetupsQuery).use(GetNextMeetupsQuery).withDependencies([AstroDbMeetupsRepository])

builder.register(GetPastMeetupsQuery).use(GetPastMeetupsQuery).withDependencies([AstroDbMeetupsRepository])

builder.register(FindMeetupBySlugQuery).use(FindMeetupBySlugQuery).withDependencies([AstroDbMeetupsRepository])

builder.register(FindMeetupQuery).use(FindMeetupQuery).withDependencies([AstroDbMeetupsRepository])

builder.register(GetMeetupsQuery).use(GetMeetupsQuery).withDependencies([AstroDbMeetupsRepository])

builder.register(FindMeetupsQuery).use(FindMeetupsQuery).withDependencies([AstroDbMeetupsRepository])

builder.register(FindMeetupAttendeesQuery).use(FindMeetupAttendeesQuery).withDependencies([AstroDbMeetupsRepository])

// biome-ignore lint/correctness/useHookAtTopLevel: It's not a hook
builder.register(UserIsOrganizerEnsurer).useFactory(_ => OrganizationsContainer.get(UserIsOrganizerEnsurer))

builder
  .register(UpdateMeetupCommand)
  .use(UpdateMeetupCommand)
  .withDependencies([AstroDbMeetupsRepository, UserIsOrganizerEnsurer])

builder
  .register(CreateMeetupCommand)
  .use(CreateMeetupCommand)
  .withDependencies([AstroDbMeetupsRepository, UserIsOrganizerEnsurer])

builder
  .register(DeleteMeetupCommand)
  .use(DeleteMeetupCommand)
  .withDependencies([AstroDbMeetupsRepository, UserIsOrganizerEnsurer])

builder
  .register(AttendMeetupCommand)
  .use(AttendMeetupCommand)
  .withDependencies([AstroDbMeetupsRepository, () => EmailsContainer.get(SendEmailCommand)])

builder.register(UnattendMeetupCommand).use(UnattendMeetupCommand).withDependencies([AstroDbMeetupsRepository])

builder
  .register(ExportAttendeesCommand)
  .use(ExportAttendeesCommand)
  .withDependencies([AstroDbMeetupsRepository, UserIsOrganizerEnsurer])

export const MeetupsContainer = builder.build({ autowire: false })
