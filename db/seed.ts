import { db, Event, Meetup } from 'astro:db'
import { getEventsFor } from './content-migration/migration-mdx-to-astro-db'

// https://astro.build/db/seed
export default async function seed() {
  const events = await Promise.all([
    getEventsFor('eventos', '2023'),
    getEventsFor('eventos', '2024'),
    getEventsFor('eventos', '2025'),
  ])

  const meetups = await Promise.all([getEventsFor('meetups', '2024')])
  await db.delete(Event).run()

  for (const event of events) {
    await db.insert(Event).values(event as any)
  }

  for (const meetup of meetups) {
    await db.insert(Meetup).values(meetup as any)
  }
}
