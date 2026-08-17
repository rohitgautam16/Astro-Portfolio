import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionProps,
} from "framer-motion";
import {
  useEffect,
  useRef,
  useState,
  type ElementType,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { cn } from "@/lib/utils";

export const ease = [0.22, 1, 0.36, 1] as const;

/** Scroll-triggered reveal with a blur-to-sharp finish. */
export function Reveal({
  children,
  delay = 0,
  y = 26,
  blur = true,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  blur?: boolean;
  className?: string;
  as?: ElementType;
}) {
  const reduced = useReducedMotion();
  const Tag = motion[as as "div"] as typeof motion.div;

  if (reduced) {
    const Plain = as as ElementType;
    return <Plain className={className}>{children}</Plain>;
  }

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y, filter: blur ? "blur(8px)" : "none" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease }}
    >
      {children}
    </Tag>
  );
}

/** Word-by-word (and optionally character) stagger reveal for headlines. */
export function StaggerText({
  text,
  className,
  wordClassName,
  perChar = false,
  delay = 0,
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  perChar?: boolean;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  const words = text.split(" ");

  if (reduced) return <span className={className}>{text}</span>;

  let index = 0;
  return (
    <span className={cn("inline-block", className)}>
      {words.map((word, w) => (
        <span key={`${word}-${w}`} className={cn("inline-block overflow-hidden", wordClassName)}>
          {(perChar ? word.split("") : [word]).map((part, i) => {
            const step = index++;
            return (
              <motion.span
                key={`${part}-${i}`}
                className="inline-block will-change-transform"
                initial={{ y: "105%", opacity: 0, rotate: 4 }}
                animate={{ y: "0%", opacity: 1, rotate: 0 }}
                transition={{ duration: 0.75, delay: delay + step * (perChar ? 0.025 : 0.07), ease }}
              >
                {part}
              </motion.span>
            );
          })}
          {w < words.length - 1 ? <span>&nbsp;</span> : null}
        </span>
      ))}
    </span>
  );
}

/** Button/link wrapper that leans toward the cursor. */
export function Magnetic({
  children,
  strength = 0.35,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const onMove = (event: ReactPointerEvent<HTMLSpanElement>) => {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setOffset({
      x: (event.clientX - (rect.left + rect.width / 2)) * strength,
      y: (event.clientY - (rect.top + rect.height / 2)) * strength,
    });
  };

  return (
    <motion.span
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={() => setOffset({ x: 0, y: 0 })}
      animate={offset}
      transition={{ type: "spring", stiffness: 220, damping: 18, mass: 0.5 }}
      className={cn("inline-block", className)}
    >
      {children}
    </motion.span>
  );
}

/** 3D hover tilt for cards. */
export function Tilt({
  children,
  className,
  max = 6,
  ...rest
}: { children: ReactNode; className?: string; max?: number } & MotionProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const onMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: -py * max * 2, ry: px * max * 2 });
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={() => setTilt({ rx: 0, ry: 0 })}
      style={{ transformPerspective: 900 }}
      animate={{ rotateX: tilt.rx, rotateY: tilt.ry }}
      transition={{ type: "spring", stiffness: 180, damping: 20 }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Parallax wrapper driven by page scroll. */
export function Parallax({
  children,
  distance = 60,
  className,
}: {
  children: ReactNode;
  distance?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={reduced ? {} : { y }} className="h-full w-full">
        {children}
      </motion.div>
    </div>
  );
}

/** Thin ink progress bar pinned under the header. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.3 });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-1.5 origin-left bg-lavender border-b-[3px] border-hairline"
    />
  );
}

/** Dot cursor that grows over interactive elements. Pointer devices only. */
export function CursorDot() {
  const reduced = useReducedMotion();
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [active, setActive] = useState(false);
  const [fine, setFine] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setFine(window.matchMedia("(pointer: fine)").matches);
  }, []);

  useEffect(() => {
    if (!fine || reduced) return;
    const move = (event: globalThis.PointerEvent) => {
      setPos({ x: event.clientX, y: event.clientY });
      const target = event.target as HTMLElement | null;
      setActive(Boolean(target?.closest("a,button,[role='button'],input,textarea")));
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [fine, reduced]);

  if (!fine || reduced) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[70] hidden rounded-full border-[3px] border-hairline mix-blend-normal lg:block"
      animate={{
        x: pos.x - (active ? 22 : 8),
        y: pos.y - (active ? 22 : 8),
        width: active ? 44 : 16,
        height: active ? 44 : 16,
        backgroundColor: active ? "transparent" : "var(--tone-lavender)",
      }}
      transition={{ type: "spring", stiffness: 500, damping: 34, mass: 0.4 }}
    />
  );
}

/* --------------------------------------------------- smooth scrolling --- */

/**
 * Lenis-powered smooth scrolling, wired into a single rAF loop and disabled
 * entirely under prefers-reduced-motion.
 */
export function SmoothScroll() {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || typeof window === "undefined") return;
    let raf = 0;
    let lenis: { raf: (t: number) => void; destroy: () => void } | null = null;
    let cancelled = false;

    void import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      const instance = new Lenis({ duration: 1.05, smoothWheel: true, touchMultiplier: 1.6 });
      lenis = instance;
      const loop = (time: number) => {
        instance.raf(time);
        raf = window.requestAnimationFrame(loop);
      };
      raf = window.requestAnimationFrame(loop);
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(raf);
      lenis?.destroy();
    };
  }, [reduced]);

  return null;
}

