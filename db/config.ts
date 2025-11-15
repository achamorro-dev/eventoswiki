import { column, defineDb, defineTable, NOW } from 'astro:db'
import { MeetupTypes } from '../src/modules/meetups/domain/meetup-type'

export const Event = defineTable({
  columns: {
    id: column.text({ primaryKey: true, optional: false, unique: true }),
    slug: column.text({ optional: false, unique: true }),
    title: column.text(),
    shortDescription: column.text(),
    startsAt: column.date(),
    endsAt: column.date(),
    image: column.text(),
    location: column.text({ optional: true }),
    web: column.text({ optional: true }),
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
    tiktok: column.text({ optional: true }),
    tags: column.text(),
    tagColor: column.text(),
    createdAt: column.date({ default: NOW }),
    updatedAt: column.date({ default: NOW }),
    content: column.text(),
    organizationId: column.text({ optional: true, references: () => Organization.columns.id }),
  },
})

export const Meetup = defineTable({
  columns: {
    id: column.text({ primaryKey: true, optional: false, unique: true }),
    slug: column.text({ optional: false, unique: true }),
    title: column.text(),
    shortDescription: column.text(),
    startsAt: column.date(),
    endsAt: column.date(),
    image: column.text(),
    type: column.text({
      default: MeetupTypes.InPerson,
    }),
    location: column.text({ optional: true }),
    web: column.text({ optional: true }),
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
    tiktok: column.text({ optional: true }),
    streamingUrl: column.text({ optional: true }),
    tags: column.text(),
    tagColor: column.text(),
    createdAt: column.date({ default: NOW }),
    updatedAt: column.date({ default: NOW }),
    content: column.text(),
    organizationId: column.text({ optional: true, references: () => Organization.columns.id }),
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
    username: column.text({ unique: true }),
    name: column.text(),
    email: column.text({ optional: true, unique: false }),
    avatar: column.text({ optional: true }),
    githubId: column.text({ optional: true }),
    googleId: column.text({ optional: true }),
    twitterId: column.text({ optional: true }),
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

export const Organization = defineTable({
  columns: {
    id: column.text({ optional: false, unique: true }),
    handle: column.text({ optional: false, unique: true }),
    name: column.text(),
    bio: column.text(),
    image: column.text({ optional: true }),
    location: column.text({ optional: true }),
    web: column.text({ optional: true }),
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
    tiktok: column.text({ optional: true }),
    createdAt: column.date({ default: NOW }),
    updatedAt: column.date({ default: NOW }),
  },
})

export const OrganizationUser = defineTable({
  columns: {
    organizationId: column.text({ optional: false, references: () => Organization.columns.id }),
    userId: column.text({ optional: false, references: () => User.columns.id }),
    createdAt: column.date({ default: NOW }),
    updatedAt: column.date({ default: NOW }),
  },
})

export const OrganizationFollower = defineTable({
  columns: {
    organizationId: column.text({ optional: false, references: () => Organization.columns.id }),
    userId: column.text({ optional: false, references: () => User.columns.id }),
    createdAt: column.date({ default: NOW }),
    updatedAt: column.date({ default: NOW }),
  },
})

export const MeetupAttendee = defineTable({
  columns: {
    meetupId: column.text({ optional: false, references: () => Meetup.columns.id }),
    userId: column.text({ optional: false, references: () => User.columns.id }),
    createdAt: column.date({ default: NOW }),
    updatedAt: column.date({ default: NOW }),
  },
})

export default defineDb({
  tables: {
    Event,
    Meetup,
    MeetupAttendee,
    Province,
    User,
    Session,
    Organization,
    OrganizationUser,
    OrganizationFollower,
  },
})
