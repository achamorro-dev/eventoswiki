import { Query } from '@/modules/shared/application/use-case/query'
import { Meetup } from '../domain/meetup'
import type { MeetupsRepository } from '../domain/meetups.repository'

export class GetMeetupsQuery extends Query<Array<Meetup>> {
  constructor(private readonly meetupsRepository: MeetupsRepository) {
    super()
  }

  execute(): Promise<Array<Meetup>> {
    return this.meetupsRepository.findAll()
  }
}
