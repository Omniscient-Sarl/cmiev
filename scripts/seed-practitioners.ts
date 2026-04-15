import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { practitioners as practitionersTable } from "../lib/db/schema";
import { practitioners as staticPractitioners } from "../lib/practitioners";

async function main() {
  const DATABASE_URL = process.env.DATABASE_URL;
  if (!DATABASE_URL) {
    console.error("DATABASE_URL is not set");
    process.exit(1);
  }

  const sql = neon(DATABASE_URL);
  const db = drizzle(sql);

  console.log(`Seeding ${staticPractitioners.length} practitioners...`);

  for (let i = 0; i < staticPractitioners.length; i++) {
    const p = staticPractitioners[i];

    const row = {
      slug: p.slug,
      nameFr: p.name,
      nameEn: p.name, // Same name in both languages
      titleFr: p.title.fr,
      titleEn: p.title.en,
      bioFr: p.bio.fr.join("\n\n"),
      bioEn: p.bio.en.join("\n\n"),
      specialtiesFr: p.specialties.fr,
      specialtiesEn: p.specialties.en,
      conditionsFr: p.conditions.fr,
      conditionsEn: p.conditions.en,
      phone: p.phone,
      email: p.email ?? null,
      photoUrl: p.image ?? null,
      order: i,
      visible: true,
    };

    await db
      .insert(practitionersTable)
      .values(row)
      .onConflictDoUpdate({
        target: practitionersTable.slug,
        set: {
          ...row,
          updatedAt: new Date(),
        },
      });

    console.log(`  ✓ ${p.name} (${p.slug})`);
  }

  console.log(`\nDone! ${staticPractitioners.length} practitioners seeded.`);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
