import { useMemo, useState } from "react";
import { insights, categories, categoryMeta, kindMeta, type Insight } from "@/data/insights";
import { Badge, Sticker, toneBg } from "@/components/react/decor";
import { Reveal } from "@/components/react/motion";
import { cn } from "@/lib/utils";

import type { Article } from "@/lib/cms/types";

const sorts = ["Newest", "Popular", "Recently updated", "Quickest read"] as const;

function score(item: Article | Insight, q: string) {
  const hay = [item.title, item.description, item.category, item.difficulty, ...item.tags]
    .join(" ")
    .toLowerCase();
  return q.split(/\s+/).filter(Boolean).every((t) => hay.includes(t));
}

export function BlogList({ initialItems }: { initialItems?: Article[] }) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string | null>(null);
  const [kind, setKind] = useState<string | null>(null);
  const [sort, setSort] = useState<(typeof sorts)[number]>("Newest");

  const sourceData = initialItems && initialItems.length > 0 ? initialItems : insights;

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    let out = sourceData.filter(
      (i) => (!cat || i.category === cat) && (!kind || i.kind === kind) && (!q || score(i, q)),
    );
    out = [...out].sort((a, b) => {
      if (sort === "Popular") return b.views - a.views;
      if (sort === "Recently updated") return b.updated.localeCompare(a.updated);
      if (sort === "Quickest read") return a.readingTime - b.readingTime;
      return b.published.localeCompare(a.published);
    });
    return out;
  }, [query, cat, kind, sort]);

  return (
    <>
      <section className="container-page pb-6">
        <div className="rounded-3xl border-[3px] border-hairline bg-surface p-4 shadow-hard md:p-5">
          <label className="sr-only" htmlFor="blog-search">
            Search articles
          </label>
          <input
            id="blog-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, technology, tag or difficulty…"
            className="w-full rounded-2xl border-[3px] border-hairline bg-card px-4 py-3 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <FilterChip active={!kind} onClick={() => setKind(null)}>
              All types
            </FilterChip>
            {(Object.keys(kindMeta) as (keyof typeof kindMeta)[]).map((k) => (
              <FilterChip key={k} active={kind === k} onClick={() => setKind(k)} tone={kindMeta[k].tone}>
                {kindMeta[k].label}
              </FilterChip>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <FilterChip active={!cat} onClick={() => setCat(null)}>
              All topics
            </FilterChip>
            {categories.map((c) => (
              <FilterChip key={c.name} active={cat === c.name} onClick={() => setCat(c.name)} tone={c.tone}>
                {c.name}
              </FilterChip>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t-[3px] border-dashed border-hairline/30 pt-4">
            <span className="hand text-lg">sort</span>
            {sorts.map((s) => (
              <FilterChip key={s} active={sort === s} onClick={() => setSort(s)}>
                {s}
              </FilterChip>
            ))}
            <span className="ml-auto font-mono text-xs text-muted-foreground">
              {list.length} {list.length === 1 ? "result" : "results"}
            </span>
          </div>
        </div>
      </section>

      <section className="container-page grid gap-7 pb-20 md:grid-cols-2">
        {list.map((item, index) => (
          <Reveal key={item.slug} y={30} delay={index * 0.04}>
            <ArticleCard item={item} />
          </Reveal>
        ))}
        {list.length === 0 ? (
          <p className="hand text-2xl col-span-2 text-center py-12">Nothing matches that - try a broader search.</p>
        ) : null}
      </section>
    </>
  );
}

function FilterChip({
  children,
  active,
  onClick,
  tone,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick: () => void;
  tone?: keyof typeof toneBg;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border-[3px] border-hairline px-3 py-1 font-mono text-[11px] transition-transform hover:-translate-y-0.5",
        active ? cn(toneBg[tone ?? "yellow"], "shadow-hard-sm") : "bg-card",
      )}
    >
      {children}
    </button>
  );
}

export function ArticleCard({ item }: { item: Insight }) {
  const meta = categoryMeta(item.category);
  return (
    <a
      href={`/blog/${item.slug}`}
      className="group block h-full overflow-hidden rounded-3xl border-[3px] border-hairline bg-card shadow-hard transition-transform duration-300 hover:-translate-y-1.5 hover:shadow-hard-lg"
    >
      <div className="relative overflow-hidden rounded-t-[1.25rem] border-b-[3px] border-hairline">
        <div
          className={cn(
            "flex aspect-16/7 items-center justify-center transition-transform duration-500 group-hover:scale-[1.06]",
            toneBg[meta.tone],
          )}
          role="img"
          aria-label={`Cover illustration for ${item.title}`}
        >
          <span className="font-display text-6xl font-extrabold opacity-70">{meta.glyph}</span>
        </div>
        {item.featured ? (
          <span className="absolute right-3 top-3 rounded-full border-[3px] border-hairline bg-yellow px-2.5 py-0.5 font-display text-[10px] font-extrabold uppercase shadow-hard-sm">
            Featured
          </span>
        ) : null}
      </div>
      <div className="p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={meta.tone}>{item.category}</Badge>
          <Badge tone="paper">{item.difficulty}</Badge>
          <span className="font-mono text-[11px] text-muted-foreground">
            {item.readingTime} min · {new Date(item.published).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
          </span>
        </div>
        <h2 className="mt-3 font-display text-xl leading-tight font-extrabold md:text-2xl">
          <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_2px] bg-left-bottom bg-no-repeat transition-[background-size] duration-300 group-hover:bg-[length:100%_2px]">
            {item.title}
          </span>
        </h2>
        <p className="mt-2.5 text-sm leading-relaxed text-foreground/75">{item.description}</p>
      </div>
    </a>
  );
}
