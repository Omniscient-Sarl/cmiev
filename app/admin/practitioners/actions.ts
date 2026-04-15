"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { practitioners } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

function revalidateAll() {
  revalidatePath("/admin/practitioners");
  revalidatePath("/admin");
  revalidatePath("/fr");
  revalidatePath("/en");
  revalidatePath("/fr/praticiens");
  revalidatePath("/en/praticiens");
  revalidatePath("/[locale]/praticiens/[slug]", "page");
}

function parseArray(value: string | null): string[] {
  if (!value || value.trim() === "") return [];
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function getPractitioners() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return db.select().from(practitioners).orderBy(asc(practitioners.order));
}

export async function getPractitioner(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const [practitioner] = await db
    .select()
    .from(practitioners)
    .where(eq(practitioners.id, id));

  return practitioner ?? null;
}

export async function createPractitioner(data: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await db.insert(practitioners).values({
    slug: (data.get("slug") as string) || "",
    nameFr: (data.get("nameFr") as string) || "",
    nameEn: (data.get("nameEn") as string) || "",
    titleFr: (data.get("titleFr") as string) || "",
    titleEn: (data.get("titleEn") as string) || "",
    bioFr: (data.get("bioFr") as string) || null,
    bioEn: (data.get("bioEn") as string) || null,
    specialtiesFr: parseArray(data.get("specialtiesFr") as string),
    specialtiesEn: parseArray(data.get("specialtiesEn") as string),
    conditionsFr: parseArray(data.get("conditionsFr") as string),
    conditionsEn: parseArray(data.get("conditionsEn") as string),
    spokenLanguages: data.getAll("spokenLanguages").map(String).filter(Boolean),
    phone: (data.get("phone") as string) || null,
    email: (data.get("email") as string) || null,
    photoUrl: (data.get("photoUrl") as string) || null,
    order: parseInt((data.get("order") as string) || "0", 10),
    visible: data.get("visible") === "true",
  });

  revalidateAll();
}

export async function updatePractitioner(id: string, data: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await db
    .update(practitioners)
    .set({
      slug: (data.get("slug") as string) || "",
      nameFr: (data.get("nameFr") as string) || "",
      nameEn: (data.get("nameEn") as string) || "",
      titleFr: (data.get("titleFr") as string) || "",
      titleEn: (data.get("titleEn") as string) || "",
      bioFr: (data.get("bioFr") as string) || null,
      bioEn: (data.get("bioEn") as string) || null,
      specialtiesFr: parseArray(data.get("specialtiesFr") as string),
      specialtiesEn: parseArray(data.get("specialtiesEn") as string),
      conditionsFr: parseArray(data.get("conditionsFr") as string),
      conditionsEn: parseArray(data.get("conditionsEn") as string),
      spokenLanguages: data.getAll("spokenLanguages").map(String).filter(Boolean),
      phone: (data.get("phone") as string) || null,
      email: (data.get("email") as string) || null,
      photoUrl: (data.get("photoUrl") as string) || null,
      order: parseInt((data.get("order") as string) || "0", 10),
      visible: data.get("visible") === "true",
      updatedAt: new Date(),
    })
    .where(eq(practitioners.id, id));

  revalidateAll();
}

export async function deletePractitioner(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await db.delete(practitioners).where(eq(practitioners.id, id));

  revalidateAll();
}

export async function toggleVisibility(id: string, visible: boolean) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await db
    .update(practitioners)
    .set({ visible, updatedAt: new Date() })
    .where(eq(practitioners.id, id));

  revalidateAll();
}

export async function updateOrder(id: string, order: number) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await db
    .update(practitioners)
    .set({ order, updatedAt: new Date() })
    .where(eq(practitioners.id, id));

  revalidateAll();
}
