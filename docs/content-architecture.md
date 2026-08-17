# Content Architecture & Sanity CMS Guide

This document describes how content is modeled, queried, and rendered across the portfolio.

---

## 1. CMS Architecture & Abstraction Layer (`src/lib/cms/`)

The content layer uses a provider-agnostic abstraction so that pages do not depend on how or where data is stored:

```
src/lib/cms/
├── types.ts          # Unified TypeScript interfaces for Article, Project, AuthorProfile, Block
├── client.ts         # Factory returning the active CMS adapter
├── queries.ts        # Canonical query functions: getArticles(), getArticleBySlug(), getProjects()
└── adapters/
    ├── sanity.ts     # Sanity Studio adapter (queries Sanity over GROQ via edge fetch)
    └── local.ts      # Local fallback adapter reading from src/data/
```

---

## 2. Sanity CMS Setup

- **Project ID**: `j0pcmxw1`
- **Dataset**: `production`
- **API Version**: `2024-01-01`
- **Edge Queries**: The Sanity adapter uses standard HTTP `fetch` to query Sanity's GROQ API endpoint without heavy Node dependencies.

### Document Schemas

#### Article (`_type: "article"`)
- `slug`: Unique route slug (e.g. `react-performance-checklist`)
- `title`: Article headline
- `description`: Meta summary
- `quickAnswer`: TL;DR executive summary callout
- `kind`: `"article"` | `"case-note"` | `"note"`
- `category`: `"React"` | `"Node.js"` | `"Shopify"` | `"Cloudflare"` | `"Performance"` | `"AI"` | `"Architecture"` | `"Career"`
- `difficulty`: `"Beginner"` | `"Intermediate"` | `"Advanced"`
- `readingTime`: Estimated minutes
- `published`: ISO 8601 date string
- `updated`: ISO 8601 date string
- `body`: Structured block array (headings, paragraphs, copyable code blocks with language tags, tips, warnings, checklists, tables)
- `checklist`: Array of actionable checklist steps
- `mistakes`: Array of common pitfalls to avoid
- `faq`: Array of `{ q: string, a: string }` questions and answers
- `related`: Array of related article slugs
- `projects`: Array of related project slugs

#### Project (`_type: "project"`)
- `slug`: Case study route slug (e.g. `align-music-platform`)
- `title`: Product name
- `tagline`: Short value proposition
- `summary`: Overview paragraph
- `description`: In-depth breakdown
- `year`: Launch year
- `role`: Engineering role
- `status`: Project status
- `metrics`: Array of `{ label: string, value: string }`
- `stack`: Array of technology names
- `architecture`: Array of architecture highlights
- `highlights`: Array of feature highlights
- `impact`: Key business/technical outcomes
- `githubUrl`, `liveUrl`: External links

---

## 3. Seeding Content into Sanity

To re-seed or synchronize repository data with Sanity Studio, run the built-in seed utility:

```bash
node src/scripts/seed-sanity.mjs
```
This utility will push all documents in `src/data/insights.ts` and `src/data/site.ts` to your Sanity dataset using the Sanity mutations API.
