import { useEffect, useState, useMemo, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, ArrowRight, Sun, Moon, Mail, Calendar, FileText } from "lucide-react";
import { navLinks } from "@/components/nav-links";
import { profile, projects, flags } from "@/data/site";
import { insights } from "@/data/insights";
import { useTheme } from "@/components/react/ThemeToggle";
import { TechGlyph } from "@/components/react/tech-icons";

function GithubIcon(props: { className?: string }) {
  return <TechGlyph name="GitHub" className={props.className || "size-4"} />;
}

function LinkedinIcon(props: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="currentColor" className={props.className || "size-4"}>
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.66 1.66 0 0 0-1.66 1.66 1.66 1.66 0 0 0 1.66-1.66 1.66 1.66 0 0 0-1.66-1.66Z" />
    </svg>
  );
}

interface CommandItem {
  id: string;
  category: "Pages" | "Projects" | "Articles" | "Actions";
  title: string;
  subtitle?: string;
  icon?: any;
  action: () => void;
}

export function CommandPalette({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const { theme, toggle } = useTheme();

  // Lock body scroll and prevent background scroll when command palette is open
  useEffect(() => {
    if (!open) return;
    const scrollY = window.scrollY;
    const { body } = document;
    const prev = body.style.cssText;
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.overflow = "hidden";

    return () => {
      body.style.cssText = prev;
      window.scrollTo({ top: scrollY, behavior: "instant" as ScrollBehavior });
    };
  }, [open]);

  const items: CommandItem[] = useMemo(() => {
    const list: CommandItem[] = [];

    // Pages (Filter out blog if blog is coming soon)
    navLinks.forEach((link) => {
      if (flags.blogComingSoon && link.to === "/blog") return;
      list.push({
        id: `page-${link.to}`,
        category: "Pages",
        title: link.label,
        subtitle: link.to,
        icon: FileText,
        action: () => {
          onClose();
          window.location.href = link.to;
        },
      });
    });

    // Projects
    projects.forEach((p) => {
      list.push({
        id: `project-${p.slug}`,
        category: "Projects",
        title: p.title,
        subtitle: `${p.kind} · ${p.year}`,
        action: () => {
          onClose();
          window.location.href = `/projects/${p.slug}`;
        },
      });
    });

    // Articles (Only include if blog is live)
    if (!flags.blogComingSoon) {
      insights.forEach((art) => {
        list.push({
          id: `article-${art.slug}`,
          category: "Articles",
          title: art.title,
          subtitle: `${art.category} · ${art.readingTime} min read`,
          action: () => {
            onClose();
            window.location.href = `/blog/${art.slug}`;
          },
        });
      });
    }

    // Actions
    list.push({
      id: "action-theme",
      category: "Actions",
      title: `Switch to ${theme === "dark" ? "light" : "dark"} theme`,
      subtitle: "Appearance",
      icon: theme === "dark" ? Sun : Moon,
      action: () => {
        toggle();
        onClose();
      },
    });

    list.push({
      id: "action-call",
      category: "Actions",
      title: "Schedule a call with Rohit",
      subtitle: "30 min Google Meet",
      icon: Calendar,
      action: () => {
        onClose();
        window.open(profile.scheduleUrl, "_blank", "noopener,noreferrer");
      },
    });

    list.push({
      id: "action-email",
      category: "Actions",
      title: `Email ${profile.email}`,
      subtitle: "Contact",
      icon: Mail,
      action: () => {
        onClose();
        window.location.href = `mailto:${profile.email}`;
      },
    });

    list.push({
      id: "action-github",
      category: "Actions",
      title: "Open GitHub profile",
      subtitle: "github.com/rohitgautam",
      icon: GithubIcon,
      action: () => {
        onClose();
        window.open(profile.github, "_blank", "noopener,noreferrer");
      },
    });

    list.push({
      id: "action-linkedin",
      category: "Actions",
      title: "Open LinkedIn profile",
      subtitle: "linkedin.com/in/rohitgautam",
      icon: LinkedinIcon,
      action: () => {
        onClose();
        window.open(profile.linkedin, "_blank", "noopener,noreferrer");
      },
    });

    return list;
  }, [theme, toggle, onClose]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
        item.category.toLowerCase().includes(q),
    );
  }, [items, query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keep selected item visible in list on keyboard navigation
  useEffect(() => {
    if (listRef.current) {
      const selectedEl = listRef.current.querySelector<HTMLElement>(`[data-index="${selectedIndex}"]`);
      if (selectedEl) {
        selectedEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIndex]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          filtered[selectedIndex].action();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, filtered, selectedIndex, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <div
          data-lenis-prevent
          className="fixed inset-0 z-[100] flex items-start justify-center p-4 sm:p-6 md:pt-20"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            data-lenis-prevent
            className="fixed inset-0 bg-foreground/30 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            data-lenis-prevent
            className="relative w-full max-w-2xl overflow-hidden rounded-[26px] border-[3px] border-hairline bg-background shadow-hard-lg"
          >
            <div className="flex items-center gap-3 border-b-[3px] border-hairline px-4 py-3.5 bg-surface">
              <Search className="size-5 text-muted-foreground" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search pages, projects, articles, or actions..."
                className="w-full bg-transparent font-medium text-base outline-none placeholder:text-muted-foreground"
              />
              <kbd className="rounded-lg border-2 border-hairline bg-card px-2 py-0.5 font-mono text-[10px] font-bold">
                ESC
              </kbd>
            </div>

            <div
              ref={listRef}
              data-lenis-prevent
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
              className="max-h-[60vh] overflow-y-auto p-2 overscroll-contain"
            >
              {filtered.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  <p className="hand text-2xl">No results found.</p>
                  <p className="mt-1">Try searching for "projects", "react", or "theme"</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {filtered.map((item, idx) => {
                    const isSelected = idx === selectedIndex;
                    const Icon = item.icon || ArrowRight;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        data-index={idx}
                        onClick={item.action}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`flex w-full items-center justify-between gap-3 rounded-2xl border-2 px-3.5 py-2.5 text-left transition-colors ${
                          isSelected
                            ? "border-hairline bg-lavender shadow-hard-sm"
                            : "border-transparent hover:bg-surface"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span
                            className={`grid size-8 shrink-0 place-items-center rounded-xl border-2 border-hairline ${
                              isSelected ? "bg-yellow" : "bg-card"
                            }`}
                          >
                            <Icon className="size-4" />
                          </span>
                          <div className="min-w-0">
                            <p className="truncate font-display text-sm font-extrabold">{item.title}</p>
                            {item.subtitle ? (
                              <p className="truncate font-mono text-[10px] text-muted-foreground">
                                {item.subtitle}
                              </p>
                            ) : null}
                          </div>
                        </div>
                        <span className="shrink-0 rounded-full border border-hairline bg-card px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                          {item.category}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-t-[3px] border-dashed border-hairline/30 bg-surface px-4 py-2.5 font-mono text-[11px] text-muted-foreground">
              <div className="flex items-center gap-2">
                <span>↑↓ to navigate</span>
                <span>•</span>
                <span>↵ to select</span>
              </div>
              <span>⌘K to toggle</span>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}