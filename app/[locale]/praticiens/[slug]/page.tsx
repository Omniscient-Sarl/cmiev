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

      {/* Hero */}
      <section className="relative flex h-[calc(100dvh-4rem)] flex-col justify-end overflow-hidden bg-primary px-6 pb-12 sm:px-12 lg:pb-24">
        {practitioner.image ? (
          <>
            <Image
              src={practitioner.image}
              alt={practitioner.name}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          </>
        ) : (
          <span
            className="pointer-events-none absolute inset-0 flex items-center justify-center font-heading text-[12rem] font-bold text-primary-foreground/10 select-none sm:text-[16rem] lg:text-[20rem]"
            aria-hidden="true"
          >
            {practitioner.name
              .split(" ")
              .map((w) => w[0])
              .filter(Boolean)
              .slice(0, 2)
              .join("")
              .toUpperCase()}
          </span>
        )}

        <div className="relative z-10">
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className={`flex flex-wrap items-center gap-1.5 text-sm ${practitioner.image ? "text-white/70" : "text-primary-foreground/70"}`}>
              <li>
                <Link href={`/${locale}`} className={`transition-colors ${practitioner.image ? "hover:text-white" : "hover:text-primary-foreground"}`}>
                  {dict.practitioners.breadcrumbHome}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href={`/${locale}/praticiens`} className={`transition-colors ${practitioner.image ? "hover:text-white" : "hover:text-primary-foreground"}`}>
                  {dict.practitioners.breadcrumbPractitioners}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className={`font-medium ${practitioner.image ? "text-white" : "text-primary-foreground"}`}>{practitioner.name}</li>
            </ol>
          </nav>

          <h1 className={`font-heading text-3xl font-bold sm:text-4xl lg:text-5xl ${practitioner.image ? "text-white" : "text-primary-foreground"}`}>
            {practitioner.name} — {practitioner.title[loc]}, Genève
          </h1>
          <p className={`mt-3 text-lg ${practitioner.image ? "text-white/80" : "text-primary-foreground/80"}`}>{practitioner.phone}</p>
          {practitioner.email && (
            <p className={`mt-1 ${practitioner.image ? "text-white/80" : "text-primary-foreground/80"}`}>
              <a href={`mailto:${practitioner.email}`} className={`underline underline-offset-2 transition-colors ${practitioner.image ? "hover:text-white" : "hover:text-primary-foreground"}`}>
                {practitioner.email}
              </a>
            </p>
          )}
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
