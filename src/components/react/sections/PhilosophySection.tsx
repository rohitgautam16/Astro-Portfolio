import { philosophy } from "@/data/site";
import { Doodle } from "@/components/react/decor";
import { Reveal } from "@/components/react/motion";

export function PhilosophySection() {
  return (
    <section className="container-page py-24 md:py-36">
      <Reveal>
        <p className="hand text-2xl">engineering philosophy</p>
        <h2 className="mt-3 max-w-3xl font-display text-4xl leading-[0.95] font-extrabold md:text-6xl">
          Four rules I keep coming back to
        </h2>
      </Reveal>
      <div className="mt-16 grid gap-px overflow-hidden rounded-[28px] border-[3px] border-hairline bg-hairline md:grid-cols-2">
        {philosophy.map((item, i) => (
          <Reveal key={item.no} delay={i * 0.06} className="bg-card">
            <div className="group h-full p-8 transition-colors duration-300 hover:bg-lavender md:p-12">
              <p className="font-mono text-sm text-muted-foreground">{item.no}</p>
              <h3 className="mt-6 font-display text-2xl leading-tight font-extrabold md:text-3xl">
                {item.title}
              </h3>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-foreground/75 md:text-base">
                {item.body}
              </p>
              <Doodle
                name="arrow"
                className="mt-8 size-8 opacity-0 transition-all duration-300 group-hover:translate-x-2 group-hover:opacity-100"
              />
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
