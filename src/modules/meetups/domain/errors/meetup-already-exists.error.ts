import { DomainError } from '@/shared/domain/errors/domain-error'

export class MeetupAlreadyExists extends DomainError {
  constructor(slug: string) {
    super('Meetup with slug ' + slug + ' already exists')
  }
}
