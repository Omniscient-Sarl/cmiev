interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  variant?: "default" | "cream" | "sage" | "white";
}

const variantStyles: Record<NonNullable<SectionWrapperProps["variant"]>, string> = {
  default: "",
  cream: "bg-[#f5f0e8]",
  sage: "bg-[#e8eeeb]",
  white: "bg-white",
};

export function SectionWrapper({
  children,
  className = "",
  id,
  variant = "default",
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={`py-20 sm:py-24 lg:py-32 ${variantStyles[variant]} ${className}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
}
