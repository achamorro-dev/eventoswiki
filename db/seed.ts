import { Event, Meetup, Province, db } from 'astro:db'
import { provinces } from './content-migration/data/provinces'
import { getEventsFor } from './content-migration/migration-mdx-to-astro-db'

// https://astro.build/db/seed
export default async function seed() {
  const events = await Promise.all([getEventsFor('eventos', '2025'), getEventsFor('eventos', '2026')])

  const meetups = await Promise.all([getEventsFor('meetups', '2025')])

  await db.delete(Province).run()
  await Promise.all(provinces.map(async province => await db.insert(Province).values(province as any)))

  await db.delete(Event).run()
  for (const event of events) {
    try {
      await db.insert(Event).values(event as any)
    } catch (error) {
      console.error(`Error inserting event: ${JSON.stringify(event)}`, error)
    }
  }

  await db.delete(Meetup).run()
  for (const meetup of meetups) {
    try {
      await db.insert(Meetup).values(meetup as any)
    } catch (error) {
      console.error(`Error inserting meetup: ${JSON.stringify(meetup)}`, error)
    }
  }
}
