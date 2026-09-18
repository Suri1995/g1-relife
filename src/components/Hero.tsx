"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { business } from "@/data/wellness";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-evergreen-dark pb-16 pt-14 grain sm:pb-24 sm:pt-16 lg:pb-28"
    >
      {/* organic drifting accents */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 -top-24 h-[420px] w-[420px] rounded-organic bg-sage/20 blur-2xl animate-drift"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 right-[-10%] h-[380px] w-[380px] rounded-organic bg-honey/15 blur-2xl animate-drift"
        style={{ animationDelay: "3s" }}
      />

      <div className="container-content relative grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-sage/30 bg-sage/10 px-4 py-1.5 text-[13px] font-medium text-sage-light">
            <Sparkles size={14} />
            Personalized wellness coaching
          </span>

          <h1 className="mt-6 font-display text-[clamp(2.3rem,5.5vw,4rem)] leading-[1.05] text-cream">
            A healthier, more
            <br />
            balanced you starts
            <br />
            with one conversation.
          </h1>

          <p className="mt-6 max-w-lg text-[16px] leading-relaxed text-cream/70 sm:text-[17px]">
            {business.about[0]}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 rounded-full bg-honey px-7 py-3.5 text-[15px] font-medium text-evergreen-dark transition hover:bg-honey-light"
            >
              Start your journey
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </a>
            <a
              href={business.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-cream/25 px-7 py-3.5 text-[15px] font-medium text-cream transition hover:bg-cream/10"
            >
              Chat on WhatsApp
            </a>
          </div>

          <div className="mt-12 flex items-center gap-4">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full ring-2 ring-sage/40">
              <Image
                src={business.profileImage}
                alt={business.coachName}
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>
            <div>
              <p className="font-display text-[15px] text-cream">
                {business.coachName}
              </p>
              <p className="text-[13px] text-cream/60">{business.coachTitle}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
          className="relative mx-auto aspect-[4/5] w-full max-w-[420px]"
        >
          <div className="absolute -inset-3 rounded-[2.5rem] border border-sage/20" />
          <div className="relative h-full w-full overflow-hidden rounded-[2rem] shadow-2xl shadow-black/40">
            <Image
              src={business.coverImage}
              alt="G1 RE-LIFE Wellness Zone"
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 420px"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 rounded-2xl bg-cream px-5 py-4 shadow-xl sm:-left-10">
            <p className="font-display text-2xl text-evergreen">16+</p>
            <p className="text-[12px] leading-tight text-moss">
              wellness focus
              <br />
              areas covered
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
