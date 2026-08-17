# Architecture & System Design

This document outlines the architectural patterns, component structure, styling tokens, and animation runtime used in Rohit Gautam's portfolio website.

---

## 1. Core Technology Stack

- **Framework**: [Astro 5](https://astro.build/) with React 19 Islands
- **Target Platform**: [Cloudflare Workers / Pages](https://developers.cloudflare.com/pages/) via `@astrojs/cloudflare`
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with custom `@theme` tokens and modern neobrutalist design primitives
- **Animation Suite**:
  - [Framer Motion](https://motion.dev/) for interactive micro-interactions, 3D card tilt/flip, and stagger animations
  - [GSAP](https://greensock.com/) for scroll progress tracking
  - [Lenis](https://lenis.darkroom.engineering/) for inertia-based smooth scrolling
  - Vanilla JS / HTML5 Canvas for persistent pixel dissolve route transitions
- **Content Management**: [Sanity Headless CMS](https://www.sanity.io/) (edge GROQ queries) with local TypeScript schema fallback
- **Serverless API Endpoints**:
  - `/api/contact`: Form validation via Zod + Resend email delivery
  - `/api/newsletter`: Zod email validation + Resend Audiences contact synchronization

---

## 2. Islands Architecture & Hydration Strategy

Astro renders components as static, zero-JS HTML by default. Interactive or animated components are embedded as React islands using explicit hydration directives:

| Component | Hydration Directive | Rationale |
|---|---|---|
| `Header.tsx` | `client:load` | Sticky navigation, theme toggle, and ⌘K trigger needed immediately on page load |
| `HeroSection.tsx` | `client:load` | Above-the-fold 3D card flip, mascot, and stagger animations render on initial paint |
| `FeaturedProducts.tsx` | `client:visible` | Heavy animation bundle hydrates only when scrolled into the viewport |
| `PhilosophySection.tsx` | `client:visible` | Hydrates on viewport entry |
| `TechStackSection.tsx` | `client:visible` | Hydrates on viewport entry |
| `CareerTimeline.tsx` | `client:visible` | Hydrates on viewport entry |
| `BuildingSection.tsx` | `client:visible` | Hydrates on viewport entry |
| `CertificationsSection.tsx` | `client:visible` | Hydrates on viewport entry |
| `ContactCta.tsx` | `client:visible` | Hydrates on viewport entry |
| `ContactForm.tsx` | `client:load` | Form state, bifurcated currency switcher, validation |
| `Newsletter.tsx` | `client:visible` | Newsletter signup card hydrates on scroll |
| `CommandPalette.tsx` | `client:idle` | Hydrates during browser idle time |
| `ScrollProgress.tsx` | `client:idle` | GSAP scroll indicator hydrates during browser idle time |
| `SmoothScroll.tsx` | `client:idle` | Lenis smooth scrolling engine hydrates during browser idle time |

---

## 3. Directory Layout

```
astro-portfolio/
├── docs/                         # Technical documentation
│   ├── architecture.md           # This document
│   ├── seo.md                    # Metadata, OpenGraph & Schema.org guide
│   ├── content-architecture.md   # Sanity CMS & data layer guide
│   └── integrations.md           # Resend, Cal.com & environment variables
├── public/                       # Static assets served at root
│   ├── favicon.svg               # Custom branding vector icon
│   ├── favicon.ico               # Fallback legacy icon
│   ├── robots.txt                # Crawler directives with sitemap & RSS links
│   ├── resume.pdf                # Downloadable PDF resume
│   └── images/                   # Static raster and portrait images
├── src/
│   ├── components/
│   │   ├── Footer.astro          # Zero-JS static footer with SVG scribble
│   │   └── react/                # React islands
│   │       ├── Header.tsx        # Sticky navigation island
│   │       ├── MobileMenu.tsx    # Mobile drawer island
│   │       ├── ContactForm.tsx   # Contact form with bifurcated budget
│   │       ├── CommandPalette.tsx# Global ⌘K search dialog
│   │       ├── BlogList.tsx      # Real-time search & filter island
│   │       ├── ArticleDetail.tsx # Rich block renderer & copy buttons
│   │       ├── Newsletter.tsx    # Resend newsletter card
│   │       ├── Mascot.tsx        # Framer Motion animated SVG mascot
│   │       ├── motion.tsx        # 12 Framer Motion / GSAP wrappers
│   │       └── sections/         # Homepage interactive section islands
│   ├── data/
│   │   ├── site.ts               # Profile, timeline, certifications, project data
│   │   └── insights.ts           # Technical blog articles and block schemas
│   ├── layouts/
│   │   ├── BaseLayout.astro      # HTML head, OpenGraph, fonts, theme script, <ClientRouter />
│   │   └── PageLayout.astro      # Standard header/main/footer page wrapper
│   ├── lib/
│   │   ├── cms/                  # Sanity CMS GROQ queries and local adapter
│   │   ├── newsletter/           # Resend newsletter provider abstraction
│   │   └── utils.ts              # cn (clsx + twMerge) utility
│   ├── pages/
│   │   ├── index.astro           # Homepage
│   │   ├── about.astro           # About page
│   │   ├── projects/             # Projects index and dynamic [slug].astro routes
│   │   ├── blog/                 # Blog index and dynamic [slug].astro routes
│   │   ├── experience.astro      # Experience & career timeline
│   │   ├── resume.astro          # Resume page with print stylesheet
│   │   ├── contact.astro         # Contact page with Cal.com link
│   │   ├── 404.astro             # Custom error page with mascot
│   │   ├── rss.xml.ts            # RSS 2.0 feed endpoint
│   │   └── api/                  # Serverless API routes (contact, newsletter)
│   ├── scripts/
│   │   └── pixel-transition.ts   # Vanilla JS canvas dissolve router lifecycle script
│   └── styles/
│       └── global.css            # Tailwind CSS v4 design tokens and utilities
├── astro.config.mjs              # Astro configuration (Cloudflare adapter, React, Sitemap)
└── wrangler.jsonc                # Cloudflare deployment settings
```

---

## 4. Pixel Transition Engine

The page transition uses a persistent canvas dissolve effect written in vanilla TypeScript (`src/scripts/pixel-transition.ts`). It hooks into Astro's `<ClientRouter />` lifecycle events:
1. `astro:before-swap`: Captures the current viewport and initializes the pixel dissolve wipe.
2. `astro:after-swap`: Reveals the incoming route with a staggered block dissolve and cleans up the canvas overlay.
3. Automatically falls back gracefully on browsers without View Transitions support.
