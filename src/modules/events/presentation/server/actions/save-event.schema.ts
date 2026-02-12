import { z } from 'astro:content'
import { Datetime } from '@/shared/domain/datetime/datetime'

export const saveEventActionSchema = z.object({
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
  place: z
    .object({
      id: z.string(),
      name: z.string(),
      address: z.string(),
    })
    .optional(),
  tickets: z
    .array(
      z.object({
        name: z.string(),
        price: z.number(),
      }),
    )
    .default([]),
  organizationId: z.string(),
  eventId: z.string().optional(),
  tags: z.array(z.string()).default([]),
  tagColor: z.string().default(''),
  callForSponsorsEnabled: z.boolean().optional().default(false),
  callForSponsorsContent: z.string().optional(),
  callForSpeakersEnabled: z.boolean().optional().default(false),
  callForSpeakersStartsAt: z
    .string()
    .optional()
    .transform(date => (date ? Datetime.toDate(date) : undefined)),
  callForSpeakersEndsAt: z
    .string()
    .optional()
    .transform(date => (date ? Datetime.toDate(date) : undefined)),
  callForSpeakersContent: z.string().optional(),
  agenda: z
    .object({
      tracks: z
        .array(
          z.object({
            id: z.string(),
            name: z.string(),
            description: z.string().optional(),
            sessions: z.array(
              z.object({
                id: z.string(),
                title: z.string(),
                description: z.string(),
                image: z.string().optional(),
                categories: z.array(z.string()).optional(),
                language: z.string().optional(),
                startsAt: z.string().transform(date => Datetime.toDate(date)),
                endsAt: z.string().transform(date => Datetime.toDate(date)),
                speakers: z.array(
                  z.object({
                    id: z.string(),
                    name: z.string(),
                    image: z.string().optional(),
                    bio: z.string().optional(),
                    position: z.string().optional(),
                    socialLinks: z
                      .object({
                        twitter: z.string().optional(),
                        linkedin: z.string().optional(),
                        github: z.string().optional(),
                        web: z.string().optional(),
                      })
                      .optional(),
                  }),
                ),
              }),
            ),
          }),
        )
        .optional(),
      commonElements: z
        .array(
          z.object({
            id: z.string(),
            title: z.string(),
            description: z.string().optional(),
            startsAt: z.string().transform(date => Datetime.toDate(date)),
            endsAt: z.string().transform(date => Datetime.toDate(date)),
            type: z.enum(['coffee-break', 'lunch', 'registration', 'keynote', 'other']),
          }),
        )
        .optional(),
    })
    .optional(),
})
