import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { practitioners } from "@/lib/practitioners";

const BASE_URL = "https://cmiev.ch";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages = ["", "/praticiens", "/pilates", "/cours-collectifs", "/galerie", "/contact"];

  const entries: MetadataRoute.Sitemap = [];

  for (const page of staticPages) {
    for (const locale of locales) {
      entries.push({
        url: `${BASE_URL}/${locale}${page}`,
        lastModified: now,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${BASE_URL}/${l}${page}`])
          ),
        },
      });
    }
  }

  for (const practitioner of practitioners) {
    for (const locale of locales) {
      entries.push({
        url: `${BASE_URL}/${locale}/praticiens/${practitioner.slug}`,
        lastModified: now,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${BASE_URL}/${l}/praticiens/${practitioner.slug}`])
          ),
        },
      });
    }
  }

  return entries;
}
