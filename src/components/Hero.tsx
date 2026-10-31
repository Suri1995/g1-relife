"use client";

import { useEffect, useRef } from "react";
import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, Leaf } from "lucide-react";
import { business, services } from "@/data/wellness";

/* -------------------------------------------------------------------------- */
/*  Motion tokens                                                             */
/* -------------------------------------------------------------------------- */

// One easing curve for every entrance keeps the sequence feeling related.
const ease = [0.16, 1, 0.3, 1] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.15 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

// The headline is a nested stagger: lines are masked, words rise and resolve
// from blur one after another.
const headlineStagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.055 } },
};

const wordReveal: Variants = {
  hidden: { y: "115%", filter: "blur(8px)" },
  show: {
    y: "0%",
    filter: "blur(0px)",
    transition: { duration: 0.95, ease },
  },
};

const headlineLines = [
  "A healthier, more",
  "balanced you starts",
  "with one conversation.",
];

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

/* -------------------------------------------------------------------------- */
/*  Small pieces                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Link that leans toward the cursor. The label travels a little further than
 * the button body, which gives the press a sense of depth.
 */
function MagneticLink({
  href,
  external,
  className,
  innerClassName = "inline-flex items-center gap-2",
  shine,
  children,
}: {
  href: string;
  external?: boolean;
  className: string;
  innerClassName?: string;
  shine?: boolean;
  children: ReactNode;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 200, damping: 18, mass: 0.4 });
  const innerX = useTransform(springX, (v) => v * 0.4);
  const innerY = useTransform(springY, (v) => v * 0.4);

  const handleMove = (e: ReactPointerEvent<HTMLAnchorElement>) => {
    if (reduceMotion || e.pointerType !== "mouse" || !ref.current) return;
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
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      whileTap={reduceMotion ? undefined : { scale: 0.96 }}
      style={{ x: springX, y: springY }}
      className={className}
    >
      <motion.span style={{ x: innerX, y: innerY }} className={innerClassName}>
        {children}
      </motion.span>
      {shine && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[320%] motion-reduce:hidden"
        />
      )}
    </motion.a>
  );
}

