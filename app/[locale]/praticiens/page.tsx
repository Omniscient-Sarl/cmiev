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
      siteName: "CMIEV",
      locale: locale === "fr" ? "fr_CH" : "en_GB",
      type: "website",
      images: [{ url: "https://cmiev.ch/og-default.jpg", width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["https://cmiev.ch/og-default.jpg"] },
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
        <div className="mx-auto max-w-3xl text-center">
          <span className="mx-auto mb-4 block h-1 w-16 rounded-full bg-accent" />
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {dict.practitioners.subtitle}
          </h2>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {practitioners.map((p) => (
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
