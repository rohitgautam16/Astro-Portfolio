/**
 * FocusMarquee - Scrolling tech ticker below the hero.
 * Uses CSS animation (no Framer Motion needed), but kept as React island
 * because it imports TechGlyph and Doodle which are React components.
 */
import { Doodle } from "@/components/react/decor";
import { TechGlyph } from "@/components/react/tech-icons";

export function FocusMarquee() {
  const marqueeTech = [
    "React",
    "Node.js",
    "TypeScript",
    "MongoDB",
    "Cloudflare",
    "Shopify",
    "Docker",
    "GitHub",
    "GSAP",
    "Framer Motion",
  ];
  const items = [...marqueeTech, ...marqueeTech];
  return (
    <div className="marquee-pause relative overflow-hidden border-y-[3px] border-hairline bg-yellow py-3.5 md:py-4">
      <div className="marquee-track flex w-max items-center gap-8 whitespace-nowrap md:gap-12">
        {items.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex items-center gap-8 font-display text-base font-extrabold uppercase tracking-tight md:gap-12 md:text-2xl"
          >
            <span className="flex items-center gap-2.5">
              <span className="grid size-8 place-items-center rounded-lg border-2 border-hairline bg-card md:size-9">
                <TechGlyph name={item} className="size-4 md:size-4.5" />
              </span>
              {item}
            </span>
            <Doodle name="star" fill className="size-3.5 shrink-0 md:size-4" />
          </span>
        ))}
      </div>
    </div>
  );
}
