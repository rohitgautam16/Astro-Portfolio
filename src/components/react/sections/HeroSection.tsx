/**
 * Hero section - React island for the homepage.
 * Preserves all Framer Motion animations unchanged from the TanStack Start version.
 */
import { ArrowRight, Download, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { profile, experience } from "@/data/site";
import { Doodle, FloatingShape, Sticker } from "@/components/react/decor";
import {
  Magnetic,
  PointerParallax,
  StaggerText,
  Tilt,
} from "@/components/react/motion";
import { PixelGrid, PixelReveal } from "@/components/react/pixel";
import { TechGlyph } from "@/components/react/tech-icons";
import { Mascot } from "@/components/react/Mascot";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden -mt-20 pt-28 pb-16 md:-mt-24 md:pt-36 md:pb-28">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="halo absolute inset-0 opacity-60" />
        <div className="grid-lines absolute inset-0 opacity-30" />
      </div>
      <FloatingShape name="star" tone="yellow" className="left-[4%] top-24 hidden size-10 md:block" spin={-12} />
      <FloatingShape name="squiggle" tone="mint" className="bottom-16 left-[10%] hidden size-14 md:block" delay={300} />

      <div className="container-page grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-8">
        <div className="relative z-10 lg:pr-6">
          <h1 className="font-display text-[2.4rem] leading-[0.94] font-extrabold tracking-tight sm:text-6xl lg:text-[5rem]">
            <StaggerText text="Rohit" perChar className="block" />
            <span className="relative block">
              <StaggerText text="Gautam" perChar delay={0.18} />
              <motion.span
                aria-hidden
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.9, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="absolute -bottom-1 left-0 h-3 w-[7.5ch] origin-left rounded-full bg-yellow -z-10"
              />
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, filter: "blur(8px)", y: 14 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ delay: 0.7, duration: 0.7 }}
            className="mt-7 max-w-xl text-base leading-relaxed text-balance text-foreground/80 md:text-lg"
          >
            {profile.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Magnetic>
              <a
                href="/projects"
                className="inline-flex items-center gap-2 rounded-full border-[3px] border-hairline bg-lavender px-6 py-3 font-display text-sm font-extrabold shadow-hard transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0.5"
              >
                View featured products
                <ArrowRight className="size-4" aria-hidden />
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border-[3px] border-hairline bg-card px-6 py-3 font-display text-sm font-extrabold shadow-hard-sm transition-transform duration-200 hover:-translate-y-0.5"
              >
                <Mail className="size-4" aria-hidden />
                Work with me
              </a>
            </Magnetic>
            <a
              href={profile.resumeUrl}
              className="inline-flex items-center gap-2 px-2 py-3 text-sm font-semibold underline decoration-[3px] underline-offset-4 hover:decoration-wavy"
            >
              <Download className="size-4" aria-hidden />
              Resume
            </a>
          </motion.div>
        </div>

        <HeroPortrait />
      </div>
    </section>
  );
}

/** Layered, tilting portrait composition - the visual anchor of the hero. */
function HeroPortrait() {
  const [flipped, setFlipped] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto w-full max-w-[19rem] sm:max-w-sm lg:mx-0 lg:ml-auto lg:max-w-[24rem]"
    >
      {/* layered background shapes */}
      <div
        aria-hidden
        className="absolute -right-3 -top-4 size-full rotate-6 rounded-[30px] border-[3px] border-hairline bg-mint"
      />
      <div
        aria-hidden
        className="absolute -left-4 top-5 size-full -rotate-4 rounded-[30px] border-[3px] border-hairline bg-lavender"
      />

      <PointerParallax strength={10}>
        <Tilt max={7} className="relative">
          <div className="relative [perspective:1400px]">
            <motion.div
              className="relative [transform-style:preserve-3d]"
              animate={{ rotateY: flipped ? 180 : 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                role="button"
                tabIndex={0}
                onClick={() => setFlipped(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setFlipped(true);
                  }
                }}
                className="relative cursor-pointer overflow-hidden rounded-[30px] border-[3px] border-hairline bg-surface shadow-hard-lg [backface-visibility:hidden]"
              >
                <span
                  aria-hidden
                  className="tape-strip absolute left-1/2 top-2 z-20 h-6 w-28 -translate-x-1/2 -rotate-3 rounded-[2px]"
                />
                <PixelReveal cols={9} rows={11} delay={0.25} className="aspect-4/5 w-full">
                  <HeroImageSwap />
                </PixelReveal>
                {/* frosted caption bar */}
                <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2 rounded-2xl border-[3px] border-hairline bg-card/85 px-3.5 py-2.5 backdrop-blur-sm">
                  <span className="min-w-0">
                    <span className="block truncate font-display text-sm font-extrabold">
                      {profile.name}
                    </span>
                    <span className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      {profile.role}
                    </span>
                  </span>
                  <span className="grid size-8 shrink-0 place-items-center rounded-full border-2 border-hairline bg-yellow">
                    <Doodle name="sparkle" className="size-4" />
                  </span>
                </div>
              </div>

              <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                <DeveloperId onFlipBack={() => setFlipped(false)} />
              </div>
            </motion.div>
          </div>
        </Tilt>
      </PointerParallax>

      {/* rotating badge */}
      <span className="absolute -left-5 -top-6 hidden sm:block">
        <Sticker tone="yellow" rotate={-10}>
          <Doodle name="star" fill className="size-3.5" /> Ships fast
        </Sticker>
      </span>
      <span className="absolute -bottom-6 -right-3 rotate-3">
        <Sticker tone="peach" rotate={6}>
          5 products shipped
        </Sticker>
      </span>
      <Mascot className="absolute -bottom-10 -left-10 hidden size-24 text-hairline lg:block" />
    </motion.div>
  );
}

