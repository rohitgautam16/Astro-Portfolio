/**
 * Header — React island.
 * Sticky navigation with scroll-aware styling, desktop nav links,
 * search trigger, theme toggle, and hamburger for mobile.
 */
import { useEffect, useState } from "react";
import { Moon, Search, Sun } from "lucide-react";
import { navLinks } from "@/components/nav-links";
import { profile } from "@/data/site";
import { useTheme } from "@/components/react/ThemeToggle";
import { Doodle } from "@/components/react/decor";
import { Magnetic } from "@/components/react/motion";
import { MobileMenu } from "@/components/react/MobileMenu";
import { CommandPalette } from "@/components/react/CommandPalette";

const chunky =
  "items-center justify-center rounded-full border-[3px] border-hairline bg-card shadow-hard-sm transition-transform duration-200 hover:-translate-y-0.5 hover:rotate-2 active:translate-y-0.5";

export function Header({ pathname }: { pathname: string }) {
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ⌘K / Ctrl+K shortcut for search (future command palette)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:rounded-full focus:border-[3px] focus:border-hairline focus:bg-yellow focus:px-3 focus:py-2 focus:text-sm focus:text-foreground"
      >
        Skip to content
      </a>
      <div className="container-page py-3">
        <div
          className={`flex h-14 items-center justify-between gap-3 rounded-full border-[3px] border-hairline px-3 transition-shadow duration-200 ${
            scrolled ? "bg-surface shadow-hard" : "bg-card shadow-hard-sm"
          }`}
        >
          <Magnetic strength={0.25}>
            <a
              href="/"
              className="group flex min-w-0 items-center gap-2 pl-1.5"
              aria-label="Home"
            >
              <span
                aria-hidden
                className="grid size-7 shrink-0 place-items-center rounded-full border-[3px] border-hairline bg-yellow transition-transform duration-200 group-hover:rotate-12"
              >
                <Doodle name="smiley" className="size-4" />
              </span>
              <span className="truncate font-display text-sm font-extrabold tracking-tight">
                {profile.name}
              </span>
            </a>
          </Magnetic>

          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            {navLinks.slice(1).map((link) => {
              const isActive = pathname === link.to;
              return (
                <Magnetic key={link.to} strength={0.3}>
                  <a
                    href={link.to}
                    className={`group relative inline-block rounded-full border-[3px] px-3 py-1.5 text-sm font-semibold transition-transform duration-200 hover:-translate-y-0.5 hover:border-hairline hover:bg-mint ${
                      isActive
                        ? "border-hairline! bg-lavender shadow-hard-sm -rotate-1"
                        : "border-transparent"
                    }`}
                  >
                    {link.label}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-x-3 -bottom-0.5 h-[3px] origin-left scale-x-0 rounded-full bg-foreground transition-transform duration-300 group-hover:scale-x-100"
                    />
                  </a>
                </Magnetic>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Magnetic strength={0.35} className="hidden lg:inline-block">
              <button
                type="button"
                onClick={() => setSearchOpen((v) => !v)}
                className={`${chunky} flex gap-2 px-3 py-1.5 text-xs font-semibold`}
              >
                <Search className="size-3.5" aria-hidden />
                Search
                <kbd className="font-mono text-[10px] tracking-wider">⌘K</kbd>
              </button>
            </Magnetic>
            <Magnetic strength={0.35} className="lg:hidden">
              <button
                type="button"
                onClick={() => setSearchOpen((v) => !v)}
                className={`${chunky} grid size-9 place-items-center`}
                aria-label="Open search"
              >
                <Search className="size-4" />
              </button>
            </Magnetic>
            <Magnetic strength={0.35}>
              <button
                type="button"
                onClick={toggle}
                className={`${chunky} grid size-9 place-items-center`}
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
              >
                {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
              </button>
            </Magnetic>

            <Magnetic strength={0.35} className="lg:hidden">
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className={`${chunky} grid size-9 place-items-center`}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
              >
                <span aria-hidden className="relative block h-3 w-4">
                  <span
                    className={`absolute left-0 h-[3px] w-full rounded-full bg-foreground transition-all duration-300 ${
                      menuOpen ? "top-1.5 rotate-45" : "top-0"
                    }`}
                  />
                  <span
                    className={`absolute left-0 top-1.5 h-[3px] w-full rounded-full bg-foreground transition-all duration-200 ${
                      menuOpen ? "scale-x-0 opacity-0" : ""
                    }`}
                  />
                  <span
                    className={`absolute left-0 h-[3px] w-full rounded-full bg-foreground transition-all duration-300 ${
                      menuOpen ? "top-1.5 -rotate-45" : "top-3"
                    }`}
                  />
                </span>
              </button>
            </Magnetic>
          </div>
        </div>
      </div>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} pathname={pathname} />
      <CommandPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
