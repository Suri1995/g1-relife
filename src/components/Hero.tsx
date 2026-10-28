"use client";

import { useRef } from "react";
import type { MouseEvent as ReactMouseEvent, ReactNode } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import { ArrowRight, Leaf } from "lucide-react";
import { business, services } from "@/data/wellness";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.15 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

// Mask-slide combined with a blur-to-focus resolve — a slightly more
// cinematic version of the original line reveal.
const lineReveal = {
  hidden: { y: "115%", filter: "blur(8px)" },
  show: {
    y: "0%",
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
};

const headlineLines = [
  "A healthier, more",
  "balanced you starts",
  "with one conversation.",
];

/**
 * A link that drifts gently toward the cursor on hover — a small,
 * tactile "premium" affordance. Disabled entirely under
 * prefers-reduced-motion.
 */
function MagneticLink({
  href,
  external,
  className,
  children,
}: {
  href: string;
  external?: boolean;
  className: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 200, damping: 18, mass: 0.4 });

  const handleMove = (e: ReactMouseEvent<HTMLAnchorElement>) => {
    if (reduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.3);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.3);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      whileTap={reduceMotion ? undefined : { scale: 0.96 }}
      style={{ x: springX, y: springY }}
      className={className}
    >
      {children}
    </motion.a>
  );
}