/* ------------------------------------------------------- text reveals --- */

type SplitMode = "word" | "line" | "char";

/**
 * Mask-based heading reveal. Text is split into lines/words/characters and each
 * fragment rises out of an overflow-hidden mask as the heading scrolls in.
 */
export function SplitReveal({
  text,
  as = "span",
  mode = "word",
  className,
  delay = 0,
  stagger,
  rotate = 0,
}: {
  text: string;
  as?: ElementType;
  mode?: SplitMode;
  className?: string;
  delay?: number;
  stagger?: number;
  rotate?: number;
}) {
  const reduced = useReducedMotion();
  const Tag = as as ElementType;

  if (reduced) return <Tag className={className}>{text}</Tag>;

  const lines = mode === "line" ? text.split("\n") : [text];
  const step = stagger ?? (mode === "char" ? 0.024 : 0.055);
  let i = 0;

  return (
    <Tag className={className}>
      {lines.map((lineText, lineIndex) => (
        <span key={lineIndex} className="block">
          {(mode === "line" ? [lineText] : lineText.split(" ")).map((word, wordIndex, arr) => (
            <span key={`${word}-${wordIndex}`} className="inline-block overflow-hidden align-bottom">
              {(mode === "char" ? word.split("") : [word]).map((piece, pieceIndex) => {
                const order = i++;
                return (
                  <motion.span
                    key={`${piece}-${pieceIndex}`}
                    className="inline-block will-change-transform"
                    initial={{ y: "110%", opacity: 0, rotate }}
                    whileInView={{ y: "0%", opacity: 1, rotate: 0 }}
                    viewport={{ once: true, margin: "-12%" }}
                    transition={{ duration: 0.8, delay: delay + order * step, ease }}
                  >
                    {piece}
                  </motion.span>
                );
              })}
              {wordIndex < arr.length - 1 ? <span>&nbsp;</span> : null}
            </span>
          ))}
        </span>
      ))}
    </Tag>
  );
}

/* ----------------------------------------------------- image reveals --- */

/** Clip-path mask reveal for imagery, with an optional zoom settle. */
export function MaskReveal({
  children,
  className,
  delay = 0,
  direction = "up",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left";
}) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;

  const hidden =
    direction === "up" ? "inset(100% 0% 0% 0%)" : "inset(0% 100% 0% 0%)";

  return (
    <motion.div
      className={cn("overflow-hidden", className)}
      initial={{ clipPath: hidden }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, margin: "-15%" }}
      transition={{ duration: 1, delay, ease }}
    >
      <motion.div
        initial={{ scale: 1.14 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 1.2, delay, ease }}
        className="size-full"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

/* ---------------------------------------------------- pointer parallax --- */

/** Element that leans away from / toward the cursor across a container. */
export function PointerParallax({
  children,
  strength = 14,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const onMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setOffset({
      x: ((event.clientX - (rect.left + rect.width / 2)) / rect.width) * strength * 2,
      y: ((event.clientY - (rect.top + rect.height / 2)) / rect.height) * strength * 2,
    });
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={() => setOffset({ x: 0, y: 0 })}
      animate={offset}
      transition={{ type: "spring", stiffness: 120, damping: 18, mass: 0.6 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
