import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

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
    <Link href={`/${locale}/praticiens/${slug}`} className="group block focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none rounded-lg">
      <Card className="h-full overflow-hidden transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
        {image ? (
          <div className="relative aspect-[3/4] w-full overflow-hidden">
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ) : (
          <div className="flex aspect-[3/4] w-full items-center justify-center bg-primary">
            <span className="font-heading text-6xl font-bold text-primary-foreground/90 select-none">
              {getInitials(name)}
            </span>
          </div>
        )}
        <CardContent className="p-6">
          <h3 className="font-heading text-xl font-semibold text-foreground">{name}</h3>
          <p className="mt-1 text-sm text-primary font-medium">{title}</p>
          <p className="mt-2 text-sm text-muted-foreground">{phone}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {specialties.slice(0, 3).map((s) => (
              <span
                key={s}
                className="inline-block rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-foreground"
              >
                {s}
              </span>
            ))}
          </div>
          <p className="mt-4 text-sm font-semibold text-accent">
            {ctaLabel} &rarr;
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
