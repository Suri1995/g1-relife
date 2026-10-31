"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  type CSSProperties,
  type ElementType,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  ArrowUpRight,
  Award,
  Check,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
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
import { opportunity, business } from "@/data/wellness";

/* -------------------------------------------------------------------------- */
/*  Content                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * IMPORTANT: these figures were hard-coded in the original component and I
 * can't verify them. Replace them with real, documentable numbers, or delete
 * the ones you can't back up. Growth, partner-count and retention claims on a
 * business-opportunity page can create legal and trust problems if they are
 * not accurate.
 */
const STATS = [
  { icon: TrendingUp, to: 4.2, decimals: 1, suffix: "×", label: "Growth" },
  { icon: Users, to: 2.5, decimals: 1, suffix: "K+", label: "Partners" },
  { icon: Award, to: 98, decimals: 0, suffix: "%", label: "Retention" },
] as const;

const TRUST_POINTS = ["Free consultation", "No commitment required"];

/* -------------------------------------------------------------------------- */
/*  Motion tokens & styles                                                    */
/* -------------------------------------------------------------------------- */

const ease = [0.16, 1, 0.3, 1] as const;

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const imageVariants: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 1.1, ease } },
};

const contentVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease },
  },
};

// Headline: words rise from a mask, one after another.
const headlineStagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const wordReveal: Variants = {
  hidden: { y: "115%", filter: "blur(8px)" },
  visible: {
    y: "0%",
    filter: "blur(0px)",
    transition: { duration: 0.9, ease },
  },
};

// Border-only mask: shows just a 1px ring of whatever gradient sits behind it.
const BORDER_ONLY_MASK: CSSProperties = {
  padding: 1,
  WebkitMask:
    "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
  WebkitMaskComposite: "xor",
  mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
  maskComposite: "exclude",
};

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

/* -------------------------------------------------------------------------- */
/*  Pieces                                                                    */
/* -------------------------------------------------------------------------- */

/** One cell of the stats strip. The number counts up when it scrolls into view. */
function StatItem({
  icon: Icon,
  to,
  decimals,
  suffix,
  label,
  delay,
}: {
  icon: ElementType;
  to: number;
  decimals: number;
  suffix: string;
  label: string;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const value = useMotionValue(0);
  const text = useTransform(value, (v) => v.toFixed(decimals));

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      value.set(to);
      return;
    }
    const controls = animate(value, to, { duration: 1.8, ease, delay });
    return () => controls.stop();
  }, [inView, reduce, to, delay, value]);

  return (
    <div
      ref={ref}
      className="group flex flex-col gap-2 px-3 py-4 transition-colors duration-300 hover:bg-cream/[0.04] sm:px-5 sm:py-5"
    >
      <Icon
        size={16}
        strokeWidth={2.25}
        aria-hidden
        className="text-honey transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5 group-hover:scale-110 motion-reduce:transition-none"
      />
      <p className="font-display text-2xl leading-none text-cream sm:text-[1.75rem]">
        <motion.span>{text}</motion.span>
        <span className="text-honey">{suffix}</span>
      </p>
      <p className="text-[12.5px] text-cream/55">{label}</p>
    </div>
  );
}

