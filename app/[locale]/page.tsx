import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isValidLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { Hero } from "@/components/sections/Hero";
import { SectionWrapper } from "@/components/sections/SectionWrapper";
import { AnimatedSection } from "@/components/sections/AnimatedSection";
import { ContactCta } from "@/components/sections/ContactCta";
import { organizationJsonLd } from "@/lib/jsonld";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return {
    title: dict.metadata.siteName,
    description: dict.metadata.siteDescription,
    alternates: {
      canonical: `https://cmiev.ch/${locale}`,
      languages: { fr: "https://cmiev.ch/fr", en: "https://cmiev.ch/en" },
    },
    openGraph: {
      title: dict.metadata.siteName,
      description: dict.metadata.siteDescription,
      url: `https://cmiev.ch/${locale}`,
      locale: locale === "fr" ? "fr_CH" : "en_GB",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: dict.metadata.siteName,
      description: dict.metadata.siteDescription,
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale as Locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd(locale as Locale)),
        }}
      />
      <Hero
        title={dict.home.heroTitle}
        subtitle={dict.home.heroSubtitle}
        ctaText={dict.home.heroCta}
        ctaHref={`/${locale}/praticiens`}
        imageSrc="/images/hero/accueil.webp"
        imageAlt="Centre de Médecine Intégrative des Eaux-Vives, Genève"
      />
      <SectionWrapper>
        <AnimatedSection>
          <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
            {dict.home.welcomeTitle}
          </h2>
          <div className="mt-8 max-w-3xl space-y-6 text-muted-foreground leading-relaxed">
            <p>{dict.home.welcomeP1}</p>
            <p>{dict.home.welcomeP2}</p>
            <p>{dict.home.welcomeP3}</p>
            <p>{dict.home.welcomeP4}</p>
          </div>
        </AnimatedSection>
      </SectionWrapper>
      <SectionWrapper className="bg-secondary/50">
        <AnimatedSection>
          <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
            {dict.home.disciplinesTitle}
          </h2>
          <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {dict.home.disciplines.map((d) => (
              <li
                key={d}
                className="flex items-center gap-3 rounded-lg bg-card p-4 shadow-sm"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </span>
                <span className="text-foreground font-medium">{d}</span>
              </li>
            ))}
          </ul>
        </AnimatedSection>
      </SectionWrapper>
      <ContactCta
        title={dict.home.ctaTitle}
        description={dict.home.ctaDescription}
        buttonText={dict.home.ctaButton}
        href={`/${locale}/contact`}
      />
    </>
  );
}
