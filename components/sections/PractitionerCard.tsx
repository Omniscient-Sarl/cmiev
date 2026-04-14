import Image from "next/image";
import Link from "next/link";

interface PractitionerCardProps {
  name: string;
  title: string;
  slug: string;
  locale: string;
  image?: string;
  phone: string;
  specialties: string[];
  ctaLabel: string;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter((part) => !part.startsWith("("))
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function PractitionerCard({
  name,
  title,
  slug,
  locale,
  image,
  phone,
  specialties,
  ctaLabel,
}: PractitionerCardProps) {
  return (
    <Link
      href={`/${locale}/praticiens/${slug}`}
      className="group block focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none rounded-2xl"
    >
      <div className="h-full overflow-hidden rounded-2xl border border-border/60 bg-white shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        {/* Image area */}
        <div className="relative aspect-[3/4] w-full overflow-hidden">
          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-primary/20">
              <span className="font-heading text-7xl font-bold text-primary/60 select-none tracking-wide">
                {getInitials(name)}
              </span>
            </div>
          )}
          {/* Gradient overlay */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        {/* Content area */}
        <div className="p-6">
          <h3 className="text-xl font-heading font-bold text-foreground">
            {name}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">{title}</p>

          {/* Phone */}
          <p className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4 shrink-0"
            >
              <path
                fillRule="evenodd"
                d="M2 3.5A1.5 1.5 0 0 1 3.5 2h1.148a1.5 1.5 0 0 1 1.465 1.175l.716 3.223a1.5 1.5 0 0 1-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 0 0 6.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 0 1 1.767-1.052l3.223.716A1.5 1.5 0 0 1 18 15.352V16.5a1.5 1.5 0 0 1-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 0 1 2.43 8.326 13.019 13.019 0 0 1 2 5V3.5Z"
                clipRule="evenodd"
              />
            </svg>
            {phone}
          </p>

          {/* Specialties badges */}
          <div className="mt-4 flex flex-wrap gap-2">
            {specialties.slice(0, 3).map((s) => (
              <span
                key={s}
                className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
              >
                {s}
              </span>
            ))}
          </div>

          {/* CTA button */}
          <div className="mt-5">
            <span className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground transition-colors duration-200 group-hover:bg-accent/90">
              {ctaLabel}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
              >
                <path
                  fillRule="evenodd"
                  d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
