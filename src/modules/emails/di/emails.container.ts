import { ContainerBuilder } from 'diod'
import { FindMeetupQuery } from '@/meetups/application/find-meetup.query'
import { MeetupsContainer } from '@/meetups/di/meetups.container'
import { GetOrganizationByIdQuery } from '@/organizations/application/get-organization-by-id.query'
import { OrganizationsContainer } from '@/organizations/di/organizations.container'
import { GetUserSettingsQuery } from '@/user-settings/application/get-user-settings.query'
import { UserSettingsContainer } from '@/user-settings/di/user-settings.container'
import { GetUserQuery } from '@/users/application/get-user.query'
import { UsersContainer } from '@/users/di/users.container'
import { SendMeetupAttendanceConfirmationEmailCommand } from '../application/send-meetup-attendance-confirmation-email.command'
import { SendOrganizationMeetupCreatedEmailCommand } from '../application/send-organization-meetup-created-email.command'
import { SendOrganizationMeetupCreatedEmailToFollowersCommand } from '../application/send-organization-meetup-created-email-to-followers.command'
import { ResendEmailsRepository } from '../infrastructure/repositories/resend-emails.repository'

const builder = new ContainerBuilder()

builder.register(ResendEmailsRepository).use(ResendEmailsRepository)

// biome-ignore lint/correctness/useHookAtTopLevel: It's not a hook
builder.register(FindMeetupQuery).useFactory(_ => MeetupsContainer.get(FindMeetupQuery))

// biome-ignore lint/correctness/useHookAtTopLevel: It's not a hook
builder.register(GetUserQuery).useFactory(_ => UsersContainer.get(GetUserQuery))

// biome-ignore lint/correctness/useHookAtTopLevel: It's not a hook
builder.register(GetOrganizationByIdQuery).useFactory(_ => OrganizationsContainer.get(GetOrganizationByIdQuery))

// biome-ignore lint/correctness/useHookAtTopLevel: It's not a hook
builder.register(GetUserSettingsQuery).useFactory(_ => UserSettingsContainer.get(GetUserSettingsQuery))

builder
  .register(SendMeetupAttendanceConfirmationEmailCommand)
  .use(SendMeetupAttendanceConfirmationEmailCommand)
  .withDependencies([
    ResendEmailsRepository,
    FindMeetupQuery,
    GetUserQuery,
    GetOrganizationByIdQuery,
    GetUserSettingsQuery,
  ])

builder
  .register(SendOrganizationMeetupCreatedEmailCommand)
  .use(SendOrganizationMeetupCreatedEmailCommand)
  .withDependencies([
    ResendEmailsRepository,
    FindMeetupQuery,
    GetOrganizationByIdQuery,
    GetUserQuery,
    GetUserSettingsQuery,
  ])

builder
  .register(SendOrganizationMeetupCreatedEmailToFollowersCommand)
  .use(SendOrganizationMeetupCreatedEmailToFollowersCommand)
  .withDependencies([
    SendOrganizationMeetupCreatedEmailCommand,
    FindMeetupQuery,
    GetOrganizationByIdQuery,
    GetUserQuery,
  ])

export const EmailsContainer = builder.build({ autowire: false })
