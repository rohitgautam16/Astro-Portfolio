export const flags = {
  /** Set to true to display a Coming Soon pre-launch landing page for the whole website on production */
  siteComingSoon: true,
  /** Set to true to show Coming Soon state on /blog while setting up publishing */
  blogComingSoon: true,
};

export const profile = {
  name: "Rohit Gautam",
  role: "Software Engineer",
  location: "India · Remote friendly",
  email: "connect@rohitgautam.site",
  github: "https://github.com/rohitgautam16",
  linkedin: "https://www.linkedin.com/in/rohitgautam24",
  x: "https://x.com/I_amrohitgautam",
  twitter: "https://x.com/I_amrohitgautam",
  scheduleUrl: "https://cal.com/rohit-gautam/30min",
  resumeUrl: "/Rohit Gautam - Full Stack Software Engineer Resume.pdf",
  /** Swap this for a real professional photograph when available. */
  photo: "/images/portrait.jpg",
  tagline:
    "Building scalable Full Stack applications and AI-powered software using React.js, Node.js and modern cloud technologies.",
  focus: [
    "React.js",
    "Node.js",
    "Shopify",
    "Cloudflare",
    "AI Automation",
    "Modern Web Engineering",
  ],
  summary: [
    "I build production software end to end — the interface a customer touches, the API behind it, and the infrastructure that keeps it fast. Most of my work lives where product commerce and engineering meet: subscription platforms, Shopify apps, multi-vendor marketplaces and AI-assisted tooling.",
    "My default is boring, typed, observable systems with a carefully crafted surface on top. I care about the first paint, the empty state, the error message and the invoice at the end of the month — because those are the parts users and founders actually feel.",
    "Right now I'm shipping edge-first architecture and AI automation into products that need to stay cheap at scale.",
  ],
};

export const philosophy = [
  {
    no: "01",
    title: "Ship the smallest honest version",
    body: "Scope is a design tool. I release the version that answers the user's question, then earn every extra layer of complexity with evidence.",
  },
  {
    no: "02",
    title: "The edge is the new backend",
    body: "Cloudflare Workers, caching and streaming push work closer to people. Latency is a product feature, not an infra footnote.",
  },
  {
    no: "03",
    title: "Typed boundaries, calm systems",
    body: "TypeScript at every seam, validation at every entry point. Most production incidents are just untyped assumptions growing up.",
  },
  {
    no: "04",
    title: "AI as a component, not a personality",
    body: "Automations need fallbacks, budgets and review paths. A model is a fallible dependency I design guardrails around.",
  },
];

export type Project = {
  slug: string;
  title: string;
  year: string;
  status: string;
  kind: string;
  role: string;
  summary: string;
  image: string;
  overview: string;
  problem: string;
  solution: string;
  architecture: string[];
  stack: string[];
  highlights: { title: string; body: string }[];
  github: string;
  demo: string;
};

