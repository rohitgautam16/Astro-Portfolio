import { currentlyBuilding } from "@/data/site";
import { Reveal } from "@/components/react/motion";

export function BuildingSection() {
  return (
    <section className="relative border-y-[3px] border-hairline bg-lavender py-24 md:py-32">
      <div className="container-page">
        <Reveal className="max-w-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em]">currently building</p>
          <h2 className="mt-4 font-display text-4xl leading-[0.95] font-extrabold md:text-6xl">
            Open tabs, in progress
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {currentlyBuilding.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.05} className="w-full">
              <div
                style={{ transform: `rotate(${i % 2 ? 1.4 : -1.4}deg)` }}
                className="poke h-full w-full rounded-2xl border-[3px] border-hairline bg-card p-6 shadow-hard"
              >
                <p className="font-display text-xl font-extrabold">{item.title}</p>
                <p className="mt-2 text-sm text-foreground/70">{item.note}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
