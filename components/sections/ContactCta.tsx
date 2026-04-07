import Link from "next/link";

interface ContactCtaProps {
  title: string;
  description: string;
  buttonText: string;
  href: string;
}

export function ContactCta({ title, description, buttonText, href }: ContactCtaProps) {
  return (
    <section className="bg-primary py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="font-heading text-3xl font-bold text-primary-foreground sm:text-4xl">
          {title}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-primary-foreground/80">
          {description}
        </p>
        <div className="mt-8">
          <Link
            href={href}
            className="inline-flex items-center rounded-full bg-accent px-8 py-3 text-base font-semibold text-accent-foreground shadow-lg transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            {buttonText}
          </Link>
        </div>
      </div>
    </section>
  );
}