export const projects: Project[] = [
  {
    slug: "align-music-platform",
    title: "Align Music Platform",
    year: "2025",
    status: "Live",
    kind: "Subscription Platform",
    role: "Full stack engineer",
    summary:
      "A subscription music platform with streaming playback, playlist curation, plan management and a creator-facing catalog dashboard.",
    image: "/images/project-align.jpg",
    overview:
      "Align is a subscription-based music platform: listeners browse a curated catalog, build playlists and stream continuously, while the team manages releases, artists and plans from an internal dashboard.",
    problem:
      "Streaming products fail on two boring things — playback that stutters when the tab changes, and a billing state that disagrees with what the user can actually access.",
    solution:
      "A single source of truth for entitlement, a persistent player that survives navigation, and a MongoDB catalog model designed around playlists rather than files.",
    architecture: [
      "React SPA with a persistent audio player kept outside the route tree",
      "Node.js and Express API with role-based access for listeners, artists and admins",
      "MongoDB schemas modelled around playlists, releases and subscription entitlements",
      "Signed, expiring media URLs so streams cannot be hot-linked",
      "Subscription lifecycle webhooks reconciled into a single entitlement record",
    ],
    stack: ["React", "Node.js", "Express", "MongoDB", "JWT Auth", "Subscriptions"],
    highlights: [
      {
        title: "Player that never resets",
        body: "Playback state lives above the router, so navigating the catalog never interrupts a track or re-buffers a stream.",
      },
      {
        title: "Entitlement as one record",
        body: "Plan changes, renewals and failures all resolve into a single computed access record — no scattered boolean flags.",
      },
      {
        title: "Catalog tooling",
        body: "Internal dashboard for uploads, artwork and release scheduling, so the team ships music without a developer in the loop.",
      },
    ],
    github: "https://github.com/rohitgautam",
    demo: "",
  },
  {
    slug: "multi-vendor-ecommerce-platform",
    title: "Multi Vendor Ecommerce Platform",
    year: "2024",
    status: "Shipped",
    kind: "Marketplace",
    role: "Full stack engineer",
    summary:
      "A marketplace where independent vendors run their own storefront, inventory and payouts inside one shared commerce system.",
    image: "/images/project-marketplace.jpg",
    overview:
      "A marketplace platform with three distinct surfaces — buyer storefront, vendor dashboard and platform admin — sharing one catalog, cart and order pipeline.",
    problem:
      "Multi-vendor commerce breaks on split orders: one cart, several sellers, separate fulfilment, separate money. Most single-tenant shop code cannot express that.",
    solution:
      "Orders modelled as a parent record with per-vendor sub-orders, each with its own state machine, fulfilment timeline and payout calculation.",
    architecture: [
      "React storefront with faceted search, cart persistence and guest checkout",
      "Node.js and Express API with vendor-scoped authorization on every route",
      "MongoDB aggregation pipelines for catalog facets and vendor analytics",
      "Parent order with per-vendor sub-orders, each running its own state machine",
      "Commission and payout ledger computed from settled sub-orders",
    ],
    stack: ["React", "Node.js", "Express", "MongoDB", "REST API", "Payments"],
    highlights: [
      {
        title: "Split orders done properly",
        body: "One checkout fans out into vendor sub-orders so fulfilment, refunds and payouts stay independent and auditable.",
      },
      {
        title: "Authorization by default",
        body: "Vendor scope is enforced in a shared middleware layer instead of being re-checked, and eventually forgotten, per route.",
      },
      {
        title: "Search that stays fast",
        body: "Facets and listings are served from tuned aggregation pipelines with indexed filters instead of ad-hoc queries.",
      },
    ],
    github: "https://github.com/rohitgautam",
    demo: "",
  },
  {
    slug: "by-the-degree",
    title: "By The Degree",
    year: "2025",
    status: "Live",
    kind: "Astrology Platform",
    role: "Full stack engineer",
    summary:
      "An astrology consultation platform with chart generation, bookings and an AI assistant that answers questions grounded in the user's own chart.",
    image: "/images/project-bythedegree.jpg",
    overview:
      "By The Degree pairs a traditional consultation business with software: users generate a chart, book a practitioner and get an AI assistant that can explain their reading in plain language.",
    problem:
      "Consultation businesses lose people between curiosity and booking. Generic chatbots make that worse by inventing details that contradict the actual chart.",
    solution:
      "Deterministic chart computation first, then an AI assistant constrained to that computed context, with booking as a first-class next step in every conversation.",
    architecture: [
      "React interface with an interactive chart wheel and a streaming assistant panel",
      "Node.js API computing chart data deterministically before any model call",
      "AI assistant prompted strictly from the computed chart context",
      "Booking and availability flow with reminders and rescheduling",
      "Response caching for repeated interpretation prompts to control cost",
    ],
    stack: ["React", "Node.js", "MongoDB", "AI Assistant", "Bookings"],
    highlights: [
      {
        title: "Grounded, not improvised",
        body: "The assistant only reasons over the deterministically computed chart, so answers stay consistent with what the user is looking at.",
      },
      {
        title: "Conversation to booking",
        body: "Every assistant thread can convert into a real appointment without the user re-entering anything.",
      },
      {
        title: "Cost-aware AI",
        body: "Cached interpretations and tight context windows keep per-conversation spend predictable.",
      },
    ],
    github: "https://github.com/rohitgautam",
    demo: "",
  },
  {
    slug: "portfolio-website",
    title: "Portfolio Website",
    year: "2026",
    status: "You're on it",
    kind: "Craft",
    role: "Design and build",
    summary:
      "This site: a hand-built neo-brutalist portfolio with a terminal preloader, scroll-driven motion and a server-rendered, accessible foundation.",
    image: "/images/project-portfolio.jpg",
    overview:
      "A deliberately handcrafted site — no template, no page builder. Built to demonstrate the same things I care about in product work: typography, motion discipline, accessibility and performance.",
    problem:
      "Most engineering portfolios read like a generated template. The work is real; the presentation says otherwise.",
    solution:
      "A custom neo-brutalist design system, a motion layer that respects reduced-motion, and route-level code splitting on a server-rendered React stack.",
    architecture: [
      "React 19 and TanStack Start with server rendering and file-based routing",
      "Custom OKLCH token system with a light and cozy dark theme",
      "Framer Motion layer for reveals, magnetic buttons and page transitions",
      "Terminal-style preloader with typed boot messages",
      "Route-level code splitting, lazy imagery and reserved media dimensions",
    ],
    stack: ["React 19", "TypeScript", "TanStack Start", "Tailwind CSS", "Framer Motion"],
    highlights: [
      {
        title: "Motion with a brake pedal",
        body: "Every animation degrades to a static state under prefers-reduced-motion — the whole system is opt-out in one place.",
      },
      {
        title: "No layout shift",
        body: "Media carries intrinsic dimensions and decorative layers are absolutely positioned, so nothing jumps after load.",
      },
      {
        title: "Keyboard complete",
        body: "Command palette, skip link, visible focus rings and semantic landmarks across every route.",
      },
    ],
    github: "https://github.com/rohitgautam",
    demo: "",
  },
];

