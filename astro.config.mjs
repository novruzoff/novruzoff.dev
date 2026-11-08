// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://novruzoff.dev',
  // Subpages live at no-slash URLs (/penknife/privacy, not /penknife/privacy/),
  // because those exact URLs go into App Store Connect. `format: 'file'` builds
  // penknife/privacy.html instead of penknife/privacy/index.html, and
  // `trailingSlash: 'never'` makes Astro.url, the canonical tags and the
  // sitemap use the same no-slash form. vercel.json (cleanUrls) serves
  // /penknife/privacy from that .html file with a 200. The home page is still
  // dist/index.html at "/".
  trailingSlash: 'never',
  build: { format: 'file' },
  vite: { plugins: [tailwindcss()] },
  // With either option above, @astrojs/sitemap writes the root as
  // "https://novruzoff.dev" (no slash). That is the same URL as the canonical
  // "https://novruzoff.dev/": an empty path normalises to "/" (RFC 3986 6.2.3).
  integrations: [sitemap()]
});
