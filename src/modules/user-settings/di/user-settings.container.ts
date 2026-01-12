import { ContainerBuilder } from 'diod'
import { CreateUserSettingsCommand } from '../application/create-user-settings.command'
import { GetUserSettingsQuery } from '../application/get-user-settings.query'
import { UpdateUserSettingsCommand } from '../application/update-user-settings.command'
import { AstroDbUserSettingsRepository } from '../infrastructure/astro-db-user-settings.repository'

const builder = new ContainerBuilder()

builder.register(AstroDbUserSettingsRepository).use(AstroDbUserSettingsRepository)

builder.register(GetUserSettingsQuery).use(GetUserSettingsQuery).withDependencies([AstroDbUserSettingsRepository])

builder
  .register(CreateUserSettingsCommand)
  .use(CreateUserSettingsCommand)
  .withDependencies([AstroDbUserSettingsRepository])

builder
  .register(UpdateUserSettingsCommand)
  .use(UpdateUserSettingsCommand)
  .withDependencies([AstroDbUserSettingsRepository])

export const UserSettingsContainer = builder.build({ autowire: false })
