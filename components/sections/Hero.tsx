import Image from "next/image";
import Link from "next/link";

interface HeroProps {
  title: string;
  subtitle: string;
  ctaText?: string;
  ctaHref?: string;
  imageSrc?: string;
  imageAlt?: string;
}

export function Hero({ title, subtitle, ctaText, ctaHref, imageSrc, imageAlt }: HeroProps) {
  return (
    <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden">
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt={imageAlt ?? ""}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-b from-sage-dark/80 to-sage-dark/60" />
      <div className="relative z-10 mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <h1 className="font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-white/90 sm:text-xl">
          {subtitle}
        </p>
        {ctaText && ctaHref ? (
          <div className="mt-10">
            <Link
              href={ctaHref}
              className="inline-flex items-center rounded-full bg-accent px-8 py-3 text-base font-semibold text-accent-foreground shadow-lg transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              {ctaText}
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
