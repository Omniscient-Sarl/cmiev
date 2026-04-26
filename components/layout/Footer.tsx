import Link from "next/link";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";

interface FooterProps {
  locale: Locale;
  dict: Dictionary;
}

export function Footer({ locale, dict }: FooterProps) {
  const year = new Date().getFullYear();

  const navLinks = [
    { href: `/${locale}`, label: dict.nav.home },
    { href: `/${locale}/praticiens`, label: dict.nav.practitioners },
    { href: `/${locale}/pilates`, label: dict.nav.pilates },
    { href: `/${locale}/cours-collectifs`, label: dict.nav.groupClasses },
    { href: `/${locale}/galerie`, label: dict.nav.gallery },
    { href: `/${locale}/contact`, label: dict.nav.contact },
  ];

  return (
    <footer className="bg-[#2d3436] text-white/70">
      {/* Main footer content */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Brand & description */}
          <div className="space-y-4">
            <h3 className="font-heading text-2xl font-semibold text-white">
              CMIEV
            </h3>
            <p className="text-sm leading-relaxed">
              {dict.footer.copyright}
            </p>
            <p className="text-sm leading-relaxed">
              {dict.footer.address}
            </p>
          </div>

          {/* Column 2: Quick links */}
          <div className="space-y-4">
            <h4 className="font-heading text-lg font-semibold text-white">
              Navigation
            </h4>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors duration-200 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div className="space-y-4">
            <h4 className="font-heading text-lg font-semibold text-white">
              Contact
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mt-0.5 h-4 w-4 shrink-0 text-white/50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>{dict.footer.address}</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Hours & Map */}
          <div className="space-y-4">
            {/* Opening hours */}
            <h4 className="font-heading text-lg font-semibold text-white">
              {dict.footer.hoursTitle}
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mt-0.5 h-4 w-4 shrink-0 text-white/50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{dict.footer.hours}</span>
              </li>
              <li className="flex items-start gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mt-0.5 h-4 w-4 shrink-0 text-white/50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{dict.footer.hoursSat}</span>
              </li>
            </ul>

            {/* Map */}
            <h4 className="font-heading text-lg font-semibold text-white pt-2">
              {{ fr: "Nous trouver", en: "Find us", es: "Cómo llegar", it: "Come trovarci" }[locale as Locale]}
            </h4>
            <a
              href="https://maps.google.com/?q=Rue+des+Eaux-Vives+3,+1207+Genève"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block aspect-[4/3] overflow-hidden rounded-xl"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1380.7!2d6.1545!3d46.2030!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478c653137f99337%3A0xc5c0c9e8b14070f9!2sRue%20des%20Eaux-Vives%203%2C%201207%20Gen%C3%A8ve!5e0!3m2!1sfr!2sch!4v1739734951508!5m2!1sfr!2sch"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={{ fr: "Localisation du CMIEV", en: "CMIEV location", es: "Ubicación del CMIEV", it: "Posizione del CMIEV" }[locale as Locale]}
                className="pointer-events-none"
              />
              {/* Red pin overlay */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="relative -mt-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="h-8 w-8 drop-shadow-lg"
                    fill="#EA4335"
                  >
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
                  </svg>
                  <div className="absolute -bottom-0.5 left-1/2 h-1 w-2 -translate-x-1/2 rounded-full bg-black/20 blur-[1px]" />
                </div>
              </div>
              {/* Hover overlay to hint it's clickable */}
              <div className="absolute inset-0 bg-black/0 transition-colors duration-200 group-hover:bg-black/10" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-4 py-6 text-center text-sm sm:flex-row sm:justify-between sm:px-6 lg:px-8">
          <p>
            &copy; {year} {dict.footer.copyright}.{" "}
            {dict.footer.allRightsReserved}.
          </p>
          <p>
            {dict.footer.developedBy}{" "}
            <a
              href="https://omniscient.swiss"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-white underline underline-offset-2 transition-colors duration-200 hover:text-white/70"
            >
              Omniscient S&agrave;rl
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
