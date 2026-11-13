"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-and-conditions", label: "Terms & Conditions" },
];

export default function FooterLegalLinks() {
  const path = usePathname();
  return (
    <nav aria-label="Legal" className="flex flex-wrap justify-center gap-2.5">
      {links.map((l) => {
        const on = path === l.href;
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={on ? "page" : undefined}
            className={`rounded-full border px-4 py-2 text-[12.5px] font-medium transition-all duration-300 hover:-translate-y-0.5 ${
              on
                ? "border-[#C69A75] bg-[#C69A75] text-[#394637]"
                : "border-cream/25 text-cream hover:bg-cream hover:text-[#394637]"
            }`}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}