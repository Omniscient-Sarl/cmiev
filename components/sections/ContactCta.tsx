import Link from "next/link";

interface ContactCtaProps {
  title: string;
  description: string;
  buttonText: string;
  href: string;
}

export function ContactCta({ title, description, buttonText, href }: ContactCtaProps) {
  return (
    <section className="relative overflow-hidden bg-primary py-20 sm:py-28 lg:py-36">
      {/* Subtle radial gradient overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(255,255,255,0.05) 0%, transparent 50%)",
        }}
      />

      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
          {title}
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-white/80">
          {description}
        </p>
        <div className="mt-10">
          <Link
            href={href}
            className="inline-flex items-center rounded-xl bg-accent px-10 py-5 text-lg font-semibold text-accent-foreground shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            {buttonText}
          </Link>
        </div>
      </div>
    </section>
  );
}
