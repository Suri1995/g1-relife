
"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Instagram,
  Youtube,
  ArrowUpRight,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Heart,
  Sparkles,
  MoveUpRight,
  Leaf,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { business, services } from "@/data/wellness";
import FooterLegalLinks from "./legal/footerLegalLinks";

const socialLinks = [
  {
    href: business.social.facebook,
    label: "Facebook",
    Icon: Facebook,
    brand: "bg-[#1877F2] hover:shadow-[0_8px_24px_-6px_rgba(24,119,242,0.7)]",
  },
  {
    href: business.social.instagram,
    label: "Instagram",
    Icon: Instagram,
    brand:
      "bg-[radial-gradient(circle_at_30%_107%,#fdf497_0%,#fdf497_5%,#fd5949_45%,#d6249f_60%,#285AEB_90%)] hover:shadow-[0_8px_24px_-6px_rgba(214,36,159,0.7)]",
  },
  {
    href: business.social.youtube,
    label: "YouTube",
    Icon: Youtube,
    brand: "bg-[#FF0000] hover:shadow-[0_8px_24px_-6px_rgba(255,0,0,0.7)]",
  },
];

const navigationLinks = [
  { label: "About us", href: "/#about" },
  { label: "Our wellness journey", href: "/#journey" },
  { label: "BMI calculator", href: "/#bmi" },
  { label: "Gallery", href: "/#gallery" },
];

const reveal = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Footer() {
  const shouldReduceMotion = useReducedMotion();

  const animation = shouldReduceMotion
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : reveal;

  return (
    <footer className="relative isolate overflow-hidden bg-[#092D23] text-[#F5F2E8]">

      {/* Ambient background lighting */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -right-40 -top-48 h-[480px] w-[480px] rounded-full bg-[#387B59]/15 blur-[120px]" />
        <div className="absolute -bottom-48 -left-40 h-[400px] w-[400px] rounded-full bg-[#A8C69B]/10 blur-[120px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "radial-gradient(#ffffff 0.7px, transparent 0.7px)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <div className="container-content mx-auto w-full max-w-[1200px] px-5 sm:px-8 lg:px-10">

        {/* Main footer content */}
        <div className="grid gap-12 pb-14 pt-20 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10">

          {/* Brand section */}
          <motion.div
            variants={animation}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-4"
          >
            <Link href="/" aria-label="G1 RE-LIFE home" className="inline-flex">
              <Image
                src="/logo_white_transparent.png"
                alt="G1 RE-LIFE Wellness Zone"
                width={220}
                height={100}
                priority={false}
                className="h-auto w-[175px] object-contain object-left sm:w-[190px]"
              />
            </Link>

            <p className="mt-6 max-w-sm text-[13.5px] leading-[1.9] text-white/60">
              A journey towards better health, mindful living and lasting
              transformation. Discover personalized wellness solutions
              guided by {business.coachName}.
            </p>

            <div className="mt-7 flex items-center gap-3">
  {socialLinks.map(({ href, label, Icon, brand }) => (
    <motion.a
      key={label}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Visit G1 RE-LIFE on ${label}`}
      whileHover={
        shouldReduceMotion ? undefined : { y: -5, scale: 1.08 }
      }
      whileTap={shouldReduceMotion ? undefined : { scale: 0.92 }}
      className={`group flex h-11 w-11 items-center justify-center rounded-full text-white ring-1 ring-white/15 transition-all duration-300 ${brand}`}
    >
      <Icon size={18} strokeWidth={1.8} />
    </motion.a>
  ))}
</div>

            <div className="mt-8 flex items-center gap-2 text-[11px] tracking-wide text-white/45">
              <Leaf size={14} className="text-[#C1D9AE]" />
              Wellness is a journey, not a destination.
            </div>
          </motion.div>

          {/* Programs */}
          <motion.div
            variants={animation}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-2 lg:col-start-6"
          >
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C1D9AE]">
              Our programs
            </h3>

            <ul className="mt-7 space-y-4">
              {services.slice(0, 5).map((service) => (
                <li key={service.id}>
                  <Link
                    href="/#services"
                    className="group flex items-center justify-between gap-2 text-[13px] text-white/60 transition-colors duration-300 hover:text-white"
                  >
                    <span>{service.title}</span>
                    <ArrowUpRight
                      size={14}
                      className="shrink-0 opacity-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Explore */}
          <motion.div
            variants={animation}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C1D9AE]">
              Discover
            </h3>

            <ul className="mt-7 space-y-4">
              {navigationLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group flex items-center justify-between gap-2 text-[13px] text-white/60 transition-colors duration-300 hover:text-white"
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight
                      size={14}
                      className="shrink-0 opacity-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            variants={animation}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C1D9AE]">
              Get in touch
            </h3>

            <div className="mt-7 space-y-5">

              <a
                href={`tel:${business.phoneRaw}`}
                className="group flex items-start gap-3"
              >
                <Phone
                  size={16}
                  className="mt-0.5 shrink-0 text-[#C1D9AE]"
                />
                <span className="text-[13px] text-white/65 transition-colors group-hover:text-white">
                  {business.phoneDisplay}
                </span>
              </a>

              <a
                href={`mailto:${business.email}`}
                className="group flex items-start gap-3"
              >
                <Mail
                  size={16}
                  className="mt-0.5 shrink-0 text-[#C1D9AE]"
                />
                <span className="break-all text-[13px] text-white/65 transition-colors group-hover:text-white">
                  {business.email}
                </span>
              </a>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.locationName)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-3"
              >
                <MapPin
                  size={16}
                  className="mt-0.5 shrink-0 text-[#C1D9AE]"
                />
                <span className="text-[13px] text-white/65 transition-colors group-hover:text-white">
                  {business.locationName}
                </span>
              </a>

            </div>
          </motion.div>
        </div>

        {/* Bottom strip */}
        <div className="border-t border-white/[0.09] py-7">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            <p className="text-center text-[11px] leading-6 text-white/40 md:text-left">
              © {new Date().getFullYear()} {business.name}. All rights reserved.
            </p>

            <div className="flex justify-center">
              <FooterLegalLinks />
            </div>

            <div className="flex items-center justify-center gap-2 text-[11px] text-white/45 md:justify-end">
              <Heart size={13} className="text-[#C1D9AE]" />
              <span>Guided by {business.coachName}</span>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
