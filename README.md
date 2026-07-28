# WikiMUMS

A minimalist, Wikipedia-style medical encyclopedia built with [Astro](https://astro.build) and MDX. Articles are authored in Markdown (`.md`) and organised by their folder path — the first directory becomes the article's category, and the file name becomes the article's slug. Articles are listed in alphabetic path order throughout the site (sidebar, category pages, navigation).

## Stack

- **Astro 4** — static site generator
- **@astrojs/mdx** — MDX support
- **@astrojs/sitemap** — automatic sitemap
- No frontend framework, no tracking, no database
- One small inline script powers the live search box

## Getting started

```bash
# Install dependencies
npm install

# Start the dev server at http://localhost:4321
npm run dev

# Build the static site to ./dist
npm run build

# Preview the production build locally
npm run preview
```

## Project structure

```
medical-wiki/
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── public/
│   ├── favicon.png
│   └── images/
│       ├── heart-anatomy.svg       # Cover image used by hypertension.md
│       └── article-placeholder.svg  # Fallback for articles without a cover
└── src/
    ├── components/
    │   ├── Header.astro          # Top bar: logo, live search dropdown, nav
    │   ├── Footer.astro
    │   ├── Sidebar.astro         # Left nav, grouped by category
    │   ├── Breadcrumbs.astro
    │   ├── TableOfContents.astro # Right TOC for long articles
    │   ├── ArticleCard.astro     # List item with cover thumbnail
    │   └── RelatedArticles.astro # Thumbnail grid for article See also
    ├── lib/
    │   └── articles.ts           # Shared article-index helpers
    ├── layouts/
    │   ├── Base.astro            # HTML shell
    │   └── Article.astro         # Article page (sidebar + main + TOC)
    ├── pages/
    │   ├── index.astro           # Home
    │   ├── search.astro          # Live client-side search results page
    │   ├── search-index.json.ts  # Static search index endpoint
    │   ├── about.astro
    │   ├── random.astro          # Redirects to a random article
    │   ├── 404.astro
    │   ├── categories/
    │   │   ├── index.astro       # Category cards with previews
    │   │   └── [category].astro  # Full article list for one category
    │   └── articles/
    │       └── [...slug].astro   # Renders every article by path
    ├── content/
    │   ├── config.ts             # Zod schema for articles (incl. cover, seeAlso)
    │   └── articles/
    │       ├── cardiology/
    │       │   ├── hypertension.md        # has cover: heart-anatomy.svg
    │       │   ├── myocardial-infarction.md
    │       │   └── arrhythmia.md
    │       ├── neurology/
    │       │   ├── stroke.md
    │       │   ├── migraine.md
    │       │   └── epilepsy.md
    │       ├── respiratory/
    │       │   ├── asthma.md
    │       │   ├── copd.md
    │       │   └── pneumonia.md
    │       ├── endocrinology/
    │       │   ├── diabetes-mellitus.md
    │       │   └── hypothyroidism.md
    │       └── gastroenterology/
    │           ├── peptic-ulcer-disease.md
    │           ├── irritable-bowel-syndrome.md
    │           ├── gastroesophageal-reflux-disease.md
    │           └── inflammatory-bowel-disease.md
    └── styles/
        └── global.css
```

## How articles are organised

Every article is a Markdown (`.md`) or MDX (`.mdx`) file under
`src/content/articles/<category>/<article-slug>.md`.

- The first path segment is the **category** (e.g. `cardiology`)
- The file name (minus extension) is the **article slug**
- The full URL is `/articles/<category>/<article-slug>`
- Articles are listed **in alphabetic path order** throughout the site — sidebar, category pages, search index
- A Zod schema in `src/content/config.ts` validates the frontmatter

### Article frontmatter

```yaml
---
title: 'Hypertension'
description: 'One-line description shown on cards and search.'
category: 'Cardiology'
synonyms:
  - 'High blood pressure'
lastUpdated: 2025-03-14
cover: '/images/heart-anatomy.svg'        # optional — shown as hero + thumbnail
seeAlso:                                   # optional — renders as thumbnail grid
  - /articles/cardiology/myocardial-infarction
  - /articles/cardiology/arrhythmia
  - /articles/neurology/stroke
references:
  - 'Citation text…'
---
```

`title`, `description` and `category` are required. The other fields are optional.

### Images

Article images live under `public/images/` and are referenced by absolute path
from the site root. There are three ways to use them:

1. **Cover image** — set `cover: '/images/foo.svg'` in frontmatter. The image
   renders as a hero at the top of the article **and** as a thumbnail wherever
   the article appears in a list (home page, category page, search results,
   other articles' See also grids).
2. **Inline image** — standard Markdown image syntax in the article body:
   `![alt text](/images/foo.svg)`. Renders as a block image inside the article
   body.
3. **See also thumbnails** — when an article appears in another article's
   `seeAlso` list, its cover image (or the placeholder) is shown as the
   thumbnail in the See also grid.

If no cover is set, a placeholder image (`/images/article-placeholder.svg`)
is used so the layout never breaks.

### Linking between articles

Use standard Markdown link syntax pointing at the article's path:

```markdown
See [myocardial infarction](/articles/cardiology/myocardial-infarction) for more.
```

For "See also" sections, prefer the frontmatter `seeAlso` array — it renders
as a thumbnail grid rather than plain text links.

## Search

The header search is **fully client-side**:

- On first focus, the input fetches `/search-index.json` (a static file built
  at compile time containing each article's `title`, `description`, `category`,
  `synonyms`, and `cover`).
- As you type, the top 6 matches appear in a dropdown below the input with
  cover thumbnails. Matches are scored: title-prefix beats title-contains
  beats synonym match.
- Clicking a dropdown result navigates directly to that article.
- Pressing Enter (or clicking "All results →") goes to `/search?q=…` for the
  full results page, which uses the same index.
- The browser's `:visited` color is **disabled for all navigation chrome**
  (header, sidebar, footer, breadcrumbs, cards) so the active-page state never
  turns purple. Visited coloring only applies to in-article body links.

## Design language

- **Wikipedia-like minimalism** — serif body (Charter / Georgia / Cambria), sans-serif UI, generous whitespace, calm palette.
- **Three-column desktop layout** — left sidebar with category navigation, central article, right TOC for long articles.
- **Tablet** — sidebar stays, TOC hidden.
- **Mobile** — single column, collapsible sidebar, search bar full width, see-also grid collapses to 1 column.
- **Print** — sidebar/header/footer hidden, links underlined.
- **Reduced motion** respected.
- **No external fonts, no analytics, no JavaScript framework.** The only inline scripts power the search box, the search dropdown, and the mobile nav toggle.

## Adding a new article

1. Create a new file at `src/content/articles/<category>/<slug>.md`.
2. Add frontmatter (`title`, `description`, `category` at minimum).
3. Write the body in Markdown. Link to other articles with their path.
4. The article appears automatically in the sidebar, category page, search index and home page.

## Adding a new category

Just drop a Markdown file into a new folder under `src/content/articles/`. Everything else (sidebar, category page, home grid) updates automatically.

## Medical disclaimer

Articles on WikiMUMS are for general education only and are not a substitute for professional medical advice, diagnosis or treatment. Always seek the advice of a qualified healthcare provider with any questions about a medical condition.

## License

The scaffold code is MIT. Article text in this repository is **dummy content** for demonstration — replace it with your own reviewed, sourced content before deploying in a clinical context.
