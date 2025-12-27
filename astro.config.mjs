import db from '@astrojs/db'
import mdx from '@astrojs/mdx'
import node from '@astrojs/node'
import react from '@astrojs/react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, envField } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  site: 'https://eventos.wiki',
  output: 'server',
  integrations: [react(), db(), mdx()],

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

  redirects: {
    '/eventos': '/events',
    '/eventos/[...slug]': '/events/[...slug]',
    '/calendario': '/calendar',
    '/privacidad': '/privacy',
    '/terminos': '/terms',
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
      GOOGLE_MAPS_PLACES_API_KEY: envField.string({ context: 'server', access: 'secret' }),
      PUBLIC_GOOGLE_MAPS_EMBED_API_KEY: envField.string({ context: 'client', access: 'public' }),
      TWITTER_CLIENT_ID: envField.string({ context: 'server', access: 'secret' }),
      TWITTER_CLIENT_SECRET: envField.string({ context: 'server', access: 'secret' }),
      PINATA_JWT: envField.string({ context: 'server', access: 'secret' }),
      PINATA_GATEWAY_URL: envField.string({ context: 'server', access: 'secret' }),
    },
  },

  adapter: node({
    mode: 'standalone',
  }),
})
