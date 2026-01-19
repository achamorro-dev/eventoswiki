import { db, Event, Meetup, Organization, OrganizationUser, Province, User } from 'astro:db'
import eventsData from './data/events.json'
import meetupsData from './data/meetups.json'
import organizationUsersData from './data/organization-users.json'
import organizationsData from './data/organizations.json'
import provincesData from './data/provinces.json'
import usersData from './data/users.json'

function parseDate(value: string | Date): Date | undefined {
  if (!value) return undefined
  if (value instanceof Date) return value
  return new Date(value)
}

function parsePlace(value: any): string | undefined {
  if (!value) return undefined
  if (typeof value === 'string') return value
  return JSON.stringify(value)
}

export default async function seed() {
  await db.delete(Meetup).run()
  await db.delete(Event).run()
  await db.delete(OrganizationUser).run()
  await db.delete(Organization).run()
  await db.delete(User).run()
  await db.delete(Province).run()

  await Promise.all(provincesData.map(async (province: any) => await db.insert(Province).values(province)))

  await Promise.all(organizationsData.map(async (org: any) => await db.insert(Organization).values(org)))

  await Promise.all(usersData.map(async (user: any) => await db.insert(User).values(user)))

  await Promise.all(
    organizationUsersData.map(async (orgUser: any) => await db.insert(OrganizationUser).values(orgUser)),
  )

  await Promise.all(
    eventsData.map(async (event: any) => {
      try {
        await db.insert(Event).values({
          ...event,
          startsAt: parseDate(event.startsAt),
          endsAt: parseDate(event.endsAt),
          place: parsePlace(event.place),
        })
      } catch (error) {
        console.error(`Error inserting event: ${event.slug}`, error)
      }
    }),
  )

  await Promise.all(
    meetupsData.map(async (meetup: any) => {
      try {
        await db.insert(Meetup).values({
          ...meetup,
          startsAt: parseDate(meetup.startsAt),
          endsAt: parseDate(meetup.endsAt),
          registrationEndsAt: parseDate(meetup.registrationEndsAt),
          place: parsePlace(meetup.place),
        })
      } catch (error) {
        console.error(`Error inserting meetup: ${meetup.slug}`, error)
      }
    }),
  )
}
