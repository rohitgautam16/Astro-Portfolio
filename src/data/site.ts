export const flags = {
  /** Set to true to display a Coming Soon pre-launch landing page for the whole website on production */
  siteComingSoon: false,
  /** Set to true to show Coming Soon state on /blog while setting up publishing */
  blogComingSoon: true,
};

export const profile = {
  name: "Rohit Gautam",
  role: "Full Stack Software Engineer",

  location: "India · Open to Relocation · Remote",

  email: "connect@rohitgautam.site",

  github: "https://github.com/rohitgautam16",
  linkedin: "https://www.linkedin.com/in/rohitgautam24",
  x: "https://x.com/I_amrohitgautam",
  twitter: "https://x.com/I_amrohitgautam",

  scheduleUrl: "https://cal.com/rohit-gautam/30min",
  resumeUrl: "/resume/Rohit Gautam - Full Stack Software Engineer Resume.pdf",

  photo: "/media/images/portrait.webp",

  tagline:
    "I turn complex ideas into fast, scalable web products - from full-stack applications and commerce platforms to AI-powered workflows.",

  focus: [
    "Full-Stack Products",
    "React.js",
    "Node.js",
    "AI Automation",
    "Shopify",
    "Product Engineering",
  ],

  summary: [
    "From product idea to production, I build the systems behind digital businesses - intuitive interfaces, reliable APIs, authentication, data flows, payments and the infrastructure that keeps everything running smoothly.",

    "My strongest work sits at the intersection of product engineering and commerce: subscription platforms, multi-vendor systems, custom Shopify experiences and AI-powered applications designed around real business workflows.",

    "I bring a product-first mindset to engineering: understand the problem, choose the simplest architecture that can support it, and ship an experience that is fast, maintainable and built to grow.",
  ],
};

export const philosophy = [
  {
    no: "01",
    title: "Start with the problem",
    body:
      "I don't start by picking a framework. I start by understanding what needs to be solved, who it's for, and what a successful outcome looks like.",
  },
  {
    no: "02",
    title: "Build for the real world",
    body:
      "A product has to work beyond the happy path. I plan for failure, latency, and edge cases from the start-not as fixes after something breaks in production.",
  },
  {
    no: "03",
    title: "Keep complexity intentional",
    body:
      "I prefer simple systems that are easy to understand and evolve. Every abstraction, dependency, and architectural decision should earn its place.",
  },
  {
    no: "04",
    title: "Tools don't get to lead",
    body:
      "Whether it's a full-stack application, commerce experience, or AI workflow, I choose technology to make the product better-not simply because a new tool is available.",
  },
];

export interface ProjectHighlight {
  title: string;
  body: string;
}

export interface Project {
  slug: string;
  title: string;
  year: string;
  status: string;
  kind: string;
  role: string;
  summary: string;
  image: string;
  video?: string;
  overview: string;
  problem: string;
  solution: string;
  architecture: string[];
  stack: string[];
  highlights: ProjectHighlight[];
  github?: string;
  demo?: string;
}

