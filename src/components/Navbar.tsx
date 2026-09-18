"use client";

import { useEffect, useState } from "react";
import { Menu, X, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#journey", label: "Journey" },
  { href: "#bmi", label: "BMI Check" },
  { href: "#gallery", label: "Gallery" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-colors duration-300",
        scrolled || open
          ? "bg-cream/[0.97] backdrop-blur-md shadow-[0_1px_0_0_rgba(23,50,38,0.08)]"
          : "bg-transparent"
      )}
    >
      <nav className="container-content flex h-[72px] items-center justify-between">
        <a href="#top" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-evergreen text-sage">
            <Leaf size={18} strokeWidth={2} />
          </span>
          <span className="font-display text-[17px] font-medium leading-tight text-evergreen">
            G1 RE-LIFE
            <span className="block text-[10px] font-body font-normal tracking-[0.14em] text-sage-dark">
              WELLNESS ZONE
            </span>
          </span>
        </a>

        <ul className="hidden items-center gap-8 lg:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-[14px] font-medium text-ink/75 transition-colors hover:text-evergreen"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className="hidden rounded-full bg-honey px-5 py-2.5 text-[14px] font-medium text-evergreen-dark transition hover:bg-honey-light lg:block"
        >
          Book a consultation
        </a>

        <button
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-full text-evergreen lg:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-evergreen/10 bg-cream px-6 pb-8 pt-4 lg:hidden">
          <ul className="flex flex-col gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-3 text-[15px] font-medium text-ink/80 hover:bg-evergreen/5 hover:text-evergreen"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="mt-3 block rounded-full bg-honey px-5 py-3 text-center text-[14px] font-medium text-evergreen-dark"
          >
            Book a consultation
          </a>
        </div>
      )}
    </header>
  );
}
