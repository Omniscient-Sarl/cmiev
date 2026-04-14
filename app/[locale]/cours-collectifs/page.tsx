import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
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
  const title = dict.groupClasses.title;
  const description = dict.groupClasses.subtitle;
  return {
    title,
    description,
    alternates: {
      canonical: `https://cmiev.ch/${locale}/cours-collectifs`,
      languages: { fr: "https://cmiev.ch/fr/cours-collectifs", en: "https://cmiev.ch/en/cours-collectifs" },
    },
    openGraph: { title, description, url: `https://cmiev.ch/${locale}/cours-collectifs`, siteName: "CMIEV", locale: locale === "fr" ? "fr_CH" : "en_GB", type: "website", images: [{ url: "https://cmiev.ch/og-default.jpg", width: 1200, height: 630, alt: title }] },
    twitter: { card: "summary_large_image", title, description, images: ["https://cmiev.ch/og-default.jpg"] },
  };
}

const whyJoinImages = [
  { src: "/images/pilates/pilates-group-1.webp", alt: "Group pilates session" },
  { src: "/images/cours/group-class-3.webp", alt: "Fitness group training" },
  { src: "/images/cours/group-class-1.webp", alt: "Wellness group class" },
];

const dayBgColors = [
  "from-primary/90 to-primary",
  "from-[#8B6F4E]/90 to-[#8B6F4E]",
  "from-[#5A7A6F]/90 to-[#5A7A6F]",
  "from-[#9B6B5E]/90 to-[#9B6B5E]",
  "from-primary/90 to-primary",
];

export default async function GroupClassesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale as Locale);
  const schedule = dict.groupClasses.schedule;
  const days = [schedule.monday, schedule.tuesday, schedule.wednesday, schedule.thursday, schedule.friday];

  return (
    <>
      {/* ─── Hero ─── */}
      <Hero
        title={dict.groupClasses.title}
        subtitle={dict.groupClasses.subtitle}
        imageSrc="/images/cours/group-class-1.webp"
        imageAlt="Group fitness class"
      />

      {/* ─── Intro ─── */}
      <SectionWrapper>
        <AnimatedSection>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <div className="mx-auto mb-6 h-1 w-16 rounded-full bg-primary lg:mx-0" />
              <p className="text-lg leading-relaxed text-muted-foreground">
                {dict.groupClasses.intro}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-8">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span>{dict.groupClasses.phone}</span>
                </div>
                {dict.groupClasses.emails.map((e) => (
                  <div key={e} className="flex items-center gap-2 text-muted-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    <a href={`mailto:${e}`} className="text-primary hover:underline">{e}</a>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-lg">
              <Image
                src="/images/cours/group-class-2.webp"
                alt="Wellness stretching class"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </AnimatedSection>
      </SectionWrapper>

      {/* ─── Schedule Grid ─── */}
      <SectionWrapper variant="cream">
        <AnimatedSection>
          <div className="text-center mb-12">
            <div className="mx-auto mb-4 h-1 w-16 rounded-full bg-accent" aria-hidden="true" />
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold tracking-tight text-foreground">
              {locale === "fr" ? "Horaires des cours" : "Class Schedule"}
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {days.map((day, i) => (
              <div
                key={day.day}
                className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className={`relative bg-gradient-to-br ${dayBgColors[i]} px-5 py-4`}>
                  <h3 className="relative z-10 font-heading text-lg font-bold text-white text-center">
                    {day.day}
                  </h3>
                </div>

                <ul className="flex-1 space-y-4 p-5">
                  {day.classes.map((c, j) => (
                    <li key={j} className="border-l-2 border-primary/20 pl-3">
                      <p className="font-medium text-foreground">{c.name}</p>
                      <p className="text-sm text-muted-foreground">{c.time}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </SectionWrapper>

      {/* ─── Why Join Us (3 photos) ─── */}
      <SectionWrapper>
        <AnimatedSection>
          <div className="text-center mb-12">
            <div className="mx-auto mb-4 h-1 w-16 rounded-full bg-primary" aria-hidden="true" />
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold tracking-tight text-foreground">
              {locale === "fr" ? "Pourquoi nous rejoindre" : "Why Join Us"}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              {locale === "fr"
                ? "Des cours encadrés par des professionnels qualifiés, dans un environnement bienveillant et motivant."
                : "Classes led by qualified professionals, in a supportive and motivating environment."}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {whyJoinImages.map((img, i) => (
              <div key={img.src} className="group relative aspect-[3/4] overflow-hidden rounded-2xl">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="font-heading text-lg font-bold text-white">
                    {i === 0
                      ? (locale === "fr" ? "Pilates en groupe" : "Group Pilates")
                      : i === 1
                        ? (locale === "fr" ? "Bien-être" : "Wellness")
                        : (locale === "fr" ? "Cours collectifs" : "Group Classes")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </SectionWrapper>

      {/* ─── GLAD Callout Banner ─── */}
      <section className="relative overflow-hidden py-16 sm:py-20">
        <Image
          src="/images/physiotherapy/physio-rehab-1.webp"
          alt=""
          fill
          className="object-cover"
          aria-hidden="true"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-primary/85" />
        <div className="relative mx-auto max-w-4xl px-6 sm:px-12">
          <AnimatedSection>
            <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left sm:gap-6">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                </svg>
              </span>
              <div>
                <h2 className="font-heading text-xl font-bold text-white sm:text-2xl">
                  {locale === "fr" ? "Programme GLAD" : "GLAD Programme"}
                </h2>
                <p className="mt-2 text-white/80 leading-relaxed">
                  {dict.groupClasses.gladNote}
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <ContactCta
        title={dict.groupClasses.registerCta}
        description={dict.groupClasses.intro}
        buttonText={dict.groupClasses.registerCta}
        href={`/${locale}/contact`}
      />
    </>
  );
}
