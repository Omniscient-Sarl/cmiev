"use server";

import { db } from "@/lib/db";
import { siteContent } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";

export async function getContentBlocks() {
  return db.select().from(siteContent);
}

export async function updateContentBlock(key: string, value: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await db
    .insert(siteContent)
    .values({
      key,
      value,
      updatedBy: userId,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: siteContent.key,
      set: {
        value,
        updatedBy: userId,
        updatedAt: new Date(),
      },
    });

  revalidatePath("/admin/content");
  revalidatePath("/fr");
  revalidatePath("/en");
}

const DEFAULT_CONTENT: Record<string, string> = {
  "home.hero.title.fr": "Centre de Médecine Intégrative et Énergétique de Vevey",
  "home.hero.title.en": "Center for Integrative and Energy Medicine of Vevey",
  "home.hero.subtitle.fr":
    "Une approche holistique de la santé combinant médecine conventionnelle et thérapies complémentaires.",
  "home.hero.subtitle.en":
    "A holistic approach to health combining conventional medicine and complementary therapies.",
  "home.about.title.fr": "À propos du CMIEV",
  "home.about.title.en": "About CMIEV",
  "home.about.body.fr":
    "Le CMIEV rassemble des praticiens qualifiés offrant une prise en charge globale et personnalisée.",
  "home.about.body.en":
    "CMIEV brings together qualified practitioners offering comprehensive and personalized care.",
  "practitioners.title.fr": "Nos praticiens",
  "practitioners.title.en": "Our practitioners",
  "practitioners.subtitle.fr":
    "Découvrez notre équipe de professionnels de la santé.",
  "practitioners.subtitle.en":
    "Meet our team of healthcare professionals.",
};

export async function seedDefaultContent() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const existing = await db.select().from(siteContent);
  if (existing.length > 0) return { seeded: false, message: "Content already exists" };

  const entries = Object.entries(DEFAULT_CONTENT).map(([key, value]) => ({
    key,
    value,
    updatedBy: userId,
  }));

  await db.insert(siteContent).values(entries);

  revalidatePath("/admin/content");
  revalidatePath("/fr");
  revalidatePath("/en");
  return { seeded: true, message: `Seeded ${entries.length} content blocks` };
}