export const experience = [
  {
    company: "Red Honey Group",
    role: "Software Engineer",
    period: "Present",
    location: "India",
    summary:
      "Client-facing product engineering across React applications, Shopify storefronts, WordPress builds and AI integrations.",
    achievements: [
      "Built React applications for client products and internal tooling",
      "Developed and customised Shopify stores, themes and app integrations",
      "Created WordPress websites with custom templates and content models",
      "Worked with AI integrations to automate content and support workflows",
      "Optimized website performance across Core Web Vitals and asset delivery",
    ],
    stack: ["React", "Node.js", "Shopify", "WordPress", "AI Integrations"],
  },
];

export const timeline = [
  /*
    {
      period: "Now",
      title: "Building a Shopify SaaS on the edge",
      detail:
        "Running an image optimization product on Cloudflare Workers — architecture, billing, merchant onboarding and support.",
    },
  */
  {
    period: "Present",
    title: "Software Engineer · Red Honey Group",
    detail:
      "Shipping React applications, Shopify storefronts, WordPress builds, AI integrations and performance work for clients.",
  },
  {
    period: "2025",
    title: "Align and By The Degree",
    detail:
      "Two full products taken from schema to launch: a subscription music platform and an AI-assisted astrology platform.",
  },
  {
    period: "2024",
    title: "Multi vendor commerce",
    detail:
      "Designed split-order and payout modelling for a marketplace serving independent vendors.",
  },
  {
    period: "Foundations",
    title: "Full stack in JavaScript",
    detail:
      "Went deep on React and Node.js, then on the cloud layer underneath — certifying in Oracle Cloud Infrastructure and OCI Generative AI.",
  },
];

export const currentlyBuilding = [
  /* { title: "Shopify SaaS", note: "Image optimization at the edge" }, */
  { title: "AI Automation", note: "Workflows that survive production" },
  { title: "Full Stack Applications", note: "React and Node.js end to end" },
  { title: "Cloudflare Edge Apps", note: "Workers, R2, caching, queues" },
  { title: "Enterprise Products", note: "Systems built to be handed over" },
];

export const certifications = [
  {
    title: "Oracle Cloud Infrastructure Foundations",
    org: "Oracle",
    detail: "Core cloud architecture, identity, networking and managed services on OCI.",
  },
  {
    title: "Oracle OCI Generative AI Professional",
    org: "Oracle",
    detail: "Applied generative AI: retrieval, embeddings, prompt design and deployment patterns.",
  },
];

export const stack = [
  {
    category: "Frontend",
    items: ["React.js", "TypeScript", "TanStack Router", "Tailwind CSS", "Framer Motion", "Vite"],
  },
  {
    category: "Backend",
    items: ["Node.js", "Express", "REST APIs", "Auth & RBAC", "Webhooks", "Zod"],
  },
  {
    category: "Commerce",
    items: ["Shopify Apps", "Shopify Themes", "Liquid", "Subscriptions", "Payments", "WordPress"],
  },
  {
    category: "Cloud",
    items: ["Cloudflare Workers", "R2", "Queues", "Oracle Cloud", "Edge caching", "CI/CD"],
  },
  {
    category: "Data",
    items: ["MongoDB", "Aggregation pipelines", "Postgres", "Redis", "Indexing", "Schema design"],
  },
  {
    category: "AI",
    items: ["AI automation", "Assistants", "Embeddings", "Prompt design", "Streaming UX", "Guardrails"],
  },
];

