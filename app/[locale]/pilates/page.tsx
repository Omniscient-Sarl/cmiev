import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isValidLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { Hero } from "@/components/sections/Hero";
import { SectionWrapper } from "@/components/sections/SectionWrapper";
import { AnimatedSection } from "@/components/sections/AnimatedSection";
import { ContactCta } from "@/components/sections/ContactCta";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const dict = await getDictionary(locale);
  const title = dict.pilates.title;
  const description = dict.pilates.subtitle;
  return {
    title,
    description,
    alternates: {
      canonical: `https://cmiev.ch/${locale}/pilates`,
      languages: { fr: "https://cmiev.ch/fr/pilates", en: "https://cmiev.ch/en/pilates" },
    },
    openGraph: { title, description, url: `https://cmiev.ch/${locale}/pilates`, locale: locale === "fr" ? "fr_CH" : "en_GB", type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function PilatesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale as Locale);

  return (
    <>
      <Hero
        title={dict.pilates.title}
        subtitle={dict.pilates.subtitle}
        imageSrc="/images/pilates/pilates-hero.webp"
        imageAlt="Séance de Pilates au CMIEV, Genève"
      />

      <SectionWrapper>
        <AnimatedSection>
          <h2 className="font-heading text-3xl font-bold text-foreground">{dict.pilates.whatIsTitle}</h2>
          <div className="mt-6 max-w-3xl space-y-4 text-muted-foreground leading-relaxed">
            <p>{dict.pilates.whatIsP1}</p>
            <p>{dict.pilates.whatIsP2}</p>
            <p>{dict.pilates.whatIsP3}</p>
            <p>{dict.pilates.whatIsP4}</p>
          </div>
        </AnimatedSection>
      </SectionWrapper>

      <SectionWrapper className="bg-secondary/50">
        <AnimatedSection>
          <h2 className="font-heading text-3xl font-bold text-foreground">{dict.pilates.benefitsTitle}</h2>
          <p className="mt-4 text-muted-foreground">{dict.pilates.benefitsIntro}</p>
          <ul className="mt-6 space-y-3">
            {dict.pilates.benefits.map((b) => (
              <li key={b} className="flex items-center gap-3 text-foreground">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </span>
                {b}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-muted-foreground">{dict.pilates.benefitsClosing}</p>
        </AnimatedSection>
      </SectionWrapper>

      <SectionWrapper>
        <AnimatedSection>
          <h2 className="font-heading text-3xl font-bold text-foreground">{dict.pilates.sessionsTitle}</h2>
          <div className="mt-6 max-w-3xl space-y-4 text-muted-foreground leading-relaxed">
            <p>{dict.pilates.sessionsP1}</p>
            <p>{dict.pilates.sessionsP2}</p>
            <p>{dict.pilates.sessionsP3}</p>
          </div>
        </AnimatedSection>
      </SectionWrapper>

      <SectionWrapper className="bg-secondary/50">
        <AnimatedSection>
          <h2 className="font-heading text-3xl font-bold text-foreground">{dict.pilates.pricingTitle}</h2>
          <ul className="mt-6 space-y-3">
            {dict.pilates.pricing.map((p) => (
              <li key={p} className="text-lg text-foreground font-medium">{p}</li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-primary font-medium">{dict.pilates.pricingDiscount}</p>
          <p className="mt-2 text-muted-foreground">{dict.pilates.pricingNote}</p>
        </AnimatedSection>
      </SectionWrapper>

      <SectionWrapper>
        <AnimatedSection>
          <h2 className="font-heading text-3xl font-bold text-foreground">{dict.pilates.qualitopTitle}</h2>
          <p className="mt-4 text-muted-foreground">{dict.pilates.qualitopText}</p>
        </AnimatedSection>
      </SectionWrapper>

      <ContactCta
        title={dict.pilates.contactTitle}
        description={`${dict.pilates.contactName} — ${dict.pilates.contactPhone}`}
        buttonText={dict.pilates.contactCta}
        href={`/${locale}/contact`}
      />
    </>
  );
}
