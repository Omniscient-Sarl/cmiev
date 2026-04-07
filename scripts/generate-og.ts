import sharp from "sharp";
import { join } from "path";

const PUBLIC = join(process.cwd(), "public");
const OUTPUT = join(PUBLIC, "og-default.jpg");
const SOURCE = join(PUBLIC, "images", "hero", "accueil.webp");

async function main() {
  const width = 1200;
  const height = 630;

  // Create text SVG overlay
  const textSvg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="rgba(0,0,0,0.45)" />
      <text
        x="50%" y="45%"
        text-anchor="middle"
        dominant-baseline="middle"
        font-family="Georgia, serif"
        font-size="52"
        font-weight="bold"
        fill="white"
      >CMIEV</text>
      <text
        x="50%" y="58%"
        text-anchor="middle"
        dominant-baseline="middle"
        font-family="Arial, sans-serif"
        font-size="26"
        fill="rgba(255,255,255,0.9)"
      >Centre de Médecine Intégrative des Eaux-Vives</text>
      <text
        x="50%" y="68%"
        text-anchor="middle"
        dominant-baseline="middle"
        font-family="Arial, sans-serif"
        font-size="20"
        fill="rgba(255,255,255,0.7)"
      >Genève, Suisse</text>
    </svg>
  `;

  await sharp(SOURCE)
    .resize(width, height, { fit: "cover", position: "centre" })
    .composite([
      {
        input: Buffer.from(textSvg),
        top: 0,
        left: 0,
      },
    ])
    .jpeg({ quality: 85 })
    .toFile(OUTPUT);

  const stat = await sharp(OUTPUT).metadata();
  console.log(`Generated ${OUTPUT}`);
  console.log(`Dimensions: ${stat.width}x${stat.height}, format: ${stat.format}`);
}

main();
