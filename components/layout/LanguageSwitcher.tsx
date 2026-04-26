"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n";

const localeLabels: Record<Locale, { label: string; ariaLabel: string }> = {
  fr: { label: "FR", ariaLabel: "Français" },
  en: { label: "EN", ariaLabel: "English" },
  es: { label: "ES", ariaLabel: "Español" },
  it: { label: "IT", ariaLabel: "Italiano" },
};

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Language" className="flex items-center gap-1 text-sm">
      {locales.map((code, i) => (
        <span key={code} className="inline-flex items-center">
          {i > 0 && (
            <span className="mx-1 text-white/30" aria-hidden="true">
              |
            </span>
          )}
          {code === locale ? (
            <span
              className="font-semibold text-primary"
              aria-current="true"
              aria-label={localeLabels[code].ariaLabel}
            >
              {localeLabels[code].label}
            </span>
          ) : (
            <Link
              href={pathname.replace(`/${locale}`, `/${code}`)}
              className="text-white/70 transition-colors duration-200 hover:text-white"
              aria-label={localeLabels[code].ariaLabel}
            >
              {localeLabels[code].label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
