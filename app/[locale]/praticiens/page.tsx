import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { isValidLocale, ogLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { getVisiblePractitioners } from "@/lib/db/queries";
import { SectionWrapper } from "@/components/sections/SectionWrapper";
import { AnimatedSection } from "@/components/sections/AnimatedSection";
import { PractitionerCard } from "@/components/sections/PractitionerCard";

const practitionerPhotos = [
  { src: "/images/praticiens/karen-aguiar.webp", name: "Karen Aguiar" },
  { src: "/images/praticiens/elio-bosani.webp", name: "Elio Bosani" },
  { src: "/images/praticiens/corinne-dauve.webp", name: "Dr Corinne Dauve" },
  { src: "/images/praticiens/isaline-henry.webp", name: "Isaline Henry" },
  { src: "/images/praticiens/beatrice-limbert.webp", name: "Béatrice Milbert" },
  { src: "/images/praticiens/shima-sazegari.webp", name: "Shima Sazegari" },
  { src: "/images/praticiens/severine-schwab.webp", name: "Séverine Schwab" },
  { src: "/images/praticiens/fiorenza-toffolon.webp", name: "Fiorenza Toffolon" },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const dict = await getDictionary(locale);
  const seoTitle: Record<Locale, string> = {
    fr: "Nos praticiens — Centre de Médecine Intégrative des Eaux-Vives, Genève",
    en: "Our practitioners — Centre de Médecine Intégrative des Eaux-Vives, Geneva",
    es: "Nuestros practicantes — Centre de Médecine Intégrative des Eaux-Vives, Ginebra",
    it: "I nostri professionisti — Centre de Médecine Intégrative des Eaux-Vives, Ginevra",
  };
  const seoDescription: Record<Locale, string> = {
    fr: "Découvrez l'équipe pluridisciplinaire du CMIEV : ostéopathie, physiothérapie, psychiatrie intégrative, homéopathie et Pilates à Genève Eaux-Vives.",
    en: "Meet the multidisciplinary team at CMIEV: osteopathy, physiotherapy, integrative psychiatry, homeopathy and Pilates in Geneva Eaux-Vives.",
    es: "Conozca al equipo multidisciplinar del CMIEV: osteopatía, fisioterapia, psiquiatría integrativa, homeopatía y Pilates en Ginebra Eaux-Vives.",
    it: "Scoprite il team multidisciplinare del CMIEV: osteopatia, fisioterapia, psichiatria integrativa, omeopatia e Pilates a Ginevra Eaux-Vives.",
  };
  const title = seoTitle[locale];
  const description = seoDescription[locale];
  const ogImageUrl = `https://cmiev.ch${practitionerPhotos[0].src}`;
  return {
    title,
    description,
    alternates: {
      canonical: `https://cmiev.ch/${locale}/praticiens`,
      languages: { fr: "https://cmiev.ch/fr/praticiens", en: "https://cmiev.ch/en/praticiens", es: "https://cmiev.ch/es/praticiens", it: "https://cmiev.ch/it/praticiens" },
    },
    openGraph: {
      title,
      description,
      url: `https://cmiev.ch/${locale}/praticiens`,
      siteName: "CMIEV",
      locale: ogLocale(locale as Locale),
      type: "website",
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [ogImageUrl] },
  };
}

export default async function PractitionersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale as Locale);

  const allPractitioners = await getVisiblePractitioners();

  return (
    <>
      {/* Practitioner Mosaic Hero */}
      <section className="relative flex h-[calc(100dvh-5rem)] overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-4 grid-rows-2 lg:grid-cols-8 lg:grid-rows-1">
          {practitionerPhotos.map((p) => (
            <div key={p.name} className="relative overflow-hidden">
              <Image
                src={p.src}
                alt={p.name}
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 25vw, 12.5vw"
                priority
              />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/30" />

        <div className="relative z-10 flex w-full flex-col justify-end px-4 pb-12 sm:px-12 sm:pb-24 lg:px-20 lg:pb-28">
          <div className="mb-4 h-px w-16 bg-accent sm:mb-6 sm:w-24" />
          <h1 className="font-heading text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
            {dict.practitioners.title}
          </h1>
          <p className="mt-4 max-w-2xl text-base text-white/90 sm:mt-6 sm:text-xl lg:text-2xl">
            {dict.practitioners.subtitle}
          </p>
        </div>
      </section>

      <SectionWrapper>
        <div className="mx-auto max-w-3xl text-center">
          <span className="mx-auto mb-4 block h-1 w-16 rounded-full bg-accent" />
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {dict.practitioners.subtitle}
          </h2>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {allPractitioners.map((p) => (
            <AnimatedSection key={p.slug}>
              <PractitionerCard
                name={p.name}
                title={p.title[locale as Locale]}
                slug={p.slug}
                locale={locale}
                image={p.image}
                phone={p.phone}
                specialties={p.specialties[locale as Locale]}
                ctaLabel={dict.practitioners.bookAppointment}
              />
            </AnimatedSection>
          ))}
        </div>
      </SectionWrapper>
    </>
  );
}
