import type { Locale } from "./i18n";

const dictionaries = {
  fr: () => import("@/content/dictionaries/fr").then((m) => m.default),
  en: () => import("@/content/dictionaries/en").then((m) => m.default),
  es: () => import("@/content/dictionaries/es").then((m) => m.default),
  it: () => import("@/content/dictionaries/it").then((m) => m.default),
};

export async function getDictionary(locale: Locale) {
  return dictionaries[locale]();
}

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;
