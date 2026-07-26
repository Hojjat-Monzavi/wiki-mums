// Base-URL helper.
//
// `import.meta.env.BASE_URL` is the value of `base` in astro.config.mjs.
// Astro does NOT guarantee a trailing slash — for `base: '/wiki-mums'`
// it returns `/wiki-mums` (no trailing slash), and for `base: '/foo/'`
// it returns `/foo/`. We normalize internally so the caller does not
// have to care.
//
// Every internal link, public asset path, fetch() URL and form action
// must be run through `withBase()` so the site works when deployed
// under a sub-path (e.g. GitHub Pages project sites, /docs/, /preview/).
//
// Anchors ("#foo") and absolute URLs ("https://...", "mailto:...")
// are passed through unchanged.

export const BASE_URL: string = import.meta.env.BASE_URL || '/';

// Always end with exactly one slash for safe concatenation.
//   '/'            -> '/'
//   '/wiki-mums'   -> '/wiki-mums/'
//   '/wiki-mums/'  -> '/wiki-mums/'
const NORMALIZED_BASE = BASE_URL.replace(/\/+$/, '') + '/';

export function withBase(path: string): string {
  if (!path) return NORMALIZED_BASE.replace(/\/$/, '') || '/';

  // Anchors and query-only links — leave as-is.
  if (path.startsWith('#') || path.startsWith('?')) return path;
  // External URLs — leave as-is.
  if (/^[a-z]+:/i.test(path)) return path;
  // Already rooted at the base — leave as-is.
  if (BASE_URL !== '/' && path.startsWith(NORMALIZED_BASE)) return path;

  // `/` alone — return the base WITHOUT a trailing slash so the home
  // link is `/wiki-mums`, not `/wiki-mums/`.
  if (path === '/') {
    return NORMALIZED_BASE.replace(/\/$/, '') || '/';
  }

  const stripped = path.replace(/^\/+/, '');
  return NORMALIZED_BASE + stripped;
}
