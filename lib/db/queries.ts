import { unstable_cache } from "next/cache";
import { db } from ".";
import { practitioners as practitionersTable, siteContent } from "./schema";
import { eq, asc } from "drizzle-orm";
import {
  practitioners as staticPractitioners,
  type Practitioner,
} from "../practitioners";

// ---------------------------------------------------------------------------
// Practitioners
// ---------------------------------------------------------------------------

/** Converts a DB row into the Practitioner shape used by public pages. */
function dbRowToPractitioner(row: typeof practitionersTable.$inferSelect): Practitioner {
  return {
    slug: row.slug,
    name: row.nameFr,
    title: {
      fr: row.titleFr,
      en: row.titleEn,
      es: row.titleEs ?? row.titleFr,
      it: row.titleIt ?? row.titleFr,
    },
    phone: row.phone ?? "",
    email: row.email ?? undefined,
    bio: {
      fr: row.bioFr ? row.bioFr.split("\n\n") : [],
      en: row.bioEn ? row.bioEn.split("\n\n") : [],
      es: row.bioEs ? row.bioEs.split("\n\n") : (row.bioFr ? row.bioFr.split("\n\n") : []),
      it: row.bioIt ? row.bioIt.split("\n\n") : (row.bioFr ? row.bioFr.split("\n\n") : []),
    },
    specialties: {
      fr: row.specialtiesFr,
      en: row.specialtiesEn,
      es: row.specialtiesEs ?? row.specialtiesFr,
      it: row.specialtiesIt ?? row.specialtiesFr,
    },
    conditions: {
      fr: row.conditionsFr,
      en: row.conditionsEn,
      es: row.conditionsEs ?? row.conditionsFr,
      it: row.conditionsIt ?? row.conditionsFr,
    },
    image: row.photoUrl ?? undefined,
    seoKeywords: { fr: [], en: [], es: [], it: [] },
    spokenLanguages: row.spokenLanguages,
  };
}

/**
 * Fetch visible practitioners ordered by `order`, with 60 s cache.
 * Falls back to static data if the DB is empty or unreachable.
 */
export const getVisiblePractitioners = unstable_cache(
  async (): Promise<Practitioner[]> => {
    try {
      const rows = await db
        .select()
        .from(practitionersTable)
        .where(eq(practitionersTable.visible, true))
        .orderBy(asc(practitionersTable.order));

      if (rows.length > 0) {
        return rows.map(dbRowToPractitioner);
      }
    } catch {
      // DB unreachable — fall through to static
    }
    return staticPractitioners;
  },
  ["visible-practitioners"],
  { revalidate: 60, tags: ["practitioners"] }
);

/**
 * Fetch all practitioners (including hidden) for sitemap / static params.
 */
export const getAllPractitioners = unstable_cache(
  async (): Promise<Practitioner[]> => {
    try {
      const rows = await db
        .select()
        .from(practitionersTable)
        .orderBy(asc(practitionersTable.order));

      if (rows.length > 0) {
        return rows.map(dbRowToPractitioner);
      }
    } catch {
      // fall through
    }
    return staticPractitioners;
  },
  ["all-practitioners"],
  { revalidate: 60, tags: ["practitioners"] }
);

/**
 * Fetch a single practitioner by slug.
 */
export const getPractitionerBySlugCached = unstable_cache(
  async (slug: string): Promise<Practitioner | null> => {
    try {
      const [row] = await db
        .select()
        .from(practitionersTable)
        .where(eq(practitionersTable.slug, slug))
        .limit(1);

      if (row) {
        return dbRowToPractitioner(row);
      }
    } catch {
      // fall through
    }
    // Fallback to static
    return staticPractitioners.find((p) => p.slug === slug) ?? null;
  },
  ["practitioner-by-slug"],
  { revalidate: 60, tags: ["practitioners"] }
);

// ---------------------------------------------------------------------------
// Site Content
// ---------------------------------------------------------------------------

/**
 * Fetch a content value by key, with fallback to a default.
 */
export const getContentValue = unstable_cache(
  async (key: string, fallback: string = ""): Promise<string> => {
    try {
      const [row] = await db
        .select({ value: siteContent.value })
        .from(siteContent)
        .where(eq(siteContent.key, key))
        .limit(1);

      if (row) return row.value;
    } catch {
      // fall through
    }
    return fallback;
  },
  ["site-content"],
  { revalidate: 60, tags: ["site-content"] }
);
