import type { Dictionary } from "@/lib/dictionaries";

interface FooterProps {
  dict: Dictionary;
}

export function Footer({ dict }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-secondary/50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="font-heading text-lg font-semibold text-primary">
            CMIEV
          </p>
          <p className="text-sm text-muted-foreground">
            {dict.footer.address}
          </p>
          <p className="text-sm text-muted-foreground">
            &copy; {year} {dict.footer.copyright}. {dict.footer.allRightsReserved}.
          </p>
          <p className="text-sm text-muted-foreground">
            {dict.footer.developedBy}{" "}
            <a
              href="https://omniscient.swiss"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary underline underline-offset-2 transition-colors hover:text-primary/80"
            >
              Omniscient S&agrave;rl
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
