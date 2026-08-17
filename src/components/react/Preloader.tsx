import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { Doodle } from "./decor";

const WORDS = ["Hello", "नमस्ते", "Bonjour", "Hola", "Welcome"];
/** Minimum time the preloader stays up, even if the page is already ready. */
const MIN_MS = 3200;

/**
 * Playful portfolio preloader: an oversized RG monogram assembles, greeting
 * words flip through, and stickers pop in before the curtain lifts.
 */
export function Preloader() {
  const reduced = useReducedMotion();
  const [done, setDone] = useState(false);
  const [word, setWord] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (reduced || sessionStorage.getItem("rg-booted") === "1") {
      setDone(true);
      return;
    }
    document.body.style.overflow = "hidden";
    const start = performance.now();
    let frame = 0;
    let finish = 0;
    let loaded = document.readyState === "complete";
    const onLoad = () => {
      loaded = true;
    };
    if (!loaded) window.addEventListener("load", onLoad);

    const complete = () => {
      sessionStorage.setItem("rg-booted", "1");
      document.body.style.overflow = "";
      setDone(true);
    };

    const tick = () => {
      const elapsed = performance.now() - start;
      const p = Math.min(1, elapsed / MIN_MS);
      // hold just shy of 100% until the document is actually ready
      setProgress(Math.round((loaded ? p : Math.min(p, 0.96)) * 100));
      if (p < 1 || !loaded) {
        frame = requestAnimationFrame(tick);
      } else {
        finish = window.setTimeout(complete, 260);
      }
    };
    frame = requestAnimationFrame(tick);

    const words = window.setInterval(() => setWord((w) => (w + 1) % WORDS.length), 700);

    return () => {
      cancelAnimationFrame(frame);
      window.clearInterval(words);
      window.clearTimeout(finish);
      window.removeEventListener("load", onLoad);
      document.body.style.overflow = "";
    };
  }, [reduced]);

  return (
    <AnimatePresence>
      {!done ? (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[100] grid w-screen place-items-center overflow-hidden bg-background px-6"
          style={{ backgroundColor: "var(--color-background)" }}
          initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
          transition={{ duration: 0.95, ease: [0.76, 0, 0.24, 1] }}
          role="status"
          aria-live="polite"
          aria-label="Loading portfolio"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-background"
            style={{ backgroundColor: "var(--color-background)" }}
          />
          <div aria-hidden className="grid-lines pointer-events-none absolute inset-0 opacity-30" />

          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[6px] bg-hairline"
            initial={{ scaleX: 0, opacity: 0 }}
            exit={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />

          {/* floating stickers */}
          {[
            { cls: "left-[8%] top-[18%] text-yellow", d: 0.35, name: "star" as const, r: -12 },
            { cls: "right-[10%] top-[24%] text-lavender", d: 0.5, name: "sparkle" as const, r: 10 },
            { cls: "left-[14%] bottom-[20%] text-mint", d: 0.65, name: "smiley" as const, r: 8 },
            { cls: "right-[14%] bottom-[16%] text-peach", d: 0.8, name: "heart" as const, r: -8 },
          ].map((s) => (
            <motion.span
              key={s.cls}
              aria-hidden
              className={`absolute hidden sm:block ${s.cls}`}
              initial={{ scale: 0, rotate: 0, opacity: 0 }}
              animate={{ scale: 1, rotate: s.r, opacity: 1 }}
              transition={{ delay: s.d, type: "spring", stiffness: 260, damping: 14 }}
            >
              <Doodle name={s.name} fill className="size-10 md:size-14" />
            </motion.span>
          ))}

          <motion.div
            className="relative flex flex-col items-center"
            exit={{ opacity: 0, y: -28, scale: 0.94 }}
            transition={{ duration: 0.42, ease: [0.65, 0, 0.35, 1] }}
          >
            {/* RG monogram */}
            <div className="flex items-end gap-1 sm:gap-3">
              {["R", "G"].map((letter, i) => (
                <motion.span
                  key={letter}
                  initial={{ y: 90, opacity: 0, rotate: i === 0 ? -14 : 14 }}
                  animate={{ y: 0, opacity: 1, rotate: i === 0 ? -4 : 4 }}
                  transition={{ delay: 0.1 + i * 0.14, type: "spring", stiffness: 200, damping: 16 }}
                  className={`grid size-24 place-items-center rounded-3xl border-[4px] border-hairline font-display text-6xl font-extrabold shadow-hard-lg sm:size-32 sm:text-8xl ${
                    i === 0 ? "bg-yellow" : "bg-lavender"
                  }`}
                >
                  {letter}
                </motion.span>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.5 }}
              className="mt-8 font-mono text-[11px] uppercase tracking-[0.32em] text-muted-foreground"
            >
              Rohit Gautam · Software Engineer
            </motion.p>

            {/* rotating greeting */}
            <div className="mt-4 h-12 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p
                  key={word}
                  initial={{ y: 28, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -28, opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="hand text-4xl leading-none text-foreground"
                >
                  {WORDS[word]}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* chunky progress */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0.7 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-6 w-56 sm:w-72"
            >
              <div className="h-4 w-full overflow-hidden rounded-full border-[3px] border-hairline bg-surface">
                <motion.div
                  className="h-full rounded-r-full bg-mint"
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "linear", duration: 0.12 }}
                />
              </div>
              <p className="mt-2 text-center font-mono text-[11px] text-muted-foreground">
                {progress}%
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
