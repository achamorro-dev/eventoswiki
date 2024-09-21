import { db, Event } from 'astro:db'
import { getEventsFor } from './content-migration/migration-mdx-to-astro-db'

// https://astro.build/db/seed
export default async function seed() {
  const eventsByYear = await Promise.all([
    getEventsFor('eventos', '2023'),
    getEventsFor('eventos', '2024'),
    getEventsFor('eventos', '2025'),
  ])

  const meetups = await Promise.all([getEventsFor('meetups', '2024')])
  await db.delete(Event).run()

  for (const events of eventsByYear) {
    await db.insert(Event).values(events as any)
  }

  for (const events of meetups) {
    await db.insert(Event).values(events as any)
  }
}