export const projects: Project[] = [
  {
    slug: "music-streaming-platform",
    title: "Music Streaming Platform",
    year: "2025",
    status: "Live",
    kind: "Subscription Platform",
    role: "Full stack engineer",
    summary:
      "A production-grade subscription music platform built end-to-end - persistent audio playback, plan-aware access control, Stripe billing and an internal dashboard for catalog and artist management.",
    image: "/projects/images/project-align.webp",
    video: "/projects/videos/project-align.mp4",
    overview:
      "A subscription music platform serving listeners, artists and an admin team from a single MERN stack. Listeners stream a curated catalog and build playlists; the team manages releases, artist profiles and plan entitlements from a purpose-built internal dashboard - all without touching the codebase.",
    problem:
      "Streaming products fail on two predictable things: audio that resets when the user navigates, and a subscription state that quietly drifts out of sync with what the user can actually access.",
    solution:
      "Audio player state lifted above the router so navigation never interrupts playback. A single entitlement record computed from every Stripe billing event - upgrades, renewals, failures and cancellations all resolve into one authoritative source.",
    architecture: [
      "React SPA with persistent audio player mounted outside the route tree - queue and state survive navigation",
      "Node.js / Express REST API with JWT auth and RBAC across listener, artist and admin roles",
      "MongoDB schemas modelled around playlists, releases and computed subscription entitlements",
      "Stripe subscription webhooks processed into one authoritative entitlement record per user",
      "Signed, short-lived media URLs preventing hotlinking and unauthorized stream access",
      "Admin dashboard: artist CRUD, release scheduling, media uploads, plan management, user controls",
      "DigitalOcean deployment with Nginx reverse proxy, PM2, SSL and Cloudflare caching layer",
    ],
    stack: ["React", "Node.js", "Express", "MongoDB", "Stripe", "JWT", "DigitalOcean", "Redux"],
    highlights: [
      {
        title: "Playback that never resets",
        body: "The audio player mounts once, above the router. Navigating the catalog, switching playlists or opening account settings never re-buffers a track or loses queue state.",
      },
      {
        title: "One entitlement record, always correct",
        body: "Every Stripe event - upgrade, renewal, failure, cancellation - resolves into a single computed access record. No scattered boolean flags, no billing-state drift.",
      },
      {
        title: "Team-owned catalog tooling",
        body: "The internal dashboard covers artist uploads, artwork, release scheduling and RBAC-gated admin controls. The team ships music without a developer in the loop.",
      },
    ],
    github: "",
    demo: "",
  },
  {
    slug: "multi-vendor-marketplace",
    title: "Multi-Vendor Marketplace",
    year: "2024",
    status: "Shipped",
    kind: "Marketplace",
    role: "Full stack engineer",
    summary:
      "A three-surface marketplace platform - buyer storefront, vendor dashboard and platform admin - with split-order fulfilment, per-vendor payout ledger and faceted catalog search, all on one MERN API.",
    image: "/projects/images/project-marketplace.webp",
    video: "/projects/videos/project-marketplace.mp4",
    overview:
      "An end-to-end marketplace platform with three distinct portals sharing one API and one MongoDB cluster. Buyers browse, filter and checkout across multiple vendors in a single cart. Vendors manage their own products, orders and payouts. Platform admins control commission rules, disputes and cross-vendor analytics.",
    problem:
      "Multi-vendor commerce breaks predictably on split orders: one cart, multiple sellers, separate fulfilment timelines, separate money flows. Single-tenant e-commerce code has no model for any of that.",
    solution:
      "Orders designed as a parent record with per-vendor sub-orders, each running its own state machine. Authorization scoped to vendor identity at the middleware layer so no route can accidentally cross vendor boundaries.",
    architecture: [
      "React storefront with faceted search, persistent cart across sessions and guest checkout",
      "Node.js / Express API with vendor-scoped authorization enforced once in shared middleware",
      "Parent order record with per-vendor sub-orders, each with independent state machine and fulfilment flow",
      "Commission and payout ledger computed automatically from settled sub-orders",
      "MongoDB aggregation pipelines for catalog facets, search ranking and vendor analytics",
      "Vendor dashboard: product CRUD, inventory, order management, payout history and metrics",
      "Platform admin: commission configuration, dispute resolution, cross-vendor reporting",
    ],
    stack: ["React", "Node.js", "Express", "MongoDB", "REST API", "Stripe", "RBAC"],
    highlights: [
      {
        title: "Split orders that stay coherent",
        body: "One checkout fans out into per-vendor sub-orders. Fulfilment, refunds and payouts are completely independent per seller - no shared state, no cross-vendor bleed.",
      },
      {
        title: "Authorization that can't be forgotten",
        body: "Vendor identity scoping lives in shared middleware, applied once before any route handler runs. Every endpoint is vendor-safe by architecture, not by convention.",
      },
      {
        title: "Catalog at query speed",
        body: "Facets and listings run on tuned MongoDB aggregation pipelines with compound indexes. No in-memory filtering, no N+1 catalog reads at browse time.",
      },
    ],
    github: "",
    demo: "",
  },
  {
    slug: "ai-consultation-platform",
    title: "AI Consultation Platform",
    year: "2025",
    status: "Live",
    kind: "AI-Powered SaaS",
    role: "Full stack engineer",
    summary:
      "A full-stack consultation platform combining deterministic domain computation, practitioner bookings and a context-constrained AI assistant - built so the model can only answer from verified, computed data.",
    image: "/projects/images/project-bythedegree.webp",
    video: "/projects/videos/project-bythedegree.mp4",
    overview:
      "A niche consultation platform that pairs a booking business with product software. Users generate a personalised data report from a deterministic computation engine, book a practitioner, and interact with an AI assistant that explains the report in plain language - strictly within the bounds of the computed context, never improvising.",
    problem:
      "Consultation businesses lose users between initial curiosity and a booked session. Generic AI chatbots make it worse - they confidently hallucinate details that contradict the user's actual data, destroying trust before the first appointment.",
    solution:
      "Deterministic computation runs first and produces a structured context object. The AI assistant is then constrained entirely to that object - it cannot invent or extrapolate. Booking is surfaced as a first-class action inside every conversation thread.",
    architecture: [
      "React interface with an interactive data visualization panel and a streaming AI assistant",
      "Node.js API running all domain computation deterministically before any model call is made",
      "OpenAI assistant prompted strictly from the computed context object - freeform invention is blocked by design",
      "Booking and availability system with confirmation emails, reminders and rescheduling flows",
      "Response caching for repeated queries against the same computed context to control per-user cost",
      "MongoDB storing computed reports, booking records and assistant conversation threads",
    ],
    stack: ["React", "Node.js", "Express", "MongoDB", "OpenAI", "Stripe", "Booking System"],
    highlights: [
      {
        title: "Grounded, not improvised",
        body: "The assistant only reasons over the deterministically computed context object. Answers are always consistent with what the user sees - the model cannot invent data.",
      },
      {
        title: "Curiosity converts to bookings",
        body: "Every assistant conversation surfaces a booking action inline. The user moves from first question to confirmed appointment without re-entering a single detail.",
      },
      {
        title: "Predictable AI cost at scale",
        body: "Cached responses for repeated queries and tight, purpose-built context windows keep per-session model spend flat as the user base grows.",
      },
    ],
    github: "",
    demo: "",
  },
  {
    slug: "shopify-storefront-engineering",
    title: "Shopify Storefront Engineering",
    year: "2024–25",
    status: "Ongoing",
    kind: "Commerce Engineering",
    role: "Shopify engineer",
    summary:
      "End-to-end Shopify engineering across multiple live stores - custom Liquid themes, performance-tuned storefronts, metafield-driven sections, third-party integrations and multi-store architecture.",
    image: "/projects/images/project-shopify.webp",
    video: "/projects/videos/project-shopify.mp4",
    overview:
      "Worked across a portfolio of Shopify stores handling everything from ground-up theme builds and redesigns to integrating complex third-party apps, optimising Core Web Vitals and shipping custom storefront behaviour that the platform doesn't offer out of the box.",
    problem:
      "Shopify's default tooling stops where merchant requirements start. Custom UX patterns, performance at scale, conditional logic across metafields, and app integrations that play nicely with each other all need an engineer who understands both the platform and the product.",
    solution:
      "Built directly in the Shopify stack - Liquid, JS, CSS - with a clear separation between theme logic, section schema and client-side behaviour. Integrations are treated as dependencies, not afterthoughts, and every performance change is measured against real CWV data.",
    architecture: [
      "Custom Liquid theme development with schema-driven section architecture",
      "Metafield-powered dynamic content - product specs, variant logic, conditional display",
      "Storefront JS for custom cart drawer, live filters, sticky behaviour and animations",
      "Third-party app integrations: reviews, subscriptions, loyalty, upsell and bundles",
      "Multi-store setup with shared component patterns across international storefronts",
      "Core Web Vitals auditing and asset pipeline tuning - LCP, CLS and INP targets met",
    ],
    stack: ["Shopify", "Liquid", "JavaScript", "CSS", "Theme Architecture", "App Integrations"],
    highlights: [
      {
        title: "Performance as a requirement",
        body: "Every storefront shipped with a CWV audit. LCP under 2.5 s and zero layout shift from dynamic content - achieved through asset deferral, image sizing and render order discipline.",
      },
      {
        title: "Sections that configure, not hard-code",
        body: "Built section schemas so merchants control layout, content and logic from the Shopify editor without touching code - reducing developer dependency on routine changes.",
      },
      {
        title: "Integrations that don't fight each other",
        body: "Stacked review apps, subscription tools, upsell widgets and loyalty programs on the same storefront without event collision or layout breakage.",
      },
    ],
    github: "",
    demo: "",
  },
  {
    slug: "portfolio-website",
    title: "This Portfolio",
    year: "2026",
    status: "You're on it",
    kind: "Design & Engineering",
    role: "Design and build",
    summary:
      "A hand-built neo-brutalist portfolio with a terminal preloader, GSAP scroll-driven motion, OKLCH theming and a server-rendered Astro foundation - designed to demonstrate craft as much as content.",
    image: "/projects/images/project-portfolio.webp",
    video: "/projects/videos/project-portfolio.mp4",
    overview:
      "No template. No page builder. Built from a blank file - OKLCH design tokens, a soft neo-brutalist system, GSAP scroll animations and an Astro-rendered core. The same standards I apply to client products: first paint speed, zero layout shift, keyboard accessibility and motion that respects the user's system preference.",
    problem:
      "Most engineering portfolios are a list of GitHub repos dressed up with a CSS framework. The work is real; the surface signals otherwise.",
    solution:
      "A custom design system that applies to every element, a motion layer built on GSAP and scroll-driven APIs, and an Astro foundation that ships zero unnecessary JavaScript by default.",
    architecture: [
      "Astro with React islands - only interactive components ship JS to the browser",
      "Custom OKLCH token system with paper-light and cozy-dark themes",
      "GSAP ScrollTrigger for pinned sections, clip-path reveals and diagonal marquees",
      "Terminal-style preloader sequence before first paint",
      "Image dimensions reserved at build time - zero cumulative layout shift",
    ],
    stack: ["Astro", "React", "TypeScript", "GSAP", "Tailwind CSS", "OKLCH Tokens"],
    highlights: [
      {
        title: "Zero-JS by default",
        body: "Astro ships static HTML for every non-interactive section. React only hydrates where interaction is genuinely needed - the page loads fast by architecture, not optimization.",
      },
      {
        title: "Motion with a brake pedal",
        body: "Every GSAP animation degrades gracefully under prefers-reduced-motion. One global flag, not per-component conditionals scattered across the codebase.",
      },
      {
        title: "Design token discipline",
        body: "OKLCH-based color tokens, consistent spacing scale and a shared shadow system mean the neo-brutalist aesthetic holds at every breakpoint and in both themes.",
      },
    ],
    github: "",
    demo: "https://rohitgautam.site",
  },

];

