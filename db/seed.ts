import { Event, Meetup, Province, db } from 'astro:db'
import { provinces } from './content-migration/data/provinces'
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

  await db.delete(Meetup).run()
  for (const meetup of meetups) {
    await db.insert(Meetup).values(meetup as any)
  }

  await db.delete(Province).run()
  for (const province of provinces) {
    await db.insert(Province).values(province as any)
  }
}
