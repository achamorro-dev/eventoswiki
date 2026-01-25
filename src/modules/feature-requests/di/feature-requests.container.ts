import { ContainerBuilder } from 'diod'
import { CreateFeatureRequestCommand } from '../application/create-feature-request.command'
import { ListFeatureRequestsQuery } from '../application/list-feature-requests.query'
import { ToggleFeatureRequestVoteCommand } from '../application/toggle-feature-request-vote.command'
import { AstroDbFeatureRequestsRepository } from '../infrastructure/astro-db-feature-requests.repository'

const builder = new ContainerBuilder()

builder.register(AstroDbFeatureRequestsRepository).use(AstroDbFeatureRequestsRepository)

builder
  .register(CreateFeatureRequestCommand)
  .use(CreateFeatureRequestCommand)
  .withDependencies([AstroDbFeatureRequestsRepository])

builder
  .register(ListFeatureRequestsQuery)
  .use(ListFeatureRequestsQuery)
  .withDependencies([AstroDbFeatureRequestsRepository])

builder
  .register(ToggleFeatureRequestVoteCommand)
  .use(ToggleFeatureRequestVoteCommand)
  .withDependencies([AstroDbFeatureRequestsRepository])

export const FeatureRequestsContainer = builder.build({ autowire: false })