/** Call-to-action that leans toward the cursor, with a hover-only highlight sweep. */
function MagneticCTA({ href, children }: { href: string; children: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 200, damping: 18, mass: 0.4 });
  const innerX = useTransform(sx, (v) => v * 0.4);
  const innerY = useTransform(sy, (v) => v * 0.4);

  const onMove = (e: ReactPointerEvent<HTMLAnchorElement>) => {
    if (reduce || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.25);
    y.set((e.clientY - r.top - r.height / 2) * 0.3);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      target="_blank"
      rel="noreferrer"
      onPointerMove={onMove}
      onPointerLeave={reset}
      whileTap={reduce ? undefined : { scale: 0.96 }}
      style={{ x: sx, y: sy }}
      className="group relative inline-flex overflow-hidden rounded-full bg-honey py-2 pl-7 pr-2 text-[15px] font-semibold text-evergreen-dark shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_16px_34px_-16px_rgba(212,175,55,0.55)] transition-colors duration-300 hover:bg-honey-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-honey/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--Dark)]"
    >
      <motion.span
        style={{ x: innerX, y: innerY }}
        className="relative z-10 inline-flex items-center gap-4"
      >
        {children}
        <span className="grid h-9 w-9 place-items-center rounded-full bg-evergreen-dark text-cream">
          <ArrowUpRight
            size={16}
            strokeWidth={2.25}
            className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-45 motion-reduce:transition-none"
          />
        </span>
      </motion.span>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 -translate-x-full bg-gradient-to-r from-transparent via-white/45 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[320%] motion-reduce:hidden"
      />
    </motion.a>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section                                                                   */
/* -------------------------------------------------------------------------- */

export default function WellnessOpportunity() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  /* Pointer position over the photo, -0.5 to 0.5. The tilt, the photo shift
     and both floating chips all derive from it, so the layers move together. */
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spx = useSpring(px, { stiffness: 150, damping: 20 });
  const spy = useSpring(py, { stiffness: 150, damping: 20 });
  const rotateY = useTransform(spx, [-0.5, 0.5], [-8, 8]);
  const rotateX = useTransform(spy, [-0.5, 0.5], [8, -8]);
  const photoX = useTransform(spx, (v) => v * -14);
  const photoY = useTransform(spy, (v) => v * -10);
  const chipX = useTransform(spx, (v) => v * 22);
  const chipY = useTransform(spy, (v) => v * 16);
  const pillX = useTransform(spx, (v) => v * -10);
  const pillY = useTransform(spy, (v) => v * -8);

  /* Cursor light across the whole panel (mouse only). */
  const mx = useMotionValue(-999);
  const my = useMotionValue(-999);
  const spotOpacity = useMotionValue(0);
  const spotFill = useMotionTemplate`radial-gradient(520px circle at ${mx}px ${my}px, rgba(212,175,55,0.1), transparent 60%)`;
  const spotEdge = useMotionTemplate`radial-gradient(380px circle at ${mx}px ${my}px, rgba(226,190,96,0.8), transparent 70%)`;

  /* Scroll-linked depth */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const columnY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [40, -40]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.2, 0.55, 0.2]);
  const glowDriftY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-60, 60]);

  const handleStackMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== "mouse" || !imageRef.current) return;
    const r = imageRef.current.getBoundingClientRect();
    px.set(clamp((e.clientX - r.left) / r.width - 0.5, -0.5, 0.5));
    py.set(clamp((e.clientY - r.top) / r.height - 0.5, -0.5, 0.5));
  };
  const resetStack = () => {
    px.set(0);
    py.set(0);
  };

  const handlePanelMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - r.left);
    my.set(e.clientY - r.top);
  };
  const handlePanelEnter = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    animate(spotOpacity, 1, { duration: 0.5 });
  };
  const handlePanelLeave = () => animate(spotOpacity, 0, { duration: 0.5 });

  return (
    <section
      id="opportunity"
      ref={sectionRef}
      className="section-pad relative overflow-hidden bg-[var(--Primary)]"
    >
      {/* Ambient glows: both tied to scroll, neither loops */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-1/4 h-[500px] w-[500px] rounded-full bg-honey/10 blur-[120px]"
        style={{ opacity: glowOpacity }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-40 bottom-1/4 h-[400px] w-[400px] rounded-full bg-sage/10 blur-[100px]"
        style={{ y: glowDriftY }}
      />

      <div className="container-content relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          onPointerMove={handlePanelMove}
          onPointerEnter={handlePanelEnter}
          onPointerLeave={handlePanelLeave}
          className="relative grid items-center gap-10 overflow-hidden rounded-[2rem] border border-cream/[0.06] bg-[var(--Dark)] p-6 grain sm:p-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14 lg:p-14"
        >
          {/* Cursor light: a soft fill plus a bright 1px edge */}
          {!reduce && (
            <>
              <motion.div
                aria-hidden
                style={{ background: spotFill, opacity: spotOpacity }}
                className="pointer-events-none absolute inset-0 z-0 rounded-[2rem]"
              />
              <motion.div
                aria-hidden
                style={{ ...BORDER_ONLY_MASK, background: spotEdge, opacity: spotOpacity }}
                className="pointer-events-none absolute inset-0 z-0 rounded-[2rem]"
              />
            </>
          )}

          {/* Corner accents */}
          <div aria-hidden className="pointer-events-none absolute left-6 top-6 h-8 w-8 border-l border-t border-honey/25" />
          <div aria-hidden className="pointer-events-none absolute bottom-6 right-6 h-8 w-8 border-b border-r border-honey/25" />

          {/* ------------------------------ Image ------------------------------ */}
          <motion.div
            variants={imageVariants}
            style={{ y: columnY }}
            onPointerMove={handleStackMove}
            onPointerLeave={resetStack}
            className="relative z-10"
          >
            {/* Offset outline, drawn once the panel enters view */}
            <svg
              aria-hidden
              className="pointer-events-none absolute -inset-3 h-[calc(100%+1.5rem)] w-[calc(100%+1.5rem)] overflow-visible text-honey"
            >
              <motion.rect
                x={0}
                y={0}
                width="100%"
                height="100%"
                rx={26}
                fill="none"
                stroke="currentColor"
                strokeWidth={1}
                initial={{ pathLength: reduce ? 1 : 0, opacity: 0 }}
                animate={isInView ? { pathLength: 1, opacity: 0.3 } : {}}
                transition={{ duration: 2.2, ease, delay: 0.5 }}
              />
            </svg>

            <div style={{ perspective: 1000 }}>
              <motion.div
                ref={imageRef}
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                className="group relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-2xl shadow-black/40"
              >
                {/* Wipe-up reveal while the photo settles from a slight zoom */}
                <motion.div
                  className="absolute inset-0"
                  initial={{
                    clipPath: reduce ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)",
                    scale: reduce ? 1 : 1.15,
                  }}
                  animate={
                    isInView
                      ? { clipPath: "inset(0% 0% 0% 0%)", scale: 1 }
                      : {}
                  }
                  transition={{ duration: 1.3, ease, delay: 0.3 }}
                >
                  <motion.div
                    style={{ x: photoX, y: photoY, scale: 1.08 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={opportunity.image}
                      alt={opportunity.title}
                      fill
                      sizes="(max-width: 1024px) 90vw, 480px"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                  </motion.div>
                </motion.div>

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-evergreen-dark/70 via-transparent to-transparent" />

                {/* Highlight sweeps across once per hover, then rests */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-[1400ms] ease-out group-hover:translate-x-[320%] motion-reduce:hidden"
                />

                {/* Status pill */}
                <motion.div
                  style={{ x: pillX, y: pillY }}
                  className="absolute bottom-4 left-4"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 1, duration: 0.6, ease }}
                    className="flex items-center gap-2 rounded-full border border-white/15 bg-evergreen-dark/70 px-3.5 py-1.5 backdrop-blur-md"
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-honey opacity-75 motion-safe:animate-ping" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-honey" />
                    </span>
                    <span className="text-[12.5px] font-medium text-cream/90">
                      Now accepting partners
                    </span>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>

            {/* Sparkle chip floats closer to the viewer than the photo */}
            <motion.div
              style={{ x: chipX, y: chipY }}
              className="absolute -right-3 -top-3 sm:-right-4 sm:-top-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: reduce ? 1 : 0.6, rotate: reduce ? 0 : -10 }}
                animate={isInView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
                transition={{ type: "spring", stiffness: 160, damping: 14, delay: 0.9 }}
                whileHover={reduce ? undefined : { rotate: 10, scale: 1.08 }}
                className="flex h-14 w-14 items-center justify-center rounded-2xl border border-honey/30 bg-evergreen-dark/90 backdrop-blur-md sm:h-16 sm:w-16"
              >
                <Sparkles className="text-honey" size={22} aria-hidden />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* ----------------------------- Content ----------------------------- */}
          <motion.div variants={contentVariants} className="relative z-10">
            <motion.span
              variants={itemVariants}
              className="inline-flex items-center gap-2 rounded-full border border-honey/40 bg-honey/5 px-4 py-1.5 text-[13px] font-medium text-honey-light backdrop-blur-sm"
            >
              <Sparkles size={13} aria-hidden />
              Wellness opportunity
            </motion.span>

            <motion.h2
              variants={headlineStagger}
              aria-label={opportunity.title}
              className="mt-5 font-display text-[clamp(1.6rem,3vw,2.35rem)] leading-[1.15] text-cream"
            >
              <span aria-hidden className="block overflow-hidden py-1">
                {opportunity.title.split(" ").map((word, i) => (
                  <span key={i}>
                    <motion.span variants={wordReveal} className="inline-block">
                      {word}
                    </motion.span>{" "}
                  </span>
                ))}
              </span>
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="mt-4 max-w-lg text-[15px] leading-relaxed text-cream/70 sm:text-base"
            >
              {opportunity.description}
            </motion.p>

            {/* Stats: one joined strip instead of three separate boxes */}
            <motion.div
              variants={itemVariants}
              className="mt-7 grid grid-cols-3 divide-x divide-cream/10 overflow-hidden rounded-2xl border border-cream/10 bg-cream/[0.03] backdrop-blur-sm"
            >
              {STATS.map((stat, i) => (
                <StatItem key={stat.label} {...stat} delay={0.9 + i * 0.12} />
              ))}
            </motion.div>

            <motion.div variants={itemVariants} className="mt-8">
              <MagneticCTA href={business.whatsapp}>
                Learn about this opportunity
              </MagneticCTA>

              <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5">
                {TRUST_POINTS.map((point) => (
                  <li
                    key={point}
                    className="inline-flex items-center gap-1.5 text-[12.5px] text-cream/55"
                  >
                    <Check size={13} strokeWidth={2.5} aria-hidden className="text-honey" />
                    {point}
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}