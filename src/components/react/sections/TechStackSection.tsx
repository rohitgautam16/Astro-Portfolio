import { techMatrix } from "@/data/site";
import { Doodle } from "@/components/react/decor";
import { Reveal } from "@/components/react/motion";
import { ToolCard } from "@/components/react/ToolCard";

export function TechStackSection() {
  const totalTools = techMatrix.reduce((n, group) => n + group.items.length, 0);

  return (
    <section className="relative border-y-[3px] border-hairline bg-card section-y">
      <div className="container-page">
        <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:h-fit">
            <Reveal>
              <p className="hand text-2xl">tech stack</p>
              <h2 className="mt-3 font-display text-4xl leading-[0.95] font-extrabold md:text-6xl">
                Tools I reach for
              </h2>
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-foreground/75">
                Chosen because they are boring in production and pleasant in development - in that order. Grouped by how I actually use them across the stack.
              </p>
              <div className="mt-8 inline-flex -rotate-1 items-center gap-3 rounded-2xl border-[3px] border-hairline bg-surface px-4 py-3 shadow-hard-sm">
                <Doodle name="dots" className="size-5" />
                <span className="hand text-xl">{totalTools} tools, no tourism</span>
              </div>
            </Reveal>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            {techMatrix.map((group, gi) => (
              <section key={group.category} aria-labelledby={`matrix-${group.category}`}>
                <h4
                  id={`matrix-${group.category}`}
                  className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground"
                >
                  {group.category}
                  <span aria-hidden className="h-[3px] flex-1 rounded-full bg-hairline/25" />
                </h4>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {group.items.map((item, i) => (
                    <ToolCard
                      key={item}
                      name={item}
                      category={group.category}
                      index={gi * 2 + i}
                      className="h-full"
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
