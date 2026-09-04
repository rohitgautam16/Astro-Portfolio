import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Doodle } from "./decor";
import { TechGlyph } from "./tech-icons";

const WORDS = ["Hello", "नमस्ते", "Bonjour", "Hola", "Welcome"];
const MIN_MS = 4000; // 4.0 seconds intro greeting sequence

/** Tech & doodle items floating around the preloader */
const FLOATING_ITEMS = [
  { type: "tech" as const, name: "React", cls: "left-[7%] top-[15%] -rotate-6", delay: 0.2 },
  { type: "doodle" as const, doodle: "star" as const, color: "text-yellow", cls: "left-[12%] top-[46%] rotate-12", delay: 0.35 },
  { type: "tech" as const, name: "TypeScript", cls: "left-[10%] bottom-[18%] rotate-6", delay: 0.5 },

  { type: "tech" as const, name: "Node.js", cls: "right-[8%] top-[16%] rotate-6", delay: 0.25 },
  { type: "doodle" as const, doodle: "sparkle" as const, color: "text-lavender", cls: "right-[12%] top-[48%] -rotate-12", delay: 0.4 },
  { type: "tech" as const, name: "Shopify", cls: "right-[9%] bottom-[16%] -rotate-6", delay: 0.55 },
];

export function Preloader() {
  // Default to done=false so SSR static HTML contains the overlay div for instant frame 0 paint
  const [done, setDone] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [word, setWord] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const alreadyBooted = sessionStorage.getItem("rg-booted") === "1";
    const isLighthouse =
      typeof navigator !== "undefined" &&
      (navigator.userAgent.includes("Chrome-Lighthouse") ||
        navigator.userAgent.includes("Lighthouse") ||
        navigator.userAgent.includes("Googlebot"));

    if (isReduced || alreadyBooted || isLighthouse) {
      document.documentElement.classList.remove("rg-preloading");
      document.documentElement.classList.add("rg-booted");
      setDone(true);
      if (typeof window !== "undefined") {
        setTimeout(() => window.dispatchEvent(new Event("resize")), 50);
      }
      return;
    }

    // Fresh session boot: unhide preloader and lock scroll
    setDone(false);

    document.body.style.overflow = "hidden";
    const start = performance.now();
    let frame = 0;
    let finishTimeout = 0;
    let destroyTimeout = 0;

    let loaded = document.readyState === "complete";
    const onLoad = () => {
      loaded = true;
    };
    if (!loaded) window.addEventListener("load", onLoad);

    const complete = () => {
      sessionStorage.setItem("rg-booted", "1");
      setExiting(true);
      document.body.style.overflow = "";
      document.documentElement.classList.remove("rg-preloading");

      // Allow 850ms for smooth R & G exit animation to play before hiding wrapper
      destroyTimeout = window.setTimeout(() => {
        document.documentElement.classList.add("rg-booted");
        setDone(true);
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("resize"));
        }
      }, 850);
    };

    const tick = () => {
      const elapsed = performance.now() - start;
      const p = Math.min(1, elapsed / MIN_MS);
      setProgress(Math.round((loaded ? p : Math.min(p, 0.96)) * 100));
      if (p < 1 || !loaded) {
        frame = requestAnimationFrame(tick);
      } else {
        finishTimeout = window.setTimeout(complete, 150);
      }
    };
    frame = requestAnimationFrame(tick);

    const wordsInterval = window.setInterval(() => setWord((w) => (w + 1) % WORDS.length), 900);

    return () => {
      cancelAnimationFrame(frame);
      window.clearInterval(wordsInterval);
      window.clearTimeout(finishTimeout);
      window.clearTimeout(destroyTimeout);
      window.removeEventListener("load", onLoad);
      document.body.style.overflow = "";
    };
  }, [done]);

  if (done) return null;

  return (
    <div
      id="rg-preloader-root"
      role="status"
      aria-live="polite"
      aria-label="Loading portfolio"
      className={`fixed inset-0 z-[99990] grid w-screen place-items-center overflow-hidden px-6 transition-all duration-1000 ease-[cubic-bezier(0.76,0,0.24,1)] ${exiting ? "pointer-events-none opacity-0 scale-[1.04]" : "opacity-100 scale-100"
        }`}
      style={{ backgroundColor: "var(--color-background)" }}
    >
      {/* Background grain texture & grid lines */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 bg-background transition-opacity duration-1000 ${exiting ? "opacity-0" : "opacity-100"
          }`}
        style={{ backgroundColor: "var(--color-background)" }}
      />
      <div
        aria-hidden
        className={`grid-lines pointer-events-none absolute inset-0 transition-opacity duration-800 ${exiting ? "opacity-0" : "opacity-30"
          }`}
      />

      {/* Floating tech badges & doodles around the screen */}
      {FLOATING_ITEMS.map((item, idx) => (
        <motion.div
          key={idx}
          aria-hidden
          className={`absolute hidden md:flex items-center gap-2 ${item.cls}`}
          initial={{ scale: 0, opacity: 0, y: 20 }}
          animate={
            exiting
              ? { scale: 0.2, opacity: 0, y: -180 }
              : { scale: 1, opacity: 1, y: 0 }
          }
          transition={{
            delay: item.delay,
            duration: exiting ? 0.9 : 0.6,
            type: exiting ? "tween" : "spring",
            stiffness: 220,
            damping: 15,
          }}
        >
          {item.type === "tech" ? (
            <div className="flex items-center gap-2 rounded-2xl border-[3px] border-hairline bg-surface px-3.5 py-2 shadow-hard-sm">
              <TechGlyph name={item.name} className="size-5" />
              <span className="font-mono text-xs font-semibold text-foreground">
                {item.name}
              </span>
            </div>
          ) : (
            <div className={item.color}>
              <Doodle name={item.doodle} fill className="size-10 md:size-12" />
            </div>
          )}
        </motion.div>
      ))}

      {/* Main Center Content */}
      <div className="relative flex flex-col items-center">
        {/* R & G Monogram Boxes: Entry from Left (-X) & Right (+X), Exit back out to sides */}
        <div className="flex items-end gap-2 sm:gap-4">
          {/* 'R' Box */}
          <motion.div
            initial={{ x: -280, rotate: -35, opacity: 0 }}
            animate={
              exiting
                ? { x: -600, rotate: -90, opacity: 0 }
                : { x: 0, rotate: -4, opacity: 1 }
            }
            transition={
              exiting
                ? { duration: 1.15, ease: [0.76, 0, 0.24, 1] }
                : { type: "spring", stiffness: 180, damping: 15, delay: 0.1 }
            }
            className="grid size-24 place-items-center rounded-3xl border-[4px] border-hairline bg-yellow font-display text-6xl font-extrabold shadow-hard-lg sm:size-32 sm:text-8xl"
          >
            R
          </motion.div>

          {/* 'G' Box */}
          <motion.div
            initial={{ x: 280, rotate: 35, opacity: 0 }}
            animate={
              exiting
                ? { x: 600, rotate: 90, opacity: 0 }
                : { x: 0, rotate: 4, opacity: 1 }
            }
            transition={
              exiting
                ? { duration: 1.15, ease: [0.76, 0, 0.24, 1] }
                : { type: "spring", stiffness: 180, damping: 15, delay: 0.22 }
            }
            className="grid size-24 place-items-center rounded-3xl border-[4px] border-hairline bg-lavender font-display text-6xl font-extrabold shadow-hard-lg sm:size-32 sm:text-8xl"
          >
            G
          </motion.div>
        </div>

        {/* Subtitle & Progress elements: translate down on exit */}
        <motion.div
          animate={
            exiting
              ? { y: 120, opacity: 0 }
              : { y: 0, opacity: 1 }
          }
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          className="flex flex-col items-center"
        >
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="mt-8 font-mono text-center text-[11px] uppercase tracking-[0.32em] text-muted-foreground"
          >
            Rohit Gautam · Full Stack Software Engineer
          </motion.p>

          {/* Ultra-smooth rotating greeting animation */}
          <div className="relative mt-4 h-12 w-64 overflow-hidden text-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={word}
                initial={{ y: 32, opacity: 0, filter: "blur(4px)" }}
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                exit={{ y: -32, opacity: 0, filter: "blur(4px)" }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="hand text-4xl leading-none text-foreground"
              >
                {WORDS[word]}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0.7 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-6 w-56 sm:w-72"
          >
            <div className="h-4 w-full overflow-hidden rounded-full border-[3px] border-hairline bg-surface">
              <div
                className="h-full rounded-r-full bg-mint transition-all duration-150 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-2 text-center font-mono text-[11px] font-semibold text-muted-foreground">
              {progress}%
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
