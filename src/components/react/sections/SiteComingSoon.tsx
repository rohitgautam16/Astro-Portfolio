import { useState, type FormEvent } from "react";
import { Sparkles, Send, Check, Loader2, Mail, Sun, Moon } from "lucide-react";
import { profile } from "@/data/site";
import { Doodle } from "@/components/react/decor";
import { TechGlyph } from "@/components/react/tech-icons";
import { Reveal, Magnetic } from "@/components/react/motion";
import { useTheme } from "@/components/react/ThemeToggle";

const marqueeItems1 = [
  "coming soon",
  "dropping very soon",
  "portfolio v2.0",
  "handcrafted engineering",
  "coming soon",
  "shipping soon",
  "new builds on the way",
  "coming soon",
  "dropping very soon",
  "portfolio v2.0",
  "handcrafted engineering",
  "coming soon",
  "shipping soon",
  "new builds on the way",
];

const marqueeItems2 = [
  "in the oven 🥐",
  "coming soon",
  "rohit gautam",
  "react · node.js · cloudflare",
  "coming soon",
  "available for contracts",
  "in the oven 🥐",
  "coming soon",
  "rohit gautam",
  "react · node.js · cloudflare",
  "coming soon",
  "available for contracts",
];

export function SiteComingSoon() {
  const { theme, toggle } = useTheme();
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
        body: JSON.stringify({ email, source: "site-prelaunch" }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Subscription failed");
      }

      setStatus("success");
    } catch (err: any) {
      console.error("[Site Prelaunch] Error:", err);
      setStatus("error");
      setErrorMessage(err.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex h-[100dvh] w-full flex-col justify-between overflow-hidden bg-surface p-4 sm:p-5 md:p-6 lg:p-7 select-none">
      {/* ------------------------------------------------------------- */}
      {/* Background Diagonal Marquees (Caveat font)                    */}
      {/* ------------------------------------------------------------- */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* Top Diagonal Ribbon (Left-to-Right) */}
        <div className="absolute -left-[20%] -right-[20%] top-[18%] md:top-[22%] -rotate-6 border-y-[3px] border-hairline bg-yellow py-2 shadow-hard-sm opacity-95">
          <div className="marquee-track flex w-max items-center gap-8 whitespace-nowrap font-hand text-2xl font-bold tracking-wide text-foreground sm:text-3xl md:text-4xl">
            {marqueeItems1.map((item, i) => (
              <span key={i} className="flex items-center gap-8">
                <span>{item}</span>
                <span className="text-sm font-sans font-extrabold text-foreground/60">✦</span>
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Diagonal Ribbon (Right-to-Left) */}
        <div className="absolute -left-[20%] -right-[20%] bottom-[18%] md:bottom-[22%] rotate-6 border-y-[3px] border-hairline bg-lavender py-2 shadow-hard-sm opacity-95">
          <div className="marquee-track-reverse flex w-max items-center gap-8 whitespace-nowrap font-hand text-2xl font-bold tracking-wide text-foreground sm:text-3xl md:text-4xl">
            {marqueeItems2.map((item, i) => (
              <span key={i} className="flex items-center gap-8">
                <span>{item}</span>
                <span className="text-sm font-sans font-extrabold text-foreground/60">✦</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* Top Header Bar                                                */}
      {/* ------------------------------------------------------------- */}
      <header className="relative z-20 flex shrink-0 items-center justify-between gap-4">
        <Magnetic strength={0.25}>
          <div className="flex items-center gap-2 rounded-full border-[3px] border-hairline bg-card px-3.5 py-1.5 shadow-hard-sm">
            <span
              aria-hidden
              className="grid size-6 shrink-0 place-items-center rounded-full border-[2px] border-hairline bg-yellow"
            >
              <Doodle name="smiley" className="size-3.5" />
            </span>
            <span className="font-display text-sm font-extrabold tracking-tight">
              {profile.name}
            </span>
          </div>
        </Magnetic>

        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="hidden sm:flex items-center gap-2 rounded-full border-[2px] border-hairline bg-card px-3 py-1 font-mono text-[11px] font-bold text-muted-foreground shadow-hard-sm">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            Available for Contracts
          </div>

          <Magnetic strength={0.35}>
            <button
              type="button"
              onClick={toggle}
              className="grid size-9 place-items-center rounded-full border-[3px] border-hairline bg-card shadow-hard-sm transition-transform duration-200 hover:-translate-y-0.5"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            >
              {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>
          </Magnetic>
        </div>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* Center Hero Card                                              */}
      {/* ------------------------------------------------------------- */}
      <main className="relative z-10 my-auto flex flex-1 items-center justify-center py-2">
        <Reveal className="w-full max-w-xl xl:max-w-2xl">
          <div className="relative overflow-hidden rounded-[28px] border-[3px] border-hairline bg-card p-6 sm:p-8 md:p-10 shadow-hard-lg backdrop-blur-md">
            <span
              aria-hidden
              className="tape-strip absolute -top-3 left-10 h-5 w-24 -rotate-6 rounded-[2px]"
            />

            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border-[2px] border-hairline bg-yellow px-3 py-0.5 font-display text-[10px] font-extrabold uppercase tracking-wider shadow-hard-sm">
                <Sparkles className="size-3" />
                Portfolio v2.0 · In Final Polish
              </span>
              <span className="font-mono text-[11px] font-bold text-muted-foreground">
                Launching Soon
              </span>
            </div>

            <h1 className="mt-4 sm:mt-5 font-display text-2xl sm:text-4xl md:text-[2.6rem] font-extrabold leading-[1.08] tracking-tight">
              Crafting something special.
              <br />
              <span className="underline decoration-yellow decoration-[5px] underline-offset-4">
                Dropping very soon.
              </span>
            </h1>

            <p className="mt-3 sm:mt-4 text-xs sm:text-sm leading-relaxed text-foreground/80">
              Hey, I'm <span className="font-bold text-foreground">{profile.name}</span> — software engineer building scalable full-stack web applications, high-throughput APIs, and production AI tools.
            </p>

            {/* Email Early Access Box */}
            <div className="mt-5 sm:mt-6">
              {status === "success" ? (
                <div className="flex items-center gap-3 rounded-2xl border-[3px] border-hairline bg-mint p-3.5 shadow-hard">
                  <span className="grid size-7 place-items-center rounded-full border-[2px] border-hairline bg-card">
                    <Check className="size-3.5" />
                  </span>
                  <div>
                    <p className="font-display text-xs sm:text-sm font-extrabold">You're on the early list!</p>
                    <p className="text-[11px] text-foreground/75">I'll send you an early link before the public launch.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email to get notified..."
                    required
                    disabled={status === "loading"}
                    className="flex-1 rounded-full border-[3px] border-hairline bg-surface px-4 py-2.5 text-xs sm:text-sm font-medium shadow-hard-sm outline-none transition-all placeholder:text-muted-foreground focus:shadow-hard"
                  />
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="inline-flex items-center justify-center gap-2 rounded-full border-[3px] border-hairline bg-yellow px-5 py-2.5 font-display text-xs sm:text-sm font-extrabold shadow-hard-sm transition-transform hover:-translate-y-0.5 disabled:opacity-70"
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 className="size-3.5 animate-spin" /> Saving...
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
                <p className="mt-1.5 text-[11px] font-semibold text-rose-500">{errorMessage}</p>
              )}
            </div>

            {/* Tech pills */}
            <div className="mt-5 sm:mt-6 flex flex-wrap items-center gap-1.5 border-t border-hairline/20 pt-4">
              {profile.focus.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-hairline/40 bg-surface px-2.5 py-0.5 font-mono text-[9px] sm:text-[10px] font-bold text-foreground/80"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </main>

      {/* ------------------------------------------------------------- */}
      {/* Bottom Footer Bar                                             */}
      {/* ------------------------------------------------------------- */}
      <footer className="relative z-20 flex shrink-0 flex-col items-center justify-between gap-3 border-t border-hairline/20 pt-3 sm:flex-row text-[11px] text-muted-foreground">
        <p>
          &copy; {new Date().getFullYear()} {profile.name}. India · Remote friendly.
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <Magnetic strength={0.3}>
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-full border-[2px] border-hairline bg-card px-3 py-1 font-display text-[11px] font-extrabold text-foreground shadow-hard-sm transition-transform hover:-translate-y-0.5 hover:bg-sky"
            >
              <TechGlyph name="GitHub" className="size-3" /> GitHub
            </a>
          </Magnetic>

          <Magnetic strength={0.3}>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-full border-[2px] border-hairline bg-card px-3 py-1 font-display text-[11px] font-extrabold text-foreground shadow-hard-sm transition-transform hover:-translate-y-0.5 hover:bg-lavender"
            >
              LinkedIn
            </a>
          </Magnetic>

          <Magnetic strength={0.3}>
            <a
              href={profile.x || profile.twitter}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-full border-[2px] border-hairline bg-card px-3 py-1 font-display text-[11px] font-extrabold text-foreground shadow-hard-sm transition-transform hover:-translate-y-0.5 hover:bg-peach"
            >
              <TechGlyph name="X" className="size-2.5" /> X
            </a>
          </Magnetic>

          <Magnetic strength={0.3}>
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-1 rounded-full border-[2px] border-hairline bg-card px-3 py-1 font-display text-[11px] font-extrabold text-foreground shadow-hard-sm transition-transform hover:-translate-y-0.5 hover:bg-mint"
            >
              <Mail className="size-3" /> Email
            </a>
          </Magnetic>
        </div>
      </footer>
    </div>
  );
}
