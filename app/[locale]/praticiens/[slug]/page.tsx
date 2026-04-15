import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { isValidLocale, locales, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { getAllPractitioners, getPractitionerBySlugCached } from "@/lib/db/queries";
import { SectionWrapper } from "@/components/sections/SectionWrapper";
import { AnimatedSection } from "@/components/sections/AnimatedSection";
import { PractitionerContactForm } from "@/components/sections/PractitionerContactForm";
import { physicianJsonLd, breadcrumbJsonLd } from "@/lib/jsonld";

export async function generateStaticParams() {
  const allPractitioners = await getAllPractitioners();
  return locales.flatMap((locale) =>
    allPractitioners.map((p) => ({ locale, slug: p.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) return {};
  const practitioner = await getPractitionerBySlugCached(slug);
  if (!practitioner) return {};
  const title = `${practitioner.name} — ${practitioner.title[locale as Locale]}, Genève`;
  const description = `${practitioner.name}, ${practitioner.title[locale as Locale]} au CMIEV, Eaux-Vives, Genève. ${practitioner.specialties[locale as Locale].join(", ")}.`;
  const ogImage = practitioner.image
    ? `https://cmiev.ch${practitioner.image}`
    : "https://cmiev.ch/og-default.jpg";
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
      siteName: "CMIEV",
      locale: locale === "fr" ? "fr_CH" : "en_GB",
      type: "profile",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [ogImage] },
  };
}

export default async function PractitionerPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) notFound();
  const practitioner = await getPractitionerBySlugCached(slug);
  if (!practitioner) notFound();
  const dict = await getDictionary(locale as Locale);
  const loc = locale as Locale;

  const breadcrumbs = [
    { name: dict.practitioners.breadcrumbHome, url: `https://cmiev.ch/${locale}` },
    { name: dict.practitioners.breadcrumbPractitioners, url: `https://cmiev.ch/${locale}/praticiens` },
    { name: practitioner.name, url: `https://cmiev.ch/${locale}/praticiens/${slug}` },
  ];

  const hasImage = !!practitioner.image;
  const textColor = hasImage ? "text-white" : "text-primary-foreground";

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
      <section className="relative flex h-[calc(100dvh-5rem)] flex-col justify-end overflow-hidden bg-primary">
        {hasImage ? (
          <>
            <Image
              src={practitioner.image!}
              alt={practitioner.name}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
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

        <div className="relative z-10 px-4 pb-12 sm:px-12 sm:pb-16 lg:px-20 lg:pb-24">
          <div className="mb-4 h-px w-16 bg-accent sm:mb-6 sm:w-24" />

          <h1 className={`font-heading text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl ${textColor}`}>
            {practitioner.name}
          </h1>
          <p className={`mt-3 text-base font-light tracking-wide sm:text-xl ${hasImage ? "text-white/80" : "text-primary-foreground/80"}`}>
            {practitioner.title[loc]}, Genève
          </p>

          <div className="mt-8 sm:mt-10">
            <Link
              href="#contact"
              className="flex w-full items-center justify-center rounded-xl bg-accent px-8 py-4 text-base font-semibold text-accent-foreground shadow-lg shadow-accent/25 transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-accent/30 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none sm:inline-flex sm:w-auto sm:text-lg"
            >
              {dict.practitioners.bookAppointment}
            </Link>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 text-xs tracking-wide uppercase text-muted-foreground">
            <li>
              <Link href={`/${locale}`} className="transition-colors hover:text-foreground">
                {dict.practitioners.breadcrumbHome}
              </Link>
            </li>
            <li aria-hidden="true">
              <svg className="h-3 w-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li>
              <Link href={`/${locale}/praticiens`} className="transition-colors hover:text-foreground">
                {dict.practitioners.breadcrumbPractitioners}
              </Link>
            </li>
            <li aria-hidden="true">
              <svg className="h-3 w-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li className="font-medium text-foreground">{practitioner.name}</li>
          </ol>
        </nav>
      </div>

      {/* Bio & Sidebar */}
      <SectionWrapper>
        <div className="grid gap-12 lg:grid-cols-3 lg:gap-16">
          {/* Bio */}
          <div className="lg:col-span-2">
            <AnimatedSection>
              {/* Contact info */}
              <div className="mb-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
                {practitioner.phone && (
                  <a href={`tel:${practitioner.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-2 transition-colors hover:text-primary">
                    <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                    {practitioner.phone}
                  </a>
                )}
                {practitioner.email && (
                  <a href={`mailto:${practitioner.email}`} className="inline-flex items-center gap-2 transition-colors hover:text-primary">
                    <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                    {practitioner.email}
                  </a>
                )}
              </div>
              <div className="mb-4 h-1 w-12 rounded-full bg-primary" aria-hidden="true" />
              <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
                {dict.practitioners.biography}
              </h2>
              <div className="mt-8 space-y-6 text-lg leading-relaxed text-muted-foreground">
                {practitioner.bio[loc].map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </AnimatedSection>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Specialties */}
            <AnimatedSection>
              <div className="rounded-2xl bg-[#f5f0e8] p-8">
                <h2 className="font-heading text-xl font-bold text-foreground">
                  {dict.practitioners.specialties}
                </h2>
                <div className="mt-5 flex flex-wrap gap-2">
                  {practitioner.specialties[loc].map((s) => (
                    <span
                      key={s}
                      className="inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            {/* Spoken Languages */}
            {practitioner.spokenLanguages && practitioner.spokenLanguages.length > 0 && (
              <AnimatedSection>
                <div className="rounded-2xl bg-[#f5f0e8] p-8">
                  <h2 className="font-heading text-xl font-bold text-foreground">
                    {dict.practitioners.languagesSpoken}
                  </h2>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {practitioner.spokenLanguages.map((code) => {
                      const langMap = dict.practitioners.languages as Record<string, string>;
                      return (
                        <span
                          key={code}
                          className="inline-block rounded-full border border-[#5A7A6F]/40 bg-[#5A7A6F] px-4 py-2 text-sm font-medium text-white"
                        >
                          {langMap[code] ?? code}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </AnimatedSection>
            )}

            {/* Conditions */}
            <AnimatedSection>
              <div className="rounded-2xl bg-[#f5f0e8] p-8">
                <h2 className="font-heading text-xl font-bold text-foreground">
                  {dict.practitioners.conditionsTreated}
                </h2>
                <ul className="mt-5 space-y-3">
                  {practitioner.conditions[loc].map((c) => (
                    <li key={c} className="flex items-start gap-3 text-muted-foreground">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </SectionWrapper>

      {/* Per-practitioner contact form */}
      {practitioner.email && (
        <SectionWrapper variant="cream" id="contact">
          <AnimatedSection>
            <div className="mx-auto max-w-2xl">
              <div className="text-center">
                <span className="mx-auto mb-4 block h-1 w-16 rounded-full bg-accent" />
                <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  {dict.practitioners.bookAppointment}
                </h2>
                <p className="mt-3 text-muted-foreground">
                  {dict.practitioners.bookAppointment} — {practitioner.name}
                </p>
              </div>
              <div className="mt-10">
                <PractitionerContactForm
                  practitionerSlug={practitioner.slug}
                  practitionerName={practitioner.name}
                  dict={{
                    nameLabel: dict.contact.nameLabel,
                    namePlaceholder: dict.contact.namePlaceholder,
                    emailLabel: dict.contact.emailLabel,
                    emailPlaceholder: dict.contact.emailPlaceholder,
                    phoneLabel: dict.contact.phoneLabel,
                    phonePlaceholder: dict.contact.phonePlaceholder,
                    messageLabel: dict.contact.messageLabel,
                    messagePlaceholder: dict.contact.messagePlaceholder,
                    submit: dict.contact.submit,
                    sending: dict.contact.sending,
                    successTitle: dict.contact.successTitle,
                    successMessage: dict.contact.successMessage,
                    errorTitle: dict.contact.errorTitle,
                    errorMessage: dict.contact.errorMessage,
                  }}
                />
              </div>
            </div>
          </AnimatedSection>
        </SectionWrapper>
      )}
    </>
  );
}
