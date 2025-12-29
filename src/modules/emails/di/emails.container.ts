import { ContainerBuilder } from 'diod'
import { AstroDbMeetupsRepository } from '@/meetups/infrastructure/astro-db-meetups.repository'
import { AstroDbOrganizationsRepository } from '@/organizations/infrastructure/astro-db-organizations.repository'
import { AstroDbUsersRepository } from '@/users/infrastructure/astro-db-users.repository'
import { SendMeetupAttendanceConfirmationEmailCommand } from '../application/send-meetup-attendance-confirmation-email.command'
import { ResendEmailsRepository } from '../infrastructure/repositories/resend-emails.repository'

const builder = new ContainerBuilder()

builder.register(ResendEmailsRepository).use(ResendEmailsRepository)

builder
  .register(SendMeetupAttendanceConfirmationEmailCommand)
  .use(SendMeetupAttendanceConfirmationEmailCommand)
  .withDependencies([
    ResendEmailsRepository,
    AstroDbMeetupsRepository,
    AstroDbUsersRepository,
    AstroDbOrganizationsRepository,
  ])

export const EmailsContainer = builder.build({ autowire: false })
