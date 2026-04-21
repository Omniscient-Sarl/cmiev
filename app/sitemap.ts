import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { getAllPractitioners } from "@/lib/db/queries";

const BASE_URL = "https://cmiev.ch";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const practitioners = await getAllPractitioners();

  const staticPages = ["", "/praticiens", "/pilates", "/cours-collectifs", "/galerie", "/contact"];

  const entries: MetadataRoute.Sitemap = [];

  for (const page of staticPages) {
    for (const locale of locales) {
      entries.push({
        url: `${BASE_URL}/${locale}${page}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: page === "" ? 1 : 0.8,
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
        changeFrequency: "monthly",
        priority: 0.7,
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
