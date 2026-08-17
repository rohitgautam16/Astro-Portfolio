import { useState, type FormEvent } from "react";
import { Sparkles, ArrowRight, Send, Check, Loader2 } from "lucide-react";
import { Reveal } from "@/components/react/motion";

const teaserTopics = [
  "React 19 & Frontend Architecture",
  "Edge Caching with Cloudflare Workers",
  "High-Throughput E-Commerce Systems",
  "Deterministic Guardrails for Production AI",
  "Web Performance & LCP Optimization",
];

export function BlogComingSoon() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "blog-coming-soon" }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Subscription failed");
      }

      setStatus("success");
    } catch (err: any) {
      console.error("[Blog Coming Soon] Error:", err);
      setStatus("error");
      setErrorMessage(err.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="container-page pb-28">
      {/* Hero Banner Card */}
      <Reveal>
        <div className="relative overflow-hidden rounded-[32px] border-[3px] border-hairline bg-lavender p-8 shadow-hard-lg md:p-14">
          <span
            aria-hidden
            className="tape-strip absolute -top-3 left-12 h-6 w-28 -rotate-6 rounded-[2px]"
          />

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 rounded-full border-[2px] border-hairline bg-card px-3.5 py-1 text-xs font-extrabold uppercase tracking-widest shadow-hard-sm">
              <Sparkles className="size-3.5 text-foreground" />
              Writing & Insights
            </div>
            <span className="font-mono text-xs font-bold text-foreground/80">
              Launching Soon
            </span>
          </div>

          <div className="mt-8 max-w-3xl">
            <h2 className="font-display text-3xl font-extrabold leading-[1.05] tracking-tight md:text-5xl">
              Deep dives and engineering notes are currently in the oven 🥐
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-foreground/80 md:text-lg">
              Long-form, practical writing on React architecture, edge computing, Shopify performance, and production AI systems.
            </p>
          </div>

          {/* Email Notify Box wired to /api/newsletter */}
          <div className="mt-10 max-w-xl">
            {status === "success" ? (
              <div className="flex items-center gap-3 rounded-2xl border-[3px] border-hairline bg-mint p-4 shadow-hard">
                <span className="grid size-8 place-items-center rounded-full border-[2px] border-hairline bg-card">
                  <Check className="size-4" />
                </span>
                <div>
                  <p className="font-display text-sm font-extrabold">You're on the early list!</p>
                  <p className="text-xs text-foreground/75">I'll send you an update as soon as the first article is published.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email to get notified..."
                  required
                  disabled={status === "loading"}
                  className="flex-1 rounded-full border-[3px] border-hairline bg-card px-5 py-3 text-sm font-medium shadow-hard-sm outline-none transition-all placeholder:text-muted-foreground focus:shadow-hard"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="inline-flex items-center justify-center gap-2 rounded-full border-[3px] border-hairline bg-yellow px-6 py-3 font-display text-sm font-extrabold shadow-hard-sm transition-transform hover:-translate-y-0.5 disabled:opacity-70"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="size-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      Notify Me <Send className="size-3.5" />
                    </>
                  )}
                </button>
              </form>
            )}
            {status === "error" && (
              <p className="mt-2 text-xs font-semibold text-rose-500">{errorMessage}</p>
            )}
          </div>
        </div>
      </Reveal>

      {/* Teaser Topics (Simple pill tags, no heavy cards) */}
      <div className="mt-14">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
          Topics in the pipeline
        </p>
        <div className="mt-4 flex flex-wrap gap-2.5">
          {teaserTopics.map((topic) => (
            <span
              key={topic}
              className="rounded-full border-[2px] border-hairline bg-card px-4 py-1.5 font-display text-xs font-bold text-foreground shadow-hard-sm"
            >
              ✦ {topic}
            </span>
          ))}
        </div>
      </div>

      {/* Alternative Explore Links */}
      <div className="mt-12 rounded-2xl border-[3px] border-hairline bg-surface p-7 shadow-hard">
        <div className="flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">
          <div>
            <h4 className="font-display text-lg font-extrabold">In the meantime, explore real production builds</h4>
            <p className="mt-1 text-xs text-foreground/75">
              Read real-world architecture breakdowns, codebases, and live implementations.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="/projects"
              className="inline-flex items-center gap-2 rounded-full border-[3px] border-hairline bg-card px-4 py-2 font-display text-xs font-extrabold shadow-hard-sm transition-transform hover:-translate-y-0.5 hover:bg-yellow"
            >
              View Case Studies <ArrowRight className="size-3.5" />
            </a>
            <a
              href="/about"
              className="inline-flex items-center gap-2 rounded-full border-[3px] border-hairline bg-card px-4 py-2 font-display text-xs font-extrabold shadow-hard-sm transition-transform hover:-translate-y-0.5 hover:bg-mint"
            >
              About Me <ArrowRight className="size-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
