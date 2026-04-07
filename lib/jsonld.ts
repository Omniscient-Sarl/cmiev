import type { Locale } from "./i18n";
import type { Practitioner } from "./practitioners";

const BASE_URL = "https://cmiev.ch";
const ADDRESS = {
  "@type": "PostalAddress" as const,
  streetAddress: "Rue des Eaux-Vives 3",
  addressLocality: "Genève",
  postalCode: "1207",
  addressCountry: "CH",
};

export function organizationJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalOrganization",
    name: "Centre de Médecine Intégrative des Eaux-Vives (CMIEV)",
    url: `${BASE_URL}/${locale}`,
    address: ADDRESS,
    medicalSpecialty: [
      "Physiotherapy",
      "Osteopathy",
      "Psychiatry",
      "Homeopathy",
      "Integrative Medicine",
    ],
  };
}

export function physicianJsonLd(practitioner: Practitioner, locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Physician",
    name: practitioner.name,
    url: `${BASE_URL}/${locale}/praticiens/${practitioner.slug}`,
    telephone: practitioner.phone,
    medicalSpecialty: practitioner.specialties[locale].join(", "),
    address: ADDRESS,
    memberOf: {
      "@type": "MedicalOrganization",
      name: "CMIEV",
      url: BASE_URL,
    },
  };
}

export function breadcrumbJsonLd(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function contactPageJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: locale === "fr" ? "Contact — CMIEV" : "Contact — CMIEV",
    url: `${BASE_URL}/${locale}/contact`,
    mainEntity: {
      "@type": "MedicalOrganization",
      name: "CMIEV",
      address: ADDRESS,
    },
  };
}