export const experience = [
  {
    company: "Red Honey Group",
    role: "Software Engineer",
    period: "Nov 2024 – Present",
    location: "India",

    summary:
      "Product-focused software engineering across full-stack applications, commerce platforms, Shopify storefronts, and AI-powered digital experiences.",

    achievements: [
      "Built and shipped full-stack products with React.js, Node.js and Express, working across frontend architecture, APIs, authentication, data flows and production deployment.",

      "Developed a subscription-based music platform with authentication, playlists, user personalization, media protection, plan-based access control, Stripe billing and an internal administration system.",

      "Designed backend services with secure authentication, refresh-token workflows, RBAC, content visibility controls, recommendation flows and modular CRUD systems.",

      "Built and customized multiple Shopify storefronts, working with Liquid, custom storefront behaviour, third-party integrations and performance optimization.",

      "Developed and maintained internal admin tooling for content, users, playlists, media and operational workflows, with reusable controls, pagination and secure administrative routes.",

      "Handled production deployment and infrastructure workflows using DigitalOcean, Nginx, PM2, SSL and Cloudflare for caching, DNS and delivery.",

      "Contributed to AI-powered product experiences by integrating generative AI into application workflows and exploring practical automation use cases.",
    ],

    stack: [
      "React.js",
      "Node.js",
      "Express",
      "MongoDB",
      "Redux",
      "RTK Query",
      "Shopify",
      "Stripe",
      "Cloudflare",
      "DigitalOcean",
    ],
  },
];

