export const locales = ["fr", "en", "es", "it"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fr";

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

/** Map locale to OpenGraph locale string */
export function ogLocale(locale: Locale): string {
  const map: Record<Locale, string> = {
    fr: "fr_CH",
    en: "en_GB",
    es: "es_ES",
    it: "it_IT",
  };
  return map[locale];
}
