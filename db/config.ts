import { column, defineDb, defineTable, NOW } from 'astro:db'
import { EventTypes } from '../src/modules/events/domain/event-type'
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
    type: column.text({
      default: EventTypes.InPerson,
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
    place: column.json({ optional: true }),
  },
})

export const Ticket = defineTable({
  columns: {
    id: column.text({ primaryKey: true, optional: false, unique: true }),
    eventId: column.text({ optional: false, references: () => Event.columns.id }),
    name: column.text(),
    price: column.number(),
    createdAt: column.date({ default: NOW }),
    updatedAt: column.date({ default: NOW }),
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
    place: column.json({ optional: true }),
    allowsAttendees: column.boolean({ default: true }),
    registrationEndsAt: column.date({ optional: true }),
    maxAttendees: column.number({ optional: true }),
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

export const UserSettings = defineTable({
  columns: {
    id: column.text({ primaryKey: true, optional: false, unique: true }),
    userId: column.text({ optional: false, references: () => User.columns.id }),
    meetupAttendanceEmailEnabled: column.boolean({ default: true }),
    organizationUpdatesEmailEnabled: column.boolean({ default: true }),
    createdAt: column.date({ default: NOW }),
    updatedAt: column.date({ default: NOW }),
  },
})

export const FeatureRequest = defineTable({
  columns: {
    id: column.text({ primaryKey: true, optional: false, unique: true }),
    userId: column.text({ optional: false, references: () => User.columns.id }),
    title: column.text(),
    description: column.text(),
    status: column.text({ default: 'PENDING' }), // PENDING, IN_PROGRESS, COMPLETED, REJECTED
    createdAt: column.date({ default: NOW }),
    updatedAt: column.date({ default: NOW }),
  },
})

export const FeatureRequestVote = defineTable({
  columns: {
    featureRequestId: column.text({ optional: false, references: () => FeatureRequest.columns.id }),
    userId: column.text({ optional: false, references: () => User.columns.id }),
    createdAt: column.date({ default: NOW }),
  },
})

export const Bug = defineTable({
  columns: {
    id: column.text({ primaryKey: true, optional: false, unique: true }),
    userId: column.text({ optional: false, references: () => User.columns.id }),
    title: column.text(),
    description: column.text(),
    status: column.text({ default: 'OPEN' }), // OPEN, IN_REVIEW, CANCELED, FIXED
    visibility: column.text({ default: 'PUBLIC' }), // PUBLIC, PRIVATE
    createdAt: column.date({ default: NOW }),
    updatedAt: column.date({ default: NOW }),
  },
})

export const BugComment = defineTable({
  columns: {
    id: column.text({ primaryKey: true, optional: false, unique: true }),
    bugId: column.text({ optional: false, references: () => Bug.columns.id }),
    userId: column.text({ optional: false, references: () => User.columns.id }),
    content: column.text(),
    createdAt: column.date({ default: NOW }),
    updatedAt: column.date({ default: NOW }),
  },
})

export const AdminUser = defineTable({
  columns: {
    email: column.text({ primaryKey: true, optional: false, unique: true }),
    createdAt: column.date({ default: NOW }),
  },
})

export default defineDb({
  tables: {
    Event,
    Ticket,
    Meetup,
    MeetupAttendee,
    Province,
    User,
    Session,
    Organization,
    OrganizationUser,
    OrganizationFollower,
    UserSettings,
    FeatureRequest,
    FeatureRequestVote,
    Bug,
    BugComment,
    AdminUser,
  },
})
