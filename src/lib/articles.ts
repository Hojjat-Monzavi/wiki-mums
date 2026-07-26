// Shared article-index helpers.
//
// All pages and components that need to look up articles by path, group by
// category, or render thumbnails go through this module so the lookup logic
// stays in one place.

import { getCollection, type CollectionEntry } from 'astro:content';

export type ArticleEntry = CollectionEntry<'articles'>;

export const PLACEHOLDER_IMAGE = '/images/article-placeholder.svg';

/** Humanize a slug like "cardiology" → "Cardiology". */
export function humanize(slug: string): string {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/** All articles, sorted by path (alphabetic, numeric-aware). */
export async function getAllArticles(): Promise<ArticleEntry[]> {
  return (await getCollection('articles')).sort((a, b) =>
    a.id.localeCompare(b.id, 'en', { numeric: true })
  );
}

/** Group articles by their first path segment (the category slug). */
export async function getArticlesByCategory(): Promise<Map<string, ArticleEntry[]>> {
  const all = await getAllArticles();
  const groups = new Map<string, ArticleEntry[]>();
  for (const entry of all) {
    const seg = entry.slug.split('/')[0] ?? 'uncategorized';
    if (!groups.has(seg)) groups.set(seg, []);
    groups.get(seg)!.push(entry);
  }
  return groups;
}

/** Look up a single article by its canonical path (e.g. "/articles/cardiology/hypertension"). */
export async function getArticleByPath(
  path: string
): Promise<ArticleEntry | undefined> {
  if (!path.startsWith('/articles/')) return undefined;
  const slug = path.replace('/articles/', '');
  const all = await getAllArticles();
  return all.find((a) => a.slug === slug);
}

/** Look up several articles by path. Missing entries are dropped. */
export async function getArticlesByPaths(
  paths: string[]
): Promise<ArticleEntry[]> {
  const all = await getAllArticles();
  const lookup = new Map(all.map((a) => [a.slug, a]));
  return paths
    .map((p) => p.replace('/articles/', ''))
    .map((slug) => lookup.get(slug))
    .filter((e): e is ArticleEntry => Boolean(e));
}

/** Cover image path, falling back to the placeholder. */
export function coverFor(entry: ArticleEntry): string {
  return entry.data.cover ?? PLACEHOLDER_IMAGE;
}

/** Default category descriptions for the UI. */
export const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  cardiology: 'Heart and blood vessel disorders.',
  neurology: 'Disorders of the brain, spinal cord and nerves.',
  respiratory: 'Diseases of the lungs and airways.',
  endocrinology: 'Hormonal and metabolic conditions.',
  gastroenterology: 'Digestive system and liver diseases.',
};

/** Build a minimal search index entry for client-side search. */
export interface SearchIndexEntry {
  href: string;
  title: string;
  description: string;
  category: string;
  synonyms: string[];
  cover: string;
}

export async function buildSearchIndex(): Promise<SearchIndexEntry[]> {
  const all = await getAllArticles();
  return all.map((entry) => ({
    href: `/articles/${entry.slug}`,
    title: entry.data.title,
    description: entry.data.description,
    category: entry.data.category,
    synonyms: entry.data.synonyms ?? [],
    cover: coverFor(entry),
  }));
}
