import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isValidLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { practitioners } from "@/lib/practitioners";
import { Hero } from "@/components/sections/Hero";
import { SectionWrapper } from "@/components/sections/SectionWrapper";
import { AnimatedSection } from "@/components/sections/AnimatedSection";
import { PractitionerCard } from "@/components/sections/PractitionerCard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const dict = await getDictionary(locale);
  const title = dict.practitioners.title;
  const description = dict.practitioners.subtitle;
  return {
    title,
    description,
    alternates: {
      canonical: `https://cmiev.ch/${locale}/praticiens`,
      languages: { fr: "https://cmiev.ch/fr/praticiens", en: "https://cmiev.ch/en/praticiens" },
    },
    openGraph: {
      title,
      description,
      url: `https://cmiev.ch/${locale}/praticiens`,
      locale: locale === "fr" ? "fr_CH" : "en_GB",
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description },
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

  return (
    <>
      <Hero title={dict.practitioners.title} subtitle={dict.practitioners.subtitle} />
      <SectionWrapper>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {practitioners.map((p) => (
            <AnimatedSection key={p.slug}>
              <PractitionerCard
                name={p.name}
                title={p.title[locale as Locale]}
                slug={p.slug}
                locale={locale}
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
