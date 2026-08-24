import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/site";
import { Badge, type Tone, toneBg } from "@/components/react/decor";
import { Parallax, Tilt } from "@/components/react/motion";
import { cn } from "@/lib/utils";

const tones: Tone[] = ["mint", "lavender", "peach", "sky", "yellow"];

/**
 * Premium project row: oversized screenshot on one side, editorial detail on the
 * other, alternating direction down the page.
 */
export function ProjectCard({
  project,
  index = 0,
  priority = false,
}: {
  project: Project;
  index?: number;
  priority?: boolean;
}) {
  const tone = tones[index % tones.length]!;
  const flip = index % 2 === 1;

  return (
    <Tilt max={3} className="group relative">
      <a
        href={`/projects/${project.slug}`}
        className={cn(
          "relative grid items-stretch gap-0 overflow-hidden rounded-[28px] border-[3px] border-hairline bg-card shadow-hard transition-shadow duration-300 hover:shadow-hard-lg md:grid-cols-[1.15fr_1fr]",
        )}
      >
        <div
          className={cn(
            "relative overflow-hidden border-b-[3px] border-hairline bg-surface md:border-b-0",
            flip ? "md:order-2 md:border-l-[3px]" : "md:border-r-[3px]",
          )}
        >
          <Parallax distance={18} className="aspect-16/10 w-full">
            {project.image.endsWith(".mp4") || project.image.endsWith(".webm") ? (
              <video
                src={project.image}
                autoPlay
                loop
                muted
                playsInline
                className="size-full scale-[1.06] object-cover transition-transform duration-700 ease-out group-hover:scale-[1.14]"
              />
            ) : (
              <img
                src={project.image}
                alt={`${project.title} product interface`}
                width={1600}
                height={1000}
                loading="lazy"
                decoding="async"
                className="size-full scale-[1.06] object-cover transition-transform duration-700 ease-out group-hover:scale-[1.14]"
              />
            )}
          </Parallax>
          <span
            className={cn(
              "absolute left-5 top-5 rounded-full border-[3px] border-hairline px-3 py-1 font-display text-[11px] font-extrabold uppercase tracking-widest text-black shadow-hard-sm",
              toneBg[tone],
            )}
          >
            {project.status}
          </span>
        </div>

        <div className={cn("flex flex-col justify-between p-7 md:p-10", flip && "md:order-1")}>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              {String(index + 1).padStart(2, "0")} - {project.kind} · {project.year}
            </p>
            <h3 className="mt-4 font-display text-2xl leading-[1.05] font-extrabold text-balance md:text-4xl">
              {project.title}
            </h3>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-foreground/80 md:text-base">
              {project.summary}
            </p>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-2">
            {project.stack.slice(0, 4).map((tech) => (
              <Badge key={tech} tone="paper">
                {tech}
              </Badge>
            ))}
            <span className="ml-auto inline-flex items-center gap-2 font-display text-sm font-extrabold">
              Case study
              <span className="grid size-9 place-items-center rounded-full border-[3px] border-hairline bg-yellow transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-12">
                <ArrowUpRight aria-hidden className="size-4" />
              </span>
            </span>
          </div>
        </div>
      </a>
    </Tilt>
  );
}
