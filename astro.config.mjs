import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import AstroPWA from '@vite-pwa/astro';

export default defineConfig({
  site: 'https://kalidasstravels.in',
  integrations: [
    tailwind(),
    react(),
    AstroPWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Kalidass Travels',
        short_name: 'Kalidass Travels',
        description: 'Premium travel and cab services across South India.',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: '/images/favicon.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/images/favicon.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        maximumFileSizeToCacheInBytes: 5000000,
      }
    })
  ],
});