/** Counts up once, when it scrolls into view. */
function CountUp({ to, delay = 0 }: { to: number; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduceMotion = useReducedMotion();
  const value = useMotionValue(0);
  const rounded = useTransform(value, (v) => Math.round(v));

  useEffect(() => {
    if (!inView) return;
    if (reduceMotion) {
      value.set(to);
      return;
    }
    const controls = animate(value, to, { duration: 1.6, ease, delay });
    return () => controls.stop();
  }, [inView, reduceMotion, to, delay, value]);

  return (
    <>
      <motion.span ref={ref}>{rounded}</motion.span>+
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Hero                                                                      */
/* -------------------------------------------------------------------------- */

export default function Hero() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  /* Pointer position inside the photo composition, -0.5 to 0.5 on each axis.
     Everything in the stack (tilt, print, tag) derives from these two values,
     so the layers always move together. */
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spx = useSpring(px, { stiffness: 150, damping: 22 });
  const spy = useSpring(py, { stiffness: 150, damping: 22 });

  const rotateY = useTransform(spx, [-0.5, 0.5], [-9, 9]);
  const rotateX = useTransform(spy, [-0.5, 0.5], [9, -9]);

  // Glare travels across the photo with the tilt
  const glareX = useTransform(spx, [-0.5, 0.5], ["15%", "85%"]);
  const glareY = useTransform(spy, [-0.5, 0.5], ["85%", "15%"]);
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.28), transparent 55%)`;

  // Layers closer to the viewer drift against the cursor
  const printX = useTransform(spx, (v) => v * -30);
  const printY = useTransform(spy, (v) => v * -22);
  const tagX = useTransform(spx, (v) => v * 26);
  const tagY = useTransform(spy, (v) => v * 18);

  /* Cursor-following light across the hero background (mouse only). */
  const spotRawX = useMotionValue(0);
  const spotRawY = useMotionValue(0);
  const spotX = useSpring(spotRawX, { stiffness: 90, damping: 20 });
  const spotY = useSpring(spotRawY, { stiffness: 90, damping: 20 });
  const spotOpacity = useMotionValue(0);
  const spotlight = useMotionTemplate`radial-gradient(480px circle at ${spotX}px ${spotY}px, rgba(240,200,120,0.1), transparent 65%)`;

  /* Scroll-linked depth */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const still = reduceMotion;
  const wordmarkY = useTransform(scrollYProgress, [0, 1], still ? [0, 0] : [0, 70]);
  const contentY = useTransform(scrollYProgress, [0, 1], still ? [0, 0] : [0, -48]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], still ? [1, 1] : [1, 0.15]);
  const photoY = useTransform(scrollYProgress, [0, 1], still ? [0, 0] : [0, 36]);
  const imageShift = useTransform(scrollYProgress, [0, 1], still ? ["0%", "0%"] : ["0%", "7%"]);

  const handleSectionMove = (e: ReactPointerEvent<HTMLElement>) => {
    if (reduceMotion || e.pointerType !== "mouse" || !sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    spotRawX.set(e.clientX - rect.left);
    spotRawY.set(e.clientY - rect.top);
  };

  const handleSectionEnter = (e: ReactPointerEvent<HTMLElement>) => {
    if (reduceMotion || e.pointerType !== "mouse") return;
    animate(spotOpacity, 1, { duration: 0.5 });
  };

  const handleSectionLeave = () => {
    animate(spotOpacity, 0, { duration: 0.5 });
  };

  const handleStackMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (reduceMotion || e.pointerType !== "mouse" || !frameRef.current) return;
    const rect = frameRef.current.getBoundingClientRect();
    px.set(clamp((e.clientX - rect.left) / rect.width - 0.5, -0.5, 0.5));
    py.set(clamp((e.clientY - rect.top) / rect.height - 0.5, -0.5, 0.5));
  };

  const resetStack = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <section
  id="top"
  ref={sectionRef}
  onPointerMove={handleSectionMove}
  onPointerEnter={handleSectionEnter}
  onPointerLeave={handleSectionLeave}
  className="relative min-h-screen overflow-hidden bg-[var(--Primary)] pb-24 pt-48 grain sm:pb-32 sm:pt-56 lg:pt-64"
>
      {/* Static ambient depth behind the photo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(60%_55%_at_78%_32%,rgba(255,255,255,0.07),transparent_70%)]"
      />

      {/* Cursor-following light */}
      <motion.div
        aria-hidden
        style={{ background: spotlight, opacity: spotOpacity }}
        className="pointer-events-none absolute inset-0 z-0 hidden lg:block"
      />

      {/* Organic frame silhouette, shared by the photo clip and the drawn outline */}
      <svg width="0" height="0" aria-hidden className="absolute">
        <defs>
          <clipPath id="reLifeFrame" clipPathUnits="objectBoundingBox">
            <path d={FRAME_PATH} />
          </clipPath>
        </defs>
      </svg>

      {/* Oversized brand wordmark, drifting slowly as the hero scrolls away */}
      <motion.span
        aria-hidden
        style={{ y: wordmarkY }}
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-display text-[22vw] leading-none tracking-tight text-cream/[0.035] sm:text-[16vw] lg:text-[13rem]"
      >
        Re-Life
      </motion.span>

      <div className="container-content relative z-10 grid gap-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10">
        {/* ------------------------------ Copy ------------------------------ */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          style={{ y: contentY, opacity: contentOpacity }}
          className="relative lg:pl-8"
        >
          {/* Growth line, drawn downward on load */}
          <motion.span
            aria-hidden
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1.4, ease, delay: 0.2 }}
            style={{ transformOrigin: "top" }}
            className="absolute left-0 top-1 hidden h-[calc(100%-3rem)] w-px bg-gradient-to-b from-honey via-honey/30 to-transparent lg:block"
          />

          <motion.div variants={fadeUp} className="flex items-center gap-2.5">
            <Leaf size={14} className="text-honey" strokeWidth={2.2} />
            <span className="text-[13px] font-medium text-sage-light">
              Personalized wellness coaching
            </span>
          </motion.div>

          <motion.h1
            variants={headlineStagger}
            aria-label={headlineLines.join(" ")}
            className="mt-6 font-display text-[clamp(2.3rem,5.5vw,4rem)] leading-[1.05] text-cream"
          >
            {headlineLines.map((line, i) => (
              <span key={i} aria-hidden className="block overflow-hidden py-1">
                {line.split(" ").map((word, w) => (
                  <span key={w}>
                    <motion.span variants={wordReveal} className="inline-block">
                      {word}
                    </motion.span>{" "}
                  </span>
                ))}
              </span>
            ))}
          </motion.h1>

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
              shine
              innerClassName="inline-flex items-center gap-4"
              className="group relative inline-flex overflow-hidden rounded-full bg-honey py-2 pl-7 pr-2 text-[15px] font-medium text-evergreen-dark shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_14px_30px_-14px_rgba(0,0,0,0.5)] transition-colors hover:bg-honey-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-honey/60 focus-visible:ring-offset-2 focus-visible:ring-offset-evergreen-dark"
            >
              Start your journey
              {/* Arrow exits right while a second one enters from the left */}
              <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-full bg-evergreen-dark text-cream">
                <ArrowRight
                  size={16}
                  className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-9 motion-reduce:transition-none"
                />
                <ArrowRight
                  size={16}
                  aria-hidden
                  className="absolute -translate-x-9 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0 motion-reduce:transition-none"
                />
              </span>
            </MagneticLink>

            <MagneticLink
              href={business.whatsapp}
              external
              innerClassName="inline-flex items-center gap-1.5"
              className="group relative inline-flex text-[15px] font-medium text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/40 focus-visible:ring-offset-2 focus-visible:ring-offset-evergreen-dark"
            >
              <span className="relative">
                Chat on WhatsApp
                <span
                  aria-hidden
                  className="absolute inset-x-0 -bottom-1 h-px bg-cream/30"
                />
                <span
                  aria-hidden
                  className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-cream transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 motion-reduce:transition-none"
                />
              </span>
              <ArrowUpRight
                size={15}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </MagneticLink>
          </motion.div>
        </motion.div>

        {/* ------------------------------ Photos ----------------------------- */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onPointerMove={handleStackMove}
          onPointerLeave={resetStack}
          className="relative mx-auto w-full max-w-[420px]"
          style={{ perspective: 1200, y: photoY }}
        >
          <motion.div
            ref={frameRef}
            style={{ rotateX, rotateY }}
            className="relative aspect-[4/5] w-full"
          >
            {/* Outline in the same silhouette as the photo, drawn on load */}
            <svg
              aria-hidden
              viewBox="0 0 1 1"
              preserveAspectRatio="none"
              className="pointer-events-none absolute -inset-3 h-[calc(100%+1.5rem)] w-[calc(100%+1.5rem)] overflow-visible text-sage"
            >
              <motion.path
                d={FRAME_PATH}
                fill="none"
                stroke="currentColor"
                strokeWidth={1}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                initial={{ pathLength: reduceMotion ? 1 : 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.45 }}
                transition={{ duration: 2, ease, delay: 0.5 }}
              />
            </svg>

            {/* Main photo: a curtain lifts while the image settles from a
                slight zoom, then scroll shifts the image inside its frame. */}
            <div
              className="relative h-full w-full overflow-hidden shadow-2xl shadow-black/40"
              style={{ clipPath: "url(#reLifeFrame)" }}
            >
              <motion.div
                className="absolute inset-0"
                initial={{ scale: reduceMotion ? 1 : 1.18 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.8, ease }}
              >
                <motion.div
                  style={{ y: imageShift, scale: 1.1 }}
                  className="absolute inset-0"
                >
                  <Image
                    src="/ecofriendly-beauty-product.jpg"
                    alt="G1 RE-LIFE Wellness Zone"
                    fill
                    priority
                    sizes="(max-width: 1024px) 90vw, 420px"
                    className="object-cover"
                  />
                </motion.div>
              </motion.div>

              {!reduceMotion && (
                <motion.div
                  aria-hidden
                  style={{ background: glareBackground }}
                  className="pointer-events-none absolute inset-0 mix-blend-overlay"
                />
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-evergreen-dark/50 via-transparent to-transparent" />

              <motion.div
                aria-hidden
                initial={{ scaleY: reduceMotion ? 0 : 1 }}
                animate={{ scaleY: 0 }}
                transition={{ duration: 1.1, ease, delay: 0.25 }}
                style={{ transformOrigin: "top" }}
                className="absolute inset-0 z-10 bg-evergreen-dark"
              />
            </div>

            {/* Pinned print: parallax on a wrapper, entrance and hover inside */}
            <motion.div
              style={{ x: printX, y: printY }}
              className="absolute -bottom-8 -left-10 hidden w-[42%] sm:block"
            >
              <motion.div
                initial={{ opacity: 0, x: -16, y: 16, rotate: 0 }}
                animate={{ opacity: 1, x: 0, y: 0, rotate: -2.5 }}
                transition={{ duration: 0.9, ease, delay: 0.7 }}
                whileHover={reduceMotion ? undefined : { y: -6, rotate: -1, scale: 1.03 }}
                className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-white shadow-xl ring-[6px] ring-cream"
              >
                <Image
                  src={business.profileImage}
                  alt={business.coachName}
                  fill
                  sizes="170px"
                  className="object-cover object-[center_0%]"
                />
              </motion.div>
            </motion.div>

            {/* Hang tag: swings on its thread and settles, then reacts to hover */}
            <motion.div
              style={{ x: tagX, y: tagY }}
              className="absolute -right-4 -top-16 sm:-right-7 sm:-top-20"
            >
              <motion.div
                initial={{ opacity: 0, rotate: reduceMotion ? 0 : 16 }}
                animate={
                  reduceMotion
                    ? { opacity: 1, rotate: 0 }
                    : { opacity: 1, rotate: [16, -7, 4, -1.5, 0] }
                }
                transition={{
                  opacity: { duration: 0.5, delay: 0.9 },
                  rotate: { duration: 2.4, ease: "easeOut", delay: 0.9 },
                }}
                whileHover={
                  reduceMotion
                    ? undefined
                    : {
                        rotate: 4,
                        transition: { type: "spring", stiffness: 120, damping: 6 },
                      }
                }
                style={{ transformOrigin: "top center" }}
                className="flex flex-col items-center"
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
                      <CountUp to={services.length} delay={1.2} />
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
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 1 }}
            className="mt-10 text-center font-display text-[15px] italic text-cream/70 sm:mt-8"
          >
            {business.coachName} — {business.coachTitle}
          </motion.p>
        </motion.div>
      </div>

      {/* Scroll cue: the one idle animation on the page */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.4 }}
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

// Defined last so the JSX above reads top-down; used by both the clip and the outline.
const FRAME_PATH =
  "M0.08,0 H0.76 C0.9,0 1,0.1 1,0.24 V0.7 C1,0.92 0.86,1 0.62,1 H0.14 C0.04,1 0,0.9 0,0.78 V0.16 C0,0.06 0.02,0 0.08,0 Z";