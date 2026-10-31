
"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import {
  HeartHandshake,
  Leaf,
  MessageCircleHeart,
  Smile,
  ArrowUpRight,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import {
  MotionConfig,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  type Variants,
} from "framer-motion";

import { whyChooseUs } from "@/data/wellness";
import SectionHeading from "./SectionHeading";

/* -------------------------------------------------------------------------- */
/*  Content                                                                    */
/* -------------------------------------------------------------------------- */

const ICONS: LucideIcon[] = [
  Leaf,
  HeartHandshake,
  MessageCircleHeart,
  Smile,
];

type Reason = (typeof whyChooseUs)[number];

const EASE = [0.22, 1, 0.36, 1] as const;

/* -------------------------------------------------------------------------- */
/*  Animation variants                                                         */
/* -------------------------------------------------------------------------- */

const sectionReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 35,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.85,
      ease: EASE,
    },
  },
};

const cardReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 55,
    scale: 0.96,
  },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.85,
      delay: i * 0.12,
      ease: EASE,
    },
  }),
};

const iconReveal: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.65,
    rotate: -15,
  },
  show: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 220,
      damping: 15,
      delay: 0.2,
    },
  },
};

const spotlightReveal: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.7,
  },
  show: {
    opacity: [0, 0.5, 0],
    scale: [0.7, 1.5, 2],
    transition: {
      duration: 1.4,
      ease: "easeOut",
    },
  },
};

/* -------------------------------------------------------------------------- */
/*  Spotlight styles                                                           */
/* -------------------------------------------------------------------------- */

const BORDER_MASK: CSSProperties = {
  padding: 1,
  WebkitMask:
    "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
  WebkitMaskComposite: "xor",
  mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
  maskComposite: "exclude",
};

const SPOTLIGHT_FILL: CSSProperties = {
  opacity: "var(--spot, 0)",
  background:
    "radial-gradient(300px circle at var(--mx, -999px) var(--my, -999px), rgba(190,157,87,0.13), transparent 70%)",
};

const SPOTLIGHT_BORDER: CSSProperties = {
  ...BORDER_MASK,
  opacity: "var(--spot, 0)",
  background:
    "radial-gradient(220px circle at var(--mx, -999px) var(--my, -999px), rgba(190,157,87,0.85), transparent 70%)",
};

/* -------------------------------------------------------------------------- */
/*  Interactive grid spotlight                                                 */
/* -------------------------------------------------------------------------- */

function useGridSpotlight<T extends HTMLElement>(enabled: boolean) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const grid = ref.current;

    if (!grid || !enabled) return;

    let frame = 0;

    const paint = (x: number, y: number) => {
      grid.querySelectorAll<HTMLElement>("[data-spotlight]").forEach((card) => {
        const rect = card.getBoundingClientRect();

        card.style.setProperty("--mx", `${x - rect.left}px`);
        card.style.setProperty("--my", `${y - rect.top}px`);
      });
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;

      cancelAnimationFrame(frame);

      frame = requestAnimationFrame(() => {
        grid.style.setProperty("--spot", "1");
        paint(event.clientX, event.clientY);
      });
    };

    const onLeave = () => {
      cancelAnimationFrame(frame);
      grid.style.setProperty("--spot", "0");
    };

    grid.addEventListener("pointermove", onMove);
    grid.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(frame);
      grid.removeEventListener("pointermove", onMove);
      grid.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled]);

  return ref;
}

/* -------------------------------------------------------------------------- */
/*  Individual reason card                                                     */
/* -------------------------------------------------------------------------- */

