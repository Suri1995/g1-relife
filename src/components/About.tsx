"use client";

import { useRef } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import Image from "next/image";
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
  type Variants,
} from "framer-motion";
import { ArrowRight, Leaf, Moon } from "lucide-react";
import { business } from "@/data/wellness";
import SectionHeading from "./SectionHeading";

/* -------------------------------------------------------------------------- */
/*  Motion tokens & data                                                      */
/* -------------------------------------------------------------------------- */

const ease = [0.16, 1, 0.3, 1] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease } },
};

const cardsStagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const FOCUS_AREAS = [
  { icon: Leaf, title: "Body", copy: "Nutrition & fitness plans" },
  { icon: Moon, title: "Mind", copy: "Stress & sleep support" },
] as const;

/* -------------------------------------------------------------------------- */
/*  Scroll-linked paragraph                                                   */
/* -------------------------------------------------------------------------- */

function Word({
  word,
  range,
  progress,
}: {
  word: string;
  range: [number, number];
  progress: MotionValue<number>;
}) {
  const opacity = useTransform(progress, range, [0.2, 1]);
  return <motion.span style={{ opacity }}>{word}</motion.span>;
}

/** Words light up one by one as the paragraph scrolls through the viewport. */
function ScrollWords({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "end 0.6"],
  });
  const words = text.split(" ");

  return (
    <p ref={ref} className={className}>
      {reduceMotion
        ? text
        : words.map((word, i) => {
            const start = (i / words.length) * 0.8;
            return (
              <span key={i}>
                <Word
                  word={word}
                  range={[start, start + 0.2]}
                  progress={scrollYProgress}
                />{" "}
              </span>
            );
          })}
    </p>
  );
}

/* -------------------------------------------------------------------------- */
/*  Portrait                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Portrait with a pointer-driven tilt. The photo, the glare and the badge all
 * read from the same pointer position, so the layers move as one object.
 */
function TiltPortrait() {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spx = useSpring(px, { stiffness: 150, damping: 22 });
  const spy = useSpring(py, { stiffness: 150, damping: 22 });

  const rotateY = useTransform(spx, [-0.5, 0.5], [-7, 7]);
  const rotateX = useTransform(spy, [-0.5, 0.5], [7, -7]);

  // The photo slides slightly against the tilt; the badge floats toward the viewer
  const imageX = useTransform(spx, (v) => v * -16);
  const imageY = useTransform(spy, (v) => v * -12);
  const badgeX = useTransform(spx, (v) => v * 22);
  const badgeY = useTransform(spy, (v) => v * 16);

  const glareX = useTransform(spx, [-0.5, 0.5], ["10%", "90%"]);
  const glareY = useTransform(spy, [-0.5, 0.5], ["10%", "90%"]);
  const glare = useMotionTemplate`radial-gradient(240px circle at ${glareX} ${glareY}, rgba(255,255,255,0.28), transparent 70%)`;
  const glareOpacity = useMotionValue(0);

  const handleMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (reduceMotion || e.pointerType !== "mouse" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    px.set(Math.min(0.5, Math.max(-0.5, (e.clientX - rect.left) / rect.width - 0.5)));
    py.set(Math.min(0.5, Math.max(-0.5, (e.clientY - rect.top) / rect.height - 0.5)));
  };

  const handleEnter = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (reduceMotion || e.pointerType !== "mouse") return;
    animate(glareOpacity, 1, { duration: 0.4 });
  };

  const handleLeave = () => {
    px.set(0);
    py.set(0);
    animate(glareOpacity, 0, { duration: 0.4 });
  };

  return (
    <motion.div
      variants={fadeUp}
      onPointerMove={handleMove}
      onPointerEnter={handleEnter}
      onPointerLeave={handleLeave}
      className="relative mx-auto w-full max-w-[380px]"
    >
      {/* Ambient glow behind the portrait */}
      <div
        aria-hidden
        className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-br from-honey/25 via-sage-light/10 to-transparent blur-2xl"
      />

      {/* Outline, drawn once when the portrait enters the viewport */}
      <svg
        aria-hidden
        className="pointer-events-none absolute -inset-4 h-[calc(100%+2rem)] w-[calc(100%+2rem)] overflow-visible text-evergreen"
      >
        <motion.rect
          x={0}
          y={0}
          width="100%"
          height="100%"
          rx={38}
          fill="none"
          stroke="currentColor"
          strokeWidth={1}
          initial={{ pathLength: reduceMotion ? 1 : 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.2 }}
          viewport={{ once: true }}
          transition={{ duration: 2.2, ease, delay: 0.3 }}
        />
      </svg>

      <div style={{ perspective: 1000 }}>
        <motion.div
          ref={ref}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] bg-sand shadow-[0_40px_80px_-30px_rgba(31,46,38,0.45)] ring-1 ring-black/5"
        >
          {/* Wipe-up reveal while the image settles from a slight zoom */}
          <div className="absolute inset-0">
  <Image
    src="/veena-mam3.webp"
    alt={`${business.coachName}, ${business.coachTitle}`}
    fill
    priority
    sizes="(max-width: 1024px) 80vw, 380px"
    className="object-contain object-center"
  />
