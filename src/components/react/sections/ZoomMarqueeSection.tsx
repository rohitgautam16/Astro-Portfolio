import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { profile } from "@/data/site";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function ZoomMarqueeSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const marquee1Ref = useRef<HTMLDivElement>(null);
  const marquee2Ref = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const marquee1 = marquee1Ref.current;
    const marquee2 = marquee2Ref.current;
    const image = imageRef.current;

    if (!container || !marquee1 || !marquee2 || !image) return;

    // Create GSAP ScrollTrigger timeline inside context
    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768;
      const startVal = isMobile ? "top 25%" : "top top";
      const endVal = isMobile ? "+=100%" : "+=190%";

      const m1Y = isMobile ? -280 : -60;
      const m2Y = isMobile ? 220 : 60;

      // 1. Slide marquees in from offscreen as soon as the container enters the viewport
      gsap.fromTo(
        marquee1,
        { x: "-100vw", y: m1Y, rotate: -6, opacity: 0 },
        {
          x: "0vw",
          y: m1Y,
          rotate: -6,
          opacity: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: container,
            start: "top 90%",
            end: startVal,
            scrub: 1,
          },
        }
      );

      gsap.fromTo(
        marquee2,
        { x: "100vw", y: m2Y, rotate: 6, opacity: 0 },
        {
          x: "0vw",
          y: m2Y,
          rotate: 6,
          opacity: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: container,
            start: "top 90%",
            end: startVal,
            scrub: 1,
          },
        }
      );

      // 2. Pin container and expand the center image card
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: startVal,
          end: endVal,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.fromTo(
        image,
        {
          scale: 0.85,
          clipPath: "inset(50% 50% 50% 50%)",
          rotate: -8,
        },
        {
          scale: 1,
          clipPath: "inset(0% 0% 0% 0%)",
          rotate: 0,
          ease: "power2.out",
        },
        0
      )
        .fromTo(
          ".reveal-img",
          { scale: 1.3 },
          { scale: 1.0, ease: "power2.out" },
          0
        );
    }, container);

    return () => ctx.revert();
  }, []);

  const marquee1Items = Array(15).fill("CODE IS THE IMPLEMENTATION");
  const marquee2Items = Array(15).fill("THE PRODUCT IS THE POINT.");

  return (
    <section
      ref={containerRef}
      className="relative flex h-[60vh] md:h-screen w-full flex-col items-center justify-center"
    >
      {/* Background Diagonal crossed ribbons */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
        {/* Ribbon 1: Top-Left to Bottom-Right */}
        <div
          ref={marquee1Ref}
          className="absolute w-[200vw] py-3.5 bg-yellow border-y-[3px] border-hairline shadow-hard -rotate-6 -translate-y-[320px] md:-translate-y-[60px] origin-center flex overflow-hidden"
        >
          <div className="marquee-track flex w-max items-center gap-8 whitespace-nowrap">
            {marquee1Items.map((item, i) => (
              <span
                key={`m1-${i}`}
                className="flex items-center gap-8 font-hand text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-wide text-foreground"
              >
                <span>{item}</span>
                <span className="text-xl sm:text-2xl font-sans font-extrabold text-foreground/70">✦</span>
              </span>
            ))}
          </div>
        </div>

        {/* Ribbon 2: Bottom-Left to Top-Right */}
        <div
          ref={marquee2Ref}
          className="absolute w-[200vw] py-3.5 bg-lavender border-y-[3px] border-hairline shadow-hard rotate-6 translate-y-[320px] md:translate-y-[60px] origin-center flex overflow-hidden"
        >
          <div className="marquee-track-reverse flex w-max items-center gap-8 whitespace-nowrap">
            {marquee2Items.map((item, i) => (
              <span
                key={`m2-${i}`}
                className="flex items-center gap-8 font-hand text-xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-wide text-foreground"
              >
                <span>{item}</span>
                <span className="text-xl sm:text-2xl font-sans font-extrabold text-foreground/70">✦</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Center Image Container */}
      <div
        ref={imageRef}
        className="relative z-10 flex flex-col items-center justify-center p-4"
        style={{ clipPath: "inset(50% 50% 50% 50%)" }}
      >
        <div className="relative overflow-hidden rounded-[32px] border-[3px] border-hairline bg-card p-4 shadow-hard-lg w-[90vw] sm:w-[80vw] md:w-[75vw] max-w-[850px] md:aspect-auto transition-all duration-300 flex flex-col justify-center">
          <span
            aria-hidden
            className="tape-strip absolute -top-3 left-10 h-6 w-24 -rotate-6 rounded-[2px]"
          />

          <div className="relative w-full h-full overflow-hidden rounded-[20px]">
            {/* Desktop 16:9 Landscape Image */}
            <img
              src="./images/featured-img-landscape.webp"
              alt="Desktop preview"
              className="reveal-img hidden md:block rounded-[20px] border-[3.5px] border-hairline object-contain aspect-auto w-full"
            />

            {/* Mobile Portrait Image */}
            <img
              src="./images/featured-img-portrait.webp"
              alt={profile.name}
              className="reveal-img block md:hidden rounded-[20px] border-[3.5px] border-hairline object-cover aspect-[3/4] w-full"
            />
          </div>

          <div className="mt-1 flex flex-col items-center text-center px-2 sm:px-4">
            <h3 className="font-display text-base sm:text-xl md:text-2xl font-extrabold leading-tight text-foreground tracking-tight">
              I STOPPED CHASING TECHNOLOGY.
              <br />
              <span className="bg-yellow px-2.5 py-1 rounded-xl border-[2.5px] border-hairline inline-block mt-1.5 -rotate-1 shadow-hard-sm">
                I STARTED CHASING PROBLEMS.
              </span>
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
}