/** Back face of the hero card - a chunky "Developer ID" badge. */
function DeveloperId({ onFlipBack }: { onFlipBack: () => void }) {
  const current = experience[0];
  return (
    <div className="flex size-full flex-col overflow-hidden rounded-[30px] border-[3px] border-hairline bg-card shadow-hard-lg">
      <div className="flex items-center justify-between gap-2 border-b-[3px] border-hairline bg-yellow px-4 py-2.5">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em]">Developer ID</span>
        <button
          type="button"
          onClick={onFlipBack}
          className="rounded-full border-2 border-hairline bg-card px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest transition-transform duration-200 hover:-translate-y-0.5"
        >
          Flip back
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3 p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl border-[3px] border-hairline bg-lavender font-display text-lg font-extrabold">
            RG
          </span>
          <span className="min-w-0">
            <span className="block truncate font-display text-lg font-extrabold leading-tight">
              {profile.name}
            </span>
            <span className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {profile.role}
            </span>
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {["React", "Node.js", "Shopify", "AI"].map((tech) => (
            <span
              key={tech}
              className="inline-flex items-center gap-1.5 rounded-full border-2 border-hairline bg-surface px-2 py-1 font-mono text-[10px]"
            >
              <TechGlyph name={tech} className="size-3" />
              {tech}
            </span>
          ))}
        </div>

        <dl className="grid grid-cols-2 gap-2">
          <div className="rounded-xl border-2 border-hairline bg-mint px-2.5 py-2">
            <dt className="font-mono text-[9px] uppercase tracking-widest">Experience</dt>
            <dd className="mt-0.5 font-display text-sm font-extrabold leading-tight">
              2+ years shipping
            </dd>
          </div>
          <div className="rounded-xl border-2 border-hairline bg-peach px-2.5 py-2">
            <dt className="font-mono text-[9px] uppercase tracking-widest">Currently</dt>
            <dd className="mt-0.5 font-display text-sm font-extrabold leading-tight">
              {current ? current.company : "Independent"}
            </dd>
          </div>
        </dl>

        <a
          href={profile.resumeUrl}
          download
          onClick={(e) => e.stopPropagation()}
          className="mt-auto inline-flex items-center justify-center gap-2 rounded-full border-[3px] border-hairline bg-yellow px-4 py-2.5 font-display text-sm font-extrabold shadow-hard-sm transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0.5"
        >
          <Download className="size-4" aria-hidden />
          Download résumé
        </a>
      </div>
    </div>
  );
}

const HERO_MODES = [
  { id: "illustration", src: "/images/illustration.webp", label: "Illustration" },
  { id: "photo", src: "/images/portrait.webp", label: "Portrait" },
] as const;

/** Pixel-dissolve swap between the illustrated avatar and the portrait. */
function HeroImageSwap() {
  const [index, setIndex] = useState(0);
  const [covered, setCovered] = useState(false);
  const mode = HERO_MODES[index]!;
  const next = HERO_MODES[(index + 1) % HERO_MODES.length]!;

  const swap = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (covered) return;
    setCovered(true);
    window.setTimeout(() => {
      setIndex((i) => (i + 1) % HERO_MODES.length);
      setCovered(false);
    }, 380);
  };

  return (
    <div className="relative size-full">
      <img
        src={mode.src}
        alt={`${profile.name}, software engineer`}
        width={1024}
        height={1280}
        fetchPriority="high"
        decoding="async"
        className="size-full object-cover"
      />
      <div className="pointer-events-none absolute inset-0">
        <PixelGrid
          cols={10}
          rows={12}
          state={covered ? "covered" : "clear"}
          duration={0.22}
          stagger={0.012}
          className="h-full w-full"
        />
      </div>
      <button
        type="button"
        onClick={swap}
        aria-label={`Switch to ${next.label.toLowerCase()}`}
        className="absolute right-3 top-3 z-20 inline-flex items-center gap-1.5 rounded-full border-[3px] border-hairline bg-card px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest shadow-hard-sm transition-transform duration-200 hover:-translate-y-0.5 hover:bg-mint active:translate-y-0.5"
      >
        <Doodle name="sparkle" fill className="size-3" />
        {next.label}
      </button>
    </div>
  );
}
