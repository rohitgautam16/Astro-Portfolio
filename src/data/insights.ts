import type { Tone } from "@/components/react/decor";

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

/** 70% technical articles · 20% engineering case studies · 10% personal notes. */
export type InsightKind = "article" | "case-note" | "note";

export const kindMeta: Record<InsightKind, { label: string; tone: Tone; share: string }> = {
  article: { label: "Technical Article", tone: "lavender", share: "70%" },
  "case-note": { label: "Engineering Case Study", tone: "mint", share: "20%" },
  note: { label: "Engineering Note", tone: "peach", share: "10%" },
};

export type Category =
  | "React"
  | "Node.js"
  | "JavaScript"
  | "TypeScript"
  | "Shopify"
  | "Cloudflare"
  | "AI"
  | "Performance"
  | "WordPress"
  | "System Design"
  | "Career"
  | "Architecture"
  | "Automation"
  | "DevOps";

export const categories: { name: Category; tone: Tone; glyph: string }[] = [
  { name: "React", tone: "lavender", glyph: "⚛" },
  { name: "Node.js", tone: "mint", glyph: "⬢" },
  { name: "JavaScript", tone: "yellow", glyph: "JS" },
  { name: "TypeScript", tone: "sky", glyph: "TS" },
  { name: "Shopify", tone: "mint", glyph: "🛍" },
  { name: "Cloudflare", tone: "peach", glyph: "☁" },
  { name: "AI", tone: "lavender", glyph: "✦" },
  { name: "Performance", tone: "yellow", glyph: "⚡" },
  { name: "WordPress", tone: "sky", glyph: "W" },
  { name: "System Design", tone: "peach", glyph: "◫" },
  { name: "Career", tone: "mint", glyph: "◎" },
  { name: "Architecture", tone: "lavender", glyph: "▤" },
  { name: "Automation", tone: "sky", glyph: "⟳" },
  { name: "DevOps", tone: "yellow", glyph: "⚙" },
];

export function categoryMeta(name: string) {
  return categories.find((c) => c.name === name) ?? { name, tone: "paper" as Tone, glyph: "•" };
}

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "list"; ordered?: boolean; items: string[] }
  | { type: "code"; lang: string; caption?: string; code: string }
  | { type: "callout"; tone: Tone; title: string; text: string }
  | { type: "quote"; text: string; cite?: string }
  | { type: "table"; head: string[]; rows: string[][] };

export type Insight = {
  slug: string;
  title: string;
  description: string;
  /** One-paragraph answer, written to be quotable by AI search engines. */
  quickAnswer: string;
  kind: InsightKind;
  category: Category;
  tags: string[];
  difficulty: Difficulty;
  readingTime: number;
  published: string;
  updated: string;
  featured?: boolean;
  views: number;
  body: Block[];
  checklist: string[];
  mistakes: string[];
  faq: { q: string; a: string }[];
  summary: string;
  related: string[];
  caseStudies?: string[];
  projects?: string[];
  resources?: string[];
};

