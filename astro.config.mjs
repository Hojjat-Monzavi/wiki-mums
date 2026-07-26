import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { remarkWithBase } from './src/lib/remark-with-base.mjs';

// Keep the base in a single source of truth so the remark plugin and
// Astro's own URL handling always agree.
const BASE = '/wiki-mums';

export default defineConfig({
  // Replace with your actual GitHub username and repository name
  site: 'https://hojjat-monzavi.github.io',
  base: BASE,
  integrations: [mdx()],
  markdown: {
    shikiConfig: {
      theme: 'github-light',
      wrap: true,
    },
    // Prefix every internal link / image URL inside markdown bodies
    // (e.g. `[stroke](/articles/neurology/stroke)` or
    // `![](/images/heart-anatomy.svg)`) with the configured `base`.
    remarkPlugins: [[remarkWithBase, { base: BASE }]],
    // Apply the same rewriting to MDX too.
    extendMarkdownConfig(mdConfig) {
      mdConfig.remarkPlugins = mdConfig.remarkPlugins || [];
      mdConfig.remarkPlugins.push([remarkWithBase, { base: BASE }]);
      return mdConfig;
    },
  },
});
