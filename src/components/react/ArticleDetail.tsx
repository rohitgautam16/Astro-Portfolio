import { useState, useEffect } from "react";
import type { Block, Insight } from "@/data/insights";
import { cn } from "@/lib/utils";
import { toneBg } from "@/components/react/decor";

const BASE = "https://rohitgautam.site";

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function ShareRow({ slug, title }: { slug: string; title: string }) {
  const url = `${BASE}/blog/${slug}`;
  const [copied, setCopied] = useState(false);
  return (
    <div className="mt-5 flex flex-wrap items-center gap-2">
      <a
        className="rounded-full border-[3px] border-hairline bg-card px-3 py-1 font-mono text-[11px] shadow-hard-sm"
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noreferrer noopener"
      >
        Share on X
      </a>
      <a
        className="rounded-full border-[3px] border-hairline bg-card px-3 py-1 font-mono text-[11px] shadow-hard-sm"
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noreferrer noopener"
      >
        Share on LinkedIn
      </a>
      <button
        type="button"
        onClick={() => {
          void navigator.clipboard.writeText(url);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1600);
        }}
        className="rounded-full border-[3px] border-hairline bg-yellow px-3 py-1 font-mono text-[11px] shadow-hard-sm"
      >
        {copied ? "Link copied" : "Copy link"}
      </button>
    </div>
  );
}

export function CodeBlock({ lang, code, caption }: { lang: string; code: string; caption?: string | undefined }) {
  const [copied, setCopied] = useState(false);
  return (
    <figure className="overflow-hidden rounded-2xl border-[3px] border-hairline shadow-hard-sm">
      <div className="flex items-center justify-between border-b-[3px] border-hairline bg-surface px-4 py-2">
        <span className="font-mono text-[11px] uppercase text-muted-foreground">{lang}</span>
        <button
          type="button"
          onClick={() => {
            void navigator.clipboard.writeText(code);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1600);
          }}
          className="rounded-full border-2 border-hairline bg-card px-2.5 py-0.5 font-mono text-[10px]"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto bg-card p-4 text-[13px] leading-relaxed">
        <code className="font-mono">{code}</code>
      </pre>
      {caption ? (
        <figcaption className="border-t-[3px] border-dashed border-hairline/30 bg-surface px-4 py-2 font-mono text-[11px] text-muted-foreground">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

export function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "h2":
      return (
        <h2
          id={slugify(block.text)}
          className="scroll-mt-28 pt-4 font-display text-2xl font-extrabold md:text-3xl"
        >
          {block.text}
        </h2>
      );
    case "h3":
      return (
        <h3 id={slugify(block.text)} className="scroll-mt-28 font-display text-xl font-extrabold">
          {block.text}
        </h3>
      );
    case "p":
      return <p className="text-base leading-relaxed text-foreground/85 md:text-[1.05rem]">{block.text}</p>;
    case "list":
      return block.ordered ? (
        <ol className="ml-5 list-decimal space-y-2 text-base leading-relaxed text-foreground/85">
          {block.items.map((it) => (
            <li key={it}>{it}</li>
          ))}
        </ol>
      ) : (
        <ul className="ml-5 list-disc space-y-2 text-base leading-relaxed text-foreground/85">
          {block.items.map((it) => (
            <li key={it}>{it}</li>
          ))}
        </ul>
      );
    case "code":
      return <CodeBlock lang={block.lang} code={block.code} {...(block.caption ? { caption: block.caption } : {})} />;
    case "callout":
      return (
        <aside
          className={cn(
            "rounded-2xl border-[3px] border-hairline p-5 shadow-hard-sm",
            toneBg[block.tone],
          )}
        >
          <p className="font-display text-sm font-extrabold uppercase tracking-wide">
            {block.title}
          </p>
          <p className="mt-1.5 text-base leading-relaxed">{block.text}</p>
        </aside>
      );
    case "quote":
      return (
        <blockquote className="border-l-[6px] border-hairline pl-5">
          <p className="hand text-2xl leading-snug">{block.text}</p>
          {block.cite ? (
            <cite className="mt-1 block font-mono text-[11px] text-muted-foreground not-italic">
              - {block.cite}
            </cite>
          ) : null}
        </blockquote>
      );
    case "table":
      return (
        <div className="overflow-x-auto rounded-2xl border-[3px] border-hairline shadow-hard-sm">
          <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
            <thead className="bg-surface">
              <tr>
                {block.head.map((h) => (
                  <th key={h} className="border-b-[3px] border-hairline px-4 py-2.5 font-display">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row: string[], n: number) => (
                <tr key={n} className="odd:bg-card even:bg-surface">
                  {row.map((cell: string, c: number) => (
                    <td key={c} className="px-4 py-2.5 align-top text-foreground/85">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}
