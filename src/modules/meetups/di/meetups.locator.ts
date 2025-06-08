import { CreateMeetupCommand } from '../application/create-meetup.command'
import { FindMeetupsQuery } from '../application/find-meetups.query'
import { GetMeetupQuery } from '../application/get-meetup.query'
import { GetMeetupsQuery } from '../application/get-meetups.query'
import { GetNextMeetupsQuery } from '../application/get-next-meetups.query'
import { GetPastMeetupsQuery } from '../application/get-past-meetups.query'
import { UpdateMeetupCommand } from '../application/update-meetup.command'
import type { MeetupsRepository } from '../domain/meetups.repository'
import { AstroDbMeetupsRepository } from '../infrastructure/astro-db-meetups.repository'

export class MeetupsLocator {
  static getNextMeetupsQuery = (): GetNextMeetupsQuery => {
    return new GetNextMeetupsQuery(MeetupsLocator.createMeetupsRepository())
  }

  static getPastMeetupsQuery = (): GetPastMeetupsQuery => {
    return new GetPastMeetupsQuery(MeetupsLocator.createMeetupsRepository())
  }

  static getMeetupQuery = (): GetMeetupQuery => {
    return new GetMeetupQuery(MeetupsLocator.createMeetupsRepository())
  }
  static getMeetupsQuery = (): GetMeetupsQuery => {
    return new GetMeetupsQuery(MeetupsLocator.createMeetupsRepository())
  }

  static findMeetupsQuery = (): FindMeetupsQuery => {
    return new FindMeetupsQuery(MeetupsLocator.createMeetupsRepository())
  }

  static updateMeetupCommand = (): UpdateMeetupCommand => {
    return new UpdateMeetupCommand(MeetupsLocator.createMeetupsRepository())
  }

  static createMeetupCommand = (): CreateMeetupCommand => {
    return new CreateMeetupCommand(MeetupsLocator.createMeetupsRepository())
  }

  private static createMeetupsRepository(): MeetupsRepository {
    return new AstroDbMeetupsRepository()
  }
}
