"use client";

import Image from "next/image";
import { useRef, useState, useCallback } from "react";
import { ArrowUpRight, Sparkles, TrendingUp, Users, Award } from "lucide-react";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
} from "framer-motion";
import { opportunity, business } from "@/data/wellness";

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.92, x: -40 },
  visible: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 20,
      duration: 1,
    },
  },
};

const contentVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// --- Floating Stat Card ---
function StatCard({
  icon: Icon,
  value,
  label,
  delay,
}: {
  icon: React.ElementType;
  value: string;
  label: string;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        delay,
        type: "spring",
        stiffness: 200,
        damping: 20,
      }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group flex items-center gap-3 rounded-2xl border border-cream/10 bg-cream/[0.04] px-4 py-3 backdrop-blur-sm transition-colors duration-300 hover:border-honey/30 hover:bg-cream/[0.07]"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-honey/15 text-honey transition-colors duration-300 group-hover:bg-honey/25">
        <Icon size={16} strokeWidth={2.25} />
      </div>
      <div className="min-w-0">
        <p className="font-display text-[15px] font-semibold leading-tight text-cream">
          {value}
        </p>
        <p className="text-[11px] uppercase tracking-wider text-cream/50">
          {label}
        </p>
      </div>
    </motion.div>
  );
}

// --- Main Component ---
export default function WellnessOpportunity() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  // 3D tilt effect for the image
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 150 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);

  // Parallax scroll
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.2, 0.5, 0.2]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!imageRef.current) return;
      const rect = imageRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX.set(x);
      mouseY.set(y);
    },
    [mouseX, mouseY]
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  return (
    <section
      ref={sectionRef}
      className="section-pad relative overflow-hidden bg-[var(--Primary)]"
    >
      {/* Ambient background glows */}
      <motion.div
        className="pointer-events-none absolute -left-40 top-1/4 h-[500px] w-[500px] rounded-full bg-honey/10 blur-[120px]"
        style={{ opacity: glowOpacity }}
      />
      <motion.div
        className="pointer-events-none absolute -right-40 bottom-1/4 h-[400px] w-[400px] rounded-full bg-emerald-400/5 blur-[100px]"
        animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container-content relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="relative grid items-center gap-10 overflow-hidden rounded-[2rem] bg-[var(--Dark)] p-6 grain sm:p-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14 lg:p-14"
        >
          {/* Subtle animated border glow */}
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-[2rem]"
            style={{
              background:
                "radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(212, 175, 55, 0.08), transparent 40%)",
            }}
          />

          {/* Decorative corner accents */}
          <div className="pointer-events-none absolute left-6 top-6 h-8 w-8 border-l border-t border-honey/20" />
          <div className="pointer-events-none absolute bottom-6 right-6 h-8 w-8 border-b border-r border-honey/20" />

          {/* ---- Image Column ---- */}
          <motion.div
            variants={imageVariants}
            style={{ y: parallaxY }}
            className="relative"
          >
            <motion.div
              ref={imageRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
                perspective: 1000,
              }}
              className="group relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-2xl shadow-black/40"
            >
              <Image
                src={opportunity.image}
                alt={opportunity.title}
                fill
                sizes="(max-width: 1024px) 90vw, 480px"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-evergreen-dark/70 via-transparent to-transparent" />

              {/* Shine sweep on hover */}
              <motion.div
                className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100"
                initial={false}
                transition={{ duration: 0.6 }}
              >
                <motion.div
                  className="absolute -inset-full h-full w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  animate={{ x: ["-200%", "300%"] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 3,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>

              {/* Floating badge on image */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full border border-white/15 bg-evergreen-dark/70 px-3.5 py-1.5 backdrop-blur-md"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-honey opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-honey" />
                </span>
                <span className="text-[11px] font-medium uppercase tracking-wider text-cream/90">
                  Now accepting partners
                </span>
              </motion.div>
            </motion.div>

            {/* Decorative floating element */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={isInView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
              transition={{ delay: 0.6, type: "spring", stiffness: 150 }}
              className="absolute -right-3 -top-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-honey/30 bg-evergreen-dark/90 backdrop-blur-md sm:-right-4 sm:-top-4 sm:h-16 sm:w-16"
            >
              <Sparkles className="text-honey" size={22} />
            </motion.div>
          </motion.div>

          {/* ---- Content Column ---- */}
          <motion.div variants={contentVariants} className="relative">
            <motion.span
              variants={itemVariants}
              className="group inline-flex items-center gap-2 rounded-full border border-honey/40 bg-honey/5 px-4 py-1.5 text-[13px] font-medium text-honey-light backdrop-blur-sm"
            >
              <Sparkles
                size={13}
                className="transition-transform duration-300 group-hover:rotate-12"
              />
              Wellness opportunity
            </motion.span>

            <motion.h2
              variants={itemVariants}
              className="mt-5 font-display text-[clamp(1.6rem,3vw,2.35rem)] leading-[1.15] text-cream"
            >
              {opportunity.title}
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="mt-4 max-w-lg text-[15px] leading-relaxed text-cream/70 sm:text-base"
            >
              {opportunity.description}
            </motion.p>

            {/* Stats row */}
            <motion.div
              variants={itemVariants}
              className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3"
            >
              <StatCard
                icon={TrendingUp}
                value="4.2×"
                label="Growth"
                delay={0.5}
              />
              <StatCard
                icon={Users}
                value="2.5K+"
                label="Partners"
                delay={0.6}
              />
              <StatCard
                icon={Award}
                value="98%"
                label="Retention"
                delay={0.7}
              />
            </motion.div>

            {/* CTA Button */}
            <motion.div variants={itemVariants} className="mt-8">
              <motion.a
                href={business.whatsapp}
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-honey px-6 py-3.5 text-[14px] font-semibold text-evergreen-dark shadow-lg shadow-honey/20 transition-shadow duration-300 hover:shadow-xl hover:shadow-honey/30"
              >
                {/* Button shine */}
                <motion.span
                  className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 2.5,
                    ease: "easeInOut",
                  }}
                />
                <span className="relative z-10">
                  Learn about this opportunity
                </span>
                <motion.span
                  className="relative z-10"
                  initial={{ x: 0, y: 0 }}
                  whileHover={{ x: 3, y: -3 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  <ArrowUpRight size={16} strokeWidth={2.5} />
                </motion.span>
              </motion.a>

              {/* Trust indicator */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 1.1, duration: 0.5 }}
                className="mt-3 text-[12px] text-cream/40"
              >
                Free consultation · No commitment required
              </motion.p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}