// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

const isBuild = process.env.NODE_ENV === 'production' || process.argv.includes('build');

// https://astro.build/config
export default defineConfig({
  site: 'https://rohitgautam.site',
  output: 'static',

  devToolbar: { enabled: false },

  integrations: [
    react(),
    sitemap(),
  ],

  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ['resend'],
    },
  },

  adapter: isBuild ? cloudflare() : undefined,

  redirects: {
    '/insights': '/blog',
    '/insights/[slug]': '/blog/[slug]',
  },
});