import { UTApi } from "uploadthing/server";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { siteContent, practitioners } from "../lib/db/schema";
import { eq } from "drizzle-orm";
import * as fs from "fs";
import * as path from "path";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const UPLOADTHING_TOKEN = process.env.UPLOADTHING_TOKEN;
if (!UPLOADTHING_TOKEN) {
  console.error("UPLOADTHING_TOKEN is not set");
  process.exit(1);
}

const sql = neon(DATABASE_URL);
const db = drizzle(sql);
const utapi = new UTApi();

const PUBLIC_DIR = path.resolve(__dirname, "../public");

/**
 * Map: siteContent key → local file path (relative to /public)
 * These match the exact images used on each public page.
 */
const IMAGE_MAP: Record<string, string> = {
  // ── Home page ──
  "home.hero.image": "/images/hero/accueil.webp",
  "home.about.image": "/images/galerie/cabinet-01.webp",
  "home.quote.image": "/images/galerie/cabinet-06.webp",
  "home.gallery.image.1": "/images/galerie/cabinet-01.webp",
  "home.gallery.image.2": "/images/pilates/pilates-reformer-1.webp",
  "home.gallery.image.3": "/images/physiotherapy/physio-treatment-2.webp",
  "home.gallery.image.4": "/images/wellness/wellness-studio-1.webp",

  // ── Pilates page ──
  "pilates.hero.image": "/images/pilates/pilates-hero.webp",
  "pilates.whatIs.image": "/images/pilates/pilates-reformer-2.webp",
  "pilates.sessions.image": "/images/pilates/pilates-studio-1.webp",
  "pilates.pricing.image": "/images/pilates/pilates-studio-2.webp",
  "pilates.strip.image.1": "/images/pilates/pilates-reformer-1.webp",
  "pilates.strip.image.2": "/images/pilates/pilates-mat-1.webp",
  "pilates.strip.image.3": "/images/pilates/pilates-stretch-1.webp",
  "pilates.strip.image.4": "/images/pilates/pilates-group-1.webp",
  "pilates.strip.image.5": "/images/pilates/pilates-reformer-3.webp",

  // ── Cours collectifs page ──
  "groupClasses.hero.image": "/images/cours/group-class-1.webp",
  "groupClasses.intro.image": "/images/cours/group-class-2.webp",
  "groupClasses.why.image.1": "/images/pilates/pilates-group-1.webp",
  "groupClasses.why.image.2": "/images/cours/group-class-3.webp",
  "groupClasses.why.image.3": "/images/cours/group-class-1.webp",
  "groupClasses.glad.image": "/images/physiotherapy/physio-rehab-1.webp",

  // ── Galerie page ──
  "gallery.image.1": "/images/galerie/cabinet-01.webp",
  "gallery.image.2": "/images/galerie/cabinet-02.webp",
  "gallery.image.3": "/images/galerie/cabinet-03.webp",
  "gallery.image.4": "/images/galerie/cabinet-04.webp",
  "gallery.image.5": "/images/galerie/cabinet-05.webp",
  "gallery.image.6": "/images/galerie/cabinet-06.webp",
  "gallery.image.7": "/images/galerie/cabinet-07.webp",
  "gallery.image.8": "/images/galerie/cabinet-08.webp",
  "gallery.image.9": "/images/galerie/cabinet-09.webp",
  "gallery.image.10": "/images/galerie/cabinet-10.webp",

  // ── Contact page ──
  "contact.hero.image": "/images/galerie/cabinet-01.webp",
};

/**
 * Map: practitioner slug → local photo path (relative to /public)
 */
const PRACTITIONER_PHOTOS: Record<string, string> = {
  "karen-aguiar": "/images/praticiens/karen-aguiar.webp",
  "elio-bosani": "/images/praticiens/elio-bosani.webp",
  "corinne-dauve": "/images/praticiens/corinne-dauve.webp",
  "fiorenza-toffolon": "/images/praticiens/fiorenza-toffolon.webp",
  "isaline-henry": "/images/praticiens/isaline-henry.webp",
  "severine-schwab": "/images/praticiens/severine-schwab.webp",
  "shima-sazegari": "/images/praticiens/shima-sazegari.webp",
  "beatrice-limbert": "/images/praticiens/beatrice-limbert.webp",
};

// De-duplicate: same local file should only be uploaded once
const uploadCache = new Map<string, string>(); // localPath → UT url

async function uploadFile(localRelPath: string): Promise<string> {
  if (uploadCache.has(localRelPath)) {
    return uploadCache.get(localRelPath)!;
  }

  const absPath = path.join(PUBLIC_DIR, localRelPath);
  if (!fs.existsSync(absPath)) {
    console.error(`  ✗ File not found: ${absPath}`);
    throw new Error(`File not found: ${absPath}`);
  }

  const buffer = fs.readFileSync(absPath);
  const fileName = path.basename(absPath);
  const blob = new Blob([buffer], { type: "image/webp" });
  const file = new File([blob], fileName, { type: "image/webp" });

  const res = await utapi.uploadFiles([file]);
  const result = res[0];
  if (result.error) {
    console.error(`  ✗ Upload failed for ${localRelPath}:`, result.error);
    throw new Error(`Upload failed: ${result.error.message}`);
  }

  const url = result.data.ufsUrl;
  uploadCache.set(localRelPath, url);
  return url;
}

async function main() {
  console.log("=== Seeding page images ===\n");

  // 1. Upload and store page images
  const entries = Object.entries(IMAGE_MAP);
  console.log(`Uploading ${entries.length} page images...\n`);

  for (const [key, localPath] of entries) {
    try {
      const url = await uploadFile(localPath);
      await db
        .insert(siteContent)
        .values({ key, value: url, updatedBy: "seed-images" })
        .onConflictDoUpdate({
          target: siteContent.key,
          set: { value: url, updatedBy: "seed-images", updatedAt: new Date() },
        });
      console.log(`  ✓ ${key} → ${url.slice(0, 60)}...`);
    } catch (err) {
      console.error(`  ✗ ${key}: ${(err as Error).message}`);
    }
  }

  // 2. Upload and update practitioner photos
  console.log(`\nUploading ${Object.keys(PRACTITIONER_PHOTOS).length} practitioner photos...\n`);

  for (const [slug, localPath] of Object.entries(PRACTITIONER_PHOTOS)) {
    try {
      const url = await uploadFile(localPath);
      await db
        .update(practitioners)
        .set({ photoUrl: url, updatedAt: new Date() })
        .where(eq(practitioners.slug, slug));
      console.log(`  ✓ ${slug} → ${url.slice(0, 60)}...`);
    } catch (err) {
      console.error(`  ✗ ${slug}: ${(err as Error).message}`);
    }
  }

  console.log(`\n=== Done! Uploaded ${uploadCache.size} unique files ===`);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
