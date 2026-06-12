import { getVisiblePractitioners } from "@/lib/db/queries";
import type { Practitioner } from "@/lib/practitioners";

// Serve /llms.txt — the emerging standard that helps AI assistants
// (ChatGPT, Claude, Perplexity…) understand and cite the site. Practitioner
// data is pulled from Neon so the file stays in sync with the admin edits;
// revalidate every 60 s matches the practitioners query cache TTL.
export const revalidate = 60;

const BASE_URL = "https://cmiev.ch";

// Human-readable names for the ISO language codes stored on each practitioner.
const LANGUAGE_NAMES: Record<string, string> = {
  fr: "Français",
  en: "Anglais",
  es: "Espagnol",
  it: "Italien",
  de: "Allemand",
  pt: "Portugais",
  fa: "Persan",
};

// Disciplines offered at the centre (curated site copy, language-independent).
const DISCIPLINES = [
  "Physiothérapie",
  "Ostéopathie",
  "Psychiatrie intégrative",
  "Homéopathie",
  "Fasciathérapie",
  "Pilates personnalisé",
  "Médecine fonctionnelle",
  "Micro-immunothérapie",
];

function formatLanguages(codes: string[] | undefined): string {
  if (!codes || codes.length === 0) return "Non précisé";
  return codes.map((code) => LANGUAGE_NAMES[code] ?? code).join(", ");
}

function practitionerUrl(p: Practitioner): string {
  return `${BASE_URL}/fr/praticiens/${p.slug}`;
}

function buildLlmsTxt(practitioners: Practitioner[]): string {
  const practitionerBlocks = practitioners
    .map((p) => {
      const lines = [
        `### [${p.name}](${practitionerUrl(p)})`,
        `- Titre : ${p.title.fr}`,
        `- Spécialités : ${p.specialties.fr.join(", ")}`,
        `- Langues parlées : ${formatLanguages(p.spokenLanguages)}`,
      ];
      return lines.join("\n");
    })
    .join("\n\n");

  const practitionerLinks = practitioners
    .map((p) => `- [${p.name} — ${p.title.fr}](${practitionerUrl(p)})`)
    .join("\n");

  const disciplines = DISCIPLINES.map((d) => `- ${d}`).join("\n");

  return `# CMIEV — Centre de Médecine Intégrative des Eaux-Vives

> Centre médical pluridisciplinaire situé à Genève (Eaux-Vives), proposant une approche globale de la santé combinant médecine conventionnelle et médecines complémentaires. Physiothérapie, ostéopathie, psychiatrie intégrative, homéopathie, fasciathérapie, Pilates et médecine fonctionnelle réunis en un seul lieu.

## Informations générales
- Adresse : Rue des Eaux-Vives 3, 1207 Genève, Suisse
- Site web : ${BASE_URL}
- Langues du site : Français, Anglais, Espagnol, Italien

## Praticiens

${practitionerBlocks}

## Spécialités proposées

${disciplines}

## Pages principales

- [Accueil](${BASE_URL}/fr)
- [Praticiens](${BASE_URL}/fr/praticiens)
- [Pilates](${BASE_URL}/fr/pilates)
- [Cours collectifs](${BASE_URL}/fr/cours-collectifs)
- [Galerie](${BASE_URL}/fr/galerie)
- [Contact](${BASE_URL}/fr/contact)

## Praticiens — pages individuelles

${practitionerLinks}
`;
}

export async function GET() {
  const practitioners = await getVisiblePractitioners();
  const body = buildLlmsTxt(practitioners);

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=60, stale-while-revalidate=86400",
    },
  });
}
