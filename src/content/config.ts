import { defineCollection, z } from 'astro:content';

const articles = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    featured: z.string().optional(),
    synonyms: z.array(z.string()).optional(),
    lastUpdated: z.coerce.date().optional(),
    // optional manual ordering hint within a category; default is alphabetic by path
    order: z.number().optional(),
    references: z.array(z.string()).optional(),
    // Optional hero image, displayed at the top of the article and as a
    // thumbnail in any "See also" grid, article lists, search results, etc.
    // Should be a path under /public, e.g. "/images/heart-anatomy.svg".
    cover: z.string().optional(),
    // Optional list of related article paths (e.g. "/articles/cardiology/arrhythmia").
    // When present, rendered as a thumbnail grid at the foot of the article
    // instead of any plain-text "See also" section in the body.
    seeAlso: z.array(z.string()).optional(),
  }),
});

export const collections = { articles };