export default function Hero() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  // Photo tilt
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 150, damping: 22 });
  const springY = useSpring(rotateY, { stiffness: 150, damping: 22 });

  // Sheen that travels across the photo, derived from the same tilt values
  const glareX = useTransform(springY, [-9, 9], ["15%", "85%"]);
  const glareY = useTransform(springX, [-9, 9], ["85%", "15%"]);
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.28), transparent 55%)`;

  // Oversized wordmark drifts slowly as the hero scrolls out of view
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const wordmarkY = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? [0, 0] : [0, 70]
  );

  const handlePointerMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (reduceMotion || !frameRef.current) return;
    const rect = frameRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * 9);
    rotateX.set(py * -9);
  };

  const resetTilt = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative overflow-hidden bg-[var(--Primary)] pb-24 pt-16 grain sm:pb-32 sm:pt-20"
    >
      {/* Organic frame shape used to clip the hero photo — a soft,
          asymmetric silhouette instead of a plain rounded rectangle. */}
      <svg width="0" height="0" aria-hidden className="absolute">
        <defs>
          <clipPath id="reLifeFrame" clipPathUnits="objectBoundingBox">
            <path d="M0.08,0 H0.76 C0.9,0 1,0.1 1,0.24 V0.7 C1,0.92 0.86,1 0.62,1 H0.14 C0.04,1 0,0.9 0,0.78 V0.16 C0,0.06 0.02,0 0.08,0 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* Oversized brand wordmark running behind the whole composition —
          a single deliberate typographic flourish, now with a slow
          scroll-linked drift rather than sitting static. */}
      <motion.span
        aria-hidden
        style={{ y: wordmarkY }}
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-display text-[22vw] leading-none tracking-tight text-cream/[0.035] sm:text-[16vw] lg:text-[13rem]"
      >
        Re-Life
      </motion.span>

      <div className="container-content relative z-10 grid gap-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative lg:pl-8"
        >
          {/* Growth-line accent — grows downward on load, and its visual
              language (thin line + honey gradient) is echoed later by the
              swing-tag thread and the scroll cue, tying the page together. */}
          <motion.span
            aria-hidden
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            style={{ transformOrigin: "top" }}
            className="absolute left-0 top-1 hidden h-[calc(100%-3rem)] w-px bg-gradient-to-b from-honey via-honey/30 to-transparent lg:block"
          />

          <motion.div variants={fadeUp} className="flex items-center gap-2.5">
            <Leaf size={14} className="text-honey" strokeWidth={2.2} />
            <span className="text-[13px] font-medium text-sage-light">
              Personalized wellness coaching
            </span>
          </motion.div>

          <h1 className="mt-6 font-display text-[clamp(2.3rem,5.5vw,4rem)] leading-[1.05] text-cream">
            {headlineLines.map((line, i) => (
              <span key={i} className="block overflow-hidden py-1">
                <motion.span variants={lineReveal} className="block">
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-lg text-[16px] leading-relaxed text-cream/70 sm:text-[17px]"
          >
            {business.about[0]}
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4"
          >
            <MagneticLink
              href="#contact"
              className="group inline-flex items-center gap-2 rounded-full bg-honey px-7 py-3.5 text-[15px] font-medium text-evergreen-dark shadow-lg shadow-honey/20 transition-colors hover:bg-honey-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-honey/60 focus-visible:ring-offset-2 focus-visible:ring-offset-evergreen-dark"
            >
              Start your journey
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </MagneticLink>

            <MagneticLink
              href={business.whatsapp}
              external
              className="group inline-flex items-center gap-1.5 text-[15px] font-medium text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/40 focus-visible:ring-offset-2 focus-visible:ring-offset-evergreen-dark"
            >
              <span className="border-b border-cream/40 transition group-hover:border-cream">
                Chat on WhatsApp
              </span>
              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-1"
              />
            </MagneticLink>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.25 }}
          className="relative mx-auto w-full max-w-[420px]"
          style={{ perspective: 1200 }}
        >
          <motion.div
            ref={frameRef}
            onMouseMove={handlePointerMove}
            onMouseLeave={resetTilt}
            style={{ rotateX: springX, rotateY: springY }}
            className="relative aspect-[4/5] w-full"
          >
            <div
              aria-hidden
              className="absolute -inset-3 rounded-[2.5rem] border border-sage/20"
            />

            <div
              className="relative h-full w-full overflow-hidden shadow-2xl shadow-black/40"
              style={{ clipPath: "url(#reLifeFrame)" }}
            >
              <Image
                src="/ecofriendly-beauty-product.jpg"
                alt="G1 RE-LIFE Wellness Zone"
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 420px"
                className="object-cover"
              />
              {!reduceMotion && (
                <motion.div
                  aria-hidden
                  style={{ background: glareBackground }}
                  className="pointer-events-none absolute inset-0 mix-blend-overlay"
                />
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-evergreen-dark/50 via-transparent to-transparent" />
            </div>

            {/* Second photo, pinned like a print, adds depth without a
                second competing motion effect — it simply settles in
                slightly after the main frame. */}
            <motion.div
              initial={{ opacity: 0, x: -16, y: 16 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.6 }}
              className="absolute -bottom-8 -left-10 hidden aspect-[3/4] w-[42%] overflow-hidden rounded-xl ring-[6px] ring-cream shadow-xl sm:block"
            >
              <Image
                src={business.profileImage}
                alt={business.coachName}
                fill
                sizes="170px"
                className="w-40 object-cover"
              />
            </motion.div>

            {/* Swing-tag stat, now hung from a small stitched thread — a
                literal "hang tag" rather than just a floating card. */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.75 }}
              className="absolute -right-4 -top-16 flex flex-col items-center sm:-right-7 sm:-top-20"
            >
              <span
                aria-hidden
                className="h-8 w-px border-l border-dashed border-honey/50 sm:h-10"
              />
              <span
                aria-hidden
                className="-mt-[3px] h-2.5 w-2.5 rounded-full border border-honey/60 bg-cream"
              />
              <div className="mt-2 rotate-6 rounded-2xl border border-dashed border-honey/50 bg-cream px-5 py-4 shadow-xl">
                <div className="flex items-center gap-1.5 text-honey-dark">
                  <Leaf size={13} />
                  <p className="font-display text-2xl leading-none text-evergreen">
                    {services.length}+
                  </p>
                </div>
                <p className="mt-1 text-[12px] leading-tight text-moss">
                  wellness focus
                  <br />
                  areas covered
                </p>
              </div>
            </motion.div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mt-10 text-center font-display text-[15px] italic text-cream/70 sm:mt-8"
          >
            {business.coachName} — {business.coachTitle}
          </motion.p>
        </motion.div>
      </div>

      {/* Scroll cue — the one deliberate idle animation on the page,
          reusing the same thin-line motif as the growth accent and the
          swing-tag thread. */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="absolute inset-x-0 bottom-8 z-10 hidden justify-center lg:flex"
      >
        <a
          href="#services"
          className="group flex flex-col items-center gap-2 text-cream/50 transition-colors hover:text-cream/85 focus-visible:text-cream focus-visible:outline-none"
        >
          <span className="text-[11px] font-medium">Explore</span>
          <span className="relative h-9 w-px overflow-hidden bg-cream/20">
            <motion.span
              animate={reduceMotion ? undefined : { y: ["-100%", "100%"] }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-x-0 top-0 h-full bg-cream/70"
            />
          </span>
        </a>
      </motion.div>
    </section>
  );
}