export const timeline: {
  period: string;
  title: string;
  detail: string;
  projects?: { title: string; detail: string }[];
}[] = [
    {
      period: "Present",
      title: "Software Engineer · Red Honey Group",
      detail:
        "Building and shipping full-stack digital products across commerce, subscriptions, AI, Shopify, WordPress and modern web applications.",
      projects: [
        {
          title: "Multi-Vendor Marketplace",
          detail:
            "Designed and built complex commerce workflows for independent vendors, including split orders, vendor management and payout modelling.",
        },
        {
          title: "Subscription Platform",
          detail:
            "Took a subscription-based digital platform from product architecture through development and launch, covering core user flows and recurring access.",
        },
        {
          title: "AI-Powered Experience",
          detail:
            "Built an AI-assisted personalised platform, combining modern application development with generative AI capabilities and user-specific experiences.",
        },
      ],
    },
    {
      period: "Foundations",
      title: "Full-Stack JavaScript & Cloud",
      detail:
        "Built a strong foundation in React and Node.js, then expanded into cloud architecture and generative AI with Oracle Cloud Infrastructure and OCI Generative AI certifications.",
    },
  ];

export const currentlyBuilding = [
  {
    title: "AI Automation",
    note: "Turning repetitive business workflows into reliable software.",
  },
  {
    title: "Full-Stack Products",
    note: "Building end-to-end applications with React.js and Node.js.",
  },
  {
    title: "Shopify Products",
    note: "Exploring SaaS and tooling that solve real commerce problems.",
  },
  {
    title: "Cloud & Edge Engineering",
    note: "Learning and building with Cloudflare, caching, and modern deployment patterns.",
  },
];

