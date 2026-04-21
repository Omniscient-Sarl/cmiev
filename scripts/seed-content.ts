import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { siteContent } from "../lib/db/schema";

const DEFAULT_CONTENT: Record<string, string> = {
  // Home page
  "home.hero.title.fr":
    "Centre de Médecine Intégrative des Eaux-Vives",
  "home.hero.title.en":
    "Center for Integrative Medicine of Eaux-Vives",
  "home.hero.subtitle.fr":
    "Une approche globale de la santé, au cœur de Genève",
  "home.hero.subtitle.en":
    "A comprehensive approach to health, in the heart of Geneva",
  "home.about.title.fr": "Bienvenue au CMIEV",
  "home.about.title.en": "Welcome to CMIEV",
  "home.about.body.fr":
    "Le CMIEV rassemble des praticiens qualifiés offrant une prise en charge globale et personnalisée, alliant médecine conventionnelle et thérapies complémentaires.",
  "home.about.body.en":
    "CMIEV brings together qualified practitioners offering comprehensive and personalized care, combining conventional medicine and complementary therapies.",
  "home.specialties.title.fr": "Nos spécialités",
  "home.specialties.title.en": "Our specialties",
  "home.specialties.subtitle.fr":
    "Une équipe pluridisciplinaire au service de votre bien-être",
  "home.specialties.subtitle.en":
    "A multidisciplinary team at the service of your well-being",
  "home.team.title.fr": "Notre équipe",
  "home.team.title.en": "Our team",
  "home.team.subtitle.fr":
    "Des professionnels passionnés et expérimentés",
  "home.team.subtitle.en":
    "Passionate and experienced professionals",
  "home.gallery.title.fr": "Notre cabinet",
  "home.gallery.title.en": "Our practice",
  "home.gallery.subtitle.fr":
    "Découvrez nos espaces de soins aux Eaux-Vives, Genève",
  "home.gallery.subtitle.en":
    "Discover our care spaces in Eaux-Vives, Geneva",

  // Practitioners page
  "practitioners.title.fr": "Nos praticiens",
  "practitioners.title.en": "Our practitioners",
  "practitioners.subtitle.fr":
    "Une équipe pluridisciplinaire au service de votre santé",
  "practitioners.subtitle.en":
    "A multidisciplinary team at the service of your health",

  // Contact page
  "contact.title.fr": "Contact",
  "contact.title.en": "Contact",
  "contact.subtitle.fr":
    "Prenez rendez-vous ou posez-nous vos questions",
  "contact.subtitle.en":
    "Book an appointment or ask us your questions",
  "contact.address": "Rue des Eaux-Vives 3, 1207 Genève, Suisse",

  // Pilates page
  "pilates.title.fr": "Pilates au CMIEV",
  "pilates.title.en": "Pilates at CMIEV",
  "pilates.subtitle.fr":
    "Cours individuels et personnalisés à Genève",
  "pilates.subtitle.en":
    "Individual and personalised sessions in Geneva",

  // Group classes page
  "groupClasses.title.fr": "Cours collectifs",
  "groupClasses.title.en": "Group classes",
  "groupClasses.subtitle.fr":
    "Gym, Pilates et stretching du dos à Genève Eaux-Vives",
  "groupClasses.subtitle.en":
    "Gym, Pilates and back stretching in Geneva Eaux-Vives",

  // Gallery page
  "gallery.title.fr": "Notre cabinet",
  "gallery.title.en": "Our practice",
  "gallery.subtitle.fr":
    "Découvrez nos espaces de soins aux Eaux-Vives, Genève",
  "gallery.subtitle.en":
    "Discover our care spaces in Eaux-Vives, Geneva",
};

async function main() {
  const DATABASE_URL = process.env.DATABASE_URL;
  if (!DATABASE_URL) {
    console.error("DATABASE_URL is not set");
    process.exit(1);
  }

  const sql = neon(DATABASE_URL);
  const db = drizzle(sql);

  const entries = Object.entries(DEFAULT_CONTENT);
  console.log(`Seeding ${entries.length} content blocks...`);

  for (const [key, value] of entries) {
    await db
      .insert(siteContent)
      .values({ key, value, updatedBy: "seed-script" })
      .onConflictDoUpdate({
        target: siteContent.key,
        set: { value, updatedBy: "seed-script", updatedAt: new Date() },
      });

    console.log(`  ✓ ${key}`);
  }

  console.log(`\nDone! ${entries.length} content blocks seeded.`);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
