import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isValidLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import Image from "next/image";
import { SectionWrapper } from "@/components/sections/SectionWrapper";
import { ContactForm } from "@/components/sections/ContactForm";
import { contactPageJsonLd } from "@/lib/jsonld";
import { getContentValue } from "@/lib/db/queries";

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
    openGraph: { title, description, url: `https://cmiev.ch/${locale}/contact`, siteName: "CMIEV", locale: locale === "fr" ? "fr_CH" : "en_GB", type: "website", images: [{ url: "https://cmiev.ch/og-default.jpg", width: 1200, height: 630, alt: title }] },
    twitter: { card: "summary_large_image", title, description, images: ["https://cmiev.ch/og-default.jpg"] },
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
  const heroImage = await getContentValue("contact.hero.image", "/images/galerie/cabinet-01.webp");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(contactPageJsonLd(locale as Locale)),
        }}
      />
      {/* Contact Hero — welcoming cabinet interior with sage overlay */}
      <section className="relative flex h-[calc(100dvh-5rem)] overflow-hidden">
        <Image
          src={heroImage}
          alt="Salle d'accueil du CMIEV, Genève"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#5A7A6F]/35" />

        <div className="relative z-10 flex w-full flex-col justify-end px-4 pb-12 sm:px-12 sm:pb-24 lg:px-20 lg:pb-28">
          <div className="mb-4 h-px w-16 bg-accent sm:mb-6 sm:w-24" />
          <h1 className="font-heading text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
            {dict.contact.title}
          </h1>
          <p className="mt-4 max-w-2xl text-base text-white/90 sm:mt-6 sm:text-xl lg:text-2xl">
            {dict.contact.subtitle}
          </p>
        </div>
      </section>
      <SectionWrapper className="py-24 sm:py-28 lg:py-36">
        <div className="grid gap-16 lg:grid-cols-2">
          {/* Left column: Contact form */}
          <div className="relative">
            <div className="mb-8">
              <div className="mb-4 h-1 w-16 rounded-full bg-primary" />
              <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {dict.contact.title}
              </h2>
            </div>
            <ContactForm dict={dict.contact} />
          </div>

          {/* Right column: Contact info card + Map */}
          <div className="space-y-8">
            <div>
              <div className="mb-4 h-1 w-16 rounded-full bg-primary" />
              <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {dict.contact.mapTitle}
              </h2>
            </div>

            {/* Contact info card */}
            <div className="rounded-2xl bg-white p-6 shadow-md sm:p-8">
              <div className="space-y-5">
                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {locale === "fr" ? "Adresse" : "Address"}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">{dict.contact.address}</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {locale === "fr" ? "Telephone" : "Phone"}
                    </p>
                    <a href="tel:+41227001100" className="mt-1 block text-sm text-muted-foreground transition-colors hover:text-primary">
                      +41 22 700 11 00
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Email</p>
                    <a href="mailto:info@cmiev.ch" className="mt-1 block text-sm text-muted-foreground transition-colors hover:text-primary">
                      info@cmiev.ch
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-md">
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
