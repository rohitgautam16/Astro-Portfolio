import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Hand-drawn engineer mascot. Idle-floats, tilts its head and blinks on an
 * irregular timer so it never reads as a static illustration.
 */
export function Mascot({
  className,
  wave = false,
}: {
  className?: string;
  wave?: boolean;
}) {
  const reduced = useReducedMotion();
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    if (reduced) return;
    let timer: number;
    const loop = () => {
      timer = window.setTimeout(() => {
        setBlink(true);
        window.setTimeout(() => setBlink(false), 130);
        loop();
      }, 2200 + Math.random() * 3200);
    };
    loop();
    return () => window.clearTimeout(timer);
  }, [reduced]);

  return (
    <motion.svg
      role="img"
      aria-label="Illustration of a developer at a laptop"
      viewBox="0 0 200 200"
      className={cn("size-40", className)}
      animate={reduced ? {} : { y: [0, -7, 0] }}
      transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      fill="none"
      stroke="currentColor"
      strokeWidth={4}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* desk shadow */}
      <ellipse cx="100" cy="182" rx="58" ry="7" className="fill-foreground/10" stroke="none" />

      {/* body */}
      <path d="M62 168v-24c0-19 17-31 38-31s38 12 38 31v24" className="fill-lavender" />

      {/* head group with idle tilt */}
      <motion.g
        animate={reduced ? {} : { rotate: [-2.5, 2.5, -2.5] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        style={{ originX: "100px", originY: "110px" }}
      >
        <rect x="66" y="46" width="68" height="66" rx="22" className="fill-peach" />
        {/* hair */}
        <path d="M66 68c2-18 16-26 34-26s32 8 34 26c-8-6-20-9-34-9s-26 3-34 9z" className="fill-foreground" />
        {/* eyes */}
        <motion.g animate={{ scaleY: blink ? 0.08 : 1 }} transition={{ duration: 0.08 }} style={{ originY: "82px" }}>
          <circle cx="86" cy="82" r="4.5" className="fill-foreground" stroke="none" />
          <circle cx="114" cy="82" r="4.5" className="fill-foreground" stroke="none" />
        </motion.g>
        {/* smile */}
        <path d="M89 95c4 5 18 5 22 0" />
        {/* headphones */}
        <path d="M62 78a38 38 0 0 1 76 0" />
        <rect x="54" y="74" width="14" height="22" rx="6" className="fill-yellow" />
        <rect x="132" y="74" width="14" height="22" rx="6" className="fill-yellow" />
      </motion.g>

      {/* laptop */}
      <rect x="58" y="150" width="84" height="10" rx="4" className="fill-card" />
      <path d="M70 150v-22h60v22" className="fill-mint" />
      <path d="M82 136h18M82 144h30" strokeWidth={3} />

      {/* waving / typing arm */}
      <motion.path
        d={wave ? "M138 140l18-16" : "M138 146l14 6"}
        animate={reduced ? {} : wave ? { rotate: [0, 18, 0] } : { y: [0, -3, 0] }}
        transition={{ duration: wave ? 1.6 : 1.1, repeat: Infinity, ease: "easeInOut" }}
        style={{ originX: "138px", originY: "146px" }}
      />
      <path d="M62 146l-14 6" />

      {/* floating sparkle */}
      <motion.path
        d="M158 46l3 8 8 3-8 3-3 8-3-8-8-3 8-3z"
        className="fill-yellow"
        strokeWidth={3}
        animate={reduced ? {} : { opacity: [0.4, 1, 0.4], scale: [0.9, 1.1, 0.9] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{ originX: "161px", originY: "57px" }}
      />
    </motion.svg>
  );
}