</div>

          {!reduceMotion && (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{ background: glare, opacity: glareOpacity }}
            />
          )}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-evergreen-dark/25 via-transparent to-transparent" />
        </motion.div>
      </div>

      {/* Credential badge: parallax on the wrapper, entrance and hover inside */}
      <motion.div
        style={{ x: badgeX, y: badgeY }}
        className="absolute -right-5 -top-5 sm:-right-8 sm:-top-8"
      >
        <motion.div
          initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.6, rotate: reduceMotion ? 0 : -8 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 160, damping: 14, delay: 0.7 }}
          whileHover={reduceMotion ? undefined : { rotate: 8, scale: 1.06 }}
          className="relative flex h-24 w-24 flex-col items-center justify-center rounded-full bg-evergreen text-center shadow-lg sm:h-28 sm:w-28"
        >
          <span
            aria-hidden
            className="absolute inset-1.5 rounded-full border border-cream/20"
          />
          <span className="font-display text-lg text-sage-light sm:text-xl">
            1:1
          </span>
          <span className="px-2 text-[10px] leading-tight text-cream/70">
            coaching focus
          </span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Focus card                                                                */
/* -------------------------------------------------------------------------- */

/** Card with a warm light that follows the cursor across its surface. */
function FocusCard({ icon: Icon, title, copy }: (typeof FOCUS_AREAS)[number]) {
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const glow = useMotionTemplate`radial-gradient(180px circle at ${x}px ${y}px, rgba(240,200,120,0.22), transparent 70%)`;

  const handleMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (reduceMotion || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
  };

  return (
    <motion.div
      variants={fadeUp}
      onPointerMove={handleMove}
      whileHover={reduceMotion ? undefined : { y: -4 }}
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative overflow-hidden rounded-xl border border-evergreen/10 bg-white/60 p-4 transition-[border-color,background-color,box-shadow] duration-300 hover:border-evergreen/20 hover:bg-white/90 hover:shadow-[0_18px_36px_-22px_rgba(31,46,38,0.35)]"
    >
      <motion.div
        aria-hidden
        style={{ background: glow }}
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      <div className="relative">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-evergreen/[0.08] transition-colors duration-300 group-hover:bg-honey/25">
          <Icon
            size={15}
            className="text-evergreen transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-[14deg] motion-reduce:transition-none"
          />
        </div>
        <p className="mt-3 font-display text-xl text-evergreen">{title}</p>
        <p className="mt-1 text-[13px] text-moss">{copy}</p>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  About                                                                     */
/* -------------------------------------------------------------------------- */

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  // The two background blooms drift in opposite directions as the section scrolls
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bloomA = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [-50, 50]);
  const bloomB = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [50, -50]);

  const [lead, ...rest] = business.about.slice(1);

  return (
    // `isolate` gives the section its own stacking context so the -z-10
    // blooms sit above the cream background instead of behind it.
    <section
      id="about"
      ref={sectionRef}
      className="relative isolate overflow-hidden section-pad bg-cream"
    >
      <motion.div
        aria-hidden
        style={{ y: bloomA }}
        className="pointer-events-none absolute -left-24 top-1/3 -z-10 h-72 w-72 rounded-full bg-honey/10 blur-3xl"
      />
      <motion.div
        aria-hidden
        style={{ y: bloomB }}
        className="pointer-events-none absolute -right-16 bottom-0 -z-10 h-64 w-64 rounded-full bg-evergreen/[0.06] blur-3xl"
      />

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="container-content grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-16"
      >
        <TiltPortrait />

        <div>
          <motion.div variants={fadeUp}>
            <SectionHeading
              title="Meet your wellness coach"
              description={`${business.coachName} — ${business.coachTitle}`}
            />
          </motion.div>

          <div className="mt-6 space-y-4">
            {lead && (
              <ScrollWords
                text={lead}
                className="text-[16px] leading-relaxed text-ink sm:text-[17px]"
              />
            )}
            {rest.map((para, i) => (
              <motion.p
                key={i}
                variants={fadeUp}
                className="text-[15px] leading-relaxed text-ink/75 sm:text-base"
              >
                {para}
              </motion.p>
            ))}
          </div>

          <motion.div
            variants={cardsStagger}
            className="mt-8 grid grid-cols-2 gap-4 sm:max-w-md"
          >
            {FOCUS_AREAS.map((area) => (
              <FocusCard key={area.title} {...area} />
            ))}
          </motion.div>

          <motion.div variants={fadeUp} className="mt-10">
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 rounded-full text-[15px] font-medium text-evergreen focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-evergreen/50 focus-visible:ring-offset-4 focus-visible:ring-offset-cream"
            >
              <span className="relative">
                Schedule My Wellness Session
                <span
                  aria-hidden
                  className="absolute inset-x-0 -bottom-1 h-px bg-evergreen/25"
                />
                <span
                  aria-hidden
                  className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-evergreen transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 motion-reduce:transition-none"
                />
              </span>
              <ArrowRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
              />
            </a>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}