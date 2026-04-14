import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { isValidLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { getVisiblePractitioners } from "@/lib/db/queries";
import { Hero } from "@/components/sections/Hero";
import { SectionWrapper } from "@/components/sections/SectionWrapper";
import { AnimatedSection } from "@/components/sections/AnimatedSection";
import { PractitionerCard } from "@/components/sections/PractitionerCard";
import { ContactCta } from "@/components/sections/ContactCta";
import { organizationJsonLd } from "@/lib/jsonld";

const specialtyIcons: Record<string, React.ReactNode> = {
  physio: (
    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
  ),
  osteo: (
    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
    </svg>
  ),
  psychiatry: (
    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
    </svg>
  ),
  homeopathy: (
    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="m20.893 13.393-1.135-1.135a2.252 2.252 0 0 1-.421-.585l-1.08-2.16a.414.414 0 0 0-.663-.107.827.827 0 0 1-.812.21l-1.273-.363a.89.89 0 0 0-.738 1.595l.587.39c.59.395.674 1.23.172 1.732l-.2.2c-.212.212-.33.498-.33.796v.41c0 .409-.11.809-.32 1.158l-1.315 2.191a2.11 2.11 0 0 1-1.81 1.025 1.055 1.055 0 0 1-1.055-1.055v-1.172c0-.92-.56-1.747-1.414-2.089l-.655-.261a2.25 2.25 0 0 1-1.383-2.46l.007-.042a2.25 2.25 0 0 1 .29-.787l.09-.15a2.25 2.25 0 0 1 2.37-1.048l1.178.236a1.125 1.125 0 0 0 1.302-.795l.208-.73a1.125 1.125 0 0 0-.578-1.315l-.665-.332-.091.091a2.25 2.25 0 0 1-1.591.659h-.18c-.249 0-.487.1-.662.274a.931.931 0 0 1-1.458-1.137l1.411-2.353a2.25 2.25 0 0 0 .286-.76m11.928 9.869A9 9 0 0 0 8.965 3.525m11.928 9.868A9 9 0 1 1 8.965 3.525" />
    </svg>
  ),
  fascia: (
    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.05 4.575a1.575 1.575 0 1 0-3.15 0v3.026a3 3 0 0 0-.263 0H6a3 3 0 0 0-3 3v1.5a3 3 0 0 0 3 3h1.494a3.75 3.75 0 0 0 1.514-.324M10.05 4.575V7.6m0-3.025a1.575 1.575 0 0 1 3.15 0V7.6m-3.15 0H7.637m5.563 0V4.575m0 3.025H10.05m3.15 0a3 3 0 0 1 3 3v1.5a3 3 0 0 1-3 3h-1.494m0 0a3.75 3.75 0 0 1-1.514-.324M10.05 15.6V18a3 3 0 0 0 3 3h.75a3 3 0 0 0 3-3v-2.4m-6.75 0h6.75" />
    </svg>
  ),
  pilates: (
    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
    </svg>
  ),
};

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
      siteName: "CMIEV",
      locale: locale === "fr" ? "fr_CH" : "en_GB",
      type: "website",
      images: [{ url: "https://cmiev.ch/og-default.jpg", width: 1200, height: 630, alt: dict.metadata.siteName }],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.metadata.siteName,
      description: dict.metadata.siteDescription,
      images: ["https://cmiev.ch/og-default.jpg"],
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

  const allPractitioners = await getVisiblePractitioners();
  const featuredPractitioners = allPractitioners.filter((p) => p.image).slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd(locale as Locale)),
        }}
      />

      {/* Hero */}
      <Hero
        title={dict.home.heroTitle}
        subtitle={dict.home.heroSubtitle}
        ctaText={dict.home.heroCta}
        ctaHref={`/${locale}/praticiens`}
        imageSrc="/images/hero/accueil.webp"
        imageAlt="Centre de Médecine Intégrative des Eaux-Vives, Genève"
      />

      {/* Trust / Stats Bar */}
      <section className="relative z-10 -mt-12 sm:-mt-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white shadow-xl sm:grid-cols-4">
              {[
                { value: "8", label: dict.home.statsSpecialists },
                { value: "Genève", label: dict.home.statsLocation },
                { value: "7+", label: dict.home.statsExperience },
                { value: "100%", label: dict.home.statsApproach },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col items-center justify-center px-3 py-4 text-center sm:px-4 sm:py-8"
                >
                  <span className="font-heading text-2xl font-bold text-primary sm:text-4xl">
                    {stat.value}
                  </span>
                  <span className="mt-1 text-xs text-muted-foreground sm:text-base">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Welcome / About */}
      <SectionWrapper>
        <AnimatedSection>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <span className="mb-4 inline-block h-1 w-16 rounded-full bg-accent" />
              <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                {dict.home.welcomeTitle}
              </h2>
              <div className="mt-8 space-y-5 text-lg leading-relaxed text-muted-foreground">
                <p>{dict.home.welcomeP1}</p>
                <p>{dict.home.welcomeP2}</p>
              </div>
            </div>
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
              <Image
                src="/images/galerie/cabinet-01.webp"
                alt="Salle de consultation du CMIEV, Genève"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </AnimatedSection>
      </SectionWrapper>

      {/* Specialties Grid */}
      <SectionWrapper variant="cream">
        <AnimatedSection>
          <div className="text-center">
            <span className="mx-auto mb-4 block h-1 w-16 rounded-full bg-accent" />
            <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              {dict.home.specialtiesTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              {dict.home.specialtiesSubtitle}
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 sm:mt-16">
            {dict.home.specialties.map((s) => (
              <div
                key={s.title}
                className="group rounded-2xl bg-white p-8 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                  {specialtyIcons[s.icon] || specialtyIcons.physio}
                </div>
                <h3 className="mt-6 font-heading text-xl font-bold text-foreground">
                  {s.title}
                </h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </SectionWrapper>

      {/* Quote / Philosophy */}
      <section className="relative overflow-hidden bg-primary py-20 sm:py-28 lg:py-36">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="/images/galerie/cabinet-06.webp"
            alt=""
            fill
            className="object-cover"
            aria-hidden="true"
          />
        </div>
        <div className="relative mx-auto max-w-4xl px-6 text-center sm:px-12">
          <AnimatedSection>
            <svg className="mx-auto h-12 w-12 text-white/30" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
            <blockquote className="mt-8">
              <p className="font-heading text-2xl font-medium leading-relaxed text-white sm:text-3xl lg:text-4xl">
                {dict.home.quoteText}
              </p>
            </blockquote>
            <p className="mt-6 text-lg font-semibold tracking-widest text-white/60 uppercase">
              — {dict.home.quoteAuthor}
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Featured Practitioners */}
      <SectionWrapper>
        <AnimatedSection>
          <div className="text-center">
            <span className="mx-auto mb-4 block h-1 w-16 rounded-full bg-accent" />
            <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              {dict.home.teamTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              {dict.home.teamSubtitle}
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 sm:mt-16">
            {featuredPractitioners.map((p) => (
              <PractitionerCard
                key={p.slug}
                name={p.name}
                title={p.title[locale as Locale]}
                slug={p.slug}
                locale={locale}
                image={p.image}
                phone={p.phone}
                specialties={p.specialties[locale as Locale]}
                ctaLabel={dict.practitioners.bookAppointment}
              />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              href={`/${locale}/praticiens`}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-primary px-8 py-4 font-semibold text-primary transition-all duration-300 hover:bg-primary hover:text-white sm:inline-flex sm:w-auto"
            >
              {dict.home.teamCta}
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </AnimatedSection>
      </SectionWrapper>

      {/* Gallery Teaser */}
      <SectionWrapper variant="sage">
        <AnimatedSection>
          <div className="text-center">
            <span className="mx-auto mb-4 block h-1 w-16 rounded-full bg-accent" />
            <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              {dict.home.galleryTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              {dict.home.gallerySubtitle}
            </p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-4 sm:mt-16 lg:grid-cols-4">
            {[
              { src: "/images/galerie/cabinet-01.webp", alt: "Salle de consultation CMIEV" },
              { src: "/images/pilates/pilates-reformer-1.webp", alt: "Pilates reformer session" },
              { src: "/images/physiotherapy/physio-treatment-2.webp", alt: "Physiotherapy treatment" },
              { src: "/images/wellness/wellness-studio-1.webp", alt: "Wellness studio" },
            ].map((img) => (
              <div
                key={img.src}
                className="group relative aspect-square overflow-hidden rounded-2xl"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href={`/${locale}/galerie`}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-primary px-8 py-4 font-semibold text-primary transition-all duration-300 hover:bg-primary hover:text-white sm:inline-flex sm:w-auto"
            >
              {dict.home.galleryCta}
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </AnimatedSection>
      </SectionWrapper>

      {/* Final CTA */}
      <ContactCta
        title={dict.home.ctaTitle}
        description={dict.home.ctaDescription}
        buttonText={dict.home.ctaButton}
        href={`/${locale}/contact`}
      />
    </>
  );
}
