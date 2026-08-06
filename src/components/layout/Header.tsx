"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { navigation, type NavItem } from "@/content/navigation";
import { conference } from "@/content/conference";
import { Button } from "@/components/ui/Button";
import { easeOut } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const closeTimer = useRef<number | null>(null);

  // Transparent only while sitting over the homepage hero.
  const transparent = isHome && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Any navigation closes every menu.
  useEffect(() => {
    setMobileOpen(false);
    setOpenMenu(null);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpenMenu(null);
      setMobileOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  // Small grace period so the pointer can cross the gap into the panel.
  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setOpenMenu(null), 140);
  }, [cancelClose]);

  useEffect(() => () => cancelClose(), [cancelClose]);

  function isActive(item: NavItem) {
    if (item.href === "/") return pathname === "/";
    const paths = [item.href, ...(item.children?.map((c) => c.href) ?? [])];
    return paths.some((href) => {
      const base = href.split("#")[0];
      return base !== "/" && pathname.startsWith(base);
    });
  }

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:font-semibold focus:text-deep focus:shadow-lg"
      >
        Skip to main content
      </a>

      <header
        className={cn(
          "sticky top-0 z-50 h-16 transition-[background-color,box-shadow,backdrop-filter] duration-300 lg:h-20",
          transparent
            ? "bg-transparent"
            : "border-b border-line/80 bg-white/85 shadow-[0_6px_24px_-18px_rgba(9,43,114,0.55)] backdrop-blur-xl",
        )}
      >
        <div className="container-page flex h-full items-center justify-between gap-4">
          {/* Brand */}
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2.5"
            aria-label={`${conference.acronym} — home`}
          >
            <span
              aria-hidden="true"
              className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-royal to-violet font-display text-[0.68rem] font-bold text-white shadow-md lg:size-10 lg:text-xs"
            >
              IC
            </span>
            <span className="flex flex-col leading-none">
              <span
                className={cn(
                  "font-display text-[1.02rem] font-bold tracking-tight lg:text-lg",
                  transparent ? "text-white" : "text-deep",
                )}
              >
                ICRTET-2026
              </span>
              <span
                className={cn(
                  "mt-0.5 hidden text-[0.66rem] font-medium tracking-wide sm:block",
                  transparent ? "text-white/70" : "text-ink-soft",
                )}
              >
                SCSVMV · Kanchipuram
              </span>
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav aria-label="Main" className="hidden xl:block">
            <ul className="flex items-center gap-0.5">
              {navigation.map((item) => {
                const active = isActive(item);
                const hasChildren = Boolean(item.children?.length);
                const isOpen = openMenu === item.label;

                return (
                  <li
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => {
                      if (!hasChildren) return;
                      cancelClose();
                      setOpenMenu(item.label);
                    }}
                    onMouseLeave={() => hasChildren && scheduleClose()}
                    onBlur={(event) => {
                      if (!hasChildren) return;
                      if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                        setOpenMenu(null);
                      }
                    }}
                  >
                    {hasChildren ? (
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-haspopup="true"
                        onClick={() => setOpenMenu(isOpen ? null : item.label)}
                        onKeyDown={(event) => {
                          if (event.key === "ArrowDown") {
                            event.preventDefault();
                            setOpenMenu(item.label);
                          }
                        }}
                        className={cn(
                          "flex items-center gap-1 rounded-lg px-2.5 py-2 text-[0.82rem] font-medium transition-colors 2xl:px-3 2xl:text-[0.875rem]",
                          transparent
                            ? "text-white/85 hover:bg-white/10 hover:text-white"
                            : "text-ink hover:bg-surface-blue hover:text-royal",
                          active && (transparent ? "text-white" : "text-royal"),
                        )}
                      >
                        {item.label}
                        <ChevronDown
                          className={cn(
                            "size-3.5 transition-transform duration-200",
                            isOpen && "rotate-180",
                          )}
                          aria-hidden="true"
                        />
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex items-center rounded-lg px-2.5 py-2 text-[0.82rem] font-medium transition-colors 2xl:px-3 2xl:text-[0.875rem]",
                          transparent
                            ? "text-white/85 hover:bg-white/10 hover:text-white"
                            : "text-ink hover:bg-surface-blue hover:text-royal",
                          active && (transparent ? "text-white" : "text-royal"),
                        )}
                      >
                        {item.label}
                      </Link>
                    )}

                    {/* Active indicator */}
                    {active && (
                      <motion.span
                        layoutId="nav-active"
                        aria-hidden="true"
                        className={cn(
                          "absolute inset-x-2.5 -bottom-0.5 h-0.5 rounded-full",
                          transparent ? "bg-cyan" : "bg-gradient-to-r from-royal to-violet",
                        )}
                        transition={{ duration: 0.3, ease: easeOut }}
                      />
                    )}

                    {/* Unmounts on close instead of animating out. An exit
                        animation left the panel in the DOM, so every dropdown
                        link stayed focusable and announced while the menu was
                        visually closed. */}
                    {hasChildren && isOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.2, ease: easeOut }}
                        className="absolute left-1/2 top-full z-50 w-[19rem] -translate-x-1/2 pt-3"
                        onMouseEnter={cancelClose}
                        onMouseLeave={scheduleClose}
                      >
                        <div className="overflow-hidden rounded-2xl border border-line bg-white p-2 shadow-[0_24px_60px_-24px_rgba(9,43,114,0.5)]">
                          {item.children?.map((child) => (
                            <Link
                              key={child.href + child.label}
                              href={child.href}
                              className="block rounded-xl px-3 py-2.5 transition-colors hover:bg-surface-blue"
                            >
                              <span className="block text-[0.875rem] font-semibold text-deep">
                                {child.label}
                              </span>
                              {child.description && (
                                <span className="mt-0.5 block text-[0.78rem] leading-snug text-ink-soft">
                                  {child.description}
                                </span>
                              )}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-2">
            <Button
              href="/registration"
              size="sm"
              variant={transparent ? "onDark" : "accent"}
              className="hidden sm:inline-flex"
              withArrow
            >
              Register &amp; Submit
            </Button>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              className={cn(
                "grid size-10 place-items-center rounded-xl transition-colors xl:hidden",
                transparent
                  ? "text-white hover:bg-white/15"
                  : "text-deep hover:bg-surface-blue",
              )}
            >
              <Menu className="size-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        pathname={pathname}
      />
    </>
  );
}

function MobileMenu({
  open,
  onClose,
  pathname,
}: {
  open: boolean;
  onClose: () => void;
  pathname: string;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);

  // Unmounts on close — see the note in `ui/Modal`. A drawer that lingers
  // keeps every nav link focusable behind the closed menu.
  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.22 }}
      className="fixed inset-0 z-[90] xl:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
    >
          <div
            className="absolute inset-0 bg-deep/50 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            transition={{ duration: 0.34, ease: easeOut }}
            className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <span className="font-display text-lg font-bold text-deep">
                ICRTET-2026
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="grid size-10 place-items-center rounded-xl text-ink-soft transition-colors hover:bg-surface hover:text-deep"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>

            <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-3 py-4">
              <ul className="space-y-0.5">
                {navigation.map((item) => {
                  const hasChildren = Boolean(item.children?.length);
                  const isExpanded = expanded === item.label;
                  const active =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.href.split("#")[0]);

                  return (
                    <li key={item.label}>
                      <div className="flex items-stretch gap-1">
                        <Link
                          href={item.href}
                          onClick={onClose}
                          className={cn(
                            "flex-1 rounded-xl px-3 py-3 font-display text-[0.95rem] font-semibold transition-colors",
                            active
                              ? "bg-surface-blue text-royal"
                              : "text-deep hover:bg-surface",
                          )}
                        >
                          {item.label}
                        </Link>

                        {hasChildren && (
                          <button
                            type="button"
                            onClick={() => setExpanded(isExpanded ? null : item.label)}
                            aria-expanded={isExpanded}
                            aria-label={`${isExpanded ? "Collapse" : "Expand"} ${item.label} menu`}
                            className="grid w-11 place-items-center rounded-xl text-ink-soft transition-colors hover:bg-surface"
                          >
                            <ChevronDown
                              className={cn(
                                "size-4 transition-transform duration-250",
                                isExpanded && "rotate-180",
                              )}
                              aria-hidden="true"
                            />
                          </button>
                        )}
                      </div>

                      {/* Unmounts on collapse rather than animating out — a
                          collapsed submenu that lingers at height:0 keeps its
                          links in the tab order and screen-reader output. */}
                      {hasChildren && isExpanded && (
                        <motion.ul
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          transition={{ duration: 0.28, ease: easeOut }}
                          className="overflow-hidden pl-3"
                        >
                          {item.children?.map((child) => (
                            <li key={child.href + child.label}>
                              <Link
                                href={child.href}
                                onClick={onClose}
                                className="block rounded-lg border-l-2 border-line py-2.5 pl-4 pr-3 text-[0.875rem] text-ink-soft transition-colors hover:border-royal hover:text-royal"
                              >
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="border-t border-line p-4">
              <Button href="/registration" variant="accent" className="w-full" withArrow>
                Register &amp; Submit Paper
              </Button>
            </div>
          </motion.div>
    </motion.div>
  );
}
