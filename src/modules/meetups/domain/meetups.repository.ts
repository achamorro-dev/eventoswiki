import type { MatcheableRepository } from '@/modules/shared/domain/repository/matcheable-repository'
import type { FindableByIdRepository } from '@/shared/domain/repository/findable-by-id-repository.ts'
import type { MeetupsCriteria } from './criterias/meetups-criteria'
import { Meetup } from './meetup'

export interface MeetupsRepository
  extends MatcheableRepository<MeetupsCriteria, Meetup>,
    FindableByIdRepository<Meetup['slug'], Meetup> {}
