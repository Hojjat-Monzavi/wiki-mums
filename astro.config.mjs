import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx'; 

export default defineConfig({
  // Replace with your actual GitHub username and repository name
  site: 'https://hojjat-monzavi.github.io',
  base: '/wiki-mums',
  integrations: [mdx()],
    markdown: {
    shikiConfig: {
      theme: 'github-light',
      wrap: true,
    },
  },
});
