import { ContainerBuilder } from 'diod'
import { CreateFeatureRequestCommand } from '../application/create-feature-request.command'
import { DeleteFeatureRequestCommand } from '../application/delete-feature-request.command'
import { GetFeatureRequestQuery } from '../application/get-feature-request.query'
import { ListFeatureRequestsQuery } from '../application/list-feature-requests.query'
import { ToggleFeatureRequestVoteCommand } from '../application/toggle-feature-request-vote.command'
import { UpdateFeatureRequestStatusCommand } from '../application/update-feature-request-status.command'
import { AstroDbFeatureRequestsRepository } from '../infrastructure/astro-db-feature-requests.repository'

const builder = new ContainerBuilder()

builder.register(AstroDbFeatureRequestsRepository).use(AstroDbFeatureRequestsRepository)

builder
  .register(CreateFeatureRequestCommand)
  .use(CreateFeatureRequestCommand)
  .withDependencies([AstroDbFeatureRequestsRepository])

builder
  .register(DeleteFeatureRequestCommand)
  .use(DeleteFeatureRequestCommand)
  .withDependencies([AstroDbFeatureRequestsRepository])

builder
  .register(ListFeatureRequestsQuery)
  .use(ListFeatureRequestsQuery)
  .withDependencies([AstroDbFeatureRequestsRepository])

builder
  .register(GetFeatureRequestQuery)
  .use(GetFeatureRequestQuery)
  .withDependencies([AstroDbFeatureRequestsRepository])

builder
  .register(ToggleFeatureRequestVoteCommand)
  .use(ToggleFeatureRequestVoteCommand)
  .withDependencies([AstroDbFeatureRequestsRepository])

builder
  .register(UpdateFeatureRequestStatusCommand)
  .use(UpdateFeatureRequestStatusCommand)
  .withDependencies([AstroDbFeatureRequestsRepository])

export const FeatureRequestsContainer = builder.build({ autowire: false })