function ReasonCard({
  item,
  icon: Icon,
  index,
  reduceMotion,
}: {
  item: Reason;
  icon: LucideIcon;
  index: number;
  reduceMotion: boolean;
}) {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const smoothRotateX = useSpring(rotateX, {
    stiffness: 160,
    damping: 20,
    mass: 0.5,
  });

  const smoothRotateY = useSpring(rotateY, {
    stiffness: 160,
    damping: 20,
    mass: 0.5,
  });

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (reduceMotion || event.pointerType !== "mouse") return;

    const rect = event.currentTarget.getBoundingClientRect();

    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    rotateY.set((x - 0.5) * 5);
    rotateX.set((0.5 - y) * 5);
  };

  const resetTilt = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.li
      variants={cardReveal}
      custom={index}
      className="group relative list-none"
      style={
        reduceMotion
          ? undefined
          : {
              rotateX: smoothRotateX,
              rotateY: smoothRotateY,
              transformPerspective: 1000,
            }
      }
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
    >
      <article
        data-spotlight
        className="relative flex h-full min-h-[285px] flex-col overflow-hidden rounded-[24px] border border-evergreen/[0.10] bg-white/75 p-6 shadow-[0_8px_35px_rgba(24,55,39,0.035)] backdrop-blur-xl transition-all duration-700 ease-out group-hover:-translate-y-2 group-hover:border-evergreen/20 group-hover:bg-white group-hover:shadow-[0_25px_65px_-25px_rgba(24,55,39,0.24)] sm:min-h-[310px] sm:p-7 lg:p-8"
      >
        {/* Spotlight background */}
        <span
          aria-hidden
          style={SPOTLIGHT_FILL}
          className="pointer-events-none absolute inset-0 rounded-[24px] transition-opacity duration-300"
        />

        {/* Spotlight border */}
        <span
          aria-hidden
          style={SPOTLIGHT_BORDER}
          className="pointer-events-none absolute inset-0 rounded-[24px] transition-opacity duration-300"
        />

        {/* Decorative watermark number */}
        <span
          aria-hidden
          className="pointer-events-none absolute -right-2 -top-8 select-none font-display text-[110px] font-semibold leading-none text-evergreen/[0.035] transition-all duration-700 group-hover:-translate-y-2 group-hover:text-evergreen/[0.07] sm:text-[130px]"
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Card top section */}
        <div className="relative z-10 flex items-start justify-between">
          <div className="relative flex h-[58px] w-[58px] items-center justify-center rounded-[19px] border border-evergreen/10 bg-sage/[0.10] text-evergreen transition-all duration-500 group-hover:scale-105 group-hover:rounded-[50%] group-hover:border-evergreen group-hover:bg-evergreen group-hover:text-cream">
            <motion.span
              variants={iconReveal}
              className="flex items-center justify-center"
            >
              <Icon
                size={24}
                strokeWidth={1.5}
                aria-hidden
                className="transition-transform duration-500 group-hover:rotate-[-8deg]"
              />
            </motion.span>

            {/* Icon halo */}
            {!reduceMotion && (
              <motion.span
                variants={spotlightReveal}
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-full border border-honey/50"
              />
            )}
          </div>

          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-evergreen/10 text-evergreen/35 transition-all duration-500 group-hover:rotate-45 group-hover:border-evergreen group-hover:bg-evergreen group-hover:text-cream">
            <ArrowUpRight size={17} strokeWidth={1.5} />
          </span>
        </div>

        {/* Card content */}
        <div className="relative z-10 mt-auto pt-9">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-px w-5 bg-honey transition-all duration-500 group-hover:w-9" />

            <span className="text-[9px] font-semibold uppercase tracking-[0.24em] text-evergreen/45">
              Our difference
            </span>
          </div>

          <h3 className="font-display text-xl leading-snug tracking-tight text-evergreen transition-transform duration-500 group-hover:translate-x-1 sm:text-[22px]">
            {item.title}
          </h3>

          <p className="mt-3 max-w-[340px] text-[13px] leading-[1.9] text-moss/85 sm:text-sm">
            {item.description}
          </p>
        </div>

        {/* Bottom animated accent */}
        <span
          aria-hidden
          className="absolute bottom-0 left-0 h-[3px] w-full origin-left scale-x-0 bg-gradient-to-r from-evergreen via-honey to-transparent transition-transform duration-700 ease-out group-hover:scale-x-100"
        />

        {/* Soft inner highlight */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-[1px] rounded-[23px] border border-white/70 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
      </article>
    </motion.li>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main section                                                               */
/* -------------------------------------------------------------------------- */

export default function WhyChooseUs() {
  const reduceMotion = useReducedMotion() ?? false;

  const sectionRef = useRef<HTMLElement>(null);

  const gridRef = useGridSpotlight(!reduceMotion);

  // Subtle background movement tied to scroll.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const glowY = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? [0, 0] : [-75, 75]
  );

  const glowScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    reduceMotion ? [1, 1, 1] : [0.85, 1.15, 0.9]
  );

  return (
    <MotionConfig reducedMotion="user">
      <section
        ref={sectionRef}
        className="section-pad relative isolate overflow-hidden bg-cream"
      >
        {/* Ambient background */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <motion.div
            style={{
              y: glowY,
              scale: glowScale,
            }}
            className="absolute -right-40 top-10 h-[450px] w-[450px] rounded-full bg-honey/[0.08] blur-[100px]"
          />

          <div className="absolute -left-40 bottom-0 h-[400px] w-[400px] rounded-full bg-sage/[0.10] blur-[110px]" />

          <div className="absolute inset-0 opacity-[0.025] [background-image:radial-gradient(#1D4935_0.7px,transparent_0.7px)] [background-size:22px_22px]" />
        </div>

        <div className="container-content relative z-10">
          {/* Editorial header */}
          <motion.div
            variants={sectionReveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-90px" }}
            className="mx-auto max-w-3xl"
          >
            <div className="mb-5 flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-honey" />

              <span className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-evergreen/65">
                <Sparkles size={13} />
                The G1 difference
              </span>

              <span className="h-px w-8 bg-honey" />
            </div>

            <SectionHeading
              title="Why people choose G1 RE-LIFE"
              align="center"
              description="A coaching relationship built on real support, personal attention, and sustainable wellness — never a one-size-fits-all approach."
            />
          </motion.div>

          {/* Small editorial divider */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2, ease: EASE }}
            className="mx-auto mt-10 h-px max-w-[180px] origin-center bg-gradient-to-r from-transparent via-evergreen/25 to-transparent"
          />

          {/* Cards */}
          <motion.ul
            ref={gridRef}
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.12,
                  delayChildren: 0.15,
                },
              },
            }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.12 }}
            className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-6 [@media(hover:hover)]:[&:has(li:hover)>li:not(:hover)]:opacity-70"
          >
            {whyChooseUs.map((item, i) => (
              <ReasonCard
                key={item.title}
                item={item}
                icon={ICONS[i % ICONS.length]}
                index={i}
                reduceMotion={reduceMotion}
              />
            ))}
          </motion.ul>

          {/* Closing brand statement */}
          <motion.div
            variants={sectionReveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
            className="mt-14 flex flex-col items-center justify-center gap-3 text-center"
          >
            <div className="flex items-center gap-2 text-honey">
              <span className="h-px w-8 bg-honey/60" />
              <Sparkles size={14} />
              <span className="h-px w-8 bg-honey/60" />
            </div>

            <p className="font-display text-lg italic text-evergreen/80 sm:text-xl">
              Your wellness journey deserves a personal touch.
            </p>
          </motion.div>
        </div>
      </section>
    </MotionConfig>
  );
}
