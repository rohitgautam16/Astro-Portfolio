import { certifications } from "@/data/site";
import { Doodle } from "@/components/react/decor";
import { Reveal } from "@/components/react/motion";

export function CertificationsSection() {
  return (
    <section className="container-page py-24 md:py-32">
      <div className="grid gap-10 md:grid-cols-[0.7fr_1.3fr] md:items-center">
        <Reveal>
          <p className="hand text-2xl">certifications</p>
          <h2 className="mt-3 font-display text-3xl leading-[0.95] font-extrabold md:text-5xl">
            Verified on paper too
          </h2>
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:gap-8">
          {certifications.map((cert, i) => (
            <Reveal key={cert.title} delay={i * 0.08} className="h-full">
              <div className="relative h-full rounded-2xl border-[3px] border-hairline bg-sky p-6 shadow-hard">
                <span className="absolute right-5 top-5">
                  <Doodle name="star" fill className="size-6" />
                </span>
                <p className="font-mono text-[11px] uppercase tracking-widest">{cert.org}</p>
                <h3 className="mt-3 max-w-[15ch] font-display text-lg leading-tight font-extrabold">
                  {cert.title}
                </h3>
                <p className="mt-3 text-sm text-foreground/75">{cert.detail}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
