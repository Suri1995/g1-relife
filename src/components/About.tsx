"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import { Leaf, Moon, Sparkles } from "lucide-react";
import { business } from "@/data/wellness";
import SectionHeading from "./SectionHeading";

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
  },
};

const FOCUS_AREAS = [
  {
    icon: Leaf,
    title: "Body",
    copy: "Nutrition & fitness plans",
  },
  {
    icon: Moon,
    title: "Mind",
    copy: "Stress & sleep support",
  },
] as const;

/**
 * Portrait with a subtle, pointer-driven tilt — the kind of quiet
 * interactive detail that reads as "premium" without being gimmicky.
 * Falls back to a static image gracefully on touch devices, since the
 * tilt only ever activates from a mouse-move event.
 */
function TiltPortrait() {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), {
    stiffness: 180,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-7, 7]), {
    stiffness: 180,
    damping: 20,
  });
  const glowX = useTransform(mx, [-0.5, 0.5], ["0%", "100%"]);
  const glowY = useTransform(my, [-0.5, 0.5], ["0%", "100%"]);
  const sweepBackground = useTransform(
    [glowX, glowY],
    (values: string[]) =>
      `radial-gradient(220px circle at ${values[0]} ${values[1]}, rgba(255,255,255,0.22), transparent 70%)`
  );

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div variants={fadeUp} className="relative mx-auto w-full max-w-[380px]">
      {/* Ambient blurred glow sitting behind the portrait */}
      <div
        aria-hidden
        className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-br from-honey/25 via-sage-light/10 to-transparent blur-2xl"
      />

      {/* Slowly rotating dashed ring — a quiet ambient loop */}
      <motion.div
        aria-hidden
        className="absolute -inset-4 rounded-[2.4rem] border border-dashed border-evergreen/15"
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      />

      <div style={{ perspective: 1000 }}>
        <motion.div
          ref={ref}
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-sand shadow-[0_40px_80px_-30px_rgba(31,46,38,0.45)] ring-1 ring-black/5"
        >
          <Image
            src={business.profileImage}
            alt={`${business.coachName}, ${business.coachTitle}`}
            fill
            sizes="(max-width: 1024px) 80vw, 380px"
            className="object-contain"
          />
          {/* Soft light sweep that tracks the cursor */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 hover:opacity-100"
            style={{ background: sweepBackground }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-evergreen-dark/25 via-transparent to-transparent" />
        </motion.div>
      </div>

      {/* Floating credential badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="absolute -right-5 -top-5 sm:-right-8 sm:-top-8"
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-evergreen text-center shadow-lg sm:h-28 sm:w-28"
        >
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

export default function About() {
  return (
    <section id="about" className="relative overflow-hidden section-pad bg-cream">
      {/* Ambient background accents */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-1/3 -z-10 h-72 w-72 rounded-full bg-honey/10 blur-3xl"
      />
      <div
        aria-hidden
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
          <motion.div
            variants={fadeUp}
            className="mb-4 inline-flex items-center gap-2 rounded-full bg-evergreen/[0.06] px-3.5 py-1.5"
          >
            <Sparkles size={13} className="text-honey-dark" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-moss">
              About your coach
            </span>
          </motion.div>

          <motion.div variants={fadeUp}>
            <SectionHeading
              title="Meet your wellness coach"
              description={`${business.coachName} — ${business.coachTitle}`}
            />
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-6 space-y-4 text-[15px] leading-relaxed text-ink/75 sm:text-base"
          >
            {business.about.slice(1).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-8 grid grid-cols-2 gap-4 sm:max-w-md"
          >
            {FOCUS_AREAS.map(({ icon: Icon, title, copy }) => (
              <motion.div
                key={title}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group rounded-xl border border-evergreen/10 bg-white/60 p-4 transition-colors duration-200 hover:border-evergreen/20 hover:bg-white/90"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-evergreen/[0.08] transition-colors duration-200 group-hover:bg-honey/20">
                  <Icon size={15} className="text-evergreen" />
                </div>
                <p className="mt-3 font-display text-xl text-evergreen">
                  {title}
                </p>
                <p className="mt-1 text-[13px] text-moss">{copy}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}