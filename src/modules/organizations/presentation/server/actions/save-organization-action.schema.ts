import { z } from "astro:content";

export const saveOrganizationActionSchema = z.object({
  handle: z.string(),
  name: z.string(),
  bio: z.string(),
  image: z.string().optional(),
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
  followers: z.array(z.string()).optional(),
  organizerId: z.string(),
  organizationId: z.string().optional(),
});
