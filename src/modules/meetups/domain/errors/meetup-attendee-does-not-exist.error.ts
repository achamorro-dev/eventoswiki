import { DomainError } from '@/shared/domain/errors/domain-error'

export class MeetupAttendeeDoesNotExist extends DomainError {
  constructor(attendeeId: string) {
    super('Meetup attendee with id ' + attendeeId + ' does not exist')
  }
}
