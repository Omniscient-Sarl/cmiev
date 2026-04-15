"use server";

import { db } from "@/lib/db";
import { siteContent } from "@/lib/db/schema";
import { eq, like } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";

export async function getContentBlocksByPrefix(prefix: string) {
  return db
    .select()
    .from(siteContent)
    .where(like(siteContent.key, `${prefix}.%`));
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

  revalidatePath("/admin/pages");
  revalidatePath("/fr");
  revalidatePath("/en");
}

export async function getImageBlocks(prefix: string) {
  return db
    .select()
    .from(siteContent)
    .where(like(siteContent.key, `${prefix}.%image%`));
}

export async function deleteImageUrl(key: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await db.delete(siteContent).where(eq(siteContent.key, key));

  revalidatePath("/admin/pages");
  revalidatePath("/fr");
  revalidatePath("/en");
}

export async function saveImageUrl(key: string, url: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await db
    .insert(siteContent)
    .values({
      key,
      value: url,
      updatedBy: userId,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: siteContent.key,
      set: {
        value: url,
        updatedBy: userId,
        updatedAt: new Date(),
      },
    });

  revalidatePath("/admin/pages");
  revalidatePath("/fr");
  revalidatePath("/en");
}
