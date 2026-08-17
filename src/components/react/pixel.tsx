import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Pixel motion system — the signature animation language of the site.
 * A grid of square blocks assembles, covers and dissolves instead of fading.
 *
 * NOTE: PixelTransition (full-screen route-change wipe) is now handled by
 * src/scripts/pixel-transition.ts (vanilla JS on Astro's ClientRouter lifecycle).
 * This file only contains PixelGrid and PixelReveal (in-page animations).
 */

/** Single subtle tone family — quiet lavender wash instead of a rainbow grid. */
const TONES = ["bg-lavender", "bg-lavender/85", "bg-lavender/70"] as const;

/** Deterministic pseudo-random so SSR and client agree. */
function pick(i: number) {
  return TONES[(i * 7 + ((i * i) % 5)) % TONES.length]!;
}

export function PixelGrid({
  cols,
  rows,
  state,
  className,
  duration = 0.42,
  stagger = 0.028,
  initialState = "clear",
}: {
  cols: number;
  rows: number;
  /** "covered" = blocks visible, "clear" = blocks gone. */
  state: "covered" | "clear";
  className?: string;
  duration?: number;
  stagger?: number;
  initialState?: "covered" | "clear";
}) {
  const total = cols * rows;
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none grid", className)}
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      }}
    >
      {Array.from({ length: total }, (_, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const diagonal = col + row;
        return (
          <motion.span
            key={i}
            className={cn("block h-full w-full will-change-transform", pick(i))}
            initial={false}
            animate={{ scale: state === "covered" ? 1 : 0 }}
            transition={{
              duration,
              ease: state === "covered" ? [0.22, 1, 0.36, 1] : [0.65, 0, 0.35, 1],
              delay: diagonal * stagger,
            }}
            style={{ transformOrigin: "center", scale: initialState === "covered" ? 1 : 0 }}
          />
        );
      })}
    </div>
  );
}

/**
 * Reveals its children by dissolving a pixel mask when scrolled into view.
 * Used for hero/product imagery so media feels digitally reconstructed.
 */
export function PixelReveal({
  children,
  className,
  cols = 8,
  rows = 10,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  cols?: number;
  rows?: number;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"covered" | "clear">(reduced ? "clear" : "covered");

  useEffect(() => {
    if (reduced) return;
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          window.setTimeout(() => setState("clear"), delay * 1000);
          observer.disconnect();
        }
      },
      { rootMargin: "-10% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [delay, reduced]);

  return (
    <div ref={ref} className={cn("relative isolate overflow-hidden", className)}>
      {children}
      <div className="pointer-events-none absolute inset-0 z-10">
        <PixelGrid
          cols={cols}
          rows={rows}
          state={state}
          initialState="covered"
          className="h-full w-full"
          stagger={0.012}
        />
      </div>
    </div>
  );
}
