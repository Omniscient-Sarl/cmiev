import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isValidLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { Hero } from "@/components/sections/Hero";
import { SectionWrapper } from "@/components/sections/SectionWrapper";
import { ContactForm } from "@/components/sections/ContactForm";
import { contactPageJsonLd } from "@/lib/jsonld";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const dict = await getDictionary(locale);
  const title = dict.contact.title;
  const description = dict.contact.subtitle;
  return {
    title,
    description,
    alternates: {
      canonical: `https://cmiev.ch/${locale}/contact`,
      languages: { fr: "https://cmiev.ch/fr/contact", en: "https://cmiev.ch/en/contact" },
    },
    openGraph: { title, description, url: `https://cmiev.ch/${locale}/contact`, locale: locale === "fr" ? "fr_CH" : "en_GB", type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function ContactPage({
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
          __html: JSON.stringify(contactPageJsonLd(locale as Locale)),
        }}
      />
      <Hero title={dict.contact.title} subtitle={dict.contact.subtitle} />
      <SectionWrapper>
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="relative">
            <ContactForm dict={dict.contact} />
          </div>
          <div>
            <h2 className="font-heading text-2xl font-bold text-foreground">{dict.contact.mapTitle}</h2>
            <p className="mt-2 text-muted-foreground">{dict.contact.address}</p>
            <div className="mt-6 aspect-[4/3] w-full overflow-hidden rounded-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5522.754410053824!2d6.151762003117918!3d46.20295078382232!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478c653137f99337%3A0xc5c0c9e8b14070f9!2sRue%20des%20Eaux-Vives%203%2C%201207%20Gen%C3%A8ve!5e0!3m2!1sfr!2sch!4v1739734951508!5m2!1sfr!2sch"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={dict.contact.mapTitle}
              />
            </div>
          </div>
        </div>
      </SectionWrapper>
    </>
  );
}
