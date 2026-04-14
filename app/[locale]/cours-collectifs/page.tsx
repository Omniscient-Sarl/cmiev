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
      <Hero title={dict.groupClasses.title} subtitle={dict.groupClasses.subtitle} />

      {/* Intro section */}
      <SectionWrapper>
        <AnimatedSection>
          <div className="max-w-3xl mx-auto text-center">
            <div className="mx-auto mb-6 h-1 w-16 rounded-full bg-primary" />
            <p className="text-lg leading-relaxed text-muted-foreground">
              {dict.groupClasses.intro}
            </p>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-8">
              {/* Phone */}
              <div className="flex items-center gap-2 text-muted-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span>{dict.groupClasses.phone}</span>
              </div>

              {/* Emails */}
              {dict.groupClasses.emails.map((e) => (
                <div key={e} className="flex items-center gap-2 text-muted-foreground">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-primary"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <a href={`mailto:${e}`} className="text-primary hover:underline">
                    {e}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </SectionWrapper>

      {/* Schedule grid */}
      <SectionWrapper variant="cream">
        <AnimatedSection>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {days.map((day) => (
              <div
                key={day.day}
                className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-md"
              >
                {/* Day header */}
                <div className="bg-primary px-5 py-3 rounded-t-2xl">
                  <h3 className="font-heading text-lg font-bold text-white text-center">
                    {day.day}
                  </h3>
                </div>

                {/* Classes list */}
                <ul className="flex-1 space-y-4 p-5">
                  {day.classes.map((c, i) => (
                    <li key={i}>
                      <p className="font-medium text-foreground">{c.name}</p>
                      <p className="text-sm text-muted-foreground">{c.time}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* GLAD note callout */}
        <AnimatedSection className="mt-10">
          <div className="rounded-lg border-l-4 border-primary bg-white px-6 py-4 shadow-sm">
            <p className="text-sm text-muted-foreground italic">
              {dict.groupClasses.gladNote}
            </p>
          </div>
        </AnimatedSection>
      </SectionWrapper>

      {/* CTA */}
      <ContactCta
        title={dict.groupClasses.registerCta}
        description={dict.groupClasses.intro}
        buttonText={dict.groupClasses.registerCta}
        href={`/${locale}/contact`}
      />
    </>
  );
}
