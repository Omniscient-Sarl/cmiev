import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { isValidLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { Hero } from "@/components/sections/Hero";
import { SectionWrapper } from "@/components/sections/SectionWrapper";
import { AnimatedSection } from "@/components/sections/AnimatedSection";
import { ContactCta } from "@/components/sections/ContactCta";
import { getContentValue } from "@/lib/db/queries";

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
  const heroImage = await getContentValue("pilates.hero.image", "/images/pilates/pilates-hero.webp");
  const ogImageUrl = heroImage.startsWith("http") ? heroImage : `https://cmiev.ch${heroImage}`;
  return {
    title,
    description,
    alternates: {
      canonical: `https://cmiev.ch/${locale}/pilates`,
      languages: { fr: "https://cmiev.ch/fr/pilates", en: "https://cmiev.ch/en/pilates" },
    },
    openGraph: { title, description, url: `https://cmiev.ch/${locale}/pilates`, siteName: "CMIEV", locale: locale === "fr" ? "fr_CH" : "en_GB", type: "website", images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }] },
    twitter: { card: "summary_large_image", title, description, images: [ogImageUrl] },
  };
}

/* Benefit card icons */
function PostureIcon() {
  return (
    <svg className="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
  );
}

function MuscleIcon() {
  return (
    <svg className="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  );
}

function FlexIcon() {
  return (
    <svg className="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
    </svg>
  );
}

function MindIcon() {
  return (
    <svg className="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg className="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
    </svg>
  );
}

const benefitIcons = [PostureIcon, MuscleIcon, FlexIcon, MindIcon, ShieldIcon];

const defaultStripImages = [
  { src: "/images/pilates/pilates-reformer-1.webp", alt: "Pilates reformer exercise" },
  { src: "/images/pilates/pilates-mat-1.webp", alt: "Pilates mat workout" },
  { src: "/images/pilates/pilates-stretch-1.webp", alt: "Pilates stretching" },
  { src: "/images/pilates/pilates-group-1.webp", alt: "Group pilates class" },
  { src: "/images/pilates/pilates-reformer-3.webp", alt: "Pilates reformer session" },
];

export default async function PilatesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale as Locale);

  const heroImage = await getContentValue("pilates.hero.image", "/images/pilates/pilates-hero.webp");
  const whatIsImage = await getContentValue("pilates.whatIs.image", "/images/pilates/pilates-reformer-2.webp");
  const sessionsImage = await getContentValue("pilates.sessions.image", "/images/pilates/pilates-studio-1.webp");
  const pricingImage = await getContentValue("pilates.pricing.image", "/images/pilates/pilates-studio-2.webp");

  const photoStripImages = await Promise.all(
    defaultStripImages.map(async (img, i) => ({
      src: await getContentValue(`pilates.strip.image.${i + 1}`, img.src),
      alt: img.alt,
    }))
  );

  return (
    <>
      {/* ─── Hero ─── */}
      <Hero
        title={dict.pilates.title}
        subtitle={dict.pilates.subtitle}
        imageSrc={heroImage}
        imageAlt="Séance de Pilates au CMIEV, Genève"
      />

      {/* ─── What is Pilates ─── */}
      <SectionWrapper>
        <AnimatedSection>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <div className="mb-4 h-1 w-16 rounded-full bg-primary" aria-hidden="true" />
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold tracking-tight text-foreground">
                {dict.pilates.whatIsTitle}
              </h2>
              <div className="mt-6 space-y-4">
                <p className="text-lg leading-relaxed text-muted-foreground">
                  {dict.pilates.whatIsP1}
                </p>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  {dict.pilates.whatIsP2}
                </p>
              </div>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-lg">
              <Image
                src={whatIsImage}
                alt="Pilates reformer exercise session"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </AnimatedSection>
      </SectionWrapper>

      {/* ─── Photo Strip ─── */}
      <div className="overflow-hidden bg-white py-4">
        <div className="flex gap-4 animate-none">
          {photoStripImages.map((img) => (
            <div
              key={img.src}
              className="relative h-48 w-72 shrink-0 overflow-hidden rounded-xl sm:h-56 sm:w-80 lg:h-64 lg:w-96"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 288px, (max-width: 1024px) 320px, 384px"
              />
            </div>
          ))}
        </div>
      </div>

      {/* ─── Benefits ─── */}
      <SectionWrapper variant="cream">
        <AnimatedSection>
          <div className="text-center">
            <div className="mx-auto mb-4 h-1 w-16 rounded-full bg-primary" aria-hidden="true" />
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold tracking-tight text-foreground">
              {dict.pilates.benefitsTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              {dict.pilates.benefitsIntro}
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {dict.pilates.benefits.map((b, i) => {
              const Icon = benefitIcons[i] ?? benefitIcons[0];
              return (
                <div
                  key={b}
                  className="group flex items-start gap-4 rounded-2xl bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                    <Icon />
                  </span>
                  <p className="text-base font-medium text-foreground leading-relaxed pt-2.5">
                    {b}
                  </p>
                </div>
              );
            })}
          </div>

          <p className="mx-auto mt-10 max-w-3xl text-center text-muted-foreground">
            {dict.pilates.benefitsClosing}
          </p>
        </AnimatedSection>
      </SectionWrapper>

      {/* ─── Sessions ─── */}
      <SectionWrapper>
        <AnimatedSection>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div className="order-2 lg:order-1">
              <div className="mb-4 h-1 w-16 rounded-full bg-primary" aria-hidden="true" />
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold tracking-tight text-foreground">
                {dict.pilates.sessionsTitle}
              </h2>
              <div className="mt-6 space-y-5">
                <p className="text-lg leading-relaxed text-muted-foreground">
                  {dict.pilates.sessionsP1}
                </p>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  {dict.pilates.sessionsP2}
                </p>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  {dict.pilates.sessionsP3}
                </p>
              </div>
            </div>

            <div className="relative order-1 aspect-[4/5] overflow-hidden rounded-2xl shadow-lg lg:order-2">
              <Image
                src={sessionsImage}
                alt="Pilates studio session"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </AnimatedSection>
      </SectionWrapper>

      {/* ─── Pricing ─── */}
      <section className="relative overflow-hidden py-20 sm:py-28 lg:py-32">
        <Image
          src={pricingImage}
          alt=""
          fill
          className="object-cover"
          aria-hidden="true"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-primary/90" />
        <div className="relative mx-auto max-w-7xl px-6 sm:px-12 lg:px-20">
          <AnimatedSection>
            <div className="text-center">
              <div className="mx-auto mb-4 h-1 w-16 rounded-full bg-accent" aria-hidden="true" />
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold tracking-tight text-white">
                {dict.pilates.pricingTitle}
              </h2>
            </div>

            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {dict.pilates.pricing.map((p, i) => {
                const priceMatch = p.match(/CHF\s[\d\u2019'.]+/);
                const price = priceMatch ? priceMatch[0] : "";
                const label = p.replace(price, "").replace(/^[\s—\-–]+|[\s—\-–]+$/g, "").trim();
                const isBestValue = i === 2;

                return (
                  <div
                    key={p}
                    className={`relative flex flex-col items-center rounded-2xl bg-white/10 backdrop-blur-sm p-8 text-center transition-all duration-300 hover:-translate-y-1 ${
                      isBestValue ? "ring-2 ring-accent bg-white/20" : ""
                    }`}
                  >
                    {isBestValue && (
                      <span className="absolute -top-3.5 rounded-full bg-accent px-4 py-1 text-xs font-semibold uppercase tracking-wider text-white">
                        Best value
                      </span>
                    )}
                    <span className="mt-2 text-3xl font-bold tracking-tight text-white">
                      {price}
                    </span>
                    <span className="mt-2 text-sm text-white/70">{label}</span>
                  </div>
                );
              })}
            </div>

            <div className="mx-auto mt-8 max-w-xl text-center">
              <p className="text-lg font-semibold text-accent">
                {dict.pilates.pricingDiscount}
              </p>
              <p className="mt-2 text-white/70">
                {dict.pilates.pricingNote}
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── Qualitop Trust Banner ─── */}
      <SectionWrapper variant="sage">
        <AnimatedSection>
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left sm:gap-6">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <svg className="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
              </svg>
            </span>
            <div>
              <h2 className="text-xl font-heading font-bold text-foreground">
                {dict.pilates.qualitopTitle}
              </h2>
              <p className="mt-1 text-muted-foreground">
                {dict.pilates.qualitopText}
              </p>
            </div>
          </div>
        </AnimatedSection>
      </SectionWrapper>

      {/* ─── Contact CTA ─── */}
      <ContactCta
        title={dict.pilates.contactTitle}
        description={`${dict.pilates.contactName} — ${dict.pilates.contactPhone}`}
        buttonText={dict.pilates.contactCta}
        href={`/${locale}/contact`}
      />
    </>
  );
}
