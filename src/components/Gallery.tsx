
"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  MotionConfig,
  useReducedMotion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  type Variants,
} from "framer-motion";

import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Expand,
  Images,
  Sparkles,
} from "lucide-react";

import { business, gallery } from "@/data/wellness";
import SectionHeading from "./SectionHeading";

const GalleryLightbox = dynamic(() => import("./GalleryLightbox"));

const PREVIEW_COUNT = 5;

const EASE = [0.22, 1, 0.36, 1] as const;

/* -------------------------------------------------------------------------- */
/*  Animation variants                                                         */
/* -------------------------------------------------------------------------- */

const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
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

const imageReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 35,
    scale: 0.96,
  },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      delay: i * 0.1,
      ease: EASE,
    },
  }),
};

/* -------------------------------------------------------------------------- */
/*  Spotlight effect                                                           */
/* -------------------------------------------------------------------------- */

function useGallerySpotlight(enabled: boolean) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;

    if (!element || !enabled) return;

    let frame = 0;

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;

      cancelAnimationFrame(frame);

      frame = requestAnimationFrame(() => {
        const rect = element.getBoundingClientRect();

        element.style.setProperty(
          "--mouse-x",
          `${event.clientX - rect.left}px`
        );

        element.style.setProperty(
          "--mouse-y",
          `${event.clientY - rect.top}px`
        );

        element.style.setProperty("--spot-opacity", "1");
      });
    };

    const onLeave = () => {
      cancelAnimationFrame(frame);
      element.style.setProperty("--spot-opacity", "0");
    };

    element.addEventListener("pointermove", onMove);
    element.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(frame);
      element.removeEventListener("pointermove", onMove);
      element.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled]);

  return ref;
}

/* -------------------------------------------------------------------------- */
/*  Premium gallery image                                                      */
/* -------------------------------------------------------------------------- */

function GalleryImage({
  src,
  imageIndex,
  featured = false,
  onClick,
  reduceMotion,
}: {
  src: string;
  imageIndex: number;
  featured?: boolean;
  onClick: () => void;
  reduceMotion: boolean;
}) {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const smoothX = useSpring(rotateX, {
    stiffness: 160,
    damping: 22,
  });

  const smoothY = useSpring(rotateY, {
    stiffness: 160,
    damping: 22,
  });

  const handlePointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (reduceMotion || event.pointerType !== "mouse") return;

    const rect = event.currentTarget.getBoundingClientRect();

    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    rotateY.set((x - 0.5) * 3);
    rotateX.set((0.5 - y) * 3);
  };

  const resetTilt = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.button
      type="button"
      onClick={onClick}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      style={
        reduceMotion
          ? undefined
          : {
              rotateX: smoothX,
              rotateY: smoothY,
              transformPerspective: 1200,
            }
      }
      aria-label={`Open gallery image ${imageIndex + 1}`}
      className={`group relative isolate block w-full overflow-hidden bg-[#E8E5D9] text-left outline-none focus-visible:ring-2 focus-visible:ring-evergreen focus-visible:ring-offset-4 ${
        featured
          ? "aspect-[16/10] rounded-[24px] sm:aspect-[16/8] lg:aspect-[16/7]"
          : "aspect-[4/5] rounded-[18px] sm:rounded-[22px]"
      }`}
    >
      {/* Main image */}
      <Image
        src={src}
        alt={`G1 RE-LIFE Wellness Zone gallery photo ${imageIndex + 1}`}
        fill
        priority={featured}
        sizes={
          featured
            ? "(max-width: 1024px) 100vw, 1200px"
            : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        }
        className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07]"
      />

      {/* Image overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#071B12]/65 via-[#071B12]/5 to-[#071B12]/10 opacity-80 transition-opacity duration-700 group-hover:opacity-100" />

      {/* Top brand label */}
      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4 sm:p-6">
        <span className="border border-white/35 bg-evergreen-dark/20 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.23em] text-white backdrop-blur-md">
          G1 RE-LIFE
        </span>

        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-white/10 text-white backdrop-blur-md transition-all duration-500 group-hover:rotate-45 group-hover:bg-cream group-hover:text-evergreen">
          <ArrowUpRight size={16} />
        </span>
      </div>

      {/* Featured image content */}
      {featured && (
        <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end p-5 text-left sm:p-8 lg:p-10">
          <motion.div
            initial={false}
            className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.25em] text-white/75"
          >
            <Sparkles size={13} />
            Inside our wellness space
          </motion.div>

          <h3 className="mt-3 max-w-2xl font-display text-2xl leading-tight text-white sm:text-3xl lg:text-5xl">
            Experience wellness.
            <br />
            Embrace a better you.
          </h3>

          <p className="mt-3 max-w-lg text-xs leading-6 text-white/75 sm:text-sm">
            {business.name} — a space dedicated to your wellness journey.
          </p>

          <div className="mt-5 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 transition-all duration-500 group-hover:bg-white group-hover:text-evergreen">
              <Expand size={15} />
            </span>
            Explore gallery
          </div>
        </div>
      )}

      {/* Small image label */}
      {!featured && (
        <>
          <div className="absolute inset-0 bg-evergreen-dark/0 transition-colors duration-500 group-hover:bg-evergreen-dark/20" />

          <span className="absolute bottom-3 left-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 sm:bottom-5 sm:left-5">
            G1 RE-LIFE
          </span>

          <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white opacity-0 shadow-lg backdrop-blur-md transition-all duration-500 group-hover:rotate-45 group-hover:scale-100 group-hover:opacity-100 sm:bottom-5 sm:right-5">
            <Expand size={15} />
          </span>
        </>
      )}

      {/* Refined hover border */}
      <span className="pointer-events-none absolute inset-3 rounded-[15px] border border-white/0 transition-all duration-700 group-hover:inset-4 group-hover:border-white/35 sm:rounded-[18px]" />
    </motion.button>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main gallery                                                               */
