import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isValidLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { Hero } from "@/components/sections/Hero";
import { SectionWrapper } from "@/components/sections/SectionWrapper";
import { GalleryGrid } from "@/components/sections/GalleryGrid";

const galleryImages = [
  { src: "/images/gallery/cabinet-1.jpg", key: "1" },
  { src: "/images/gallery/cabinet-2.jpg", key: "2" },
  { src: "/images/gallery/cabinet-3.jpg", key: "3" },
  { src: "/images/gallery/cabinet-4.jpg", key: "4" },
  { src: "/images/gallery/cabinet-5.jpg", key: "5" },
  { src: "/images/gallery/cabinet-6.jpg", key: "6" },
  { src: "/images/gallery/cabinet-7.jpg", key: "7" },
  { src: "/images/gallery/cabinet-8.jpg", key: "8" },
  { src: "/images/gallery/cabinet-9.jpg", key: "9" },
  { src: "/images/gallery/cabinet-10.jpg", key: "10" },
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
    openGraph: { title, description, url: `https://cmiev.ch/${locale}/galerie`, locale: locale === "fr" ? "fr_CH" : "en_GB", type: "website" },
    twitter: { card: "summary_large_image", title, description },
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
