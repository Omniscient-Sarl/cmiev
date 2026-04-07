import sharp from "sharp";
import { readdir, stat, unlink } from "fs/promises";
import { join, extname, basename } from "path";

const PUBLIC_IMAGES = join(process.cwd(), "public", "images");
const MAX_WIDTH = 1920;
const WEBP_QUALITY = 80;

async function getAllImageFiles(dir: string): Promise<string[]> {
  const files: string[] = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await getAllImageFiles(fullPath)));
    } else {
      const ext = extname(entry.name).toLowerCase();
      if ([".jpg", ".jpeg", ".png"].includes(ext)) {
        files.push(fullPath);
      }
    }
  }
  return files;
}

async function optimizeImage(filePath: string): Promise<void> {
  const ext = extname(filePath).toLowerCase();
  const name = basename(filePath, ext);
  const dir = join(filePath, "..");
  const outputPath = join(dir, `${name}.webp`);

  const image = sharp(filePath);
  const metadata = await image.metadata();

  let pipeline = image;
  if (metadata.width && metadata.width > MAX_WIDTH) {
    pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
  }

  const originalStat = await stat(filePath);

  await pipeline.webp({ quality: WEBP_QUALITY }).toFile(outputPath);

  const newStat = await stat(outputPath);

  const savings = (
    ((originalStat.size - newStat.size) / originalStat.size) *
    100
  ).toFixed(1);

  console.log(
    `${basename(filePath)} → ${basename(outputPath)} | ${(originalStat.size / 1024).toFixed(0)}KB → ${(newStat.size / 1024).toFixed(0)}KB (${savings}% smaller)`
  );

  // Remove original after successful conversion
  await unlink(filePath);
}

async function main() {
  console.log("Optimizing images in", PUBLIC_IMAGES);
  console.log("Max width:", MAX_WIDTH, "| WebP quality:", WEBP_QUALITY);
  console.log("---");

  const files = await getAllImageFiles(PUBLIC_IMAGES);
  console.log(`Found ${files.length} images to optimize\n`);

  for (const file of files) {
    try {
      await optimizeImage(file);
    } catch (err) {
      console.error(`Failed to optimize ${file}:`, err);
    }
  }

  console.log("\nDone!");
}

main();