/* -------------------------------------------------------------------------- */

export default function Gallery() {
  const [index, setIndex] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  const reduceMotion = useReducedMotion() ?? false;

  const spotlightRef = useGallerySpotlight(!reduceMotion);

  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const glowY = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? [0, 0] : [-55, 55]
  );

  const visibleImages = showAll
    ? gallery
    : gallery.slice(0, PREVIEW_COUNT);

  const [featured, ...remaining] = visibleImages;

  return (
    <MotionConfig reducedMotion="user">
      <section
        id="gallery"
        ref={sectionRef}
        className="relative isolate overflow-hidden bg-[#F5F3EB] py-20 sm:py-24 lg:py-32"
      >
        {/* Background decoration */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <motion.div
            style={{ y: glowY }}
            className="absolute -right-40 top-10 h-[450px] w-[450px] rounded-full bg-honey/[0.09] blur-[110px]"
          />

          <div className="absolute -left-40 bottom-0 h-[400px] w-[400px] rounded-full bg-sage/[0.10] blur-[110px]" />

          <div className="absolute right-[12%] top-[20%] h-64 w-64 rounded-full border border-evergreen/[0.06]" />
          <div className="absolute right-[15%] top-[23%] h-48 w-48 rounded-full border border-evergreen/[0.06]" />
        </div>

        <div className="container-content relative z-10">
          {/* Heading */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="mx-auto max-w-3xl"
          >
            <div className="mb-5 flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-honey" />

              <span className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-evergreen/65">
                <Images size={13} />
                Life at G1 RE-LIFE
              </span>

              <span className="h-px w-8 bg-honey" />
            </div>

            <SectionHeading
              title="A glimpse into the wellness zone"
              align="center"
              description="Step inside our space and discover the moments, experiences, and connections that make every wellness journey special."
            />
          </motion.div>

          {/* Gallery introduction */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mt-12 flex flex-col justify-between gap-5 border-y border-evergreen/15 py-5 sm:flex-row sm:items-center"
          >
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-evergreen/50">
                A closer look
              </p>

              <p className="mt-1 text-sm text-evergreen/80">
                Moments that make our community.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-medium uppercase tracking-[0.15em] text-evergreen/45">
                {String(gallery.length).padStart(2, "0")} Photographs
              </span>

              <span className="h-1 w-1 rounded-full bg-honey" />

              <span className="text-xs font-medium uppercase tracking-[0.15em] text-evergreen/45">
                Our journey
              </span>
            </div>
          </motion.div>

          {/* Main gallery */}
          <div ref={spotlightRef} className="relative mt-8">
            <AnimatePresence mode="popLayout">
              {featured && (
                <motion.div
                  key={featured}
                  layout
                  variants={fadeUp}
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0, scale: 0.96 }}
                  className="relative"
                >
                  <GalleryImage
                    src={featured}
                    imageIndex={0}
                    featured
                    onClick={() => setIndex(0)}
                    reduceMotion={reduceMotion}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Supporting image composition */}
            <motion.div
              layout
              variants={{
                hidden: {},
                show: {
                  transition: {
                    staggerChildren: 0.1,
                    delayChildren: 0.15,
                  },
                },
              }}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.1 }}
              className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5"
            >
              <AnimatePresence mode="popLayout">
                {remaining.map((src, i) => {
                  const imageIndex = i + 1;

                  return (
                    <motion.div
                      key={src}
                      layout
                      variants={imageReveal}
                      custom={i}
                      initial="hidden"
                      animate="show"
                      exit={{
                        opacity: 0,
                        scale: 0.92,
                        transition: { duration: 0.25 },
                      }}
                      className="min-w-0"
                    >
                      <GalleryImage
                        src={src}
                        imageIndex={imageIndex}
                        onClick={() => setIndex(imageIndex)}
                        reduceMotion={reduceMotion}
                      />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Gallery action */}
          {gallery.length > PREVIEW_COUNT && (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="mt-12 flex flex-col items-center"
            >
              <motion.button
                type="button"
                onClick={() => {
                  setShowAll((current) => !current);
                  setIndex(null);
                }}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.96 }}
                className="group relative inline-flex items-center gap-8 overflow-hidden rounded-full bg-evergreen px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.15em] text-cream shadow-[0_12px_30px_rgba(24,55,39,0.15)] transition-all duration-500 hover:shadow-[0_18px_40px_rgba(24,55,39,0.24)]"
              >
                <span className="relative z-10">
                  {showAll ? "View fewer photos" : "Explore full gallery"}
                </span>

                <span className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 transition-all duration-500 group-hover:rotate-45 group-hover:bg-cream group-hover:text-evergreen">
                  {showAll ? (
                    <ArrowDown size={16} />
                  ) : (
                    <ArrowRight size={16} />
                  )}
                </span>

                <span className="absolute inset-0 translate-y-full bg-evergreen-dark transition-transform duration-500 group-hover:translate-y-0" />
              </motion.button>

              <p className="mt-4 text-[9px] font-medium uppercase tracking-[0.25em] text-evergreen/40">
                {showAll
                  ? "You are viewing the complete gallery"
                  : `${gallery.length - PREVIEW_COUNT} more moments to discover`}
              </p>
            </motion.div>
          )}
        </div>

        {/* Lightbox */}
        <GalleryLightbox
          images={gallery}
          index={index}
          onClose={() => setIndex(null)}
          onNavigate={setIndex}
        />
      </section>
    </MotionConfig>
  );
}
