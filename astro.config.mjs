import db from '@astrojs/db'
import mdx from '@astrojs/mdx'
import react from '@astrojs/react'
import vercel from '@astrojs/vercel'
import { defineConfig, envField } from 'astro/config'

import tailwindcss from '@tailwindcss/vite'

// https://astro.build/config
export default defineConfig({
  site: 'https://eventos.wiki',
  output: 'server',
  integrations: [react(), db(), mdx()],
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),
  security: {
    checkOrigin: true,
  },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@/styles': './src/styles',
      },
    },
  },
  env: {
    schema: {
      BASE_URL: envField.string({ context: 'server', access: 'public', url: true }),
      ASTRO_DB_REMOTE_URL: envField.string({ context: 'server', access: 'secret' }),
      ASTRO_DB_APP_TOKEN: envField.string({ context: 'server', access: 'secret' }),
      GITHUB_CLIENT_ID: envField.string({ context: 'server', access: 'secret' }),
      GITHUB_CLIENT_SECRET: envField.string({ context: 'server', access: 'secret' }),
      GOOGLE_CLIENT_ID: envField.string({ context: 'server', access: 'secret' }),
      GOOGLE_CLIENT_SECRET: envField.string({ context: 'server', access: 'secret' }),
      TWITTER_CLIENT_ID: envField.string({ context: 'server', access: 'secret' }),
      TWITTER_CLIENT_SECRET: envField.string({ context: 'server', access: 'secret' }),
    },
  },
})
