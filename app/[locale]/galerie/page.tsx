import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { isValidLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { SectionWrapper } from "@/components/sections/SectionWrapper";
import { GalleryGrid } from "@/components/sections/GalleryGrid";

const galleryImages = [
  { src: "/images/galerie/cabinet-01.webp", key: "1" },
  { src: "/images/galerie/cabinet-02.webp", key: "2" },
  { src: "/images/galerie/cabinet-03.webp", key: "3" },
  { src: "/images/galerie/cabinet-04.webp", key: "4" },
  { src: "/images/galerie/cabinet-05.webp", key: "5" },
  { src: "/images/galerie/cabinet-06.webp", key: "6" },
  { src: "/images/galerie/cabinet-07.webp", key: "7" },
  { src: "/images/galerie/cabinet-08.webp", key: "8" },
  { src: "/images/galerie/cabinet-09.webp", key: "9" },
  { src: "/images/galerie/cabinet-10.webp", key: "10" },
];

const marqueeImages = galleryImages.map((img) => img.src);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const dict = await getDictionary(locale);
  const title = dict.gallery.title;
  const description = dict.gallery.subtitle;
  return {
    title,
    description,
    alternates: {
      canonical: `https://cmiev.ch/${locale}/galerie`,
      languages: { fr: "https://cmiev.ch/fr/galerie", en: "https://cmiev.ch/en/galerie" },
    },
    openGraph: { title, description, url: `https://cmiev.ch/${locale}/galerie`, siteName: "CMIEV", locale: locale === "fr" ? "fr_CH" : "en_GB", type: "website", images: [{ url: "https://cmiev.ch/og-default.jpg", width: 1200, height: 630, alt: title }] },
    twitter: { card: "summary_large_image", title, description, images: ["https://cmiev.ch/og-default.jpg"] },
  };
}

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale as Locale);

  const images = galleryImages.map((img) => ({
    src: img.src,
    alt: `${dict.gallery.imageAlt} ${img.key}`,
  }));

  return (
    <>
      {/* Marquee Hero */}
      <section className="relative h-[calc(100dvh-4rem)] overflow-hidden">
        <div className="absolute inset-0 flex items-center">
          <div className="flex h-full animate-[marquee_60s_linear_infinite] will-change-transform">
            {[...marqueeImages, ...marqueeImages].map((src, i) => (
              <div key={i} className="relative h-full w-[50vw] shrink-0 sm:w-[35vw] lg:w-[25vw]">
                <Image
                  src={src}
                  alt={`CMIEV gallery ${(i % marqueeImages.length) + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 35vw, 25vw"
                  priority={i < 5}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20" />

        <div className="relative z-10 flex h-full w-full flex-col justify-end px-6 pb-24 sm:px-12 lg:px-20 lg:pb-28">
          <div className="mb-6 h-px w-16 bg-accent sm:w-24" />
          <h1 className="font-heading text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
            {dict.gallery.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/90 sm:text-xl lg:text-2xl">
            {dict.gallery.subtitle}
          </p>
        </div>

        <div className="absolute inset-x-0 bottom-6 z-10 flex justify-center">
          <div className="animate-bounce">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/60"><path d="M6 9l6 6 6-6" /></svg>
          </div>
        </div>
      </section>
      <SectionWrapper>
        <GalleryGrid
          images={images}
          gridClassName="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
          featuredFirst
        />
      </SectionWrapper>
    </>
  );
}
