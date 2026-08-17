import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type Tone = "yellow" | "peach" | "mint" | "lavender" | "sky" | "paper";

export const toneBg: Record<Tone, string> = {
  yellow: "bg-yellow",
  peach: "bg-peach",
  mint: "bg-mint",
  lavender: "bg-lavender",
  sky: "bg-sky",
  paper: "bg-card",
};

/** A chunky, slightly rotated paper surface with an ink border and hard shadow. */
export function PaperCard({
  children,
  className,
  tone = "paper",
  tilt = 0,
  interactive = false,
  style,
}: {
  children: ReactNode;
  className?: string;
  tone?: Tone;
  tilt?: number;
  interactive?: boolean;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{ transform: tilt ? `rotate(${tilt}deg)` : undefined, ...style }}
      className={cn(
        "relative rounded-2xl border-[3px] border-hairline p-6 shadow-hard",
        toneBg[tone],
        interactive && "poke",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Small circular sticker badge. */
export function Sticker({
  children,
  tone = "yellow",
  rotate = -6,
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  rotate?: number;
  className?: string;
}) {
  return (
    <span
      style={{ transform: `rotate(${rotate}deg)` }}
      className={cn(
        "hover-wiggle inline-flex items-center gap-1.5 rounded-full border-[3px] border-hairline px-3 py-1 font-display text-xs font-extrabold tracking-wide uppercase shadow-hard-sm",
        toneBg[tone],
        "text-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Pill-shaped label used for tags. */
export function Badge({
  children,
  tone = "mint",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border-2 border-hairline px-2.5 py-0.5 font-mono text-[11px] font-medium text-foreground",
        toneBg[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Handwritten annotation, optionally highlighted. */
export function HighlightLabel({
  children,
  className,
  highlight = true,
}: {
  children: ReactNode;
  className?: string;
  highlight?: boolean;
}) {
  return (
    <span className={cn("hand text-xl", highlight && "highlight-label", className)}>{children}</span>
  );
}

/** A strip of masking tape, absolutely positioned by the parent. */
export function Tape({
  className,
  rotate = -4,
  tone = "yellow",
}: {
  className?: string;
  rotate?: number;
  tone?: Tone;
}) {
  return (
    <span
      aria-hidden
      style={{ transform: `translateX(-50%) rotate(${rotate}deg)` }}
      className={cn(
        "pointer-events-none absolute left-1/2 -top-3 h-6 w-24 opacity-80",
        toneBg[tone],
        "border border-hairline/30",
        className,
      )}
    />
  );
}

type DoodleName =
  | "star"
  | "sparkle"
  | "smiley"
  | "flower"
  | "arrow"
  | "squiggle"
  | "blob"
  | "heart"
  | "planet"
  | "dots"
  | "underline";

const paths: Record<DoodleName, ReactNode> = {
  star: <path d="M12 2l2.6 6.4L21 11l-6.4 2.6L12 20l-2.6-6.4L3 11l6.4-2.6z" />,
  sparkle: (
    <>
      <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
      <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" />
    </>
  ),
  smiley: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="9" cy="10" r="1" />
      <circle cx="15" cy="10" r="1" />
      <path d="M8.5 14.5a4.5 4.5 0 007 0" />
    </>
  ),
  flower: (
    <>
      <circle cx="12" cy="12" r="2.4" />
      <circle cx="12" cy="6.5" r="3" />
      <circle cx="12" cy="17.5" r="3" />
      <circle cx="6.5" cy="12" r="3" />
      <circle cx="17.5" cy="12" r="3" />
    </>
  ),
  arrow: <path d="M3 16c5 2 12 1 17-8m0 0l-5 1m5-1l1 5" />,
  squiggle: <path d="M2 14c3-6 5 6 8 0s5 6 8 0 4-2 4-2" />,
  blob: <path d="M12 3c5 0 9 3 9 7s-2 11-9 11-9-6-9-11 4-7 9-7z" />,
  heart: <path d="M12 20s-8-4.6-8-10a4.5 4.5 0 018-2.8A4.5 4.5 0 0120 10c0 5.4-8 10-8 10z" />,
  planet: (
    <>
      <circle cx="12" cy="11" r="6" />
      <path d="M3 15c4 3 14 3 18-2" />
    </>
  ),
  dots: (
    <>
      <circle cx="5" cy="12" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="19" cy="12" r="1.6" />
    </>
  ),
  underline: <path d="M3 15c5 3 13 3 18-1M5 19c4 2 10 2 14-1" />,
};

/** Hand-drawn style SVG icon. Purely decorative by default. */
export function Doodle({
  name,
  className,
  strokeWidth = 1.8,
  fill = false,
}: {
  name: DoodleName;
  className?: string;
  strokeWidth?: number;
  fill?: boolean;
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill={fill ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("size-6", className)}
    >
      {paths[name]}
    </svg>
  );
}

/** Cute icon inside a bordered rounded square. */
export function CuteIcon({
  name,
  tone = "mint",
  className,
}: {
  name: DoodleName;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex size-10 shrink-0 items-center justify-center rounded-xl border-[3px] border-hairline shadow-hard-sm",
        toneBg[tone],
        className,
      )}
    >
      <Doodle name={name} className="size-5 text-foreground" />
    </span>
  );
}

/** Floating decorative doodle. Absolutely positioned by the parent. */
export function FloatingShape({
  name,
  className,
  tone,
  delay = 0,
  spin = 0,
}: {
  name: DoodleName;
  className?: string;
  tone?: Tone;
  delay?: number;
  spin?: number;
}) {
  return (
    <span
      aria-hidden
      style={{ animationDelay: `${delay}ms`, ["--spin" as string]: `${spin}deg` }}
      className={cn(
        "animate-floaty pointer-events-none absolute",
        tone === "yellow" && "text-yellow",
        tone === "peach" && "text-peach",
        tone === "mint" && "text-mint",
        tone === "lavender" && "text-lavender",
        tone === "sky" && "text-sky",
        className,
      )}
    >
      <Doodle name={name} className="size-full" />
    </span>
  );
}

/** Soft pastel blob background layer. */
export function BlobBackground({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)}>
      <div className="halo absolute inset-0 opacity-70" />
      <div className="grid-lines absolute inset-0 opacity-40" />
    </div>
  );
}

/** Hand-drawn divider between sections. */
export function ScribbleDivider({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 600 16"
      preserveAspectRatio="none"
      className={cn("h-4 w-full text-foreground/50", className)}
    >
      <path
        d="M2 10c40-8 80 8 120 0s80-10 120-2 80 10 120 2 80-10 120-2 76 8 116 2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
