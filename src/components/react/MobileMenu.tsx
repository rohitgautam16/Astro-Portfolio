/**
 * MobileMenu — React island.
 * Full-screen mobile navigation with layered panels, staggered links,
 * scroll lock, focus trap, and escape-to-close.
 */
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Download, Mail, Moon, Sun } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import { navLinks } from "@/components/nav-links";
import { profile } from "@/data/site";
import { useTheme } from "@/components/react/ThemeToggle";
import { Mascot } from "@/components/react/Mascot";
import { Doodle } from "@/components/react/decor";
import { TechGlyph } from "@/components/react/tech-icons";

const ease = [0.22, 1, 0.36, 1] as const;

export function MobileMenu({
  open,
  onClose,
  pathname,
}: {
  open: boolean;
  onClose: () => void;
  pathname: string;
}) {
  const reduced = useReducedMotion();
  const { theme, toggle } = useTheme();
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    restoreRef.current = document.activeElement as HTMLElement | null;
    const scrollY = window.scrollY;
    const { body } = document;
    const prev = body.style.cssText;
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    const focusTimer = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>("button, a")?.focus();
    }, 120);

    return () => {
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(focusTimer);
      body.style.cssText = prev;
      window.scrollTo({ top: scrollY, behavior: "instant" as ScrollBehavior });
      restoreRef.current?.focus?.();
    };
  }, [open, onClose]);

  const socials: Array<{ href: string; label: string; icon: ReactNode }> = [
    {
      href: profile.github,
      label: "GitHub",
      icon: <TechGlyph name="GitHub" className="size-4" />,
    },
    {
      href: profile.linkedin,
      label: "LinkedIn",
      icon: (
        <svg aria-hidden viewBox="0 0 24 24" fill="currentColor" className="size-4">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.66 1.66 0 0 0-1.66 1.66 1.66 1.66 0 0 0 1.66 1.66 1.66 1.66 0 0 0 1.66-1.66 1.66 1.66 0 0 0-1.66-1.66Z" />
        </svg>
      ),
    },
    {
      href: `mailto:${profile.email}`,
      label: "Email",
      icon: <Mail className="size-4" aria-hidden />,
    },
  ];

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className="fixed inset-0 z-[80] lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="absolute inset-0 bg-foreground/25 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* layered back panel */}
          <motion.div
            aria-hidden
            className="absolute inset-x-3 bottom-3 top-3 rounded-[28px] border-[3px] border-hairline bg-peach"
            initial={{ x: "108%", rotate: 3 }}
            animate={{ x: 0, rotate: -1.5 }}
            exit={{ x: "108%", rotate: 3 }}
            transition={{ duration: reduced ? 0 : 0.5, ease }}
          />

          <motion.div
            ref={panelRef}
            className="absolute inset-x-3 bottom-3 top-3 flex flex-col overflow-y-auto overscroll-contain rounded-[28px] border-[3px] border-hairline bg-background p-5 shadow-hard-lg"
            initial={{ x: "108%" }}
            animate={{ x: 0 }}
            exit={{ x: "108%" }}
            transition={{ duration: reduced ? 0 : 0.55, ease, delay: reduced ? 0 : 0.06 }}
          >
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-2 rounded-full border-[3px] border-hairline bg-yellow px-4 py-2 font-display text-xs font-extrabold uppercase tracking-widest shadow-hard-sm transition-transform active:translate-y-0.5"
              >
                Close
                <span aria-hidden className="text-base leading-none">×</span>
              </button>
              <button
                type="button"
                onClick={toggle}
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
                className="grid size-10 place-items-center rounded-full border-[3px] border-hairline bg-card shadow-hard-sm"
              >
                {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
              </button>
            </div>

            <nav aria-label="Mobile" className="mt-8 flex flex-col">
              {navLinks.map((link, i) => {
                const active = pathname === link.to;
                return (
                  <motion.div
                    key={link.to}
                    initial={reduced ? false : { opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.18 + i * 0.06, duration: 0.5, ease }}
                  >
                    <a
                      href={link.to}
                      onClick={onClose}
                      className="group flex items-center justify-between border-b-[3px] border-dashed border-hairline/40 py-3.5"
                    >
                      <span className="flex items-baseline gap-3">
                        <span className="font-mono text-[10px] text-muted-foreground">
                          0{i + 1}
                        </span>
                        <span className="font-display text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">
                          {link.label}
                        </span>
                      </span>
                      {active ? (
                        <motion.span
                          layoutId="mobile-active"
                          className="rounded-full border-[3px] border-hairline bg-lavender px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest"
                        >
                          here
                        </motion.span>
                      ) : (
                        <ArrowUpRight
                          aria-hidden
                          className="size-5 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                        />
                      )}
                    </a>
                  </motion.div>
                );
              })}
            </nav>

            <motion.div
              initial={reduced ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5, ease }}
              className="mt-7 grid gap-3"
            >
              <a
                href="/contact"
                onClick={onClose}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border-[3px] border-hairline bg-lavender px-5 py-3.5 font-display text-sm font-extrabold shadow-hard active:translate-y-0.5"
              >
                <Mail className="size-4" aria-hidden /> Start a project
              </a>
              <a
                href={profile.resumeUrl}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border-[3px] border-hairline bg-card px-5 py-3.5 font-display text-sm font-extrabold shadow-hard-sm active:translate-y-0.5"
              >
                <Download className="size-4" aria-hidden /> Download resume
              </a>
            </motion.div>

            <motion.div
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-auto flex items-end justify-between gap-4 pt-8"
            >
              <div className="flex gap-2">
                {socials.map(({ href, label, icon }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    aria-label={label}
                    className="grid size-11 place-items-center rounded-xl border-[3px] border-hairline bg-mint shadow-hard-sm transition-transform hover:-translate-y-0.5 hover:-rotate-6"
                  >
                    {icon}
                  </a>
                ))}
              </div>
              <Mascot className="size-24 shrink-0 text-hairline" wave />
            </motion.div>

            <p className="mt-4 flex items-center gap-2 hand text-lg text-foreground/70">
              <Doodle name="arrow" className="size-4" /> {profile.location}
            </p>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
