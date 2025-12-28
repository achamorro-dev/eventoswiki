import { ContainerBuilder } from 'diod'
import { GetUserQuery } from '../application/get-user.query'
import { GetUserByUsernameQuery } from '../application/get-user-by-username.query'
import { SaveUserCommand } from '../application/save-user.command'
import { AstroDbUsersRepository } from '../infrastructure/astro-db-users.repository'

const builder = new ContainerBuilder()

builder.register(AstroDbUsersRepository).use(AstroDbUsersRepository)

builder.register(GetUserQuery).use(GetUserQuery).withDependencies([AstroDbUsersRepository])

builder.register(GetUserByUsernameQuery).use(GetUserByUsernameQuery).withDependencies([AstroDbUsersRepository])

builder
  .register(SaveUserCommand)
  .use(SaveUserCommand)
  .withDependencies([AstroDbUsersRepository, GetUserByUsernameQuery])

export const UsersContainer = builder.build({ autowire: false })
