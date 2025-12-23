import { OrganizationsLocator } from '@/organizations/di/organizations.locator'
import { AttendMeetupCommand } from '../application/attend-meetup.command'
import { CreateMeetupCommand } from '../application/create-meetup.command'
import { DeleteMeetupCommand } from '../application/delete-meetup.command'
import { ExportAttendeesCommand } from '../application/export-attendees.command'
import { FindMeetupQuery } from '../application/find-meetup.query'
import { FindMeetupAttendeesQuery } from '../application/find-meetup-attendees.query'
import { FindMeetupBySlugQuery } from '../application/find-meetup-by-slug.query'
import { FindMeetupsQuery } from '../application/find-meetups.query'
import { GetMeetupsQuery } from '../application/get-meetups.query'
import { GetNextMeetupsQuery } from '../application/get-next-meetups.query'
import { GetPastMeetupsQuery } from '../application/get-past-meetups.query'
import { UnattendMeetupCommand } from '../application/unattend-meetup.command'
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

  static findMeetupBySlugQuery = (): FindMeetupBySlugQuery => {
    return new FindMeetupBySlugQuery(MeetupsLocator.createMeetupsRepository())
  }

  static findMeetupQuery = (): FindMeetupQuery => {
    return new FindMeetupQuery(MeetupsLocator.createMeetupsRepository())
  }

  static getMeetupsQuery = (): GetMeetupsQuery => {
    return new GetMeetupsQuery(MeetupsLocator.createMeetupsRepository())
  }

  static findMeetupsQuery = (): FindMeetupsQuery => {
    return new FindMeetupsQuery(MeetupsLocator.createMeetupsRepository())
  }

  static updateMeetupCommand = (): UpdateMeetupCommand => {
    return new UpdateMeetupCommand(
      MeetupsLocator.createMeetupsRepository(),
      OrganizationsLocator.userIsOrganizerEnsurer(),
    )
  }

  static createMeetupCommand = (): CreateMeetupCommand => {
    return new CreateMeetupCommand(
      MeetupsLocator.createMeetupsRepository(),
      OrganizationsLocator.userIsOrganizerEnsurer(),
    )
  }

  static deleteMeetupCommand = (): DeleteMeetupCommand => {
    return new DeleteMeetupCommand(
      MeetupsLocator.createMeetupsRepository(),
      OrganizationsLocator.userIsOrganizerEnsurer(),
    )
  }

  static attendMeetupCommand = (): AttendMeetupCommand => {
    return new AttendMeetupCommand(MeetupsLocator.createMeetupsRepository())
  }

  static unattendMeetupCommand = (): UnattendMeetupCommand => {
    return new UnattendMeetupCommand(MeetupsLocator.createMeetupsRepository())
  }

  static findMeetupAttendeesQuery = (): FindMeetupAttendeesQuery => {
    return new FindMeetupAttendeesQuery(MeetupsLocator.createMeetupsRepository())
  }

  static exportAttendeesCommand = (): ExportAttendeesCommand => {
    return new ExportAttendeesCommand(
      MeetupsLocator.createMeetupsRepository(),
      OrganizationsLocator.userIsOrganizerEnsurer(),
    )
  }

  private static createMeetupsRepository(): MeetupsRepository {
    return new AstroDbMeetupsRepository()
  }
}
