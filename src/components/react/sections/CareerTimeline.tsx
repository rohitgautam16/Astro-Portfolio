import { ArrowRight } from "lucide-react";
import { experience, timeline } from "@/data/site";
import { Reveal } from "@/components/react/motion";

export function CareerTimeline() {
  const role = experience[0]!;

  return (
    <section className="container-page py-24 md:py-36">
      <div className="grid gap-16 lg:grid-cols-[0.75fr_1.25fr]">
        <div className="lg:sticky lg:top-28 lg:h-fit">
          <Reveal>
            <p className="hand text-2xl">career timeline</p>
            <h2 className="mt-3 font-display text-4xl leading-[0.95] font-extrabold md:text-5xl">
              The path so far
            </h2>
            <div className="mt-8 rotate-[-1.5deg] rounded-2xl border-[3px] border-hairline bg-peach p-6 shadow-hard">
              <p className="font-mono text-[11px] uppercase tracking-widest">now</p>
              <p className="mt-2 font-display text-xl font-extrabold">{role.role}</p>
              <p className="text-sm">{role.company}</p>
              <a
                href="/experience"
                className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold underline decoration-[3px] underline-offset-4"
              >
                Full experience <ArrowRight className="size-4" aria-hidden />
              </a>
            </div>
          </Reveal>
        </div>

        <ol className="relative border-l-[3px] border-dashed border-hairline pl-8 md:pl-12">
          {timeline.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.05} className="relative pb-12 last:pb-0">
              <span className="absolute -left-[2.6rem] top-1 grid size-6 place-items-center rounded-full border-[3px] border-hairline bg-yellow md:-left-[3.85rem]" />
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                {item.period}
              </p>
              <h3 className="mt-2 font-display text-xl font-extrabold md:text-2xl">{item.title}</h3>
              <p className="mt-2 max-w-lg text-sm leading-relaxed text-foreground/75 md:text-base">
                {item.detail}
              </p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