/** Flat tool list rendered as logo cards. Names must match keys in tech-icons. */
export const tools: { name: string; category: string }[] = [
  { name: "React", category: "Frontend" },
  { name: "TypeScript", category: "Language" },
  { name: "JavaScript", category: "Language" },
  { name: "Node.js", category: "Backend" },
  { name: "Express", category: "Backend" },
  { name: "REST API", category: "Backend" },
  { name: "MongoDB", category: "Database" },
  { name: "MySQL", category: "Database" },
  { name: "Cloudflare", category: "Edge" },
  { name: "Docker", category: "DevOps" },
  { name: "Git", category: "DevOps" },
  { name: "GitHub", category: "DevOps" },
  { name: "Vercel", category: "Hosting" },
  { name: "Tailwind CSS", category: "Styling" },
  { name: "GSAP", category: "Motion" },
  { name: "Framer Motion", category: "Motion" },
  { name: "Shopify", category: "Commerce" },
  { name: "WordPress", category: "Commerce" },
  { name: "Figma", category: "Design" },
  { name: "Adobe XD", category: "Design" },
];

export type SkillGroup = {
  category: string;
  tone: "yellow" | "peach" | "mint" | "lavender" | "sky";
  note: string;
  items: { name: string; level: string }[];
};

/** Grouped toolkit cards for the About page grid. */
export const skillGroups: SkillGroup[] = [
  {
    category: "Frontend",
    tone: "sky",
    note: "Interfaces people actually use",
    items: [
      { name: "React", level: "Daily" },
      { name: "TypeScript", level: "Daily" },
      { name: "JavaScript", level: "Daily" },
      { name: "Next.js", level: "Often" },
      { name: "Tailwind CSS", level: "Daily" },
      { name: "Framer Motion", level: "Often" },
      { name: "GSAP", level: "Often" },
      { name: "Vite", level: "Daily" },
    ],
  },
  {
    category: "Backend",
    tone: "yellow",
    note: "APIs that stay boring",
    items: [
      { name: "Node.js", level: "Daily" },
      { name: "Express", level: "Daily" },
      { name: "REST API", level: "Daily" },
      { name: "Authentication", level: "Often" },
      { name: "Webhooks", level: "Often" },
      { name: "JWT", level: "Often" },
    ],
  },
  {
    category: "Commerce",
    tone: "peach",
    note: "Stores and storefront apps",
    items: [
      { name: "Shopify", level: "Daily" },
      { name: "Shopify Apps", level: "Daily" },
      { name: "Shopify Themes", level: "Often" },
      { name: "Liquid", level: "Often" },
      { name: "WordPress", level: "Often" },
      { name: "WooCommerce", level: "Sometimes" },
    ],
  },
  {
    category: "Cloud & DevOps",
    tone: "lavender",
    note: "Edge-first delivery",
    items: [
      { name: "Cloudflare", level: "Daily" },
      { name: "Cloudflare R2", level: "Often" },
      { name: "Docker", level: "Often" },
      { name: "Git", level: "Daily" },
      { name: "GitHub", level: "Daily" },
      { name: "Vercel", level: "Often" },
      { name: "Oracle Cloud", level: "Certified" },
    ],
  },
  {
    category: "Databases",
    tone: "mint",
    note: "Schemas before code",
    items: [
      { name: "MongoDB", level: "Daily" },
      { name: "MySQL", level: "Often" },
      { name: "Redis", level: "Sometimes" },
      { name: "PostgreSQL", level: "Sometimes" },
      { name: "Prisma", level: "Sometimes" },
    ],
  },
  {
    category: "AI & Automation",
    tone: "yellow",
    note: "Assistants that do real work",
    items: [
      { name: "OpenAI", level: "Often" },
      { name: "LangChain", level: "Sometimes" },
      { name: "Vector Search", level: "Often" },
      { name: "RAG", level: "Often" },
      { name: "Prompt Engineering", level: "Daily" },
      { name: "AI Automation", level: "Daily" },
      { name: "Assistants", level: "Often" },
    ],
  },
];

