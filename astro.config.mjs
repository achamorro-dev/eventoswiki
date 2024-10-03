import db from '@astrojs/db'
import mdx from '@astrojs/mdx'
import react from '@astrojs/react'
import tailwind from '@astrojs/tailwind'
import vercel from '@astrojs/vercel/serverless'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  site: 'https://eventos.wiki',
  output: 'server',
  integrations: [
    tailwind(),
    react(),
    db(),
    mdx(),
    vercel({
      webAnalytics: {
        enabled: true,
      },
    }),
  ],
})
