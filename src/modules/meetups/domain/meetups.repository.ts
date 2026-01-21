import type { MatcheableRepository } from '@/modules/shared/domain/repository/matcheable-repository'
import type { DeletableByIdRepository } from '@/shared/domain/repository/deletable-by-id-repository'
import type { FindableAllRepository } from '@/shared/domain/repository/findable-all-repository'
import type { FindableByIdRepository } from '@/shared/domain/repository/findable-by-id-repository.ts'
import type { SaveableRepository } from '@/shared/domain/repository/saveable-repository'
import type { MeetupsCriteria } from './criterias/meetups-criteria'
import type { MeetupsFilters } from './criterias/meetups-filters'
import type { MeetupsOrder } from './criterias/meetups-order'
import { Meetup } from './meetup'
import type { MeetupAttendee } from './meetup-attendee'
import type { MeetupAttendeeId } from './meetup-attendee-id'
import type { MeetupId } from './meetup-id'

export interface MeetupsRepository
  extends MatcheableRepository<Partial<MeetupsFilters>, Partial<MeetupsOrder>, MeetupsCriteria, Meetup>,
    FindableAllRepository<Meetup>,
    FindableByIdRepository<MeetupId, Meetup>,
    SaveableRepository<Meetup>,
    DeletableByIdRepository<MeetupId> {
  findBySlug(slug: string): Promise<Meetup>
  addAttendees(meetup: Meetup): Promise<void>
  removeAttendee(meetupId: MeetupId, attendeeId: MeetupAttendeeId): Promise<void>
  findAllAttendees(meetupId: string): Promise<MeetupAttendee[]>
  findMeetupsAttendedByUserId(userId: string): Promise<Meetup[]>
}
