import { ContainerBuilder } from 'diod'
import { AstroDbMeetupsRepository } from '@/meetups/infrastructure/astro-db-meetups.repository'
import { AstroDbOrganizationsRepository } from '@/organizations/infrastructure/astro-db-organizations.repository'
import { AstroDbUsersRepository } from '@/users/infrastructure/astro-db-users.repository'
import { SendEmailCommand } from '../application/send-email.command'
import { ResendEmailsRepository } from '../infrastructure/repositories/resend-emails.repository'

const builder = new ContainerBuilder()

builder.register(ResendEmailsRepository).use(ResendEmailsRepository)

builder
  .register(SendEmailCommand)
  .use(SendEmailCommand)
  .withDependencies([
    ResendEmailsRepository,
    AstroDbMeetupsRepository,
    AstroDbUsersRepository,
    AstroDbOrganizationsRepository,
  ])

export const EmailsContainer = builder.build({ autowire: false })
