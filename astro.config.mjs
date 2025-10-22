import db from '@astrojs/db'
import mdx from '@astrojs/mdx'
import react from '@astrojs/react'
import { defineConfig, envField } from 'astro/config'

import tailwindcss from '@tailwindcss/vite'

import netlify from '@astrojs/netlify'

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
      TWITTER_CLIENT_ID: envField.string({ context: 'server', access: 'secret' }),
      TWITTER_CLIENT_SECRET: envField.string({ context: 'server', access: 'secret' }),
      PINATA_JWT: envField.string({ context: 'server', access: 'secret' }),
      PINATA_GATEWAY_URL: envField.string({ context: 'server', access: 'secret' }),
    },
  },

  adapter: netlify({}),
})
