import { Datetime } from '@/shared/domain/datetime/datetime'
import { z } from 'astro:content'

export const saveMeetupActionSchema = z.object({
  title: z.string(),
  slug: z.string(),
  shortDescription: z.string(),
  content: z.string(),
  startsAt: z.string().transform(date => Datetime.toDate(date)),
  endsAt: z.string().transform(date => Datetime.toDate(date)),
  image: z.string(),
  type: z.string(),
  location: z.string().optional(),
  web: z.string().optional(),
  twitter: z.string().optional(),
  linkedin: z.string().optional(),
  youtube: z.string().optional(),
  twitch: z.string().optional(),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  github: z.string().optional(),
  telegram: z.string().optional(),
  whatsapp: z.string().optional(),
  discord: z.string().optional(),
  tiktok: z.string().optional(),
  streamingUrl: z.string().optional(),
  organizationId: z.string(),
  meetupId: z.string().optional(),
  tags: z.array(z.string()).default([]),
  tagColor: z.string().default(''),
  place: z
    .object({
      id: z.string(),
      name: z.string(),
      address: z.string(),
    })
    .optional(),
  allowsAttendees: z.boolean(),
  registrationEndsAt: z.string().transform(date => Datetime.toDate(date)).optional(),
  maxAttendees: z.number().optional(),
})
