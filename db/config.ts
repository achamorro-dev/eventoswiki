import { NOW, column, defineDb, defineTable } from 'astro:db'

export const Event = defineTable({
  columns: {
    slug: column.text({ primaryKey: true, optional: false, unique: true }),
    title: column.text(),
    shortDescription: column.text(),
    startsAt: column.date(),
    endsAt: column.date(),
    thumbnail: column.text(),
    image: column.text(),
    location: column.text({ optional: true }),
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
    slug: column.text({ primaryKey: true, optional: false, unique: true }),
    title: column.text(),
    shortDescription: column.text(),
    startsAt: column.date(),
    endsAt: column.date(),
    thumbnail: column.text(),
    image: column.text(),
    location: column.text({ optional: true }),
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
    slug: column.text({ primaryKey: true, optional: false, unique: true }),
    name: column.text(),
  },
})

export const User = defineTable({
  columns: {
    id: column.text({ primaryKey: true, optional: false, unique: true }),
    username: column.text(),
    name: column.text(),
    email: column.text({ optional: true }),
    avatar: column.text(),
    githubId: column.text({ optional: true }),
    googleId: column.text({ optional: true }),
    createdAt: column.date({ default: NOW }),
    updatedAt: column.date({ default: NOW }),
  },
})

export const Session = defineTable({
  columns: {
    id: column.text({ optional: false, unique: true }),
    userId: column.text({ optional: false, references: () => User.columns.id }),
    createdAt: column.date({ default: NOW }),
    expiresAt: column.number({ optional: false }),
  },
})

export default defineDb({
  tables: {
    Event,
    Meetup,
    Province,
    User,
    Session,
  },
})
