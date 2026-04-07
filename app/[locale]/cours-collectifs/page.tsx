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
    openGraph: { title, description, url: `https://cmiev.ch/${locale}/cours-collectifs`, locale: locale === "fr" ? "fr_CH" : "en_GB", type: "website" },
    twitter: { card: "summary_large_image", title, description },
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

      <SectionWrapper>
        <AnimatedSection>
          <p className="text-lg text-muted-foreground">{dict.groupClasses.intro}</p>
          <div className="mt-4 space-y-1 text-muted-foreground">
            <p>{dict.groupClasses.phone}</p>
            {dict.groupClasses.emails.map((e) => (
              <p key={e}>
                <a href={`mailto:${e}`} className="text-primary hover:underline">{e}</a>
              </p>
            ))}
          </div>
        </AnimatedSection>
      </SectionWrapper>

      <SectionWrapper className="bg-secondary/50">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {days.map((day) => (
            <AnimatedSection key={day.day}>
              <div className="rounded-lg bg-card p-6 shadow-sm h-full">
                <h3 className="font-heading text-xl font-bold text-foreground">{day.day}</h3>
                <ul className="mt-4 space-y-3">
                  {day.classes.map((c, i) => (
                    <li key={i} className="border-l-2 border-primary pl-3">
                      <p className="font-medium text-foreground">{c.name}</p>
                      <p className="text-sm text-muted-foreground">{c.time}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>
          ))}
        </div>
        <p className="mt-8 text-sm text-muted-foreground italic">{dict.groupClasses.gladNote}</p>
      </SectionWrapper>

      <ContactCta
        title={dict.groupClasses.registerCta}
        description={dict.groupClasses.intro}
        buttonText={dict.groupClasses.registerCta}
        href={`/${locale}/contact`}
      />
    </>
  );
}
