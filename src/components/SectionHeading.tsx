type SectionHeadingProps = {
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "dark" | "light";
};

export default function SectionHeading({
  title,
  description,
  align = "left",
  tone = "dark",
}: SectionHeadingProps) {
  return (
    <div
      className={`max-w-2xl ${
        align === "center" ? "mx-auto text-center" : "text-left"
      }`}
    >
      <h2
        className={`font-display text-[clamp(1.75rem,3.5vw,2.75rem)] leading-[1.1] ${
          tone === "dark" ? "text-evergreen" : "text-cream"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-4 text-[15px] leading-relaxed sm:text-base ${
            tone === "dark" ? "text-ink/70" : "text-cream/75"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
