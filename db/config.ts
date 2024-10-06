import { NOW, column, defineDb, defineTable } from 'astro:db'

export const Event = defineTable({
  columns: {
    slug: column.text({ primaryKey: true }),
    title: column.text(),
    shortDescription: column.text(),
    startsAt: column.date(),
    endsAt: column.date(),
    thumbnail: column.text(),
    image: column.text(),
    location: column.text(),
    web: column.text(),
    twitter: column.text({ optional: true }),
    linkedin: column.text({ optional: true }),
    youtube: column.text({ optional: true }),
    twitch: column.text({ optional: true }),
    facebook: column.text({ optional: true }),
    instagram: column.text({ optional: true }),
    github: column.text({ optional: true }),
    telegram: column.text({ optional: true }),
    whatsapp: column.text({ optional: true }),
    discord: column.text({ optional: true }),
    tags: column.text(),
    tagColor: column.text(),
    createdAt: column.date({ default: NOW }),
    updatedAt: column.date({ default: NOW }),
    content: column.text(),
  },
})

export const Meetup = defineTable({
  columns: {
    slug: column.text({ primaryKey: true }),
    title: column.text(),
    shortDescription: column.text(),
    startsAt: column.date(),
    endsAt: column.date(),
    thumbnail: column.text(),
    image: column.text(),
    location: column.text(),
    web: column.text(),
    twitter: column.text({ optional: true }),
    linkedin: column.text({ optional: true }),
    youtube: column.text({ optional: true }),
    twitch: column.text({ optional: true }),
    facebook: column.text({ optional: true }),
    instagram: column.text({ optional: true }),
    github: column.text({ optional: true }),
    telegram: column.text({ optional: true }),
    whatsapp: column.text({ optional: true }),
    discord: column.text({ optional: true }),
    tags: column.text(),
    tagColor: column.text(),
    createdAt: column.date({ default: NOW }),
    updatedAt: column.date({ default: NOW }),
    content: column.text(),
  },
})

export const Province = defineTable({
  columns: {
    slug: column.text({ primaryKey: true }),
    name: column.text(),
  },
})

export default defineDb({
  tables: {
    Event,
    Meetup,
    Province,
  },
})
