# SEO, Structured Data & Metadata Guide

This document outlines the SEO infrastructure, social share cards, search engine directives, and structured data implemented across the portfolio.

---

## 1. Metadata & OpenGraph Architecture

Every page is rendered using `src/layouts/BaseLayout.astro`, which systematically outputs standardized meta tags:

- **Canonical URLs**: Automatically generated from `Astro.site` (`https://rohitgautam.site`) and `Astro.url.pathname`.
- **OpenGraph Protocol**:
  - `og:site_name`: `Rohit Gautam`
  - `og:type`: `website` (or `article` for blog posts)
  - `og:title`, `og:description`, `og:url`
  - `og:image`: Dynamic hero image or high-res portrait card (`/images/portrait.webp`).
- **Twitter Cards**: `twitter:card: summary_large_image`, `twitter:title`, `twitter:description`, `twitter:image`.
- **Theme Color**: `<meta name="theme-color" content="#121212" />` preventing white flashes in mobile browser chrome.

---

## 2. Structured Data (Schema.org JSON-LD)

High-fidelity JSON-LD schemas are embedded directly into page headers:

### Homepage (`/`)
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Rohit Gautam",
  "jobTitle": "Software Engineer",
  "description": "Software engineer building scalable full stack applications and AI-powered software...",
  "address": { "@type": "PostalAddress", "addressCountry": "IN" },
  "sameAs": [
    "https://github.com/rohitgautam",
    "https://linkedin.com/in/rohitgautam"
  ]
}
```

### Blog Index (`/blog`)
Outputs a `@type: "Blog"` schema with a collection of `blogPost` references for every published technical article.

### Article Detail (`/blog/[slug]`)
Outputs a `@type: "TechArticle"` / `"BlogPosting"` schema, a `"BreadcrumbList"`, and an interactive `"FAQPage"` schema mapping the FAQ accordion items for rich snippets in Google Search and AI answer engines.

---

## 3. Crawler Directives & Feeds

- **Robots.txt (`public/robots.txt`)**:
  ```
  User-agent: *
  Allow: /

  Sitemap: https://rohitgautam.site/sitemap-index.xml
  Sitemap: https://rohitgautam.site/rss.xml
  ```
- **Sitemap**: Generated automatically at build time via `@astrojs/sitemap` (`/sitemap-index.xml` and `/sitemap-0.xml`).
- **RSS 2.0 Feed**: Fully valid RSS feed available at `/rss.xml` and `/blog/feed.xml` containing all technical articles.
- **301 URL Redirects**: Legacy TanStack Router routes (`/insights` and `/insights/[...slug]`) are 301-redirected to `/blog` and `/blog/[...slug]` in `astro.config.mjs`.