/** Categorised technology matrix rendered as logo cards on the home page. */
export const techMatrix: { category: string; items: string[] }[] = [
  { category: "Frontend", items: ["React", "TypeScript", "JavaScript", "Tailwind CSS", "Vite"] },
  { category: "Backend", items: ["Node.js", "Express", "REST API"] },
  { category: "Database", items: ["MongoDB", "MySQL", "Redis"] },
  { category: "Cloud", items: ["Cloudflare", "Vercel", "Oracle Cloud", "DigitalOcean"] },
  { category: "Commerce", items: ["Shopify", "WordPress", "Liquid"] },
  { category: "DevOps", items: ["Docker", "Git", "GitHub"] },
  { category: "Design", items: ["Figma", "Canva"] },
  { category: "Animation", items: ["GSAP", "Framer Motion"] },
];

/** Availability shown in the footer. */
export const availability = [
  "Open to full-time opportunities",
  "Based in India",
  "Remote friendly",
];

/* --------------------------------------------------------------- resume --- */

/** Source of truth for the resume page — mirrors the latest CV exactly. */
export const resume = {
  name: "Rohit Gautam",
  headline: "Full Stack Software Engineer",
  location: "Noida, Uttar Pradesh, India",
  phone: "+91 79056 97407",
  summary:
    "Full-stack software engineer experienced in building production-grade applications using React.js, Node.js, Express, and cloud deployment workflows. Strong focus on scalable architecture, authentication systems, API performance, payment integrations, admin dashboards, and DevOps automation. Passionate about shipping clean, modular, maintainable code with a product-first mindset.",
  skills: [
    { category: "Frontend", items: ["React.js", "Redux", "RTK Query", "Tailwind CSS", "JavaScript (ES6+)"] },
    { category: "Backend", items: ["Node.js", "Express.js", "REST APIs"] },
    { category: "Authentication", items: ["JWT", "Refresh Tokens", "RBAC"] },
    { category: "Payments", items: ["Stripe Integration", "Webhooks"] },
    { category: "DevOps", items: ["DigitalOcean", "Nginx", "PM2", "Cloudflare"] },
    { category: "Databases", items: ["MySQL"] },
    { category: "Tools", items: ["Git", "GitHub", "Postman", "Vite", "Webpack"] },
    { category: "Platforms", items: ["Shopify (Liquid templates, storefronts)"] },
  ],
  experience: [
    {
      role: "Software Engineer",
      company: "Redhoney Consulting",
      period: "Nov 2024 – Present",
      achievements: [
        "Developed a large-scale Music Platform with modular architecture covering authentication, playlist management, admin dashboards, user personalization, media protection, and device-limit access rules.",
        "Built frontend interfaces using React.js, Redux, RTK Query, component-driven patterns, optimized API caching, and reusable admin controls.",
        "Designed backend services in Node.js + Express for secure login, refresh token workflows, RBAC, content visibility toggles, recommendations, and CRUD modules.",
        "Integrated Stripe for subscription plans, webhooks and billing automation.",
        "Deployed production backend on DigitalOcean (Ubuntu) with Nginx reverse proxy, PM2, SSL, Cloudflare caching, DNS, and server hardening.",
        "Built and maintained multiple Shopify storefronts, customizing Liquid templates, optimizing speed, and integrating third-party apps.",
        "Developed an internal Admin Panel with advanced CRUD, pagination, media controls, user/playlist management, and secure admin routes.",
      ],
    },
  ],
  projects: [
    {
      title: "Expressions – Full Stack Blog Platform",
      stack: [
        "React.js",
        "Redux",
        "Tailwind CSS",
        "React Hook Form",
        "React Router",
        "Appwrite",
        "TinyMCE",
      ],
      points: [
        "Engineered a full-stack blog platform using React.js + Appwrite, enabling secure authentication, content storage, and real-time data management.",
        "Integrated Appwrite Authentication with protected routes, improving login reliability and security.",
        "Designed clean post creation and editing workflows using the TinyMCE editor and React Hook Form for validated forms.",
        "Implemented Redux to manage global authentication state, user sessions, and CRUD operations efficiently.",
        "Built a responsive, mobile-first UI with Tailwind CSS, improving usability and readability across devices.",
      ],
    },
  ],
  certifications: [
    {
      title: "Oracle Cloud Infrastructure 2023 Certified Foundations Associate",
      org: "Oracle",
    },
  ],
};
