import { ArrowRight } from "lucide-react";
import { profile } from "@/data/site";
import { Reveal } from "@/components/react/motion";

export function IntroSection() {
  return (
    <section className="container-page py-24 md:py-36">
      <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
        <Reveal className="lg:sticky lg:top-28 lg:h-fit">
          <p className="hand text-2xl">a short introduction</p>
          <h2 className="mt-3 font-display text-4xl leading-[0.95] font-extrabold md:text-6xl">
            I build the
            <br />
            <span className="bg-mint px-2 -rotate-1 inline-block border-[3px] border-hairline">
              whole thing
            </span>
          </h2>
        </Reveal>
        <div className="space-y-7">
          {profile.summary.map((paragraph, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <p
                className={
                  i === 0
                    ? "text-xl leading-relaxed font-medium md:text-2xl"
                    : "text-base leading-relaxed text-foreground/75 md:text-lg"
                }
              >
                {paragraph}
              </p>
            </Reveal>
          ))}
          <Reveal delay={0.2}>
            <a
              href="/about"
              className="inline-flex items-center gap-2 font-display text-sm font-extrabold underline decoration-[3px] underline-offset-8 hover:decoration-wavy"
            >
              More about how I work
              <ArrowRight className="size-4" aria-hidden />
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
