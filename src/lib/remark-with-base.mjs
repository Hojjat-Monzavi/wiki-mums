// remark plugin: prefix internal markdown URLs with the configured base.
//
// Astro's `base` config does NOT rewrite links inside markdown bodies —
// only the framework-generated asset/href URLs get prefixed. So an
// article containing `[stroke](/articles/neurology/stroke)` would
// render as a broken link under a sub-path deployment. This plugin
// walks the mdast tree at build time and rewrites any link / image /
// definition URL that starts with a single `/` (but not `//`, which
// is protocol-relative) by prepending the base.
//
// External URLs (http://, https://, mailto:, #anchors, etc.) are
// passed through unchanged.

import { visit } from 'unist-util-visit';

/**
 * @typedef {{ base?: string }} Options
 */

/**
 * @type {import('unified').Plugin<Options[], import('mdast').Root>}
 */
export function remarkWithBase(options = {}) {
  // `options.base` wins; fall back to Astro's injected BASE_URL.
  const rawBase = options.base || import.meta.env.BASE_URL || '/';
  // Normalize: ensure exactly one leading slash and no trailing slash,
  // so we can safely concatenate with the path (which already starts
  // with '/').
  const prefix = rawBase === '/' ? '' : rawBase.replace(/\/+$/, '');

  if (!prefix) {
    // No base configured — nothing to do.
    return (tree) => tree;
  }

  return (tree) => {
    visit(tree, (node) => {
      if (
        node.type === 'link' ||
        node.type === 'image' ||
        node.type === 'imageReference' ||
        node.type === 'linkReference' ||
        node.type === 'definition'
      ) {
        const url = /** @type {string | undefined} */ (node.url);
        if (
          typeof url === 'string' &&
          url.startsWith('/') &&
          !url.startsWith('//')
        ) {
          node.url = prefix + url;
        }
      }
    });
  };
}

export default remarkWithBase;
