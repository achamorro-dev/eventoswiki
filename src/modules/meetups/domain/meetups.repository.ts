import type { MatcheableRepository } from '@/modules/shared/domain/repository/matcheable-repository'
import type { FindableAllRepository } from '@/shared/domain/repository/findable-all-repository'
import type { FindableByIdRepository } from '@/shared/domain/repository/findable-by-id-repository.ts'
import type { MeetupsCriteria } from './criterias/meetups-criteria'
import { Meetup } from './meetup'

export interface MeetupsRepository
  extends MatcheableRepository<MeetupsCriteria, Meetup>,
    FindableAllRepository<Meetup>,
    FindableByIdRepository<Meetup['slug'], Meetup> {}
