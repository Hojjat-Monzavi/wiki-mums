// Static search index, generated at build time and fetched by the header
// search box on every page. Keeps each page payload tiny while letting the
// header offer fully client-side live search.
import type { APIRoute } from 'astro';
import { buildSearchIndex } from '../lib/articles';

export const GET: APIRoute = async () => {
  const index = await buildSearchIndex();
  return new Response(JSON.stringify(index), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
