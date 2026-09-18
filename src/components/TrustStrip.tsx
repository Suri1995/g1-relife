const items = [
  "Personalized nutrition plans",
  "Whole-person wellness",
  "Continuous coaching support",
  "Physical & mental well-being",
  "Customer-first approach",
];

export default function TrustStrip() {
  const doubled = [...items, ...items];

  return (
    <div className="overflow-hidden border-y border-evergreen/10 bg-sand py-4">
      {/* Screen readers get the list once, read normally; the animated,
          duplicated track underneath is decorative and hidden from them. */}
      <span className="sr-only">{items.join(" · ")}</span>
      <div
        aria-hidden="true"
        className="flex w-max animate-marquee gap-10 whitespace-nowrap"
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-3 text-[13px] font-medium tracking-wide text-evergreen/70"
          >
            {item}
            <span className="h-1 w-1 rounded-full bg-honey" />
          </span>
        ))}
      </div>
    </div>
  );
}
