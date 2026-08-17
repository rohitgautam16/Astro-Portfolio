# Rohit Gautam — Portfolio & Engineering Blog

A modern, high-performance developer portfolio and technical publication built with **Astro 5**, **React 19**, **Tailwind CSS v4**, and **Cloudflare Workers**.

---

## ⚡ Key Highlights

- **Framework**: Astro 5 (Server-side rendering + pre-rendered static routes)
- **Interactive Islands**: React 19 components with Framer Motion, GSAP, and Lenis smooth scroll
- **Transitions**: Persistent vanilla JS HTML5 canvas pixel dissolve page wipe
- **Styling**: Tailwind CSS v4 with custom neobrutalist tokens and light/dark modes
- **CMS**: Sanity Studio (`j0pcmxw1`) edge GROQ queries with local schema fallback
- **Contact & Newsletter**: Resend email delivery + automated Resend Audiences contact synchronization
- **Command Palette**: Global `⌘K` modal search across Pages, Projects, Articles, and Actions
- **SEO & RSS**: OpenGraph cards, Twitter preview cards, Schema.org JSON-LD structured data, dynamic XML sitemaps, and RSS 2.0 feed (`/rss.xml`)

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and fill in your secrets:
```bash
cp .env.example .env
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:4321](http://localhost:4321) in your browser.

---

## 📦 Production Build & Deployment

### Build for Cloudflare
```bash
npm run build
```

### Preview Locally
```bash
npm run preview
```

### Deploy to Cloudflare Pages/Workers
```bash
npx wrangler pages deploy dist/client
```
or connect the repository directly in Cloudflare Pages dashboard with build command `npm run build` and output directory `dist/client`.

---

## 📚 Documentation

Detailed documentation is available in the [`docs/`](docs/) directory:
- [Architecture & Islands Design](docs/architecture.md)
- [SEO, Metadata & Structured Data](docs/seo.md)
- [Sanity CMS Content Architecture](docs/content-architecture.md)
- [Third-Party Integrations & API Keys](docs/integrations.md)
