import { motion, useReducedMotion } from "framer-motion";
import { TechGlyph, hasGlyph } from "./tech-icons";
import { cn } from "@/lib/utils";
import type { Tone } from "./decor";
import { toneBg } from "./decor";

/**
 * Premium tool card: official logo, name and optional category, wrapped in the
 * neo-brutalist ink border with a spring hover lift.
 */
export function ToolCard({
  name,
  category,
  index = 0,
  className,
}: {
  name: string;
  category?: string;
  index?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 18, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.035, 0.4), ease: [0.22, 1, 0.36, 1] }}
      whileHover={reduced ? {} : { y: -5, rotate: index % 2 ? 1.2 : -1.2 }}
      className={cn(
        "group flex min-w-0 items-center gap-3 rounded-2xl border-[3px] border-hairline bg-card px-3.5 py-3 shadow-hard-sm transition-shadow duration-200 hover:shadow-hard",
        className,
      )}
    >
      <span className="grid size-9 shrink-0 place-items-center rounded-xl border-2 border-hairline bg-surface transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110">
        {hasGlyph(name) ? (
          <TechGlyph name={name} className="size-4.5" />
        ) : (
          <span className="font-display text-xs font-extrabold">{name.slice(0, 2)}</span>
        )}
      </span>
      <span className="min-w-0">
        <span className="block truncate font-display text-sm font-extrabold leading-tight">
          {name}
        </span>
        {category ? (
          <span className="block truncate font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {category}
          </span>
        ) : null}
      </span>
    </motion.div>
  );
}

/** Compact bordered chip with a logo — used inside skill category cards. */
export function ToolChip({ name, level }: { name: string; level?: string }) {
  return (
    <span className="group inline-flex max-w-full items-center gap-2 rounded-xl border-2 border-hairline bg-card px-2.5 py-1.5 shadow-hard-sm transition-transform duration-200 hover:-translate-y-0.5 hover:-rotate-1">
      {hasGlyph(name) ? (
        <TechGlyph name={name} className="size-3.5 shrink-0 transition-transform duration-300 group-hover:scale-125" />
      ) : null}
      <span className="truncate font-mono text-[11px] font-medium">{name}</span>
      {level ? (
        <span className="hidden shrink-0 rounded-full bg-surface px-1.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground sm:inline">
          {level}
        </span>
      ) : null}
    </span>
  );
}

/** Category card holding a set of tool chips. */
export function SkillCard({
  category,
  note,
  tone,
  items,
  index = 0,
}: {
  category: string;
  note: string;
  tone: Tone;
  items: { name: string; level: string }[];
  index?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      whileHover={reduced ? {} : { y: -6 }}
      className="flex h-full flex-col overflow-hidden rounded-[22px] border-[3px] border-hairline bg-card shadow-hard transition-shadow duration-300 hover:shadow-hard-lg"
    >
      <div className={cn("h-3 w-full border-b-[3px] border-hairline", toneBg[tone])} />
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-lg font-extrabold sm:text-xl">{category}</h3>
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {items.length} tools
          </span>
        </div>
        <p className="mt-1 hand text-lg text-foreground/70">{note}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {items.map((item) => (
            <ToolChip key={item.name} name={item.name} level={item.level} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Premium toolkit card for the About page grid: category header with an icon,
 * a divider that grows on reveal, and branded technology pills.
 */
export function ToolkitCard({
  category,
  note,
  tone,
  items,
  index = 0,
}: {
  category: string;
  note: string;
  tone: Tone;
  items: { name: string; level: string }[];
  index?: number;
}) {
  const reduced = useReducedMotion();
  const lead = items.find((item) => hasGlyph(item.name))?.name;
  return (
    <motion.article
      initial={reduced ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      whileHover={reduced ? {} : { y: -6 }}
      className="group relative flex h-full flex-col rounded-[24px] border-[3px] border-hairline bg-card p-6 shadow-hard transition-shadow duration-300 hover:shadow-hard-lg sm:p-7"
      style={{ backgroundImage: "var(--paper-texture)", backgroundSize: "16px 16px" }}
    >
      <div className="flex min-w-0 items-center gap-3">
        <span
          className={cn(
            "grid size-11 shrink-0 place-items-center rounded-xl border-[3px] border-hairline transition-transform duration-300 group-hover:-rotate-12",
            toneBg[tone],
          )}
        >
          {lead ? <TechGlyph name={lead} className="size-5" /> : null}
        </span>
        <h3 className="min-w-0 truncate font-display text-xl font-extrabold sm:text-2xl">
          {category}
        </h3>
      </div>

      <motion.span
        aria-hidden
        initial={reduced ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.15 + index * 0.07, ease: [0.22, 1, 0.36, 1] }}
        className="mt-5 block h-[3px] w-full origin-left rounded-full bg-hairline"
      />

      <p className="mt-4 hand text-lg text-foreground/70">{note}</p>

      <ul className="mt-5 flex flex-wrap gap-2">
        {items.map((item, i) => (
          <motion.li
            key={item.name}
            initial={reduced ? false : { opacity: 0, scale: 0.85, y: 8 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: 0.2 + i * 0.04 }}
          >
            <span className="group/pill inline-flex max-w-full cursor-default items-center gap-2 rounded-xl border-2 border-hairline bg-surface px-2.5 py-1.5 shadow-hard-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-hard">
              {hasGlyph(item.name) ? (
                <TechGlyph
                  name={item.name}
                  className="size-3.5 shrink-0 transition-transform duration-300 group-hover/pill:scale-125 group-hover/pill:rotate-6"
                />
              ) : (
                <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-foreground" />
              )}
              <span className="truncate font-mono text-[11px] font-medium">{item.name}</span>
            </span>
          </motion.li>
        ))}
      </ul>

      <span className="mt-auto pt-6 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {items.length} technologies
      </span>
    </motion.article>
  );
}
