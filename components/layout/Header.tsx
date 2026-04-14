"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";

interface HeaderProps {
  locale: Locale;
  dict: Dictionary;
}

export function Header({ locale, dict }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const closeMobile = useCallback(() => setIsOpen(false), []);

  const navItems = [
    { href: `/${locale}`, label: dict.nav.home },
    { href: `/${locale}/praticiens`, label: dict.nav.practitioners },
    { href: `/${locale}/pilates`, label: dict.nav.pilates },
    { href: `/${locale}/cours-collectifs`, label: dict.nav.groupClasses },
    { href: `/${locale}/galerie`, label: dict.nav.gallery },
    { href: `/${locale}/contact`, label: dict.nav.contact },
  ];

  const switchLocale = locale === "fr" ? "en" : "fr";
  const switchPath = pathname.replace(`/${locale}`, `/${switchLocale}`);

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-shadow duration-300 backdrop-blur-md ${
          scrolled
            ? "bg-white/95 shadow-[0_2px_16px_rgba(0,0,0,0.06)]"
            : "bg-white/80 shadow-none"
        }`}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="font-heading text-2xl font-bold tracking-tight text-primary transition-colors duration-200 hover:text-sage-600"
          >
            CMIEV
          </Link>

          {/* Desktop nav */}
          <nav
            className="hidden items-center gap-1 lg:flex"
            aria-label="Main navigation"
          >
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-3 py-2 text-sm font-medium tracking-wide uppercase transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none ${
                    isActive
                      ? "text-accent"
                      : "text-foreground/70 hover:text-foreground"
                  }`}
                >
                  {item.label}
                  {/* Active underline */}
                  <span
                    className={`absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-accent transition-transform duration-200 origin-left ${
                      isActive ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </Link>
              );
            })}

            {/* Language switcher — pill toggle */}
            <div className="ml-4 flex items-center rounded-full border border-border bg-secondary/60 p-0.5">
              <Link
                href={locale === "fr" ? "#" : switchPath}
                className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                  locale === "fr"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-label="Français"
                aria-current={locale === "fr" ? "true" : undefined}
                onClick={locale === "fr" ? (e) => e.preventDefault() : undefined}
              >
                FR
              </Link>
              <Link
                href={locale === "en" ? "#" : switchPath}
                className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                  locale === "en"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-label="English"
                aria-current={locale === "en" ? "true" : undefined}
                onClick={locale === "en" ? (e) => e.preventDefault() : undefined}
              >
                EN
              </Link>
            </div>
          </nav>

          {/* Mobile menu button */}
          <button
            type="button"
            className="relative z-50 inline-flex items-center justify-center rounded-md p-2 text-foreground/70 lg:hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-label={isOpen ? dict.nav.closeMenu : dict.nav.openMenu}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              aria-hidden="true"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              )}
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile nav — full-screen overlay */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 lg:hidden ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!isOpen}
      >
        {/* Dark backdrop */}
        <div
          className="absolute inset-0 bg-charcoal/80 backdrop-blur-sm"
          onClick={closeMobile}
        />

        {/* Slide-in panel */}
        <nav
          className={`absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-white shadow-elevated transition-transform duration-300 ease-out ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
          aria-label="Mobile navigation"
        >
          {/* Spacer for header height */}
          <div className="h-20 shrink-0" />

          <div className="flex flex-1 flex-col justify-center gap-2 px-8">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobile}
                  className={`group relative block rounded-lg px-4 py-3 text-xl font-medium tracking-wide transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none ${
                    isActive
                      ? "text-accent"
                      : "text-foreground/80 hover:text-foreground hover:bg-secondary/50"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    {isActive && (
                      <span className="inline-block h-5 w-0.5 rounded-full bg-accent" />
                    )}
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Mobile language switcher */}
          <div className="shrink-0 border-t border-border px-8 py-6">
            <div className="flex items-center justify-center rounded-full border border-border bg-secondary/60 p-1">
              <Link
                href={locale === "fr" ? "#" : switchPath}
                onClick={locale === "fr" ? (e) => e.preventDefault() : closeMobile}
                className={`flex-1 rounded-full py-2 text-center text-sm font-semibold uppercase tracking-wider transition-all duration-200 ${
                  locale === "fr"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-label="Français"
              >
                Français
              </Link>
              <Link
                href={locale === "en" ? "#" : switchPath}
                onClick={locale === "en" ? (e) => e.preventDefault() : closeMobile}
                className={`flex-1 rounded-full py-2 text-center text-sm font-semibold uppercase tracking-wider transition-all duration-200 ${
                  locale === "en"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-label="English"
              >
                English
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