export const insights: Insight[] = [
  {
    slug: "react-performance-checklist",
    title: "React Performance Checklist for Production Apps",
    description:
      "A practical, measurement-first checklist for making React apps fast: render cost, list virtualisation, bundle budgets, Suspense boundaries and the profiling workflow behind each fix.",
    quickAnswer:
      "Fix React performance in this order: measure with the Profiler and a real device, cut render work (stable props, memo on expensive subtrees, colocated state), then cut bytes (route-level code splitting, no barrel imports, tree-shakeable libraries), then cut waterfalls (parallel data loading and Suspense boundaries). Optimising before measuring is how teams add complexity without changing a single metric.",
    kind: "article",
    category: "React",
    tags: ["React", "Performance", "Profiling", "Bundle Size", "Suspense"],
    difficulty: "Advanced",
    readingTime: 11,
    published: "2026-03-14",
    updated: "2026-07-22",
    featured: true,
    views: 8420,
    body: [
      { type: "h2", text: "Why most React performance work fails" },
      {
        type: "p",
        text: "Nearly every slow React app I have inherited was already 'optimised'. It had memo everywhere, useCallback on handlers that never crossed a memo boundary, and a lazy-loaded modal that weighed 4 KB. What it did not have was a measurement. Performance work without a baseline is refactoring with extra steps.",
      },
      {
        type: "p",
        text: "The order below matters more than any single technique. Render cost, byte cost and waterfall cost are three different problems with three different tools, and applying the wrong tool is what makes optimisation feel unproductive.",
      },
      { type: "h2", text: "Step 1 - Measure before you touch anything" },
      {
        type: "list",
        items: [
          "Record a React Profiler session for the interaction that feels slow, not for the page in general.",
          "Throttle CPU 4× in Chrome DevTools - desktop numbers hide almost every real problem.",
          "Capture Core Web Vitals from real users (INP and LCP) rather than a single Lighthouse run.",
          "Write the baseline number down. If you cannot state the before value, you cannot claim an after.",
        ],
      },
      { type: "h2", text: "Step 2 - Cut render work" },
      {
        type: "p",
        text: "The cheapest render is the one that never happens. Before reaching for memo, move state down to the component that actually uses it - most 'the whole page re-renders' problems are a single piece of state living too high in the tree.",
      },
      {
        type: "code",
        lang: "tsx",
        caption: "Colocating state beats memoising the consequences of misplacing it",
        code: `// Before: typing in the filter re-renders the entire dashboard
function Dashboard({ rows }) {
  const [query, setQuery] = useState("");
  return (
    <>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <ExpensiveChart rows={rows} />
      <Table rows={rows.filter((r) => r.name.includes(query))} />
    </>
  );
}

// After: the query lives with the two components that need it
function Dashboard({ rows }) {
  return (
    <>
      <ExpensiveChart rows={rows} />
      <FilterableTable rows={rows} />
    </>
  );
}`,
      },
      {
        type: "callout",
        tone: "yellow",
        title: "memo is a contract, not a decoration",
        text: "React.memo only helps when every prop is referentially stable. One inline object or arrow function in the parent silently disables it - and you pay the comparison cost for nothing.",
      },
      { type: "h3", text: "Lists are where render cost actually lives" },
      {
        type: "p",
        text: "A table of 2,000 rows re-rendering on every keystroke is the single most common React performance bug in commerce and dashboard apps. Virtualise anything above roughly 100 rows, debounce the input that drives filtering, and keep the row component memoised with primitive props.",
      },
      { type: "h2", text: "Step 3 - Cut bytes" },
      {
        type: "table",
        head: ["Problem", "Symptom", "Fix"],
        rows: [
          ["Barrel imports", "Whole icon or util library in the bundle", "Import the exact module path"],
          ["Moment / heavy date libs", "70 KB+ for formatting a date", "Intl.DateTimeFormat or date-fns"],
          ["No route splitting", "One giant entry chunk", "Split at the route boundary first"],
          ["Duplicate deps", "Two React or two lodash copies", "Dedupe and pin in the lockfile"],
        ],
      },
      {
        type: "p",
        text: "Set a budget and enforce it in CI. A bundle analyser that nobody looks at after the first week does not prevent regressions; a build that fails at 200 KB gzipped does.",
      },
      { type: "h2", text: "Step 4 - Cut waterfalls" },
      {
        type: "p",
        text: "Once the app renders quickly, the remaining latency is usually sequential data fetching: the layout fetches the user, then the page fetches the list, then a card fetches its detail. Hoist requests to the route loader so they run in parallel, and put Suspense boundaries around genuinely optional content rather than around the whole page.",
      },
      {
        type: "code",
        lang: "tsx",
        caption: "Parallel loading in a TanStack Router loader",
        code: `export const Route = createFileRoute("/dashboard")({
  loader: async ({ context }) => {
    const [user, orders] = await Promise.all([
      context.queryClient.ensureQueryData(userQuery),
      context.queryClient.ensureQueryData(ordersQuery),
    ]);
    return { user, orders };
  },
});`,
      },
      { type: "h2", text: "Step 5 - Protect the win" },
      {
        type: "p",
        text: "Performance regresses by default, one innocent import at a time. Add a bundle-size check and a Lighthouse CI run to the pipeline, and record the interaction latency of your two most-used flows in a dashboard someone actually reads.",
      },
      {
        type: "quote",
        text: "Every optimisation you cannot re-measure in six months is a story, not an engineering result.",
      },
    ],
    checklist: [
      "Profiler session recorded for the specific slow interaction",
      "CPU throttled 4× while testing",
      "State colocated before any memoisation added",
      "Lists over ~100 rows virtualised, filter inputs debounced",
      "Route-level code splitting in place",
      "No barrel imports of large libraries",
      "Route data fetched in parallel, not per-component",
      "Bundle-size budget enforced in CI",
      "INP and LCP tracked from real users",
    ],
    mistakes: [
      "Wrapping everything in memo/useCallback without a profiling baseline.",
      "Memoising a component while passing it a freshly created object each render.",
      "Code splitting tiny components instead of routes.",
      "Optimising a page nobody visits while the checkout stays slow.",
      "Reporting a Lighthouse score from a fast laptop as the user experience.",
    ],
    faq: [
      {
        q: "Should I use React.memo everywhere?",
        a: "No. memo adds a props comparison on every render and only pays off for expensive subtrees with stable props. Apply it after profiling identifies a component that renders often and costs real milliseconds.",
      },
      {
        q: "Does the React Compiler make manual memoisation obsolete?",
        a: "It removes most of the mechanical useMemo and useCallback work, but it cannot fix architectural problems: state placed too high, unvirtualised lists, oversized bundles or sequential data fetching all remain your responsibility.",
      },
      {
        q: "What is a good bundle size for a React app?",
        a: "Aim for under 200 KB gzipped of JavaScript on the initial route for a content-heavy site, and under 350 KB for an application shell. The exact figure matters less than having a budget enforced in CI.",
      },
      {
        q: "Which metric should I optimise first?",
        a: "LCP for landing and marketing pages, INP for applications. Both correlate with revenue far more reliably than a composite Lighthouse score.",
      },
    ],
    summary:
      "Measure the specific slow interaction, reduce render work by colocating state and virtualising lists, reduce bytes with route splitting and honest imports, remove data waterfalls by loading in parallel, then lock the result in with budgets in CI.",
    related: ["javascript-memory-leaks-in-spas", "image-optimization-at-the-edge", "typescript-patterns-for-large-frontends"],
    caseStudies: ["portfolio-v2"],
    projects: ["align-music-platform"],
    resources: ["performance-optimization-checklist", "react-boilerplate"],
  },
  {
    slug: "node-api-architecture-that-scales",
    title: "Node.js API Architecture That Actually Scales",
    description:
      "How to structure a Node.js and Express API so it survives growth: layered boundaries, validation at the edge, idempotent writes, background work and the observability you need before things break.",
    quickAnswer:
      "A Node.js API scales when the boundaries are explicit: HTTP layer only parses and validates, a service layer owns business rules, and a data layer owns persistence. Add schema validation at the edge, idempotency keys on writes, a real queue for slow work, and structured logs with a request ID. Framework choice matters far less than these four things.",
    kind: "article",
    category: "Node.js",
    tags: ["Node.js", "Express", "Architecture", "MongoDB", "Queues"],
    difficulty: "Intermediate",
    readingTime: 10,
    published: "2026-02-08",
    updated: "2026-06-30",
    featured: true,
    views: 6310,
    body: [
      { type: "h2", text: "The failure mode of a growing Express app" },
      {
        type: "p",
        text: "Node APIs rarely collapse. They erode. A route handler picks up a database call, then a Stripe call, then an email, then a conditional for one enterprise customer. Two years later nobody can change the checkout endpoint without a war room.",
      },
      { type: "h2", text: "Three layers, one direction" },
      {
        type: "list",
        ordered: true,
        items: [
          "Transport (routes): parse the request, validate it, call one service function, map the result to a status code. No business logic.",
          "Service: the actual rules. Pure-ish functions that take typed input and return typed output, unaware of HTTP.",
          "Data: repositories that own queries and schemas. The service never writes a raw query inline.",
        ],
      },
      {
        type: "code",
        lang: "ts",
        caption: "A route handler should be boring",
        code: `router.post("/orders", async (req, res, next) => {
  try {
    const input = createOrderSchema.parse(req.body);
    const order = await orders.create(input, { userId: req.user.id });
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
});`,
      },
      {
        type: "callout",
        tone: "mint",
        title: "Rule of thumb",
        text: "If you cannot call your business logic from a script, a cron job and a test without spinning up Express, the logic is in the wrong layer.",
      },
      { type: "h2", text: "Validate at the edge, trust inside" },
      {
        type: "p",
        text: "Parse every request body, query string and webhook payload with a schema at the boundary. Inside the service layer you should never write a defensive typeof check again - the type is the guarantee.",
      },
      { type: "h2", text: "Make writes idempotent" },
      {
        type: "p",
        text: "Mobile networks retry. Users double-click. Payment providers deliver webhooks more than once. Every state-changing endpoint needs an idempotency key stored with the result, so a repeat of the same request returns the original response instead of creating a second order.",
      },
      {
        type: "code",
        lang: "ts",
        code: `const existing = await idempotency.get(key);
if (existing) return existing.response;

const result = await createOrder(input);
await idempotency.put(key, result, { ttlHours: 24 });
return result;`,
      },
      { type: "h2", text: "Get slow work off the request" },
      {
        type: "p",
        text: "Thumbnails, exports, emails, third-party syncs and AI calls do not belong in a request cycle. Push a job, return an id, and let the client poll or receive a socket update. A queue also gives you retries and a dead-letter list - two things a setTimeout never will.",
      },
      {
        type: "table",
        head: ["Work", "Where it belongs", "Why"],
        rows: [
          ["Auth, validation, reads", "Request cycle", "Latency-critical, cheap"],
          ["Email, webhooks out", "Queue", "Third-party latency and failure"],
          ["Media processing", "Queue or edge worker", "CPU-bound, blocks the loop"],
          ["Reports and exports", "Queue + object storage", "Unbounded runtime"],
        ],
      },
      { type: "h2", text: "Observability you need before the incident" },
      {
        type: "list",
        items: [
          "Structured JSON logs with a request id propagated through every layer.",
          "p95 and p99 latency per route - averages hide the failure.",
          "Error rate per route with the payload shape, never the payload itself.",
          "A health endpoint that checks dependencies, not one that returns 200 unconditionally.",
        ],
      },
      {
        type: "quote",
        text: "You do not need microservices. You need one service with honest boundaries.",
      },
    ],
    checklist: [
      "Routes contain no business logic",
      "Every input parsed by a schema at the boundary",
      "Services callable without HTTP",
      "Idempotency keys on all write endpoints",
      "Slow work moved to a queue with retries and a DLQ",
      "Structured logs carrying a request id",
      "p95/p99 latency tracked per route",
      "Graceful shutdown draining in-flight requests",
    ],
    mistakes: [
      "Business logic inside route handlers, making it untestable.",
      "Catching errors and returning 200 with an error body.",
      "Blocking the event loop with synchronous crypto or image work.",
      "Reaching for microservices to solve what is really a module boundary problem.",
      "Logging entire request bodies, including tokens and customer data.",
    ],
    faq: [
      {
        q: "Express, Fastify or Hono?",
        a: "All three scale fine at typical product volumes. Choose Fastify for throughput-sensitive JSON APIs, Hono for edge runtimes such as Cloudflare Workers, and Express when ecosystem familiarity matters more. Architecture decides your ceiling long before the framework does.",
      },
      {
        q: "When should I split into microservices?",
        a: "When separate teams need independent deployment cadences, or one workload has a fundamentally different scaling profile. Splitting for tidiness converts function calls into network calls you now have to retry, trace and version.",
      },
      {
        q: "Do I need a queue for a small app?",
        a: "If any request can take longer than a second because of third-party work, yes. A single Redis-backed queue is far cheaper than debugging timeouts and duplicated side effects in production.",
      },
    ],
    summary:
      "Keep transport, service and data layers separate, validate everything at the boundary, make writes idempotent, move slow work to a queue, and instrument per-route latency and errors before you need them.",
    related: ["react-performance-checklist", "designing-ai-features-that-dont-break", "scaling-a-multi-vendor-marketplace-catalog"],
    caseStudies: ["align", "multi-vendor-ecommerce"],
    projects: ["align-music-platform"],
    resources: ["node-starter-template", "deployment-checklist"],
  },
  {
    slug: "shopify-app-on-cloudflare-workers",
    title: "Building a Shopify App on Cloudflare Workers",
    description:
      "An edge-first architecture for Shopify apps: OAuth on Workers, HMAC-verified webhooks, session storage without a Postgres bill, and the constraints you need to design around.",
    quickAnswer:
      "You can run a production Shopify app entirely on Cloudflare Workers: handle OAuth and App Bridge session tokens in a Worker, verify every webhook with an HMAC timing-safe comparison, store shop sessions in KV or D1, and move heavy media work to Queues. The main constraints are CPU time per request and the absence of Node-native binaries, which is why long tasks must be queued rather than inlined.",
    kind: "article",
    category: "Shopify",
    tags: ["Shopify", "Cloudflare", "Workers", "OAuth", "Webhooks"],
    difficulty: "Advanced",
    readingTime: 12,
    published: "2026-01-19",
    updated: "2026-07-05",
    featured: true,
    views: 5240,
    body: [
      { type: "h2", text: "Why the edge suits Shopify apps" },
      {
        type: "p",
        text: "A Shopify app is mostly small, bursty, globally distributed traffic: embedded admin loads, webhook deliveries and storefront asset requests. That is a poor fit for an always-on container in one region and a very good fit for a Worker that runs next to the merchant.",
      },
      { type: "h2", text: "OAuth without a server" },
      {
        type: "list",
        ordered: true,
        items: [
          "Merchant hits /auth?shop=store.myshopify.com - the Worker validates the shop domain against a strict pattern.",
          "Redirect to Shopify with a signed state stored in KV with a short TTL.",
          "Shopify calls back; the Worker verifies HMAC and state, then exchanges the code for an offline token.",
          "Persist the token per shop, keyed by shop domain, and redirect into the embedded admin.",
        ],
      },
      {
        type: "callout",
        tone: "peach",
        title: "Never trust the shop parameter",
        text: "Validate it against /^[a-zA-Z0-9][a-zA-Z0-9-]*\\.myshopify\\.com$/ before it reaches any storage or fetch call. It is the most commonly abused input in the Shopify ecosystem.",
      },
      { type: "h2", text: "Webhooks: verify first, parse second" },
      {
        type: "code",
        lang: "ts",
        caption: "HMAC verification on the raw body, before JSON.parse",
        code: `const raw = await request.text();
const digest = await crypto.subtle.sign(
  "HMAC",
  await hmacKey(env.SHOPIFY_API_SECRET),
  new TextEncoder().encode(raw),
);
const expected = btoa(String.fromCharCode(...new Uint8Array(digest)));
const given = request.headers.get("x-shopify-hmac-sha256") ?? "";

if (!timingSafeEqual(expected, given)) {
  return new Response("Invalid signature", { status: 401 });
}
const payload = JSON.parse(raw);`,
      },
      {
        type: "p",
        text: "Respond 200 fast and do the work in a queue. Shopify retries aggressively on slow responses, and a webhook handler that also resizes images will eventually create duplicate work.",
      },
      { type: "h2", text: "Where state lives" },
      {
        type: "table",
        head: ["Data", "Store", "Reason"],
        rows: [
          ["Shop sessions and tokens", "KV or D1", "Read-heavy, tiny, per-shop"],
          ["Job state and usage counters", "D1 or Durable Objects", "Needs transactions or coordination"],
          ["Optimised images", "R2", "No egress fees, cache-friendly"],
          ["Rate limits per shop", "Durable Object", "Single point of serialisation"],
        ],
      },
      { type: "h2", text: "Constraints to design around" },
      {
        type: "list",
        items: [
          "No native Node binaries - sharp, canvas and child_process are unavailable; use WASM or a queue consumer.",
          "CPU time per request is limited; long loops belong in Queues, not handlers.",
          "Read environment inside the handler, never at module scope.",
          "Everything must be bundled at build time - no runtime module resolution.",
        ],
      },
      { type: "h2", text: "Billing and mandatory webhooks" },
      {
        type: "p",
        text: "Implement the GDPR webhooks on day one - customers/redact, shop/redact and customers/data_request - because app review will reject you without them. Reconcile subscription state from Shopify's billing API on every admin load rather than trusting a locally cached flag.",
      },
    ],
    checklist: [
      "Shop domain validated with a strict regex on every entry point",
      "OAuth state stored server-side with a TTL",
      "HMAC verified on the raw body before parsing",
      "Webhook handlers return 200 in under a second and enqueue work",
      "Sessions in KV/D1, media in R2",
      "Mandatory GDPR webhooks implemented",
      "Billing state reconciled from Shopify, not cached locally",
      "No Node-only dependencies in the Worker bundle",
    ],
    mistakes: [
      "Parsing the webhook body before verifying its signature.",
      "Doing image or export work inside the webhook handler.",
      "Storing access tokens in a client-readable cookie or in the embedded frame.",
      "Reading process.env at module scope, which is undefined on Workers.",
      "Assuming an npm package works at the edge because it installs cleanly.",
    ],
    faq: [
      {
        q: "Can a Shopify app run fully on Cloudflare Workers?",
        a: "Yes. OAuth, embedded admin rendering, GraphQL Admin API calls, webhooks and billing all work on Workers. Heavy or long-running work moves to Queues with an R2 bucket for output.",
      },
      {
        q: "KV or D1 for shop sessions?",
        a: "KV for pure key-value reads at very high volume with eventual consistency; D1 when you need relational queries, joins or transactional updates such as usage metering.",
      },
      {
        q: "How do I process images without sharp?",
        a: "Use Cloudflare Images or a WASM codec inside a queue consumer. Native modules cannot be bundled into a Worker.",
      },
    ],
    summary:
      "Verify everything, keep handlers short, store sessions in KV or D1, push media and long work into Queues plus R2, and design around Worker CPU and bundling constraints from the first commit.",
    related: ["image-optimization-at-the-edge", "node-api-architecture-that-scales", "cutting-shopify-theme-lcp-in-half"],
    caseStudies: ["shopify-image-optimization-saas"],
    projects: ["shopify-image-optimization-app"],
    resources: ["shopify-development-checklist", "deployment-checklist"],
  },
  {
    slug: "typescript-patterns-for-large-frontends",
    title: "TypeScript Patterns That Hold Up in Large Frontends",
    description:
      "Discriminated unions, branded types, schema-derived types and the small set of TypeScript patterns that keep a growing React codebase honest without turning it into type golf.",
    quickAnswer:
      "The TypeScript patterns worth adopting in a large frontend are: discriminated unions for UI state, types derived from runtime schemas so validation and types cannot drift, branded types for identifiers, and strict compiler flags including noUncheckedIndexedAccess. Avoid clever conditional types in application code - they cost more in comprehension than they save in bugs.",
    kind: "article",
    category: "TypeScript",
    tags: ["TypeScript", "React", "Zod", "Types", "DX"],
    difficulty: "Intermediate",
    readingTime: 9,
    published: "2026-04-02",
    updated: "2026-07-11",
    views: 4180,
    body: [
      { type: "h2", text: "Model states, not booleans" },
      {
        type: "p",
        text: "Four booleans describe sixteen states, twelve of which are impossible. A discriminated union describes exactly the states that exist, and the compiler stops you from rendering data that has not arrived.",
      },
      {
        type: "code",
        lang: "ts",
        code: `type Result<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; error: string }
  | { status: "ready"; data: T };

// Accessing result.data is only legal after narrowing to "ready"`,
      },
      { type: "h2", text: "Derive types from schemas" },
      {
        type: "p",
        text: "Hand-written interfaces next to hand-written validators drift within a sprint. Declare the schema once and infer the type - one source of truth for the runtime shape and the compile-time shape.",
      },
      {
        type: "code",
        lang: "ts",
        code: `const Order = z.object({
  id: z.string(),
  total: z.number().nonnegative(),
  status: z.enum(["pending", "paid", "refunded"]),
});

export type Order = z.infer<typeof Order>;`,
      },
      {
        type: "callout",
        tone: "sky",
        title: "Parse, don't cast",
        text: "Every `as` at an API boundary is a lie you have asked the compiler to believe. Parse the response instead and the rest of the app can trust its types.",
      },
      { type: "h2", text: "Brand your identifiers" },
      {
        type: "p",
        text: "UserId and OrderId are both strings, which means the compiler happily lets you pass one where the other belongs. Branding costs three lines and eliminates an entire class of bug that only shows up in production data.",
      },
      {
        type: "code",
        lang: "ts",
        code: `type Brand<T, B extends string> = T & { readonly __brand: B };
type UserId = Brand<string, "UserId">;
type OrderId = Brand<string, "OrderId">;

declare function cancelOrder(id: OrderId): Promise<void>;
// cancelOrder(userId) -> compile error`,
      },
      { type: "h2", text: "Compiler flags that pay for themselves" },
      {
        type: "table",
        head: ["Flag", "Catches"],
        rows: [
          ["strict", "The baseline; everything else assumes it"],
          ["noUncheckedIndexedAccess", "array[i] and record lookups that can be undefined"],
          ["exactOptionalPropertyTypes", "Passing undefined where a key should be absent"],
          ["verbatimModuleSyntax", "Type imports leaking into the runtime bundle"],
        ],
      },
      { type: "h2", text: "Where to stop" },
      {
        type: "p",
        text: "Deeply recursive conditional types belong in libraries, not in product code. If a teammate needs ten minutes to understand a type error, the type is now the cost centre.",
      },
      {
        type: "quote",
        text: "Types are documentation the compiler enforces. Write them for the next person, not for the type-level puzzle.",
      },
    ],
    checklist: [
      "strict mode plus noUncheckedIndexedAccess enabled",
      "UI state modelled as a discriminated union",
      "API types inferred from runtime schemas",
      "No `as` casts at network boundaries",
      "Identifiers branded where mix-ups are possible",
      "Shared types exported from one module, not duplicated",
      "Conditional-type gymnastics kept out of product code",
    ],
    mistakes: [
      "Using `any` to unblock a build and never returning to it.",
      "Duplicating a Zod schema and an interface for the same payload.",
      "Typing props as broad Records instead of explicit shapes.",
      "Enabling strict on a large codebase all at once instead of per-directory.",
      "Treating type errors as build noise rather than defects.",
    ],
    faq: [
      {
        q: "Are enums or union types better?",
        a: "Prefer string literal unions. They erase at compile time, work naturally with JSON, and avoid the runtime object that TypeScript enums generate.",
      },
      {
        q: "Should I type every component prop explicitly?",
        a: "Yes for exported and shared components; inference is fine for local ones. Explicit props are the contract other people read.",
      },
      {
        q: "How do I migrate a large JavaScript codebase?",
        a: "Enable checkJs with allowJs, convert leaf modules first, and turn on strict per directory. A big-bang migration stalls and gets reverted.",
      },
    ],
    summary:
      "Model impossible states out of existence, derive types from schemas, brand identifiers, turn on the strict flags, and stop before your types become a second language nobody on the team speaks.",
    related: ["react-performance-checklist", "node-api-architecture-that-scales", "javascript-memory-leaks-in-spas"],
    projects: ["align-music-platform"],
    resources: ["react-boilerplate", "node-starter-template"],
  },
  {
    slug: "image-optimization-at-the-edge",
    title: "Image Optimization at the Edge: A Practical Guide",
    description:
      "How to cut page weight with modern formats, correct sizing, edge caching and lazy loading - measured against LCP rather than a compression ratio.",
    quickAnswer:
      "Serve AVIF with a WebP fallback, generate responsive widths and let the browser pick with srcset and sizes, cache transformed variants at the edge keyed by format and width, mark the LCP image as eager with fetchpriority high, and lazy-load everything below the fold. Most sites lose more to oversized dimensions than to a suboptimal codec.",
    kind: "article",
    category: "Performance",
    tags: ["Performance", "Images", "Cloudflare", "LCP", "Caching"],
    difficulty: "Advanced",
    readingTime: 10,
    published: "2026-05-06",
    updated: "2026-07-18",
    featured: true,
    views: 7120,
    body: [
      { type: "h2", text: "The real problem is dimensions, not codecs" },
      {
        type: "p",
        text: "In store audits I run, the most common single fix is not switching to AVIF. It is that a 2400px product photo is being displayed in a 400px card. You can win 60% of the page weight before touching a compression setting.",
      },
      { type: "h2", text: "The pipeline" },
      {
        type: "list",
        ordered: true,
        items: [
          "Accept the original once and store it in object storage untouched.",
          "Derive variants on demand: width × format, cached at the edge.",
          "Serve via a URL that encodes the transform, so the cache key is deterministic.",
          "Purge by prefix when the source asset changes.",
        ],
      },
      {
        type: "code",
        lang: "html",
        caption: "Let the browser choose",
        code: `<img
  src="/cdn/product.jpg?w=800&f=auto"
  srcset="/cdn/product.jpg?w=400&f=auto 400w,
          /cdn/product.jpg?w=800&f=auto 800w,
          /cdn/product.jpg?w=1600&f=auto 1600w"
  sizes="(max-width: 768px) 100vw, 800px"
  width="800" height="1000"
  alt="Charcoal linen shirt photographed flat on a pale background"
  loading="lazy" decoding="async" />`,
      },
      {
        type: "callout",
        tone: "yellow",
        title: "Never lazy-load the LCP image",
        text: "The hero image should carry loading=\"eager\" and fetchpriority=\"high\". Lazy-loading it is one of the fastest ways to add half a second to LCP.",
      },
      { type: "h2", text: "Format decisions in one table" },
      {
        type: "table",
        head: ["Format", "Use for", "Notes"],
        rows: [
          ["AVIF", "Photography", "Best ratio, slower to encode - cache it"],
          ["WebP", "Fallback everywhere", "Universally supported today"],
          ["SVG", "Logos, icons, diagrams", "Sanitise any user-uploaded SVG"],
          ["JPEG", "Last-resort fallback", "Keep quality around 78"],
        ],
      },
      { type: "h2", text: "Always reserve the space" },
      {
        type: "p",
        text: "Width and height attributes, or an aspect-ratio, prevent layout shift. CLS is the cheapest Core Web Vital to fix and the one most often left broken.",
      },
      { type: "h2", text: "Measuring the result" },
      {
        type: "list",
        items: [
          "LCP element and its load time, from field data not a lab run.",
          "Total image bytes on the landing and product templates.",
          "Cache hit ratio on the transform endpoint - under 90% means your cache key is wrong.",
          "CLS after the fix, to confirm you did not trade one metric for another.",
        ],
      },
    ],
    checklist: [
      "Originals stored once, variants derived on demand",
      "Deterministic cache key of width + format + quality",
      "AVIF with WebP fallback via content negotiation",
      "srcset and sizes on every content image",
      "width/height or aspect-ratio always set",
      "LCP image eager with fetchpriority=high",
      "Everything below the fold lazy-loaded",
      "Edge cache hit ratio monitored above 90%",
      "Descriptive alt text on every meaningful image",
    ],
    mistakes: [
      "Lazy-loading the hero image.",
      "Shipping a 2400px source into a 400px slot.",
      "Cache keys that include a session or timestamp, destroying hit ratio.",
      "Empty alt text on informative images, hurting accessibility and image search.",
      "Re-encoding on every request instead of caching the variant.",
    ],
    faq: [
      {
        q: "Is AVIF always better than WebP?",
        a: "For photographs, usually 20–30% smaller at similar quality. For flat graphics the gap narrows and encode cost rises, so cache aggressively and keep WebP as the fallback.",
      },
      {
        q: "Does image optimisation affect SEO?",
        a: "Indirectly and strongly. LCP is a ranking signal, and descriptive alt text plus stable URLs drive image search traffic.",
      },
      {
        q: "Should I optimise images at build time or on demand?",
        a: "On demand with edge caching for user-generated or catalogue content; build time for a fixed set of marketing assets.",
      },
    ],
    summary:
      "Right-size first, serve modern formats through a deterministic cache key, reserve layout space, keep the LCP image eager, and validate with field LCP and cache hit ratio rather than a compression percentage.",
    related: ["cutting-shopify-theme-lcp-in-half", "react-performance-checklist", "shopify-app-on-cloudflare-workers"],
    caseStudies: ["shopify-image-optimization-saas"],
    projects: ["shopify-image-optimization-app"],
    resources: ["performance-optimization-checklist"],
  },
  {
    slug: "designing-ai-features-that-dont-break",
    title: "Designing AI Features That Don't Break in Production",
    description:
      "Prompt versioning, structured outputs, cost control, graceful degradation and evaluation - the engineering around a model call that decides whether the feature survives.",
    quickAnswer:
      "Treat a model call like any unreliable third-party dependency: force structured output with a schema and validate it, version prompts as code, set timeouts with a deterministic fallback, cap spend per user and per day, cache aggressively, and run an evaluation set in CI. The model is the easy part; the surrounding engineering decides whether the feature survives contact with users.",
    kind: "article",
    category: "AI",
    tags: ["AI", "LLM", "Architecture", "Reliability", "Cost"],
    difficulty: "Intermediate",
    readingTime: 11,
    published: "2026-06-11",
    updated: "2026-07-26",
    views: 5980,
    body: [
      { type: "h2", text: "A model call is a network call with opinions" },
      {
        type: "p",
        text: "It can be slow, it can fail, it can return something structurally different from yesterday, and it costs money per invocation. Every reliability pattern you already apply to third-party APIs applies here - plus a few new ones.",
      },
      { type: "h2", text: "Force structure, then validate it" },
      {
        type: "code",
        lang: "ts",
        code: `const Extracted = z.object({
  title: z.string().max(80),
  tags: z.array(z.string()).max(5),
  confidence: z.number().min(0).max(1),
});

const raw = await model.json({ schema: Extracted, prompt });
const parsed = Extracted.safeParse(raw);
if (!parsed.success) return fallbackFromHeuristics(input);`,
      },
      {
        type: "p",
        text: "Never render model output straight into the UI. Parse it, and always have a deterministic fallback path - a heuristic, a cached previous result, or an honest empty state.",
      },
      {
        type: "callout",
        tone: "lavender",
        title: "Prompts are source code",
        text: "Version them in the repo, review changes in pull requests, and record which version produced each stored output. Debugging a prompt you cannot reconstruct is guesswork.",
      },
      { type: "h2", text: "Cost control before launch, not after the invoice" },
      {
        type: "list",
        items: [
          "Per-user and per-day spend caps enforced server-side.",
          "Cache by a hash of the normalised input - repeat questions are free.",
          "Route simple tasks to a small model, escalate only on low confidence.",
          "Cap input length; a pasted PDF should be truncated, not billed.",
          "Log tokens per feature so you know which screen is expensive.",
        ],
      },
      { type: "h2", text: "Design the degraded experience first" },
      {
        type: "table",
        head: ["Failure", "User sees", "System does"],
        rows: [
          ["Timeout", "Deterministic fallback result", "Cancel, log, no retry storm"],
          ["Invalid schema", "Previous cached answer", "One repair attempt, then fall back"],
          ["Rate limit", "Queued with a clear ETA", "Backoff with jitter"],
          ["Budget exceeded", "Feature disabled with explanation", "Alert, keep the app usable"],
        ],
      },
      { type: "h2", text: "Evaluate like you test" },
      {
        type: "p",
        text: "Keep 30–50 real inputs with expected properties - not exact strings - and assert them in CI on every prompt or model change. Without an eval set, 'the new model is better' is a vibe, and regressions ship silently.",
      },
      { type: "h2", text: "Safety basics" },
      {
        type: "list",
        items: [
          "Treat all model output as untrusted content; never execute or interpolate it into SQL or shell.",
          "Strip secrets and PII from prompts before they leave your infrastructure.",
          "Label AI-generated content in the interface so users can calibrate trust.",
        ],
      },
    ],
    checklist: [
      "Structured output enforced by a schema and validated",
      "Deterministic fallback for every AI path",
      "Prompts versioned in the repository",
      "Timeouts with cancellation, no unbounded retries",
      "Per-user and per-day spend caps",
      "Response cache keyed by normalised input",
      "Evaluation set running in CI",
      "Model output never executed or trusted as code",
      "AI-generated content labelled in the UI",
    ],
    mistakes: [
      "Shipping free-text output straight into the interface.",
      "Storing prompts in a database nobody reviews.",
      "No spend cap, discovered via the monthly bill.",
      "Retrying failed calls without backoff, amplifying an outage.",
      "Using the largest model for tasks a small one handles perfectly.",
    ],
    faq: [
      {
        q: "How do I stop an LLM feature from becoming expensive?",
        a: "Cache by normalised input, cap input length, route easy cases to a smaller model, and enforce per-user daily budgets server-side. Caching alone often removes a third of the traffic.",
      },
      {
        q: "How do I test AI features?",
        a: "Build a fixed evaluation set of real inputs and assert structural properties - valid schema, required fields present, no forbidden content - rather than exact text matches.",
      },
      {
        q: "Should users know content is AI-generated?",
        a: "Yes. Labelling improves trust, sets the right expectations for errors, and increasingly matters for compliance.",
      },
    ],
    summary:
      "Constrain the output, validate it, version the prompt, budget the spend, cache the repeats, design the failure state deliberately and hold quality with an evaluation set in CI.",
    related: ["node-api-architecture-that-scales", "typescript-patterns-for-large-frontends", "react-performance-checklist"],
    caseStudies: ["by-the-degree"],
    projects: ["by-the-degree"],
    resources: ["prd-template", "deployment-checklist"],
  },
  {
    slug: "javascript-memory-leaks-in-spas",
    title: "Finding and Fixing JavaScript Memory Leaks in SPAs",
    description:
      "A repeatable workflow for diagnosing memory leaks in single-page applications with heap snapshots, plus the five leak sources responsible for most real cases.",
    quickAnswer:
      "Diagnose SPA memory leaks by taking three heap snapshots around a repeated navigation and comparing retained objects. In practice almost every leak comes from one of five sources: event listeners never removed, timers left running, detached DOM held by a closure, subscriptions without teardown, and unbounded caches or arrays.",
    kind: "article",
    category: "JavaScript",
    tags: ["JavaScript", "Debugging", "Memory", "React", "DevTools"],
    difficulty: "Intermediate",
    readingTime: 8,
    published: "2026-04-25",
    updated: "2026-06-15",
    views: 3660,
    body: [
      { type: "h2", text: "The symptom" },
      {
        type: "p",
        text: "The app is fine on load and sluggish after twenty minutes. Scrolling stutters, typing lags, and on mobile the tab eventually reloads itself. That is a leak, and guessing at the cause wastes days.",
      },
      { type: "h2", text: "The three-snapshot method" },
      {
        type: "list",
        ordered: true,
        items: [
          "Open Memory in DevTools, take snapshot 1 on a settled page.",
          "Perform the suspect interaction ten times - usually navigating in and out of a route.",
          "Force garbage collection, take snapshot 2, repeat the interaction, take snapshot 3.",
          "Compare 3 against 1 filtered to 'Objects allocated between snapshots'. Anything growing linearly with the repetition count is your leak.",
        ],
      },
      { type: "h2", text: "The five usual suspects" },
      {
        type: "code",
        lang: "tsx",
        caption: "Every subscription needs a teardown that actually runs",
        code: `useEffect(() => {
  const onScroll = () => setY(window.scrollY);
  window.addEventListener("scroll", onScroll, { passive: true });
  const id = setInterval(poll, 5000);
  const sub = socket.subscribe(handle);

  return () => {
    window.removeEventListener("scroll", onScroll);
    clearInterval(id);
    sub.unsubscribe();
  };
}, []);`,
      },
      {
        type: "table",
        head: ["Source", "Tell-tale sign in the snapshot"],
        rows: [
          ["Listeners not removed", "Growing count of the handler closure"],
          ["Timers still running", "Detached components still updating state"],
          ["Detached DOM", "'Detached HTMLDivElement' with a retaining closure"],
          ["Unbounded cache", "One Map or array growing forever"],
          ["Global registry", "Objects retained by window or a module singleton"],
        ],
      },
      {
        type: "callout",
        tone: "peach",
        title: "Beware the console",
        text: "Objects logged to the console are retained by DevTools. Always verify a suspected leak with the console cleared and, ideally, in a fresh tab.",
      },
      { type: "h2", text: "Prevention that costs nothing" },
      {
        type: "list",
        items: [
          "Use AbortController for fetches and listeners so one signal tears everything down.",
          "Bound every cache with a max size or TTL.",
          "Keep observers (Intersection, Resize, Mutation) disconnected on unmount.",
          "Avoid storing DOM nodes in module-level variables.",
        ],
      },
    ],
    checklist: [
      "Repeatable interaction identified before profiling",
      "Three heap snapshots compared with forced GC",
      "Every listener, timer and subscription has a teardown",
      "AbortController used for fetches and listeners",
      "Caches bounded by size or TTL",
      "Observers disconnected on unmount",
      "Verified with a clean console in a fresh tab",
    ],
    mistakes: [
      "Profiling with React StrictMode double-invocation and mistaking it for a leak.",
      "Only checking total heap size instead of retained object counts.",
      "Leaving console.log references to large objects during profiling.",
      "Adding listeners inside a render body rather than an effect.",
      "Treating a growing cache as a feature until the tab crashes.",
    ],
    faq: [
      {
        q: "Do memory leaks affect SEO or Core Web Vitals?",
        a: "They degrade INP badly on long sessions and low-memory devices, which is a field metric Google collects. A leak is a performance problem with a delay.",
      },
      {
        q: "Does React clean up automatically?",
        a: "React cleans up its own internals, not your side effects. Anything you subscribe to must be unsubscribed in the effect's return function.",
      },
      {
        q: "How much heap growth is normal?",
        a: "Some growth then a plateau is healthy. Linear growth proportional to the number of repeated interactions is a leak.",
      },
    ],
    summary:
      "Reproduce the interaction, compare heap snapshots, look for objects growing with repetition, and fix the teardown. Five sources cover almost every real case.",
    related: ["react-performance-checklist", "typescript-patterns-for-large-frontends", "image-optimization-at-the-edge"],
    projects: ["align-music-platform"],
    resources: ["performance-optimization-checklist"],
  },
  {
    slug: "scaling-a-multi-vendor-marketplace-catalog",
    title: "Scaling a Multi-Vendor Marketplace Catalog",
    description:
      "Engineering notes from a multi-vendor marketplace: modelling vendor-scoped inventory, keeping search fast as the catalog grows, and settling payouts without double-counting.",
    quickAnswer:
      "A multi-vendor catalog scales when vendor scoping lives in the data model rather than in query filters, search runs against a denormalised read model updated by events, and money is handled with an append-only ledger. The hardest part is not the product grid - it is inventory correctness and payout reconciliation across independent sellers.",
    kind: "case-note",
    category: "System Design",
    tags: ["System Design", "MongoDB", "Marketplace", "Search", "Payments"],
    difficulty: "Advanced",
    readingTime: 9,
    published: "2026-02-27",
    updated: "2026-05-30",
    views: 2940,
    body: [
      { type: "h2", text: "The context" },
      {
        type: "p",
        text: "A marketplace with independent sellers, each owning their own products, inventory, orders and payouts. Buyers see one storefront; behind it, every read and write has to be scoped correctly or a vendor sees somebody else's data.",
      },
      { type: "h2", text: "Vendor scope belongs in the model" },
      {
        type: "p",
        text: "Adding vendorId to every query is a policy enforced by discipline, and discipline fails at 3am. Scoping was moved into repository constructors: you obtain a vendor-bound repository, and there is no API to query outside that vendor.",
      },
      {
        type: "code",
        lang: "ts",
        code: `const repo = productRepo.forVendor(vendorId);
await repo.list({ status: "active" }); // vendorId cannot be omitted`,
      },
      { type: "h2", text: "Search is a different shape of data" },
      {
        type: "p",
        text: "The write model is normalised across vendors, products, variants and inventory. The read model for search is one flat document per listing, rebuilt from domain events. Faceted queries stopped touching four collections and browse latency became predictable.",
      },
      {
        type: "table",
        head: ["Concern", "Write model", "Read model"],
        rows: [
          ["Shape", "Normalised, per entity", "One flat listing document"],
          ["Consistency", "Strong", "Eventual, seconds"],
          ["Optimised for", "Correctness", "Facets and sorting"],
        ],
      },
      { type: "h2", text: "Inventory is a race condition with a UI" },
      {
        type: "p",
        text: "Two buyers, one unit. Reservations with a short TTL at add-to-cart, converted at payment confirmation and released on expiry, removed oversells without locking the catalog.",
      },
      {
        type: "callout",
        tone: "mint",
        title: "Money is append-only",
        text: "Never mutate a balance. Write ledger entries - sale, commission, refund, payout - and derive the balance. Reconciliation stops being archaeology.",
      },
      { type: "h2", text: "What I would change next time" },
      {
        type: "list",
        items: [
          "Introduce the event-driven read model on day one rather than after the catalog got slow.",
          "Make the ledger the first payments artefact, before any payout logic.",
          "Give vendors an activity log early - most support tickets were 'what happened to my listing'.",
        ],
      },
    ],
    checklist: [
      "Vendor scope enforced structurally, not by convention",
      "Separate read model for search and browse",
      "Inventory reservations with TTL instead of optimistic hope",
      "Append-only ledger for all money movement",
      "Per-vendor rate limits and abuse controls",
      "Vendor-visible activity log",
    ],
    mistakes: [
      "Filtering by vendorId manually in every query.",
      "Running faceted search directly against the normalised write model.",
      "Mutating balances instead of recording ledger entries.",
      "Letting one vendor's bulk import degrade the whole catalog.",
    ],
    faq: [
      {
        q: "SQL or MongoDB for a marketplace?",
        a: "Either works. Relational databases make ledgers and constraints easier; document databases make heterogeneous vendor catalogs easier. Decide based on which invariant you are most afraid of breaking.",
      },
      {
        q: "How do you prevent overselling?",
        a: "Short-lived reservations created at add-to-cart, converted on payment success and released on expiry, backed by an atomic decrement.",
      },
    ],
    summary:
      "Structural vendor scoping, an event-driven read model for search, TTL reservations for inventory and an append-only ledger for money - those four decisions carried the marketplace further than any query tuning.",
    related: ["node-api-architecture-that-scales", "react-performance-checklist"],
    caseStudies: ["multi-vendor-ecommerce"],
    projects: ["multi-vendor-ecommerce"],
    resources: ["prd-template", "agency-discovery-questionnaire"],
  },
  {
    slug: "cutting-shopify-theme-lcp-in-half",
    title: "Cutting a Shopify Theme's LCP in Half",
    description:
      "A measured teardown of a slow Shopify storefront: which apps cost the most, how the hero image was fixed, and what actually moved Largest Contentful Paint.",
    quickAnswer:
      "On the Shopify storefronts I have audited, LCP improvements come mostly from three changes: removing or deferring third-party app scripts that block the main thread, right-sizing and preloading the hero image, and cutting render-blocking CSS from the theme. Liquid rendering is almost never the bottleneck - the merchant's app stack usually is.",
    kind: "case-note",
    category: "Shopify",
    tags: ["Shopify", "Performance", "LCP", "Liquid", "Third-party scripts"],
    difficulty: "Intermediate",
    readingTime: 8,
    published: "2026-03-30",
    updated: "2026-06-08",
    views: 4510,
    body: [
      { type: "h2", text: "Starting point" },
      {
        type: "p",
        text: "A fashion storefront with a 4.1s field LCP on mobile and a bounce rate the owner blamed on 'the theme'. The theme was fine. Eighteen apps were not.",
      },
      { type: "h2", text: "Where the time actually went" },
      {
        type: "table",
        head: ["Source", "Main-thread cost", "Action"],
        rows: [
          ["Review app", "820 ms", "Deferred until scroll into view"],
          ["Popup/marketing app", "610 ms", "Removed, replaced with a theme section"],
          ["Chat widget", "540 ms", "Loaded on first interaction"],
          ["Hero image", "1.3 s render delay", "Right-sized, preloaded, eager"],
          ["Unused CSS", "180 ms", "Split critical vs deferred"],
        ],
      },
      { type: "h2", text: "The hero fix" },
      {
        type: "code",
        lang: "liquid",
        caption: "Preload the LCP candidate and stop lazy-loading it",
        code: `{% assign hero = section.settings.image %}
<link rel="preload" as="image"
      href="{{ hero | image_url: width: 1200 }}"
      imagesrcset="{{ hero | image_url: width: 600 }} 600w,
                   {{ hero | image_url: width: 1200 }} 1200w"
      imagesizes="100vw">

<img src="{{ hero | image_url: width: 1200 }}"
     width="1200" height="800"
     fetchpriority="high" loading="eager" decoding="async"
     alt="{{ hero.alt | escape }}">`,
      },
      {
        type: "callout",
        tone: "peach",
        title: "The uncomfortable conversation",
        text: "Most of the win required removing apps the merchant was paying for. Bring the numbers per app - 'this popup costs 0.6 seconds on every visit' is a much easier conversation than 'the site is slow'.",
      },
      { type: "h2", text: "Result" },
      {
        type: "list",
        items: [
          "Field LCP on mobile: 4.1s → 1.9s over four weeks of collected data.",
          "Total blocking time reduced by roughly 70%.",
          "Page weight on the landing template down 48%.",
          "No visual redesign; every change was infrastructural.",
        ],
      },
      { type: "h2", text: "Lessons" },
      {
        type: "list",
        ordered: true,
        items: [
          "Audit apps before touching Liquid.",
          "Measure in the field; lab scores hide the real app stack.",
          "Every third-party script needs an owner and a justification.",
          "Re-measure a month later - apps get reinstalled.",
        ],
      },
    ],
    checklist: [
      "Field data collected before and after, not just Lighthouse",
      "Per-app main-thread cost measured",
      "Non-critical apps deferred or removed",
      "Hero image preloaded, sized and eager",
      "Chat and popup widgets loaded on interaction",
      "Critical CSS inlined, rest deferred",
      "Re-audit scheduled after 30 days",
    ],
    mistakes: [
      "Rewriting the theme before auditing apps.",
      "Judging success by a lab Lighthouse score.",
      "Deferring the hero image along with everything else.",
      "Leaving unused app scripts installed after removing their sections.",
    ],
    faq: [
      {
        q: "Do Shopify apps really slow down a store?",
        a: "Yes - most inject render-blocking JavaScript on every page regardless of whether the feature is used there. In audits, apps typically account for the majority of total blocking time.",
      },
      {
        q: "What is a good LCP for a Shopify store?",
        a: "Under 2.5 seconds at the 75th percentile on mobile field data. Under 2 seconds is achievable on most themes with disciplined app usage.",
      },
    ],
    summary:
      "Audit the app stack, price each script in milliseconds, fix the hero image properly and defer everything that is not needed for first paint. The theme is rarely the problem.",
    related: ["image-optimization-at-the-edge", "shopify-app-on-cloudflare-workers", "react-performance-checklist"],
    caseStudies: ["shopify-image-optimization-saas"],
    projects: ["shopify-image-optimization-app"],
    resources: ["shopify-development-checklist", "performance-optimization-checklist"],
  },
  {
    slug: "what-i-look-for-in-engineering-work",
    title: "What I Look For in Engineering Work",
    description:
      "A short personal note on how I choose projects, what a good brief looks like, and the questions I ask before writing a line of code.",
    quickAnswer:
      "I look for a clear owner, a measurable outcome and an appetite for boring infrastructure. The best briefs state the problem and the constraint rather than the solution, and the best clients can describe what changes for their users when the work ships.",
    kind: "note",
    category: "Career",
    tags: ["Career", "Consulting", "Process"],
    difficulty: "Beginner",
    readingTime: 5,
    published: "2026-05-21",
    updated: "2026-05-21",
    views: 1880,
    body: [
      { type: "h2", text: "Three questions before anything else" },
      {
        type: "list",
        ordered: true,
        items: [
          "Who decides? A project with three equal decision-makers and no tiebreaker will stall regardless of engineering quality.",
          "What changes when this ships? If the answer is 'it will look modern', we have not found the problem yet.",
          "What are we willing to not do? Scope with no boundary is a deadline with no meaning.",
        ],
      },
      { type: "h2", text: "What a good brief looks like" },
      {
        type: "quote",
        text: "Checkout drops 30% of mobile users at the address step. We think it is the validation. Budget is fixed, timeline is six weeks, and we can ship weekly.",
        cite: "A brief I would take immediately",
      },
      {
        type: "p",
        text: "It names a metric, offers a hypothesis, states a constraint and allows iteration. Compare that with 'we need a redesign' and the difference in likely outcome is obvious.",
      },
      { type: "h2", text: "What I bring" },
      {
        type: "list",
        items: [
          "Working software weekly, not a reveal at the end.",
          "Decisions written down, including the ones we rejected and why.",
          "Boring, typed, observable systems - the interesting part should be the product.",
          "Honest estimates, including when the honest answer is 'do not build this'.",
        ],
      },
      {
        type: "callout",
        tone: "mint",
        title: "Currently",
        text: "Open to product engineering work involving React, Node.js, commerce and AI-assisted tooling.",
      },
    ],
    checklist: [
      "A single decision-maker identified",
      "A measurable outcome agreed up front",
      "Explicit out-of-scope list",
      "Weekly shipping cadence",
      "Written decision log",
    ],
    mistakes: [
      "Starting build before the success metric exists.",
      "Accepting a solution as the brief instead of the problem.",
      "Hiding bad news until the deadline.",
    ],
    faq: [
      {
        q: "What kind of projects do you take?",
        a: "Product engineering work across React and Node.js applications, Shopify apps and storefronts, and AI-assisted tooling - usually where performance, commerce and architecture overlap.",
      },
      {
        q: "Do you work with agencies?",
        a: "Yes, as an embedded engineer or technical lead, provided there is a single point of decision on the client side.",
      },
    ],
    summary:
      "Clear ownership, a measurable outcome, an explicit scope boundary and a weekly cadence. Those four things predict a project's success more reliably than the technology stack.",
    related: ["scaling-a-multi-vendor-marketplace-catalog", "node-api-architecture-that-scales"],
    resources: ["proposal-template", "agency-discovery-questionnaire", "prd-template"],
  },
];

export const insightsBySlug = new Map(insights.map((i) => [i.slug, i]));

export function getInsight(slug: string) {
  return insightsBySlug.get(slug);
}

export const usedCategories = Array.from(new Set(insights.map((i) => i.category)));
