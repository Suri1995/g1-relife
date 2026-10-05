"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import {
  HeartHandshake,
  Leaf,
  MessageCircleHeart,
  Smile,
  type LucideIcon,
} from "lucide-react";
import {
  MotionConfig,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { whyChooseUs } from "@/data/wellness";
import SectionHeading from "./SectionHeading";

/* -------------------------------------------------------------------------- */
/*  Content                                                                   */
/* -------------------------------------------------------------------------- */

const ICONS: LucideIcon[] = [Leaf, HeartHandshake, MessageCircleHeart, Smile];

type Reason = (typeof whyChooseUs)[number];

/* -------------------------------------------------------------------------- */
/*  Motion tokens                                                             */
/* -------------------------------------------------------------------------- */

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const STAGGER = 0.09; // seconds between columns

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

// Everything inside a card is sequenced from one `column` value, so a row
// reads left to right: card rises, icon pops, halo ripples once, text lands.
const reveal: Variants = {
  hidden: { opacity: 0, y: 36 },
  show: (column: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE, delay: column * STAGGER },
  }),
};

const tilePop: Variants = {
  hidden: { opacity: 0, scale: 0.5, rotate: -14 },
  show: (column: number) => ({
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 16,
      delay: 0.25 + column * STAGGER,
    },
  }),
};

const haloPulse: Variants = {
  hidden: { opacity: 0, scale: 1 },
  show: (column: number) => ({
    opacity: [0, 0.55, 0],
    scale: [1, 1.9, 2.3],
    transition: { duration: 1.3, ease: "easeOut", delay: 0.3 + column * STAGGER },
  }),
};

const textIn: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: (column: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE, delay: 0.2 + column * STAGGER },
  }),
};

// Border-only mask: reveals just a 1px ring of the gradient behind it.
const BORDER_ONLY_MASK: CSSProperties = {
  padding: 1,
  WebkitMask:
    "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
  WebkitMaskComposite: "xor",
  mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
  maskComposite: "exclude",
};

const SPOT_FILL: CSSProperties = {
  opacity: "var(--spot, 0)",
  background:
    "radial-gradient(340px circle at var(--mx, -999px) var(--my, -999px), rgba(212,175,55,0.13), transparent 70%)",
};

const SPOT_EDGE: CSSProperties = {
  ...BORDER_ONLY_MASK,
  opacity: "var(--spot, 0)",
  background:
    "radial-gradient(260px circle at var(--mx, -999px) var(--my, -999px), rgba(226,190,96,0.9), transparent 70%)",
};

/* -------------------------------------------------------------------------- */
/*  Hook: one spotlight shared by the whole row                               */
/* -------------------------------------------------------------------------- */

/**
 * The pointer listener sits on the grid and writes CSS variables onto each
 * `[data-spotlight]` card, so one glow can spill across card edges and React
 * never re-renders while the mouse moves.
 */
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

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        grid.style.setProperty("--spot", "1");
        paint(e.clientX, e.clientY);
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
/*  Card                                                                      */
/* -------------------------------------------------------------------------- */

function ReasonCard({
  item,
  icon: Icon,
  column,
  showHalo,
}: {
  item: Reason;
  icon: LucideIcon;
  column: number;
  showHalo: boolean;
}) {
  return (
    // <li> takes the sibling-dimming (CSS opacity), the inner div takes the
    // scroll reveal (framer opacity/transform), the <article> takes hover.
    // Separate layers, so none of them overwrite each other's inline styles.
    <li className="list-none transition-opacity duration-500 motion-reduce:transition-none">
      <motion.div
        variants={reveal}
        custom={column}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="h-full"
      >
        <article
          data-spotlight
          className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-evergreen/10 bg-white/70 p-6 backdrop-blur-sm transition-[transform,box-shadow] duration-500 ease-out hover:-translate-y-1.5 hover:shadow-[0_24px_50px_-20px_rgba(23,50,38,0.35)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-7"
        >
          <span
            aria-hidden
            style={SPOT_FILL}
            className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300"
          />
          <span
            aria-hidden
            style={SPOT_EDGE}
            className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300"
          />

          <div className="relative h-11 w-11">
            {showHalo && (
              <motion.span
                aria-hidden
                variants={haloPulse}
                custom={column}
                className="absolute inset-0 rounded-full bg-sage/30"
              />
            )}
            <motion.span
              variants={tilePop}
              custom={column}
              className="relative flex h-11 w-11 items-center justify-center rounded-full bg-sage/15 text-sage-dark transition-colors duration-300 group-hover:bg-evergreen group-hover:text-cream"
            >
              <Icon
                size={20}
                aria-hidden
                className="transition-transform duration-500 ease-out group-hover:-rotate-6 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:transform-none"
              />
            </motion.span>
          </div>

          <motion.h3
            variants={textIn}
            custom={column}
            className="relative mt-5 font-display text-lg leading-snug text-evergreen"
          >
            {item.title}
          </motion.h3>
          <motion.p
            variants={textIn}
            custom={column}
            className="relative mt-2 text-sm leading-relaxed text-moss"
          >
            {item.description}
          </motion.p>

          <span
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-honey via-honey/60 to-transparent transition-transform duration-500 ease-out group-hover:scale-x-100"
          />
        </article>
      </motion.div>
    </li>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section                                                                   */
/* -------------------------------------------------------------------------- */

export default function WhyChooseUs() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useGridSpotlight<HTMLUListElement>(!reduce);

  // One soft glow behind the heading, drifting slowly as the section scrolls.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const glowY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-60, 60]);

  return (
    <MotionConfig reducedMotion="user">
      {/* `isolate` gives the section its own stacking context so the glow can
          sit behind the content without disappearing behind the background. */}
      <section
        ref={sectionRef}
        className="section-pad relative isolate overflow-hidden bg-cream"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2"
        >
          <motion.div
            style={{ y: glowY }}
            className="h-80 w-[36rem] max-w-[90vw] rounded-full bg-honey/10 blur-3xl"
          />
        </div>

        <div className="container-content relative z-10">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
          >
            <SectionHeading
              title="Why people choose G1 RE-LIFE"
              align="center"
              description="A coaching relationship built on real support, not a generic program."
            />
          </motion.div>

          {/* On hover-capable screens, the cards you're not pointing at step back */}
          <ul
            ref={gridRef}
            className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6 [@media(hover:hover)]:[&:has(li:hover)>li:not(:hover)]:opacity-60">
            {whyChooseUs.map((item, i) => (
              <ReasonCard
                key={item.title}
                item={item}
                icon={ICONS[i % ICONS.length]}
                column={i % 4}
                showHalo={!reduce}
              />
            ))}
          </ul>
        </div>
      </section>
    </MotionConfig>
  );
}