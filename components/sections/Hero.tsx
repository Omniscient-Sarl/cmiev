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
    <section className="relative flex h-[calc(100dvh-5rem)] overflow-hidden">
      {/* Background */}
      {imageSrc ? (
        <>
          <Image
            src={imageSrc}
            alt={imageAlt ?? ""}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-sage-dark via-sage-dark/90 to-black/80" />
      )}

      {/* Content — bottom-left positioning */}
      <div className="relative z-10 flex w-full flex-col justify-end px-4 pb-12 sm:px-12 sm:pb-24 lg:px-20 lg:pb-28">
        {/* Decorative accent line */}
        <div className="mb-4 h-px w-16 bg-accent sm:mb-6 sm:w-24" />

        <h1 className="font-heading text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
          {title}
        </h1>

        <p className="mt-4 max-w-2xl text-base text-white/90 sm:mt-6 sm:text-xl lg:text-2xl">
          {subtitle}
        </p>

        {ctaText && ctaHref ? (
          <div className="mt-8 sm:mt-10">
            <Link
              href={ctaHref}
              className="flex w-full items-center justify-center rounded-xl bg-accent px-8 py-4 text-base font-semibold text-accent-foreground shadow-lg shadow-accent/25 transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-accent/30 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none sm:inline-flex sm:w-auto sm:text-lg"
            >
              {ctaText}
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
