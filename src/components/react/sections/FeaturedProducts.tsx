import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { projects, type Project } from "@/data/site";
import { ProjectCard } from "@/components/react/ProjectCard";
import { Badge, type Tone, toneBg } from "@/components/react/decor";
import { Reveal } from "@/components/react/motion";
import { cn } from "@/lib/utils";

const tones: Tone[] = ["mint", "lavender", "peach", "sky", "yellow"];

/**
 * Clean, simple landscape project card for horizontal pinned scrolling.
 */
function HorizontalCard({
  project,
  index,
  total,
  progress,
}: {
  project: Project;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const reduced = useReducedMotion();
  const tone = tones[index % tones.length]!;

  // Strictly increasing interpolation ranges across [0, 1]
  let inputRanges: [number, number, number];
  let scaleValues: [number, number, number];
  let opacityValues: [number, number, number];
  let rotateValues: [number, number, number];

  if (index === 0) {
    inputRanges = [0, 0.08, 0.34];
    scaleValues = [1, 1, 0.92];
    opacityValues = [1, 1, 0.45];
    rotateValues = [0, 0, -1.5];
  } else if (index === total - 1) {
    inputRanges = [0.66, 0.92, 1];
    scaleValues = [0.92, 1, 1];
    opacityValues = [0.45, 1, 1];
    rotateValues = [1.5, 0, 0];
  } else {
    const center = index / (total - 1);
    const startIn = Math.max(0.01, center - 0.28);
    const endOut = Math.min(0.99, center + 0.28);
    inputRanges = [startIn, center, endOut];
    scaleValues = [0.92, 1, 0.92];
    opacityValues = [0.45, 1, 0.45];
    rotateValues = [1.5, 0, -1.5];
  }

  const scale = useTransform(progress, inputRanges, reduced ? [1, 1, 1] : scaleValues);
  const opacity = useTransform(progress, inputRanges, reduced ? [1, 1, 1] : opacityValues);
  const rotate = useTransform(progress, inputRanges, reduced ? [0, 0, 0] : rotateValues);

  return (
    <motion.div
      style={{
        scale,
        opacity,
        rotate,
        transformOrigin: "center center",
      }}
      className="w-[74vw] max-w-[920px] shrink-0"
    >
      <a
        href={`/projects/${project.slug}`}
        className="group relative grid h-[350px] xl:h-[390px] 2xl:h-[420px] items-stretch gap-0 overflow-hidden rounded-[28px] border-[3px] border-hairline bg-card shadow-hard transition-all duration-300 hover:shadow-hard-lg lg:grid-cols-[1.1fr_1fr]"
      >
        {/* Visual Showcase */}
        <div className="relative h-full overflow-hidden border-r-[3px] border-hairline bg-surface">
          <img
            src={project.image}
            alt={`${project.title} product interface`}
            width={1600}
            height={1000}
            className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading={index === 0 ? "eager" : "lazy"}
          />
          <span
            className={cn(
              "absolute left-4 top-4 rounded-full border-[3px] border-hairline px-3 py-1 font-display text-[11px] font-extrabold uppercase tracking-widest shadow-hard-sm",
              toneBg[tone],
            )}
          >
            {project.status}
          </span>
        </div>

        {/* Editorial Details */}
        <div className="flex h-full flex-col justify-between p-6 xl:p-8">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              {String(index + 1).padStart(2, "0")} - {project.kind} · {project.year}
            </p>

            <h3 className="mt-3 font-display text-2xl xl:text-3xl font-extrabold leading-tight text-balance">
              {project.title}
            </h3>

            <p className="mt-3 line-clamp-3 text-xs xl:text-sm leading-relaxed text-foreground/80">
              {project.summary}
            </p>
          </div>

          <div className="pt-2">
            <div className="flex flex-wrap items-center gap-1.5">
              {project.stack.slice(0, 4).map((tech) => (
                <Badge key={tech} tone="paper">
                  {tech}
                </Badge>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-end border-t border-hairline/15 pt-3">
              <span className="inline-flex items-center gap-2 font-display text-xs xl:text-sm font-extrabold">
                Case study
                <span className="grid size-8 place-items-center rounded-full border-[2px] border-hairline bg-yellow shadow-hard-sm transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:rotate-12">
                  <ArrowUpRight aria-hidden="true" className="size-3.5" />
                </span>
              </span>
            </div>
          </div>
        </div>
      </a>
    </motion.div>
  );
}

export function FeaturedProducts() {
  const featured = projects.slice(0, 4);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    mass: 0.2,
  });

  // Calculate translation across all 4 featured project cards
  const x = useTransform(smoothProgress, [0, 1], ["0%", "-66%"]);

  return (
    <>
      <section
        id="work"
        ref={containerRef}
        className="relative hidden lg:block"
        style={{ height: "340vh" }}
      >
        <div className="sticky top-0 flex h-screen w-full flex-col justify-center pt-[88px] pb-4 xl:pt-[96px] xl:pb-6">
          <div className="container-page pb-4 xl:pb-6">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                  featured products
                </p>
                <h2 className="mt-3 font-display text-3xl leading-[0.95] font-extrabold md:text-4xl xl:text-5xl">
                  Things I shipped,
                  <br />
                  not things I sketched
                </h2>
              </div>
              <a
                href="/projects"
                className="inline-flex items-center gap-2 rounded-full border-[3px] border-hairline bg-card px-5 py-2.5 font-display text-sm font-extrabold shadow-hard-sm transition-transform hover:-translate-y-0.5"
              >
                All projects <ArrowRight className="size-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Horizontal Sliding Track */}
          <div className="relative flex flex-1 items-center py-2">
            <motion.div
              style={{ x }}
              className="flex items-center gap-8 xl:gap-10 pl-[max(2rem,calc((100vw-1200px)/2))] pr-24 py-4"
            >
              {featured.map((project, index) => (
                <HorizontalCard
                  key={project.slug}
                  project={project}
                  index={index}
                  total={featured.length}
                  progress={smoothProgress}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </section>


      <section className="relative block lg:hidden py-20 mt-10">
        <div className="container-page">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                featured products
              </p>
              <h2 className="mt-4 font-display text-4xl leading-[0.95] font-extrabold md:text-6xl">
                Things I shipped,
                <br />
                not things I sketched
              </h2>
            </div>
            <a
              href="/projects"
              className="inline-flex items-center gap-2 rounded-full border-[3px] border-hairline bg-card px-5 py-2.5 font-display text-sm font-extrabold shadow-hard-sm transition-transform hover:-translate-y-0.5"
            >
              All projects <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          </Reveal>

          <div className="mt-14 flex flex-col gap-12">
            {featured.map((project, index) => (
              <Reveal key={project.slug} y={30}>
                <ProjectCard project={project} index={index} priority={index === 0} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
