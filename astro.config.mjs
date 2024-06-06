import mdx from '@astrojs/mdx'
import react from '@astrojs/react'
import tailwind from '@astrojs/tailwind'
import { defineConfig } from 'astro/config'

import cloudflare from '@astrojs/cloudflare'

// https://astro.build/config
export default defineConfig({
  site: 'https://eventos.wiki',
  output: 'server',
  integrations: [tailwind(), react(), mdx()],
  adapter: cloudflare(),
})