export const certifications = [
  {
    title: "Oracle Cloud Infrastructure Foundations",
    org: "Oracle",
    detail:
      "Foundation in cloud infrastructure, core OCI services, networking, security, and cloud architecture fundamentals.",
  },
  {
    title: "Oracle OCI Generative AI Professional",
    org: "Oracle",
    detail:
      "Focused on generative AI architecture, foundation models, RAG, embeddings, semantic search, fine-tuning, inference, and AI security.",
  },
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
    note: "Interfaces built to feel fast, clear, and intentional",
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
    note: "APIs, authentication, and business logic behind the interface",
    items: [
      { name: "Node.js", level: "Daily" },
      { name: "Express", level: "Daily" },
      { name: "REST API", level: "Daily" },
      { name: "Authentication", level: "Often" },
      { name: "Webhooks", level: "Often" },
      { name: "JWT", level: "Often" },
      { name: "RBAC", level: "Working" },
    ],
  },
  {
    category: "Commerce",
    tone: "peach",
    note: "Digital commerce experiences and custom storefronts",
    items: [
      { name: "Shopify", level: "Daily" },
      { name: "Shopify Apps", level: "Daily" },
      { name: "Shopify Themes", level: "Often" },
      { name: "Liquid", level: "Often" },
      { name: "Subscriptions", level: "Working" },
      { name: "Payments", level: "Working" },
    ],
  },
  {
    category: "Cloud & DevOps",
    tone: "lavender",
    note: "Getting products from code to a reliable production environment",
    items: [
      { name: "Cloudflare", level: "Daily" },
      { name: "Cloudflare R2", level: "Often" },
      { name: "Docker", level: "Often" },
      { name: "Git", level: "Daily" },
      { name: "GitHub", level: "Daily" },
      { name: "Vercel", level: "Often" },
      { name: "DigitalOcean", level: "Working" },
      { name: "Oracle Cloud", level: "Certified" },
    ],
  },
  {
    category: "Databases",
    tone: "mint",
    note: "Practical data modelling for real product workflows",
    items: [
      { name: "MongoDB", level: "Daily" },
      { name: "MySQL", level: "Often" },
      { name: "Redis", level: "Sometimes" },
      { name: "PostgreSQL", level: "Sometimes" },
      { name: "Schema Design", level: "Working" },
    ],
  },
  {
    category: "AI & Automation",
    tone: "yellow",
    note: "Using AI where it creates a meaningful product advantage",
    items: [
      { name: "OpenAI", level: "Often" },
      // { name: "LangChain", level: "Sometimes" },
      // { name: "Vector Search", level: "Often" },
      // { name: "RAG", level: "Often" },
      { name: "Prompt Engineering", level: "Daily" },
      { name: "AI Automation", level: "Daily" },
      { name: "Assistants", level: "Often" },
    ],
  },
];

/** Categorised technology matrix rendered as logo cards on the home page. */
export const techMatrix: { category: string; items: string[] }[] = [
  { category: "Frontend", items: ["React", "TypeScript", "JavaScript", "Tailwind CSS", "Vite"] },
  { category: "Backend", items: ["Node.js", "Express", "REST API", "PostgreSQL"] },
  { category: "Database", items: ["MongoDB", "MySQL", "Redis"] },
  { category: "Cloud", items: ["Cloudflare", "Vercel", "Docker", "DigitalOcean"] },
  { category: "Commerce", items: ["Shopify", "Shopify Apps", "Liquid"] },
  { category: "AI & Automation", items: ["OpenAI", "Prompt Engineering", "Assistants", "AI Automation"] },
  { category: "DevOps", items: ["Docker", "Git", "GitHub", "Nginx", "CI/CD"] },
  { category: "Design & Animation", items: ["Figma", "Canva", "GSAP", "Framer Motion"] },
];

