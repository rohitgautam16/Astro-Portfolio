import { ArrowRight, Mail } from "lucide-react";
import { profile } from "@/data/site";
import { Magnetic, Parallax, Reveal } from "@/components/react/motion";
import { ScribbleDivider } from "@/components/react/decor";

export function ContactCta() {
  return (
    <section className="container-page pb-24">
      <ScribbleDivider className="mb-16" />
      <Reveal>
        <div className="relative overflow-hidden rounded-[28px] border-[3px] border-hairline bg-mint px-8 py-16 text-center shadow-hard-lg md:px-16 md:py-24">
          <Parallax distance={20} className="pointer-events-none absolute inset-0 -z-10">
            <div className="halo size-full opacity-50" />
          </Parallax>
          <p className="hand text-2xl">say hello</p>
          <h2 className="mx-auto mt-4 max-w-3xl font-display text-4xl leading-[0.95] font-extrabold text-balance md:text-6xl">
            Got a product that needs to actually ship?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-foreground/80 md:text-base">
            Full stack builds, Shopify apps, AI automation or a rescue mission on something that
            got complicated. I reply to everything.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Magnetic>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border-[3px] border-hairline bg-card px-7 py-3.5 font-display text-sm font-extrabold shadow-hard transition-transform hover:-translate-y-0.5"
              >
                Start a conversation <ArrowRight className="size-4" aria-hidden />
              </a>
            </Magnetic>
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-2 rounded-full border-[3px] border-hairline bg-yellow px-7 py-3.5 font-display text-sm font-extrabold shadow-hard transition-transform hover:-translate-y-0.5"
            >
              <Mail className="size-4" aria-hidden /> {profile.email}
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
