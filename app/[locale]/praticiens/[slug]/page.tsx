import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { isValidLocale, locales, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { practitioners, getPractitionerBySlug } from "@/lib/practitioners";
import { SectionWrapper } from "@/components/sections/SectionWrapper";
import { AnimatedSection } from "@/components/sections/AnimatedSection";
import { ContactCta } from "@/components/sections/ContactCta";
import { physicianJsonLd, breadcrumbJsonLd } from "@/lib/jsonld";

export async function generateStaticParams() {
  return locales.flatMap((locale) =>
    practitioners.map((p) => ({ locale, slug: p.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) return {};
  const practitioner = getPractitionerBySlug(slug);
  if (!practitioner) return {};
  const title = `${practitioner.name} — ${practitioner.title[locale as Locale]}, Genève`;
  const description = `${practitioner.name}, ${practitioner.title[locale as Locale]} au CMIEV, Eaux-Vives, Genève. ${practitioner.specialties[locale as Locale].join(", ")}.`;
  return {
    title,
    description,
    alternates: {
      canonical: `https://cmiev.ch/${locale}/praticiens/${slug}`,
      languages: {
        fr: `https://cmiev.ch/fr/praticiens/${slug}`,
        en: `https://cmiev.ch/en/praticiens/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `https://cmiev.ch/${locale}/praticiens/${slug}`,
      locale: locale === "fr" ? "fr_CH" : "en_GB",
      type: "profile",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function PractitionerPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) notFound();
  const practitioner = getPractitionerBySlug(slug);
  if (!practitioner) notFound();
  const dict = await getDictionary(locale as Locale);
  const loc = locale as Locale;

  const breadcrumbs = [
    { name: dict.practitioners.breadcrumbHome, url: `https://cmiev.ch/${locale}` },
    { name: dict.practitioners.breadcrumbPractitioners, url: `https://cmiev.ch/${locale}/praticiens` },
    { name: practitioner.name, url: `https://cmiev.ch/${locale}/praticiens/${slug}` },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(physicianJsonLd(practitioner, loc)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)),
        }}
      />

      {/* Hero with practitioner image */}
      <section className="relative bg-secondary">
        <div className="mx-auto grid max-w-7xl lg:grid-cols-2">
          <div className="relative aspect-[3/4] w-full lg:aspect-auto lg:min-h-[500px]">
            <Image
              src={practitioner.image}
              alt={practitioner.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:py-24">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
                <li>
                  <Link href={`/${locale}`} className="hover:text-foreground transition-colors">
                    {dict.practitioners.breadcrumbHome}
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link href={`/${locale}/praticiens`} className="hover:text-foreground transition-colors">
                    {dict.practitioners.breadcrumbPractitioners}
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-foreground font-medium">{practitioner.name}</li>
              </ol>
            </nav>

            <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
              {practitioner.name} — {practitioner.title[loc]}, Genève
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">{practitioner.phone}</p>
            {practitioner.email && (
              <p className="mt-1 text-muted-foreground">
                <a href={`mailto:${practitioner.email}`} className="hover:text-primary transition-colors">
                  {practitioner.email}
                </a>
              </p>
            )}
          </div>
        </div>
      </section>

      <SectionWrapper>
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Bio */}
          <div className="lg:col-span-2">
            <AnimatedSection>
              <h2 className="font-heading text-2xl font-bold text-foreground">
                {dict.practitioners.biography}
              </h2>
              <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
                {practitioner.bio[loc].map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </AnimatedSection>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <AnimatedSection>
              <h2 className="font-heading text-xl font-bold text-foreground">
                {dict.practitioners.specialties}
              </h2>
              <ul className="mt-4 space-y-2">
                {practitioner.specialties[loc].map((s) => (
                  <li key={s} className="flex items-center gap-2 text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" aria-hidden="true" />
                    {s}
                  </li>
                ))}
              </ul>
            </AnimatedSection>

            <AnimatedSection>
              <h2 className="font-heading text-xl font-bold text-foreground">
                {dict.practitioners.conditionsTreated}
              </h2>
              <ul className="mt-4 space-y-2">
                {practitioner.conditions[loc].map((c) => (
                  <li key={c} className="flex items-center gap-2 text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent shrink-0" aria-hidden="true" />
                    {c}
                  </li>
                ))}
              </ul>
            </AnimatedSection>
          </div>
        </div>
      </SectionWrapper>

      <ContactCta
        title={dict.practitioners.bookAppointment}
        description={`${dict.practitioners.bookAppointment} — ${practitioner.name}`}
        buttonText={dict.practitioners.bookAppointment}
        href={`/${locale}/contact`}
      />
    </>
  );
}
