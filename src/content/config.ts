import { defineCollection, z } from 'astro:content'

const changelog = defineCollection({
  type: 'content',
  schema: z.object({
    date: z.date(),
  }),
})

export const collections = {
  changelog,
}
