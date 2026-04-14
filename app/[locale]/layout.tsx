import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Playfair_Display, Source_Sans_3 } from "next/font/google";
import { isValidLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const dict = await getDictionary(locale);

  return {
    title: {
      default: dict.metadata.siteName,
      template: `%s | ${dict.metadata.siteName}`,
    },
    description: dict.metadata.siteDescription,
    metadataBase: new URL("https://cmiev.ch"),
    alternates: {
      canonical: `https://cmiev.ch/${locale}`,
      languages: {
        fr: "https://cmiev.ch/fr",
        en: "https://cmiev.ch/en",
      },
    },
    openGraph: {
      title: dict.metadata.siteName,
      description: dict.metadata.siteDescription,
      url: `https://cmiev.ch/${locale}`,
      siteName: "CMIEV",
      locale: locale === "fr" ? "fr_CH" : "en_GB",
      type: "website",
      images: [{ url: "https://cmiev.ch/og-default.jpg", width: 1200, height: 630, alt: dict.metadata.siteName }],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.metadata.siteName,
      description: dict.metadata.siteDescription,
      images: ["https://cmiev.ch/og-default.jpg"],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const dict = await getDictionary(locale as Locale);

  return (
    <html lang={locale} className={`${playfair.variable} ${sourceSans.variable} scroll-smooth`}>
      <body className="min-h-screen flex flex-col bg-background text-foreground font-sans antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md focus-visible:ring-2 focus-visible:ring-ring"
        >
          {dict.nav.skipToContent}
        </a>
        <Header locale={locale as Locale} dict={dict} />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer locale={locale as Locale} dict={dict} />
      </body>
    </html>
  );
}
