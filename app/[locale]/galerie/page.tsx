import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isValidLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { Hero } from "@/components/sections/Hero";
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
      <Hero title={dict.gallery.title} subtitle={dict.gallery.subtitle} />
      <SectionWrapper>
        <GalleryGrid images={images} />
      </SectionWrapper>
    </>
  );
}