/** Availability shown in the footer. */
export const availability = [
  "Open to full-time opportunities",
  "Based in India",
  "Remote friendly",
];

/* --------------------------------------------------------------- resume --- */

/** Source of truth for the resume page - mirrors the latest CV exactly. */
export const resume = {
  name: "Rohit Gautam",
  headline: "Full Stack Developer",
  location: "Noida, Uttar Pradesh, India",
  phone: "+91 79056 97407",
  email: "rohit.gautam2403@gmail.com",

  summary:
    "Full-stack developer experienced in building production-grade applications using React.js, Node.js, Express, and cloud deployment workflows. Strong focus on scalable architecture, authentication systems, API performance, payment integrations, admin dashboards, and DevOps automation. Passionate about shipping clean, modular, maintainable code with a product-first mindset.",

  skills: [
    {
      category: "Frontend",
      items: [
        "React.js",
        "Redux",
        "RTK Query",
        "Tailwind CSS",
        "JavaScript (ES6+)",
      ],
    },
    {
      category: "Backend",
      items: [
        "Node.js",
        "Express.js",
        "REST APIs",
      ],
    },
    {
      category: "Authentication",
      items: [
        "JWT",
        "Refresh Tokens",
        "RBAC",
      ],
    },
    {
      category: "Payments",
      items: [
        "Stripe Integration",
        "Webhooks",
      ],
    },
    {
      category: "DevOps",
      items: [
        "DigitalOcean",
        "Nginx",
        "PM2",
        "Cloudflare",
      ],
    },
    {
      category: "Databases",
      items: [
        "MySQL",
      ],
    },
    {
      category: "Tools",
      items: [
        "Git",
        "GitHub",
        "Postman",
        "Vite",
        "Webpack",
      ],
    },
    {
      category: "Platforms",
      items: [
        "Shopify",
        "Liquid Templates",
        "Shopify Storefronts",
      ],
    },
  ],

  experience: [
    {
      role: "Full Stack Developer",
      company: "Redhoney Consulting",
      period: "Nov 2024 – Present",
      achievements: [
        "Developed a large-scale Music Platform with modular architecture covering authentication, playlist management, admin dashboards, user personalization, media protection, and device-limit access rules.",

        "Built frontend interfaces using React.js, Redux, RTK Query, component-driven patterns, optimized API caching, and reusable admin controls.",

        "Designed backend services in Node.js + Express for secure login, refresh token workflows, RBAC, content visibility toggles, recommendations, and CRUD modules.",

        "Integrated Stripe for subscription plans, webhooks, and billing automation.",

        "Deployed production backend on DigitalOcean (Ubuntu) with Nginx reverse proxy, PM2, SSL, Cloudflare caching, DNS, and server hardening.",

        "Built and maintained multiple Shopify storefronts, customizing Liquid templates, optimizing speed, and integrating third-party apps.",

        "Developed an internal Admin Panel with advanced CRUD, pagination, media controls, user/playlist management, and secure admin routes.",
      ],
    },
  ],

  projects: [
    {
      title: "Expressions – Sentiment-Based Confession Platform",

      stack: [
        "React.js",
        "Redux",
        "Node.js",
        "Express.js",
        "MySQL",
        "Tailwind CSS",
        "Framer Motion",
        "GSAP",
      ],

      points: [
        "Re-engineered the backend from Appwrite to Node.js + Express.js, designing a modular REST API architecture for authentication, confessions, moods, user profiles, reactions, and content management.",

        "Implemented JWT-based authentication, protected routes, request validation, centralized error handling, and role-based access controls, improving API security and maintainability.",

        "Designed relational MySQL schemas and CRUD services for users, confessions, moods, interactions, and subscriptions, with indexed queries and reusable service/controller layers.",

        "Optimized frontend state management using Redux, separating authentication, user, confession, and application state while integrating API-driven data flows with reusable React components.",

        "Engineered an interactive frontend using Framer Motion and GSAP, implementing reusable animations, page transitions, micro-interactions, and responsive layouts with Tailwind CSS.",
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
